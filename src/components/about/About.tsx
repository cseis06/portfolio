"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useHeroStore } from "@/lib/stores/heroStore";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const TITLE = "About me";

const grainStyle: CSSProperties = {
  backgroundImage:
    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='1 1 1 0 0  1 1 1 0 0  1 1 1 0 0  0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
};

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const noteRemoved = useHeroStore((s) => s.noteRemoved);

  const [typedTitle, setTypedTitle] = useState("");
  const [showCursor, setShowCursor] = useState(false);

  // Typewriter — IntersectionObserver, not ScrollTrigger (it's React state)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
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
            timer = setTimeout(tick, 95 + Math.random() * 65);
          } else {
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
      // Wait for Hero's scroll-lock to release before creating any
      // ScrollTrigger. This is the orchestrator pattern that prevents
      // measurement-during-lock corruption.
      if (!noteRemoved) return;
      if (!sectionRef.current) return;

      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      // === Header / paragraph reveals (always, except reduced motion) ==
      if (!reduce) {
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
      }

      // === Zoom-out exit transition ====================================
      // Pins the section at its end. Within the pinned scroll budget,
      // scales the content stage up while fading to the next section's
      // background. When fully faded, the pin releases and the user
      // is sitting at Skills' top, which takes over with its own pin.
      //
      // Skipped under reduced motion — they get normal scroll-into-Skills.
      if (reduce) return;
      if (!stageRef.current) return;

      // Mobile gets a softer version (less scale, less pin distance)
      // because aggressive zooms feel claustrophobic on small screens.
      const isMobile = window.innerWidth < 768;
      const scaleTarget = isMobile ? 1.6 : 2.4;
      const pinDistance = isMobile ? 600 : 900;

      const exitTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          // Pin starts when the bottom of the section nears the bottom
          // of the viewport — after the user has read the content
          start: "bottom bottom",
          end: `+=${pinDistance}`,
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      exitTl
        // Phase 1 — content scales up from its center, fades out
        .to(stageRef.current, {
          scale: scaleTarget,
          opacity: 0,
          ease: "power2.in",
          duration: 1,
        })
        // Phase 2 — background bleeds to bone (matches Skills' bg).
        // Slight overlap so the scale-out isn't fully gone before the
        // background shifts — feels like emerging into the next surface.
        .to(
          sectionRef.current,
          {
            backgroundColor: "var(--color-bone)",
            ease: "power1.inOut",
            duration: 0.6,
          },
          "-=0.5"
        );
    },
    { scope: sectionRef, dependencies: [noteRemoved] }
  );

  return (
    <section
      ref={sectionRef}
      id="about"
      aria-label="About — Daniela Brunetto"
      className="
        relative w-full
        min-h-dvh
        px-6 py-16 md:px-10 md:py-24 lg:px-16 lg:py-32
        overflow-hidden
        bg-bone
      "
    >
      {/* Film grain */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.18] mix-blend-screen"
        style={grainStyle}
      />

      {/* Stage — everything inside scales up during exit. Centering with
          flex + transform-origin: center keeps the zoom symmetrical. */}
      <div
        ref={stageRef}
        className="
          relative z-10
          mx-auto max-w-7xl
          min-h-[calc(100dvh-8rem)]
          flex items-center justify-center
          will-change-transform
        "
        style={{ transformOrigin: "center center" }}
      >
        <div
          className="
            w-full
            grid grid-cols-1 lg:grid-cols-12
            gap-10 lg:gap-12
            items-center
          "
        >
          {/* LEFT — text. 7 cols on lg, full width on mobile. */}
          <div data-about-text className="lg:col-span-7 space-y-5">
            <h2
              ref={titleRef}
              className="
                font-display text-ink uppercase relative
                text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl
                leading-[0.9] pb-6 md:pb-10
              "
              aria-label={TITLE}
            >
              <span aria-hidden="true" className="invisible">
                {TITLE}
              </span>
              <span aria-hidden="true" className="absolute inset-0">
                {typedTitle}
                {showCursor && (
                  <span
                    className="
                      inline-block ml-[0.04em]
                      w-[0.07em] h-[0.7em]
                      bg-ink align-baseline
                      animate-cursor-blink
                    "
                  />
                )}
              </span>
            </h2>

            {/* Paragraphs — asymmetric indents on desktop, flush on mobile */}
            <p
              data-about-paragraph
              className="
                font-sans text-sm md:text-base lg:text-lg
                leading-[1.75] text-ink/90
                lg:pl-12 xl:pl-20
              "
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
              className="
                font-sans text-sm md:text-base lg:text-lg
                leading-[1.75] text-ink/90
                lg:pr-12 xl:pr-20
              "
            >
              I believe a website is more than just a virtual space where we
              present &ldquo;something&rdquo; or &ldquo;someone.&rdquo; I dare
              to say that, in the right eyes, it can be{" "}
              <span
                className="
                  font-script text-blood
                  text-2xl md:text-3xl lg:text-4xl
                  leading-[0.7] align-baseline mx-0.5
                "
              >
                a cradle of art
              </span>
              . By this, I don&apos;t mean specifically any of the seven
              traditional fine arts, but rather that it&apos;s another form of
              expression that, in modern times, has come to us to help us
              convey what we want to communicate to people, which is
              precisely my goal!
            </p>
          </div>

          {/* RIGHT — portrait. 5 cols on lg. Capped by parent grid + own max. */}
          <aside className="lg:col-span-5 flex justify-center lg:justify-end">
            <div
              data-about-cassettes
              className="
                w-full
                max-w-[320px] sm:max-w-[400px] md:max-w-[460px] lg:max-w-[480px]
                will-change-transform
              "
            >
              <Image
                src="/about/about-me.png"
                alt="Portrait of Daniela Brunetto"
                width={1024}
                height={1024}
                sizes="(max-width: 640px) 320px, (max-width: 1024px) 460px, 480px"
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