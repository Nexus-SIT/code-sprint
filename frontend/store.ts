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

const getInitialCompletedModules = (): string[] => {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('completedModules');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }
  return [];
}

export const useStore = create<GameState>((set) => ({
  theme: getInitialTheme(),
  userId: getInitialUserId(),

  // 🔥 backend-driven state
  userProfile: null,
  walletBalance: 0,
  userRank: 0,
  xp: 0,
  completedRooms: [],

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
      completedRooms: profile.completedRooms || [],
    }),

  syncFromFirebase: (data: {
    balance: number;
    xp: number;
    totalProfit: number;
    rank?: number;
    completedRooms?: string[];
  }) =>
    set((state) => ({
      walletBalance: data.balance,
      xp: data.xp,
      userRank: data.rank ?? 0,
      userProfile: state.userProfile
        ? {
          ...state.userProfile,
          totalProfit: data.totalProfit,
          walletBalance: data.balance,
          xp: data.xp,
          rank: data.rank ?? 0,
        }
        : null,
    })),

  // ❌ Local-only updates removed
  updateBalance: () => { },
  addXp: () => { },

  // New persistent module tracking
  completedModules: getInitialCompletedModules(),
  markModuleComplete: (moduleId: string) =>
    set((state) => {
      if (!state.completedModules.includes(moduleId)) {
        const newCompleted = [...state.completedModules, moduleId];
        if (typeof window !== 'undefined') {
          // Simple local persistence for guests
          try {
            localStorage.setItem('completedModules', JSON.stringify(newCompleted));
          } catch (e) {
            console.error('Failed to save progress', e);
          }
        }
        return { completedModules: newCompleted };
      }
      return {};
    }),
}));
