import type { CSSProperties } from "react";

type BrandWordmarkProps = {
  className?: string;
  style?: CSSProperties;
  accentColor?: string;
};

export default function BrandWordmark({
  className,
  style,
  accentColor = "#58a6ff",
}: BrandWordmarkProps) {
  return (
    <span className={className} style={style} aria-label="Dev 8ersonality">
      Dev{" "}
      <span
        style={{
          display: "inline-block",
          color: accentColor,
          fontFamily: "'Courier New', var(--font-mono), monospace",
          fontSize: "1.85em",
          fontWeight: 800,
          lineHeight: 1,
          textShadow: `0 0 10px ${accentColor}44`,
          verticalAlign: "middle",
          transform: "translateY(-1px)",
          marginRight: "0.04em",
        }}
      >
        8
      </span>
      ersonality
    </span>
  );
}
