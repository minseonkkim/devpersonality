from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.core.config import settings
from app.api.github_service import exchange_code_for_token, fetch_github_data, extract_signals
from app.api.analyzer import score, determine_type

router = APIRouter()


class AnalyzeRequest(BaseModel):
    code: str


@router.get("/health")
async def health_check():
    return {"status": "ok"}


@router.post("/analyze")
async def analyze(req: AnalyzeRequest):
    if not settings.GITHUB_CLIENT_ID or not settings.GITHUB_CLIENT_SECRET:
        raise HTTPException(status_code=500, detail="GitHub OAuth credentials not configured")

    try:
        token = await exchange_code_for_token(
            req.code, settings.GITHUB_CLIENT_ID, settings.GITHUB_CLIENT_SECRET
        )
        data = await fetch_github_data(token)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"GitHub API error: {e}")

    signals = extract_signals(data)
    scores = score(signals)
    personality_type = determine_type(scores)

    user = data["user"]
    return {
        "type": personality_type,
        "username": user.get("login", ""),
        "avatar_url": user.get("avatar_url", ""),
        "scores": scores,
    }
