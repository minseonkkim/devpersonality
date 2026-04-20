import uuid
from fastapi import APIRouter, BackgroundTasks, HTTPException
from pydantic import BaseModel

from app.core.config import settings
from app.core import job_store
from app.api.github_service import exchange_code_for_token, fetch_github_data, extract_signals
from app.api.analyzer import score, determine_type, generate_axes

router = APIRouter()


class AnalyzeRequest(BaseModel):
    code: str


async def _run_analysis(job_id: str, code: str) -> None:
    try:
        job_store.update(job_id, step="GitHub 인증 중...", percent=10)
        token = await exchange_code_for_token(
            code, settings.GITHUB_CLIENT_ID, settings.GITHUB_CLIENT_SECRET
        )

        job_store.update(job_id, step="커밋 패턴 분석 중...", percent=35)
        data = await fetch_github_data(token)

        job_store.update(job_id, step="야간 활동 비율 계산 중...", percent=65)
        signals = extract_signals(data)
        scores = score(signals)

        job_store.update(job_id, step="성향 도출 중...", percent=85)
        personality_type = determine_type(scores)
        axes = generate_axes(signals)

        user = data["user"]
        result = {
            "type": personality_type,
            "username": user.get("login", ""),
            "avatar_url": user.get("avatar_url", ""),
            "scores": scores,
            "axes": axes,
        }
        job_store.complete(job_id, result)
    except Exception as e:
        job_store.fail(job_id, str(e))


@router.get("/health")
async def health_check():
    return {"status": "ok"}


@router.post("/analyze")
async def analyze(req: AnalyzeRequest, background_tasks: BackgroundTasks):
    if not settings.GITHUB_CLIENT_ID or not settings.GITHUB_CLIENT_SECRET:
        raise HTTPException(status_code=500, detail="GitHub OAuth credentials not configured")

    job_id = str(uuid.uuid4())
    job_store.create(job_id)
    background_tasks.add_task(_run_analysis, job_id, req.code)
    return {"job_id": job_id, "status": "pending"}


@router.get("/analyze/status/{job_id}")
async def analyze_status(job_id: str):
    job = job_store.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job
