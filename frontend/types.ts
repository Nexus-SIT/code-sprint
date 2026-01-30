export type Mode = 'HOME' | 'LEARNING' | 'GAME';
export type Theme = 'light' | 'dark';

export interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export type MentorEmotion = 'happy' | 'neutral' | 'alert' | 'thinking';

export interface RankTier {
  tier: number;
  name: string;
  minProfit: number;
  maxProfit: number;
  icon: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  xpReward: number;
}

export interface UserProfile {
  userId: string;
  username: string;
  walletBalance: number;
  totalProfit: number;
  xp: number;
  level: number;
  rank: number;
  rankName: string;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  bestTrade: number;
  worstTrade: number;
  currentStreak: number;
  longestStreak: number;
  achievements: string[];
}

export interface TradeHistory {
  tradeId: string;
  symbol: string;
  position: 'BUY' | 'SELL' | 'HOLD';
  betAmount: number;
  entryPrice: number;
  exitPrice: number;
  pnl: number;
  timestamp: string;
}

export interface LeaderboardEntry {
  position: number;
  userId: string;
  username: string;
  totalProfit: number;
  rank: number;
  rankName: string;
  winRate: string;
  totalTrades: number;
}

export interface GameState {
  mode: Mode;
  theme: Theme;
  userId: string | null;
  userProfile: UserProfile | null;
  walletBalance: number;
  userRank: number;
  xp: number;
  setMode: (mode: Mode) => void;
  toggleTheme: () => void;
  setUserId: (userId: string) => void;
  setUserProfile: (profile: UserProfile) => void;
  updateBalance: (amount: number) => void;
  addXp: (amount: number) => void;
}