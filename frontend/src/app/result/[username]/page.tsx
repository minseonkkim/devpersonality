import Image from "next/image";
import Link from "next/link";
import { AnimatedSprite } from "@/components/AnimatedSprite";
import LogoIcon from "@/components/LogoIcon";
import { ShareUrlButton } from "@/components/ShareUrlButton";
import { SaveImageButton } from "@/components/SaveImageButton";
import { BadgeModal } from "@/components/BadgeModal";
import { notFound } from "next/navigation";
import BrandWordmark from "@/components/BrandWordmark";

const COMPATIBILITY: Record<string, { good: string; goodReason: string; bad: string; badReason: string }> = {
  gardener:   { good: "craftsman",  goodReason: "같이 리뷰하면 PR이 조용히 머지된다. 둘 다 급하지 않다.",        bad: "sprinter",   badReason: "한 명은 매일 조금씩, 한 명은 마감 전날 올인. PR 타이밍이 안 맞는다." },
  sprinter:   { good: "hacker",     goodReason: "마감 전날 둘이 붙으면 밤새 기능이 완성된다.",                  bad: "researcher", badReason: "데드라인 얘기 꺼내면 '근데 이 라이브러리 내부 동작이...' 시작된다." },
  architect:  { good: "researcher", goodReason: "설계 문서가 나오면 둘 다 읽는다. 회의가 짧아진다.",            bad: "hacker",     badReason: "설계 리뷰 잡았더니 상대방이 이미 구현 다 해놓음." },
  hacker:     { good: "explorer",   goodReason: "기술 도입 결정이 회의 없이 이뤄진다. 그냥 해보고 공유.",       bad: "craftsman",  badReason: "PR 올리면 댓글이 30개. 변수명부터 시작해서 끝이 없다." },
  researcher: { good: "architect",  goodReason: "코드 리뷰에서 '왜 이렇게 짰어요?'가 없다. 이미 다 알고 짠다.", bad: "builder",    badReason: "스펙 논의 중인데 상대방이 배포 완료 슬랙 올림." },
  craftsman:  { good: "architect",  goodReason: "레거시가 안 생긴다. 둘 다 나중에 건드리기 싫어서 처음부터 잘 짠다.", bad: "hacker", badReason: "코드 리뷰에서 합의점을 못 찾는다. 기준이 아예 다르다." },
  explorer:   { good: "hacker",     goodReason: "기술 스택 논의가 5분 만에 끝난다. 둘 다 일단 써보자.",        bad: "gardener",   badReason: "이번 달 스택 또 바꾸자고 했더니 조용히 거절당함." },
  builder:    { good: "sprinter",   goodReason: "스프린트 마지막 날이 제일 재밌다. 같이 있으면 뭔가 나온다.",   bad: "architect",  badReason: "출시 일정 잡으면 설계가 아직이라고 한다." },
};

