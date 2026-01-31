
import { Path, TaskType, OHLCData, Room, Module } from '../types';

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


// Helper for smoother, conceptual charts
const generateConceptualChart = (count: number, startPrice: number, trend: 'up' | 'down' | 'volatile' | 'stable' = 'up'): OHLCData[] => {
    const data: OHLCData[] = [];
    let currentPrice = startPrice;

    for (let i = 0; i < count; i++) {
        const open = currentPrice;
        let change = 0;

        if (trend === 'up') change = (Math.random() * 0.8) + 0.1; // Mostly up
        else if (trend === 'down') change = (Math.random() * -0.8) - 0.1; // Mostly down
        else if (trend === 'volatile') change = (Math.random() - 0.5) * 5; // Big swings
        else change = (Math.random() - 0.5) * 0.5; // Small chop

        const close = open + change;
        const high = Math.max(open, close) + Math.random() * 0.5;
        const low = Math.min(open, close) - Math.random() * 0.5;

        data.push({
            time: `Concept-${(i + 1)}`,
            open, high, low, close,
            volume: Math.floor(Math.random() * 500) + 100
        });
        currentPrice = close;
    }
    return data;
};

export const TRADER_PATH: Path = {
    id: 'trading-mastery',
    title: 'The Elite Operator Path',
    description: 'Master the art of trading from basic concepts to advanced strategies.',
    modules: [
        {
            id: 'mod1',
            title: 'Module 1: What Is the Stock Market?',
            description: 'Understanding ownership and the pizza shop analogy.',
            rooms: [{
                id: 'r1',
                title: 'Ownership Concept',
                description: 'Think like a business owner.',
                iconType: 'shield',
                // SHOW GROWTH to illustrate value increase
                chartData: generateConceptualChart(20, 100, 'up'),
                thumbnail: '',
                tasks: [{
                    id: 't1',
                    title: 'The Ownership Concept',
                    theory: [
                        'Imagine you want to start a massive Pizza franchise, but you only have money for one oven.',
                        'To grow, you need more money. You could borrow it (Loan) OR you could sell a piece of your business (Equity).',
                        'The Stock Market is simply a place where businesses sell these small pieces (shares) to the public.',
                        'When you buy a share, you are not just gambling on numbers. You are ensuring legal PART-OWNERSHIP of that company.',
                        'As the company grows and earns profits, the value of your small piece grows with it.'
                    ],
                    question: 'If you buy 1 share of Apple, what do you actually have?',
                    type: TaskType.MULTIPLE_CHOICE,
                    options: ['A lottery ticket', 'A digital coin', 'Partial legal ownership'],
                    correctIndex: 2,
                    hint: 'It is a real claim on the business.',
                    reward: 50,
                    penalty: 10
                }]
            }]
        },
        {
            id: 'mod2',
            title: 'Module 2: How Buying & Selling Works',
            description: 'The engine behind price movement.',
            rooms: [{
                id: 'r2',
                title: 'Supply & Demand',
                description: 'Why price moves up or down.',
                iconType: 'target',
                // SHOW VOLATILITY to illustrate battle
                chartData: generateConceptualChart(30, 100, 'volatile'),
                thumbnail: '',
                tasks: [{
                    id: 't2',
                    title: 'Dynamics of Action',
                    theory: [
                        'Every price movement happens because of buyers and sellers.',
                        'When more buyers want a stock, price moves up. When more sellers want to sell, price moves down.',
                        'The stock exchange (NSE/BSE) is simply a marketplace where these buyers and sellers meet.',
                        'No one controls price—the crowd does.'
                    ],
                    question: 'Buyers: 100, Sellers: 20. Price will go?',
                    type: TaskType.MULTIPLE_CHOICE,
                    options: ['📈 UP', '📉 DOWN'],
                    correctIndex: 0,
                    hint: 'High demand, low supply.',
                    reward: 50,
                    penalty: 10
                }]
            }]
        },
        {
            id: 'mod3',
            title: 'Module 3: Market Types & Investment Options',
            description: 'Know where money goes.',
            rooms: [{
                id: 'r3',
                title: 'Primary vs Secondary',
                description: 'Where money flows.',
                iconType: 'terminal',
                // SHOW STABLE/GROWTH
                chartData: generateConceptualChart(25, 50, 'up'),
                thumbnail: '',
                tasks: [{
                    id: 't3',
                    title: 'Match the logic',
                    theory: [
                        'Primary Market (IPO): When a company sells shares for the first time.',
                        'Secondary Market: Where people buy and sell shares daily.',
                        'Stock: Ownership in one company. ETF: Group of companies. Mutual Fund: Managed by professionals.'
                    ],
                    question: 'Match: Mutual Fund is...?',
                    type: TaskType.MULTIPLE_CHOICE,
                    options: ['Company selling first time', 'Ownership in one company', 'Money managed by expert'],
                    correctIndex: 2,
                    hint: 'Experts manage these pools.',
                    reward: 50,
                    penalty: 10
                }]
            }]
        },
        {
            id: 'mod4',
            title: 'Module 4: Trading vs Investing',
            description: 'Choose the right approach.',
            rooms: [{
                id: 'r4',
                title: 'Goal Alignment',
                description: 'Time decides the method.',
                iconType: 'heart',
                // SHOW LONG TERM UP trend
                chartData: generateConceptualChart(40, 10, 'up'),
                thumbnail: '',
                tasks: [{
                    id: 't4',
                    title: 'Goal Selection',
                    theory: [
                        'Investing: Long-term (years). Focus on company growth.',
                        'Trading: Short-term (minutes to days). Focus on price movement.',
                        'Your goal decides the method—not emotions.'
                    ],
                    question: 'Goal: Earn money today?',
                    type: TaskType.MULTIPLE_CHOICE,
                    options: ['Trading', 'Investing'],
                    correctIndex: 0,
                    hint: 'Short-term moves.',
                    reward: 50,
                    penalty: 10
                }]
            }]
        },
        {
            id: 'mod5',
            title: 'Module 5: What Is Price?',
            description: 'Understand what charts represent.',
            rooms: [{
                id: 'r5',
                title: 'Price Action Foundation',
                description: 'Charts are records of human action.',
                iconType: 'chart',
                chartData: generateChart(30, 150),
                thumbnail: '',
                tasks: [{
                    id: 't5',
                    title: 'Price meaning',
                    theory: [
                        'A price chart is not magic. It is simply a record of past buying and selling decisions.',
                        'Price moves because someone clicked BUY or SELL.',
                        'Every candle shows where buyers tried, where sellers fought, and who won.'
                    ],
                    question: 'Click the candle where buyers were clearly stronger.',
                    type: TaskType.CLICK_CANDLE,
                    correctIndex: 12,
                    hint: 'Look for the largest green candle.',
                    reward: 100,
                    penalty: 20
                }]
            }]
        },
        {
            id: 'mod6',
            title: 'Module 6: Candlestick Basics',
            description: 'Read one candle correctly.',
            rooms: [{
                id: 'r6',
                title: 'Anatomy of Price',
                description: 'The story of a single session.',
                iconType: 'lock',
                chartData: generateChart(20, 100),
                thumbnail: '',
                tasks: [{
                    id: 't6',
                    title: 'Candle Structure',
                    theory: [
                        'Open/Close define the body. High/Low define the fight (wicks).',
                        'Green candle = buyers won (Close > Open).',
                        'Red candle = sellers won (Close < Open).'
                    ],
                    question: 'Click the candle that closed higher than it opened.',
                    type: TaskType.CLICK_CANDLE,
                    correctIndex: 5,
                    hint: 'Find a bullish (green) candle.',
                    reward: 100,
                    penalty: 20
                }]
            }]
        },
        {
            id: 'mod7',
            title: 'Module 7: Trends',
            description: 'Identify market direction.',
            rooms: [{
                id: 'r7',
                title: 'Reading Direction',
                description: 'Uptrend, Downtrend, Sideways.',
                iconType: 'chart',
                chartData: generateChart(40, 120, 3).map((d, i) => ({ ...d, close: d.close + (i * 1.5) })),
                thumbnail: '',
                tasks: [{
                    id: 't7',
                    title: 'Visual Direction',
                    theory: [
                        'Markets move in Uptrends (higher prices), Downtrends (lower prices), or Sideways (confusion).',
                        'Trading with the trend increases your probability of winning.'
                    ],
                    question: 'Given the chart on the right, identify the trend:',
                    type: TaskType.MULTIPLE_CHOICE,
                    options: ['Uptrend', 'Downtrend', 'Sideways'],
                    correctIndex: 0,
                    hint: 'Is the price making new highs?',
                    reward: 100,
                    penalty: 20
                }]
            }]
        },
        {
            id: 'mod8',
            title: 'Module 8: Market Structure',
            description: 'Stop guessing direction.',
            rooms: [{
                id: 'r8',
                title: 'HH/HL Logic',
                description: 'Who is in control?',
                iconType: 'target',
                chartData: generateChart(50, 100, 10),
                thumbnail: '',
                tasks: [{
                    id: 't8',
                    title: 'Structural Points',
                    theory: [
                        'Trends are built with Higher Highs (HH) and Higher Lows (HL).',
                        'Structure tells you who is in control.',
                        'If structure is unclear—don\'t trade.'
                    ],
                    question: 'Click the "Higher Low" (HL).',
                    type: TaskType.CLICK_CANDLE,
                    correctIndex: 18,
                    hint: 'The low point that stayed above the previous low.',
                    reward: 150,
                    penalty: 30
                }]
            }]
        },
        {
            id: 'mod9',
            title: 'Module 9: Break of Structure',
            description: 'Identify trend change.',
            rooms: [{
                id: 'r9',
                title: 'BOS & ChoCH',
                description: 'Trend shift logic.',
                iconType: 'sword',
                chartData: generateChart(50, 200, 15),
                thumbnail: '',
                tasks: [{
                    id: 't9',
                    title: 'Trend Shift',
                    theory: [
                        'When price breaks previous structure, control may shift.',
                        'Break of Structure (BOS) indicates trend continuation or change.',
                        'Not every break is real—some are traps.'
                    ],
                    question: 'Click the candle that broke the structural level.',
                    type: TaskType.CLICK_CANDLE,
                    correctIndex: 32,
                    hint: 'Look for a solid close beyond a previous high/low.',
                    reward: 150,
                    penalty: 30
                }]
            }]
        },
        {
            id: 'mod10',
            title: 'Module 10: Support & Resistance',
            description: 'Understand where price reacts.',
            rooms: [{
                id: 'r10',
                title: 'Zones of Memory',
                description: 'Price remembers old battlefields.',
                iconType: 'shield',
                chartData: generateChart(60, 150, 8),
                thumbnail: '',
                tasks: [{
                    id: 't10',
                    title: 'Memory Zones',
                    theory: [
                        'Support: buying area. Resistance: selling area.',
                        'Price reacts to ZONES, not lines.',
                        'The more times price reacts, the stronger the zone.'
                    ],
                    question: 'Identify the point connecting at least 3 bottom touches.',
                    type: TaskType.CLICK_CANDLE,
                    correctIndex: 24,
                    hint: 'Find where price "bounced".',
                    reward: 150,
                    penalty: 30
                }]
            }]
        },
        {
            id: 'mod11',
            title: 'Module 11: Candlestick Signals',
            description: 'Read market emotion.',
            rooms: [{
                id: 'r11',
                title: 'Emotional Signals',
                description: 'Rejection vs Commitment.',
                iconType: 'cat',
                chartData: generateChart(30, 100),
                thumbnail: '',
                tasks: [{
                    id: 't11',
                    title: 'Hammer Rejection',
                    theory: [
                        'Hammer: buyers defended price. Shooting star: sellers rejected highs.',
                        'Candles reveal emotion—not the future.'
                    ],
                    question: 'Find the hammer candle after a fall.',
                    type: TaskType.CLICK_CANDLE,
                    correctIndex: 12,
                    hint: 'Long lower wick, small body.',
                    reward: 200,
                    penalty: 40
                }]
            }]
        },
        {
            id: 'mod12',
            title: 'Module 12: Entry Logic',
            description: 'Enter smart, not emotional.',
            rooms: [{
                id: 'r12',
                title: 'Wait for Confirmation',
                description: 'Impulse vs Retest.',
                iconType: 'target',
                chartData: generateChart(50, 150, 5),
                thumbnail: '',
                tasks: [{
                    id: 't12',
                    title: 'Entry timing',
                    theory: [
                        'Markets move in Impulse -> Pullback -> Continuation cycles.',
                        'Chasing price usually ends in loss.',
                        'Wait for the "retest" after a breakout for high probability.'
                    ],
                    question: 'Click the retest candle after the breakout.',
                    type: TaskType.CLICK_CANDLE,
                    correctIndex: 28,
                    hint: 'The candle that touches the broken level.',
                    reward: 200,
                    penalty: 40
                }]
            }]
        },
        {
            id: 'mod13',
            title: 'Module 13: Risk Management',
            description: 'Protect capital.',
            rooms: [{
                id: 'r13',
                title: 'Survival First',
                description: 'Losing small is winning.',
                iconType: 'shield',
                chartData: generateChart(40, 200),
                thumbnail: '',
                tasks: [{
                    id: 't13',
                    title: 'The 1% Rule',
                    theory: [
                        'Stop-loss placement is scientific. Risk-reward defines quality.',
                        'The 1% rule prevents account destruction. Good traders lose small.'
                    ],
                    question: 'Where would you place a stop-loss for a long trade?',
                    type: TaskType.CLICK_CANDLE,
                    correctIndex: 15,
                    hint: 'Just below the recent structural low.',
                    reward: 200,
                    penalty: 100
                }]
            }]
        },
        {
            id: 'mod14',
            title: 'Module 14: Indicators (Optional Tools)',
            description: 'Use indicators correctly.',
            rooms: [{
                id: 'r14',
                title: 'Price vs Lag',
                description: 'Golden Rule: Price wins.',
                iconType: 'terminal',
                chartData: generateChart(40, 100),
                thumbnail: '',
                tasks: [{
                    id: 't14',
                    title: 'Indicator Lag',
                    theory: [
                        'Indicators are calculated FROM price—they lag.',
                        'They confirm, they never predict. Price always has the final word.'
                    ],
                    question: 'If price and RSI disagree, which one do you trust?',
                    type: TaskType.MULTIPLE_CHOICE,
                    options: ['Price', 'RSI', 'Neither'],
                    correctIndex: 0,
                    hint: 'Price is the master.',
                    reward: 100,
                    penalty: 20
                }]
            }]
        },
        {
            id: 'mod15',
            title: 'Module 15: Liquidity & Traps',
            description: 'Understand fake moves.',
            rooms: [{
                id: 'r15',
                title: 'Liquidity Pools',
                description: 'Stop hunts and fakeouts.',
                iconType: 'lock',
                chartData: generateChart(60, 200, 12),
                thumbnail: '',
                tasks: [{
                    id: 't15',
                    title: 'Identifying Traps',
                    theory: [
                        'Large players need liquidity. Stops sit above highs and below lows.',
                        'Markets often move there first, then reverse. These are liquidity grabs.'
                    ],
                    question: 'Identify the fake breakout candle.',
                    type: TaskType.CLICK_CANDLE,
                    correctIndex: 44,
                    hint: 'Price pierced a level but quickly returned.',
                    reward: 200,
                    penalty: 40
                }]
            }]
        },
        {
            id: 'mod16',
            title: 'Module 16: Trading Psychology',
            description: 'Control emotions.',
            rooms: [{
                id: 'r16',
                title: 'Discipline Skill',
                description: 'Patience captures flags.',
                iconType: 'heart',
                chartData: generateChart(100, 100, 2),
                thumbnail: '',
                tasks: [{
                    id: 't16',
                    title: 'Wait for opportunity',
                    theory: [
                        'FOMO, Revenge, and Overtrading drain capital.',
                        'Discipline is a skill—not a personality trait.',
                        'Sometimes the best trade is DO NOTHING.'
                    ],
                    question: 'The market is choppy. Best move?',
                    type: TaskType.WAIT_TASK,
                    options: ['Buy', 'Sell', 'Wait'],
                    correctIndex: 2,
                    hint: 'Patience is rewarded.',
                    reward: 500,
                    penalty: 100
                }]
            }]
        },
        {
            id: 'mod17',
            title: 'Module 17: Real Market Scenarios',
            description: 'Decision making under pressure.',
            rooms: [{
                id: 'r17',
                title: 'Survival Mindset',
                description: 'Real markets are messy.',
                iconType: 'skull',
                chartData: generateChart(80, 250, 20),
                thumbnail: '',
                tasks: [{
                    id: 't17',
                    title: 'Market Crash Simulation',
                    theory: [
                        'Real markets crash and show high volatility.',
                        'Learning when NOT to trade is a professional skill.'
                    ],
                    question: 'High-volume volatility detected. Proceed?',
                    type: TaskType.MULTIPLE_CHOICE,
                    options: ['Trade anyway', 'Wait for calm'],
                    correctIndex: 1,
                    hint: 'Don\'t fight the flood.',
                    reward: 300,
                    penalty: 50
                }]
            }]
        },
        {
            id: 'mod18',
            title: 'Module 18: Final Trader Assessment',
            description: 'The Final Exam.',
            rooms: [{
                id: 'r18',
                title: 'Final Truth',
                description: 'Consistency > Win Rate.',
                iconType: 'sword',
                chartData: generateChart(150, 300, 15),
                thumbnail: '',
                tasks: [{
                    id: 't18',
                    title: 'The Exam',
                    theory: [
                        'Final test measures behavior, not luck.',
                        'Win rate doesn\'t matter. Consistency does.'
                    ],
                    question: 'Identify the structural BOS entry in this full environment.',
                    type: TaskType.CLICK_CANDLE,
                    correctIndex: 112,
                    hint: 'Recall Phase 3.',
                    reward: 1000,
                    penalty: 200
                }]
            }]
        }
    ]
};
