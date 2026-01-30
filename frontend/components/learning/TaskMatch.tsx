import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MatchItem } from './modulesData';
import ProgressFeedback from './ProgressFeedback';

interface TaskMatchProps {
  matches: MatchItem[];
  onComplete: (isCorrect: boolean) => void;
}

const TaskMatch: React.FC<TaskMatchProps> = ({ matches, onComplete }) => {
  const [connections, setConnections] = useState<{ [key: string]: string }>({});
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

  const handleConnect = (leftId: string, rightId: string) => {
    if (!submitted) {
      setConnections(prev => ({
        ...prev,
        [leftId]: rightId,
      }));
    }
  };

  const handleSubmit = () => {
    const allConnected = matches.every(match => connections[match.id]);
    if (!allConnected) return;

    const correct = matches.every(match => {
      const connectedRightId = connections[match.id];
      const rightItem = rightItems.find(item => item.id === connectedRightId);
      return rightItem && rightItem.left === match.left;
    });

    setIsCorrect(correct);
    setSubmitted(true);
  };

  const handleFeedbackComplete = () => {
    onComplete(isCorrect);
    if (!isCorrect) {
      setSubmitted(false);
      setConnections({});
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gray-800/50 border-2 border-indigo-500/40 rounded-2xl p-6 backdrop-blur-sm"
      >
        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <h3 className="text-xl font-bold text-indigo-300 mb-2">🎯 Match the Pairs</h3>
          <p className="text-sm text-gray-300">Click on the left item and then the right item to connect them</p>
        </motion.div>

        {/* Matching Container */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Left Column */}
          <div className="space-y-3">
            {matches.map((match, index) => (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <motion.button
                  onClick={() => {
                    // Show available right items
                    const unmatched = rightItems.filter(r =>
                      !Object.values(connections).includes(r.id) ||
                      connections[match.id] === r.id
                    );
                    // Auto-highlight first unmatched
                    if (unmatched.length > 0) {
                      handleConnect(match.id, unmatched[0].id);
                    }
                  }}
                  whileHover={!submitted ? { scale: 1.05 } : {}}
                  whileTap={!submitted ? { scale: 0.95 } : {}}
                  className={`w-full p-3 rounded-lg text-left transition-all border-2 ${connections[match.id]
                      ? 'bg-indigo-600/40 border-indigo-400'
                      : 'bg-gray-700/30 border-gray-600/40 hover:border-indigo-500/50'
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{match.emoji || '📌'}</span>
                    <span className="text-sm font-medium text-gray-100">{match.left}</span>
                  </div>
                </motion.button>
              </motion.div>
            ))}
          </div>

          {/* Right Column */}
          <div className="space-y-3">
            {rightItems.map((item, index) => {
              const isConnected = Object.values(connections).includes(item.id);
              const connectedLeft = Object.entries(connections).find(
                ([_, rightId]) => rightId === item.id
              )?.[0];

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <motion.button
                    onClick={() => {
                      if (connectedLeft) {
                        handleConnect(connectedLeft, '');
                      }
                    }}
                    whileHover={!submitted && isConnected ? { scale: 1.05 } : {}}
                    whileTap={!submitted && isConnected ? { scale: 0.95 } : {}}
                    disabled={!isConnected && submitted}
                    className={`w-full p-3 rounded-lg text-left transition-all border-2 ${isConnected
                        ? 'bg-emerald-600/40 border-emerald-400 cursor-pointer'
                        : 'bg-gray-700/20 border-gray-600/30 opacity-50'
                      }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{item.emoji || '📌'}</span>
                      <span className="text-sm font-medium text-gray-100">{item.right}</span>
                    </div>
                  </motion.button>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Connection Display */}
        {Object.keys(connections).length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gray-700/30 p-3 rounded-lg mb-6 text-sm text-gray-300"
          >
            <p className="font-semibold text-indigo-300 mb-2">Connections:</p>
            <div className="space-y-1">
              {matches.map(match => {
                const connectedId = connections[match.id];
                const connectedRight = rightItems.find(r => r.id === connectedId);
                if (connectedRight) {
                  return (
                    <motion.div
                      key={match.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-2 text-xs"
                    >
                      <span className="text-indigo-400">{match.left}</span>
                      <span className="text-gray-500">→</span>
                      <span className="text-emerald-400">{connectedRight.right}</span>
                    </motion.div>
                  );
                }
                return null;
              })}
            </div>
          </motion.div>
        )}

        {/* Submit Button */}
        {!submitted && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            onClick={handleSubmit}
            disabled={Object.keys(connections).length < matches.length}
            whileHover={Object.keys(connections).length === matches.length ? { scale: 1.05 } : {}}
            whileTap={Object.keys(connections).length === matches.length ? { scale: 0.95 } : {}}
            className={`w-full py-3 rounded-xl font-bold text-lg transition-all ${Object.keys(connections).length === matches.length
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-black hover:shadow-lg hover:shadow-green-500/50 cursor-pointer'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50'
              }`}
          >
            Check Matches 🎯
          </motion.button>
        )}

        {/* Result Message */}
        {submitted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            className={`mt-4 p-4 rounded-xl text-center font-bold text-lg ${isCorrect
                ? 'bg-green-600/30 text-green-300 border border-green-500'
                : 'bg-red-600/30 text-red-300 border border-red-500'
              }`}
          >
            {isCorrect ? '🎉 Perfect matches!' : '💡 Not quite right. Try again!'}
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