const TYPE_META: Record<string, { label: string; color: string; desc: string; long: string; hook: string }> = {
  gardener:   { label: "꾸준형",  color: "#4CAF50", desc: "매일 물을 주듯 꾸준히",    hook: "잔디 비어있는 날,\n자기 전에 한 번 더 열어보죠?",                  long: "잔디 하나 비는 게 그냥 넘어가지지 않는 사람입니다. 아, 오늘 커밋 안 했네 — 하고 자기 전에 노트북 다시 여는 그 사람.\n\n드라마틱한 성격은 아닌데, 그게 오히려 강점입니다. 폭발하지 않는 대신 꺼지지도 않거든요. 요란하지 않아도 결국 가장 멀리 가는 타입입니다." },
  sprinter:   { label: "몰입형",  color: "#FF5722", desc: "한 번 달리면 멈추지 않아", hook: "일주일 조용하다가 어느 날\n커밋 20개. 그게 바로 당신.",              long: "평소엔 멀쩡한 사람인데 갑자기 사라집니다. 며칠 후 커밋 20개와 함께 귀환.\n\n에너지가 전부 아니면 제로입니다. 관심 없을 땐 아무것도 안 하다가, 꽂히면 밥도 잊고 화장실도 참습니다. 그 집중력이 폭발하는 순간만큼은 아무도 못 따라옵니다. 데드라인이 최고의 연료입니다." },
  architect:  { label: "설계형",  color: "#3B5EDE", desc: "짓기 전에 먼저 그린다",    hook: "README부터 쓰고 코드는 나중에.\n다이어그램 없이는 못 시작하죠?",    long: "코드 한 줄 치기 전에 이미 머릿속에서 설계가 끝나 있는 사람입니다. 폴더 구조가 마음에 안 들면 아무것도 못 합니다.\n\n'일단 짜고 나중에 고치자'는 말이 가장 무섭습니다. 나중에 고친다는 보장이 없다는 거 알거든요. 처음부터 제대로 — 그게 결국 제일 빠른 길이라고 믿는 사람입니다." },
  hacker:     { label: "실험형",  color: "#FFC107", desc: "일단 해보고 생각한다",     hook: "새벽 2시에 'wip: 일단 돌아감' 커밋,\n한 번쯤 있죠?",               long: "일단 돌아가면 된 겁니다. 완벽한 계획보다 지금 당장 눌러보는 게 더 많은 걸 알려준다고 생각합니다.\n\n새벽 2시에 'wip: 일단 됨'을 올리고 자는 것도 본인에겐 진지한 개발입니다. 실패도 결과고, 결과는 데이터니까요. 남들이 검증된 길을 갈 때, 혼자 옆길 개척하는 걸 즐기는 사람입니다." },
  researcher: { label: "탐구형",  color: "#009688", desc: "왜인지 알아야 직성이 풀려", hook: "라이브러리 쓰기 전에\n소스 코드 먼저 열어보는 사람.",               long: "npm install 하고 바로 소스 코드 여는 사람입니다. 어떻게 쓰는지보다 어떻게 만들어졌는지가 더 궁금하거든요.\n\n'그냥 되니까 쓰면 되지'는 이 사람 사전에 없습니다. 원리를 알아야 편안하고, 모르는 채로 쓰면 뭔가 찜찜합니다. 파고들수록 재밌어지는 걸 알아버린 사람입니다." },
  craftsman:  { label: "장인형",  color: "#FF8F00", desc: "디테일에 영혼을 건다",     hook: "변수명 하나 고치는 데 10분.\n남이 짠 코드 보면 손이 근질근질하죠?", long: "기능은 돌아가는데 변수명이 마음에 안 들어서 다시 여는 사람입니다. 리뷰 요청 받으면 댓글이 제일 많습니다.\n\n'대충 되면 됐지'가 제일 듣기 싫은 말입니다. 내 이름이 붙은 코드가 부끄러우면 안 된다고 생각하거든요. 느리다는 말 들어도 괜찮습니다. 어차피 나중에 안 건드려도 되는 코드 짜는 사람이 이 사람이니까요." },
  explorer:   { label: "탐험형",  color: "#29B6F6", desc: "새로운 기술이 있다면 GO",  hook: "이번 달 또 새 언어 시작했죠?\n사이드 프로젝트 몇 개인지도 모르고.",  long: "새 프레임워크 나왔다는 글 보면 탭이 하나 더 열립니다. 아, 이건 써봐야 해 — 하고 그날 바로 설치합니다.\n\n레포가 몇 개인지는 본인도 잘 모릅니다. 한 가지에 오래 머무르는 건 좀 답답하고, 새로운 세계를 직접 부딪혀보는 게 맞습니다. 새로운 걸 좋아하는 게 산만한 게 아니라 — 더 나은 게 있을 거라는 확신 때문입니다." },
  builder:    { label: "빌더형",  color: "#E53935", desc: "만들고 배포하고 또 만든다", hook: "아이디어 떠오르면 일단 레포부터 파는 사람.\n배포 안 하면 의미없죠.", long: "아이디어 떠오르면 그날 레포 팝니다. 기획서보다 README가 먼저고, 배포 안 한 건 만든 게 아닙니다.\n\n완벽해질 때까지 기다리면 영원히 못 냅니다. 일단 세상에 꺼내놓고, 망하면 배우고, 되면 발전시키면 됩니다. 개발자이기 전에 뭔가를 계속 만들어야 직성이 풀리는 사람 — 메이커에 가깝습니다." },
};

async function fetchResult(username: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/analyze/result/${username}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json() as Promise<{
    type: string;
    username: string;
    avatar_url: string;
    scores: Record<string, number>;
    axes: { left: string; right: string; score: number }[];
  }>;
}

