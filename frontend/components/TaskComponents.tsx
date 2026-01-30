import React, { useState, useMemo } from 'react';
import { Task } from '../types';
import { Check } from 'lucide-react';
import TradingChart from './TradingChart';
import { OHLCData } from '../types';

interface TaskComponentProps {
    task: Task;
    onComplete: () => void;
}

export const QuizComponent: React.FC<TaskComponentProps> = ({ task, onComplete }) => {
    const [selected, setSelected] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    // Placeholder options logic (since we didn't define options in data yet)
    // For now, we simulate a simple interaction
    const handleCheck = () => {
        const isCorrectAnswer = selected === task.correctAnswer;
        setIsCorrect(isCorrectAnswer);

        if (isCorrectAnswer) {
            setTimeout(onComplete, 1000);
        }
    };

    return (
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 max-w-lg w-full">
            <h3 className="text-xl font-bold text-white mb-4">Quiz Challenge</h3>
            <p className="text-gray-300 mb-6">{task.challengeText}</p>

            <div className="space-y-3">
                {task.options?.map((option, idx) => (
                    <button
                        key={idx}
                        onClick={() => setSelected(option)}
                        className={`w-full p-4 rounded-lg text-left border ${selected === option ? 'border-indigo-500 bg-indigo-900/30' : 'border-gray-600 bg-gray-700 hover:bg-gray-600'} transition-all`}
                    >
                        {String.fromCharCode(65 + idx)}. {option}
                    </button>
                ))}
            </div>

            <button
                onClick={handleCheck}
                disabled={!selected}
                className={`mt-6 w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2
          ${isCorrect ? 'bg-green-600 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-500'}
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
            >
                {isCorrect ? <><Check size={20} /> Correct!</> : 'Check Answer'}
            </button>
        </div>
    );
};

export const ChartSelectComponent: React.FC<TaskComponentProps> = ({ task, onComplete }) => {
    const [status, setStatus] = useState<'idle' | 'success' | 'fail'>('idle');
    const [clickedIndex, setClickedIndex] = useState<number | null>(null);

    // Mock Data Generator
    const mockData = useMemo(() => {
        const data: OHLCData[] = [];
        let price = 10000;
        for (let i = 0; i < 20; i++) {
            const open = price;
            const close = price + (Math.random() - 0.5) * 100;
            const high = Math.max(open, close) + Math.random() * 20;
            const low = Math.min(open, close) - Math.random() * 20;
            const volume = Math.floor(Math.random() * 1000);
            data.push({ time: i, open, high, low, close, volume });
            price = close;
        }
        return data;
    }, []);

    const handleCandleClick = (idx: number) => {
        setClickedIndex(idx);
        // Simulate validation: In a real app index would be checked against task.correctRegion
        setStatus('success');
        setTimeout(onComplete, 1500);
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4">
            <div className="bg-gray-800 p-1 rounded-xl border border-gray-700 shadow-2xl relative w-full max-w-4xl">
                <div className="absolute top-4 right-4 text-xs font-mono text-gray-500 z-20">SIMULATION MODE</div>

                <TradingChart
                    data={mockData}
                    onCandleClick={handleCandleClick}
                    showSuccess={status === 'success' ? clickedIndex : null}
                />

                <div className="mt-4 pb-4 text-center">
                    <p className="text-gray-400 text-sm">{task.challengeText}</p>
                    {status === 'success' && (
                        <div className="mt-2 text-green-400 font-bold flex items-center justify-center gap-1 animate-bounce">
                            <Check size={16} /> Great job!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
