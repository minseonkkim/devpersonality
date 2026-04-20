import uuid
from typing import Any

_jobs: dict[str, dict] = {}


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


def fail(job_id: str, error: str) -> None:
    if job_id in _jobs:
        _jobs[job_id]["status"] = "failed"
        _jobs[job_id]["error"] = error
