"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useGLTF } from "@react-three/drei";
import TVButtons from "./TVButtons";
import GlitchText from "@/components/effects/GlitchText";
import { useProjectsStore } from "@/lib/stores/projectsStore";
import { projects } from "@/lib/data/projects";
import RollingLabel from "../ui/RollingLabel";

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
  const powerState = useProjectsStore((s) => s.powerState);
  const project =
    projects.find((p) => p.channel === currentChannel) ?? projects[0];

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
      if (entry.isIntersecting) {
        setShouldMount(true);
        // The TVScene's WebGL canvas changes layout. Notify any
        // ScrollTriggers downstream (like Experience's pin) to remeasure.
        requestAnimationFrame(() => {
          if (typeof window !== "undefined") {
            import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
              ScrollTrigger.refresh();
            });
          }
        });
      }
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

  // Side-panel opacity reflects power state subtly: dimmer when off / no-signal,
  // briefly lower during a channel swap, full when actively broadcasting.
  const panelOpacity =
    powerState !== "on"
      ? "opacity-30"
      : isTransitioning
      ? "opacity-25"
      : "opacity-100";

  return (
    <section
      ref={sectionRef}
      id="projects"
      aria-label="Projects"
      className="relative min-h-screen w-full bg-ink text-bone overflow-hidden"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-screen">
        {/* LEFT */}
        <div className="lg:col-span-1">
          <br />
        </div>
        <div className="lg:col-span-4 px-6 md:px-12 lg:px-20 py-0 lg:py-32 flex flex-col justify-center">
          <p className="font-script text-blood text-4xl md:text-6xl mb-1 -ml-1">
            Tuning in now.
          </p>
          <h2 className="font-display text-bone text-7xl md:text-8xl lg:text-9xl  uppercase leading-[0.9] mb-8">
            Projects
          </h2>

          <div
            className={`
              space-y-3 max-w-md min-h-[200px]
              transition-opacity duration-300
              ${panelOpacity}
            `}
            aria-live="polite"
          >
            <p className="font-sans text-[10px] uppercase tracking-[0.35em] text-blood">
              ▸ Channel {String(project.channel).padStart(2, "0")} ·{" "}
              {project.kind}
            </p>

            {/* Project title — wrapped in GlitchText for the cycling-font effect */}
            <h3 className="text-bone text-3xl md:text-4xl uppercase leading-none">
              <GlitchText>{project.title}</GlitchText>
            </h3>

            <p className="font-sans text-xs text-bone/50 uppercase tracking-widest">
              {project.year}
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
                  group inline-flex inline-block mt-3
                  font-sans text-xs uppercase tracking-[0.3em] text-blood
                  border-b border-blood/40
                  hover:text-bone hover:border-bone/60
                  transition-colors pb-1
                "
              >
                <RollingLabel>Visit ↗</RollingLabel>
              </a>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-7 relative flex flex-col items-center justify-center px-6 md:px-12 py-12">
          <div className="relative w-full aspect-square max-w-[640px]">
            {shouldMount && <TVScene />}
          </div>

          <TVButtons />
        </div>
      </div>
    </section>
  );
}