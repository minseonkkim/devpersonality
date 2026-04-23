"use client";

import { useState } from "react";

interface Props {
  type: string;
  label: string;
  color: string;
  hook: string;
  desc: string;
  long: string;
  username: string;
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  startY: number,
  maxWidth: number,
  lineHeight: number,
  paragraphGap: number
): number {
  const paragraphs = text.split("\n\n");
  let currentY = startY;
  for (let pi = 0; pi < paragraphs.length; pi++) {
    const words = paragraphs[pi].replace(/\n/g, " ").split(" ");
    let current = "";
    for (const word of words) {
      const test = current ? current + " " + word : word;
      if (ctx.measureText(test).width > maxWidth && current) {
        ctx.fillText(current, x, currentY);
        current = word;
        currentY += lineHeight;
      } else {
        current = test;
      }
    }
    if (current) {
      ctx.fillText(current, x, currentY);
      currentY += lineHeight;
    }
    if (pi < paragraphs.length - 1) currentY += paragraphGap;
  }
  return currentY;
}

async function loadSprite(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

export function SaveImageButton({ type, label, color, hook, desc, long, username }: Props) {
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const W = 1080;
      const H = 1920;
      const canvas = document.createElement("canvas");
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext("2d")!;

      const sprite = await loadSprite(`/sprites/${type}1.png`);

      // ── background ──────────────────────────────────────────
      ctx.fillStyle = "#0d1117";
      ctx.fillRect(0, 0, W, H);

      ctx.fillStyle = color;
      ctx.fillRect(0, 0, W, 14);

      const grad = ctx.createLinearGradient(0, H - 280, 0, H);
      grad.addColorStop(0, "rgba(0,0,0,0)");
      grad.addColorStop(1, "rgba(0,0,0,0.5)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, H - 280, W, 280);

      // ── header ───────────────────────────────────────────────
      ctx.font = '900 24px "Press Start 2P", monospace';
      ctx.fillStyle = "#e6edf3";
      ctx.textAlign = "center";
      ctx.fillText("Dev Personality", W / 2, 104);

      ctx.font = '24px "Courier New", monospace';
      ctx.fillStyle = "#484f58";
      ctx.fillText("// github activity analysis", W / 2, 150);

      // ── sprite ───────────────────────────────────────────────
      if (sprite) {
        const size = 340;
        const sx = (W - size) / 2;
        const sy = 206;
        ctx.shadowColor = color;
        ctx.shadowBlur = 52;
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(sprite, sx, sy, size, size);
        ctx.shadowBlur = 0;
      }

      // ── card ─────────────────────────────────────────────────
      const cX = 72;
      const cY = 610;
      const cW = W - cX * 2;
      const cH = 1160;
      const innerW = cW - 80;

      ctx.fillStyle = "#161b22";
      ctx.fillRect(cX, cY, cW, cH);

      // type badge (centered)
      const badgePad = 28;
      ctx.font = '700 40px "Courier New", monospace';
      const badgeTW = ctx.measureText(label).width;
      const bW = badgeTW + badgePad * 2;
      const bX = (W - bW) / 2;
      const bY = cY + 52;
      ctx.fillStyle = color + "22";
      ctx.fillRect(bX, bY, bW, 58);
      ctx.strokeStyle = color + "66";
      ctx.lineWidth = 2;
      ctx.strokeRect(bX, bY, bW, 58);
      ctx.fillStyle = color;
      ctx.textAlign = "center";
      ctx.fillText(label, W / 2, bY + 41);

      // short desc (centered)
      ctx.font = '28px "Courier New", monospace';
      ctx.fillStyle = "#8b949e";
      ctx.textAlign = "center";
      ctx.fillText(desc, W / 2, cY + 172);

      // divider
      ctx.strokeStyle = "#30363d";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cX + 40, cY + 204);
      ctx.lineTo(cX + cW - 40, cY + 204);
      ctx.stroke();

      // hook quote (centered, bigger)
      ctx.font = '38px "Courier New", monospace';
      ctx.fillStyle = color;
      ctx.textAlign = "center";
      wrapText(ctx, `❝ ${hook.replace(/\n/g, " ")} ❞`, W / 2, cY + 278, innerW, 60, 0);

      // divider 2
      ctx.strokeStyle = "#30363d";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cX + 40, cY + 410);
      ctx.lineTo(cX + cW - 40, cY + 410);
      ctx.stroke();

      // long description (centered)
      ctx.font = '28px "Courier New", monospace';
      ctx.fillStyle = "#8b949e";
      ctx.textAlign = "center";
      wrapText(ctx, long, W / 2, cY + 468, innerW, 50, 30);

      // ── footer ───────────────────────────────────────────────
      ctx.font = '26px "Courier New", monospace';
      ctx.fillStyle = "#484f58";
      ctx.textAlign = "center";
      ctx.fillText(`@${username}`, W / 2, 1830);

      ctx.font = '18px "Press Start 2P", monospace';
      ctx.fillStyle = "#30363d";
      ctx.fillText("devpersonality", W / 2, 1884);

      canvas.toBlob(
        (blob) => {
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `${username}-dev-personality.png`;
          a.click();
          URL.revokeObjectURL(url);
        },
        "image/png"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <button
      onClick={handleSave}
      disabled={saving}
      className="px-5 py-3 text-xs"
      style={{
        background: saving ? "#161b22" : color,
        color: saving ? "#484f58" : "#fff",
        fontFamily: "var(--font-mono)",
        boxShadow: saving ? "none" : "3px 3px 0px #000",
        border: "none",
        cursor: saving ? "default" : "pointer",
        transition: "background 0.15s",
      }}
    >
      {saving ? "저장 중..." : "이미지로 저장하기"}
    </button>
  );
}
