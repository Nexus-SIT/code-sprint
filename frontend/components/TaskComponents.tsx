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

export const WaitComponent: React.FC<TaskComponentProps> = ({ task, onComplete }) => {
    const [timeLeft, setTimeLeft] = useState(5);
    const [status, setStatus] = useState<'idle' | 'waiting' | 'failed' | 'success'>('idle');

    const startWait = () => {
        setStatus('waiting');
        setTimeLeft(5);
    };

    React.useEffect(() => {
        if (status === 'waiting') {
            if (timeLeft > 0) {
                const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
                return () => clearTimeout(timer);
            } else {
                setStatus('success');
                setTimeout(onComplete, 1000);
            }
        }
    }, [status, timeLeft, onComplete]);

    // Fail if user clicks 'Action' during wait
    const handleActionClick = () => {
        if (status === 'waiting') {
            setStatus('failed');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-8 bg-gray-900 rounded-xl border border-gray-700 shadow-2xl max-w-md w-full text-center">
            <h3 className="text-2xl font-bold mb-4 text-indigo-400">Psychology Test</h3>
            <p className="text-gray-400 mb-8">{task.challengeText || "Do NOT take any action. Wait for the setup."}</p>

            <div className="relative w-48 h-48 mb-8 flex items-center justify-center bg-black rounded-full border-4 border-gray-800">
                {status === 'waiting' && (
                    <div className="absolute inset-0 rounded-full border-4 border-indigo-500 animate-spin border-t-transparent opacity-50"></div>
                )}

                <div className="text-4xl font-mono font-bold text-white">
                    {status === 'idle' && "READY"}
                    {status === 'waiting' && timeLeft}
                    {status === 'success' && <Check size={48} className="text-green-500" />}
                    {status === 'failed' && "FAIL"}
                </div>
            </div>

            {status === 'idle' && (
                <button
                    onClick={startWait}
                    className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold transition-all"
                >
                    Start Simulation
                </button>
            )}

            {status === 'waiting' && (
                <button
                    onClick={handleActionClick}
                    className="px-8 py-3 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold transition-all animate-pulse"
                >
                    BUY NOW!
                </button>
            )}

            {status === 'failed' && (
                <div className="text-red-400">
                    <p className="mb-4">You acted too soon! Patience is key.</p>
                    <button
                        onClick={() => setStatus('idle')}
                        className="text-sm underline hover:text-white"
                    >
                        Try Again
                    </button>
                </div>
            )}
        </div>
    );
};
