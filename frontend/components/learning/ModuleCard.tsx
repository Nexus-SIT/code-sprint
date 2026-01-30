import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Module, ExplanationStep } from './modulesData';
import TaskMCQ from './TaskMCQ';
import TaskMatch from './TaskMatch';
import TaskPrediction from './TaskPrediction';
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
                  onTypingComplete={() => {}}
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
              </div>
            </motion.div>
          )}

          {/* RESULT STAGE */}
          {stage === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.6, type: 'spring', bounce: 0.4 }}
              className="text-center"
            >
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-6xl mb-4"
              >
                🎉
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Congratulations!
              </h3>
              <p className="text-gray-300 mb-4">{catMessage}</p>
              <div className="inline-block bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 font-bold px-6 py-3 rounded-lg">
                +{module.points} XP
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default ModuleCard;
