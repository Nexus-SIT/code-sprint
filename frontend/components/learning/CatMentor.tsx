import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface CatMentorProps {
  message: string;
  position: 'left' | 'center' | 'right';
  isTyping: boolean;
  onTypingComplete: () => void;
}

const CatMentor: React.FC<CatMentorProps> = ({
  message,
  position,
  isTyping,
  onTypingComplete,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  // Position mapping - FIXED, NO RANDOMNESS
  const positionMap = {
    left: { x: '-40%', alignItems: 'flex-start' },
    center: { x: '0%', alignItems: 'center' },
    right: { x: '40%', alignItems: 'flex-end' },
  };

  const currentPosition = positionMap[position];

  // Typing animation
  useEffect(() => {
    if (!isTyping) {
      setDisplayedText(message);
      setShowCursor(false);
      onTypingComplete();
      return;
    }

    setDisplayedText('');
    setShowCursor(true);
    let currentIndex = 0;
    const characters = message.split('');

    const interval = setInterval(() => {
      if (currentIndex < characters.length) {
        setDisplayedText(characters.slice(0, currentIndex + 1).join(''));
        currentIndex++;
      } else {
        clearInterval(interval);
        setShowCursor(false);
        setTimeout(() => onTypingComplete(), 300);
      }
    }, 40); // 40ms per letter

    return () => clearInterval(interval);
  }, [message, isTyping, onTypingComplete]);

  // Blinking cursor
  useEffect(() => {
    if (!showCursor) return;
    const blink = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    return () => clearInterval(blink);
  }, [showCursor]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.6, type: 'spring', bounce: 0.3 }}
      style={{
        display: 'flex',
        justifyContent: currentPosition.alignItems,
        width: '100%',
        gap: '1rem',
      }}
    >
      {/* Cat Character */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          fontSize: '4rem',
          flexShrink: 0,
        }}
      >
        🐱
      </motion.div>

      {/* Speech Bubble */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        style={{
          backgroundColor: 'rgba(30, 130, 200, 0.15)',
          border: '2px solid #1E82C8',
          borderRadius: '1.5rem',
          padding: '1.2rem 1.5rem',
          maxWidth: '28rem',
          position: 'relative',
        }}
      >
        {/* Pointer tail */}
        <div
          style={{
            position: 'absolute',
            bottom: '-0.8rem',
            left: '1.5rem',
            width: '0',
            height: '0',
            borderLeft: '0.8rem solid transparent',
            borderRight: '0rem solid transparent',
            borderTop: '0.8rem solid #1E82C8',
          }}
        />

        {/* Text content */}
        <p
          style={{
            fontSize: '1rem',
            lineHeight: '1.6',
            color: '#fff',
            margin: 0,
            fontFamily: 'inherit',
            fontWeight: 500,
          }}
        >
          {displayedText}
          {showCursor && <span style={{ marginLeft: '0.2rem' }}>▌</span>}
        </p>
      </motion.div>
    </motion.div>
  );
};

export default CatMentor;
