import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PredictionTask } from './modulesData';
import ProgressFeedback from './ProgressFeedback';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface TaskPredictionProps {
  prediction: PredictionTask;
  onComplete: (isCorrect: boolean) => void;
}

const TaskPrediction: React.FC<TaskPredictionProps> = ({ prediction, onComplete }) => {
  const [selected, setSelected] = useState<'UP' | 'DOWN' | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSelect = (direction: 'UP' | 'DOWN') => {
    if (!submitted) {
      setSelected(direction);
    }
  };

  const handleSubmit = () => {
    if (!selected) return;

    const correct = selected === prediction.correctAnswer;
    setIsCorrect(correct);
    setSubmitted(true);
  };

  const handleFeedbackComplete = () => {
    onComplete(isCorrect);
    if (!isCorrect) {
      setSubmitted(false);
      setSelected(null);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gray-800/50 border-2 border-indigo-500/40 rounded-2xl p-6 backdrop-blur-sm"
      >
        {/* Scenario */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h3 className="text-xl font-bold text-indigo-300 mb-3">📊 What Will Happen?</h3>
          <div className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 rounded-xl p-4">
            <p className="text-lg text-gray-100 font-semibold flex items-center gap-3">
              <span className="text-2xl">{prediction.emoji}</span>
              {prediction.scenario}
            </p>
          </div>
        </motion.div>

        {/* Question */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-gray-300 font-semibold mb-8"
        >
          Will the price go UP 📈 or DOWN 📉?
        </motion.p>

        {/* Options */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {/* UP Option */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            onClick={() => handleSelect('UP')}
            disabled={submitted}
            whileHover={!submitted ? { scale: 1.05 } : {}}
            whileTap={!submitted ? { scale: 0.95 } : {}}
            className={`p-6 rounded-2xl border-3 transition-all transform relative overflow-hidden ${selected === 'UP'
                ? 'bg-green-600/40 border-green-400 shadow-lg shadow-green-500/30'
                : 'bg-gray-700/30 border-gray-600/40 hover:border-green-500/50'
              } ${submitted ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <motion.div
              animate={{
                y: [0, -8, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: 0,
              }}
              className="text-5xl mb-2"
            >
              📈
            </motion.div>
            <p className="text-lg font-bold text-green-300">UP</p>

            {submitted && prediction.correctAnswer === 'UP' && (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6 }}
                className="absolute top-2 right-2 text-2xl"
              >
                ✅
              </motion.div>
            )}

            {submitted && selected === 'UP' && prediction.correctAnswer !== 'UP' && (
              <motion.div
                animate={{ x: [-4, 4, -4, 0] }}
                transition={{ duration: 0.4 }}
                className="absolute top-2 right-2 text-2xl"
              >
                ❌
              </motion.div>
            )}
          </motion.button>

          {/* DOWN Option */}
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            onClick={() => handleSelect('DOWN')}
            disabled={submitted}
            whileHover={!submitted ? { scale: 1.05 } : {}}
            whileTap={!submitted ? { scale: 0.95 } : {}}
            className={`p-6 rounded-2xl border-3 transition-all transform relative overflow-hidden ${selected === 'DOWN'
                ? 'bg-red-600/40 border-red-400 shadow-lg shadow-red-500/30'
                : 'bg-gray-700/30 border-gray-600/40 hover:border-red-500/50'
              } ${submitted ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <motion.div
              animate={{
                y: [0, 8, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: 0,
              }}
              className="text-5xl mb-2"
            >
              📉
            </motion.div>
            <p className="text-lg font-bold text-red-300">DOWN</p>

            {submitted && prediction.correctAnswer === 'DOWN' && (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6 }}
                className="absolute top-2 right-2 text-2xl"
              >
                ✅
              </motion.div>
            )}

            {submitted && selected === 'DOWN' && prediction.correctAnswer !== 'DOWN' && (
              <motion.div
                animate={{ x: [-4, 4, -4, 0] }}
                transition={{ duration: 0.4 }}
                className="absolute top-2 right-2 text-2xl"
              >
                ❌
              </motion.div>
            )}
          </motion.button>
        </div>

        {/* Submit Button */}
        {!submitted && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            onClick={handleSubmit}
            disabled={!selected}
            whileHover={selected ? { scale: 1.05 } : {}}
            whileTap={selected ? { scale: 0.95 } : {}}
            className={`w-full py-3 rounded-xl font-bold text-lg transition-all ${selected
                ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:shadow-lg hover:shadow-indigo-500/50 cursor-pointer'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50'
              }`}
          >
            Make Your Prediction 🎯
          </motion.button>
        )}

        {/* Result Message */}
        {submitted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            className={`mt-4 p-4 rounded-xl text-center font-bold text-lg ${isCorrect
                ? 'bg-green-600/30 text-green-300 border border-green-500'
                : 'bg-red-600/30 text-red-300 border border-red-500'
              }`}
          >
            {isCorrect
              ? `🎉 Correct! Price goes ${prediction.correctAnswer}!`
              : `💡 Not quite! Price goes ${prediction.correctAnswer}. Market moves can be tricky!`
            }
          </motion.div>
        )}
      </motion.div>

      {/* Feedback Animation */}
      <AnimatePresence>
        {submitted && (
          <ProgressFeedback
            isCorrect={isCorrect}
            onComplete={handleFeedbackComplete}
            delay={0.2}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default TaskPrediction;
