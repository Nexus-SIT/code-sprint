// Module Content - NO JSX, Data Only

/**
 * CAT POSITION TYPES
 * - 'left': Cat starts at left side (explains initial concept)
 * - 'center': Cat moves to center for deeper explanation
 * - 'right': Cat moves to right for task area
 */
export type CatPosition = 'left' | 'center' | 'right';

export interface ExplanationStep {
  id: string;
  position: CatPosition; // Where cat should be during this explanation
  catMessage: string;    // What cat says
  showLearningCards: boolean; // Whether to show visual learning cards
  learningCards?: string[]; // Optional learning card content
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

export interface TaskData {
  type: 'MCQ' | 'MATCH' | 'PREDICTION' | 'INFO';
  title?: string;
  question?: string;
  options?: MCQOption[];
  matches?: MatchItem[];
  prediction?: PredictionTask;
  content?: string;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  icon: string;
  explanations: ExplanationStep[]; // Multiple steps with positions
  task: TaskData;
  points: number;
  taskCompleteMessage: string;
  taskIncorrectMessage: string;
}

export const modules: Module[] = [
  // MODULE 1: What is the Stock Market?
  {
    id: 'module-1',
    title: 'What is the Stock Market?',
    description: 'Foundation: Companies, Shares & Ownership',
    icon: '📚',
    points: 100,
    taskCompleteMessage: "Hey! That's exactly right! 😸 You are now a part-owner of the company!",
    taskIncorrectMessage: "Not quite! 💡 Remember, a share = ownership. Try again!",
    explanations: [
      {
        id: 'exp-1-1',
        position: 'left',
        catMessage: "Imagine you and your friends open a pizza shop 🍕. To grow bigger, you need ₹10 lakhs.",
        showLearningCards: true,
        learningCards: ['🏪 Pizza Shop', '💰 Needs ₹10 lakhs'],
      },
      {
        id: 'exp-1-2',
        position: 'center',
        catMessage: "Instead of borrowing money, you divide the shop into 1000 equal pieces. Each piece is called a SHARE.",
        showLearningCards: true,
        learningCards: ['📜 1000 Equal Pieces', '📜 Each = 1 SHARE'],
      },
      {
        id: 'exp-1-3',
        position: 'right',
        catMessage: "When someone buys a share, they own a tiny part of the pizza shop! You buy 1 share? You own 1/1000th of the pizza shop!",
        showLearningCards: false,
      },
    ],
    task: {
      type: 'MCQ',
      question: 'If you buy 1 share, what do you own?',
      options: [
        { id: 'opt-1-1', text: 'A loan to the company', isCorrect: false, emoji: '❌' },
        { id: 'opt-1-2', text: 'Ownership in the company', isCorrect: true, emoji: '✅' },
        { id: 'opt-1-3', text: 'A job at the company', isCorrect: false, emoji: '❌' },
      ],
    },
  },

  // MODULE 2: Buyers & Sellers
  {
    id: 'module-2',
    title: 'How Buyers & Sellers Work',
    description: 'Demand vs Supply moves prices',
    icon: '⚖️',
    points: 100,
    taskCompleteMessage: "Perfect! 😺 When buyers outnumber sellers, the price shoots up!",
    taskIncorrectMessage: "Close! 💡 More buyers means more competition for limited shares. Try again!",
    explanations: [
      {
        id: 'exp-2-1',
        position: 'left',
        catMessage: "When many people WANT to buy but very few WANT to sell, it's like a bidding war!",
        showLearningCards: true,
        learningCards: ['👥 100 Buyers', '🤝 But only 20 Sellers'],
      },
      {
        id: 'exp-2-2',
        position: 'center',
        catMessage: "Everyone is fighting to get the shares. Competition drives the price UP!",
        showLearningCards: true,
        learningCards: ['📈 Price Goes UP!', '💰 Competition!'],
      },
      {
        id: 'exp-2-3',
        position: 'right',
        catMessage: "This is called supply and demand. More buyers than sellers = HIGHER PRICES!",
        showLearningCards: false,
      },
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

  // MODULE 3: Market Types & Investment Options
  {
    id: 'module-3',
    title: 'Market Types & Investment Options',
    description: 'Different ways to invest your money',
    icon: '🎯',
    points: 100,
    taskCompleteMessage: "Excellent! 😸 You understand different investment vehicles now!",
    taskIncorrectMessage: "Not quite there yet! 💡 Each investment type has a unique purpose. Try again!",
    explanations: [
      {
        id: 'exp-3-1',
        position: 'left',
        catMessage: "You can invest money in different ways! An IPO is when a company first sells shares to the public.",
        showLearningCards: true,
        learningCards: ['🎉 IPO: First share sale'],
      },
      {
        id: 'exp-3-2',
        position: 'center',
        catMessage: "A STOCK means you own a piece of ONE company. A MUTUAL FUND is when an expert manager takes your money and invests it in MANY companies for you.",
        showLearningCards: true,
        learningCards: ['📈 Stock = One Company', '👨‍💼 Fund = Many Companies'],
      },
      {
        id: 'exp-3-3',
        position: 'right',
        catMessage: "Each has pros and cons. Different strategies for different goals!",
        showLearningCards: false,
      },
    ],
    task: {
      type: 'MATCH',
      matches: [
        {
          id: 'match-3-1',
          left: 'IPO',
          right: 'Company selling shares for first time',
          emoji: '🎉',
        },
        {
          id: 'match-3-2',
          left: 'Stock',
          right: 'Ownership in one company',
          emoji: '📈',
        },
        {
          id: 'match-3-3',
          left: 'Mutual Fund',
          right: 'Money managed by expert fund manager',
          emoji: '👨‍💼',
        },
      ],
    },
  },

  // MODULE 4: Why Prices Go Up or Down
  {
    id: 'module-4',
    title: 'Why Prices Go Up or Down',
    description: 'News & Events drive market moves',
    icon: '📰',
    points: 100,
    taskCompleteMessage: "Spot on! 😻 You're thinking like a real trader now!",
    taskIncorrectMessage: "Not this time! 💡 Remember: good news = optimism = buying = price UP! Try again!",
    explanations: [
      {
        id: 'exp-4-1',
        position: 'left',
        catMessage: "Stock prices don't move randomly! They move because of NEWS and EVENTS.",
        showLearningCards: true,
        learningCards: ['📰 News Matters', '⚡ Events Drive Prices'],
      },
      {
        id: 'exp-4-2',
        position: 'center',
        catMessage: "When a company reports amazing profits, investors get excited and BUY MORE = price goes UP!",
        showLearningCards: true,
        learningCards: ['🎉 Good News', '📈 Price UP!'],
      },
      {
        id: 'exp-4-3',
        position: 'right',
        catMessage: "When bad news comes out, people get scared and SELL = price goes DOWN. Markets are driven by emotion!",
        showLearningCards: false,
      },
    ],
    task: {
      type: 'PREDICTION',
      prediction: {
        scenario: 'News: Company reports record profits 🎉',
        correctAnswer: 'UP',
        emoji: '📈',
      },
    },
  },

  // MODULE 5: Reading Charts & Trends
  {
    id: 'module-5',
    title: 'Reading Charts & Trends',
    description: 'Understand candles and price action',
    icon: '📊',
    points: 100,
    taskCompleteMessage: "Brilliant! 😺 You're reading charts like a pro!",
    taskIncorrectMessage: "Almost there! 💡 Look at the pattern: green candles = uptrend! Try again!",
    explanations: [
      {
        id: 'exp-5-1',
        position: 'left',
        catMessage: "Charts tell you the story of price movement! Each candle shows 4 numbers: opening, highest, lowest, and closing price.",
        showLearningCards: true,
        learningCards: ['🕯️ Open', '🕯️ High', '🕯️ Low', '🕯️ Close'],
      },
      {
        id: 'exp-5-2',
        position: 'center',
        catMessage: "Green candles mean price went UP. Red candles mean price went DOWN.",
        showLearningCards: true,
        learningCards: ['📈 Green = UP', '📉 Red = DOWN'],
      },
      {
        id: 'exp-5-3',
        position: 'right',
        catMessage: "When you see many green candles in a row, the market is in an UPTREND. This is how traders analyze markets!",
        showLearningCards: false,
      },
    ],
    task: {
      type: 'MCQ',
      question: 'When you see many green candles in a row, what does it mean?',
      options: [
        { id: 'opt-5-1', text: 'Market is in an UPTREND', isCorrect: true, emoji: '📈' },
        { id: 'opt-5-2', text: 'Market is falling', isCorrect: false, emoji: '📉' },
        { id: 'opt-5-3', text: 'Market is sleeping', isCorrect: false, emoji: '😴' },
      ],
    },
  },

  // MODULE 6: Risk & Virtual Money Management
  {
    id: 'module-6',
    title: 'Risk & Money Management',
    description: 'Protect your investments',
    icon: '🛡️',
    points: 100,
    taskCompleteMessage: "Perfect! 😸 You think like a wise investor! Diversification is protection!",
    taskIncorrectMessage: "Not quite! 💡 Remember: spread across multiple stocks for safety. Try again!",
    explanations: [
      {
        id: 'exp-6-1',
        position: 'left',
        catMessage: "Here's the MOST IMPORTANT lesson: Never put all your money in ONE stock!",
        showLearningCards: true,
        learningCards: ['⚠️ Risk Alert!', '❌ All in One = Danger'],
      },
      {
        id: 'exp-6-2',
        position: 'center',
        catMessage: "If that company has problems, you lose EVERYTHING. Instead, spread your money across 3-5 different companies.",
        showLearningCards: true,
        learningCards: ['🎯 Diversify', '✅ 3-5 Companies'],
      },
      {
        id: 'exp-6-3',
        position: 'right',
        catMessage: "This is called DIVERSIFICATION. It's like insurance for your money!",
        showLearningCards: false,
      },
    ],
    task: {
      type: 'MCQ',
      question: 'What is the best way to invest ₹10,00,000?',
      options: [
        { id: 'opt-6-1', text: 'Put all in 1 stock', isCorrect: false, emoji: '❌' },
        { id: 'opt-6-2', text: 'Invest in 3-5 different stocks', isCorrect: true, emoji: '✅' },
        { id: 'opt-6-3', text: 'Keep it all in cash', isCorrect: false, emoji: '🏦' },
      ],
    },
  },

  // MODULE 7: Trading vs Investing
  {
    id: 'module-7',
    title: 'Trading vs Investing',
    description: 'Short-term vs Long-term',
    icon: '⏱️',
    points: 100,
    taskCompleteMessage: "Yes! 😺 Trading is perfect for quick profits!",
    taskIncorrectMessage: "Not quite! 💡 Remember the timeframe matters. Try again!",
    explanations: [
      {
        id: 'exp-7-1',
        position: 'left',
        catMessage: "There are two paths to profit! TRADING is buying and selling FAST - you hold for days or weeks.",
        showLearningCards: true,
        learningCards: ['⚡ Trading', '⏱️ Days/Weeks'],
      },
      {
        id: 'exp-7-2',
        position: 'center',
        catMessage: "INVESTING is buying and HOLDING for YEARS. Traders hunt quick profits. Investors hunt wealth.",
        showLearningCards: true,
        learningCards: ['🌱 Investing', '⏳ Years ahead'],
      },
      {
        id: 'exp-7-3',
        position: 'right',
        catMessage: "Both can win, but they need different mindsets and strategies!",
        showLearningCards: false,
      },
    ],
    task: {
      type: 'MCQ',
      question: 'You want to earn money in 1 day. What should you do?',
      options: [
        { id: 'opt-7-1', text: 'Invest in long-term mutual funds', isCorrect: false, emoji: '🌱' },
        { id: 'opt-7-2', text: 'Trade (buy/sell quickly)', isCorrect: true, emoji: '⚡' },
        { id: 'opt-7-3', text: 'Wait for market holidays', isCorrect: false, emoji: '🎋' },
      ],
    },
  },

  // MODULE 8: Virtual Trading & Profit/Loss
  {
    id: 'module-8',
    title: 'Virtual Trading & Results',
    description: 'Putting it all together - Your first trade!',
    icon: '🎮',
    points: 150,
    taskCompleteMessage: "YES! 😻 You earned profit! You're a trader now! This is EXACTLY how the game works!",
    taskIncorrectMessage: "Hmm! 💡 Let me remind you: Price went UP, so profit increased! Try again!",
    explanations: [
      {
        id: 'exp-8-1',
        position: 'left',
        catMessage: "You've learned everything! Now let's do a REAL trade. You invest ₹50,000 in ABC Company.",
        showLearningCards: true,
        learningCards: ['💰 Investment', '₹50,000 in ABC'],
      },
      {
        id: 'exp-8-2',
        position: 'center',
        catMessage: "You predict the price will go UP. It actually goes UP! What happens? You make PROFIT!",
        showLearningCards: true,
        learningCards: ['📈 Price UP', '💸 +PROFIT!'],
      },
      {
        id: 'exp-8-3',
        position: 'right',
        catMessage: "This is how traders make money. Every prediction matters! Now you're ready for the real game!",
        showLearningCards: false,
      },
    ],
    task: {
      type: 'MCQ',
      question: 'What happens to your ₹50,000?',
      options: [
        { id: 'opt-8-1', text: 'You made PROFIT! 💰', isCorrect: true, emoji: '📈' },
        { id: 'opt-8-2', text: 'You lost money', isCorrect: false, emoji: '📉' },
        { id: 'opt-8-3', text: 'Money stayed same', isCorrect: false, emoji: '➡️' },
      ],
    },
  },
];
