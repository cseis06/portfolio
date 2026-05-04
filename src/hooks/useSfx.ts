"use client";

import { useCallback, useEffect, useRef } from "react";

interface SfxOptions {
  loop?: boolean;
  volume?: number;
}

/**
 * Tiny audio wrapper. Lazy-creates an HTMLAudioElement, exposes stable
 * play/stop callbacks, and swallows autoplay rejections so the UI never
 * breaks because the browser muted us.
 */
export function useSfx(src: string, options: SfxOptions = {}) {
  const { loop = false, volume = 1 } = options;
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const audio = new Audio(src);
    audio.loop = loop;
    audio.volume = volume;
    audio.preload = "auto";
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
      audio.load(); // release the buffer
      audioRef.current = null;
    };
  }, [src, loop, volume]);

  const play = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    a.currentTime = 0;
    void a.play().catch(() => {
      // Autoplay blocked or no user gesture yet — fail silently.
    });
  }, []);

  const stop = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    a.pause();
    a.currentTime = 0;
  }, []);

  return { play, stop };
}