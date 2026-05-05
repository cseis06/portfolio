"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useGLTF } from "@react-three/drei";
import ChannelControls from "./ChannelControls";
import { useProjectsStore } from "@/lib/stores/projectsStore";
import { projects } from "@/lib/data/projects";

// The R3F scene is heavy — defer until the section approaches viewport.
const TVScene = dynamic(() => import("./TVScene"), {
  ssr: false,
  loading: () => <div className="w-full h-full" aria-hidden="true" />,
});

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const [shouldMount, setShouldMount] = useState(false);
  const hasPreloadedRef = useRef(false);

  const currentChannel = useProjectsStore((s) => s.currentChannel);
  const isTransitioning = useProjectsStore((s) => s.isTransitioning);
  const project =
    projects.find((p) => p.channel === currentChannel) ?? projects[0];

  // Two-stage loading:
  //  1. Approaching (1000px out) → preload GLB (fetch only)
  //  2. Near (200px out)         → mount the WebGL scene
  useEffect(() => {
    if (!sectionRef.current) return;

    const preloadIO = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasPreloadedRef.current) {
          useGLTF.preload("/models/old_tv.glb");
          hasPreloadedRef.current = true;
        }
      },
      { rootMargin: "1000px" }
    );

    const mountIO = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setShouldMount(true);
      },
      { rootMargin: "200px" }
    );

    preloadIO.observe(sectionRef.current);
    mountIO.observe(sectionRef.current);

    return () => {
      preloadIO.disconnect();
      mountIO.disconnect();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="projects"
      aria-label="Projects"
      className="relative min-h-screen w-full bg-ink text-bone overflow-hidden"
    >
      {/* Editorial corners */}
      <div className="absolute top-6 left-6 md:top-10 md:left-12 z-10 pointer-events-none">
        <p className="font-sans text-[10px] uppercase tracking-[0.4em] text-bone/50">
          § III — Filmography
        </p>
      </div>
      <div className="absolute top-6 right-6 md:top-10 md:right-12 z-10 pointer-events-none text-right">
        <p className="font-sans text-[10px] uppercase tracking-[0.4em] text-bone/50">
          side b
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-screen">
        {/* LEFT — narrative + currently-tuned project info */}
        <div className="lg:col-span-5 px-6 md:px-12 lg:px-20 py-24 lg:py-32 flex flex-col justify-center">
          <p className="font-script text-blood text-4xl md:text-6xl mb-1 -ml-1">
            tune in.
          </p>
          <h2 className="font-display text-bone text-7xl md:text-[8rem] uppercase leading-[0.9] mb-8">
            Projects
          </h2>
          <p className="font-sans text-sm md:text-base text-bone/70 mb-10 max-w-md leading-relaxed">
            A small selection of work — change channels with the dial below
            to flip between transmissions.
          </p>

          {/* Live project info — mirrors the TV's screen with more room.
              Fades during the static burst to feel "tuned-out". */}
          <div
            className={`
              space-y-3 max-w-md min-h-[200px]
              transition-opacity duration-200
              ${isTransitioning ? "opacity-25" : "opacity-100"}
            `}
            aria-live="polite"
          >
            <p className="font-sans text-[10px] uppercase tracking-[0.35em] text-blood">
              ▸ Channel {String(project.channel).padStart(2, "0")} · {project.kind}
            </p>
            <h3 className="font-display text-bone text-3xl md:text-4xl uppercase leading-none">
              {project.title}
            </h3>
            <p className="font-sans text-xs text-bone/50 uppercase tracking-widest">
              ◦ {project.year} ◦
            </p>
            <p className="font-sans text-sm text-bone/85 leading-relaxed pt-2">
              {project.description}
            </p>
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  inline-block mt-3
                  font-sans text-xs uppercase tracking-[0.3em] text-blood
                  border-b border-blood/40
                  hover:text-bone hover:border-bone/60
                  transition-colors pb-1
                "
              >
                Visit ↗
              </a>
            )}
          </div>
        </div>

        {/* RIGHT — TV scene + chyron + controls */}
        <div className="lg:col-span-7 relative flex flex-col items-center justify-center px-6 md:px-12 py-12">
          <div className="relative w-full aspect-square max-w-[640px]">
            {shouldMount && <TVScene />}
          </div>

          {/* Chyron — "now broadcasting" caption below the TV */}
          <div
            className={`
              mt-2 mb-6 h-5 flex items-center
              font-sans text-[11px] uppercase tracking-[0.4em] text-bone/55
              transition-opacity duration-300
              ${isTransitioning ? "opacity-30" : "opacity-100"}
            `}
            aria-hidden="true"
          >
            ▸ now broadcasting · {project.title} · {project.year}
          </div>

          <ChannelControls />
        </div>
      </div>
    </section>
  );
}