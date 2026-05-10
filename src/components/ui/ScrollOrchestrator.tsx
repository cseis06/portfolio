"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useHeroStore } from "@/lib/stores/heroStore";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Coordinates ScrollTrigger lifecycle around Hero's scroll lock.
 *
 * Problem: Hero locks scroll on the body until the note is removed.
 * ScrollTriggers created during the lock measure against a non-scrollable
 * document and end up with corrupted start/end values that don't auto-fix
 * when scroll unlocks.
 *
 * Solution: While locked, all triggers are paused. On unlock, force a
 * full refresh so every trigger remeasures against the now-correct
 * document height and scroll position.
 *
 * Mount this once at the root of the page tree, after Hero.
 */
export default function ScrollOrchestrator() {
  const noteRemoved = useHeroStore((s) => s.noteRemoved);

  useEffect(() => {
    if (!noteRemoved) {
      // Belt-and-braces: pause anything that may have slipped through.
      ScrollTrigger.getAll().forEach((t) => t.disable(false));
      return;
    }

    // Wait for the unlock to actually take effect in the layout, then
    // refresh. Two RAFs ensure layout has settled.
    const id1 = requestAnimationFrame(() => {
      const id2 = requestAnimationFrame(() => {
        ScrollTrigger.getAll().forEach((t) => t.enable());
        ScrollTrigger.refresh();
      });
      // Cleanup nested RAF on unmount mid-flight
      return () => cancelAnimationFrame(id2);
    });

    return () => cancelAnimationFrame(id1);
  }, [noteRemoved]);

  // Also refresh on window load (catches font/image lazy settle)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handler = () => ScrollTrigger.refresh();
    if (document.readyState === "complete") {
      requestAnimationFrame(handler);
    } else {
      window.addEventListener("load", handler, { once: true });
      return () => window.removeEventListener("load", handler);
    }
  }, []);

  return null;
}