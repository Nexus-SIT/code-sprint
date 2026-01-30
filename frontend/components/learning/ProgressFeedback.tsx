import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface ProgressFeedbackProps {
  isCorrect: boolean;
  onComplete?: () => void;
  delay?: number;
}

const ProgressFeedback: React.FC<ProgressFeedbackProps> = ({ 
  isCorrect, 
  onComplete,
  delay = 0
}) => {
  useEffect(() => {
    if (onComplete) {
      const timer = setTimeout(onComplete, 2000 + delay);
      return () => clearTimeout(timer);
    }
  }, [onComplete, delay]);

  if (isCorrect) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay, type: 'spring', stiffness: 300, damping: 10 }}
        className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
      >
        {/* Success Glow */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.8, 0.4, 0],
          }}
          transition={{
            duration: 1.5,
            delay,
          }}
          className="absolute w-48 h-48 bg-green-400/30 rounded-full blur-3xl"
        />

        {/* Check Icon */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 0.8,
            delay: delay + 0.2,
          }}
          className="relative z-10 text-8xl drop-shadow-2xl"
        >
          ✅
        </motion.div>

        {/* Success Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + 0.3 }}
          className="absolute text-center text-green-300 font-bold"
        >
          <div className="text-3xl">Correct! 🎉</div>
          <div className="text-xl mt-2">+100 Points</div>
        </motion.div>

        {/* Floating Confetti-like particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: 0,
              y: 0,
              opacity: 1,
              scale: 1,
            }}
            animate={{
              x: Math.cos((i / 8) * Math.PI * 2) * 100,
              y: -150,
              opacity: 0,
              scale: 0,
            }}
            transition={{
              duration: 1.5,
              delay: delay + 0.1 + i * 0.05,
              ease: 'easeOut',
            }}
            className="absolute w-3 h-3 bg-yellow-300 rounded-full"
          />
        ))}
      </motion.div>
    );
  }

  // Wrong Answer - Shake & Glow Red
  return (
    <motion.div
      animate={{ x: [-10, 10, -10, 0] }}
      transition={{
        duration: 0.4,
        delay,
      }}
      className="fixed inset-0 pointer-events-none z-50"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay }}
        className="fixed inset-0 flex items-center justify-center"
      >
        {/* Wrong Glow */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.6, 0.3, 0],
          }}
          transition={{
            duration: 1,
            delay,
          }}
          className="absolute w-40 h-40 bg-red-400/40 rounded-full blur-3xl"
        />

        {/* X Icon */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 0.6,
            delay: delay + 0.1,
          }}
          className="relative z-10 text-7xl drop-shadow-2xl"
        >
          ❌
        </motion.div>

        {/* Try Again Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.2 }}
          className="absolute text-center text-red-300 font-bold"
        >
          <div className="text-2xl">Try Again!</div>
          <div className="text-sm mt-1">Don't worry, learning takes practice 💪</div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ProgressFeedback;
