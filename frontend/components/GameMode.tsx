import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../store';
import { generateCandles } from '../utils/dataGenerator';
import CandleChart from './CandleChart';
import Mentor from './Mentor';
import { Candle, MentorEmotion } from '../types';
import { ArrowLeft, TrendingUp, TrendingDown, Minus, Coins, X } from 'lucide-react';
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
    if (phase === 'BETTING') return { emotion: 'thinking', text: "The crops depend on this trade. Which way will it go?" };
    if (phase === 'SIMULATING') return { emotion: 'alert', text: "Hold onto your hat! The market is moving!" };
    if (phase === 'RESULT') {
      if (resultPnL > 0) return { emotion: 'happy', text: `Bountiful harvest! You made $${resultPnL.toFixed(0)}!` };
      if (resultPnL < 0) return { emotion: 'alert', text: `Oh dear... Looks like a drought. Lost $${Math.abs(resultPnL).toFixed(0)}.` };
      return { emotion: 'neutral', text: "Steady as a rock." };
    }
    return { emotion: 'neutral', text: '' };
  };

  const mentor = getMentorProps();

  return (
    <div className="flex flex-col h-screen relative p-4 max-w-7xl mx-auto font-body text-coffee selection:bg-wood-light selection:text-parchment">
      {/* Wooden Header Bar */}
      <div className="flex items-center justify-between mb-2 bg-wood border-4 border-wood-dark rounded-lg p-3 shadow-pixel z-10 relative">
        <button
          onClick={() => setMode('HOME')}
          className="bg-failure text-white border-b-4 border-red-900 active:border-b-0 active:translate-y-1 active:mt-1 rounded px-4 py-2 font-pixel text-xs flex items-center hover:bg-red-700 transition-colors"
        >
          <ArrowLeft className="mr-2 w-4 h-4" /> LEAVE
        </button>

        <div className="flex-1 flex justify-center">
          <img
            src="/CCLogo.png"
            alt="Candle Crush"
            className="h-10 md:h-12 w-auto object-contain drop-shadow-sm"
          />
        </div>

        <div className="flex gap-4">
          <div className="flex items-center bg-wood-dark px-4 py-2 rounded border-2 border-wood-light">
            <Coins className="text-yellow-400 mr-2 w-5 h-5" />
            <div className={`text-xl font-pixel ${walletBalance < 0 ? 'text-red-400' : 'text-parchment'}`}>
              ${walletBalance.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">

        {/* Chart Section (The Window) */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          {/* The Chart Window */}
          <div className="bg-parchment rounded-lg border-4 border-wood-dark shadow-pixel relative flex flex-col flex-1 p-1 overflow-hidden">
            {/* Window Frame Inner Border */}
            <div className="absolute inset-0 border-2 border-wood opacity-30 pointer-events-none rounded sm:hidden"></div>

            <div className="flex-1 w-full h-full p-2">
              <CandleChart data={visibleData} height="100%" />
            </div>
          </div>

          {/* Mentor Dialogue Box */}
          <div className="h-40 w-full">
            <Mentor emotion={mentor.emotion} text={mentor.text} />
          </div>
        </div>

        {/* Controls Section (Wood Panel) */}
        <div className="bg-wood rounded-lg border-4 border-wood-dark shadow-pixel p-4 flex flex-col justify-between gap-4 relative">
          {/* Wood Grain Texture Overlay (CSS handled) */}

          {phase === 'BETTING' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col gap-6 h-full"
            >
              <div className="bg-parchment/10 p-4 rounded border-2 border-wood-dark/50">
                <label className="text-parchment text-sm font-pixel mb-2 block text-center">WAGER AMOUNT</label>
                <input
                  type="number"
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
                  className="w-full bg-parchment border-4 border-wood-dark rounded p-3 text-coffee font-pixel text-lg focus:ring-4 focus:ring-wood-light outline-none text-center shadow-inner"
                />
                <div className="flex justify-between text-xs text-parchment/70 mt-2 font-pixel">
                  <span>MIN: 100</span>
                  <span>MAX: {walletBalance}</span>
                </div>
              </div>

              <div className="flex flex-col gap-3 flex-1 justify-center">
                <button
                  onClick={() => handleBet('BUY')}
                  className="w-full bg-success text-white border-b-[6px] border-green-900 active:border-b-0 active:translate-y-[6px] rounded-lg py-5 font-pixel text-sm flex items-center justify-center gap-2 hover:brightness-110 transition-all"
                >
                  <TrendingUp size={24} /> BUY (LONG)
                </button>
                <button
                  onClick={() => handleBet('SELL')}
                  className="w-full bg-failure text-white border-b-[6px] border-red-900 active:border-b-0 active:translate-y-[6px] rounded-lg py-5 font-pixel text-sm flex items-center justify-center gap-2 hover:brightness-110 transition-all"
                >
                  <TrendingDown size={24} /> SELL (SHORT)
                </button>
                <button
                  onClick={() => handleBet('HOLD')}
                  className="w-full bg-wood-light text-parchment border-b-[6px] border-wood-dark active:border-b-0 active:translate-y-[6px] rounded-lg py-5 font-pixel text-sm flex items-center justify-center gap-2 hover:brightness-110 transition-all"
                >
                  <Minus size={24} /> SKIP DAY
                </button>
              </div>
            </motion.div>
          )}

          {phase === 'SIMULATING' && (
            <div className="flex flex-col items-center justify-center h-full text-center bg-wood-dark/20 rounded-lg border-2 border-wood-dark border-dashed p-4">
              <div className="animate-spin text-parchment mb-4">
                <Coins size={48} />
              </div>
              <h3 className="text-xl font-pixel text-parchment animate-pulse">MARKET OPEN</h3>
              <p className="text-wood-light mt-2 font-pixel text-xs">Growing profits...</p>
            </div>
          )}

          {phase === 'RESULT' && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center justify-center h-full text-center"
            >
              <div className="bg-parchment w-full p-4 rounded border-4 border-wood-dark shadow-pixel mb-6">
                <div className="text-coffee font-pixel text-xs mb-2">HARVEST REPORT</div>
                <div className={`text-3xl font-pixel ${resultPnL >= 0 ? 'text-success' : 'text-failure'}`}>
                  {resultPnL >= 0 ? '+' : ''}{resultPnL.toFixed(0)}
                </div>
              </div>

              <button
                onClick={resetGame}
                className="w-full bg-blue-600 text-white border-b-[6px] border-blue-900 active:border-b-0 active:translate-y-[6px] rounded-lg py-6 font-pixel text-sm shadow-xl hover:bg-blue-500 transition-all"
              >
                NEXT SEASON
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameMode;