import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { generateCandles } from '../utils/dataGenerator';
import CandleChart from './CandleChart';
import Mentor from './Mentor';
import { Candle, MentorEmotion } from '../types';
import { ArrowLeft, Play, Coins } from 'lucide-react';
import { motion } from 'framer-motion';

const LearningMode: React.FC = () => {
  const navigate = useNavigate();

  // Full dataset
  const [fullData] = useState<Candle[]>(() => generateCandles(50, 150));
  // Visible dataset
  const [visibleData, setVisibleData] = useState<Candle[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Mentor State
  const [mentorState, setMentorState] = useState<{ emotion: MentorEmotion; text: string }>({
    emotion: 'happy',
    text: "Welcome to Trading 101! Let's watch the market move.",
  });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Initial load
    setVisibleData([fullData[0]]);
    startSimulation();

    return () => stopSimulation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stopSimulation = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const startSimulation = () => {
    stopSimulation();
    setIsPaused(false);
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 2000);
  };

  useEffect(() => {
    if (currentIndex >= fullData.length) {
      stopSimulation();
      setMentorState({ emotion: 'happy', text: "Lesson complete! Great job watching the trends." });
      return;
    }

    // Update Visible Data
    setVisibleData(fullData.slice(0, currentIndex + 1));

    // Pause Logic & Mentor Updates
    if (currentIndex === 15) {
      pauseAndMentor('alert', "Hold up! See that long wick on top? That means sellers are pushing back!");
    } else if (currentIndex === 30) {
      pauseAndMentor('thinking', "The price is consolidating here. It's moving sideways. Calm before the storm?");
    } else if (currentIndex === 40) {
      pauseAndMentor('happy', "Chart Pattern detected! 70% chance of upside movement here.");
    } else if (currentIndex > 0 && currentIndex < 15) {
      setMentorState({ emotion: 'neutral', text: "Watching price action..." });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  const pauseAndMentor = (emotion: MentorEmotion, text: string) => {
    stopSimulation();
    setIsPaused(true);
    setMentorState({ emotion, text });
  };

  const handleContinue = () => {
    startSimulation();
    setMentorState({ emotion: 'neutral', text: "Resuming analysis..." });
  };

  return (
    <div className="flex flex-col h-screen relative p-4 max-w-6xl mx-auto font-body text-coffee selection:bg-wood-light selection:text-parchment">
      {/* Wooden Header Bar */}
      <div className="flex items-center justify-between mb-4 bg-wood border-4 border-wood-dark rounded-lg p-3 shadow-pixel z-10">
        <button
          onClick={() => navigate('/')}
          className="bg-failure text-white border-b-4 border-red-900 active:border-b-0 active:translate-y-1 active:mt-1 rounded px-4 py-2 font-pixel text-xs flex items-center hover:bg-red-700 transition-colors"
        >
          <ArrowLeft className="mr-2 w-4 h-4" /> EXIT CLASS
        </button>

        <div className="flex-1 flex items-center justify-center gap-3">
          <img src="/CCLogo.png" alt="Logo" className="h-8 w-auto object-contain drop-shadow-sm" />
          <h1 className="text-xl md:text-2xl text-parchment font-pixel tracking-tighter drop-shadow-md">
            TRADING 101
          </h1>
        </div>

        <div className="w-20"></div> {/* Spacer balance */}
      </div>

      {/* Main Content Wood Panel */}
      <div className="flex-1 bg-wood rounded-lg border-4 border-wood-dark shadow-pixel p-4 flex flex-col gap-4 min-h-0">

        {/* Chart Window */}
        <div className="bg-parchment rounded border-4 border-wood-dark shadow-inner relative flex-1 min-h-[300px] overflow-hidden flex flex-col">
          <div className="flex-1 w-full h-full p-2">
            <CandleChart data={visibleData} activeIndex={isPaused ? currentIndex : undefined} height="100%" />
          </div>

          {/* Overlays */}
          {currentIndex === 40 && isPaused && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-parchment border-4 border-success text-success px-6 py-4 rounded font-pixel shadow-pixel-sm z-10 text-center"
            >
              <div className="text-2xl mb-1">🚀</div>
              <div>70% UPSIDE CHANCE</div>
            </motion.div>
          )}
        </div>

        {/* Bottom Section: Mentor & Controls */}
        <div className="h-48 flex gap-4">
          {/* Mentor Box */}
          <div className="flex-1 h-full">
            <Mentor emotion={mentorState.emotion} text={mentorState.text} />
          </div>

          {/* Controls Box */}
          <div className="w-1/3 bg-wood-dark rounded border-4 border-wood-light p-4 flex items-center justify-center">
            {isPaused ? (
              <button
                onClick={handleContinue}
                className="w-full bg-success text-white border-b-[6px] border-green-900 active:border-b-0 active:translate-y-[6px] rounded-lg py-4 font-pixel text-sm flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-lg"
              >
                <Play className="w-5 h-5" fill="currentColor" /> CONTINUE
              </button>
            ) : (
              <div className="text-parchment flex flex-col items-center gap-2 font-pixel text-xs opacity-80">
                <div className="animate-spin text-yellow-400">
                  <Coins size={32} />
                </div>
                SIMULATION LIVE
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningMode;