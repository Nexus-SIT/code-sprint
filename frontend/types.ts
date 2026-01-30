export type Mode = 'HOME' | 'LEARNING' | 'GAME';

export interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export type MentorEmotion = 'happy' | 'neutral' | 'alert' | 'thinking';

export interface GameState {
  mode: Mode;
  walletBalance: number;
  userRank: number;
  xp: number;
  setMode: (mode: Mode) => void;
  updateBalance: (amount: number) => void;
  addXp: (amount: number) => void;
}