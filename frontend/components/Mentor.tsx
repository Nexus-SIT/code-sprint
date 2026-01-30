import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MentorEmotion } from '../types';

interface MentorProps {
  emotion: MentorEmotion;
  text: string;
}

const Mentor: React.FC<MentorProps> = ({ emotion, text }) => {
  const getEmoji = (emotion: MentorEmotion) => {
    switch (emotion) {
      case 'happy': return '😸';
      case 'alert': return '🙀';
      case 'thinking': return '😼';
      default: return '😺';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute top-4 right-4 z-20 flex flex-col items-end max-w-xs pointer-events-none"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={text}
          initial={{ opacity: 0, scale: 0.8, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.8, x: 20 }}
          className="bg-white text-gray-900 p-4 rounded-2xl rounded-tr-none shadow-lg mb-2 border-2 border-indigo-500 relative"
        >
           <p className="text-sm font-semibold">{text}</p>
        </motion.div>
      </AnimatePresence>
      
      <motion.div 
        animate={{ y: [0, -5, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="text-6xl filter drop-shadow-xl"
      >
        {getEmoji(emotion)}
      </motion.div>
    </motion.div>
  );
};

export default Mentor;