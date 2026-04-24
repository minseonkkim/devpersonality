"use client";

import { useState, useEffect } from "react";
import { AnimatedSprite } from "@/components/AnimatedSprite";

const ALL_TYPES: Record<string, { label: string; en: string; emoji: string; color: string; desc: string; hook: string; long: string }> = {
  gardener:   { label: "꾸준형",  en: "Gardener",   emoji: "🌱", color: "#4CAF50", desc: "매일 물을 주듯 꾸준히",    hook: "잔디 비어있는 날,\n자기 전에 한 번 더 열어보죠?",                  long: "잔디 하나 비는 게 그냥 넘어가지지 않는 사람입니다. 아, 오늘 커밋 안 했네 — 하고 자기 전에 노트북 다시 여는 그 사람.\n\n드라마틱한 성격은 아닌데, 그게 오히려 강점입니다. 폭발하지 않는 대신 꺼지지도 않거든요. 요란하지 않아도 결국 가장 멀리 가는 타입입니다." },
  sprinter:   { label: "몰입형",  en: "Sprinter",   emoji: "⚡", color: "#FF5722", desc: "한 번 달리면 멈추지 않아", hook: "일주일 조용하다가 어느 날\n커밋 20개. 그게 바로 당신.",              long: "평소엔 멀쩡한 사람인데 갑자기 사라집니다. 며칠 후 커밋 20개와 함께 귀환.\n\n에너지가 전부 아니면 제로입니다. 관심 없을 땐 아무것도 안 하다가, 꽂히면 밥도 잊고 화장실도 참습니다. 그 집중력이 폭발하는 순간만큼은 아무도 못 따라옵니다. 데드라인이 최고의 연료입니다." },
  architect:  { label: "설계형",  en: "Architect",  emoji: "🏗️", color: "#3B5EDE", desc: "짓기 전에 먼저 그린다",    hook: "README부터 쓰고 코드는 나중에.\n다이어그램 없이는 못 시작하죠?",    long: "코드 한 줄 치기 전에 이미 머릿속에서 설계가 끝나 있는 사람입니다. 폴더 구조가 마음에 안 들면 아무것도 못 합니다.\n\n'일단 짜고 나중에 고치자'는 말이 가장 무섭습니다. 나중에 고친다는 보장이 없다는 거 알거든요. 처음부터 제대로 — 그게 결국 제일 빠른 길이라고 믿는 사람입니다." },
  hacker:     { label: "실험형",  en: "Hacker",     emoji: "🔧", color: "#FFC107", desc: "일단 해보고 생각한다",     hook: "새벽 2시에 'wip: 일단 돌아감' 커밋,\n한 번쯤 있죠?",               long: "일단 돌아가면 된 겁니다. 완벽한 계획보다 지금 당장 눌러보는 게 더 많은 걸 알려준다고 생각합니다.\n\n새벽 2시에 'wip: 일단 됨'을 올리고 자는 것도 본인에겐 진지한 개발입니다. 실패도 결과고, 결과는 데이터니까요. 남들이 검증된 길을 갈 때, 혼자 옆길 개척하는 걸 즐기는 사람입니다." },
  researcher: { label: "탐구형",  en: "Researcher", emoji: "🔬", color: "#009688", desc: "왜인지 알아야 직성이 풀려", hook: "라이브러리 쓰기 전에\n소스 코드 먼저 열어보는 사람.",               long: "npm install 하고 바로 소스 코드 여는 사람입니다. 어떻게 쓰는지보다 어떻게 만들어졌는지가 더 궁금하거든요.\n\n'그냥 되니까 쓰면 되지'는 이 사람 사전에 없습니다. 원리를 알아야 편안하고, 모르는 채로 쓰면 뭔가 찜찜합니다. 파고들수록 재밌어지는 걸 알아버린 사람입니다." },
  craftsman:  { label: "장인형",  en: "Craftsman",  emoji: "🎯", color: "#FF8F00", desc: "디테일에 영혼을 건다",     hook: "변수명 하나 고치는 데 10분.\n남이 짠 코드 보면 손이 근질근질하죠?", long: "기능은 돌아가는데 변수명이 마음에 안 들어서 다시 여는 사람입니다. 리뷰 요청 받으면 댓글이 제일 많습니다.\n\n'대충 되면 됐지'가 제일 듣기 싫은 말입니다. 내 이름이 붙은 코드가 부끄러우면 안 된다고 생각하거든요. 느리다는 말 들어도 괜찮습니다. 어차피 나중에 안 건드려도 되는 코드 짜는 사람이 이 사람이니까요." },
  explorer:   { label: "탐험형",  en: "Explorer",   emoji: "🧭", color: "#29B6F6", desc: "새로운 기술이 있다면 GO",  hook: "이번 달 또 새 언어 시작했죠?\n사이드 프로젝트 몇 개인지도 모르고.",  long: "새 프레임워크 나왔다는 글 보면 탭이 하나 더 열립니다. 아, 이건 써봐야 해 — 하고 그날 바로 설치합니다.\n\n레포가 몇 개인지는 본인도 잘 모릅니다. 한 가지에 오래 머무르는 건 좀 답답하고, 새로운 세계를 직접 부딪혀보는 게 맞습니다. 새로운 걸 좋아하는 게 산만한 게 아니라 — 더 나은 게 있을 거라는 확신 때문입니다." },
  builder:    { label: "빌더형",  en: "Builder",    emoji: "🚀", color: "#E53935", desc: "만들고 배포하고 또 만든다", hook: "아이디어 떠오르면 일단 레포부터 파는 사람.\n배포 안 하면 의미없죠.", long: "아이디어 떠오르면 그날 레포 팝니다. 기획서보다 README가 먼저고, 배포 안 한 건 만든 게 아닙니다.\n\n완벽해질 때까지 기다리면 영원히 못 냅니다. 일단 세상에 꺼내놓고, 망하면 배우고, 되면 발전시키면 됩니다. 개발자이기 전에 뭔가를 계속 만들어야 직성이 풀리는 사람 — 메이커에 가깝습니다." },
};

