"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const TITLE = "About me";

/**
 * SVG turbulence noise, encoded as a data URI. Self-contained — no asset
 * to download. fractalNoise at baseFrequency 0.9 reads as fine film grain
 * rather than coarse static. The colorMatrix maps the grayscale noise to
 * pure white with reduced alpha, so screen-blending lightens the dark bg.
 */
const grainStyle: CSSProperties = {
  backgroundImage:
    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='1 1 1 0 0  1 1 1 0 0  1 1 1 0 0  0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
};

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  const [typedTitle, setTypedTitle] = useState("");
  const [showCursor, setShowCursor] = useState(false);

  // Typewriter — fires when the title scrolls into view. IntersectionObserver
  // rather than ScrollTrigger because this is React state, not a transform.
  useEffect(() => {
    if (typeof window === "undefined") return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setTypedTitle(TITLE);
      return;
    }

    const node = titleRef.current;
    if (!node) return;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || cancelled) return;
        observer.disconnect();
        setShowCursor(true);

        let i = 0;
        const tick = () => {
          if (cancelled) return;
          i++;
          setTypedTitle(TITLE.slice(0, i));
          if (i < TITLE.length) {
            // Slight jitter — humans aren't metronomes
            timer = setTimeout(tick, 95 + Math.random() * 65);
          } else {
            // Linger blink, then retire the cursor
            timer = setTimeout(() => {
              if (!cancelled) setShowCursor(false);
            }, 1100);
          }
        };
        tick();
      },
      { threshold: 0.4 }
    );

    observer.observe(node);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  useGSAP(
    () => {
      if (!sectionRef.current) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.from("[data-about-eyebrow]", {
        opacity: 0,
        y: 8,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
      });

      gsap.from("[data-about-script]", {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "[data-about-header]",
          start: "top 75%",
        },
      });

      // Note: display title is animated by the typewriter, not GSAP.

      gsap.from("[data-about-paragraph]", {
        opacity: 0,
        y: 24,
        duration: 0.85,
        ease: "power2.out",
        stagger: 0.18,
        scrollTrigger: {
          trigger: "[data-about-text]",
          start: "top 75%",
        },
      });

      gsap.from("[data-about-signature]", {
        opacity: 0,
        x: -24,
        duration: 0.9,
        ease: "power2.out",
        scrollTrigger: {
          trigger: "[data-about-signature]",
          start: "top 90%",
        },
      });

      gsap.from("[data-about-cassettes]", {
        opacity: 0,
        y: 60,
        rotation: -4,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "[data-about-cassettes]",
          start: "top 80%",
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="about"
      aria-label="About — Daniela Brunetto"
      className="
        relative min-h-dvh w-full
        bg-ink text-bone
        py-20 md:py-32 lg:py-52 m-0
        overflow-hidden
      "
    >

      {/* Film grain — fine noise, screen-blended over stains for dust-on-dark feel */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.18] mix-blend-screen"
        style={grainStyle}
      />

      <div className="w-full min-h-full flex flex-col items-center justify-center z-10">
        {/* Header */}
        <header data-about-header className="mb-6 md:mb-10 lg:">
          <h2
            ref={titleRef}
            className="font-display text-bone text-7xl md:text-6xl lg:text-8xl xl:text-9xl leading-[0.9] uppercase relative"
            aria-label={TITLE}
          >
            {/* Invisible placeholder reserves layout space — prevents shift */}
            <span aria-hidden="true" className="invisible">
              {TITLE}
            </span>
            {/* Visible typed text overlays the placeholder */}
            <span
              aria-hidden="true"
              className="absolute inset-0"
            >
              {typedTitle}
              {showCursor && (
                <span
                  className="
                    inline-block ml-[0.04em]
                    w-[0.06em] h-[0.65em]
                    bg-bone align-baseline
                    animate-cursor-blink
                  "
                />
              )}
            </span>
          </h2>
        </header>

        {/* Two-column grid — 7/5, stacks on mobile */}
        <div className="w-dvw flex flex-col lg:flex-row items-center justify-center gap-10">
          {/* LEFT: text */}
          <div
            data-about-text
            className="space-y-5 max-w-full lg:max-w-[580px] xl:max-w-[780px] p-8 lg:p-12"
          >
            <p
              data-about-paragraph
              className="font-sans text-xs md:text-sm lg:text-base xl:text-lg leading-[1.75] text-bone/90 pl-12"
            >
              I&apos;m{" "}
              <span className="text-blood font-medium">Daniela Brunetto</span>,
              a web developer who turned her hobbies into a profession.
              Through code, I bring to life the ideas that swirl in our minds,
              acting as an intermediary between creativity and technical
              expertise.
            </p>

            <p
              data-about-paragraph
              className="font-sans text-xs md:text-sm lg:text-base xl:text-lg leading-[1.75] text-bone/90 pr-24"
            >
              I believe a website is more than just a virtual space where we
              present &ldquo;something&rdquo; or &ldquo;someone.&rdquo; I dare
              to say that, in the right eyes, it can be{" "}
              <span className="font-script text-blood text-2xl md:text-3xl lg:text-4xl leading-[0.7] align-baseline mx-0.5">
                a cradle of art
              </span>
              . By this, I don&apos;t mean specifically any of the seven
              traditional fine arts, but rather that it&apos;s another form of
              expression that, in modern times, has come to us to help us
              convey what we want to communicate to people, which is
              precisely my goal!
            </p>
          </div>

          {/* RIGHT: cassettes — larger, no caption */}
          <aside className="flex justify-center lg:justify-end">
            <div
              data-about-cassettes
              className="w-full max-w-[1024px] will-change-transform"
            >
              <Image
                src="/about/the-man.png"
                alt="A stack of cassette tapes labeled with my technical skills."
                width={1024}
                height={1024}
                className="w-full h-auto select-none"
                draggable={false}
              />
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}