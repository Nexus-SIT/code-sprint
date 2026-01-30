
import { Path, TaskType, OHLCData, Room } from '../types';

const generateChart = (count: number, startPrice: number, volatility = 5): OHLCData[] => {
  const data: OHLCData[] = [];
  let currentPrice = startPrice;
  for (let i = 0; i < count; i++) {
    const open = currentPrice;
    const change = (Math.random() - 0.45) * volatility;
    const close = open + change;
    const high = Math.max(open, close) + Math.random() * 2;
    const low = Math.min(open, close) - Math.random() * 2;
    data.push({
      time: `2024-01-${(i + 1).toString().padStart(2, '0')}`,
      open, high, low, close,
      volume: Math.floor(Math.random() * 1000)
    });
    currentPrice = close;
  }
  return data;
};

const createModuleRooms = (prefix: string, titles: string[], icon: Room['iconType']): Room[] => {
  return titles.map((title, i) => ({
    id: `${prefix.toLowerCase().replace(/\s+/g, '-')}-${i}`,
    title: title,
    description: `Master the core concepts of ${title} through interactive simulations.`,
    thumbnail: `https://picsum.photos/seed/${prefix}${i}/400/225`,
    iconType: icon,
    chartData: generateChart(30, 100 + (i * 10)),
    tasks: [
      {
        id: `${prefix}-t-${i}`,
        title: 'Identify Pattern',
        theory: [`In this task, we focus on ${title}.`],
        question: `Find the specific candle that validates the ${title} concept at index 5.`,
        type: TaskType.CLICK_CANDLE,
        correctIndex: 5,
        hint: 'Check the middle of the chart for a significant move.',
        reward: 100,
        penalty: 25
      }
    ]
  }));
};

export const TRADER_PATH: Path = {
  id: 'pro-trader-path',
  title: 'Introduction to Professional Trading',
  modules: [
    {
      id: 'm1',
      title: 'Module 1: Market Basics',
      description: 'Understanding what a chart actually represents.',
      rooms: createModuleRooms('M1', ['Price Movement', 'Candle Anatomy', 'Timeframes'], 'terminal')
    },
    {
      id: 'm2',
      title: 'Module 2: Market Structure',
      description: 'Stop guessing direction; identify the trend.',
      rooms: createModuleRooms('M2', ['HH & HL Identification', 'Downtrend Structure', 'Structure Break'], 'chart')
    },
    {
      id: 'm3',
      title: 'Module 3: Support & Resistance',
      description: 'Where the big money makes decisions.',
      rooms: createModuleRooms('M3', ['Static Support', 'Resistance Levels', 'Zones vs Lines'], 'shield')
    },
    {
      id: 'm4',
      title: 'Module 4: Risk Management',
      description: 'The most important module. Protect your capital.',
      rooms: createModuleRooms('M4', ['Stop Loss Placement', 'Risk-Reward Ratio', 'Position Sizing'], 'target')
    }
  ]
};