type Props = {
  currentType: string;
  typeColor: string;
};

export function AllTypesModal({ currentType, typeColor }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-5 py-3 text-xs"
        style={{
          background: "transparent",
          border: `1px solid ${typeColor}`,
          cursor: "pointer",
          color: typeColor,
          fontFamily: "var(--font-mono)",
          boxShadow: `3px 3px 0px ${typeColor}4d`,
          transition: "background 0.15s",
        }}
      >
        전체 유형 보기
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(1,4,9,0.85)",
            zIndex: 50,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            padding: "40px 16px",
            overflowY: "auto",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: 600,
              background: "#0d1117",
              border: "1px solid #30363d",
              padding: "32px 28px",
              position: "relative",
            }}
          >
            <button
              onClick={() => setOpen(false)}
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                background: "transparent",
                border: "1px solid #30363d",
                color: "#8b949e",
                width: 28,
                height: 28,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                lineHeight: 1,
              }}
            >
              ✕
            </button>

            <h1
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 13,
                marginBottom: 6,
                color: typeColor,
              }}
            >
              전체 유형
            </h1>
            <p style={{ fontSize: 12, color: "#8b949e", marginBottom: 36, fontFamily: "var(--font-mono)" }}>
              8가지 개발자 유형을 확인해보세요.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {Object.entries(ALL_TYPES).map(([key, meta]) => {
                const isCurrent = key === currentType;
                return (
                  <div
                    key={key}
                    style={{
                      background: "#161b22",
                      border: `${isCurrent ? "2px" : "1px"} solid ${isCurrent ? meta.color : "#30363d"}`,
                      boxShadow: isCurrent ? `6px 6px 0px ${meta.color}4d` : "none",
                      padding: "24px 20px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 12,
                      position: "relative",
                    }}
                  >
                    {isCurrent && (
                      <span
                        style={{
                          position: "absolute",
                          top: 10,
                          right: 10,
                          fontFamily: "var(--font-mono)",
                          fontSize: 9,
                          color: meta.color,
                          background: `${meta.color}1a`,
                          border: `1px solid ${meta.color}4d`,
                          padding: "2px 6px",
                        }}
                      >
                        나의 유형
                      </span>
                    )}

                    <AnimatedSprite type={key} width={80} height={80} />

                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 12,
                        background: `${meta.color}1a`,
                        color: meta.color,
                        border: `1px solid ${meta.color}4d`,
                        padding: "4px 12px",
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                      }}
                    >
                      {meta.label}
                    </span>

                    <p
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 11,
                        color: meta.color,
                        background: `${meta.color}0d`,
                        border: `1px solid ${meta.color}33`,
                        padding: "10px 16px",
                        lineHeight: "1.7",
                        width: "100%",
                        whiteSpace: "pre-line",
                        textAlign: "center",
                        margin: 0,
                      }}
                    >
                      &ldquo;{meta.hook}&rdquo;
                    </p>

                    <p
                      style={{
                        fontSize: 13,
                        color: "#8b949e",
                        lineHeight: "1.8",
                        textAlign: "center",
                        margin: 0,
                      }}
                    >
                      {meta.long}
                    </p>
                  </div>
                );
              })}
            </div>

            <div
              style={{
                marginTop: 32,
                padding: "14px 18px",
                background: typeColor + "0d",
                border: `1px solid ${typeColor}33`,
                fontSize: 11,
                color: typeColor,
                fontFamily: "var(--font-mono)",
              }}
            >
              {ALL_TYPES[currentType]?.emoji} {ALL_TYPES[currentType]?.label} · {ALL_TYPES[currentType]?.en}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
