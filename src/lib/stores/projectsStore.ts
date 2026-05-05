import { create } from "zustand";

interface ProjectsState {
  currentChannel: number;
  isTransitioning: boolean;   // true during the ~400ms static burst
  isReady: boolean;           // true after entrance animation completes
  setChannel: (channel: number) => void;
  setTransitioning: (v: boolean) => void;
  setReady: (v: boolean) => void;
}

export const useProjectsStore = create<ProjectsState>((set) => ({
  currentChannel: 1,
  isTransitioning: false,
  isReady: false,
  setChannel: (channel) => set({ currentChannel: channel }),
  setTransitioning: (v) => set({ isTransitioning: v }),
  setReady: (v) => set({ isReady: v }),
}));