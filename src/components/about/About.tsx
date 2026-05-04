"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      // Reduced motion: skip animations entirely. Elements render in their
      // natural state since we never set a "hidden" baseline in CSS.
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      // Eyebrow — small, quick, sets the tone
      gsap.from("[data-about-eyebrow]", {
        opacity: 0,
        y: 8,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
      });

      // Header: script greeting first, display title slightly behind it
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

      gsap.from("[data-about-display]", {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: "power3.out",
        delay: 0.15,
        scrollTrigger: {
          trigger: "[data-about-header]",
          start: "top 75%",
        },
      });

      // Paragraphs stagger in as the text block enters viewport
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

      // Signature: arrives last, slides in from the left
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

      // Cassettes: tilt + fade. Slight rotation reset feels physical —
      // like the stack settled into place rather than appeared.
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

      gsap.from("[data-about-caption]", {
        opacity: 0,
        y: 16,
        duration: 0.8,
        ease: "power2.out",
        delay: 0.3,
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
        relative min-h-screen w-full
        bg-ink text-bone
        px-6 py-20 md:px-12 md:py-28 lg:px-20 lg:py-32
        overflow-hidden
      "
    >
      {/* Editorial corners — match Hero's masthead pattern */}
      <div className="absolute top-6 left-6 md:top-10 md:left-12 pointer-events-none">
        <p
          data-about-eyebrow
          className="font-sans text-[10px] uppercase tracking-[0.4em] text-bone/50"
        >
          § II — Dossier
        </p>
      </div>
      <div className="absolute top-6 right-6 md:top-10 md:right-12 pointer-events-none text-right">
        <p className="font-sans text-[10px] uppercase tracking-[0.4em] text-bone/50">
          side a
        </p>
      </div>

      <div className="mx-auto max-w-7xl mt-16 md:mt-20">
        {/* Header — script greeting + display title */}
        <header data-about-header className="mb-16 md:mb-24">
          <p
            data-about-script
            className="font-script text-blood text-5xl md:text-7xl leading-none mb-1 -ml-1"
          >
            Hi,
          </p>
          <h2
            data-about-display
            className="font-display text-bone text-7xl md:text-[9rem] leading-[0.9] uppercase"
          >
            About me
          </h2>
        </header>

        {/* Two-column grid — 7/5 split on lg, stacks on mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* LEFT: text block */}
          <div
            data-about-text
            className="lg:col-span-7 space-y-7 max-w-[58ch]"
          >
            <p
              data-about-paragraph
              className="font-sans text-base md:text-lg leading-[1.75] text-bone/90"
            >
              Welcome to my portfolio! I&apos;m{" "}
              <span className="text-blood font-medium">Daniela Brunetto</span>,
              a web developer who turned her hobbies into a profession.
              Through code, I bring to life the ideas that swirl in our minds,
              acting as an intermediary between creativity and technical
              expertise.
            </p>

            <p
              data-about-paragraph
              className="font-sans text-base md:text-lg leading-[1.75] text-bone/90"
            >
              I believe a website is more than just a virtual space where we
              present &ldquo;something&rdquo; or &ldquo;someone.&rdquo; I dare
              to say that, in the right eyes, it can be{" "}
              <span className="font-script text-blood text-3xl md:text-4xl leading-[0.7] align-baseline mx-0.5">
                a cradle of art
              </span>
              . By this, I don&apos;t mean specifically any of the seven
              traditional fine arts, but rather that it&apos;s another form of
              expression that, in modern times, has come to us to help us
              convey what we want to communicate to people, and that&apos;s
              precisely my goal.
            </p>

            <p
              data-about-paragraph
              className="font-sans text-base md:text-lg leading-[1.75] text-bone/90"
            >
              Using tools like JavaScript, TypeScript, React.js, Tailwind CSS,
              Node.js, and Express, I create enjoyable user experiences that
              connect the sender with the receiver. Whether it&apos;s a
              landing page, a personal website, a management system, an
              e-commerce site, or more, my aim is to nurture the seeds planted
              in our minds.
            </p>

            {/* Signature — handwritten close */}
            <div
              data-about-signature
              className="pt-6 flex items-baseline gap-3"
            >
              <span className="font-sans text-[10px] uppercase tracking-[0.35em] text-bone/40">
                Sgd.
              </span>
              <p className="font-script text-bone text-3xl md:text-4xl">
                Daniela Brunetto
              </p>
            </div>
          </div>

          {/* RIGHT: cassette stack */}
          <aside className="lg:col-span-5 flex flex-col items-center lg:items-start lg:pt-2">
            <div
              data-about-cassettes
              className="relative w-full max-w-[460px] will-change-transform"
            >
              <Image
                src="/about/skills.png"
                alt="A stack of cassette tapes"
                width={1024}
                height={1024}
                className="w-full h-auto select-none"
                draggable={false}
              />
            </div>

            {/* Caption — tape-label rhythm */}
            <div
              data-about-caption
              className="mt-8 w-full max-w-[460px] text-center lg:text-left"
            >
              <p className="font-display text-bone text-4xl md:text-5xl uppercase leading-none">
                The Kit
              </p>
              <p className="font-sans text-[10px] uppercase tracking-[0.4em] text-bone/50 mt-3">
                Track listing · selected instruments
              </p>
              <p className="font-script text-blood/90 text-xl md:text-2xl mt-3">
                always learning, always more.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}