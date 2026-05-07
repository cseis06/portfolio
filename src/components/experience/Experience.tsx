"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PaperTexture from "../effects/PaperTexture";
import { experience } from "@/lib/data/experience";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const TITLE = "Experience";
const SCROLL_PER_ENTRY = 600; // px of virtual scroll allotted to each entry

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);

  

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      // Refresh once everything (fonts, images, async-mounted scenes) settles.
      // ScrollTrigger's initial measurement happens before TVScene mounts,
      // which throws off Experience's document position. Refreshing after
      // load resyncs everything.
      const onLoad = () => ScrollTrigger.refresh();
      if (document.readyState === "complete") {
        // Already loaded — refresh on next tick to let layout settle
        requestAnimationFrame(() => ScrollTrigger.refresh());
      } else {
        window.addEventListener("load", onLoad, { once: true });
      }
      
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      

      // Header animations always run (not gated by motion pref because
      // they're tiny fades).
      if (!reduce) {
        gsap.from("[data-exp-eyebrow]", {
          opacity: 0,
          y: 8,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        });

        gsap.from("[data-exp-script]", {
          opacity: 0,
          y: 20,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "[data-exp-header]",
            start: "top 75%",
          },
        });

        gsap.from("[data-exp-display]", {
          opacity: 0,
          y: 40,
          duration: 1,
          ease: "power3.out",
          delay: 0.15,
          scrollTrigger: {
            trigger: "[data-exp-header]",
            start: "top 75%",
          },
        });
      }

      // === REDUCED MOTION: fall through to static layout ================
      if (reduce) return;

      // === PINNED SCROLL-SCRUB =========================================
      // Lay out cards stacked at the same position. Card 0 starts visible;
      // others below the viewport offset, ready to slide up.
      const cards = gsap.utils.toArray<HTMLElement>("[data-exp-card]");
      if (cards.length === 0) return;

      // Sync GSAP's transform tracking with the inline initial state.
      // Without this, the first tween from card 0 would interpolate from
      // "0,0,0" (GSAP's default) rather than the actual rendered position.
      gsap.set(cards[0], { y: 0, rotation: 0, opacity: 1 });
      cards.slice(1).forEach((card) => {
        gsap.set(card, { y: 80, rotation: 1.5, opacity: 0 });
      });

      const transitionCount = cards.length - 1; // N-1 transitions for N cards
      const totalScroll = SCROLL_PER_ENTRY * (cards.length + 1);
      // ^ +1 gives breathing room at the end (last card lingers before unpin)

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: `+=${totalScroll}`,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // First "beat" — hold the first card visible. Empty tween reserves
      // scroll real estate so the user has a moment with card 0 before
      // anything moves.
      tl.to({}, { duration: 1 });

      // Sequential transitions: each one fades out current, fades in next
      cards.slice(1).forEach((nextCard, i) => {
        const currentCard = cards[i];
        const beatStart = `+=${0}`; // immediately follows previous

        tl
          // Current card exits up
          .to(
            currentCard,
            {
              opacity: 0,
              y: -80,
              rotation: -1.5,
              duration: 1,
              ease: "power2.inOut",
            },
            beatStart
          )
          // Next card enters from below, settling flat
          .to(
            nextCard,
            {
              opacity: 1,
              y: 0,
              rotation: 0,
              duration: 1,
              ease: "power2.out",
            },
            "<0.15" // slight overlap — feels like a hand-off
          )
          // Linger on the new card before next transition (or unpin)
          .to({}, { duration: 0.7 });
      });

      // Avoid an unused-variable lint nag while keeping the count visible
      // for anyone reading this file.
      void transitionCount;
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="experience"
      aria-label="Experience — Daniela Brunetto"
      className="
        relative min-h-screen w-full
        bg-ink text-bone
        px-6 py-20 md:px-12 md:py-28 lg:px-20 lg:py-32
        overflow-hidden
      "
    >
      <PaperTexture />

      {/* Editorial corners */}
      <div className="absolute top-6 left-6 md:top-10 md:left-12 z-10 pointer-events-none">
        <p
          data-exp-eyebrow
          className="font-sans text-[10px] uppercase tracking-[0.4em] text-bone/50"
        >
          § IV — Case File
        </p>
      </div>
      <div className="absolute top-6 right-6 md:top-10 md:right-12 z-10 pointer-events-none text-right">
        <p className="font-sans text-[10px] uppercase tracking-[0.4em] text-bone/50">
          Confidential
        </p>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl mt-16 md:mt-20">
        {/* Header */}
        <header data-exp-header className="mb-16 md:mb-20">
          <p
            data-exp-script
            className="font-script text-blood text-5xl md:text-7xl leading-none mb-1 -ml-1"
          >
            on the record,
          </p>
          <h2
            data-exp-display
            className="font-display text-bone text-7xl md:text-[9rem] leading-[0.9] uppercase"
          >
            {TITLE}
          </h2>
        </header>

        {/* Two-column: intro + CV (left), card stage (right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* LEFT — sidebar (no longer sticky; the section pins instead) */}
          <aside className="lg:col-span-4 space-y-10">
            <div data-exp-intro className="space-y-5 max-w-sm">
              <p className="font-sans text-[10px] uppercase tracking-[0.35em] text-blood">
                ▸ Subject Dossier
              </p>
              <p className="font-sans text-base leading-[1.7] text-bone/85">
                A working record of where I&apos;ve been, what I&apos;ve
                built, and the rooms I&apos;ve been hired into. Filed
                reverse-chronologically — most recent up top.
              </p>
              <p className="font-script text-blood/90 text-2xl">
                read it like a case file.
              </p>
            </div>

            <a
              data-exp-cv
              href="/cv/daniela-brunetto-cv.pdf"
              download
              className="
                group inline-flex items-center gap-4
                px-5 py-4
                bg-bone text-ink
                border-2 border-bone
                hover:bg-blood hover:text-bone hover:border-blood
                transition-colors duration-200
                shadow-[4px_4px_0_0_rgba(153,27,27,0.6)]
                hover:shadow-[6px_6px_0_0_rgba(250,250,249,0.2)]
              "
              aria-label="Download CV (PDF)"
            >
              <span className="flex flex-col items-start">
                <span className="font-sans text-[10px] uppercase tracking-[0.35em] opacity-70">
                  File · Annex A
                </span>
                <span className="font-display text-2xl uppercase leading-none mt-1">
                  Download CV
                </span>
              </span>
              <span
                aria-hidden="true"
                className="
                  text-3xl leading-none
                  transition-transform duration-200
                  group-hover:translate-y-0.5
                "
              >
                ↓
              </span>
            </a>

            {/* Progress indicator — one tick per entry, fills as user
                advances through the pinned scroll. Subtle but useful so
                visitors know "where" they are in the experience set. */}
          </aside>

          {/* RIGHT — card stage. CSS Grid stacks cards in the same cell, so
              they occupy identical space without absolute positioning's
              containing-block fragility. */}
          <div className="lg:col-span-8">
            <div
              className="
                grid
                min-h-[420px] md:min-h-[460px]
              "
              style={{ gridTemplateAreas: '"stage"' }}
              role="list"
              aria-label="Work history"
            >
              {experience.map((entry, i) => (
                <article
                  key={entry.id}
                  data-exp-card
                  role="listitem"
                  className="
                    border border-bone/15
                    bg-ink/60 backdrop-blur-[1px]
                    p-6 md:p-8
                    will-change-transform
                  "
                  style={{
                    gridArea: "stage",
                    // Sync initial state — cards 1+ start hidden BEFORE GSAP runs.
                    // Eliminates the flash of unpinned content during mount.
                    opacity: i === 0 ? 1 : 0,
                    transform:
                      i === 0
                        ? "translateY(0px) rotate(0deg)"
                        : "translateY(80px) rotate(1.5deg)",
                  }}
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 mb-4">
                    <p className="font-sans text-[10px] uppercase tracking-[0.35em] text-blood">
                      ▸ Entry · {entry.id}
                    </p>
                    <p className="font-sans text-[11px] uppercase tracking-[0.25em] text-bone/55">
                      {entry.startDate} — {entry.endDate}
                    </p>
                  </div>

                  <h3 className="font-display text-bone text-3xl md:text-4xl uppercase leading-none">
                    {entry.company}
                  </h3>

                  <p className="font-script text-blood text-2xl md:text-3xl mt-2 leading-none">
                    {entry.role}
                  </p>

                  <p className="font-sans text-sm md:text-base text-bone/85 leading-[1.75] mt-5 max-w-prose">
                    {entry.description}
                  </p>

                  {entry.isPresent && (
                    <div
                      aria-hidden="true"
                      className="
                        absolute top-6 right-6
                        font-display text-blood/40 text-xs
                        uppercase tracking-[0.4em]
                        border border-blood/40 px-2 py-1
                        rotate-[-4deg]
                      "
                    >
                      Active
                    </div>
                  )}
                </article>
              ))}
            </div>

            {/* Scroll hint — only meaningful while pinned */}
            <p
              className="
                mt-8 font-sans text-[10px] uppercase tracking-[0.4em]
                text-bone/40 text-center
              "
              aria-hidden="true"
            >
              ↓ scroll to advance
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}