export default async function ResultPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const data = await fetchResult(username);
  if (!data || !TYPE_META[data.type]) notFound();

  const { type, avatar_url, axes } = data;
  const meta = TYPE_META[type];

  const TYPE_META_BADGE: Record<string, { label: string; en: string; emoji: string }> = {
    gardener:   { label: "꾸준형",  en: "Gardener",   emoji: "🌱" },
    sprinter:   { label: "몰입형",  en: "Sprinter",   emoji: "⚡" },
    architect:  { label: "설계형",  en: "Architect",  emoji: "🏗️" },
    hacker:     { label: "실험형",  en: "Hacker",     emoji: "🔧" },
    researcher: { label: "탐구형",  en: "Researcher", emoji: "🔬" },
    craftsman:  { label: "장인형",  en: "Craftsman",  emoji: "🎯" },
    explorer:   { label: "탐험형",  en: "Explorer",   emoji: "🧭" },
    builder:    { label: "빌더형",  en: "Builder",    emoji: "🚀" },
  };
  const badgeMeta = TYPE_META_BADGE[type] ?? TYPE_META_BADGE["gardener"];
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const smallBadgeUrl = `${baseUrl}/api/badge/${username}`;
  const cardBadgeUrl = `${baseUrl}/api/badge/${username}/card`;
  const smallMarkdown = `![dev 8ersonality](${smallBadgeUrl})`;
  const smallHtml = `<img src="${smallBadgeUrl}" alt="dev 8ersonality" />`;
  const cardMarkdown = `[![dev 8ersonality](${cardBadgeUrl})](${baseUrl}/result/${username})`;
  const cardHtml = `<a href="${baseUrl}/result/${username}"><img src="${cardBadgeUrl}" alt="dev 8ersonality card" /></a>`;

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#0d1117" }}>
      <header
        className="flex items-center justify-between px-6 py-4"
        style={{ borderBottom: "1px solid #30363d" }}
      >
        <Link href="/" className="flex items-center gap-3" style={{ textDecoration: "none" }}>
          <LogoIcon />
          <BrandWordmark
            className="text-xs"
            style={{ fontFamily: "var(--font-press-start)", color: "#e6edf3" }}
          />
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
              alt={username}
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
          <AnimatedSprite type={type} width={96} height={96} />
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
                const dominantPct = leftWins ? 100 - axis.score : axis.score;

                return (
                  <div key={axis.left} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
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
                    <div style={{ height: "10px", background: "#21262d", position: "relative" }}>
                      <div style={{
                        position: "absolute",
                        top: 0,
                        [leftWins ? "left" : "right"]: 0,
                        height: "100%",
                        width: `${dominantPct}%`,
                        background: meta.color,
                      }} />
                    </div>
                    <div style={{ display: "flex", justifyContent: leftWins ? "flex-start" : "flex-end" }}>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: meta.color }}>
                        {dominantPct}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {(() => {
          const compat = COMPATIBILITY[type];
          if (!compat) return null;
          const rows = [
            { key: compat.good, typeMeta: TYPE_META[compat.good], reason: compat.goodReason, sign: "+", signColor: "#3fb950", label: "같이 일하면 잘 맞는 유형" },
            { key: compat.bad,  typeMeta: TYPE_META[compat.bad],  reason: compat.badReason,  sign: "-", signColor: "#f85149", label: "같이 일하면 힘든 유형" },
          ];
          return (
            <div
              className="w-full max-w-md"
              style={{ background: "#161b22", border: "1px solid #30363d" }}
            >
              <div style={{ padding: "8px 16px", borderBottom: "1px solid #30363d" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "#484f58" }}>
                  // 협업 궁합
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {rows.map(({ key, typeMeta, reason, sign, signColor, label }, i) => (
                  <div
                    key={key}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                      padding: "16px 20px",
                      borderBottom: i === 0 ? "1px solid #21262d" : "none",
                    }}
                  >
                    <AnimatedSprite type={key} width={48} height={48} style={{ flexShrink: 0 }} />
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px", minWidth: 0 }}>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "#484f58" }}>
                        <span style={{ color: signColor }}>{sign}</span> {label}
                      </span>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: typeMeta.color, fontWeight: "700" }}>
                        {typeMeta.label}
                      </span>
                      <p style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "#8b949e", lineHeight: "1.6", margin: 0 }}>
                        {reason}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        <div className="flex flex-col items-center gap-3">
          <div className="flex flex-wrap justify-center gap-3">
            <SaveImageButton
              type={type}
              label={meta.label}
              color={meta.color}
              hook={meta.hook}
              desc={meta.desc}
              long={meta.long}
              username={username}
            />
            <BadgeModal
              username={username}
              smallBadgeUrl={smallBadgeUrl}
              cardBadgeUrl={cardBadgeUrl}
              smallMarkdown={smallMarkdown}
              smallHtml={smallHtml}
              cardMarkdown={cardMarkdown}
              cardHtml={cardHtml}
              typeColor={meta.color}
              typeEmoji={badgeMeta.emoji}
              typeLabel={badgeMeta.label}
              typeEn={badgeMeta.en}
            />
            <ShareUrlButton
              url={`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/result/${username}`}
            />
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
            <Link
              href="/"
              className="text-xs"
              style={{
                color: "#484f58",
                fontFamily: "var(--font-mono)",
                textDecoration: "none",
                borderBottom: "1px solid #484f58",
                paddingBottom: "1px",
              }}
            >
              ↩ 다시 분석하기
            </Link>
          </div>
        </div>
      </main>

      <footer
        className="flex items-center justify-center px-6 py-4 text-xs"
        style={{ borderTop: "1px solid #30363d", fontFamily: "var(--font-mono)", color: "#484f58" }}
      >
        made with ♥ by dev8ersonality
      </footer>
    </div>
  );
}
