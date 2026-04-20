TYPES = ["gardener", "sprinter", "architect", "hacker", "researcher", "craftsman", "explorer", "builder"]


def score(signals: dict) -> dict[str, float]:
    active_days          = signals["active_days"]
    total_commits        = signals["total_commits"]
    night_ratio          = signals["night_ratio"]
    fork_ratio           = signals["fork_ratio"]
    lang_count           = signals["lang_count"]
    is_data_scientist    = signals["is_data_scientist"]
    total_repos          = signals["total_repos"]
    avg_stars            = signals["avg_stars"]
    avg_commit_size      = signals["avg_commit_size"]
    msg_feat_ratio       = signals["msg_feat_ratio"]
    msg_fix_ratio        = signals["msg_fix_ratio"]
    msg_refactor_ratio   = signals["msg_refactor_ratio"]
    msg_chore_ratio      = signals["msg_chore_ratio"]
    msg_experiment_ratio = signals["msg_experiment_ratio"]

    scores: dict[str, float] = {t: 0.0 for t in TYPES}

    # 커밋 크기 데이터가 없으면 중립값(0.5) 사용
    has_size = avg_commit_size > 0
    small_commit = (1 - min(avg_commit_size / 100, 1.0)) if has_size else 0.5  # < 100라인이면 높음
    large_commit = min(avg_commit_size / 200, 1.0)        if has_size else 0.5  # > 200라인이면 높음

    # 꾸준형: 많은 활동일, 작은 커밋, 낮은 야간, chore/docs 메시지
    scores["gardener"] += min(active_days / 20, 1.0) * 35
    scores["gardener"] += small_commit * 20
    scores["gardener"] += (1 - night_ratio) * 25
    scores["gardener"] += msg_chore_ratio * 20

    # 몰입형: 총 커밋 많음, 집중도 높음, 큰 커밋, 야간
    scores["sprinter"] += min(total_commits / 150, 1.0) * 40
    if active_days > 0:
        burst = total_commits / active_days
        scores["sprinter"] += min(burst / 5, 1.0) * 25
    scores["sprinter"] += large_commit * 20
    scores["sprinter"] += night_ratio * 15

    # 설계형: 커밋 적음, 레포 적음, star 높음, refactor 메시지, 큰 커밋
    scores["architect"] += (1 - min(total_commits / 100, 1.0)) * 25
    scores["architect"] += (1 - min(total_repos / 30, 1.0)) * 20
    scores["architect"] += min(avg_stars / 10, 1.0) * 20
    scores["architect"] += msg_refactor_ratio * 25
    scores["architect"] += large_commit * 10

    # 실험형: 야간, 포크, 언어 다양, 실험 메시지
    scores["hacker"] += night_ratio * 30
    scores["hacker"] += fork_ratio * 25
    scores["hacker"] += min(lang_count / 5, 1.0) * 25
    scores["hacker"] += msg_experiment_ratio * 20

    # 탐구형: Python/Jupyter, 포크, 언어 다양, chore(docs) 메시지
    scores["researcher"] += (1.0 if is_data_scientist else 0.0) * 45
    scores["researcher"] += fork_ratio * 25
    scores["researcher"] += min(lang_count / 4, 1.0) * 15
    scores["researcher"] += msg_chore_ratio * 15

    # 장인형: 레포 적음, 작은 커밋, star 높음, fix/chore 메시지
    scores["craftsman"] += (1 - min(total_repos / 20, 1.0)) * 20
    scores["craftsman"] += small_commit * 25
    scores["craftsman"] += min(avg_stars / 15, 1.0) * 20
    scores["craftsman"] += msg_fix_ratio * 20
    scores["craftsman"] += msg_chore_ratio * 15

    # 탐험형: 언어 많음, 포크 많음, 레포 많음
    scores["explorer"] += min(lang_count / 6, 1.0) * 35
    scores["explorer"] += fork_ratio * 30
    scores["explorer"] += min(total_repos / 30, 1.0) * 25
    scores["explorer"] += msg_feat_ratio * 10

    # 빌더형: 레포 많음, 커밋 많음, 포크 낮음, feat 메시지
    scores["builder"] += min(total_repos / 25, 1.0) * 30
    scores["builder"] += min(total_commits / 120, 1.0) * 30
    scores["builder"] += (1 - fork_ratio) * 15
    scores["builder"] += msg_feat_ratio * 25

    return scores


def determine_type(scores: dict[str, float]) -> str:
    return max(scores, key=lambda t: scores[t])


def generate_axes(signals: dict) -> list[dict]:
    """4개 축 스펙트럼 점수 생성. score 0=왼쪽 극단, 100=오른쪽 극단."""
    active_days     = signals["active_days"]
    total_commits   = signals["total_commits"]
    night_ratio     = signals["night_ratio"]
    avg_commit_size = signals["avg_commit_size"]
    lang_count      = signals["lang_count"]
    fork_ratio      = signals["fork_ratio"]

    # 1. 리듬 — 꾸준함(0) ↔ 몰아치기(100)
    steady   = min(active_days / 20, 1.0)
    burst    = min((total_commits / max(active_days, 1)) / 8, 1.0)
    rhythm   = int((1 - steady) * 55 + burst * 45)

    # 2. 커밋 규모 — 정밀(0) ↔ 대담(100)
    if avg_commit_size > 0:
        scale = int(min(avg_commit_size / 200, 1.0) * 100)
    else:
        scale = 50  # 데이터 없으면 중립

    # 3. 탐험 성향 — 전문(0) ↔ 탐험(100)
    explore = int((min(lang_count / 6, 1.0) * 0.6 + fork_ratio * 0.4) * 100)

    # 4. 활동 시간 — 주간(0) ↔ 야간(100)
    timing = int(night_ratio * 100)

    return [
        {"left": "꾸준함", "right": "몰아치기", "score": rhythm},
        {"left": "정밀",   "right": "대담",     "score": scale},
        {"left": "전문",   "right": "탐험",     "score": explore},
        {"left": "주간",   "right": "야간",     "score": timing},
    ]
