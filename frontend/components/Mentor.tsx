import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MentorEmotion } from '../types';

interface MentorProps {
  emotion: MentorEmotion;
  text: string;
}

const Mentor: React.FC<MentorProps> = ({ emotion, text }) => {
  const [isMouthOpen, setIsMouthOpen] = React.useState(false);

  React.useEffect(() => {
    // Only animate mouth if text is present and emotion involves "talking" (thinking/neutral generally)
    // We avoid animating for happy/sad/alert as they might have specific fixed expressions, 
    // but user request implies general talking. Let's limit to neutral/thinking for now as requested.
    if (text && (emotion === 'thinking' || emotion === 'neutral')) {
      const interval = setInterval(() => {
        setIsMouthOpen(prev => !prev);
      }, 200); // Toggle every 200ms
      return () => clearInterval(interval);
    } else {
      setIsMouthOpen(false);
    }
  }, [text, emotion]);

  const getImage = (emotion: MentorEmotion) => {
    switch (emotion) {
      case 'happy': return '/mentor/CatJoyFull.png';
      case 'alert': return '/mentor/CatShocked.png';
      case 'sad': return '/mentor/CatSad.png';
      case 'thinking':
      default:
        // Use CatNormalOpen.png when mouth should be open
        return isMouthOpen ? '/mentor/cat-normal-open.png' : '/mentor/cat-normal-closed.png';
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
          key={emotion} // Key change triggers re-render but we want smooth transition.
          // Actually, standard img src change is fast enough. 
          // Framer motion key might cause full unmount/remount flicker which is good for expression change but maybe not for talking.
          // Let's keep key as just emotion for big changes, but for talking we rely on src update.
          // Wait, if I change key to just 'emotion', motion.img will handle src swap.
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