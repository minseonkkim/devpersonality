TYPES = ["gardener", "sprinter", "architect", "hacker", "researcher", "craftsman", "explorer", "builder"]


def score(signals: dict) -> dict[str, float]:
    active_days = signals["active_days"]
    total_commits = signals["total_commits"]
    night_ratio = signals["night_ratio"]
    fork_ratio = signals["fork_ratio"]
    lang_count = signals["lang_count"]
    is_data_scientist = signals["is_data_scientist"]
    total_repos = signals["total_repos"]
    avg_stars = signals["avg_stars"]

    scores: dict[str, float] = {t: 0.0 for t in TYPES}

    # 꾸준형: 많은 활동일, 적당한 커밋
    scores["gardener"] += min(active_days / 20, 1.0) * 40
    scores["gardener"] += (1 - min(total_commits / 200, 1.0)) * 30
    scores["gardener"] += (1 - night_ratio) * 30

    # 몰입형: 총 커밋 많음, 활동일 상대적으로 적음
    scores["sprinter"] += min(total_commits / 150, 1.0) * 50
    if active_days > 0:
        burst = total_commits / active_days
        scores["sprinter"] += min(burst / 5, 1.0) * 30
    scores["sprinter"] += night_ratio * 20

    # 설계형: 커밋 적음, 레포 적음, avg_stars 높음
    scores["architect"] += (1 - min(total_commits / 100, 1.0)) * 40
    scores["architect"] += (1 - min(total_repos / 30, 1.0)) * 30
    scores["architect"] += min(avg_stars / 10, 1.0) * 30

    # 실험형: 야간 비율 높음, 포크 많음, 언어 다양
    scores["hacker"] += night_ratio * 40
    scores["hacker"] += fork_ratio * 30
    scores["hacker"] += min(lang_count / 5, 1.0) * 30

    # 탐구형: Python/Jupyter, 포크 많음
    scores["researcher"] += (1.0 if is_data_scientist else 0.0) * 50
    scores["researcher"] += fork_ratio * 30
    scores["researcher"] += min(lang_count / 4, 1.0) * 20

    # 장인형: 레포 적음, 커밋 적음, avg_stars 높음
    scores["craftsman"] += (1 - min(total_repos / 20, 1.0)) * 35
    scores["craftsman"] += (1 - min(total_commits / 100, 1.0)) * 35
    scores["craftsman"] += min(avg_stars / 15, 1.0) * 30

    # 탐험형: 언어 많음, 포크 많음, 레포 많음
    scores["explorer"] += min(lang_count / 6, 1.0) * 40
    scores["explorer"] += fork_ratio * 30
    scores["explorer"] += min(total_repos / 30, 1.0) * 30

    # 빌더형: 레포 많음, 커밋 많음, 포크 낮음
    scores["builder"] += min(total_repos / 25, 1.0) * 40
    scores["builder"] += min(total_commits / 120, 1.0) * 40
    scores["builder"] += (1 - fork_ratio) * 20

    return scores


def determine_type(scores: dict[str, float]) -> str:
    return max(scores, key=lambda t: scores[t])
