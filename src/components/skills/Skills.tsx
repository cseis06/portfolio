"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PaperTexture from "../effects/PaperTexture";
import GlitchText from "../effects/GlitchText";
import { skills, STAGES } from "@/lib/data/skills";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Virtual scroll allotted to each skill's full 4-stage transition.
// Total pinned distance = SCROLL_PER_SKILL * skills.length.
const SCROLL_PER_SKILL = 700;

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current || !stageRef.current) return;
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      // Header fade-in (always runs)
      if (!reduce) {
        gsap.from("[data-skills-eyebrow]", {
          opacity: 0,
          y: 8,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        });
        gsap.from("[data-skills-script]", {
          opacity: 0,
          y: 20,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "[data-skills-header]",
            start: "top 75%",
          },
        });
        gsap.from("[data-skills-display]", {
          opacity: 0,
          y: 40,
          duration: 1,
          ease: "power3.out",
          delay: 0.15,
          scrollTrigger: {
            trigger: "[data-skills-header]",
            start: "top 75%",
          },
        });
      }

      // Reduced motion: render the first skill statically. Section becomes
      // a tall-ish display with a stacked label list as fallback.
      if (reduce) return;

      // === FRAME-BY-FRAME TIMELINE =====================================
      // Logic per skill:
      //   stage 0 (skill)   → opacity 1 throughout the "warm" portion
      //   stage 1 (wrinkle) → fades in over stage 0
      //   stage 2 (break)   → fades in, stage 1 fades out
      //   stage 3 (pieces)  → fades in, stage 2 fades out
      //   transition out    → entire skill group fades out as next skill
      //                       fades in underneath
      //
      // Each "skill block" gets 1.0 unit of timeline. Transitions overlap
      // adjacent blocks slightly so there's never a blank frame.
      const totalScroll = SCROLL_PER_SKILL * skills.length;

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

      skills.forEach((skill, skillIdx) => {
        const blockStart = skillIdx; // each block starts on its integer label

        // Stages 1-3: cumulative crossfade within this skill
        STAGES.forEach((stage, stageIdx) => {
          if (stageIdx === 0) return; // skill base starts visible already

          const el = stageRef.current!.querySelector<HTMLElement>(
            `[data-skill="${skill.slug}"][data-stage="${stage}"]`
          );
          if (!el) return;

          // Stage transitions take 0.2 of the unit each, evenly spaced
          tl.to(
            el,
            { opacity: 1, duration: 0.2, ease: "power1.inOut" },
            blockStart + stageIdx * 0.22
          );

          // Fade out previous stage as this one comes in (clean visual)
          if (stageIdx > 1) {
            const prevStage = STAGES[stageIdx - 1];
            const prevEl = stageRef.current!.querySelector<HTMLElement>(
              `[data-skill="${skill.slug}"][data-stage="${prevStage}"]`
            );
            if (prevEl) {
              tl.to(
                prevEl,
                { opacity: 0, duration: 0.2, ease: "power1.inOut" },
                blockStart + stageIdx * 0.22
              );
            }
          }
        });

        // Final exit: the entire current skill fades out at the tail end
        // of its block, revealing the next skill underneath.
        if (skillIdx < skills.length - 1) {
          const exitGroup = stageRef.current!.querySelector<HTMLElement>(
            `[data-skill-group="${skill.slug}"]`
          );
          if (exitGroup) {
            tl.to(
              exitGroup,
              { opacity: 0, duration: 0.25, ease: "power1.in" },
              blockStart + 0.85
            );
          }
        }

        // Sync side-panel label with current skill. Driven by the same
        // timeline so it's perfectly aligned with the visual.
        const labelEl = sectionRef.current!.querySelector<HTMLElement>(
          `[data-skill-label="${skill.slug}"]`
        );
        if (labelEl) {
          // Fade in at block start
          tl.to(
            labelEl,
            { opacity: 1, duration: 0.15, ease: "power1.out" },
            blockStart + 0.05
          );
          // Fade out at block end (except last)
          if (skillIdx < skills.length - 1) {
            tl.to(
              labelEl,
              { opacity: 0, duration: 0.15, ease: "power1.in" },
              blockStart + 0.9
            );
          }
        }
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="skills"
      aria-label="Skills — Daniela Brunetto"
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
          data-skills-eyebrow
          className="font-sans text-[10px] uppercase tracking-[0.4em] text-bone/50"
        >
          § II.b — The Kit
        </p>
      </div>
      <div className="absolute top-6 right-6 md:top-10 md:right-12 z-10 pointer-events-none text-right">
        <p className="font-sans text-[10px] uppercase tracking-[0.4em] text-bone/50">
          frame by frame
        </p>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl mt-16 md:mt-20">
        <header data-skills-header className="mb-14 md:mb-20">
          <p
            data-skills-script
            className="font-script text-blood text-5xl md:text-7xl leading-none mb-1 -ml-1"
          >
            in my hands,
          </p>
          <h2
            data-skills-display
            className="font-display text-bone text-7xl md:text-[9rem] leading-[0.9] uppercase"
          >
            Skills
          </h2>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* LEFT — running label / tagline */}
          <aside className="lg:col-span-5 space-y-8 max-w-md">
            <p className="font-sans text-[10px] uppercase tracking-[0.35em] text-blood">
              ▸ Now showing
            </p>

            <div className="relative min-h-[140px] md:min-h-[180px]">
              {skills.map((skill, i) => (
                <div
                  key={skill.slug}
                  data-skill-label={skill.slug}
                  className="absolute inset-0 space-y-3"
                  style={{ opacity: i === 0 ? 1 : 0 }}
                >
                  <h3 className="text-bone text-4xl md:text-5xl uppercase leading-none">
                    <GlitchText interval={250}>{skill.name}</GlitchText>
                  </h3>
                  <p className="font-script text-blood/85 text-2xl md:text-3xl leading-tight">
                    {skill.tagline}
                  </p>
                </div>
              ))}
            </div>

            {/* Progress: tick per skill */}
            <div
              className="hidden lg:flex items-center gap-2 pt-6 border-t border-bone/10"
              aria-hidden="true"
            >
              {skills.map((s, i) => (
                <span
                  key={s.slug}
                  className="block h-px bg-bone/30"
                  style={{ width: `${100 / skills.length}px` }}
                  data-skill-tick={i}
                />
              ))}
              <span className="font-sans text-[9px] uppercase tracking-[0.3em] text-bone/40 ml-2">
                {skills.length} reels
              </span>
            </div>

            <p className="font-sans text-xs text-bone/55 italic pt-2">
              Scroll to advance — each reel disintegrates into the next.
            </p>
          </aside>

          {/* RIGHT — frame stage. Stacks every skill's 4 frames. */}
          <div
            ref={stageRef}
            className="lg:col-span-7 relative"
            role="presentation"
          >
            <div
              className="
                relative mx-auto
                w-full max-w-[520px] aspect-square
              "
            >
              {/* Each skill is a group; within it, 4 stage layers stacked.
                  Z-order matters: the LAST skill in the array sits at the
                  bottom of the visual stack so earlier skills can fade out
                  to reveal it. We render in reverse so the FIRST skill
                  is on top of the DOM (last-painted = top in CSS flow). */}
              {[...skills].reverse().map((skill, reverseIdx) => {
                const realIdx = skills.length - 1 - reverseIdx;
                const isFirst = realIdx === 0;
                return (
                  <div
                    key={skill.slug}
                    data-skill-group={skill.slug}
                    className="absolute inset-0"
                    style={{ opacity: 1 }}
                  >
                    {STAGES.map((stage, stageIdx) => {
                      const isBase = stageIdx === 0;
                      return (
                        <div
                          key={stage}
                          data-skill={skill.slug}
                          data-stage={stage}
                          className="absolute inset-0"
                          style={{
                            opacity: isBase ? 1 : 0,
                            // will-change keeps the compositor on its toes
                            willChange: "opacity",
                          }}
                        >
                          <Image
                            src={`/skills/${skill.slug}/${stage}.png`}
                            alt={
                              isBase
                                ? `${skill.name} — paper label`
                                : ""
                            }
                            fill
                            sizes="(max-width: 768px) 90vw, 520px"
                            priority={isFirst && isBase}
                            className="object-contain select-none pointer-events-none"
                            draggable={false}
                          />
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>

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

        {/* Reduced-motion fallback: list every skill, accessible to screen
            readers always. Hidden visually because the timeline shows it. */}
        <ul className="sr-only">
          {skills.map((s) => (
            <li key={s.slug}>
              {s.name} — {s.tagline}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}