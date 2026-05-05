"use client";

import { useProjectsStore } from "@/lib/stores/projectsStore";
import { projects } from "@/lib/data/projects";
import { useChannelChange } from "@/hooks/useChannelChange";

export default function ChannelControls() {
  const currentChannel = useProjectsStore((s) => s.currentChannel);
  const isReady = useProjectsStore((s) => s.isReady);
  const isTransitioning = useProjectsStore((s) => s.isTransitioning);
  const changeChannel = useChannelChange();

  const max = projects.length;
  const prev = () =>
    changeChannel(currentChannel === 1 ? max : currentChannel - 1);
  const next = () =>
    changeChannel(currentChannel === max ? 1 : currentChannel + 1);

  return (
    <div
      role="group"
      aria-label="Television channel controls"
      className={`
        flex items-center gap-2
        transition-opacity duration-700
        ${isReady ? "opacity-100" : "opacity-0 pointer-events-none"}
      `}
    >
      <button
        type="button"
        onClick={prev}
        disabled={isTransitioning}
        aria-label="Previous channel"
        className="tv-btn tv-btn-arrow"
      >
        ‹
      </button>

      <div className="flex items-center gap-1.5 px-3 py-1.5 mx-1 bg-ink/60 border border-bone/15 rounded">
        {projects.map((p) => {
          const active = currentChannel === p.channel;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => changeChannel(p.channel)}
              disabled={isTransitioning}
              aria-label={`Channel ${p.channel}: ${p.title}`}
              aria-pressed={active}
              className={`tv-btn tv-btn-num ${active ? "tv-btn-active" : ""}`}
            >
              {p.channel}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={next}
        disabled={isTransitioning}
        aria-label="Next channel"
        className="tv-btn tv-btn-arrow"
      >
        ›
      </button>
    </div>
  );
}