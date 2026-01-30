import { create } from 'zustand';
import { GameState, Mode } from './types';

export const useStore = create<GameState>((set) => ({
  mode: 'HOME',
  walletBalance: 100000,
  userRank: 1,
  xp: 0,
  setMode: (mode: Mode) => set({ mode }),
  updateBalance: (amount: number) => set((state) => ({ walletBalance: state.walletBalance + amount })),
  addXp: (amount: number) => set((state) => ({ xp: state.xp + amount })),
}));