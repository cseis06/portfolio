"use client";

import { useCallback, useRef } from "react";
import { useProjectsStore } from "@/lib/stores/projectsStore";
import { useSfx } from "@/hooks/useSfx";
import { projects } from "@/lib/data/projects";

const STATIC_DURATION = 400;
const SWAP_AT = 200;

export function useTVControls() {
  const setChannel = useProjectsStore((s) => s.setChannel);
  const setTransitioning = useProjectsStore((s) => s.setTransitioning);
  const setPowerState = useProjectsStore((s) => s.setPowerState);
  const setPaused = useProjectsStore((s) => s.setPaused);
  const inFlight = useRef(false);

  const { play: playClick } = useSfx("/sfx/tv-click.mp3", { volume: 0.7 });
  const { play: playStatic, stop: stopStatic } = useSfx(
    "/sfx/tv-static.mp3",
    { loop: true, volume: 0.35 }
  );

  const burst = useCallback(
    (atMidpoint: () => void) => {
      if (inFlight.current) return;
      inFlight.current = true;
      playStatic();
      setTransitioning(true);

      window.setTimeout(atMidpoint, SWAP_AT);
      window.setTimeout(() => {
        setTransitioning(false);
        stopStatic();
        inFlight.current = false;
      }, STATIC_DURATION);
    },
    [playStatic, stopStatic, setTransitioning]
  );

  // Channel cycling — disabled when off, auto-resumes if paused
  const cycleChannel = useCallback(
    (delta: 1 | -1) => {
      const { powerState } = useProjectsStore.getState();
      if (powerState === "off") return; // ignore when off
      playClick();

      const max = projects.length;
      const { currentChannel } = useProjectsStore.getState();
      const target = ((currentChannel - 1 + delta + max) % max) + 1;

      burst(() => {
        setChannel(target);
        // Cycling channels naturally resumes from a pause
        if (useProjectsStore.getState().isPaused) setPaused(false);
      });
    },
    [playClick, burst, setChannel, setPaused]
  );

  const prev = useCallback(() => cycleChannel(-1), [cycleChannel]);
  const next = useCallback(() => cycleChannel(1), [cycleChannel]);

  /**
   * play
   *  - off:    no-op (turn-off handles power)
   *  - on, paused:    resume — burst then unpause at midpoint
   *  - on, not paused: refresh — burst with no state change
   */
  const play = useCallback(() => {
    const { powerState, isPaused } = useProjectsStore.getState();
    if (powerState === "off") return;
    playClick();

    if (isPaused) {
      burst(() => setPaused(false));
    } else {
      burst(() => {});
    }
  }, [playClick, burst, setPaused]);

  /**
   * stop — pauses the broadcast (only meaningful when on, not already paused)
   */
  const stop = useCallback(() => {
    const { powerState, isPaused } = useProjectsStore.getState();
    if (powerState === "off" || isPaused) return;
    playClick();
    burst(() => setPaused(true));
  }, [playClick, burst, setPaused]);

  /**
   * turnOff — toggles power.
   *  - on  -> off (kills audio, blacks the screen)
   *  - off -> on  (returns to last channel; pause state preserved)
   */
  const turnOff = useCallback(() => {
    playClick();
    const { powerState } = useProjectsStore.getState();

    if (powerState === "on") {
      setPowerState("off");
      stopStatic();
    } else {
      setPowerState("on");
      // Power-on is its own brief burst — feels like a CRT warming up
      burst(() => {});
    }
  }, [playClick, setPowerState, stopStatic, burst]);

  return { prev, next, play, stop, turnOff };
}