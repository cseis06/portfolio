"use client";

import { useEffect, useState } from "react";
import { useSfx } from "@/hooks/useSfx";

interface SubtitleProps {
  text: string;
  speed?: number;       // base ms per character
  startDelay?: number;  // ms before typing begins
}

/**
 * Types `text` character-by-character with a touch of jitter (humans
 * aren't metronomes). Loops typing-se.mp3 for the duration; stops cleanly
 * when typing finishes, when text changes, or on unmount.
 */
export default function Subtitle({
  text,
  speed = 55,
  startDelay = 700,
}: SubtitleProps) {
  const [displayed, setDisplayed] = useState("");
  const { play: playTyping, stop: stopTyping } = useSfx(
    "/sfx/typing-se.mp3",
    { loop: true, volume: 0.5 }
  );

  useEffect(() => {
    setDisplayed("");

    if (!text) {
      stopTyping();
      return;
    }

    let i = 0;
    let charTimer: ReturnType<typeof setTimeout>;
    let audioStarted = false;

    const tick = () => {
      if (i >= text.length) {
        stopTyping();
        return;
      }
      // Start audio on the first real character (after the startDelay),
      // not during the pause — feels more natural.
      if (!audioStarted) {
        playTyping();
        audioStarted = true;
      }
      i++;
      setDisplayed(text.slice(0, i));
      charTimer = setTimeout(tick, speed + Math.random() * 40);
    };

    const startTimer = setTimeout(tick, startDelay);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(charTimer);
      stopTyping();
    };
  }, [text, speed, startDelay, playTyping, stopTyping]);

  return (
    <p
      className="
        font-sans text-xs md:text-base
        tracking-wider text-bone/85 drop-shadow-[2.5px_1.3px_1.3px_rgba(0,0,0,0.9)]
        text-center select-none
        leading-relaxed
      "
      aria-live="polite"
    >
      <span className="inline-block min-h-[1.4em]">
        {displayed}
        {text && (
          <span
            aria-hidden="true"
            className="
              ml-1 inline-block
              w-[0.5em] h-[1em]
              bg-bone/85 align-text-bottom
              animate-cursor-blink
            "
          />
        )}
      </span>
    </p>
  );
}