import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MatchItem } from './modulesData';
import ProgressFeedback from './ProgressFeedback';

interface TaskMatchProps {
  matches: MatchItem[];
  onComplete: (isCorrect: boolean) => void;
}

// Define a palette of distinct colors for pairs
const PAIR_COLORS = [
  { bg: 'bg-blue-100', border: 'border-blue-500', dot: 'bg-blue-500', hover: 'hover:bg-blue-50' },
  { bg: 'bg-green-100', border: 'border-green-500', dot: 'bg-green-500', hover: 'hover:bg-green-50' },
  { bg: 'bg-purple-100', border: 'border-purple-500', dot: 'bg-purple-500', hover: 'hover:bg-purple-50' },
  { bg: 'bg-orange-100', border: 'border-orange-500', dot: 'bg-orange-500', hover: 'hover:bg-orange-50' },
  { bg: 'bg-pink-100', border: 'border-pink-500', dot: 'bg-pink-500', hover: 'hover:bg-pink-50' },
];

const TaskMatch: React.FC<TaskMatchProps> = ({ matches, onComplete }) => {
  const [connections, setConnections] = useState<{ [key: string]: string }>({});
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Shuffle right items
  const rightItems = useMemo(() => {
    const items = [...matches];
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    return items;
  }, [matches]);

  const handleLeftClick = (id: string) => {
    if (submitted) return;
    if (connections[id]) {
      setSelectedLeft(id);
    } else {
      setSelectedLeft(id === selectedLeft ? null : id);
    }
  };

  const handleRightClick = (rightId: string) => {
    if (submitted) return;

    if (selectedLeft) {
      // Remove any existing connection to this rightId from other lefts
      setConnections(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(key => {
          if (next[key] === rightId) delete next[key];
        });
        next[selectedLeft] = rightId;
        return next;
      });
      setSelectedLeft(null);
    } else {
      // Disconnect if clicking a connected right item directly
      const entries = Object.entries(connections);
      const linkedLeft = entries.find(([_, rId]) => rId === rightId)?.[0];
      if (linkedLeft) {
        setConnections(prev => {
          const next = { ...prev };
          delete next[linkedLeft];
          return next;
        });
      }
    }
  };

  const handleSubmit = () => {
    const allConnected = matches.every(match => connections[match.id]);
    if (!allConnected) return;

    const correct = matches.every(match => {
      const connectedRightId = connections[match.id];
      const rightItem = rightItems.find(item => item.id === connectedRightId);
      return rightItem && rightItem.id === match.id;
    });

    setIsCorrect(correct);
    setSubmitted(true);
  };

  const handleFeedbackComplete = React.useCallback(() => {
    onComplete(isCorrect);
    if (!isCorrect) {
      setSubmitted(false);
      setConnections({});
      setIsCorrect(false);
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
        {/* Helper Text */}
        <div className="mb-4 text-center">
          {selectedLeft ? (
            <p className="text-[#E65100] font-bold text-sm bg-[#FFF3E0] inline-block px-3 py-1 rounded-full border border-[#FFCC80] animate-pulse">
              👇 Now tap the matching item on the right!
            </p>
          ) : (
            <p className="text-[#8D6E63] font-bold text-sm bg-[#EFEBE9] inline-block px-3 py-1 rounded-full border border-[#D7CCC8]">
              💡 Tap a left item, then tap its match on the right.
            </p>
          )}
        </div>

        {/* Matching Container */}
        <div className="grid grid-cols-2 gap-4 md:gap-12 mb-6 relative min-h-[300px]">
          {/* Center Connection Line (Visual Only) */}
          <div className="absolute left-1/2 top-4 bottom-4 w-1 bg-[#D7CCC8]/30 -translate-x-1/2 rounded-full hidden md:block"></div>

          {/* Left Column */}
          <div className="space-y-4 flex flex-col justify-center">
            {matches.map((match, index) => {
              const isSelected = selectedLeft === match.id;
              const isConnected = !!connections[match.id];
              const color = PAIR_COLORS[index % PAIR_COLORS.length]; // Assign color by index

              return (
                <motion.div
                  key={match.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                >
                  <motion.button
                    onClick={() => handleLeftClick(match.id)}
                    whileHover={!submitted ? { scale: 1.02, x: 4 } : {}}
                    whileTap={!submitted ? { scale: 0.98 } : {}}
                    disabled={submitted}
                    className={`w-full p-4 rounded-xl transition-all border-b-4 relative z-10 font-bold text-[#4E342E] group text-left
                      ${isSelected
                        ? `${color.bg} ${color.border} ring-2 ring-opacity-50 translate-x-2` // Selected State
                        : isConnected
                          ? `${color.bg} ${color.border}` // Connected State
                          : `bg-white border-[#BCAAA4] hover:bg-[#F5F5F5]` // Default
                      }
                      ${submitted && isConnected && isCorrect ? '!bg-[#C8E6C9] !border-[#2E7D32]' : ''}
                      ${submitted && !isCorrect && isConnected ? '!bg-[#FFCDD2] !border-[#C62828]' : ''}
                      `}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl w-8 text-center">{match.emoji || '📌'}</div>
                      <span className="text-sm font-pixel leading-tight">{match.left}</span>
                    </div>

                    {/* Connector Dot Right */}
                    <div className={`absolute right-[-6px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-[#5D4037] transition-colors
                           ${isConnected || isSelected ? color.dot : 'bg-[#D7CCC8] group-hover:bg-[#BCAAA4]'}
                      `}></div>
                  </motion.button>
                </motion.div>
              );
            })}
          </div>

          {/* Right Column */}
          <div className="space-y-4 flex flex-col justify-center">
            {rightItems.map((item, index) => {
              // Find if this right item is targeted by any connection
              const connectedLeftId = Object.keys(connections).find(key => connections[key] === item.id);

              // Find the index of the connected left item to get the color
              const leftIndex = matches.findIndex(m => m.id === connectedLeftId);
              const color = leftIndex !== -1 ? PAIR_COLORS[leftIndex % PAIR_COLORS.length] : null;

              // Check if we are selecting a left item that corresponds to this right item's pair (for hinting)? No, that gives it away.

              const isConnected = !!connectedLeftId;
              const isSelectedLeftColor = selectedLeft ? PAIR_COLORS[matches.findIndex(m => m.id === selectedLeft) % PAIR_COLORS.length] : null;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                >
                  <motion.button
                    onClick={() => handleRightClick(item.id)}
                    whileHover={!submitted ? { scale: 1.02, x: -4 } : {}}
                    whileTap={!submitted ? { scale: 0.98 } : {}}
                    disabled={submitted}
                    className={`w-full p-4 rounded-xl transition-all border-b-4 relative z-10 font-bold text-[#4E342E] text-left group
                        ${isConnected && color
                        ? `${color.bg} ${color.border}` // Connected
                        : selectedLeft && isSelectedLeftColor
                          ? `bg-white border-[#BCAAA4] ${isSelectedLeftColor.hover} cursor-pointer` // Waiting for selection
                          : 'bg-[#ECEFF1] border-[#CFD8DC] text-opacity-60' // Idle/Waiting
                      }
                        ${submitted && isConnected && isCorrect ? '!bg-[#C8E6C9] !border-[#2E7D32]' : ''}
                        ${submitted && isConnected && !isCorrect ? '!bg-[#FFCDD2] !border-[#C62828]' : ''}
                     `}
                  >
                    {/* Connector Dot Left */}
                    <div className={`absolute left-[-6px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-[#5D4037] transition-colors
                        ${isConnected && color ? color.dot : 'bg-[#CFD8DC] group-hover:bg-[#BCAAA4]'}
                    `}></div>

                    <div className="flex items-center gap-3">
                      {/* Maybe show emoji again? Or just text. Right usually has long text. */}
                      <span className="text-sm font-pixel leading-tight">{item.right}</span>
                    </div>
                  </motion.button>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Submit Button */}
        {!submitted && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            onClick={handleSubmit}
            disabled={Object.keys(connections).length < matches.length}
            whileHover={Object.keys(connections).length === matches.length ? { scale: 1.02 } : {}}
            whileTap={Object.keys(connections).length === matches.length ? { scale: 0.98 } : {}}
            className={`w-full py-4 rounded-xl font-bold text-xl border-b-4 transition-all font-pixel uppercase tracking-widest shadow-xl flex items-center justify-center gap-2
              ${Object.keys(connections).length === matches.length
                ? 'bg-[#FFEB3B] text-[#3E2723] border-[#FBC02D] hover:bg-[#FDD835] active:border-b-0 active:translate-y-1'
                : 'bg-[#D7CCC8] text-[#A1887F] border-[#A1887F] cursor-not-allowed shadow-none'
              }`}
          >
            {Object.keys(connections).length === matches.length ? 'VERIFY MATCHES ⚡' : 'CONNECT ALL PAIRS'}
          </motion.button>
        )}

        {/* Result Message */}
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
            <div className="text-4xl">{isCorrect ? '✨' : '💥'}</div>
            <div className="font-pixel text-lg">{isCorrect ? 'PERFECT MATCH!' : 'MISMATCH DETECTED'}</div>
            <div className="text-sm opacity-90 font-medium">
              {isCorrect ? 'Everything is connected perfectly.' : 'Some wires are crossed. Try again!'}
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

export default TaskMatch;
