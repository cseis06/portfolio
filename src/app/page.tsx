"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CapsuleHeader from "@/components/CapsuleHeader";
import { useThemeStore } from "@/store/useThemeStore";
import type { Project } from "@/components/TVScene";

gsap.registerPlugin(ScrollTrigger);

/* Dynamic import — R3F cannot SSR */
const TVScene = dynamic(() => import("@/components/TVScene"), { ssr: false });

/* ---- Data ---- */

const CREDITS = [
  { label: "Stack", value: "React · Next.js · TypeScript" },
  { label: "Styling", value: "Tailwind · GSAP · Framer" },
  { label: "Tools", value: "Figma · VS Code · Git" },
];

const DETAILS = [
  { label: "Location", value: "Fernando de la Mora, Paraguay" },
  { label: "Experience", value: "3+ years building for the web" },
  { label: "Focus", value: "UI/UX, Animation, Design Systems" },
  { label: "Currently", value: "Open to new projects!" },
];

interface ExperienceItem {
  title: string;
  role: string;
  date: string;
  bullets: string[];
}

const EXPERIENCE: ExperienceItem[] = [
  {
    title: "LPSoft",
    role: "Frontend Developer",
    date: "Nov 2025 – Present",
    bullets: [
      "Development and maintenance of a \"sistema de facturación electrónica\" and other internal projects using React.",
      "Building and iterating on complex UI flows for billing, invoicing, and administrative tools.",
    ],
  },
  {
    title: "Central Shop",
    role: "Web Developer",
    date: "Feb 2025 – Oct 2025",
    bullets: [
      "Development and maintenance of a complex e-commerce platform with multiple frontends (customer and admin) and an internal management app.",
      "Frontend with React + Next.js and backend with Node.js + Express, integrating MongoDB and MariaDB databases.",
      "Implemented SEO strategies and enhanced user experience, optimizing performance and navigation.",
      "Daily technical problem-solving, team coordination, and ensuring code quality.",
    ],
  },
  {
    title: "Posibillian Tech S.A.",
    role: "Development Intern",
    date: "Oct 2024 – Nov 2024",
    bullets: [
      "Designing and creating Fortnite maps using Unreal Editor for Fortnite and Verse.",
      "Applied programming logic for interactive environments and developed immersive experiences.",
    ],
  },
  {
    title: "Freelance",
    role: "Fullstack Developer",
    date: "2023 – Present",
    bullets: [
      "Kiren — 2026: E-commerce for a clothing store. Fullstack with React, Next.js, Tailwind and Supabase for DB and API.",
      "Marra's — 2026: Management system for a healthy food place. Fullstack with React, Next.js, Tailwind and Supabase for DB and API.",
      "Patriota — 2025: Full design & development of frontend (React + Next.js + Tailwind), backend (Node.js + Express) and MongoDB database for a digital catalog. Currently cancelled, kept on GitHub.",
      "Lunardi — 2025: Design & development of a landing page with React + Next.js + Tailwind. Currently in pre-production.",
      "Fotearte — 2023: Design & development of a landing page in React + Next.js + Tailwind. Already in production (fotearte.com).",
    ],
  },
];

const PROJECTS: Project[] = [
  {
    title: "Kiren",
    description: "E-commerce platform for a clothing store. Full-stack application with auth, cart, payments, and admin dashboard.",
    stack: ["React", "Next.js", "Tailwind", "Supabase"],
    year: "2026",
  },
  {
    title: "Marra's",
    description: "Management system for a healthy food business. Orders, inventory, and customer tracking in one place.",
    stack: ["React", "Next.js", "Tailwind", "Supabase"],
    year: "2026",
  },
  {
    title: "Fotearte",
    description: "Landing page for a photography studio. Clean, visual-first design showcasing portfolio and services.",
    stack: ["React", "Next.js", "Tailwind"],
    url: "https://fotearte.com",
    year: "2023",
  },
  {
    title: "Patriota",
    description: "Digital catalog with full backend infrastructure. Product management, filtering, and responsive storefront.",
    stack: ["React", "Next.js", "Node.js", "MongoDB"],
    year: "2025",
  },
  {
    title: "Lunardi",
    description: "Landing page for a brand. Minimal, polished design focused on visual identity and conversion.",
    stack: ["React", "Next.js", "Tailwind"],
    year: "2025",
  },
];

