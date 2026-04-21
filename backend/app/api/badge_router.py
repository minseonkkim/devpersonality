from fastapi import APIRouter
from fastapi.responses import Response

from app.core.job_store import get_by_username

badge_router = APIRouter()

# 유형별 메타데이터 (label, emoji, color)
TYPE_META: dict[str, dict] = {
    "gardener":   {"label": "꾸준형",  "en": "Gardener",   "emoji": "🌱", "color": "#4CAF50"},
    "sprinter":   {"label": "몰입형",  "en": "Sprinter",   "emoji": "⚡", "color": "#FF5722"},
    "architect":  {"label": "설계형",  "en": "Architect",  "emoji": "🏗️", "color": "#3B5EDE"},
    "hacker":     {"label": "실험형",  "en": "Hacker",     "emoji": "🔧", "color": "#00C853"},
    "researcher": {"label": "탐구형",  "en": "Researcher", "emoji": "🔬", "color": "#009688"},
    "craftsman":  {"label": "장인형",  "en": "Craftsman",  "emoji": "🎯", "color": "#FF8F00"},
    "explorer":   {"label": "탐험형",  "en": "Explorer",   "emoji": "🧭", "color": "#29B6F6"},
    "builder":    {"label": "빌더형",  "en": "Builder",    "emoji": "🚀", "color": "#E53935"},
}


def _hex_to_rgb(hex_color: str) -> tuple[int, int, int]:
    h = hex_color.lstrip("#")
    return int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)


def _darken(hex_color: str, factor: float = 0.7) -> str:
    r, g, b = _hex_to_rgb(hex_color)
    return "#{:02x}{:02x}{:02x}".format(int(r * factor), int(g * factor), int(b * factor))


def _build_svg(type_slug: str, username: str) -> str:
    meta = TYPE_META.get(type_slug, TYPE_META["gardener"])
    color = meta["color"]
    dark = _darken(color)
    label = "dev personality"
    value = f"{meta['emoji']} {meta['label']} | {meta['en']}"

    label_w = 110
    value_w = len(value) * 7 + 16
    total_w = label_w + value_w
    height = 20

    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" width="{total_w}" height="{height}" role="img" aria-label="{label}: {value}">
  <title>{label}: {value}</title>
  <linearGradient id="s" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <clipPath id="r">
    <rect width="{total_w}" height="{height}" rx="3" fill="#fff"/>
  </clipPath>
  <g clip-path="url(#r)">
    <rect width="{label_w}" height="{height}" fill="#555"/>
    <rect x="{label_w}" width="{value_w}" height="{height}" fill="{color}"/>
    <rect width="{total_w}" height="{height}" fill="url(#s)"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="11">
    <text x="{label_w // 2}" y="15" fill="#010101" fill-opacity=".3">{label}</text>
    <text x="{label_w // 2}" y="14">{label}</text>
    <text x="{label_w + value_w // 2}" y="15" fill="#010101" fill-opacity=".3">{value}</text>
    <text x="{label_w + value_w // 2}" y="14">{value}</text>
  </g>
</svg>"""
    return svg


@badge_router.get("/badge/{username}.svg")
async def badge_svg(username: str, period: int = 30):
    result = get_by_username(username)
    if result is None:
        type_slug = "gardener"
    else:
        type_slug = result.get("type", "gardener")

    svg = _build_svg(type_slug, username)
    return Response(
        content=svg,
        media_type="image/svg+xml",
        headers={
            "Cache-Control": "public, max-age=86400",
            "Access-Control-Allow-Origin": "*",
        },
    )
