import { create } from 'zustand';
import { GameState, Mode, Theme, UserProfile } from './types';

// Load theme from localStorage
const getInitialTheme = (): Theme => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('theme');
    return (saved as Theme) || 'light';
  }
  return 'light';
};

// Load user ID from localStorage
const getInitialUserId = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('userId');
  }
  return null;
};

export const useStore = create<GameState>((set) => ({
  mode: 'HOME',
  theme: getInitialTheme(),
  userId: getInitialUserId(),
  userProfile: null,
  walletBalance: 100000,
  userRank: 1,
  xp: 0,

  setMode: (mode: Mode) => set({ mode }),

  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newTheme);
    }
    return { theme: newTheme };
  }),

  setUserId: (userId: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('userId', userId);
    }
    set({ userId });
  },

  setUserProfile: (profile: UserProfile) => set({
    userProfile: profile,
    walletBalance: profile.walletBalance,
    userRank: profile.rank,
    xp: profile.xp
  }),

  updateBalance: (amount: number) => set((state) => ({
    walletBalance: state.walletBalance + amount
  })),

  addXp: (amount: number) => set((state) => ({
    xp: state.xp + amount
  })),
}));