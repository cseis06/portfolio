"use client";

import { useCallback, useRef } from "react";
import { useProjectsStore } from "@/lib/stores/projectsStore";
import { useSfx } from "@/hooks/useSfx";

const STATIC_DURATION = 400; // ms — matches your spec
const SWAP_AT = 200;         // swap channel mid-burst, so the new content
                             // is "behind" the static when it clears

/**
 * Channel-change coordinator. Handles audio + transition state in lockstep:
 *   click sound → static hiss starts → swap channel → static fades → hiss stops
 *
 * Re-clicking the same channel is a no-op. Re-clicking during a transition
 * is debounced (refs prevent overlapping bursts).
 */
export function useChannelChange() {
  const setChannel = useProjectsStore((s) => s.setChannel);
  const setTransitioning = useProjectsStore((s) => s.setTransitioning);
  const inFlight = useRef(false);

  const { play: playClick } = useSfx("/sfx/tv-click.mp3", { volume: 0.7 });
  const { play: playStatic, stop: stopStatic } = useSfx(
    "/sfx/tv-static.mp3",
    { loop: true, volume: 0.35 }
  );

  return useCallback(
    (newChannel: number) => {
      const { currentChannel } = useProjectsStore.getState();
      if (inFlight.current || newChannel === currentChannel) return;
      inFlight.current = true;

      playClick();
      playStatic();
      setTransitioning(true);

      // Swap channel mid-burst so the new content is hidden behind static
      // and revealed as it clears — feels like the TV is genuinely tuning.
      setTimeout(() => setChannel(newChannel), SWAP_AT);

      setTimeout(() => {
        setTransitioning(false);
        stopStatic();
        inFlight.current = false;
      }, STATIC_DURATION);
    },
    [setChannel, setTransitioning, playClick, playStatic, stopStatic]
  );
}