import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Module, ExplanationStep } from './modulesData';
import TaskMCQ from './TaskMCQ';
import TaskMatch from './TaskMatch';
import TaskPrediction from './TaskPrediction';
import TaskChart from './TaskChart';
import CatMentor from './CatMentor';

interface ModuleCardProps {
  module: Module;
  onComplete: (isCorrect: boolean, points: number) => void;
  isActive: boolean;
  isLocked?: boolean;
}

const ModuleCard: React.FC<ModuleCardProps> = ({
  module,
  onComplete,
  isActive,
  isLocked = false,
}) => {
  // Flow stages: explanation -> button -> (cat moves) -> next explanation...
  // Finally: task appears -> result
  const [currentExplanationIndex, setCurrentExplanationIndex] = useState(0);
  const [stage, setStage] = useState<'explanation' | 'task' | 'result'>('explanation');
  const [isTyping, setIsTyping] = useState(true);
  const [catMessage, setCatMessage] = useState(
    module.explanations[0]?.catMessage || ''
  );
  const [catPosition, setCatPosition] = useState<'left' | 'center' | 'right'>(
    module.explanations[0]?.position || 'left'
  );

  if (isLocked) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 0.5, y: 0, scale: 1 }}
        className="w-full"
      >
        <div className="relative bg-gradient-to-r from-gray-800/60 to-gray-900/60 border-2 border-gray-600/40 rounded-3xl p-8 backdrop-blur-md shadow-lg opacity-50 cursor-not-allowed">
          <div className="flex items-center justify-center gap-4">
            <span className="text-4xl">🔒</span>
            <div>
              <h2 className="text-2xl font-bold text-gray-400">{module.title}</h2>
              <p className="text-sm text-gray-500">
                Complete previous module to unlock
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  /**
   * FLOW LOGIC:
   * 1. Cat explains (isTyping = true)
   * 2. Typing completes (isTyping = false)
   * 3. "Go to Next" button appears
   * 4. User clicks "Go to Next"
   * 5. Cat moves smoothly to next position
   * 6. Next explanation starts
   * 7. After last explanation, task appears
   */

  const currentExplanation =
    stage === 'explanation'
      ? module.explanations[currentExplanationIndex]
      : null;

  const isLastExplanation =
    currentExplanationIndex === module.explanations.length - 1;

  const handleTypingComplete = () => {
    setIsTyping(false); // Stop typing, button appears
  };

  const handleGoToNext = () => {
    if (isLastExplanation) {
      // Move to task stage
      setStage('task');
    } else {
      // Move to next explanation
      const nextIndex = currentExplanationIndex + 1;
      const nextExplanation = module.explanations[nextIndex];

      // Animate cat position change
      setIsTyping(true); // Start typing for next explanation

      // Move cat to next position with animation
      setCatPosition(nextExplanation.position);
      setCatMessage(nextExplanation.catMessage);
      setCurrentExplanationIndex(nextIndex);
    }
  };

  const handleTaskComplete = (isCorrect: boolean) => {
    if (stage === 'result') return; // Prevent double submission

    if (isCorrect) {
      setCatMessage(module.taskCompleteMessage);
      setStage('result');

      setTimeout(() => {
        onComplete(true, module.points);
      }, 2000);
    } else {
      setCatMessage(module.taskIncorrectMessage);
      // Allow retry - stay in task stage
      setTimeout(() => {
        setIsTyping(false);
      }, 1500);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.6, type: 'spring', bounce: 0.3 }}
      className="w-full"
    >
      {/* Module Header */}
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
          <span className="text-4xl">{module.icon}</span>
          {module.title}
        </h2>
        <p className="text-gray-300 text-sm">{module.description}</p>
      </div>

      {/* Main Content Area */}
      <motion.div
        className="bg-gradient-to-br from-gray-900/60 to-gray-800/60 border-2 border-indigo-500/30 rounded-3xl p-8 backdrop-blur-md"
        style={{ minHeight: '400px' }}
      >
        <AnimatePresence mode="wait">
          {/* EXPLANATION STAGE */}
          {stage === 'explanation' && currentExplanation && (
            <motion.div
              key="explanation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Cat with message */}
              <div className="mb-8">
                <CatMentor
                  message={catMessage}
                  position={catPosition}
                  isTyping={isTyping}
                  onTypingComplete={handleTypingComplete}
                />
              </div>

              {/* Learning cards (if applicable) */}
              {currentExplanation.showLearningCards &&
                currentExplanation.learningCards && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                    {currentExplanation.learningCards.map((card, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          delay: idx * 0.1,
                          duration: 0.4,
                        }}
                        className="bg-gradient-to-br from-indigo-600/40 to-purple-600/40 border border-indigo-400/40 rounded-lg p-4 text-center"
                      >
                        <p className="text-white text-sm font-medium">{card}</p>
                      </motion.div>
                    ))}
                  </div>
                )}

              {/* "Go to Next" Button - appears ONLY after typing completes */}
              <AnimatePresence>
                {!isTyping && (
                  <motion.button
                    key="next-button"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.4 }}
                    onClick={handleGoToNext}
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 active:scale-95"
                    style={{
                      boxShadow: '0 0 20px rgba(99, 102, 241, 0.5)',
                    }}
                  >
                    {isLastExplanation ? '👉 Attempt Task' : '👉 Go to Next'}
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* TASK STAGE */}
          {stage === 'task' && (
            <motion.div
              key="task"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {/* Cat intro */}
              <div className="mb-8">
                <CatMentor
                  message={module.task.question || 'Let\'s test your knowledge!'}
                  position="right"
                  isTyping={false}
                  onTypingComplete={() => { }}
                />
              </div>

              {/* Task Component */}
              <div className="mt-8">
                {module.task.type === 'MCQ' && (
                  <TaskMCQ
                    question={module.task.question || ''}
                    options={module.task.options || []}
                    onAnswer={handleTaskComplete}
                  />
                )}

                {module.task.type === 'MATCH' && (
                  <TaskMatch
                    matches={module.task.matches || []}
                    onComplete={handleTaskComplete}
                  />
                )}

                {module.task.type === 'PREDICTION' && (
                  <TaskPrediction
                    scenario={module.task.prediction?.scenario || ''}
                    correctAnswer={
                      module.task.prediction?.correctAnswer || 'UP'
                    }
                    emoji={module.task.prediction?.emoji || ''}
                    onAnswer={handleTaskComplete}
                  />
                )}

                {module.task.type === 'CHART' && module.task.chart && (
                  <TaskChart
                    data={module.task.chart.data}
                    correctIndices={module.task.chart.correctIndices}
                    instruction={module.task.chart.instruction}
                    onAnswer={handleTaskComplete}
                  />
                )}
              </div>
            </motion.div>
          )}

          {/* RESULT STAGE - Refactored for Pixel Art Style */}
          {stage === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, type: 'spring', bounce: 0.4 }}
              className="relative"
            >
              {/* Wooden Panel Container */}
              <div className="bg-[#EFEBE9] border-4 border-[#5D4037] rounded-xl p-8 text-center relative shadow-[0_10px_0_rgba(62,39,35,0.4)] overflow-hidden">
                {/* Nails */}
                <div className="absolute top-3 left-3 w-3 h-3 rounded-full bg-[#BCAAA4] border border-[#5D4037] shadow-inner"></div>
                <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-[#BCAAA4] border border-[#5D4037] shadow-inner"></div>
                <div className="absolute bottom-3 left-3 w-3 h-3 rounded-full bg-[#BCAAA4] border border-[#5D4037] shadow-inner"></div>
                <div className="absolute bottom-3 right-3 w-3 h-3 rounded-full bg-[#BCAAA4] border border-[#5D4037] shadow-inner"></div>

                {/* Victory Animation */}
                <motion.div
                  animate={{ y: [0, -15, 0], scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="text-7xl mb-6 filter drop-shadow-md"
                >
                  🎉
                </motion.div>

                {/* Title */}
                <h3 className="text-3xl font-bold text-[#3E2723] mb-2 font-pixel tracking-wide uppercase">
                  Lesson Complete!
                </h3>

                {/* Separator */}
                <div className="h-1 w-24 bg-[#8D6E63] mx-auto rounded-full mb-6 opacity-50"></div>

                {/* Message Bubble */}
                <div className="bg-[#FFF8E1] border-2 border-[#8D6E63] rounded-lg p-4 mb-8 shadow-inner italic text-[#5D4037]">
                  "{catMessage}"
                </div>

                {/* Rewards */}
                <div className="flex justify-center gap-4 mb-8">
                  <div className="bg-[#FFF3E0] border-2 border-[#FFB74D] px-6 py-3 rounded-xl flex flex-col items-center min-w-[120px] shadow-sm transform hover:scale-105 transition-transform">
                    <span className="text-xs font-bold text-[#F57C00] uppercase tracking-widest font-pixel">REWARD</span>
                    <span className="text-2xl font-bold text-[#E65100] font-pixel">+{module.points} XP</span>
                  </div>
                </div>

                {/* Done Button (Simulated Next) */}
                <button
                  className="w-full bg-[#4CAF50] text-white border-b-[6px] border-[#1B5E20] hover:bg-[#43A047] active:border-b-0 active:translate-y-[6px] rounded-xl py-4 font-bold text-xl font-pixel uppercase tracking-widest shadow-xl transition-all"
                  disabled
                >
                  Completed ✅
                </button>
                <p className="mt-3 text-[#8D6E63] text-xs font-pixel animate-pulse">
                  Redirecting to map...
                </p>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default ModuleCard;
