import LogoIcon from "@/components/LogoIcon";
import { AnimatedSprite } from "@/components/AnimatedSprite";

const TYPES = [
  { id: "gardener",   label: "꾸준형", color: "#4CAF50", desc: "매일 물을 주듯 꾸준히" },
  { id: "sprinter",   label: "몰입형", color: "#FF5722", desc: "한 번 달리면 멈추지 않아" },
  { id: "architect",  label: "설계형", color: "#3B5EDE", desc: "짓기 전에 먼저 그린다" },
  { id: "hacker",     label: "실험형", color: "#00C853", desc: "일단 해보고 생각한다" },
  { id: "researcher", label: "탐구형", color: "#009688", desc: "왜인지 알아야 직성이 풀려" },
  { id: "craftsman",  label: "장인형", color: "#FF8F00", desc: "디테일에 영혼을 건다" },
  { id: "explorer",   label: "탐험형", color: "#29B6F6", desc: "새로운 기술이 있다면 GO" },
  { id: "builder",    label: "빌더형", color: "#E53935", desc: "만들고 배포하고 또 만든다" },
] as const;

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#0d1117" }}>
      {/* Header */}
      <header
        className="flex items-center justify-between px-6 py-4"
        style={{ borderBottom: "1px solid #30363d" }}
      >
        <div className="flex items-center gap-3">
          <LogoIcon />
          <span
            className="text-xs"
            style={{ fontFamily: "var(--font-press-start)", color: "#e6edf3" }}
          >
            Dev Personality
          </span>
        </div>
        <span
          className="text-xs"
          style={{ fontFamily: "var(--font-mono)", color: "#484f58" }}
        >
          v1.0
        </span>
      </header>

      {/* Hero */}
      <main className="flex flex-col items-center flex-1 px-6 pt-16 pb-12 gap-8">
        {/* Terminal status line */}
        <div
          className="text-xs"
          style={{ fontFamily: "var(--font-mono)", color: "#484f58" }}
        >
          <span style={{ color: "#3fb950" }}>●</span>{" "}
          analyzing github activity
          <span className="animate-blink" style={{ color: "#58a6ff" }}>_</span>
        </div>

        {/* Main title */}
        <div className="text-center flex flex-col items-center gap-5 animate-fade-up">
          <h1
            style={{
              fontFamily: "var(--font-press-start)",
              color: "#e6edf3",
              fontSize: "15px",
              lineHeight: "2.4",
            }}
          >
            당신의 코딩
            <br />
            스타일은?
          </h1>
          <p
            className="text-sm max-w-sm text-center"
            style={{ color: "#8b949e", lineHeight: "1.8" }}
          >
            GitHub 커밋 패턴을 분석해{" "}
            <span style={{ color: "#58a6ff" }}>8가지 개발자 유형</span> 중<br />
            당신이 어디에 속하는지 알려드립니다.
          </p>
        </div>

        {/* CTA */}
        <a
          href="/api/auth/github"
          className="btn-pixel flex items-center gap-3 px-8 py-4 text-sm font-bold"
          style={{
            background: "#ffffff",
            color: "#0d1117",
            borderRadius: 0,
            boxShadow: "4px 4px 0px #8b949e",
            textDecoration: "none",
            fontFamily: "var(--font-sans)",
          }}
        >
          <GithubIcon />
          GitHub로 분석 시작하기
        </a>

        {/* Trust signals */}
        <div
          className="flex gap-6 text-xs"
          style={{ fontFamily: "var(--font-mono)", color: "#484f58" }}
        >
          <span><span style={{ color: "#3fb950" }}>✓</span> 무료</span>
          <span><span style={{ color: "#3fb950" }}>✓</span> 30초 소요</span>
          <span><span style={{ color: "#3fb950" }}>✓</span> public 데이터만</span>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 w-full max-w-2xl">
          <div className="flex-1" style={{ borderTop: "1px solid #30363d" }} />
          <span
            className="text-xs"
            style={{ fontFamily: "var(--font-mono)", color: "#484f58" }}
          >
            // 8가지 개발자 유형
          </span>
          <div className="flex-1" style={{ borderTop: "1px solid #30363d" }} />
        </div>

        {/* Type cards 4×2 grid */}
        <div className="grid grid-cols-2 gap-3 w-full max-w-2xl md:grid-cols-4">
          {TYPES.map((type) => (
            <TypeCard key={type.id} type={type} />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer
        className="flex items-center justify-center px-6 py-4 text-xs"
        style={{
          borderTop: "1px solid #30363d",
          fontFamily: "var(--font-mono)",
          color: "#484f58",
        }}
      >
        made with ♥ by devpersonality
      </footer>
    </div>
  );
}

function TypeCard({ type }: { type: (typeof TYPES)[number] }) {
  const badgeBg = `${type.color}1a`;
  const badgeBorder = `${type.color}4d`;

  return (
    <div
      className="type-card flex flex-col items-center gap-2 p-4"
      style={{
        background: "#161b22",
        border: "2px solid #30363d",
        borderRadius: 0,
        boxShadow: "4px 4px 0px #000",
        "--type-color": type.color,
      } as React.CSSProperties}
    >
      <AnimatedSprite type={type.id} width={64} height={64} />
      <span
        className="uppercase tracking-wider px-2 py-0.5"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "10px",
          background: badgeBg,
          color: type.color,
          border: `1px solid ${badgeBorder}`,
          borderRadius: 0,
        }}
      >
        {type.label}
      </span>
      <p
        className="text-center"
        style={{ fontSize: "10px", color: "#8b949e", lineHeight: "1.4" }}
      >
        {type.desc}
      </p>
    </div>
  );
}

function GithubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}
