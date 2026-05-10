"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useHeroStore } from "@/lib/stores/heroStore";
import { useSfx } from "@/hooks/useSfx";

export default function StickyNote() {
  // The ref now points to the visual note (a div), not the click target.
  // This separation is the whole point of the refactor.
  const noteRef = useRef<HTMLDivElement>(null);
  const { noteRemoved, removeNote } = useHeroStore();

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
      .to(noteRef.current, {
        rotation: -6,
        y: -12,
        duration: 0.18,
        ease: "power1.out",
      })
      .to(noteRef.current, {
        y: typeof window !== "undefined" ? window.innerHeight + 300 : 1200,
        x: `+=${driftX}`,
        rotation: `+=${spin}`,
        duration: 1.35,
        ease: "power2.in",
      })
      .to(
        noteRef.current,
        { opacity: 0, duration: 0.25, ease: "power1.out" },
        "-=0.3"
      );
  };

  return (
    <>
      {/* Full-section click target. Transparent, covers the viewport,
          sits beneath the note visually but accepts clicks from anywhere.
          Receives keyboard focus so Enter/Space still triggers the fall. */}
      <button
        type="button"
        onClick={handleFall}
        disabled={noteRemoved}
        aria-label="Click anywhere to reveal the portrait"
        className="
          absolute inset-0 z-10
          cursor-pointer
          bg-transparent
          focus-visible:outline-none
          focus-visible:ring-2 focus-visible:ring-blood
          focus-visible:ring-offset-4 focus-visible:ring-offset-bone
        "
      />

      {/* The note itself — purely visual. pointer-events: none means
          clicks pass THROUGH it to the overlay button beneath. */}
      <div
        ref={noteRef}
        className="
          absolute inset-0 z-20
          grid place-items-center
          pointer-events-none
          will-change-transform
        "
      >
        <div
          className="
            relative
            w-[clamp(180px,40vw,345px)] aspect-[10/7]
            -translate-y-[62%]
          "
          style={{
            transform: "rotate(-7deg)",
            transformOrigin: "50% 0%",
            filter: "drop-shadow(0 6px 14px rgba(12,10,9,0.28))",
          }}
        >
          <Image
            src="/hero/notef.png"
            alt=""
            fill
            priority
            sizes="(max-width: 768px) 40vw, 345px"
            className="object-contain select-none"
            draggable={false}
          />
        </div>
      </div>
    </>
  );
}