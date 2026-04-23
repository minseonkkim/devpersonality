"use client";

import { useState, useEffect } from "react";
import { BadgeCopyPanel } from "@/components/BadgeCopyPanel";

type Props = {
  username: string;
  smallBadgeUrl: string;
  cardBadgeUrl: string;
  smallMarkdown: string;
  smallHtml: string;
  cardMarkdown: string;
  cardHtml: string;
  typeColor: string;
  typeEmoji: string;
  typeLabel: string;
  typeEn: string;
};

export function BadgeModal(props: Props) {
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
          background: props.typeColor,
          border: "none",
          cursor: "pointer",
          color: "#fff",
          fontFamily: "var(--font-mono)",
          boxShadow: "3px 3px 0px #000",
          transition: "background 0.15s",
        }}
      >
        README 배지
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
            {/* 닫기 버튼 */}
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
                color: props.typeColor,
              }}
            >
              README 배지
            </h1>
            <p style={{ fontSize: 12, color: "#8b949e", marginBottom: 36, fontFamily: "var(--font-mono)" }}>
              GitHub 프로필에 붙여넣으세요.
            </p>

            {/* Small Badge */}
            <h2
              style={{
                fontSize: 11,
                color: "#e6edf3",
                fontFamily: "var(--font-mono)",
                marginBottom: 14,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              Small Badge
            </h2>
            <section
              style={{
                background: "#161b22",
                border: "1px solid #30363d",
                padding: "20px",
                marginBottom: 14,
              }}
            >
              <p style={{ fontSize: 10, color: "#8b949e", marginBottom: 12, fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                미리보기
              </p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={props.smallBadgeUrl}
                alt={`dev 8ersonality: ${props.typeEmoji} ${props.typeLabel} | ${props.typeEn}`}
                style={{ display: "block" }}
              />
            </section>
            <BadgeCopyPanel markdown={props.smallMarkdown} html={props.smallHtml} />

            {/* Card Badge */}
            <h2
              style={{
                fontSize: 11,
                color: "#e6edf3",
                fontFamily: "var(--font-mono)",
                marginTop: 40,
                marginBottom: 14,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              Card Badge
            </h2>
            <section
              style={{
                background: "#161b22",
                border: "1px solid #30363d",
                padding: "20px",
                marginBottom: 14,
              }}
            >
              <p style={{ fontSize: 10, color: "#8b949e", marginBottom: 12, fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                미리보기
              </p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={props.cardBadgeUrl}
                alt={`dev 8ersonality card: ${props.typeLabel}`}
                style={{ display: "block", maxWidth: "100%", height: "auto" }}
              />
            </section>
            <BadgeCopyPanel markdown={props.cardMarkdown} html={props.cardHtml} />

            <div
              style={{
                marginTop: 32,
                padding: "14px 18px",
                background: props.typeColor + "0d",
                border: `1px solid ${props.typeColor}33`,
                fontSize: 11,
                color: props.typeColor,
                fontFamily: "var(--font-mono)",
              }}
            >
              {props.typeEmoji} {props.typeLabel} · {props.typeEn}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
