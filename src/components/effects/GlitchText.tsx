"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

type Variant = {
  className: string;
  style?: CSSProperties;
};

/**
 * Font variants cycled at random. Index 0 (Barrio) is the SSR/initial
 * paint — designed look first, glitch starts client-side after mount.
 *
 * "no font" forces a generic serif. If we left it unstyled it would
 * inherit body's Montserrat, which would make that variant invisible.
 */
const VARIANTS: readonly Variant[] = [
  { className: "font-display", style: { fontWeight: 400 } },          // Barrio
  { className: "", style: { fontFamily: "serif", fontWeight: 100 } }, // "no font" 100
  { className: "", style: { fontFamily: "serif", fontWeight: 400 } }, // "no font" 400
  { className: "", style: { fontFamily: "serif", fontWeight: 900 } }, // "no font" 900
  { className: "", style: { fontFamily: "sans-serif", fontWeight: 100 } }, // "no font" two 100
  { className: "", style: { fontFamily: "sans-serif", fontWeight: 400 } }, // "no font" two 400
  { className: "", style: { fontFamily: "sans-serif", fontWeight: 900 } }, // "no font" two 900
  { className: "font-sans", style: { fontWeight: 100 } },             // Montserrat 100
  { className: "font-sans", style: { fontWeight: 300 } },             // Montserrat 300
  { className: "font-sans", style: { fontWeight: 600 } },             // Montserrat 600
  { className: "font-sans", style: { fontWeight: 900 } },             // Montserrat 900
  // { className: "font-script", style: { fontWeight: 400 } },           // Luxurious
];

// Narrow set of HTML elements that accept children. Excludes void elements
// like br/img/input/hr where children would be invalid HTML anyway.
type GlitchTag =
  | "span"
  | "div"
  | "p"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "strong"
  | "em"
  | "li"
  | "a"
  | "button"
  | "label";

interface GlitchTextProps {
  children: ReactNode;
  as?: GlitchTag;
  interval?: number;
  className?: string;
  enabled?: boolean;
}

export default function GlitchText({
  children,
  as: Tag = "span",
  interval = 200,
  className = "",
  enabled = true,
}: GlitchTextProps) {
  const [variantIdx, setVariantIdx] = useState(0);
  const lastIdxRef = useRef(0);

  useEffect(() => {
    if (!enabled) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const id = window.setInterval(() => {
      let next: number;
      do {
        next = Math.floor(Math.random() * VARIANTS.length);
      } while (next === lastIdxRef.current && VARIANTS.length > 1);
      lastIdxRef.current = next;
      setVariantIdx(next);
    }, interval);

    return () => window.clearInterval(id);
  }, [interval, enabled]);

  const variant = VARIANTS[variantIdx];
  return (
    <Tag
      className={`${variant.className} ${className}`.trim()}
      style={variant.style}
    >
      {children}
    </Tag>
  );
}