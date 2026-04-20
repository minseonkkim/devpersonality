import asyncio
from datetime import datetime
import httpx

GITHUB_API = "https://api.github.com"
OAUTH_TOKEN_URL = "https://github.com/login/oauth/access_token"


async def exchange_code_for_token(code: str, client_id: str, client_secret: str) -> str:
    async with httpx.AsyncClient() as client:
        res = await client.post(
            OAUTH_TOKEN_URL,
            headers={"Accept": "application/json"},
            data={"client_id": client_id, "client_secret": client_secret, "code": code},
        )
        res.raise_for_status()
        token = res.json().get("access_token")
        if not token:
            raise ValueError("No access_token in response")
        return token


async def fetch_github_data(token: str) -> dict:
    headers = {"Authorization": f"Bearer {token}", "Accept": "application/vnd.github+json"}

    async with httpx.AsyncClient(headers=headers, timeout=20.0) as client:
        user_res = await client.get(f"{GITHUB_API}/user")
        user_res.raise_for_status()
        user = user_res.json()
        username = user["login"]

        repos_res = await client.get(
            f"{GITHUB_API}/users/{username}/repos",
            params={"type": "owner", "per_page": 100, "sort": "pushed"},
        )
        repos = repos_res.json() if repos_res.is_success else []

        events_res = await client.get(
            f"{GITHUB_API}/users/{username}/events/public",
            params={"per_page": 100},
        )
        events = events_res.json() if events_res.is_success else []

        # 커밋 URL 최대 10개 수집 (rate limit 고려)
        commit_urls: list[str] = []
        for event in events:
            if event.get("type") != "PushEvent":
                continue
            for commit in event.get("payload", {}).get("commits", []):
                url = commit.get("url")
                if url:
                    commit_urls.append(url)
                if len(commit_urls) >= 10:
                    break
            if len(commit_urls) >= 10:
                break

        async def fetch_commit_size(url: str) -> int | None:
            try:
                res = await client.get(url)
                if res.is_success:
                    stats = res.json().get("stats", {})
                    return stats.get("additions", 0) + stats.get("deletions", 0)
            except Exception:
                pass
            return None

        commit_sizes_raw = await asyncio.gather(*[fetch_commit_size(u) for u in commit_urls])
        commit_sizes = [s for s in commit_sizes_raw if s is not None]

    return {"user": user, "repos": repos, "events": events, "commit_sizes": commit_sizes}


def extract_signals(data: dict) -> dict:
    repos: list = data["repos"]
    events: list = data["events"]
    commit_sizes: list[int] = data.get("commit_sizes", [])

    push_events = [e for e in events if e.get("type") == "PushEvent"]
    commit_hours = []
    commit_days = set()
    total_commits = 0
    commit_messages: list[str] = []

    for event in push_events:
        created_at = event.get("created_at", "")
        try:
            dt = datetime.fromisoformat(created_at.replace("Z", "+00:00"))
            commit_hours.append(dt.hour)
            commit_days.add(dt.date())
        except ValueError:
            pass
        commits = event.get("payload", {}).get("commits", [])
        total_commits += len(commits)
        for commit in commits:
            msg = commit.get("message", "").lower().strip()
            if msg:
                commit_messages.append(msg)

    night_ratio = sum(1 for h in commit_hours if h >= 22 or h < 6) / max(len(commit_hours), 1)
    active_days = len(commit_days)

    languages: dict[str, int] = {}
    fork_count = 0
    for repo in repos:
        lang = repo.get("language")
        if lang:
            languages[lang] = languages.get(lang, 0) + 1
        if repo.get("fork"):
            fork_count += 1

    fork_ratio = fork_count / max(len(repos), 1)
    lang_count = len(languages)
    top_langs = sorted(languages, key=lambda l: languages[l], reverse=True)[:3]
    is_data_scientist = any(l in ("Python", "Jupyter Notebook", "R") for l in top_langs)
    total_repos = len(repos)
    avg_stars = sum(r.get("stargazers_count", 0) for r in repos) / max(total_repos, 1)

    avg_commit_size = sum(commit_sizes) / len(commit_sizes) if commit_sizes else 0

    # 커밋 메시지 패턴 분류
    n = max(len(commit_messages), 1)

    def msg_ratio(*keywords: str) -> float:
        return sum(
            1 for m in commit_messages
            if any(m.startswith(k) or f": {k}" in m or f" {k}" in m for k in keywords)
        ) / n

    return {
        "active_days": active_days,
        "total_commits": total_commits,
        "night_ratio": night_ratio,
        "fork_ratio": fork_ratio,
        "lang_count": lang_count,
        "top_langs": top_langs,
        "is_data_scientist": is_data_scientist,
        "total_repos": total_repos,
        "avg_stars": avg_stars,
        "avg_commit_size": avg_commit_size,
        "msg_feat_ratio":       msg_ratio("feat", "add", "implement", "create", "new"),
        "msg_fix_ratio":        msg_ratio("fix", "bug", "patch", "hotfix"),
        "msg_refactor_ratio":   msg_ratio("refactor", "restructure", "clean", "rename", "reorganize"),
        "msg_chore_ratio":      msg_ratio("chore", "docs", "test", "style", "ci", "lint", "format"),
        "msg_experiment_ratio": msg_ratio("wip", "experiment", "try", "hack", "temp", "draft", "poc"),
    }
