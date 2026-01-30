import React from 'react';
import { motion } from 'framer-motion';

interface LearningStepProps {
  step: {
    id: string;
    type: 'text' | 'example';
    content: string;
    emoji?: string;
  };
  index: number;
}

const LearningStep: React.FC<LearningStepProps> = ({ step, index }) => {
  const isExample = step.type === 'example';

  return (
    <motion.div
      initial={{ opacity: 0, x: -20, y: 20 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{
        duration: 0.6,
        delay: index * 0.2,
        ease: 'easeOut',
      }}
      whileHover={{ scale: 1.02, x: 5 }}
      className={`p-4 rounded-xl mb-3 border-2 transition-all ${
        isExample
          ? 'bg-amber-900/30 border-amber-500/50 shadow-lg shadow-amber-500/20'
          : 'bg-gray-700/40 border-indigo-500/30'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Emoji/Icon */}
        <motion.div
          animate={{
            y: [0, -4, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: index * 0.3,
          }}
          className="text-3xl flex-shrink-0"
        >
          {step.emoji || '📝'}
        </motion.div>

        {/* Content */}
        <div className="flex-1">
          <p className={`text-sm leading-relaxed ${
            isExample ? 'text-amber-200 font-semibold' : 'text-gray-200'
          }`}>
            {step.content}
          </p>
          {isExample && (
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: index * 0.2 + 0.4 }}
              className="h-1 bg-gradient-to-r from-amber-500 to-transparent mt-2 rounded-full origin-left"
            />
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default LearningStep;
