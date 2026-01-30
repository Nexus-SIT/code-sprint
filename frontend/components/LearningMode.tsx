import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../store';
import { generateCandles } from '../utils/dataGenerator';
import CandleChart from './CandleChart';
import Mentor from './Mentor';
import { Candle, MentorEmotion } from '../types';
import { ArrowLeft, Play, Pause, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

const LearningMode: React.FC = () => {
  const setMode = useStore((state) => state.setMode);
  
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
    <div className="flex flex-col h-full relative p-4 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={() => setMode('HOME')}
          className="flex items-center text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="mr-2" size={20} /> Exit
        </button>
        <h1 className="text-2xl font-bold text-green-400">Learning Mode</h1>
        <div className="w-20" /> {/* Spacer */}
      </div>

      {/* Main Content */}
      <div className="relative flex-1 bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-2xl flex flex-col">
        <Mentor emotion={mentorState.emotion} text={mentorState.text} />
        
        <div className="flex-1 min-h-[400px] relative">
           <CandleChart data={visibleData} activeIndex={isPaused ? currentIndex : undefined} />
           
           {/* Overlays */}
           {currentIndex === 40 && isPaused && (
             <motion.div 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-500/20 border-2 border-green-500 text-green-400 px-6 py-3 rounded-full font-bold backdrop-blur-sm z-10"
             >
                🚀 70% Upside Chance
             </motion.div>
           )}
        </div>

        {/* Controls */}
        <div className="mt-6 flex justify-center">
            {isPaused ? (
                <button 
                  onClick={handleContinue}
                  className="bg-green-500 hover:bg-green-600 text-black font-bold py-3 px-8 rounded-full flex items-center shadow-lg hover:shadow-green-500/50 transition-all transform hover:scale-105"
                >
                  <Play className="mr-2" fill="currentColor" /> Continue Lesson
                </button>
            ) : (
                <div className="text-gray-500 flex items-center gap-2">
                    <div className="animate-pulse w-3 h-3 bg-green-500 rounded-full"></div>
                    Live Simulation
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default LearningMode;