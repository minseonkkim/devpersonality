import { notFound } from "next/navigation";
import Link from "next/link";
import LogoIcon from "@/components/LogoIcon";
import { BadgeCopyPanel } from "@/components/BadgeCopyPanel";

const TYPE_META: Record<string, { label: string; en: string; emoji: string; color: string }> = {
  gardener:   { label: "꾸준형",  en: "Gardener",   emoji: "🌱", color: "#4CAF50" },
  sprinter:   { label: "몰입형",  en: "Sprinter",   emoji: "⚡", color: "#FF5722" },
  architect:  { label: "설계형",  en: "Architect",  emoji: "🏗️", color: "#3B5EDE" },
  hacker:     { label: "실험형",  en: "Hacker",     emoji: "🔧", color: "#00C853" },
  researcher: { label: "탐구형",  en: "Researcher", emoji: "🔬", color: "#009688" },
  craftsman:  { label: "장인형",  en: "Craftsman",  emoji: "🎯", color: "#FF8F00" },
  explorer:   { label: "탐험형",  en: "Explorer",   emoji: "🧭", color: "#29B6F6" },
  builder:    { label: "빌더형",  en: "Builder",    emoji: "🚀", color: "#E53935" },
};

async function fetchResult(username: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/analyze/result/${username}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json() as Promise<{ type: string; username: string }>;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontSize: 11,
        color: "#8b949e",
        marginBottom: 16,
        fontFamily: "Geist Mono, monospace",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
      }}
    >
      {children}
    </p>
  );
}

export default async function BadgePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const result = await fetchResult(username);
  if (!result) notFound();

  const typeSlug = result.type;
  const meta = TYPE_META[typeSlug] ?? TYPE_META["gardener"];
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

  const smallBadgeUrl = `${baseUrl}/api/badge/${username}`;
  const cardBadgeUrl = `${baseUrl}/api/badge/${username}/card`;

  const smallMarkdown = `![dev personality](${smallBadgeUrl})`;
  const smallHtml = `<img src="${smallBadgeUrl}" alt="dev personality" />`;

  const cardMarkdown = `[![dev personality](${cardBadgeUrl})](${baseUrl}/result/${username})`;
  const cardHtml = `<a href="${baseUrl}/result/${username}"><img src="${cardBadgeUrl}" alt="dev personality card" /></a>`;

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#0d1117",
        color: "#e6edf3",
        fontFamily: "Geist Sans, sans-serif",
        padding: "24px 16px",
      }}
    >
      {/* 헤더 */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          maxWidth: 640,
          margin: "0 auto 40px",
        }}
      >
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            textDecoration: "none",
            color: "#e6edf3",
          }}
        >
          <LogoIcon />
          <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 11 }}>
            Dev Personality
          </span>
        </Link>
        <Link
          href={`/result/${username}`}
          style={{
            fontSize: 12,
            color: "#8b949e",
            textDecoration: "none",
            border: "1px solid #30363d",
            padding: "4px 12px",
          }}
        >
          ← 결과 보기
        </Link>
      </header>

      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <h1
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 14,
            marginBottom: 8,
            color: meta.color,
          }}
        >
          README 배지
        </h1>
        <p style={{ fontSize: 13, color: "#8b949e", marginBottom: 40 }}>
          GitHub 프로필에 붙여넣으세요.
        </p>

        {/* ─── 작은 배지 ───────────────────────────────── */}
        <h2
          style={{
            fontSize: 12,
            color: "#e6edf3",
            fontFamily: "Geist Mono, monospace",
            marginBottom: 16,
            letterSpacing: "0.04em",
          }}
        >
          Small Badge
        </h2>

        <section
          style={{
            background: "#161b22",
            border: "1px solid #30363d",
            padding: "24px",
            marginBottom: 16,
          }}
        >
          <SectionLabel>미리보기</SectionLabel>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={smallBadgeUrl}
            alt={`dev personality: ${meta.emoji} ${meta.label} | ${meta.en}`}
            style={{ display: "block" }}
          />
        </section>

        <BadgeCopyPanel markdown={smallMarkdown} html={smallHtml} />

        {/* ─── 큰 카드 배지 ────────────────────────────── */}
        <h2
          style={{
            fontSize: 12,
            color: "#e6edf3",
            fontFamily: "Geist Mono, monospace",
            marginTop: 48,
            marginBottom: 16,
            letterSpacing: "0.04em",
          }}
        >
          Card Badge
        </h2>

        <section
          style={{
            background: "#161b22",
            border: "1px solid #30363d",
            padding: "24px",
            marginBottom: 16,
          }}
        >
          <SectionLabel>미리보기</SectionLabel>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cardBadgeUrl}
            alt={`dev personality card: ${meta.label}`}
            style={{ display: "block", maxWidth: "100%", height: "auto" }}
          />
        </section>

        <BadgeCopyPanel markdown={cardMarkdown} html={cardHtml} />

        {/* 유형 힌트 */}
        <div
          style={{
            marginTop: 40,
            padding: "16px 20px",
            background: meta.color + "0d",
            border: `1px solid ${meta.color}33`,
            fontSize: 12,
            color: meta.color,
            fontFamily: "Geist Mono, monospace",
          }}
        >
          {meta.emoji} {meta.label} · {meta.en}
        </div>
      </div>
    </main>
  );
}
