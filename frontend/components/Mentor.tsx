import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MentorEmotion } from '../types';

interface MentorProps {
  emotion: MentorEmotion;
  text: string;
}

const Mentor: React.FC<MentorProps> = ({ emotion, text }) => {
  const getImage = (emotion: MentorEmotion) => {
    switch (emotion) {
      case 'happy': return '/mentor/CatJoyFull.png';
      case 'alert': return '/mentor/CatShocked.png';
      case 'thinking': return '/mentor/CatNormal.png';
      case 'sad': return '/mentor/CatSad.png';
      default: return '/mentor/CatNormal.png';
    }
  };

  return (
    <div className="w-full h-full relative flex items-center gap-4 bg-parchment border-4 border-wood-dark rounded-lg p-4 shadow-pixel overflow-hidden">
      {/* Decorative Corner Screws */}
      <div className="absolute top-1 left-1 w-2 h-2 bg-wood-dark rounded-full opacity-50"></div>
      <div className="absolute top-1 right-1 w-2 h-2 bg-wood-dark rounded-full opacity-50"></div>
      <div className="absolute bottom-1 left-1 w-2 h-2 bg-wood-dark rounded-full opacity-50"></div>
      <div className="absolute bottom-1 right-1 w-2 h-2 bg-wood-dark rounded-full opacity-50"></div>

      {/* Avatar Container */}
      <div className="flex-shrink-0 w-24 h-24 bg-wood/20 border-2 border-wood-dark rounded flex items-center justify-center relative overflow-hidden">
        <motion.img
          key={emotion}
          src={getImage(emotion)}
          alt={emotion}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1, y: [0, -2, 0] }}
          transition={{
            scale: { duration: 0.3 },
            opacity: { duration: 0.3 },
            y: { repeat: Infinity, duration: 2, ease: "easeInOut" }
          }}
          className="w-full h-full object-contain filter drop-shadow-md cursor-pointer hover:scale-110 transition-transform"
        />
      </div>

      {/* Dialogue Text */}
      <div className="flex-1 h-full bg-white/40 border-2 border-wood-light/30 rounded p-3 relative font-pixel text-coffee text-sm md:text-base leading-relaxed overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={text}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <span className="mr-1">MENTOR:</span>
            {text}
          </motion.div>
        </AnimatePresence>

        {/* RPG 'Next' Indicator */}
        <motion.div
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="absolute bottom-2 right-2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-coffee"
        />
      </div>
    </div>
  );
};

export default Mentor;