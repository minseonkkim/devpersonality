from typing import Any

_jobs: dict[str, dict] = {}
_results: dict[str, dict] = {}  # username → latest result


def create(job_id: str) -> None:
    _jobs[job_id] = {
        "job_id": job_id,
        "status": "pending",
        "progress": {"step": "대기 중...", "percent": 0},
        "result": None,
        "error": None,
    }


def get(job_id: str) -> dict | None:
    return _jobs.get(job_id)


def update(job_id: str, *, step: str, percent: int) -> None:
    if job_id in _jobs:
        _jobs[job_id]["status"] = "running"
        _jobs[job_id]["progress"] = {"step": step, "percent": percent}


def complete(job_id: str, result: dict[str, Any]) -> None:
    if job_id in _jobs:
        _jobs[job_id]["status"] = "completed"
        _jobs[job_id]["progress"] = {"step": "완료", "percent": 100}
        _jobs[job_id]["result"] = result
        username = result.get("username")
        if username:
            _results[username] = result


def get_by_username(username: str) -> dict | None:
    return _results.get(username)


def fail(job_id: str, error: str) -> None:
    if job_id in _jobs:
        _jobs[job_id]["status"] = "failed"
        _jobs[job_id]["error"] = error
