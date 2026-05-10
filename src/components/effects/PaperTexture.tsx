"use client";

import { type CSSProperties } from "react";

const grainStyle: CSSProperties = {
  backgroundImage:
    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='1 1 1 0 0  1 1 1 0 0  1 1 1 0 0  0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
};

const stainStyle: CSSProperties = {
  backgroundImage: [
    "radial-gradient(ellipse 55% 45% at 12% 18%, rgba(153, 27, 27, 0.10), transparent 65%)",
    "radial-gradient(ellipse 70% 55% at 88% 78%, rgba(69, 10, 10, 0.18), transparent 60%)",
    "radial-gradient(ellipse 45% 40% at 78% 22%, rgba(68, 64, 60, 0.20), transparent 70%)",
    "radial-gradient(ellipse 50% 35% at 22% 75%, rgba(153, 27, 27, 0.08), transparent 75%)",
    "radial-gradient(ellipse 30% 25% at 60% 50%, rgba(180, 100, 50, 0.05), transparent 80%)",
  ].join(", "),
};

interface PaperTextureProps {
  /** Lower for subtler grain. Default 0.18. */
  grainOpacity?: number;
  /** Hide stains for sections that want clean grain only. */
  stains?: boolean;
}

/**
 * Two-layer analog paper texture: warm color stains + film grain.
 * Drop into any positioned ancestor with absolute fill. Pointer-events
 * none so it never intercepts clicks.
 */
export default function PaperTexture({
  grainOpacity = 0.18,
  stains = true,
}: PaperTextureProps) {
  return (
    <>
      {stains && (
        <div
          aria-hidden="true"
          className="absolute inset-0 z-0 pointer-events-none"
          style={stainStyle}
        />
      )}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 pointer-events-none mix-blend-screen"
        style={{ ...grainStyle, opacity: grainOpacity }}
      />
    </>
  );
}