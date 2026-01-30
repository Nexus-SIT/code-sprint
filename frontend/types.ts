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
  theme: Theme;
  userId: string | null;
  userProfile: UserProfile | null;
  walletBalance: number;
  userRank: number;
  xp: number;
  toggleTheme: () => void;
  setUserId: (userId: string) => void;
  setUserProfile: (profile: UserProfile) => void;
  addXp: (amount: number) => void;
  syncFromFirebase: (data: { balance: number; xp: number; rank?: number }) => void;
}

// --- New Types for Learning System ---

export type MascotState = 'happy' | 'neutral' | 'dizzy' | 'thinking' | 'surprised';

export interface OHLCData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}



export type TaskType = 'INFO' | 'QUIZ' | 'CHART_SELECT' | 'DRAW_LINE' | 'ACTION' | 'WAIT';

export interface Task {
  id: string;
  title: string;
  description: string;
  type: TaskType;
  challengeText: string;
  correctAnswer?: string;
  correctRegion?: { startIdx: number; endIdx: number; };
}

export interface Room {
  id: string;
  title: string;
  description?: string;
  tasks: Task[];
  iconType: 'terminal' | 'shield' | 'chart' | 'target' | 'sword' | 'lock' | 'skull' | 'heart' | 'cat'; // For the RoadmapView icons
}

export interface Module {
  id: string;
  title: string;
  description?: string; // RoadmapView uses this
  goal: string;
  rooms: Room[];
}

export interface Path {
  id: string;
  title: string;
  description: string;
  modules: Module[];
}

export interface UserStats {
  totalModules: number;
  completedModules: number;
  averageScore: number;
}

// --- New Types for Learning System ---

export type MascotState = 'happy' | 'neutral' | 'dizzy' | 'thinking' | 'surprised';

export interface OHLCData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}



export type TaskType = 'INFO' | 'QUIZ' | 'CHART_SELECT' | 'DRAW_LINE' | 'ACTION' | 'WAIT';

export interface Task {
  id: string;
  title: string;
  description: string;
  type: TaskType;
  challengeText: string;
  correctAnswer?: string;
  correctRegion?: { startIdx: number; endIdx: number; };
}

export interface Room {
  id: string;
  title: string;
  description?: string;
  tasks: Task[];
  iconType: 'terminal' | 'shield' | 'chart' | 'target' | 'sword' | 'lock' | 'skull' | 'heart' | 'cat'; // For the RoadmapView icons
}

export interface Module {
  id: string;
  title: string;
  description?: string; // RoadmapView uses this
  goal: string;
  rooms: Room[];
}

export interface Path {
  id: string;
  title: string;
  description: string;
  modules: Module[];
}

export interface UserStats {
  totalModules: number;
  completedModules: number;
  averageScore: number;
}