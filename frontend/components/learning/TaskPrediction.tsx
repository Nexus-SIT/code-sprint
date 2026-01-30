import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PredictionTask } from './modulesData';
import ProgressFeedback from './ProgressFeedback';

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

  useEffect(() => {
    console.log("TaskPrediction Mounted", { prediction });
  }, [prediction]);

  const handleSubmit = () => {
    if (!selected) return;

    const correct = selected === prediction.correctAnswer;
    setIsCorrect(correct);
    setSubmitted(true);
  };

  const handleFeedbackComplete = React.useCallback(() => {
    onComplete(isCorrect);
    if (!isCorrect) {
      setSubmitted(false);
      setSelected(null);
    }
  }, [onComplete, isCorrect]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full"
      >
        {/* Scenario - Styled as a Parchment Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h3 className="font-pixel text-[#8D6E63] uppercase tracking-widest text-sm font-bold mb-3">
            📊 MARKET SCENARIO
          </h3>
          <div className="bg-[#FFF8E1] border-2 border-[#D7CCC8] rounded-xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-[#FFE0B2]"></div>
            <p className="text-xl text-[#5D4037] font-bold flex items-center gap-4 font-pixel">
              <span className="text-4xl filter drop-shadow-sm">{prediction.emoji}</span>
              {prediction.scenario}
            </p>
          </div>
        </motion.div>

        {/* Question */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-[#5D4037] font-bold mb-6 text-lg"
        >
          Will the price go <span className="text-[#2E7D32]">UP 📈</span> or <span className="text-[#C62828]">DOWN 📉</span>?
        </motion.p>

        {/* Options */}
        <div className="grid grid-cols-2 gap-4 md:gap-8 mb-8">
          {/* UP Option */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            onClick={() => handleSelect('UP')}
            disabled={submitted}
            whileHover={!submitted ? { scale: 1.05, y: -4 } : {}}
            whileTap={!submitted ? { scale: 0.95 } : {}}
            className={`p-6 rounded-2xl border-b-8 transition-all relative overflow-hidden group
            ${selected === 'UP'
                ? 'bg-[#C8E6C9] border-[#2E7D32] shadow-lg translate-y-[-4px]'
                : 'bg-white border-[#A5D6A7] hover:border-[#4CAF50] shadow-sm'
              } ${submitted ? 'cursor-not-allowed opacity-90' : 'cursor-pointer'}
              ${submitted && prediction.correctAnswer === 'UP' ? '!bg-[#A5D6A7] !border-[#2E7D32] ring-4 ring-[#2E7D32]/30' : ''}
              ${submitted && selected === 'UP' && prediction.correctAnswer !== 'UP' ? '!bg-[#FFCDD2] !border-[#C62828]' : ''}
              `}
          >
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="text-6xl mb-4 filter drop-shadow-md"
            >
              📈
            </motion.div>
            <p className={`text-2xl font-pixel font-bold ${selected === 'UP' ? 'text-[#1B5E20]' : 'text-[#388E3C] group-hover:text-[#2E7D32]'}`}>
              UP
            </p>

            {submitted && prediction.correctAnswer === 'UP' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                className="absolute top-2 right-2 text-3xl"
              >
                ✅
              </motion.div>
            )}

            {submitted && selected === 'UP' && prediction.correctAnswer !== 'UP' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                className="absolute top-2 right-2 text-3xl"
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
            whileHover={!submitted ? { scale: 1.05, y: -4 } : {}}
            whileTap={!submitted ? { scale: 0.95 } : {}}
            className={`p-6 rounded-2xl border-b-8 transition-all relative overflow-hidden group
            ${selected === 'DOWN'
                ? 'bg-[#FFCDD2] border-[#C62828] shadow-lg translate-y-[-4px]'
                : 'bg-white border-[#EF9A9A] hover:border-[#E57373] shadow-sm'
              } ${submitted ? 'cursor-not-allowed opacity-90' : 'cursor-pointer'}
              ${submitted && prediction.correctAnswer === 'DOWN' ? '!bg-[#A5D6A7] !border-[#2E7D32] ring-4 ring-[#2E7D32]/30' : ''}
              ${submitted && selected === 'DOWN' && prediction.correctAnswer !== 'DOWN' ? '!bg-[#FFCDD2] !border-[#C62828]' : ''}
              `}
          >
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="text-6xl mb-4 filter drop-shadow-md"
            >
              📉
            </motion.div>
            <p className={`text-2xl font-pixel font-bold ${selected === 'DOWN' ? 'text-[#B71C1C]' : 'text-[#D32F2F] group-hover:text-[#C62828]'}`}>
              DOWN
            </p>

            {submitted && prediction.correctAnswer === 'DOWN' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                className="absolute top-2 right-2 text-3xl"
              >
                ✅
              </motion.div>
            )}

            {submitted && selected === 'DOWN' && prediction.correctAnswer !== 'DOWN' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                className="absolute top-2 right-2 text-3xl"
              >
                ❌
              </motion.div>
            )}
          </motion.button>
        </div>

        {/* Submit Button */}
        {!submitted && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={handleSubmit}
            disabled={!selected}
            whileHover={selected ? { scale: 1.02 } : {}}
            whileTap={selected ? { scale: 0.98, y: 2 } : {}}
            className={`w-full py-4 rounded-xl font-bold text-xl border-b-4 transition-all font-pixel uppercase tracking-widest shadow-xl flex items-center justify-center gap-2
              ${selected
                ? 'bg-[#FFB74D] text-[#4E342E] border-[#E65100] hover:bg-[#FFA726] active:border-b-0 active:translate-y-1'
                : 'bg-[#D7CCC8] text-[#A1887F] border-[#A1887F] cursor-not-allowed shadow-none'
              }`}
          >
            {selected ? <>Lock Prediction 🔒</> : 'Choose Direction'}
          </motion.button>
        )}

        {/* Result Message */}
        {submitted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`mt-6 p-6 rounded-xl text-center font-bold border-4 shadow-lg flex flex-col items-center gap-2
               ${isCorrect
                ? 'bg-[#E8F5E9] text-[#2E7D32] border-[#2E7D32]'
                : 'bg-[#FFEBEE] text-[#C62828] border-[#C62828]'
              }`}
          >
            <div className="text-4xl">{isCorrect ? '🎉' : '🤔'}</div>
            <div className="font-pixel text-lg">{isCorrect ? 'PREDICTION CORRECT!' : 'MARKET MOVED AGAINST YOU'}</div>
            <div className="text-sm opacity-90 font-medium">
              {isCorrect
                ? `Spot on! The price indeed went ${prediction.correctAnswer}!`
                : `The market actually went ${prediction.correctAnswer}. Keep learning!`}
            </div>
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
