import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Candle } from '../../types';
import CandleChart from '../CandleChart';

interface TaskChartProps {
    data: Candle[];
    correctIndices: number[];
    onAnswer: (isCorrect: boolean) => void;
    instruction?: string;
}

const TaskChart: React.FC<TaskChartProps> = ({
    data,
    correctIndices,
    onAnswer,
    instruction = "Click the correct candle on the chart!"
}) => {
    const [feedback, setFeedback] = useState<'success' | 'error' | null>(null);

    const handleCandleClick = (index: number) => {
        if (feedback === 'success') return; // Prevent multiple clicks after success

        const isCorrect = correctIndices.includes(index);
        setFeedback(isCorrect ? 'success' : 'error');

        if (isCorrect) {
            onAnswer(true);
        } else {
            onAnswer(false);
            // Reset feedback after a short delay so user can try again
            setTimeout(() => setFeedback(null), 1000);
        }
    };

    return (
        <div className="w-full flex flex-col items-center">
            <div className="bg-wood-dark/50 p-2 rounded-lg mb-4 text-parchment font-pixel text-sm border border-wood-light/30">
                {instruction}
            </div>

            <motion.div
                className={`w-full bg-gray-900/50 rounded-xl p-4 border-2 transition-colors duration-300 relative ${feedback === 'success' ? 'border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]' :
                    feedback === 'error' ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]' :
                        'border-gray-700'
                    }`}
                animate={feedback === 'error' ? { x: [-5, 5, -5, 5, 0] } : {}}
                transition={{ duration: 0.4 }}
            >
                <CandleChart
                    data={data}
                    height={300}
                    onCandleClick={handleCandleClick}
                />

                {/* Overlay for feedback icon */}
                {feedback && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            className="text-6xl filter drop-shadow-md"
                        >
                            {feedback === 'success' ? '✅' : '❌'}
                        </motion.div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default TaskChart;
