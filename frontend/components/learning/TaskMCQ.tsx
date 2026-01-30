import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MCQOption } from './modulesData';
import ProgressFeedback from './ProgressFeedback';

interface TaskMCQProps {
  question: string;
  options: MCQOption[];
  onComplete: (isCorrect: boolean) => void;
}

const TaskMCQ: React.FC<TaskMCQProps> = ({ question, options, onComplete }) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSelect = (optionId: string) => {
    if (!submitted) {
      setSelected(optionId);
    }
  };

  const handleSubmit = () => {
    if (!selected) return;

    const selectedOption = options.find(opt => opt.id === selected);
    const correct = selectedOption?.isCorrect || false;

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
        {/* Question Area - Hidden generally as it's shown above, but we keep this container clean */}

        {/* Options */}
        <div className="space-y-4 mb-8">
          {options.map((option, index) => (
            <motion.button
              key={option.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              onClick={() => handleSelect(option.id)}
              disabled={submitted}
              whileHover={!submitted ? { scale: 1.02, x: 4 } : {}}
              whileTap={!submitted ? { scale: 0.98 } : {}}
              className={`w-full p-4 rounded-xl border-4 text-left transition-all relative overflow-hidden group font-pixel text-sm md:text-base tracking-wide
              ${selected === option.id
                  ? 'bg-[#EFEBE9] border-[#5D4037] shadow-[4px_4px_0_#3E2723]'
                  : 'bg-white border-[#A1887F] hover:border-[#8D6E63] shadow-[4px_4px_0_#D7CCC8]'
                } ${submitted ? 'cursor-not-allowed opacity-90' : 'cursor-pointer'}
              ${submitted && option.isCorrect
                  ? '!bg-[#C8E6C9] !border-[#2E7D32] !shadow-[4px_4px_0_#1B5E20]' // Green override
                  : ''
                }
              ${submitted && !option.isCorrect && selected === option.id
                  ? '!bg-[#FFCDD2] !border-[#C62828] !shadow-[4px_4px_0_#B71C1C]' // Red override
                  : ''
                }`}
            >
              <div className="flex items-center gap-4 relative z-10">
                {/* Option ID/Index Box */}
                <div className={`w-10 h-10 flex items-center justify-center rounded-lg border-2 font-bold text-xl
                    ${selected === option.id ? 'bg-[#5D4037] text-[#FFE0B2] border-[#3E2723]' : 'bg-[#F5F5F5] text-[#8D6E63] border-[#D7CCC8]'}
                    ${submitted && option.isCorrect ? '!bg-[#2E7D32] !text-white !border-[#1B5E20]' : ''}
                    ${submitted && !option.isCorrect && selected === option.id ? '!bg-[#C62828] !text-white !border-[#B71C1C]' : ''}
                 `}>
                  {option.emoji || String.fromCharCode(65 + index)}
                </div>

                <span className={`font-bold flex-1 ${selected === option.id ? 'text-[#3E2723]' : 'text-[#6D4C41]'}`}>
                  {option.text}
                </span>

                {submitted && option.isCorrect && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, rotate: [0, 20, 0] }}
                    className="text-2xl"
                  >
                    ✅
                  </motion.span>
                )}
                {submitted && !option.isCorrect && selected === option.id && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, x: [0, 5, -5, 0] }}
                    className="text-2xl"
                  >
                    ❌
                  </motion.span>
                )}
              </div>
            </motion.button>
          ))}
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
            {selected ? <>Submit Answer 🚀</> : 'Select an Option'}
          </motion.button>
        )}

        {/* Success/Failure Message */}
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
            <div className="font-pixel text-lg">{isCorrect ? 'CORRECT!' : 'INCORRECT'}</div>
            <div className="text-sm opacity-90 font-medium">
              {isCorrect ? 'Great job! You\'re getting the hang of it.' : 'Don\'t worry, review the mentor\'s advice and try again!'}
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

export default TaskMCQ;
