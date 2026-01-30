import { Module, Room, Task, TaskType } from '../types';

export type { Module, Room, Task, TaskType }; // Re-export type if needed

export const CURRICULUM: Module[] = [
    {
        id: 'module-1',
        title: 'MARKET BASICS',
        goal: 'User understands what a chart actually represents.',
        rooms: [
            {
                id: 'room-1-1',
                title: 'What Is Price?',
                iconType: 'chart',
                tasks: [
                    {
                        id: 'task-1-1-1',
                        title: 'Price Movement',
                        description: 'Price moves because buyers and sellers agree on value.',
                        type: 'CHART_SELECT',
                        challengeText: 'Click the first candle where price moved upward.',
                    },
                    {
                        id: 'task-1-1-2',
                        title: 'Price Speed',
                        description: 'Large candles mean aggressive participants.',
                        type: 'CHART_SELECT',
                        challengeText: 'Click the strongest momentum candle.',
                    }
                ]
            },
            {
                id: 'room-1-2',
                title: 'Candle Anatomy',
                iconType: 'chart',
                tasks: [
                    {
                        id: 'task-1-2-1',
                        title: 'Bullish vs Bearish',
                        description: 'Green means up, Red means down.',
                        type: 'CHART_SELECT',
                        challengeText: 'Click a green candle.',
                    },
                    {
                        id: 'task-1-2-2',
                        title: 'Wick Rejection',
                        description: 'Wicks show where price was rejected.',
                        type: 'CHART_SELECT',
                        challengeText: 'Click candle with longest upper wick.',
                    },
                    {
                        id: 'task-1-2-3',
                        title: 'OHLC Precision',
                        description: 'Open, High, Low, Close.',
                        type: 'CHART_SELECT',
                        challengeText: 'Click candle where Open = 150 exactly.',
                    }
                ]
            },
            {
                id: 'room-1-3',
                title: 'Timeframes',
                iconType: 'chart',
                tasks: [
                    {
                        id: 'task-1-3-1',
                        title: 'Structure Identity',
                        description: 'Markets are fractal.',
                        type: 'INFO', // Placeholder for now
                        challengeText: 'Identify same structure on 1m vs 15m chart.',
                    },
                    {
                        id: 'task-1-3-2',
                        title: 'Timeframe Illusion',
                        description: 'Trends look different on different scales.',
                        type: 'CHART_SELECT',
                        challengeText: 'Click candle that looks strong on 1m but weak on 15m.',
                    }
                ]
            }
        ]
    },
    {
        id: 'module-2',
        title: 'MARKET STRUCTURE',
        goal: 'User stops guessing direction.',
        rooms: [
            {
                id: 'room-2-1',
                title: 'Higher Highs & Higher Lows',
                iconType: 'terminal',
                tasks: [
                    { id: 'task-2-1-1', title: 'Higher High', description: 'Uptrend structure.', type: 'CHART_SELECT', challengeText: 'Click the higher high.' },
                    { id: 'task-2-1-2', title: 'Higher Low', description: 'Buying dip.', type: 'CHART_SELECT', challengeText: 'Click the higher low.' },
                    {
                        id: 'task-2-1-3',
                        title: 'Trend Direction',
                        description: 'Identify the flow.',
                        type: 'QUIZ',
                        challengeText: 'What is the current trend direction?',
                        options: ['Uptrend', 'Downtrend', 'Sideways', 'Random'],
                        correctAnswer: 'Uptrend'
                    },
                ]
            },
            {
                id: 'room-2-2',
                title: 'Downtrend Structure',
                iconType: 'terminal',
                tasks: [
                    { id: 'task-2-2-1', title: 'Lower Low', description: 'Downtrend structure.', type: 'CHART_SELECT', challengeText: 'Click lower low.' },
                    { id: 'task-2-2-2', title: 'Lower High', description: 'Selling rally.', type: 'CHART_SELECT', challengeText: 'Click lower high.' },
                ]
            },
            {
                id: 'room-2-3',
                title: 'Structure Break',
                iconType: 'sword',
                tasks: [
                    { id: 'task-2-3-1', title: 'Break', description: 'Change of character.', type: 'CHART_SELECT', challengeText: 'Click candle that broke structure.' },
                    {
                        id: 'task-2-3-2',
                        title: 'Fake vs Real',
                        description: 'Liquidity grabs.',
                        type: 'QUIZ',
                        challengeText: 'What confirms a real breakout?',
                        options: ['Strong Candle Close', 'Just a Wick', 'Low Volume', 'News Event'],
                        correctAnswer: 'Strong Candle Close'
                    },
                ]
            }
        ]
    },
    {
        id: 'module-3',
        title: 'SUPPORT & RESISTANCE',
        goal: 'User understands where decisions happen.',
        rooms: [
            {
                id: 'room-3-1',
                title: 'Support',
                iconType: 'shield',
                tasks: [
                    { id: 'task-3-1-1', title: 'Draw Support', description: 'Floor for price.', type: 'DRAW_LINE', challengeText: 'Draw line connecting 3 bottoms.' },
                    { id: 'task-3-1-2', title: 'Strong Zone', description: 'Major reaction area.', type: 'CHART_SELECT', challengeText: 'Identify strongest support zone.' },
                ]
            },
            {
                id: 'room-3-2',
                title: 'Resistance',
                iconType: 'shield',
                tasks: [
                    { id: 'task-3-2-1', title: 'Draw Resistance', description: 'Ceiling for price.', type: 'DRAW_LINE', challengeText: 'Draw resistance above price.' },
                    { id: 'task-3-2-2', title: 'Rejection', description: 'Sellers entering.', type: 'CHART_SELECT', challengeText: 'Click rejection candle.' },
                ]
            },
            {
                id: 'room-3-3',
                title: 'Zones (Not Lines)',
                iconType: 'target',
                tasks: [
                    { id: 'task-3-3-1', title: 'Zone Creation', description: 'Price is not exact.', type: 'DRAW_LINE', challengeText: 'Convert line into zone.' },
                    { id: 'task-3-3-2', title: 'Zone Entry', description: 'Entry inside the area.', type: 'CHART_SELECT', challengeText: 'Click best entry inside zone.' },
                ]
            }
        ]
    },
    {
        id: 'module-4',
        title: 'CANDLESTICK SIGNALS',
        goal: 'User learns market emotion.',
        rooms: [
            {
                id: 'room-4-1',
                title: 'Hammer',
                iconType: 'sword',
                tasks: [
                    { id: 'task-4-1-1', title: 'Identify Hammer', description: 'Bullish reversal.', type: 'CHART_SELECT', challengeText: 'Identify hammer candle.' },
                    { id: 'task-4-1-2', title: 'Trade Hammer', description: 'Entry trigger.', type: 'ACTION', challengeText: 'Buy on hammer close.' },
                ]
            },
            {
                id: 'room-4-2',
                title: 'Shooting Star',
                iconType: 'sword',
                tasks: [
                    { id: 'task-4-2-1', title: 'Selling Pressure', description: 'Bearish reversal.', type: 'CHART_SELECT', challengeText: 'Identify selling pressure.' },
                ]
            },
            {
                id: 'room-4-3',
                title: 'Engulfing',
                iconType: 'shield',
                tasks: [
                    { id: 'task-4-3-1', title: 'Bullish Engulfing', description: 'Momentum shift up.', type: 'CHART_SELECT', challengeText: 'Click bullish engulfing.' },
                    { id: 'task-4-3-2', title: 'Bearish Engulfing', description: 'Momentum shift down.', type: 'CHART_SELECT', challengeText: 'Click bearish engulfing.' },
                ]
            }
        ]
    },
    {
        id: 'module-5',
        title: 'ENTRY LOGIC',
        goal: 'User learns where to enter, not chase.',
        rooms: [
            {
                id: 'room-5-1',
                title: 'Break & Retest',
                iconType: 'target',
                tasks: [
                    { id: 'task-5-1-1', title: 'Breakout', description: 'Leaving a range.', type: 'CHART_SELECT', challengeText: 'Click breakout candle.' },
                    { id: 'task-5-1-2', title: 'Retest', description: 'Confirming the break.', type: 'CHART_SELECT', challengeText: 'Click retest candle.' },
                ]
            },
            {
                id: 'room-5-2',
                title: 'Pullbacks',
                iconType: 'terminal',
                tasks: [
                    { id: 'task-5-2-1', title: 'Impulse', description: 'Strong move.', type: 'CHART_SELECT', challengeText: 'Identify impulse move.' },
                    { id: 'task-5-2-2', title: 'Healthy Pullback', description: 'Breathing.', type: 'CHART_SELECT', challengeText: 'Identify healthy pullback.' },
                ]
            }
        ]
    },
    {
        id: 'module-6',
        title: 'RISK MANAGEMENT',
        goal: 'The most important skill.',
        rooms: [
            {
                id: 'room-6-1',
                title: 'Stop Loss',
                iconType: 'lock',
                tasks: [
                    { id: 'task-6-1-1', title: 'Proper Placement', description: 'Below structure.', type: 'DRAW_LINE', challengeText: 'Place SL below structure.' },
                    { id: 'task-6-1-2', title: 'Too Tight', description: 'Avoid noise.', type: 'CHART_SELECT', challengeText: 'Identify too-tight stop.' },
                ]
            },
            {
                id: 'room-6-2',
                title: 'Risk-Reward',
                iconType: 'chart',
                tasks: [
                    { id: 'task-6-2-1', title: 'Good RR', description: '1:2 or better.', type: 'QUIZ', challengeText: 'Choose trade with 1:2 RR.' },
                    { id: 'task-6-2-2', title: 'Bad RR', description: 'Risking more than reward.', type: 'QUIZ', challengeText: 'Reject trade with bad RR.' },
                ]
            },
            {
                id: 'room-6-3',
                title: 'Position Sizing',
                iconType: 'lock',
                tasks: [
                    { id: 'task-6-3-1', title: '1% Rule', description: 'Preserve capital.', type: 'ACTION', challengeText: 'Risk only 1% of capital.' },
                ]
            }
        ]
    },
    {
        id: 'module-7',
        title: 'INDICATORS',
        goal: 'Indicators assist - they don\'t decide.',
        rooms: [
            {
                id: 'room-7-1',
                title: 'RSI',
                iconType: 'chart',
                tasks: [
                    { id: 'task-7-1-1', title: 'Overbought', description: 'Potential reversal.', type: 'CHART_SELECT', challengeText: 'Identify overbought.' },
                    { id: 'task-7-1-2', title: 'Divergence', description: 'Price vs Oscillator.', type: 'CHART_SELECT', challengeText: 'Spot divergence.' },
                ]
            },
            {
                id: 'room-7-2',
                title: 'Moving Averages',
                iconType: 'chart',
                tasks: [
                    { id: 'task-7-2-1', title: 'Trend ID', description: 'Dynamic support.', type: 'CHART_SELECT', challengeText: 'Trend confirmation.' },
                    { id: 'task-7-2-2', title: 'Crossover Trap', description: 'Lagging signal.', type: 'CHART_SELECT', challengeText: 'Fake MA crossover trap.' },
                ]
            },
            {
                id: 'room-7-3',
                title: 'Indicator Lies',
                iconType: 'skull',
                tasks: [
                    { id: 'task-7-3-1', title: 'Price is King', description: 'Ignore indicator if price disagrees.', type: 'QUIZ', challengeText: 'Indicator says buy but price says sell. User must trust price.' },
                ]
            }
        ]
    },
    {
        id: 'module-8',
        title: 'LIQUIDITY & TRAPS',
        goal: 'Advanced - where retail dies.',
        rooms: [
            {
                id: 'room-8-1',
                title: 'Stop Hunts',
                iconType: 'skull',
                tasks: [
                    { id: 'task-8-1-1', title: 'Liquidity Pools', description: 'Above highs/Below lows.', type: 'CHART_SELECT', challengeText: 'Identify liquidity above highs.' },
                    { id: 'task-8-1-2', title: 'Fakeout', description: 'Trapping traders.', type: 'CHART_SELECT', challengeText: 'Click fake breakout candle.' },
                ]
            },
            {
                id: 'room-8-2',
                title: 'Liquidity Sweep',
                iconType: 'skull',
                tasks: [
                    { id: 'task-8-2-1', title: 'Sweep & Reverse', description: 'Taking orders.', type: 'CHART_SELECT', challengeText: 'Identify sweep -> reversal entry.' },
                ]
            }
        ]
    },
    {
        id: 'module-9',
        title: 'TRADING PSYCHOLOGY',
        goal: 'Simulated Pain.',
        rooms: [
            {
                id: 'room-9-1',
                title: 'FOMO',
                iconType: 'heart',
                tasks: [
                    { id: 'task-9-1-1', title: 'Late Entry', description: 'Chasing is expensive.', type: 'ACTION', challengeText: 'Enter late -> instant loss replay.' },
                ]
            },
            {
                id: 'room-9-2',
                title: 'Revenge Trading',
                iconType: 'heart',
                tasks: [
                    { id: 'task-9-2-1', title: 'Forced Trade', description: 'Trying to win it back.', type: 'ACTION', challengeText: 'User forced to trade again. Loss increases.' },
                ]
            },
            {
                id: 'room-9-3',
                title: 'Overtrading',
                iconType: 'heart',
                tasks: [
                    { id: 'task-9-3-1', title: 'Do Nothing', description: 'The best trade is no trade.', type: 'WAIT', challengeText: 'Best decision = DO NOTHING.' },
                ]
            }
        ]
    },
    {
        id: 'module-10',
        title: 'REAL SCENARIOS',
        goal: 'CTF Style Scenarios.',
        rooms: [
            {
                id: 'room-10-1',
                title: 'The COVID Crash',
                iconType: 'chart',
                tasks: [
                    { id: 'task-10-1-1', title: 'Survival', description: 'Preserve capital.', type: 'ACTION', challengeText: 'Preserve capital during crash.' },
                ]
            },
            {
                id: 'room-10-2',
                title: 'Fake Breakout Hell',
                iconType: 'skull',
                tasks: [
                    { id: 'task-10-2-1', title: 'Discipline', description: 'Ignore 8/10 trades.', type: 'ACTION', challengeText: '10 charts, only 2 real trades.' },
                ]
            }
        ]
    },
    {
        id: 'module-11',
        title: 'FINAL EXAM',
        goal: 'Trader Mode.',
        rooms: [
            {
                id: 'room-11-1',
                title: 'Live Simulation',
                iconType: 'cat',
                tasks: [
                    { id: 'task-11-1-1', title: 'Full Session', description: 'Everything counts.', type: 'ACTION', challengeText: 'Trade the session. Graded on discipline/risk/winrate.' },
                ]
            }
        ]
    }
];
