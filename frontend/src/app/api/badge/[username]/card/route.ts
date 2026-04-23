import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

const TYPE_META = {
  gardener:   { label: "꾸준형",  en: "Gardener",   emoji: "🌱", color: "#4CAF50", desc: "매일 물을 주듯 꾸준히" },
  sprinter:   { label: "몰입형",  en: "Sprinter",   emoji: "⚡", color: "#FF5722", desc: "한 번 달리면 멈추지 않아" },
  architect:  { label: "설계형",  en: "Architect",  emoji: "🏗",  color: "#3B5EDE", desc: "짓기 전에 먼저 그린다" },
  hacker:     { label: "실험형",  en: "Hacker",     emoji: "🔧", color: "#FFC107", desc: "일단 해보고 생각한다" },
  researcher: { label: "탐구형",  en: "Researcher", emoji: "🔬", color: "#009688", desc: "왜인지 알아야 직성이 풀려" },
  craftsman:  { label: "장인형",  en: "Craftsman",  emoji: "🎯", color: "#FF8F00", desc: "디테일에 영혼을 건다" },
  explorer:   { label: "탐험형",  en: "Explorer",   emoji: "🧭", color: "#29B6F6", desc: "새로운 기술이 있다면 GO" },
  builder:    { label: "빌더형",  en: "Builder",    emoji: "🚀", color: "#E53935", desc: "만들고 배포하고 또 만든다" },
} as const;

function loadSprite(slug: string, frame: 1 | 2): string | null {
  try {
    const filePath = path.join(process.cwd(), "public", "sprites", `${slug}${frame}.png`);
    const buf = fs.readFileSync(filePath);
    return `data:image/png;base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

function esc(s: string): string {
  return s.replace(/[<>&"]/g, (c) =>
    c === "<" ? "&lt;" : c === ">" ? "&gt;" : c === "&" ? "&amp;" : "&quot;"
  );
}

async function fetchType(username: string): Promise<string> {
  try {
    const backendUrl = process.env.BACKEND_URL ?? "http://localhost:8000";
    const res = await fetch(`${backendUrl}/api/analyze/result/${username}`, {
      next: { revalidate: 86400 },
    });
    if (!res.ok) return "gardener";
    const data = (await res.json()) as { type?: string };
    return data.type ?? "gardener";
  } catch {
    return "gardener";
  }
}

function buildCardSvg(username: string, typeSlug: string): string {
  const meta = TYPE_META[typeSlug as keyof typeof TYPE_META] ?? TYPE_META.gardener;
  const f1 = loadSprite(typeSlug, 1);
  const f2 = loadSprite(typeSlug, 2);
  const c = meta.color;

  const W = 480;
  const H = 160;
  const spriteSize = 88;
  const barW = 4;
  const colW = 116;
  const textX = barW + colW + 16;
  const textW = W - textX - 16;

  const cx = barW + colW / 2;
  const cy = H / 2;
  const sx = cx - spriteSize / 2;
  const sy = cy - spriteSize / 2;

  const chipText = `${meta.label} · ${meta.en}`;
  const chipW = Math.min(textW * 0.75, chipText.length * 7.8 + 24);
  const user = esc(username);

  const spriteSvg = f1
    ? `<g>
      <animateTransform attributeName="transform" type="translate"
        values="0,0; 0,-4; 0,0; 0,-4; 0,0"
        keyTimes="0; 0.25; 0.5; 0.75; 1"
        dur="1s" repeatCount="indefinite"
        calcMode="spline"
        keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1"/>
      <image href="${f1}" x="${sx}" y="${sy}" width="${spriteSize}" height="${spriteSize}" image-rendering="pixelated">${
        f2 ? `<animate attributeName="visibility" values="visible;hidden" keyTimes="0;0.5" dur="1s" calcMode="discrete" repeatCount="indefinite"/>` : ""
      }</image>${
        f2
          ? `
      <image href="${f2}" x="${sx}" y="${sy}" width="${spriteSize}" height="${spriteSize}" image-rendering="pixelated">
        <animate attributeName="visibility" values="hidden;visible" keyTimes="0;0.5" dur="1s" calcMode="discrete" repeatCount="indefinite"/>
      </image>`
          : ""
      }
    </g>`
    : `<text x="${cx}" y="${cy + 20}" text-anchor="middle" font-size="48">${meta.emoji}</text>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" role="img" aria-label="dev 8ersonality: ${meta.label} ${meta.en}">
  <title>dev 8ersonality: ${meta.label} ${meta.en}</title>
  <defs>
    <clipPath id="c">
      <rect width="${W}" height="${H}" rx="8"/>
    </clipPath>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1c2333"/>
      <stop offset="100%" stop-color="#0d1117"/>
    </linearGradient>
    <radialGradient id="spot" cx="50%" cy="50%" r="65%">
      <stop offset="0%" stop-color="${c}" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="${c}" stop-opacity="0.02"/>
    </radialGradient>
    <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="6" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>

  <g clip-path="url(#c)">
    <rect width="${W}" height="${H}" fill="url(#bg)"/>
    <rect x="${barW}" y="0" width="${colW}" height="${H}" fill="url(#spot)"/>
    <circle cx="${cx}" cy="${cy}" r="32" fill="${c}" opacity="0.12" filter="url(#glow)"/>
    ${spriteSvg}
    <rect x="0" y="0" width="${barW}" height="${H}" fill="${c}"/>

    <rect x="${textX}" y="16" width="${chipW}" height="17" rx="3" fill="${c}1a"/>
    <rect x="${textX}" y="16" width="${chipW}" height="17" rx="3" fill="none" stroke="${c}" stroke-opacity="0.45" stroke-width="0.5"/>
    <text x="${textX + 8}" y="28" font-family="Courier New, monospace" font-size="9" fill="${c}" letter-spacing="1">${chipText}</text>

    <text x="${textX}" y="58" font-family="Courier New, monospace" font-size="18" font-weight="bold" fill="#e6edf3">@${user}</text>
    <text x="${textX}" y="79" font-family="Courier New, monospace" font-size="11" fill="#8b949e">${meta.emoji} ${meta.desc}</text>

    <line x1="${textX}" y1="93" x2="${W - 16}" y2="93" stroke="#30363d" stroke-width="0.5"/>
    <text x="${textX}" y="110" font-family="Courier New, monospace" font-size="9" fill="${c}99" letter-spacing="0.5">&#x25b8; dev8ersonality.app</text>

    <rect x="0" y="0" width="${W}" height="1" fill="${c}44"/>
    <rect x="${W - 1}" y="0" width="1" height="${H}" fill="${c}22"/>
  </g>
</svg>`;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  const typeSlug = await fetchType(username);
  const svg = buildCardSvg(username, typeSlug);

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=86400",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
