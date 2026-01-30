
export interface OHLCData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export enum TaskType {
  CLICK_CANDLE = 'CLICK_CANDLE',
  DRAW_LINE = 'DRAW_LINE',
  PLACE_ORDER = 'PLACE_ORDER',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE'
}

export interface Task {
  id: string;
  title: string;
  theory: string[];
  question: string;
  type: TaskType;
  correctIndex?: number;
  hint: string;
  reward: number;
  penalty: number;
}

export interface Room {
  id: string;
  title: string;
  description: string;
  tasks: Task[];
  chartData: OHLCData[];
  thumbnail: string;
  iconType: 'sword' | 'shield' | 'terminal' | 'chart' | 'cat' | 'lock' | 'target' | 'skull' | 'heart';
}

export interface Module {
  id: string;
  title: string;
  description: string;
  rooms: Room[];
}

export interface Path {
  id: string;
  title: string;
  modules: Module[];
}

export type MascotState = 'idle' | 'happy' | 'thinking' | 'dizzy' | 'surprised';

export interface UserStats {
  level: number;
  rank: string;
  globalRank: number;
  flagsCaptured: number;
  streakDays: number;
  totalProfit: number;
}
