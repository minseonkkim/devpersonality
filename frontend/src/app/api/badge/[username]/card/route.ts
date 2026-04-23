import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

const TYPE_META: Record<string, { label: string; en: string; emoji: string; color: string; desc: string }> = {
  gardener:   { label: "꾸준형",  en: "Gardener",   emoji: "🌱", color: "#4CAF50", desc: "매일 물을 주듯 꾸준히" },
  sprinter:   { label: "몰입형",  en: "Sprinter",   emoji: "⚡", color: "#FF5722", desc: "한 번 달리면 멈추지 않아" },
  architect:  { label: "설계형",  en: "Architect",  emoji: "🏗",  color: "#3B5EDE", desc: "짓기 전에 먼저 그린다" },
  hacker:     { label: "실험형",  en: "Hacker",     emoji: "🔧", color: "#00C853", desc: "일단 해보고 생각한다" },
  researcher: { label: "탐구형",  en: "Researcher", emoji: "🔬", color: "#009688", desc: "왜인지 알아야 직성이 풀려" },
  craftsman:  { label: "장인형",  en: "Craftsman",  emoji: "🎯", color: "#FF8F00", desc: "디테일에 영혼을 건다" },
  explorer:   { label: "탐험형",  en: "Explorer",   emoji: "🧭", color: "#29B6F6", desc: "새로운 기술이 있다면 GO" },
  builder:    { label: "빌더형",  en: "Builder",    emoji: "🚀", color: "#E53935", desc: "만들고 배포하고 또 만든다" },
};

function loadSpriteBase64(slug: string): string | null {
  try {
    const filePath = path.join(process.cwd(), "public", "sprites", `${slug}1.png`);
    const buf = fs.readFileSync(filePath);
    return `data:image/png;base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
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
  const meta = TYPE_META[typeSlug] ?? TYPE_META["gardener"];
  const spriteBase64 = loadSpriteBase64(typeSlug);

  const W = 480;
  const H = 160;
  const spriteSize = 88;
  const leftBarW = 4;
  const spriteColW = 116;
  const textX = leftBarW + spriteColW + 16;
  const textW = W - textX - 16;

  const spriteCX = leftBarW + spriteColW / 2;
  const spriteCY = H / 2;

  const chipY = 28;
  const nameY = 58;
  const descY = 80;
  const brandY = 102;

  const escapedUsername = username.replace(/[<>&"]/g, (c) => {
    switch (c) {
      case "<": return "&lt;";
      case ">": return "&gt;";
      case "&": return "&amp;";
      case '"': return "&quot;";
      default: return c;
    }
  });

  const chipText = `${meta.label} · ${meta.en}`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" role="img" aria-label="dev personality: ${meta.label} ${meta.en}">
  <title>dev personality: ${meta.label} ${meta.en}</title>

  <!-- background -->
  <rect width="${W}" height="${H}" fill="#161b22"/>

  <!-- left color bar -->
  <rect x="0" y="0" width="${leftBarW}" height="${H}" fill="${meta.color}"/>

  <!-- sprite background -->
  <rect x="${leftBarW}" y="0" width="${spriteColW}" height="${H}" fill="${meta.color}18"/>

  ${spriteBase64
    ? `<image href="${spriteBase64}" x="${spriteCX - spriteSize / 2}" y="${spriteCY - spriteSize / 2}" width="${spriteSize}" height="${spriteSize}" image-rendering="pixelated"/>`
    : `<text x="${spriteCX}" y="${spriteCY + 20}" text-anchor="middle" font-size="48">${meta.emoji}</text>`
  }

  <!-- type chip background -->
  <rect x="${textX}" y="${chipY - 11}" width="${textW * 0.72}" height="16" fill="${meta.color}22" rx="0"/>

  <!-- type chip text -->
  <text
    x="${textX + 6}" y="${chipY}"
    font-family="Courier New, monospace"
    font-size="9"
    fill="${meta.color}"
    letter-spacing="1"
  >${chipText}</text>

  <!-- username -->
  <text
    x="${textX}" y="${nameY}"
    font-family="Courier New, monospace"
    font-size="18"
    font-weight="bold"
    fill="#e6edf3"
  >@${escapedUsername}</text>

  <!-- description -->
  <text
    x="${textX}" y="${descY}"
    font-family="Courier New, monospace"
    font-size="11"
    fill="#8b949e"
  >${meta.emoji} ${meta.desc}</text>

  <!-- brand -->
  <text
    x="${textX}" y="${brandY}"
    font-family="Courier New, monospace"
    font-size="9"
    fill="#484f58"
    letter-spacing="0.5"
  >devpersonality</text>

  <!-- right border -->
  <rect x="${W - 1}" y="0" width="1" height="${H}" fill="${meta.color}44"/>
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
