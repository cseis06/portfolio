"use client";

import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Letter from "./Letter";
import WaxSeal from "./WaxSeal";
import ContactRail from "./ContactRail";
import { useContactForm } from "@/hooks/useContactForm";
import GlitchText from "../effects/GlitchText";
import { useHeroStore } from "@/lib/stores/heroStore";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const SUCCESS_HOLD_MS = 3000;

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const letterRef = useRef<HTMLDivElement>(null);
  const sealRef = useRef<HTMLDivElement>(null);
  const noteRemoved = useHeroStore((s) => s.noteRemoved);

  const { fields, status, errorMsg, update, send, reset } = useContactForm();

  // Header reveals on scroll-in
  useGSAP(
    () => {
      if (!noteRemoved) return;
      if (!sectionRef.current) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
        return;

      gsap.from("[data-contact-eyebrow]", {
        opacity: 0,
        y: 8,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
      });
      gsap.from("[data-contact-script]", {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "[data-contact-header]",
          start: "top 75%",
        },
      });
      gsap.from("[data-contact-display]", {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: "power3.out",
        delay: 0.15,
        scrollTrigger: {
          trigger: "[data-contact-header]",
          start: "top 75%",
        },
      });
      gsap.from("[data-contact-rail] li", {
        opacity: 0,
        x: -16,
        duration: 0.7,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: "[data-contact-rail]",
          start: "top 80%",
        },
      });
      gsap.from("[data-contact-letter]", {
        opacity: 0,
        y: 30,
        rotation: -1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "[data-contact-letter]",
          start: "top 80%",
        },
      });
    },
    { scope: sectionRef, dependencies: [noteRemoved] }
  );

  // Send animation — runs whenever status flips to "sending" or "success"
  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (status === "sending") {
      // Letter: subtle "in transit" — settles slightly, dims
      if (letterRef.current && !reduce) {
        gsap.to(letterRef.current, {
          y: -8,
          rotation: -0.6,
          opacity: 0.85,
          duration: 0.6,
          ease: "power2.out",
        });
      }
    }

    if (status === "success") {
      const tl = gsap.timeline({
        onComplete: () => {
          // Hold success state, then reset for the next visitor
          window.setTimeout(() => {
            // Fade everything out, then clear
            gsap.to([letterRef.current, sealRef.current], {
              opacity: 0,
              y: -20,
              duration: 0.5,
              ease: "power2.in",
              onComplete: () => {
                reset();
                // Restore letter to fresh state
                if (letterRef.current) {
                  gsap.set(letterRef.current, {
                    opacity: 1,
                    y: 0,
                    rotation: 0,
                    scale: 1,
                  });
                }
                if (sealRef.current) {
                  gsap.set(sealRef.current, { opacity: 0 });
                }
              },
            });
          }, SUCCESS_HOLD_MS);
        },
      });

      if (reduce) {
        // Minimal: just show the seal
        if (sealRef.current) tl.set(sealRef.current, { opacity: 1 });
        return;
      }

      // Stamp drop — wax descends, impacts, settles with a jitter
      if (sealRef.current && letterRef.current) {
        tl.set(sealRef.current, {
          opacity: 0,
          y: -200,
          scale: 1.4,
          rotation: 12,
        })
          .to(sealRef.current, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.35,
            ease: "power3.in",
          })
          // Impact — letter recoils from the stamp pressure
          .to(
            letterRef.current,
            {
              y: 2,
              scale: 0.995,
              duration: 0.08,
              ease: "power2.out",
              yoyo: true,
              repeat: 1,
            },
            "<"
          )
          // Stamp settles — small rotation jitter
          .to(sealRef.current, {
            rotation: 0,
            duration: 0.18,
            ease: "back.out(2)",
          });
      }
    }
  }, [status, reset]);

  return (
    <section
      ref={sectionRef}
      id="contact"
      aria-label="Contact — Daniela Brunetto"
      className="
        relative min-h-screen w-full
        bg-bone text-ink
        px-6 py-20 md:px-12 md:py-28 lg:px-20 lg:py-36
        overflow-hidden
      "
    >
      <div className="mx-auto max-w-7xl">
        {/* Two-column on lg+: 5/7 split. Stacks on mobile. */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* LEFT — header, rail, sign-off */}
          <div className="lg:col-span-5 flex flex-col gap-12">
            <header data-contact-header>
              <h2
                data-contact-display
                className="font-display text-ink text-6xl md:text-7xl xl:text-8xl leading-[0.9] uppercase"
              >
                Contact
              </h2>
            </header>

            <aside data-contact-rail>
              <ContactRail />

              <GlitchText>
                <p className="text-blood/80 text-2xl md:text-xl mt-12">
                  Or simply post a letter.
                </p>
              </GlitchText>
            </aside>
          </div>

          {/* RIGHT — letter + seal. Sized by its column, centered within it. */}
          <div className="w-full lg:col-span-7 flex justify-start lg:justify-end">
            <div
              data-contact-letter
              className="relative -top-6 lg:-top-12 w-full max-w-dvw lg:max-w-[540px]"
            >
              <Letter
                ref={letterRef}
                name={fields.name}
                email={fields.email}
                message={fields.message}
                status={status}
                errorMsg={errorMsg}
                onUpdate={update}
                onSubmit={send}
              />
              <WaxSeal ref={sealRef} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}