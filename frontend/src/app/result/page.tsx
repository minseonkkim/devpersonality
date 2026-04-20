import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

const TYPE_META: Record<string, { label: string; color: string; desc: string; long: string; hook: string }> = {
  gardener:   { label: "꾸준형",  color: "#4CAF50", desc: "매일 물을 주듯 꾸준히",    hook: "잔디 비어있는 날,\n자기 전에 한 번 더 열어보죠?",                  long: "작은 변화를 꾸준히 쌓아가는 스타일. 안정적인 리듬으로 프로젝트를 이끌어나갑니다." },
  sprinter:   { label: "몰입형",  color: "#FF5722", desc: "한 번 달리면 멈추지 않아", hook: "일주일 조용하다가 어느 날\n커밋 20개. 그게 바로 당신.",              long: "평소엔 조용하다가 특정 기간에 폭발적으로 집중하는 스타일." },
  architect:  { label: "설계형",  color: "#3B5EDE", desc: "짓기 전에 먼저 그린다",    hook: "README부터 쓰고 코드는 나중에.\n다이어그램 없이는 못 시작하죠?",    long: "커밋 수는 적지만 한 번 올릴 때 구조적인 변화를 만드는 스타일." },
  hacker:     { label: "실험형",  color: "#00C853", desc: "일단 해보고 생각한다",     hook: "새벽 2시에 'wip: 일단 돌아감' 커밋,\n한 번쯤 있죠?",               long: "빠르게 만들고 바로 시도해보는 스타일. 야간에 특히 활발합니다." },
  researcher: { label: "탐구형",  color: "#009688", desc: "왜인지 알아야 직성이 풀려", hook: "라이브러리 쓰기 전에\n소스 코드 먼저 열어보는 사람.",               long: "깊이 있게 탐구하고 분석하는 개발 스타일." },
  craftsman:  { label: "장인형",  color: "#FF8F00", desc: "디테일에 영혼을 건다",     hook: "변수명 하나 고치는 데 10분.\n남이 짠 코드 보면 손이 근질근질하죠?", long: "완성도를 최우선으로 생각하며 코드 퀄리티에 집착하는 스타일." },
  explorer:   { label: "탐험형",  color: "#29B6F6", desc: "새로운 기술이 있다면 GO",  hook: "이번 달 또 새 언어 시작했죠?\n사이드 프로젝트 몇 개인지도 모르고.",  long: "다양한 언어와 기술 스택을 탐험하는 것을 즐기는 스타일." },
  builder:    { label: "빌더형",  color: "#E53935", desc: "만들고 배포하고 또 만든다", hook: "아이디어 떠오르면 일단 레포부터 파는 사람.\n배포 안 하면 의미없죠.", long: "레포를 꾸준히 만들고 배포하며 성장하는 스타일." },
};

