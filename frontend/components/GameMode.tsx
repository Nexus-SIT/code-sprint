import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../store';
import { generateCandles } from '../utils/dataGenerator';
import CandleChart from './CandleChart';
import Mentor from './Mentor';
import { Candle, MentorEmotion } from '../types';
import { ArrowLeft, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { motion } from 'framer-motion';

type GamePhase = 'BETTING' | 'SIMULATING' | 'RESULT';

const GameMode: React.FC = () => {
  const { setMode, walletBalance, updateBalance, addXp } = useStore();
  
  const [fullData, setFullData] = useState<Candle[]>([]);
  const [visibleData, setVisibleData] = useState<Candle[]>([]);
  const [phase, setPhase] = useState<GamePhase>('BETTING');
  const [betAmount, setBetAmount] = useState<string>('1000');
  const [position, setPosition] = useState<'BUY' | 'SELL' | 'HOLD' | null>(null);
  
  const [resultPnL, setResultPnL] = useState(0);

  // Initialize Data
  useEffect(() => {
    const data = generateCandles(100, 200);
    setFullData(data);
    setVisibleData(data.slice(0, 50)); // Show first 50
  }, []);

  const handleBet = (type: 'BUY' | 'SELL' | 'HOLD') => {
    const amount = parseInt(betAmount);
    if (isNaN(amount) || amount <= 0) return alert("Invalid amount");
    if (amount > walletBalance) return alert("Insufficient funds");

    setPosition(type);
    setPhase('SIMULATING');
  };

  // Simulation Logic
  const simulationInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const simulationIndex = useRef(50);

  useEffect(() => {
    if (phase === 'SIMULATING') {
      simulationInterval.current = setInterval(() => {
        simulationIndex.current += 1;
        
        // Update Chart
        setVisibleData(fullData.slice(0, simulationIndex.current));

        if (simulationIndex.current >= 100) {
          endGame();
        }
      }, 50); // Fast forward
    }
    return () => {
      if (simulationInterval.current) clearInterval(simulationInterval.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const endGame = () => {
    if (simulationInterval.current) clearInterval(simulationInterval.current);
    
    const entryPrice = fullData[49].close;
    const exitPrice = fullData[99].close;
    const amount = parseInt(betAmount);
    let pnl = 0;

    if (position === 'BUY') {
      const percentChange = (exitPrice - entryPrice) / entryPrice;
      pnl = amount * percentChange * 5; // 5x Leverage for excitement
    } else if (position === 'SELL') {
      const percentChange = (entryPrice - exitPrice) / entryPrice;
      pnl = amount * percentChange * 5;
    } else {
      // HOLD logic: tiny reward for avoiding volatility? or 0.
      pnl = 0;
    }

    setResultPnL(pnl);
    updateBalance(pnl);
    addXp(pnl > 0 ? 100 : 10);
    setPhase('RESULT');
  };

  const resetGame = () => {
    const data = generateCandles(100, fullData[99].close); // Continue from last price
    setFullData(data);
    setVisibleData(data.slice(0, 50));
    setPhase('BETTING');
    setPosition(null);
    simulationIndex.current = 50;
  };

  // Helpers for UI
  const getMentorProps = (): { emotion: MentorEmotion; text: string } => {
    if (phase === 'BETTING') return { emotion: 'thinking', text: "Analyze the trend. What's your move?" };
    if (phase === 'SIMULATING') return { emotion: 'alert', text: "Here we go! Market is moving fast!" };
    if (phase === 'RESULT') {
      if (resultPnL > 0) return { emotion: 'happy', text: `Nice trade! You made $${resultPnL.toFixed(0)}.` };
      if (resultPnL < 0) return { emotion: 'alert', text: `Ouch. Loss of $${Math.abs(resultPnL).toFixed(0)}.` };
      return { emotion: 'neutral', text: "Played it safe." };
    }
    return { emotion: 'neutral', text: '' };
  };

  const mentor = getMentorProps();

  return (
    <div className="flex flex-col h-full relative p-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
         <button onClick={() => setMode('HOME')} className="text-gray-400 hover:text-white flex items-center">
            <ArrowLeft className="mr-2" size={20}/> Quit
         </button>
         <div className="flex gap-6">
            <div className="text-right">
                <div className="text-xs text-gray-400">WALLET</div>
                <div className={`text-xl font-mono font-bold ${walletBalance < 0 ? 'text-red-500' : 'text-blue-400'}`}>
                    ${walletBalance.toLocaleString()}
                </div>
            </div>
         </div>
      </div>

      {/* Main Game Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1">
        
        {/* Chart Section */}
        <div className="lg:col-span-3 bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-2xl relative flex flex-col">
            <Mentor emotion={mentor.emotion} text={mentor.text} />
            <div className="flex-1 min-h-[400px]">
                <CandleChart data={visibleData} height={500} />
            </div>
        </div>

        {/* Controls Section */}
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-xl flex flex-col justify-center gap-6 relative overflow-hidden">
            {phase === 'BETTING' && (
                <motion.div 
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col gap-6"
                >
                    <div>
                        <label className="text-gray-400 text-sm font-bold mb-2 block">BET AMOUNT</label>
                        <input 
                            type="number" 
                            value={betAmount}
                            onChange={(e) => setBetAmount(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white font-mono text-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                         <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>Min: 100</span>
                            <span>Max: {walletBalance}</span>
                         </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button 
                            onClick={() => handleBet('BUY')}
                            className="w-full bg-green-500/10 hover:bg-green-500 text-green-500 hover:text-black border border-green-500 font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 group"
                        >
                            <TrendingUp className="group-hover:scale-110 transition-transform" /> BUY (LONG)
                        </button>
                        <button 
                            onClick={() => handleBet('SELL')}
                            className="w-full bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-black border border-red-500 font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 group"
                        >
                            <TrendingDown className="group-hover:scale-110 transition-transform" /> SELL (SHORT)
                        </button>
                        <button 
                            onClick={() => handleBet('HOLD')}
                            className="w-full bg-gray-700 hover:bg-gray-600 text-gray-300 font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
                        >
                            <Minus /> HOLD
                        </button>
                    </div>
                </motion.div>
            )}

            {phase === 'SIMULATING' && (
                <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
                    <h3 className="text-xl font-bold animate-pulse text-indigo-400">MARKET OPEN</h3>
                    <p className="text-gray-400 mt-2">Executing strategy...</p>
                </div>
            )}

            {phase === 'RESULT' && (
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center justify-center h-full text-center"
                >
                    <div className={`text-4xl font-black mb-2 ${resultPnL >= 0 ? 'text-green-400' : 'text-red-500'}`}>
                        {resultPnL >= 0 ? '+' : ''}{resultPnL.toFixed(2)}
                    </div>
                    <div className="text-gray-400 mb-8 uppercase tracking-widest text-sm font-bold">
                        Profit / Loss
                    </div>

                    <button 
                        onClick={resetGame}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/20 transition-all transform hover:-translate-y-1"
                    >
                        NEXT TRADE
                    </button>
                </motion.div>
            )}
        </div>
      </div>
    </div>
  );
};

export default GameMode;