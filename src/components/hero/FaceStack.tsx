"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useHeroStore } from "@/lib/stores/heroStore";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Layered portrait stack. Base face always visible; each word layer fades
 * in cumulatively as the user scrolls through the pinned hero.
 *
 * The ScrollTrigger only initializes once the note has been removed — before
 * that, scroll is locked anyway, so there'd be nothing to trigger.
 */

const LAYERS = [
  { src: "/hero/me-dither.jpg", key: "base" },
  { src: "/hero/me-dither-who.jpg", key: "who" },
  { src: "/hero/me-dither-i.jpg", key: "i" },
  { src: "/hero/me-dither-am.jpg", key: "am" },
  { src: "/hero/me-dither-ask.jpg", key: "ask" },
] as const;

export default function FaceStack({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLElement | null>;
}) {
  const stackRef = useRef<HTMLDivElement>(null);
  const noteRemoved = useHeroStore((s) => s.noteRemoved);
  const setRevealComplete = useHeroStore((s) => s.setRevealComplete);

  useGSAP(
    () => {
      if (!noteRemoved || !containerRef.current || !stackRef.current) return;

      const layers = stackRef.current.querySelectorAll<HTMLElement>(
        "[data-word-layer]"
      );

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      // ~500px of scroll per word feels right — enough that scrubbing
      // doesn't feel rushed, not so much that it drags.
      const scrollDistance = reduceMotion ? 600 : 2200;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: `+=${scrollDistance}`,
          pin: true,
          scrub: reduceMotion ? false : 0.6,
          anticipatePin: 1,
          onLeave: () => setRevealComplete(true),
          onEnterBack: () => setRevealComplete(false),
        },
      });

      // Each layer crossfades in over the previous. Position labels keep
      // them sequential with a slight overlap for organic blending.
      layers.forEach((layer, i) => {
        tl.to(layer, { opacity: 1, duration: 1, ease: "power1.inOut" }, i * 0.9);
      });
    },
    { scope: containerRef, dependencies: [noteRemoved] }
  );

  return (
    <div
      ref={stackRef}
      className="
        relative
        w-[820px] aspect-square
        mx-auto
        select-none
      "
    >
      {LAYERS.map((layer, i) => (
        <div
          key={layer.key}
          data-word-layer={i > 0 ? layer.key : undefined}
          className="absolute inset-0"
          style={{ opacity: i === 0 ? 1 : 0 }}
        >
          <Image
            src={layer.src}
            alt={i === 0 ? "Portrait" : ""}
            fill
            priority={i === 0}
            sizes="(max-width: 768px) 92vw, 820px"
            className="object-contain"
            draggable={false}
          />
        </div>
      ))}
    </div>
  );
}