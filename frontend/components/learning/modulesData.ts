// Module Content - NO JSX, Data Only
import { Candle } from '../../types';

/**
 * CAT POSITION TYPES
 * - 'left': Cat starts at left side (explains initial concept)
 * - 'center': Cat moves to center for deeper explanation
 * - 'right': Cat moves to right for task area
 */
export type CatPosition = 'left' | 'center' | 'right';

export interface ExplanationStep {
  id: string;
  position: CatPosition;
  catMessage: string;
  showLearningCards: boolean;
  learningCards?: string[];
}

export interface MCQOption {
  id: string;
  text: string;
  isCorrect: boolean;
  emoji?: string;
}

export interface MatchItem {
  id: string;
  left: string;
  right: string;
  emoji?: string;
}

export interface PredictionTask {
  scenario: string;
  correctAnswer: 'UP' | 'DOWN';
  emoji: string;
}

export interface ChartTask {
  instruction: string;
  data: Candle[];
  correctIndices: number[]; // Indices of candles that are correct to click
}

export interface TaskData {
  type: 'MCQ' | 'MATCH' | 'PREDICTION' | 'CHART' | 'INFO';
  title?: string;
  question?: string;
  options?: MCQOption[];
  matches?: MatchItem[];
  prediction?: PredictionTask;
  chart?: ChartTask;
  content?: string;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  icon: string;
  explanations: ExplanationStep[];
  task: TaskData;
  points: number;
  taskCompleteMessage: string;
  taskIncorrectMessage: string;
}

// Helper to generate simple candle pattern
const createCandle = (time: number, open: number, close: number, high: number, low: number): Candle => ({
  time, open, close, high, low
});

const generateUptrend = (): Candle[] => {
  return [
    createCandle(1, 100, 102, 103, 99),
    createCandle(2, 102, 104, 105, 101),
    createCandle(3, 104, 103, 105, 102),
    createCandle(4, 103, 106, 107, 102),
    createCandle(5, 106, 108, 109, 105),
    createCandle(6, 108, 110, 111, 107),
  ]
};

const generateBuyersStronger = (): Candle[] => {
  // A clear green candle amidst some noise
  return [
    createCandle(1, 100, 98, 101, 97),
    createCandle(2, 98, 99, 100, 97),
    createCandle(3, 99, 105, 106, 98), // Strong buyer candle (Index 2)
    createCandle(4, 105, 103, 106, 102),
  ]
}

const generateCandleStructure = (): Candle[] => {
  return [
    createCandle(1, 50, 60, 65, 45), // Index 0: Green, Close > Open
    createCandle(2, 60, 55, 62, 53),
    createCandle(3, 55, 40, 58, 35),
  ]
}

const generateHigherLow = (): Candle[] => {
  return [
    createCandle(1, 10, 20, 22, 9), // Low 9
    createCandle(2, 20, 30, 32, 18),
    createCandle(3, 30, 25, 31, 22),
    createCandle(4, 25, 35, 37, 24), // HL 24? No, let's make it clearer
    // Swing Low 1: 10
    // Swing High 1: 30
    // Swing Low 2: 20 (Higher Low)
    createCandle(0, 100, 105, 106, 99),
    createCandle(1, 105, 95, 106, 90), // Low 90
    createCandle(2, 95, 110, 112, 94), // High 110
    createCandle(3, 110, 100, 111, 98), // Low 98 (Higher Low) - Index 3
    createCandle(4, 100, 115, 118, 99),
  ]
}

const generateBOS = (): Candle[] => {
  return [
    createCandle(0, 100, 110, 112, 98), // High 112
    createCandle(1, 110, 105, 111, 104),
    createCandle(2, 105, 115, 116, 104), // Break 112 - Index 2
    createCandle(3, 115, 118, 120, 114),
  ]
}

