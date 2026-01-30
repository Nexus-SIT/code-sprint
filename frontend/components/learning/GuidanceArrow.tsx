import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

interface GuidanceArrowProps {
  show: boolean;
  label?: string;
}

const GuidanceArrow: React.FC<GuidanceArrowProps> = ({ show, label = 'Click to attempt!' }) => {
  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center gap-2 my-4"
    >
      {/* Arrow with glow */}
      <motion.div
        animate={{
          y: [0, 8, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="relative"
      >
        {/* Glow background */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.6, 0.3, 0.6],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
          }}
          className="absolute inset-0 bg-indigo-500/50 rounded-full blur-xl -z-10"
        />
        
        <ArrowDown 
          size={48} 
          className="text-indigo-400 drop-shadow-lg"
          strokeWidth={3}
        />
      </motion.div>

      {/* Label */}
      <motion.div
        animate={{
          opacity: [1, 0.6, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
        }}
        className="text-center"
      >
        <p className="text-indigo-300 font-bold text-sm">{label}</p>
        <p className="text-gray-400 text-xs">Ready for the challenge? 🎯</p>
      </motion.div>
    </motion.div>
  );
};

export default GuidanceArrow;
