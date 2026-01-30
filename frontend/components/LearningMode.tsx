import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { MentorEmotion } from '../types';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ModuleCard, modules } from './learning';

const LearningMode: React.FC = () => {
  const { setMode, addXp } = useStore();
  
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);

  const isComplete = currentModuleIndex >= modules.length;

  const handleModuleComplete = (isCorrect: boolean, points: number) => {
    if (isCorrect) {
      const currentModule = modules[currentModuleIndex];
      const newCompleted = [...completedModules, currentModule.id];
      setCompletedModules(newCompleted);
      setTotalPoints(prev => prev + points);
      addXp(points);

      // Move to next module
      if (currentModuleIndex + 1 < modules.length) {
        setTimeout(() => {
          setCurrentModuleIndex(prev => prev + 1);
        }, 2500);
      }
    }
  };

  const isModuleLocked = (index: number) => {
    return index > completedModules.length;
  };

  return (
    <div className="flex flex-col h-full relative p-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={() => setMode('HOME')}
          className="bg-failure text-white border-b-4 border-red-900 active:border-b-0 active:translate-y-1 active:mt-1 rounded px-4 py-2 font-pixel text-xs flex items-center hover:bg-red-700 transition-colors"
        >
          <ArrowLeft className="mr-2 w-4 h-4" /> EXIT CLASS
        </button>
        <h1 className="text-3xl font-bold text-indigo-400">📚 Stock Market Academy</h1>
        <div className="text-right">
          <div className="text-sm text-gray-400">Progress</div>
          <div className="text-xl font-bold text-green-400">{completedModules.length}/{modules.length}</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative flex-1 bg-gray-800/30 rounded-2xl p-6 border border-gray-700 shadow-2xl flex flex-col overflow-auto">
        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          className="mb-6 bg-gray-700/50 rounded-full h-3 overflow-hidden origin-left"
        >
          <motion.div
            animate={{ width: `${(completedModules.length / modules.length) * 100}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
          />
        </motion.div>

        {/* Modules Container */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {!isComplete ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={modules[currentModuleIndex].id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <ModuleCard
                  module={modules[currentModuleIndex]}
                  onComplete={handleModuleComplete}
                  isActive={true}
                  isLocked={isModuleLocked(currentModuleIndex)}
                />
              </motion.div>
            </AnimatePresence>
          ) : (
            // Completion Screen
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              <motion.div
                animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-8xl mb-6"
              >
                🏆
              </motion.div>

              <h2 className="text-4xl font-bold text-green-400 mb-4">Congratulations!</h2>
              <p className="text-xl text-gray-300 mb-6">
                You've completed all 8 modules and mastered Stock Market fundamentals!
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8 w-full">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-indigo-900/40 border border-indigo-500/40 rounded-xl p-4"
                >
                  <div className="text-3xl font-bold text-indigo-300">{completedModules.length}</div>
                  <div className="text-sm text-gray-400">Modules</div>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="bg-green-900/40 border border-green-500/40 rounded-xl p-4"
                >
                  <div className="text-3xl font-bold text-green-300">+{totalPoints}</div>
                  <div className="text-sm text-gray-400">XP Earned</div>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="bg-yellow-900/40 border border-yellow-500/40 rounded-xl p-4"
                >
                  <div className="text-3xl font-bold text-yellow-300">100%</div>
                  <div className="text-sm text-gray-400">Completion</div>
                </motion.div>
              </div>

              {/* Modules Summary */}
              <div className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 mb-8 text-left">
                <h3 className="text-lg font-bold text-indigo-300 mb-3">📚 Modules Mastered</h3>
                <div className="space-y-2 text-sm">
                  {modules.map((mod, idx) => (
                    <motion.div
                      key={mod.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + idx * 0.05 }}
                      className="flex items-center gap-2 text-gray-300"
                    >
                      <CheckCircle2 size={16} className="text-green-400" />
                      {mod.icon} {mod.title}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 w-full">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setMode('GAME')}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all"
                >
                  Start Trading Game 🎮
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setMode('HOME')}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all"
                >
                  Back to Home 🏠
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LearningMode;