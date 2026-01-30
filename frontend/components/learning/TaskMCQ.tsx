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

  const handleFeedbackComplete = () => {
    onComplete(isCorrect);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gray-800/50 border-2 border-indigo-500/40 rounded-2xl p-6 backdrop-blur-sm"
      >
        {/* Question */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <h3 className="text-xl font-bold text-indigo-300 mb-2">🎯 Your Task</h3>
          <p className="text-lg text-gray-100">{question}</p>
        </motion.div>

        {/* Options */}
        <div className="space-y-3 mb-6">
          {options.map((option, index) => (
            <motion.button
              key={option.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              onClick={() => handleSelect(option.id)}
              disabled={submitted}
              whileHover={!submitted ? { scale: 1.02, x: 8 } : {}}
              whileTap={!submitted ? { scale: 0.98 } : {}}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all transform ${
                selected === option.id
                  ? 'bg-indigo-600/40 border-indigo-400 shadow-lg shadow-indigo-500/30'
                  : 'bg-gray-700/30 border-gray-600/40 hover:border-indigo-500/50'
              } ${submitted ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}
              ${
                submitted && option.isCorrect
                  ? 'bg-green-600/40 border-green-400'
                  : ''
              }
              ${
                submitted && !option.isCorrect && selected === option.id
                  ? 'bg-red-600/40 border-red-400'
                  : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{option.emoji || '•'}</span>
                <span className="text-gray-100 font-medium">{option.text}</span>
                {submitted && option.isCorrect && (
                  <motion.span
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 0.6 }}
                    className="ml-auto text-xl"
                  >
                    ✅
                  </motion.span>
                )}
                {submitted && !option.isCorrect && selected === option.id && (
                  <motion.span
                    animate={{ x: [-5, 5, -5, 0] }}
                    transition={{ duration: 0.4 }}
                    className="ml-auto text-xl"
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            onClick={handleSubmit}
            disabled={!selected}
            whileHover={selected ? { scale: 1.05 } : {}}
            whileTap={selected ? { scale: 0.95 } : {}}
            className={`w-full py-3 rounded-xl font-bold text-lg transition-all ${
              selected
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-black hover:shadow-lg hover:shadow-green-500/50 cursor-pointer'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50'
            }`}
          >
            Submit Answer 🚀
          </motion.button>
        )}

        {/* Success/Failure Message */}
        {submitted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            className={`mt-4 p-4 rounded-xl text-center font-bold text-lg ${
              isCorrect
                ? 'bg-green-600/30 text-green-300 border border-green-500'
                : 'bg-red-600/30 text-red-300 border border-red-500'
            }`}
          >
            {isCorrect ? '🎉 Awesome! You got it right!' : '💡 Oops! That\'s not quite right. Learn more and try again!'}
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
