import { create } from 'zustand';
import { getRankName } from './utils/rankIcons';
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
          rankName: getRankName(data.rank ?? 0),
        }
        : null,
    })),

  // ❌ Local-only updates enabled for immediate feedback
  updateBalance: (amount: number) =>
    set((state) => {
      const newBalance = state.walletBalance + amount;
      const currentProfit = state.userProfile?.totalProfit || 0;
      const newTotalProfit = currentProfit + amount;

      // Calculate Rank locally
      let newRank = 0;
      let newRankName = 'Novice Trader';

      const thresholds = [
        { tier: 0, name: 'Novice Trader', minProfit: -Infinity },
        { tier: 1, name: 'Apprentice Trader', minProfit: 1000 },
        { tier: 2, name: 'Skilled Trader', minProfit: 50000 },
        { tier: 3, name: 'Expert Trader', minProfit: 150000 },
        { tier: 4, name: 'Master Trader', minProfit: 300000 },
        { tier: 5, name: 'Elite Trader', minProfit: 600000 },
        { tier: 6, name: 'Legendary Trader', minProfit: 1000000 }
      ];

      for (let i = thresholds.length - 1; i >= 0; i--) {
        if (newTotalProfit >= thresholds[i].minProfit) {
          newRank = thresholds[i].tier;
          newRankName = thresholds[i].name;
          break;
        }
      }

      return {
        walletBalance: newBalance,
        userRank: newRank,
        userProfile: state.userProfile
          ? {
            ...state.userProfile,
            walletBalance: newBalance,
            totalProfit: newTotalProfit,
            rank: newRank,
            rankName: newRankName,
          }
          : state.userProfile,
      };
    }),

  addXp: (amount: number) =>
    set((state) => ({
      xp: state.xp + amount,
      userProfile: state.userProfile
        ? {
          ...state.userProfile,
          xp: state.userProfile.xp + amount,
        }
        : state.userProfile,
    })),

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