// 3 Touch Support
const generateSupportZone = (): Candle[] => {
  return [
    createCandle(0, 100, 105, 106, 95), // Low 95 - Index 0
    createCandle(1, 105, 110, 111, 104),
    createCandle(2, 110, 102, 111, 96), // Low 96 - Index 2
    createCandle(3, 102, 108, 109, 101),
    createCandle(4, 108, 98, 109, 95),  // Low 95 - Index 4
    createCandle(5, 98, 106, 107, 97),
  ]
}

const generateHammerCandle = (): Candle[] => {
  return [
    createCandle(0, 100, 90, 101, 89), // Fall
    createCandle(1, 90, 85, 91, 84), // Fall
    createCandle(2, 85, 88, 89, 80), // Hammer: Open 85, Close 88, Low 80 (Long wick down) - Index 2
    createCandle(3, 88, 95, 96, 87), // Rise
  ]
}

const generateRetest = (): Candle[] => {
  // Breakout 100, Pullback to 100, then Go
  return [
    createCandle(0, 95, 98, 99, 94),
    createCandle(1, 98, 105, 106, 97), // Breakout
    createCandle(2, 105, 101, 106, 100), // Retest 100 - Index 2
    createCandle(3, 101, 110, 112, 100), // Go
  ]
}

const generateFakeBreakout = (): Candle[] => {
  // Range top 100. Wick to 105, Close 99.
  return [
    createCandle(0, 95, 99, 100, 94),
    createCandle(1, 99, 96, 100, 95),
    createCandle(2, 96, 98, 105, 95), // Fakeout wick to 105, Close 98 - Index 2
    createCandle(3, 98, 90, 99, 88), // Crash
  ]
}


