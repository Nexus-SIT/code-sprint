import { create } from 'zustand';
import { GameState, Theme, UserProfile } from './types';

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
  theme: getInitialTheme(),
  userId: getInitialUserId(),

  // 🔥 backend-driven state
  userProfile: null,
  walletBalance: 0,
  userRank: 0,
  xp: 0,

  toggleTheme: () =>
    set((state) => {
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

  // 🔥 Called after Firebase fetch
  setUserProfile: (profile: UserProfile) =>
    set({
      userProfile: profile,
      walletBalance: profile.walletBalance,
      xp: profile.xp,
      userRank: profile.rank ?? 0,
    }),

  // 🔥 Sync directly from Firebase doc
  syncFromFirebase: (data: {
    balance: number;
    xp: number;
    rank?: number;
  }) =>
    set({
      walletBalance: data.balance,
      xp: data.xp,
      userRank: data.rank ?? 0,
    }),

  // ❌ Local-only updates removed
  // updateBalance: () => {},
  addXp: () => { },
}));
