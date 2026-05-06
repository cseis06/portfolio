"use client";

import Image from "next/image";
import { useTVControls } from "@/hooks/useTVControls";
import { useProjectsStore } from "@/lib/stores/projectsStore";

type ButtonName = "prev" | "next" | "play" | "stop" | "turn-off";

interface ButtonConfig {
  name: ButtonName;
  label: string;
  handler: () => void;
}

export default function TVButtons() {
  const { prev, next, play, stop, turnOff } = useTVControls();
  const isReady = useProjectsStore((s) => s.isReady);

  // Order: navigation cluster (prev/next), playback cluster (play/stop), power
  const buttons: ButtonConfig[] = [
    { name: "stop", label: "Stop / no signal", handler: stop },
    { name: "prev", label: "Previous channel", handler: prev },
    { name: "play", label: "Play / power on", handler: play },
    { name: "next", label: "Next channel", handler: next },
    { name: "turn-off", label: "Turn off", handler: turnOff },
  ];

  return (
    <div
      role="group"
      aria-label="Television controls"
      className={`
        flex items-center gap-3 md:gap-4
        transition-opacity duration-700
        ${isReady ? "opacity-100" : "opacity-0 pointer-events-none"}
      `}
    >
      {buttons.map((b) => (
        <button
          key={b.name}
          type="button"
          onClick={b.handler}
          aria-label={b.label}
          className="
            relative w-14 h-14 md:w-16 md:h-16
            transition-transform duration-100 ease-out
            hover:brightness-110
            active:scale-90
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blood
            focus-visible:ring-offset-2 focus-visible:ring-offset-ink
            cursor-pointer
          "
        >
          <Image
            src={`/projects/button-${b.name}.png`}
            alt=""
            fill
            sizes="(max-width: 768px) 56px, 64px"
            className="object-contain pointer-events-none select-none"
            draggable={false}
          />
        </button>
      ))}
    </div>
  );
}