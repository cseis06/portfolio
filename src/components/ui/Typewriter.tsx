"use client";

import { useEffect, useRef, useState } from "react";
import { useSfx } from "@/hooks/useSfx";

interface TypewriterProps {
  text: string;
  speed?: number;
  startDelay?: number;
  withSound?: boolean;
  cursor?: boolean;
  triggerOnView?: boolean;
  threshold?: number;
  cursorClassName?: string;
}

/**
 * Types `text` character-by-character with optional sound. Renders as an
 * inline span so it inherits font/color from its parent — wrap in <h1>,
 * <p>, etc. for semantics. Trigger is intersection-observer based so it
 * fires when the user actually sees it.
 */
export default function Typewriter({
  text,
  speed = 75,
  startDelay = 0,
  withSound = false,
  cursor = true,
  triggerOnView = true,
  threshold = 0.3,
  cursorClassName,
}: TypewriterProps) {
  const [displayed, setDisplayed] = useState("");
  const [active, setActive] = useState(!triggerOnView);
  const [done, setDone] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  const { play, stop } = useSfx("/sfx/typing-se.mp3", {
    loop: true,
    volume: 0.45,
  });

  useEffect(() => {
    if (!triggerOnView || active || !ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [triggerOnView, threshold, active]);

  useEffect(() => {
    if (!active || !text) return;

    let i = 0;
    let timer: ReturnType<typeof setTimeout>;
    let started = false;

    const tick = () => {
      if (i >= text.length) {
        setDone(true);
        if (withSound) stop();
        return;
      }
      if (withSound && !started) {
        play();
        started = true;
      }
      i++;
      setDisplayed(text.slice(0, i));
      timer = setTimeout(tick, speed + Math.random() * 40);
    };

    const startTimer = setTimeout(tick, startDelay);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(timer);
      if (withSound) stop();
    };
  }, [active, text, speed, startDelay, withSound, play, stop]);

  return (
    <span ref={ref} aria-label={text}>
      <span aria-hidden="true">{displayed}</span>
      {cursor && active && !done && (
        <span
          aria-hidden="true"
          className={`inline-block w-[0.08em] h-[0.85em] ml-[0.05em] align-baseline animate-cursor-blink ${cursorClassName ?? "bg-current"}`}
        />
      )}
    </span>
  );
}