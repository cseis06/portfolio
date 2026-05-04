"use client";

import { useEffect, useMemo, useRef } from "react";
import { useHeroStore } from "@/lib/stores/heroStore";
import StickyNote from "./StickyNote";
import FaceStack from "./FaceStack";
import Subtitle from "./Subtitle";

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const noteRemoved = useHeroStore((s) => s.noteRemoved);
  const revealComplete = useHeroStore((s) => s.revealComplete);

  // Scroll lock — body + html overflow until note is gone.
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    if (!noteRemoved) {
      const prevHtml = html.style.overflow;
      const prevBody = body.style.overflow;
      html.style.overflow = "hidden";
      body.style.overflow = "hidden";

      return () => {
        html.style.overflow = prevHtml;
        body.style.overflow = prevBody;
      };
    }
  }, [noteRemoved]);

  // The narrative script. Edit these strings to change the subtitles —
  // the typing logic and audio are agnostic to content.
  const subtitleText = useMemo(() => {
    if (!noteRemoved) return "Tap the note to begin.";
    if (!revealComplete) return "Now, scroll slowly.";
    return "";
  }, [noteRemoved, revealComplete]);

  return (
    <section
      ref={containerRef}
      className="
        relative
        h-screen w-full
        overflow-hidden
        bg-bone
        flex items-center justify-center
      "
      aria-label="Hero — Daniela Brunetto Portfolio"
    >
      <FaceStack containerRef={containerRef} />

      {!noteRemoved && <StickyNote />}

      {/* Editorial corners */}
      <div className="absolute top-6 left-6 md:top-8 md:left-8 pointer-events-none">
        <p className="font-sans text-[10px] uppercase tracking-[0.35em] text-ink/70">
          Vol. I
        </p>
      </div>
      <div className="absolute top-6 right-6 md:top-8 md:right-8 pointer-events-none text-right">
        <p className="font-sans text-[10px] uppercase tracking-[0.35em] text-ink/70">
          mmxxvi · dispatch nº 001
        </p>
      </div>

      {/* Subtitles — film-style, bottom center */}
      <div
        className="
          absolute bottom-10 md:bottom-14
          left-1/2 -translate-x-1/2
          w-[min(86vw,560px)]
          pointer-events-none
        "
      >
        <Subtitle text={subtitleText} />
      </div>
    </section>
  );
}