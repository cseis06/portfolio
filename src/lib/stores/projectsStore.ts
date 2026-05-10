import { create } from "zustand";

export type PowerState = "on" | "off";

interface ProjectsState {
  currentChannel: number;
  isTransitioning: boolean;
  isReady: boolean;
  powerState: PowerState;
  isPaused: boolean;
  setChannel: (channel: number) => void;
  setTransitioning: (v: boolean) => void;
  setReady: (v: boolean) => void;
  setPowerState: (state: PowerState) => void;
  setPaused: (v: boolean) => void;
}

export const useProjectsStore = create<ProjectsState>((set) => ({
  currentChannel: 1,
  isTransitioning: false,
  isReady: false,
  powerState: "on",
  isPaused: false,
  setChannel: (channel) => set({ currentChannel: channel }),
  setTransitioning: (v) => set({ isTransitioning: v }),
  setReady: (v) => set({ isReady: v }),
  setPowerState: (state) => set({ powerState: state }),
  setPaused: (v) => set({ isPaused: v }),
}));