export default async function ResultPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const { type, username, avatar_url, axes: axesRaw } = await searchParams;
  if (!type || !TYPE_META[type]) redirect("/");

  const meta = TYPE_META[type];
  const axes: { left: string; right: string; score: number }[] = (() => {
    try { return JSON.parse(axesRaw ?? "[]"); } catch { return []; }
  })();

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#0d1117" }}>
      <header
        className="flex items-center justify-between px-6 py-4"
        style={{ borderBottom: "1px solid #30363d" }}
      >
        <Link href="/" className="flex items-center gap-3" style={{ textDecoration: "none" }}>
          <div className="w-5 h-5" style={{ background: "#58a6ff", boxShadow: "2px 2px 0px #000" }} />
          <span className="text-xs" style={{ fontFamily: "var(--font-press-start)", color: "#e6edf3" }}>
            Dev Personality
          </span>
        </Link>
      </header>

      <main className="flex flex-col items-center flex-1 px-6 pt-14 pb-12 gap-8">
        <div className="text-xs" style={{ fontFamily: "var(--font-mono)", color: "#484f58" }}>
          <span style={{ color: "#3fb950" }}>●</span> analysis complete
        </div>

        <div className="flex flex-col items-center gap-5 animate-fade-up">
          {avatar_url && (
            <Image
              src={avatar_url}
              alt={username ?? "avatar"}
              width={64}
              height={64}
              className="rounded-full"
              style={{ border: `3px solid ${meta.color}` }}
            />
          )}
          <p className="text-sm" style={{ color: "#8b949e", fontFamily: "var(--font-mono)" }}>
            @{username}
          </p>
        </div>

        <div
          className="flex flex-col items-center gap-4 p-8 w-full max-w-md"
          style={{
            background: "#161b22",
            border: `2px solid ${meta.color}`,
            boxShadow: `6px 6px 0px ${meta.color}4d`,
          }}
        >
          <Image
            src={`/sprites/${type}.png`}
            alt={meta.label}
            width={96}
            height={96}
            style={{ imageRendering: "pixelated" }}
            unoptimized
          />
          <span
            className="uppercase tracking-wider px-3 py-1 text-sm"
            style={{
              fontFamily: "var(--font-mono)",
              background: `${meta.color}1a`,
              color: meta.color,
              border: `1px solid ${meta.color}4d`,
            }}
          >
            {meta.label}
          </span>
          <p
            className="text-center text-xs"
            style={{
              fontFamily: "var(--font-mono)",
              color: meta.color,
              background: `${meta.color}0d`,
              border: `1px solid ${meta.color}33`,
              padding: "10px 16px",
              lineHeight: "1.7",
              width: "100%",
              whiteSpace: "pre-line",
            }}
          >
            &ldquo;{meta.hook}&rdquo;
          </p>
          <p className="text-center text-sm" style={{ color: "#8b949e", lineHeight: "1.8" }}>
            {meta.long}
          </p>
        </div>

        {axes.length > 0 && (
          <div
            className="w-full max-w-md"
            style={{ background: "#161b22", border: "1px solid #30363d" }}
          >
            <div style={{ padding: "8px 16px", borderBottom: "1px solid #30363d" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "#484f58" }}>
                // 성향 스펙트럼
              </span>
            </div>
            <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "20px" }}>
              {axes.map((axis) => {
                const leftWins = axis.score <= 50;
                // 우세한 쪽 비율: 항상 50~100%
                const dominantPct = leftWins ? 100 - axis.score : axis.score;
                // 바 채움 너비: 우세한 쪽에서 시작
                const fillWidth = `${dominantPct}%`;

                return (
                  <div key={axis.left} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {/* 레이블 */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "12px",
                        color: leftWins ? meta.color : "#484f58",
                        fontWeight: leftWins ? "700" : "400",
                      }}>
                        {axis.left}
                      </span>
                      <span style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "12px",
                        color: !leftWins ? meta.color : "#484f58",
                        fontWeight: !leftWins ? "700" : "400",
                      }}>
                        {axis.right}
                      </span>
                    </div>

                    {/* 바: 우세한 쪽에서 채워짐 */}
                    <div style={{ height: "10px", background: "#21262d", position: "relative" }}>
                      <div style={{
                        position: "absolute",
                        top: 0,
                        [leftWins ? "left" : "right"]: 0,
                        height: "100%",
                        width: fillWidth,
                        background: meta.color,
                      }} />
                    </div>

                    {/* 퍼센트: 우세한 쪽 정렬 */}
                    <div style={{ display: "flex", justifyContent: leftWins ? "flex-start" : "flex-end" }}>
                      <span style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "10px",
                        color: meta.color,
                      }}>
                        {dominantPct}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex gap-4">
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`나의 개발자 유형은 "${meta.label}" — ${meta.desc}\n\n#DevPersonality #GitHub`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 text-xs"
            style={{
              background: "#1d9bf0",
              color: "#fff",
              fontFamily: "var(--font-mono)",
              boxShadow: "3px 3px 0px #000",
              textDecoration: "none",
            }}
          >
            X에 공유하기
          </a>
          <Link
            href="/"
            className="px-5 py-3 text-xs"
            style={{
              background: "#161b22",
              color: "#8b949e",
              border: "1px solid #30363d",
              fontFamily: "var(--font-mono)",
              textDecoration: "none",
            }}
          >
            다시 분석하기
          </Link>
        </div>
      </main>

      <footer
        className="flex items-center justify-center px-6 py-4 text-xs"
        style={{ borderTop: "1px solid #30363d", fontFamily: "var(--font-mono)", color: "#484f58" }}
      >
        made with ♥ by devpersonality
      </footer>
    </div>
  );
}
