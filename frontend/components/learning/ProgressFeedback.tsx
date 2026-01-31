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
        className="fixed inset-0 flex flex-col items-center justify-center pointer-events-none z-50 bg-black/20 backdrop-blur-sm"
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
          className="absolute w-64 h-64 bg-green-400/30 rounded-full blur-3xl z-0"
        />

        {/* Check Icon - Using Pixel Style Container */}
        <motion.div
          animate={{
            y: [0, -10, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 0.8,
            delay: delay + 0.2,
          }}
          className="relative z-10 mb-6"
        >
          <div className="bg-green-500 border-4 border-green-800 w-24 h-24 flex items-center justify-center rounded-xl shadow-[6px_6px_0_rgba(20,83,45,0.8)]">
            <span className="text-6xl text-white drop-shadow-md">✓</span>
          </div>
        </motion.div>

        {/* Success Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + 0.3 }}
          className="relative z-10 text-center"
        >
          <div className="text-4xl text-[#4CAF50] font-pixel uppercase tracking-widest text-shadow-sm stroke-black bg-white/90 px-6 py-2 rounded-lg border-2 border-green-500 shadow-lg">
            Correct!
          </div>
          {/* <div className="text-xl mt-3 text-white font-bold font-pixel tracking-wider drop-shadow-md bg-orange-500/90 px-4 py-1 rounded-full border-2 border-orange-700 mx-auto inline-block">
            +100 Points
          </div> */}
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
              x: Math.cos((i / 8) * Math.PI * 2) * 150,
              y: Math.sin((i / 8) * Math.PI * 2) * 150,
              opacity: 0,
              scale: 0,
            }}
            transition={{
              duration: 1.5,
              delay: delay + 0.1 + i * 0.05,
              ease: 'easeOut',
            }}
            className="absolute w-4 h-4 bg-yellow-400 border border-yellow-600 shadow-sm"
          />
        ))}
      </motion.div>
    );
  }

  // Wrong Answer - Shake & Glow Red
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: 'spring', stiffness: 300, damping: 10 }}
      className="fixed inset-0 flex flex-col items-center justify-center pointer-events-none z-50 bg-black/20 backdrop-blur-sm"
    >
      {/* Wrong Glow */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.8, 0.4, 0],
        }}
        transition={{
          duration: 1.5,
          delay,
        }}
        className="absolute w-64 h-64 bg-red-400/30 rounded-full blur-3xl z-0"
      />

      {/* X Icon - Using Pixel Style Container */}
      <motion.div
        animate={{
          x: [-10, 10, -10, 0],
          rotate: [0, -5, 5, 0],
        }}
        transition={{
          duration: 0.5,
          delay: delay + 0.2,
        }}
        className="relative z-10 mb-6"
      >
        <div className="bg-red-500 border-4 border-red-800 w-24 h-24 flex items-center justify-center rounded-xl shadow-[6px_6px_0_rgba(153,27,27,0.8)]">
          <span className="text-6xl text-white drop-shadow-md">✕</span>
        </div>
      </motion.div>

      {/* Try Again Text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: delay + 0.3 }}
        className="relative z-10 text-center"
      >
        <div className="text-4xl text-[#D32F2F] font-pixel uppercase tracking-widest text-shadow-sm stroke-black bg-white/90 px-6 py-2 rounded-lg border-2 border-red-500 shadow-lg">
          TRY AGAIN!
        </div>
        <div className="mt-4 text-sm font-bold text-white bg-red-900/80 px-4 py-1 rounded-full border border-red-400 backdrop-blur-md inline-block">
          Don't worry, learning takes practice 💪
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProgressFeedback;
