"use client";

import { useState } from "react";

type CopyKey = "markdown" | "html" | null;

export function BadgeCopyPanel({ markdown, html }: { markdown: string; html: string }) {
  const [copied, setCopied] = useState<CopyKey>(null);

  async function copy(key: CopyKey, text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <CodeBlock
        label="Markdown"
        code={markdown}
        isCopied={copied === "markdown"}
        onCopy={() => copy("markdown", markdown)}
      />
      <CodeBlock
        label="HTML"
        code={html}
        isCopied={copied === "html"}
        onCopy={() => copy("html", html)}
      />
    </div>
  );
}

function CodeBlock({
  label,
  code,
  isCopied,
  onCopy,
}: {
  label: string;
  code: string;
  isCopied: boolean;
  onCopy: () => void;
}) {
  return (
    <div
      style={{
        background: "#0d1117",
        border: "1px solid #30363d",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 16px",
          background: "#161b22",
          borderBottom: "1px solid #30363d",
        }}
      >
        <span
          style={{
            fontSize: 11,
            color: "#8b949e",
            fontFamily: "Geist Mono, monospace",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {label}
        </span>
        <button
          onClick={onCopy}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "transparent",
            border: "1px solid #30363d",
            color: isCopied ? "#3fb950" : "#8b949e",
            padding: "3px 10px",
            cursor: "pointer",
            fontSize: 11,
            fontFamily: "Geist Mono, monospace",
          }}
        >
          {isCopied ? <CheckIcon /> : <CopyIcon />}
          {isCopied ? "복사됨" : "복사"}
        </button>
      </div>
      <pre
        style={{
          margin: 0,
          padding: "14px 16px",
          fontSize: 12,
          fontFamily: "Geist Mono, monospace",
          color: "#e6edf3",
          overflowX: "auto",
          whiteSpace: "pre-wrap",
          wordBreak: "break-all",
        }}
      >
        {code}
      </pre>
    </div>
  );
}

function CopyIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