/* ---- Component ---- */

export default function Home() {
  const { isDark } = useThemeStore();

  /* refs: hero */
  const tagRef = useRef<HTMLParagraphElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const roleRef = useRef<HTMLParagraphElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const creditsRef = useRef<HTMLDivElement>(null);
  const yearRef = useRef<HTMLParagraphElement>(null);

  /* refs: about */
  const aboutRef = useRef<HTMLElement>(null);
  const aboutLabelRef = useRef<HTMLParagraphElement>(null);
  const aboutTitleRef = useRef<HTMLHeadingElement>(null);
  const aboutLineRef = useRef<HTMLDivElement>(null);
  const aboutFrameRef = useRef<HTMLDivElement>(null);
  const aboutBioRef = useRef<HTMLDivElement>(null);
  const aboutDetailsRef = useRef<HTMLDivElement>(null);

  /* refs: experience */
  const expRef = useRef<HTMLDivElement>(null);
  const expLabelRef = useRef<HTMLParagraphElement>(null);
  const expTitleRef = useRef<HTMLHeadingElement>(null);
  const expLineRef = useRef<HTMLDivElement>(null);
  const expCardsRef = useRef<(HTMLDivElement | null)[]>([]);

  /* refs: projects */
  const projRef = useRef<HTMLElement>(null);
  const projLabelRef = useRef<HTMLParagraphElement>(null);
  const projTitleRef = useRef<HTMLHeadingElement>(null);
  const projLineRef = useRef<HTMLDivElement>(null);
  const projTvRef = useRef<HTMLDivElement>(null);

  /* tokens */
  const bg = isDark ? "#0c0a09" : "#faf5f0";
  const textPrimary = isDark ? "rgba(250,245,240,0.85)" : "rgba(26,22,20,0.9)";
  const textMuted = isDark ? "rgba(250,245,240,0.3)" : "rgba(26,22,20,0.25)";
  const textSoft = isDark ? "rgba(250,245,240,0.5)" : "rgba(26,22,20,0.45)";
  const borderSoft = isDark ? "rgba(250,245,240,0.06)" : "rgba(26,22,20,0.06)";
  const borderMed = isDark ? "rgba(250,245,240,0.1)" : "rgba(26,22,20,0.1)";

  /* ---- Hero animation ---- */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" }, delay: 1.6 });
      tl.fromTo(nameRef.current, { opacity: 0, y: 40, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.9 })
        .fromTo(roleRef.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.3")
        .fromTo(tagRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5 }, "-=0.2")
        .fromTo(lineRef.current, { scaleX: 0 }, { scaleX: 1, duration: 0.6 }, "-=0.2")
        .fromTo(creditsRef.current?.children ? Array.from(creditsRef.current.children) : [], { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.08 }, "-=0.2")
        .fromTo(yearRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4 }, "-=0.1");
    });
    return () => ctx.revert();
  }, []);

  /* ---- About scroll animation ---- */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: aboutRef.current, start: "top 75%", toggleActions: "play none none none" }, defaults: { ease: "power3.out" } });
      tl.fromTo(aboutLabelRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4 })
        .fromTo(aboutTitleRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.15")
        .fromTo(aboutLineRef.current, { scaleX: 0 }, { scaleX: 1, duration: 0.5 }, "-=0.2")
        .fromTo(aboutFrameRef.current, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.6 }, "-=0.2")
        .fromTo(aboutBioRef.current, { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 0.6 }, "-=0.4")
        .fromTo(aboutDetailsRef.current?.children ? Array.from(aboutDetailsRef.current.children) : [], { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.35, stagger: 0.06 }, "-=0.2");
    });
    return () => ctx.revert();
  }, []);

  /* ---- Experience scroll animation ---- */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const headerTl = gsap.timeline({ scrollTrigger: { trigger: expRef.current, start: "top 80%", toggleActions: "play none none none" }, defaults: { ease: "power3.out" } });
      headerTl.fromTo(expLabelRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4 })
        .fromTo(expTitleRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.15")
        .fromTo(expLineRef.current, { scaleX: 0 }, { scaleX: 1, duration: 0.5 }, "-=0.2");
      expCardsRef.current.filter(Boolean).forEach((card) => {
        gsap.fromTo(card, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", scrollTrigger: { trigger: card, start: "top 85%", toggleActions: "play none none none" } });
      });
    });
    return () => ctx.revert();
  }, []);

  /* ---- Projects scroll animation ---- */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: projRef.current, start: "top 75%", toggleActions: "play none none none" }, defaults: { ease: "power3.out" } });
      tl.fromTo(projLabelRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4 })
        .fromTo(projTitleRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.15")
        .fromTo(projLineRef.current, { scaleX: 0 }, { scaleX: 1, duration: 0.5 }, "-=0.2")
        .fromTo(projTvRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8 }, "-=0.2");
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden transition-colors duration-500" style={{ background: bg, fontFamily: "var(--font-mono)" }}>
      {/* Film grain */}
      <div className="fixed inset-0 pointer-events-none z-40" style={{ opacity: isDark ? 0.035 : 0.025, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: "128px 128px" }} />
      {isDark && <div className="absolute inset-0 pointer-events-none z-0" style={{ opacity: 0.008, background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(250,245,240,0.3) 3px, rgba(250,245,240,0.3) 6px)" }} />}

      <CapsuleHeader />

      {/* ======================== HERO ======================== */}
      <section id="hero" className="min-h-screen flex flex-col items-center justify-center text-center px-4 relative z-10">
        <p ref={tagRef} className="mb-8" style={{ opacity: 0, fontSize: 11, letterSpacing: "0.35em", textTransform: "uppercase", color: textMuted, fontFamily: "var(--font-mono)" }}>&gt; now playing</p>
        <h1 ref={nameRef} style={{ opacity: 0, fontSize: "clamp(3.5rem, 10vw, 8rem)", lineHeight: 0.95, fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, color: "#dc2626", margin: 0, letterSpacing: "-0.02em" }}>Dani Brunetto</h1>
        <p ref={roleRef} className="mt-6" style={{ opacity: 0, fontSize: 12, letterSpacing: "0.25em", textTransform: "uppercase", color: textSoft, fontFamily: "var(--font-mono)", transition: "color 0.5s" }}>a portfolio by <span style={{ fontWeight: 500, color: textPrimary }}>a Web Developer</span></p>
        <div ref={lineRef} className="my-10" style={{ width: "min(80%, 480px)", height: 1, transformOrigin: "center", transform: "scaleX(0)", background: `linear-gradient(90deg, transparent, ${borderMed} 20%, rgba(220,38,38,0.15) 50%, ${borderMed} 80%, transparent)` }} />
        <div ref={creditsRef} className="flex flex-wrap justify-center gap-x-10 gap-y-3">
          {CREDITS.map((c) => (
            <div key={c.label} className="text-center" style={{ opacity: 0 }}>
              <p style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 4px 0", color: "rgba(220,38,38,0.35)", fontFamily: "var(--font-mono)" }}>{c.label}</p>
              <p style={{ fontSize: 11, margin: 0, color: textSoft, fontFamily: "var(--font-mono)", letterSpacing: "0.05em", transition: "color 0.5s" }}>{c.value}</p>
            </div>
          ))}
        </div>
        <p ref={yearRef} className="mt-10" style={{ opacity: 0, fontSize: 12, letterSpacing: "0.3em", color: textMuted, fontFamily: "var(--font-mono)", transition: "color 0.5s" }}>2026</p>
      </section>

      {/* ======================== ABOUT ======================== */}
      <section ref={aboutRef} id="about" className="relative z-10 px-6 py-32 max-w-5xl mx-auto">
        <div className="text-center mb-20">
          <p ref={aboutLabelRef} style={{ opacity: 0, fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(220,38,38,0.4)", fontFamily: "var(--font-mono)", marginBottom: 12 }}>Scene 01</p>
          <h2 ref={aboutTitleRef} style={{ opacity: 0, fontSize: "clamp(2rem, 5vw, 3.5rem)", fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, color: "#dc2626", margin: 0, letterSpacing: "-0.01em" }}>About Me</h2>
          <div ref={aboutLineRef} className="mx-auto mt-6" style={{ width: 60, height: 1, transformOrigin: "center", transform: "scaleX(0)", background: "rgba(220,38,38,0.25)" }} />
        </div>
        <div className="flex flex-col md:flex-row gap-12 md:gap-16 items-start">
          <div ref={aboutFrameRef} className="w-full md:w-[40%] shrink-0" style={{ opacity: 0 }}>
            <div className="relative w-full overflow-hidden" style={{ aspectRatio: "3 / 4", border: `1px solid ${borderMed}`, borderRadius: 2, background: isDark ? "rgba(250,245,240,0.02)" : "rgba(26,22,20,0.02)", transition: "background 0.5s, border-color 0.5s" }}>
              <div className="absolute top-3 left-3 flex items-center gap-1.5" style={{ zIndex: 2 }}>
                <span className="block w-1.5 h-1.5 rounded-full" style={{ background: "#dc2626" }} />
                <span style={{ fontSize: 9, letterSpacing: "0.15em", color: "rgba(220,38,38,0.5)", fontFamily: "var(--font-mono)", textTransform: "uppercase" }}>Frame 01</span>
              </div>
              <div className="absolute bottom-3 right-3" style={{ fontSize: 9, letterSpacing: "0.1em", color: textMuted, fontFamily: "var(--font-mono)" }}>35mm</div>
              <div className="absolute inset-0 flex items-center justify-center">
                <p style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: textMuted, fontFamily: "var(--font-mono)" }}>Your photo</p>
              </div>
              <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.03, background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.4) 2px, rgba(255,255,255,0.4) 4px)" }} />
            </div>
          </div>
          <div ref={aboutBioRef} className="flex-1" style={{ opacity: 0 }}>
            <p className="mb-8" style={{ fontSize: 17, lineHeight: 1.8, fontFamily: "var(--font-display)", fontWeight: 400, color: textPrimary, transition: "color 0.5s" }}>
              I&apos;m Dani — a web developer who builds things at the intersection of design and technology. I care about the details: the micro-interactions that make an interface feel alive, the typography that sets a tone, and the performance that keeps everything seamless.
            </p>
            <p className="mb-12" style={{ fontSize: 14, lineHeight: 1.8, fontFamily: "var(--font-display)", fontWeight: 400, color: textSoft, transition: "color 0.5s" }}>
              I approach every project like crafting a scene — every element has purpose, every transition has timing, and the whole experience should feel like something you want to watch again.
            </p>
            <div ref={aboutDetailsRef}>
              {DETAILS.map((d, i) => (
                <div key={d.label} className="flex items-baseline gap-4 py-3" style={{ opacity: 0, borderTop: i === 0 ? `1px solid ${borderSoft}` : "none", borderBottom: `1px solid ${borderSoft}`, transition: "border-color 0.5s" }}>
                  <span style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(220,38,38,0.4)", fontFamily: "var(--font-mono)", flexShrink: 0, width: 90 }}>{d.label}</span>
                  <span style={{ fontSize: 13, color: textPrimary, fontFamily: "var(--font-mono)", letterSpacing: "0.03em", transition: "color 0.5s" }}>{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ==================== EXPERIENCE ==================== */}
        <div ref={expRef} className="mt-32">
          <div className="text-center mb-16">
            <p ref={expLabelRef} style={{ opacity: 0, fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(220,38,38,0.4)", fontFamily: "var(--font-mono)", marginBottom: 12 }}>Scene 02</p>
            <h2 ref={expTitleRef} style={{ opacity: 0, fontSize: "clamp(1.8rem, 4vw, 3rem)", fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, color: "#dc2626", margin: 0, letterSpacing: "-0.01em" }}>Filmography</h2>
            <div ref={expLineRef} className="mx-auto mt-6" style={{ width: 60, height: 1, transformOrigin: "center", transform: "scaleX(0)", background: "rgba(220,38,38,0.25)" }} />
          </div>
          <div className="relative">
            <div className="absolute left-[7px] md:left-1/2 top-0 bottom-0 hidden md:block" style={{ width: 1, background: `linear-gradient(180deg, transparent, ${borderMed} 5%, ${borderMed} 95%, transparent)`, transform: "translateX(-50%)" }} />
            {EXPERIENCE.map((exp, i) => {
              const isLeft = i % 2 === 0;
              return (
                <div key={exp.title} ref={(el) => { expCardsRef.current[i] = el; }} className={`relative flex flex-col md:flex-row mb-16 last:mb-0 ${isLeft ? "md:flex-row" : "md:flex-row-reverse"}`} style={{ opacity: 0 }}>
                  <div className="absolute left-0 md:left-1/2 top-1 hidden md:flex items-center justify-center" style={{ width: 15, height: 15, transform: "translateX(-50%)" }}>
                    <span className="block w-[7px] h-[7px] rounded-full" style={{ background: i === 0 ? "#dc2626" : borderMed, boxShadow: i === 0 ? "0 0 8px rgba(220,38,38,0.3)" : "none" }} />
                  </div>
                  <div className={`w-full md:w-[calc(50%-32px)] ${isLeft ? "md:pr-0 md:mr-auto" : "md:pl-0 md:ml-auto"}`}>
                    <div className="relative overflow-hidden" style={{ border: `1px solid ${borderMed}`, borderRadius: 2, padding: "24px 28px", background: isDark ? "rgba(250,245,240,0.015)" : "rgba(26,22,20,0.015)", transition: "background 0.5s, border-color 0.5s" }}>
                      <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.02, background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.4) 2px, rgba(255,255,255,0.4) 4px)" }} />
                      <div className="flex items-center gap-1.5 mb-4">
                        <span className="block w-1.5 h-1.5 rounded-full" style={{ background: "#dc2626" }} />
                        <span style={{ fontSize: 9, letterSpacing: "0.15em", color: "rgba(220,38,38,0.45)", fontFamily: "var(--font-mono)", textTransform: "uppercase" }}>Take {String(i + 1).padStart(2, "0")}</span>
                      </div>
                      <h3 style={{ fontSize: "clamp(1.3rem, 3vw, 1.7rem)", fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, color: textPrimary, margin: "0 0 6px 0", transition: "color 0.5s" }}>{exp.title}</h3>
                      <div className="flex flex-wrap items-center gap-2 mb-5">
                        <span style={{ fontSize: 11, letterSpacing: "0.08em", color: "#dc2626", fontFamily: "var(--font-mono)", fontWeight: 500 }}>{exp.role}</span>
                        <span style={{ fontSize: 11, color: textMuted, fontFamily: "var(--font-mono)" }}>—</span>
                        <span style={{ fontSize: 10, letterSpacing: "0.1em", color: textSoft, fontFamily: "var(--font-mono)" }}>{exp.date}</span>
                      </div>
                      <div className="flex flex-col gap-3">
                        {exp.bullets.map((bullet, j) => (
                          <div key={j} className="flex gap-3 items-start">
                            <span className="shrink-0 mt-[7px]" style={{ width: 4, height: 4, borderRadius: 1, background: "rgba(220,38,38,0.3)" }} />
                            <p style={{ fontSize: 12, lineHeight: 1.7, margin: 0, color: textSoft, fontFamily: "var(--font-mono)", transition: "color 0.5s" }}>{bullet}</p>
                          </div>
                        ))}
                      </div>
                      <div className="absolute bottom-3 right-4" style={{ fontSize: 9, letterSpacing: "0.1em", color: textMuted, fontFamily: "var(--font-mono)", transition: "color 0.5s" }}>{exp.date.split("–")[0].trim()}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ======================== PROJECTS ======================== */}
      <section ref={projRef} id="projects" className="relative z-10 px-6 py-32 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p ref={projLabelRef} style={{ opacity: 0, fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(220,38,38,0.4)", fontFamily: "var(--font-mono)", marginBottom: 12 }}>Scene 03</p>
          <h2 ref={projTitleRef} style={{ opacity: 0, fontSize: "clamp(1.8rem, 4vw, 3rem)", fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, color: "#dc2626", margin: 0, letterSpacing: "-0.01em" }}>Now Showing</h2>
          <div ref={projLineRef} className="mx-auto mt-6" style={{ width: 60, height: 1, transformOrigin: "center", transform: "scaleX(0)", background: "rgba(220,38,38,0.25)" }} />
        </div>

        <div ref={projTvRef} style={{ opacity: 0 }}>
          <TVScene projects={PROJECTS} isDark={isDark} />
        </div>

        {/* Instruction hint */}
        <p className="text-center mt-6" style={{ fontSize: 10, letterSpacing: "0.15em", color: textMuted, fontFamily: "var(--font-mono)" }}>
          ← → arrow keys or buttons to switch channels
        </p>
      </section>

      {/* Placeholder */}
      <section id="contact" className="min-h-screen" />
    </div>
  );
}