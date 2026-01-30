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
            {/* Instruction Banner */}
            <div className="bg-[#5D4037] text-[#FFE0B2] px-6 py-3 rounded-xl mb-6 text-sm md:text-base font-bold font-pixel border-2 border-[#8D6E63] shadow-md flex items-center gap-2">
                <span>🎯</span>
                {instruction}
            </div>

            <motion.div
                className={`w-full bg-[#FFF8E1] rounded-2xl p-4 border-4 transition-all duration-300 relative shadow-inner
                    ${feedback === 'success' ? 'border-[#2E7D32] shadow-[0_0_0_4px_rgba(46,125,50,0.2)]' :
                        feedback === 'error' ? 'border-[#C62828] shadow-[0_0_0_4px_rgba(198,40,40,0.2)]' :
                            'border-[#8D6E63]'
                    }`}
                animate={feedback === 'error' ? { x: [-5, 5, -5, 5, 0] } : {}}
                transition={{ duration: 0.4 }}
            >
                {/* Chart Container - Paper Texture Look */}
                <div className="bg-white rounded-xl border border-[#D7CCC8] p-2 overflow-hidden">
                    <CandleChart
                        data={data}
                        height={350}
                        onCandleClick={handleCandleClick}
                    />
                </div>

                {/* Overlay for feedback icon */}
                {feedback && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                        <motion.div
                            initial={{ scale: 0, opacity: 0, rotate: -45 }}
                            animate={{ scale: 1, opacity: 1, rotate: 0 }}
                            exit={{ scale: 0, opacity: 0 }}
                            className="text-8xl filter drop-shadow-xl"
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
