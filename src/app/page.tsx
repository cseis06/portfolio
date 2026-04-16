"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import CapsuleHeader from "@/components/CapsuleHeader";
import { useThemeStore } from "@/store/useThemeStore";

export default function Home() {
  const { isDark } = useThemeStore();
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        delay: 1.4,
      });

      tl.fromTo(
        taglineRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.5 }
      )
        .fromTo(
          titleRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.2"
        )
        .fromTo(
          lineRef.current,
          { scaleX: 0 },
          { scaleX: 1, duration: 0.5 },
          "-=0.2"
        )
        .fromTo(
          subtitleRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.5 },
          "-=0.15"
        );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      className="min-h-screen relative overflow-hidden transition-colors duration-500"
      style={{
        background: isDark ? "#0a0812" : "#faf7f5",
        fontFamily: "var(--font-mono)",
      }}
    >
      {/* Ambient background glow — dark mode only */}
      {isDark && (
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] rounded-full pointer-events-none z-0"
          style={{
            opacity: 0.12,
            filter: "blur(100px)",
            background: "rgba(99,102,241,0.2)",
          }}
        />
      )}

      {/* Background scanlines — dark mode only */}
      {isDark && (
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            opacity: 0.012,
            background:
              "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(129,140,248,0.3) 3px, rgba(129,140,248,0.3) 6px)",
          }}
        />
      )}

      <CapsuleHeader />

      {/* Hero Section */}
      <section
        id="hero"
        className="min-h-screen flex flex-col items-center justify-center text-center px-4 relative z-10"
      >
        <p
          ref={taglineRef}
          className="text-xs uppercase mb-3"
          style={{
            opacity: 0,
            letterSpacing: "0.3em",
            color: isDark ? "rgba(129,140,248,0.35)" : "rgba(236,72,153,0.45)",
            fontFamily: "var(--font-mono)",
          }}
        >
          &gt; portfolio.init()
        </p>

        <h1
          ref={titleRef}
          className="text-5xl md:text-6xl font-semibold leading-tight transition-colors duration-500"
          style={{
            opacity: 0,
            color: isDark ? "rgba(255,255,255,0.85)" : "#111827",
            fontFamily: "var(--font-display)",
          }}
        >
          Frontend Developer
        </h1>

        <div
          ref={lineRef}
          className="w-16 h-0.5 my-6 rounded-sm"
          style={{
            transformOrigin: "center",
            transform: "scaleX(0)",
            background: isDark
              ? "linear-gradient(90deg, transparent, rgba(129,140,248,0.4), transparent)"
              : "linear-gradient(90deg, transparent, rgba(236,72,153,0.4), transparent)",
          }}
        />

        <p
          ref={subtitleRef}
          className="text-sm transition-colors duration-500"
          style={{
            opacity: 0,
            letterSpacing: "0.08em",
            color: isDark ? "rgba(255,255,255,0.25)" : "rgba(156,163,175,1)",
            fontFamily: "var(--font-mono)",
          }}
        >
          crafting interfaces from the future
        </p>
      </section>

      {/* Placeholder sections */}
      <section id="about" className="min-h-screen" />
      <section id="projects" className="min-h-screen" />
      <section id="contact" className="min-h-screen" />
    </div>
  );
}