"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface AnimatedSpriteProps {
  type: string;
  width: number;
  height: number;
  style?: React.CSSProperties;
  fps?: number;
}

export function AnimatedSprite({ type, width, height, style, fps = 2 }: AnimatedSpriteProps) {
  const [frame, setFrame] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((f) => (f === 1 ? 2 : 1));
    }, 1000 / fps);
    return () => clearInterval(interval);
  }, [fps]);

  return (
    <Image
      src={`/sprites/${type}${frame}.png`}
      alt={type}
      width={width}
      height={height}
      style={{ imageRendering: "pixelated", ...style }}
      unoptimized
    />
  );
}
