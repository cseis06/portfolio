import { create } from "zustand";

interface HeroState {
  noteRemoved: boolean;
  revealComplete: boolean;
  removeNote: () => void;
  setRevealComplete: (v: boolean) => void;
}

/**
 * Single source of truth for the hero's narrative state.
 * - `noteRemoved`: drives scroll lock + triggers the FaceStack ScrollTrigger setup.
 * - `revealComplete`: fires when the user has scrolled through all four words.
 *   Useful later for unlocking nav, playing a "thunk" sound, etc.
 */
export const useHeroStore = create<HeroState>((set) => ({
  noteRemoved: false,
  revealComplete: false,
  removeNote: () => set({ noteRemoved: true }),
  //setRevealComplete: (v) => set({ revealComplete: v }),
  setRevealComplete: (v) => set({ revealComplete: false }),
}));