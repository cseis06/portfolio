"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useHeroStore } from "@/lib/stores/heroStore";
import { useSfx } from "@/hooks/useSfx";

export default function StickyNote() {
  const noteRef = useRef<HTMLButtonElement>(null);
  const { noteRemoved, removeNote } = useHeroStore();

  // One-shot SFX. The asset bundles click + woosh in a single file.
  const { play: playClickWoosh } = useSfx("/sfx/click-woosh.mp3", {
    volume: 0.85,
  });

  useGSAP(
    () => {
      if (!noteRef.current) return;

      // Idle sway — paper hangs, never static.
      gsap.to(noteRef.current, {
        rotation: "+=1.2",
        duration: 3.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    },
    { scope: noteRef }
  );

  const handleFall = () => {
    if (noteRemoved || !noteRef.current) return;

    // Fire inside the user gesture — guarantees the audio plays even
    // on strict autoplay browsers (Safari, Firefox with hardening).
    playClickWoosh();

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      gsap.to(noteRef.current, {
        opacity: 0,
        duration: 0.4,
        onComplete: removeNote,
      });
      return;
    }

    gsap.killTweensOf(noteRef.current);

    const driftX = gsap.utils.random(-60, 120);
    const spin = gsap.utils.random(25, 55);

    const tl = gsap.timeline({ onComplete: removeNote });

    tl
      // 1. Pre-fall pop — the tape gives way.
      .to(noteRef.current, {
        rotation: -6,
        y: -12,
        duration: 0.18,
        ease: "power1.out",
      })
      // 2. Gravity, drift, tumble.
      .to(noteRef.current, {
        y: typeof window !== "undefined" ? window.innerHeight + 300 : 1200,
        x: `+=${driftX}`,
        rotation: `+=${spin}`,
        duration: 1.35,
        ease: "power2.in",
      })
      // 3. Fade out before fully off-screen.
      .to(
        noteRef.current,
        { opacity: 0, duration: 0.25, ease: "power1.out" },
        "-=0.3"
      );
  };

  return (
    <div className="absolute inset-0 grid place-items-center pointer-events-none">
      <div className="relative w-[clamp(180px,40vw,345px)] aspect-[10/7] -translate-y-[62%]">
        <button
          ref={noteRef}
          type="button"
          onClick={handleFall}
          aria-label="Remove the sticky note to reveal the portrait"
          disabled={noteRemoved}
          className="
            relative block w-full h-full
            pointer-events-auto cursor-pointer
            outline-none
            transition-[filter] duration-200
            hover:[filter:drop-shadow(0_8px_18px_rgba(12,10,9,0.35))]
            focus-visible:[filter:drop-shadow(0_0_0_3px_var(--color-blood))]
            will-change-transform
          "
          style={{
            transform: "rotate(-7deg)",
            transformOrigin: "50% 0%",
            filter: "drop-shadow(0 6px 14px rgba(12,10,9,0.28))",
          }}
        >
          <Image
            src="/hero/note.png"
            alt=""
            fill
            priority
            sizes="(max-width: 768px) 60vw, 420px"
            className="object-contain select-none pointer-events-none"
            draggable={false}
          />
        </button>
      </div>
    </div>
  );
}