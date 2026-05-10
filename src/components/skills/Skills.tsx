"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useHeroStore } from "@/lib/stores/heroStore";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const FRAME_COUNT = 128;
const FRAME_PATH = (i: number) => `/skills/${i}.jpg`;

// Virtual scroll distance. Higher = slower playback per scroll wheel tick.
// 4500px ≈ ~5 viewports of scroll for the whole sequence — fast enough
// that it feels like animation, slow enough you can stop on any frame.
const SCROLL_DISTANCE = 8500;

/**
 * Frame-by-frame canvas playback driven by scroll position. Renders a
 * pinned full-viewport canvas and draws one image per scroll tick.
 *
 * Why canvas instead of stacked <img> with opacity:
 *   - 102 image elements with opacity transitions = 102 GPU layers,
 *     significant memory pressure, blurry blends during fast scrolls
 *   - Canvas: one element, single drawImage per frame, sharp every time
 *
 * Loading: all frames preloaded as Image objects before the trigger
 * activates. Until everything is decoded, we show a small loading hint
 * but the section still occupies the right scroll height so the layout
 * downstream doesn't shift when frames finish loading.
 */
export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const [loaded, setLoaded] = useState(0);
  const [allLoaded, setAllLoaded] = useState(false);

  const noteRemoved = useHeroStore((s) => s.noteRemoved);

  // === STAGE 1: Preload all frames =====================================
  // Starts immediately on mount. Frames are JPEGs, total ~11MB.
  // Browser cache means repeat visits are instant.
  useEffect(() => {
    if (typeof window === "undefined") return;

    const images: HTMLImageElement[] = [];
    let cancelled = false;
    let loadedCount = 0;

    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      img.src = FRAME_PATH(i);
      img.onload = () => {
        if (cancelled) return;
        loadedCount++;
        setLoaded(loadedCount);
        if (loadedCount === FRAME_COUNT) setAllLoaded(true);
      };
      img.onerror = () => {
        // Don't block sequence if one frame 404s — skip gracefully
        if (cancelled) return;
        loadedCount++;
        setLoaded(loadedCount);
        if (loadedCount === FRAME_COUNT) setAllLoaded(true);
      };
      images.push(img);
    }

    imagesRef.current = images;
    return () => {
      cancelled = true;
      // Help GC — release decoded pixel data references
      images.forEach((img) => {
        img.onload = null;
        img.onerror = null;
      });
    };
  }, []);

  // === STAGE 2: Size the canvas to viewport, redraw on resize ==========
  useEffect(() => {
    if (typeof window === "undefined") return;

    const fitCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2); // cap at 2x
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Redraw current frame at new size
      drawFrame(currentFrameRef.current);
    };

    fitCanvas();
    window.addEventListener("resize", fitCanvas);
    return () => window.removeEventListener("resize", fitCanvas);
  }, []);

  // Draws image[idx] to canvas, contain-fit (fully visible, letterbox with
  // bone where the frame's aspect ratio doesn't match the viewport).
  const drawFrame = (idx: number) => {
    const canvas = canvasRef.current;
    const img = imagesRef.current[idx];
    if (!canvas || !img || !img.complete || img.naturalWidth === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cw = canvas.clientWidth;
    const ch = canvas.clientHeight;
    const ir = img.naturalWidth / img.naturalHeight;
    const cr = cw / ch;

    let dw: number;
    let dh: number;
    let dx: number;
    let dy: number;

    if (ir > cr) {
      // Image wider than canvas → fit by width, letterbox top/bottom
      dw = cw;
      dh = cw / ir;
      dx = 0;
      dy = (ch - dh) / 2;
    } else {
      // Image taller than canvas → fit by height, letterbox sides
      /*dh = ch;
      dw = ch * ir;
      dx = (cw - dw) / 2;
      dy = 0;*/
      // Image wider than canvas → fit by width, letterbox top/bottom
      dw = cw;
      dh = cw / ir;
      dx = 0;
      dy = (ch - dh) / 2;
    }

    // Fill the entire canvas with bone first, so any letterbox area
    // matches the frame interior (white-ish background of the JPGs).
    // Read the actual CSS variable so this stays in sync with the palette.
    const bone =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--color-bone")
        .trim() || "#fafaf9";
    ctx.fillStyle = bone;
    ctx.fillRect(0, 0, cw, ch);

    ctx.drawImage(img, dx, dy, dw, dh);
  };

  // === STAGE 3: ScrollTrigger that scrubs through frames ===============
  useGSAP(
    () => {
      // Two gates: Hero must have released, and frames must be loaded.
      // Either missing → no trigger created. The dependencies array
      // re-runs this when those flip, ensuring trigger creation happens
      // exactly once with correct conditions.
      if (!noteRemoved) return;
      if (!allLoaded) return;
      if (!sectionRef.current) return;

      // Reduced motion: render a single representative frame, no scrub.
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (reduce) {
        drawFrame(Math.floor(FRAME_COUNT * 0.7)); // late-sequence still
        return;
      }

      const proxy = { frame: 0 };
      drawFrame(0);

      gsap.to(proxy, {
        frame: FRAME_COUNT - 1,
        ease: "none",
        snap: { frame: 1 }, // integer frame indices only — no half-frames
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: `+=${SCROLL_DISTANCE}`,
          pin: true,
          scrub: 0.4,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
        onUpdate: () => {
          const idx = proxy.frame;
          if (idx === currentFrameRef.current) return;
          currentFrameRef.current = idx;
          drawFrame(idx);
        },
      });
    },
    { scope: sectionRef, dependencies: [noteRemoved, allLoaded] }
  );

  return (
    <section
      ref={sectionRef}
      id="skills"
      aria-label="Skills"
      className="relative h-screen w-full overflow-hidden bg-bone"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Tiny loading indicator — only shown before frames complete.
          Once all loaded, this disappears and the canvas takes over. */}
      {!allLoaded && noteRemoved && (
        <div
          className="
            absolute bottom-8 left-1/2 -translate-x-1/2
            font-sans text-[10px] uppercase tracking-[0.4em] text-ink/50
            pointer-events-none
          "
          aria-live="polite"
        >
          loading reels · {Math.round((loaded / FRAME_COUNT) * 100)}%
        </div>
      )}
    </section>
  );
}