export const modules: Module[] = [
  // MODULE 1: What is the Stock Market?
  {
    id: 'module-1',
    title: 'What Is the Stock Market?',
    description: 'Understand ownership',
    icon: '📘',
    points: 100,
    taskCompleteMessage: "Correct! 😻 You own a piece of the company!",
    taskIncorrectMessage: "Not quite! 💡 Buying a share means you are an OWNER. Try again!",
    explanations: [
      {
        id: 'exp-1-1',
        position: 'left',
        catMessage: "A company needs money to grow 🌳. Instead of loans, they sell small parts of ownership called SHARES.",
        showLearningCards: true,
        learningCards: ['🏢 Company Needs Money', '🍰 Sells "Shares"'],
      },
      {
        id: 'exp-1-2',
        position: 'center',
        catMessage: "When you buy a share, you become a PART-OWNER. Not an employee, not a lender. An OWNER! 👑",
        showLearningCards: true,
        learningCards: ['📜 1 Share', '✅ 1% Ownership'],
      },
      {
        id: 'exp-1-3',
        position: 'right',
        catMessage: "Example: Pizza Shop 🍕 divided into 100 pieces. You buy 1 piece = You own 1% of the shop.",
        showLearningCards: false,
      }
    ],
    task: {
      type: 'MCQ',
      question: 'If you buy 1 share, what do you own?',
      options: [
        { id: 'opt-1-1', text: 'A Loan', isCorrect: false, emoji: '🏦' },
        { id: 'opt-1-2', text: 'Ownership', isCorrect: true, emoji: '📜' },
        { id: 'opt-1-3', text: 'A Job', isCorrect: false, emoji: '💼' },
      ],
    },
  },

  // MODULE 2: Buyers & Sellers
  {
    id: 'module-2',
    title: 'How Buying & Selling Works',
    description: 'Why prices move',
    icon: '📘',
    points: 100,
    taskCompleteMessage: "Spot on! 😺 More buyers = Higher Price!",
    taskIncorrectMessage: "Think again! 💡 High demand drives prices UP. Try again!",
    explanations: [
      {
        id: 'exp-2-1',
        position: 'left',
        catMessage: "Prices move because of BUYERS and SELLERS. Buyers want low prices, Sellers want high prices. 🤝",
        showLearningCards: true,
        learningCards: ['🙋‍♂️ Buyers', '🙋‍♀️ Sellers'],
      },
      {
        id: 'exp-2-2',
        position: 'center',
        catMessage: "When MORE people want to buy, the price goes UP 📈. When MORE people want to sell, price goes DOWN 📉.",
        showLearningCards: true,
        learningCards: ['🔥 High Demand = UP', '❄️ Low Demand = DOWN'],
      },
      {
        id: 'exp-2-3',
        position: 'right',
        catMessage: "The Stock Exchange is just a marketplace where they meet. The CROWD controls the price!",
        showLearningCards: false,
      }
    ],
    task: {
      type: 'PREDICTION',
      prediction: {
        scenario: 'Buyers: 100 | Sellers: 20',
        correctAnswer: 'UP',
        emoji: '📈',
      },
    },
  },

  // MODULE 3: Market Types
  {
    id: 'module-3',
    title: 'Market Types & Options',
    description: 'IPO, Stocks, Mutual Funds',
    icon: '📘',
    points: 100,
    taskCompleteMessage: "Perfect match! 😸 You know your market types!",
    taskIncorrectMessage: "Oops! 💡 Check the definitions again. IPO is the FIRST sale. Try again!",
    explanations: [
      {
        id: 'exp-3-1',
        position: 'left',
        catMessage: "Primary Market (IPO) is when a company sells shares for the FIRST time. Secondary Market is where WE trade daily. 🔄",
        showLearningCards: true,
        learningCards: ['🆕 IPO = First Time', '🔄 Secondary = Daily'],
      },
      {
        id: 'exp-3-2',
        position: 'center',
        catMessage: "Investment types: STOCK = One company. ETF = Group of companies. MUTUAL FUND = Managed by experts. 👨‍💼",
        showLearningCards: true,
        learningCards: ['📦 ETF = Bundle', '🎓 Fund = Expert'],
      },
      {
        id: 'exp-3-3',
        position: 'right',
        catMessage: "Each has different risks. Choose what fits your goal!",
        showLearningCards: false,
      }
    ],
    task: {
      type: 'MATCH',
      matches: [
        { id: 'm-3-1', left: 'IPO', right: 'Company selling shares first time', emoji: '🆕' },
        { id: 'm-3-2', left: 'Stock', right: 'Ownership in one company', emoji: '🏢' },
        { id: 'm-3-3', left: 'Mutual Fund', right: 'Money managed by expert', emoji: '👨‍💼' },
      ],
    },
  },

  // MODULE 4: Trading vs Investing
  {
    id: 'module-4',
    title: 'Trading vs Investing',
    description: 'Choose the right approach',
    icon: '📘',
    points: 100,
    taskCompleteMessage: "That's the spirit! 😺 Short term = Trading!",
    taskIncorrectMessage: "Not quite! 💡 Investing is for long term wealth. Try again!",
    explanations: [
      {
        id: 'exp-4-1',
        position: 'left',
        catMessage: "INVESTING is for the long term (years) 🌱. Focus on growth and patience.",
        showLearningCards: true,
        learningCards: ['🌱 Investing = Years', '⏳ Patience'],
      },
      {
        id: 'exp-4-2',
        position: 'center',
        catMessage: "TRADING is short term (minutes/days) ⚡. Focus on price movement and skill.",
        showLearningCards: true,
        learningCards: ['⚡ Trading = Speed', '🧠 Skill'],
      },
      {
        id: 'exp-4-3',
        position: 'right',
        catMessage: "Don't mix them up! Beginners lose money by trading without skill. Choose based on your goal!",
        showLearningCards: false,
      }
    ],
    task: {
      type: 'MATCH',
      matches: [
        { id: 'm-4-1', left: 'Goal: Earn money today', right: 'Trading', emoji: '⚡' },
        { id: 'm-4-2', left: 'Goal: Build wealth for 5 years', right: 'Investing', emoji: '🌱' }
      ]
    },
  },

  // MODULE 5: What Is Price?
  {
    id: 'module-5',
    title: 'What Is Price?',
    description: 'Reading the battle',
    icon: '📘',
    points: 100,
    taskCompleteMessage: "Excellent! 😸 That strong green candle shows buyers winning!",
    taskIncorrectMessage: "Look closely! 💡 Find the big GREEN candle where price went UP.",
    explanations: [
      {
        id: 'exp-5-1',
        position: 'left',
        catMessage: "A price chart is a record of BATTLES between Buyers and Sellers. ⚔️",
        showLearningCards: true,
        learningCards: ['⚔️ Battle Record', '📊 Not Magic'],
      },
      {
        id: 'exp-5-2',
        position: 'center',
        catMessage: "Every candle shows who won. Green = Buyers pushed up. Red = Sellers pushed down.",
        showLearningCards: true,
        learningCards: ['🟢 Green = Buyers', '🔴 Red = Sellers'],
      },
      {
        id: 'exp-5-3',
        position: 'right',
        catMessage: "Price moves because someone clicked BUY or SELL. Find where the buyers were stronger!",
        showLearningCards: false,
      }
    ],
    task: {
      type: 'CHART',
      chart: {
        instruction: 'Click the candle where buyers were stronger (Big Green Candle).',
        data: generateBuyersStronger(),
        correctIndices: [2],
      },
    },
  },

  // MODULE 6: Candlestick Basics
  {
    id: 'module-6',
    title: 'Candlestick Basics',
    description: 'Reading one candle',
    icon: '📘',
    points: 100,
    taskCompleteMessage: "You got it! 😸 Green closes higher than it opened!",
    taskIncorrectMessage: "Check the colors! 💡 Green means Close > Open. Red means Close < Open.",
    explanations: [
      {
        id: 'exp-6-1',
        position: 'left',
        catMessage: "Each candle tells a story: Open, Close, High, Low. 📖",
        showLearningCards: true,
        learningCards: ['🟢 Green: Up', '🔴 Red: Down'],
      },
      {
        id: 'exp-6-2',
        position: 'center',
        catMessage: "Green Candle: Price CLOSED higher than it OPENED. Buyers won! 🐂",
        showLearningCards: true,
        learningCards: ['⬆️ Close > Open'],
      },
      {
        id: 'exp-6-3',
        position: 'right',
        catMessage: "Red Candle: Price CLOSED lower than it OPENED. Sellers won! 🐻",
        showLearningCards: false,
      }
    ],
    task: {
      type: 'CHART',
      chart: {
        instruction: 'Click the candle that closed higher than it opened (Green).',
        data: generateCandleStructure(),
        correctIndices: [0],
      },
    },
  },

  // MODULE 7: Trends
  {
    id: 'module-7',
    title: 'Trends',
    description: 'Identify market direction',
    icon: '📘',
    points: 100,
    taskCompleteMessage: "Correct! 😸 That's a clear Uptrend!",
    taskIncorrectMessage: "Look at the direction! 💡 Prices are going UP over time.",
    explanations: [
      {
        id: 'exp-7-1',
        position: 'left',
        catMessage: "Markets move in trends, not straight lines. 🌊",
        showLearningCards: true,
        learningCards: ['📈 Uptrend', '📉 Downtrend'],
      },
      {
        id: 'exp-7-2',
        position: 'center',
        catMessage: "Uptrend: Higher Highs and Higher Lows. Downtrend: Lower Highs and Lower Lows.",
        showLearningCards: true,
        learningCards: ['➡️ Sideways = Confusion'],
      },
      {
        id: 'exp-7-3',
        position: 'right',
        catMessage: "Trade WITH the trend for better probability! Don't swim against the river. 🏊‍♂️",
        showLearningCards: false,
      }
    ],
    task: {
      type: 'MCQ',
      question: 'Given a rising chart, identify the trend:',
      options: [
        { id: 'opt-7-1', text: 'Downtrend', isCorrect: false, emoji: '📉' },
        { id: 'opt-7-2', text: 'Uptrend', isCorrect: true, emoji: '📈' },
        { id: 'opt-7-3', text: 'Sideways', isCorrect: false, emoji: '➡️' },
      ],
    },
  },

  // MODULE 8: Market Structure
  {
    id: 'module-8',
    title: 'Market Structure',
    description: 'Higher Highs & Higher Lows',
    icon: '📘',
    points: 100,
    taskCompleteMessage: "Sharp eye! 😸 That low was higher than the previous one!",
    taskIncorrectMessage: "Look for the dip! 💡 Find the low point that is higher than the previous low.",
    explanations: [
      {
        id: 'exp-8-1',
        position: 'left',
        catMessage: "Trends are built on STRUCTURE. In an Uptrend, we make Higher Highs (HH) and Higher Lows (HL). 🏗️",
        showLearningCards: true,
        learningCards: ['🏗️ HH & HL', '🏗️ LH & LL'],
      },
      {
        id: 'exp-8-2',
        position: 'center',
        catMessage: "Higher Low (HL) is a low point that is HIGHER than the previous low. It shows buyers are stepping in earlier! 💪",
        showLearningCards: true,
        learningCards: ['💪 Buyers Stronger'],
      },
      {
        id: 'exp-8-3',
        position: 'right',
        catMessage: "Identifying structure tells you who is in control. Let's find a Higher Low!",
        showLearningCards: false,
      }
    ],
    task: {
      type: 'CHART',
      chart: {
        instruction: 'Click the Higher Low point (The dip that is higher than previous dip).',
        data: generateHigherLow(),
        correctIndices: [3],
      }
    },
  },

  // MODULE 9: Break of Structure
  {
    id: 'module-9',
    title: 'Break of Structure',
    description: 'When trends change',
    icon: '📘',
    points: 100,
    taskCompleteMessage: "Boom! 😸 Structure broken! Trend might change!",
    taskIncorrectMessage: "Find the break! 💡 Click the candle that goes BEYOND the previous limits.",
    explanations: [
      {
        id: 'exp-9-1',
        position: 'left',
        catMessage: "When price breaks a previous structure point, control might change! We call this Break of Structure (BOS). 🧱🔨",
        showLearningCards: true,
        learningCards: ['🔨 BOS', '🔄 Change of Character'],
      },
      {
        id: 'exp-9-2',
        position: 'center',
        catMessage: "If an uptrend breaks its last Low, sellers are taking over! Watch out for traps though. 🪤",
        showLearningCards: true,
        learningCards: ['⚠️ Watch for Fakeouts'],
      },
      {
        id: 'exp-9-3',
        position: 'right',
        catMessage: "Learning this prevents you from trading in the wrong direction!",
        showLearningCards: false,
      }
    ],
    task: {
      type: 'CHART',
      chart: {
        instruction: 'Click the candle that BROKE the structure (went higher than previous high).',
        data: generateBOS(),
        correctIndices: [2],
      }
    },
  },

  // MODULE 10: Support & Resistance
  {
    id: 'module-10',
    title: 'Support & Resistance',
    description: 'Where price reacts',
    icon: '📘',
    points: 100,
    taskCompleteMessage: "Exactly! 😸 Price bounced there multiple times!",
    taskIncorrectMessage: "Look for the bounces! 💡 Find the candles that bottomed out at the same level.",
    explanations: [
      {
        id: 'exp-10-1',
        position: 'left',
        catMessage: "Price has memory! 🧠 Support is a floor where price bounces UP. Resistance is a ceiling where price falls DOWN.",
        showLearningCards: true,
        learningCards: ['🏠 Support = Floor', '🛖 Resistance = Ceiling'],
      },
      {
        id: 'exp-10-2',
        position: 'center',
        catMessage: "These are ZONES, not perfect lines. The more times price reacts there, the STRONGER it is! 💪",
        showLearningCards: true,
        learningCards: ['🔄 More Touches = Stronger'],
      },
      {
        id: 'exp-10-3',
        position: 'right',
        catMessage: "Traders wait for price to reach these zones to make decisions.",
        showLearningCards: false,
      }
    ],
    task: {
      type: 'CHART',
      chart: {
        instruction: 'Click any candle bottom touching the Support Zone.',
        data: generateSupportZone(),
        correctIndices: [0, 2, 4],
      }
    },
  },

  // MODULE 11: Candlestick Signals
  {
    id: 'module-11',
    title: 'Candlestick Signals',
    description: 'Reading market emotion',
    icon: '📘',
    points: 100,
    taskCompleteMessage: "Hammer time! 😸 That long wick shows rejection of lower prices!",
    taskIncorrectMessage: "Look for the wick! 💡 A Hammer has a small body and a long lower tail.",
    explanations: [
      {
        id: 'exp-11-1',
        position: 'left',
        catMessage: "Single candles can show momentum shifts. A HAMMER 🔨 looks like a... hammer! Small head, long handle.",
        showLearningCards: true,
        learningCards: ['🔨 Hammer', '💫 Shooting Star'],
      },
      {
        id: 'exp-11-2',
        position: 'center',
        catMessage: "A Hammer after a fall means sellers pushed down, but buyers pushed ALL the way back up! Reversal likely! 🔄",
        showLearningCards: true,
        learningCards: ['🛑 Sellers Failed', '🐂 Buyers Returned'],
      },
      {
        id: 'exp-11-3',
        position: 'right',
        catMessage: "It confirms what happened. Let's find one!",
        showLearningCards: false,
      }
    ],
    task: {
      type: 'CHART',
      chart: {
        instruction: 'Find the HAMMER candle (Long lower wick).',
        data: generateHammerCandle(),
        correctIndices: [2],
      }
    },
  },

  // MODULE 12: Entry Logic
  {
    id: 'module-12',
    title: 'Entry Logic',
    description: 'Enter smart, not emotional',
    icon: '📘',
    points: 100,
    taskCompleteMessage: "Smart entry! 😸 Waiting for the retest is safer!",
    taskIncorrectMessage: "Don't chase! 💡 Wait for price to come back (pullback/retest).",
    explanations: [
      {
        id: 'exp-12-1',
        position: 'left',
        catMessage: "Markets move: IMPULSE ➡️ PULLBACK ➡️ CONTINUATION. 🌊",
        showLearningCards: true,
        learningCards: ['🚀 Impulse', '🔙 Pullback'],
      },
      {
        id: 'exp-12-2',
        position: 'center',
        catMessage: "Don't chase the big green candle! FOMO gets you killed. Wait for a 'Retest' or Pullback. 🧘‍♂️",
        showLearningCards: true,
        learningCards: ['🚫 No FOMO', '✅ Wait for Retest'],
      },
      {
        id: 'exp-12-3',
        position: 'right',
        catMessage: "Good entries are CALM. Find the retest candle.",
        showLearningCards: false,
      }
    ],
    task: {
      type: 'CHART',
      chart: {
        instruction: 'Click the RETEST candle (Price comes back to check previous level).',
        data: generateRetest(),
        correctIndices: [2],
      }
    },
  },

  // MODULE 13: Risk Management
  {
    id: 'module-13',
    title: 'Risk Management',
    description: 'Survival first',
    icon: '📘',
    points: 100,
    taskCompleteMessage: "Wise choice! 😸 Stop loss saves your account!",
    taskIncorrectMessage: "Too risky! 💡 Place stop loss below the structure/low.",
    explanations: [
      {
        id: 'exp-13-1',
        position: 'left',
        catMessage: "Traders fail because of bad RISK CONTROL, not bad entries. 🛡️",
        showLearningCards: true,
        learningCards: ['🛑 Stop Loss', '⚖️ Risk/Reward'],
      },
      {
        id: 'exp-13-2',
        position: 'center',
        catMessage: "Always use a STOP LOSS. It accepts a small loss to prevent a disaster. 💥",
        showLearningCards: true,
        learningCards: ['📉 Limit Losses', '📈 Let Winners Run'],
      },
      {
        id: 'exp-13-3',
        position: 'right',
        catMessage: "Survival comes before profit. Where should your safety net (stop loss) be?",
        showLearningCards: false,
      }
    ],
    task: {
      type: 'MCQ',
      question: 'Where do you put a Stop Loss for a Buy trade?',
      options: [
        { id: 'opt-13-1', text: 'Below the recent Low', isCorrect: true, emoji: '🛡️' },
        { id: 'opt-13-2', text: 'Where I entered', isCorrect: false, emoji: '🛑' },
        { id: 'opt-13-3', text: 'No stop loss needed', isCorrect: false, emoji: '💀' },
      ]
    },
  },

  // MODULE 14: Indicators
  {
    id: 'module-14',
    title: 'Indicators (Optional)',
    description: 'Tools, not magic',
    icon: '📘',
    points: 100,
    taskCompleteMessage: "Correct! 😸 Indicators usually lag behind price.",
    taskIncorrectMessage: "Think about it! 💡 Indicators are calculated FROM price, so they come after.",
    explanations: [
      {
        id: 'exp-14-1',
        position: 'left',
        catMessage: "Indicators (RSI, MACD) are calculated FROM price. They rely on past data. 🧮",
        showLearningCards: true,
        learningCards: ['🧮 Math Formulas', '🐢 They Lag'],
      },
      {
        id: 'exp-14-2',
        position: 'center',
        catMessage: "They CONFIRM, they never PREDICT. Price always has the final word! 👑",
        showLearningCards: true,
        learningCards: ['⚠️ No Predictions', '✅ Confirmations'],
      },
      {
        id: 'exp-14-3',
        position: 'right',
        catMessage: "Don't get addicted to them. Price action is King.",
        showLearningCards: false,
      }
    ],
    task: {
      type: 'MCQ',
      question: 'What is true about indicators?',
      options: [
        { id: 'opt-14-1', text: 'They predict the future', isCorrect: false, emoji: '🔮' },
        { id: 'opt-14-2', text: 'They lag behind price', isCorrect: true, emoji: '🐢' },
        { id: 'opt-14-3', text: 'They replace charts', isCorrect: false, emoji: '📉' },
      ]
    },
  },

  // MODULE 15: Liquidity & Traps
  {
    id: 'module-15',
    title: 'Liquidity & Traps',
    description: 'Avoid fake moves',
    icon: '📘',
    points: 100,
    taskCompleteMessage: "Good eye! 😸 That wick was a trap to grab liquidity!",
    taskIncorrectMessage: "Looks like a breakout... but failed! 💡 Find the candle that poked out and crashed back in.",
    explanations: [
      {
        id: 'exp-15-1',
        position: 'left',
        catMessage: "Big players need LIQUIDITY. They push price to where your Stop Losses are! 🎣",
        showLearningCards: true,
        learningCards: ['🎣 Liquidity Grab', '🪤 Bull/Bear Trap'],
      },
      {
        id: 'exp-15-2',
        position: 'center',
        catMessage: "A 'Fakeout': Price breaks a level to lure you in, then reverses immediately! 😱",
        showLearningCards: true,
        learningCards: ['🚫 False Break'],
      },
      {
        id: 'exp-15-3',
        position: 'right',
        catMessage: "These aren't accidents. Spot the trap!",
        showLearningCards: false,
      }
    ],
    task: {
      type: 'CHART',
      chart: {
        instruction: 'Identify the FAKEOUT candle (Wick went above high, but closed low).',
        data: generateFakeBreakout(),
        correctIndices: [2],
      }
    },
  },

  // MODULE 16: Trading Psychology
  {
    id: 'module-16',
    title: 'Trading Psychology',
    description: 'Control your emotions',
    icon: '📘',
    points: 100,
    taskCompleteMessage: "Discipline wins! 😸 No trade is better than a bad trade!",
    taskIncorrectMessage: "Patience! 💡 Waiting is the hardest skill.",
    explanations: [
      {
        id: 'exp-16-1',
        position: 'left',
        catMessage: "90% of failures are due to EMOTIONS, not strategy. Fear and Greed. 🧠",
        showLearningCards: true,
        learningCards: ['😱 FOMO', '😡 Revenge'],
      },
      {
        id: 'exp-16-2',
        position: 'center',
        catMessage: "Revenge trading (trying to win back losses) creates BIGGER losses. Discipline is key! 🔑",
        showLearningCards: true,
        learningCards: ['🧘 Discipline', '📜 Stick to Plan'],
      },
      {
        id: 'exp-16-3',
        position: 'right',
        catMessage: "Sometimes the best trade is NO trade.",
        showLearningCards: false,
      }
    ],
    task: {
      type: 'MCQ',
      question: 'You missed a trade. What do you do?',
      options: [
        { id: 'opt-16-1', text: 'Chase it immediately!', isCorrect: false, emoji: '🏃' },
        { id: 'opt-16-2', text: 'Wait for next setup', isCorrect: true, emoji: '🧘' },
        { id: 'opt-16-3', text: 'Angry trade elsewhere', isCorrect: false, emoji: '😡' },
      ]
    },
  },

  // MODULE 17: Real Scenarios
  {
    id: 'module-17',
    title: 'Real Market Scenarios',
    description: 'Surviving chaos',
    icon: '📘',
    points: 100,
    taskCompleteMessage: "Correct! 😸 Cash is a position too!",
    taskIncorrectMessage: "Don't force it! 💡 If nothing looks good, stay away.",
    explanations: [
      {
        id: 'exp-17-1',
        position: 'left',
        catMessage: "Real markets are messy. Sometimes nothing works. Prices crash or chop sideways. 🌪️",
        showLearningCards: true,
        learningCards: ['🌪️ Chaos', '📉 Crashes'],
      },
      {
        id: 'exp-17-2',
        position: 'center',
        catMessage: "A professional knows when to sit on their hands. Protecting capital is job #1. 🛡️",
        showLearningCards: true,
        learningCards: ['🛡️ Defense First'],
      },
      {
        id: 'exp-17-3',
        position: 'right',
        catMessage: "If the structure is unclear, do you trade?",
        showLearningCards: false,
      }
    ],
    task: {
      type: 'MCQ',
      question: 'The market is confusing and directionless. You should:',
      options: [
        { id: 'opt-17-1', text: 'Guess and hope', isCorrect: false, emoji: '🎲' },
        { id: 'opt-17-2', text: 'Do nothing (Cash)', isCorrect: true, emoji: '💰' },
        { id: 'opt-17-3', text: 'Ask a friend', isCorrect: false, emoji: '🗣️' },
      ]
    },
  },

  // MODULE 18: Final Assessment
  {
    id: 'module-18',
    title: 'Final Assessment',
    description: 'Are you ready?',
    icon: '🎓',
    points: 500,
    taskCompleteMessage: "GRADUATED! 🎓🏆 You are now a TRADER! Go forth and conquer!",
    taskIncorrectMessage: "Remember the golden rule! 💡 Consistency > Luck.",
    explanations: [
      {
        id: 'exp-18-1',
        position: 'left',
        catMessage: "We've covered everything. Structure, entries, risk, and psychology. You are ready. 🚀",
        showLearningCards: true,
        learningCards: ['✅ All Skills'],
      },
      {
        id: 'exp-18-2',
        position: 'center',
        catMessage: "Remember: Win rate doesn't matter as much as CONSISTENCY and DISCIPLINE. 🦁",
        showLearningCards: true,
        learningCards: ['🦁 Be Consistent'],
      },
      {
        id: 'exp-18-3',
        position: 'right',
        catMessage: "Final Question. What is the most important trait of a trader?",
        showLearningCards: false,
      }
    ],
    task: {
      type: 'MCQ',
      question: 'What matters most?',
      options: [
        { id: 'opt-18-1', text: 'Being lucky', isCorrect: false, emoji: '🍀' },
        { id: 'opt-18-2', text: 'Only winning', isCorrect: false, emoji: '🏆' },
        { id: 'opt-18-3', text: 'Emotional Discipline', isCorrect: true, emoji: '🧘' },
      ]
    },
  },
];
