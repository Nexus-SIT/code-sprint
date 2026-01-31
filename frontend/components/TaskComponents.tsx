
import React, { useState, useMemo, useEffect } from 'react';
import { Task, OHLCData } from '../types';
import { Check, X, TrendingUp, TrendingDown, Clock } from 'lucide-react';
import TradingChart from './TradingChart';

interface TaskComponentProps {
    task: Task;
    onComplete: () => void;
}

// --- PIXEL BUTTON COMPONENT (Reusable) ---
const PixelButton: React.FC<{
    onClick: () => void;
    disabled?: boolean;
    variant?: 'primary' | 'success' | 'danger' | 'neutral';
    className?: string;
    children: React.ReactNode;
}> = ({ onClick, disabled, variant = 'primary', className = '', children }) => {

    let colors = '';
    switch (variant) {
        case 'success': colors = 'bg-green-600 border-green-800 hover:bg-green-500 text-white'; break;
        case 'danger': colors = 'bg-red-600 border-red-800 hover:bg-red-500 text-white'; break;
        case 'neutral': colors = 'bg-gray-600 border-gray-800 hover:bg-gray-500 text-gray-200'; break;
        default: colors = 'bg-indigo-600 border-indigo-900 hover:bg-indigo-500 text-white'; // primary
    }

    if (disabled) colors = 'bg-gray-700 border-gray-800 text-gray-500 cursor-not-allowed';

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`
                px-6 py-3 rounded-lg font-bold font-pixel uppercase tracking-widest text-xs
                border-b-4 active:border-b-0 active:translate-y-1 active:mt-1 transition-all
                shadow-lg ${colors} ${className}
            `}
        >
            {children}
        </button>
    );
}

// --- QUIZ COMPONENT ---
export const QuizComponent: React.FC<TaskComponentProps> = ({ task, onComplete }) => {
    const [selected, setSelected] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    const handleCheck = () => {
        let isCorrectAnswer = false;

        // Support both string match and index match
        if (task.correctIndex !== undefined && task.options) {
            const selectedIdx = task.options.indexOf(selected!);
            isCorrectAnswer = selectedIdx === task.correctIndex;
        } else if (task.correctAnswer) {
            isCorrectAnswer = selected === task.correctAnswer;
        }

        setIsCorrect(isCorrectAnswer);

        if (isCorrectAnswer) {
            setTimeout(onComplete, 1200);
        }
    };

    return (
        <div className="bg-gray-900 p-8 rounded-xl border-4 border-indigo-900/50 max-w-xl w-full relative overflow-hidden shadow-2xl">
            {/* Scanlines */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 pointer-events-none bg-[length:100%_4px,6px_100%]"></div>

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold font-pixel text-indigo-400 uppercase tracking-widest"> &gt;_ QUIZ PROTOCOL</h3>
                    <div className="px-2 py-1 bg-indigo-900/50 border border-indigo-500/30 rounded text-[10px] text-indigo-300 font-mono">
                        ID: {task.id.toUpperCase()}
                    </div>
                </div>

                <p className="text-gray-200 text-lg mb-8 font-medium leading-relaxed border-l-4 border-indigo-500 pl-4">
                    {task.challengeText || task.question}
                </p>

                <div className="space-y-4 mb-8">
                    {task.options?.map((option, idx) => {
                        const isSelected = selected === option;
                        // Determine visual state based on selection and result
                        let stateClass = "border-gray-700 bg-gray-800 text-gray-400 hover:bg-gray-750"; // Default
                        if (isSelected) {
                            if (isCorrect === null) stateClass = "border-amber-500 bg-amber-900/30 text-amber-200"; // Selected, not checked
                            else if (isCorrect) stateClass = "border-green-500 bg-green-900/30 text-green-200"; // Correct
                            else stateClass = "border-red-500 bg-red-900/30 text-red-200"; // Wrong
                        }

                        return (
                            <button
                                key={idx}
                                onClick={() => { if (isCorrect !== true) setSelected(option); setIsCorrect(null); }}
                                className={`w-full p-4 rounded-lg text-left border-2 transition-all font-mono text-sm group flex items-center ${stateClass}`}
                            >
                                <span className={`w-6 h-6 rounded flex items-center justify-center text-xs mr-4 border 
                                    ${isSelected ? 'border-current' : 'border-gray-600 bg-gray-900'}
                                `}>
                                    {String.fromCharCode(65 + idx)}
                                </span>
                                {option}
                            </button>
                        );
                    })}
                </div>

                <div className="flex justify-end">
                    <PixelButton
                        onClick={handleCheck}
                        disabled={!selected || isCorrect === true}
                        variant={isCorrect === true ? 'success' : 'primary'}
                    >
                        {isCorrect === true ? <span className="flex items-center gap-2"><Check size={16} /> ACCESS GRANTED</span> : isCorrect === false ? 'RETRY' : 'VERIFY ANSWER'}
                    </PixelButton>
                </div>

                {isCorrect === false && (
                    <div className="mt-4 text-center text-red-400 font-bold animate-pulse text-sm font-pixel">
                        &lt; ERROR: INCORRECT RESPONSE &gt;
                    </div>
                )}
            </div>
        </div>
    );
};

// --- PREDICT COMPONENT (NEW) ---
export const PredictComponent: React.FC<TaskComponentProps> = ({ task, onComplete }) => {
    const [status, setStatus] = useState<'idle' | 'revealed'>('idle');
    const [result, setResult] = useState<'win' | 'loss' | null>(null);
    const [prediction, setPrediction] = useState<'up' | 'down' | null>(null);

    // Generate chart data that handles the "reveal" logic
    const { visibleData, hiddenData } = useMemo(() => {
        // Create 40 candles
        const data: OHLCData[] = [];
        let price = 15000;
        for (let i = 0; i < 40; i++) {
            const open = price;
            const change = (Math.random() - 0.48) * 100; // Slight upward bias
            const close = open + change;
            const high = Math.max(open, close) + Math.random() * 50;
            const low = Math.min(open, close) - Math.random() * 50;
            data.push({ time: i, open, high, low, close, volume: 1000 });
            price = close;
        }

        // Hide last 10 candles
        return {
            visibleData: data.slice(0, 30),
            hiddenData: data.slice(30)
        };
    }, []);

    const handlePredict = (direction: 'up' | 'down') => {
        setPrediction(direction);
        setStatus('revealed');

        const lastPrice = visibleData[visibleData.length - 1].close;
        const finalPrice = hiddenData[hiddenData.length - 1].close;
        const actualMove = finalPrice > lastPrice ? 'up' : 'down';

        const won = direction === actualMove;
        setResult(won ? 'win' : 'loss');

        if (won) {
            setTimeout(onComplete, 2000);
        }
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4">
            <div className="bg-gray-900 border-4 border-gray-700 rounded-xl p-2 w-full max-w-5xl shadow-2xl overflow-hidden relative">
                {/* Header */}
                <div className="flex justify-between items-center mb-2 px-4 py-2 bg-gray-800 rounded-t-lg">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                        <span className="font-pixel text-xs text-red-500 uppercase tracking-widest">LIVE FEED</span>
                    </div>
                    <div className="font-mono text-xs text-gray-400">MARKET SIMULATION // BTC-USD</div>
                </div>

                <div className="h-80 w-full relative bg-black/50 rounded border border-gray-800">
                    <TradingChart
                        data={status === 'idle' ? visibleData : [...visibleData, ...hiddenData]}
                        onCandleClick={() => { }}
                        showSuccess={null}
                    />

                    {/* Prediction Overlay */}
                    {status === 'idle' && (
                        <div className="absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-black via-black/80 to-transparent flex items-center justify-end pr-8">
                            <div className="text-right">
                                <div className="text-4xl font-bold text-white mb-1">?</div>
                                <div className="text-xs font-mono text-gray-400">PREDICT NEXT MOVE</div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Controls */}
                <div className="mt-4 flex flex-col items-center">
                    <p className="text-gray-300 font-bold mb-4 font-pixel text-sm uppercase">
                        {status === 'idle'
                            ? "Based on the chart, where will price go?"
                            : result === 'win'
                                ? <span className="text-green-400">PREDICTION CORRECT! +$500</span>
                                : <span className="text-red-400">PREDICTION FAILED. TRY AGAIN.</span>
                        }
                    </p>

                    {status === 'idle' ? (
                        <div className="flex gap-8">
                            <button
                                onClick={() => handlePredict('up')}
                                className="group flex flex-col items-center gap-2 transition-transform active:scale-95"
                            >
                                <div className="w-16 h-16 rounded-xl bg-green-600 border-b-4 border-green-800 flex items-center justify-center shadow-lg group-hover:bg-green-500">
                                    <TrendingUp size={32} className="text-white" />
                                </div>
                                <span className="font-pixel text-xs text-green-400 uppercase">CALL (UP)</span>
                            </button>

                            <button
                                onClick={() => handlePredict('down')}
                                className="group flex flex-col items-center gap-2 transition-transform active:scale-95"
                            >
                                <div className="w-16 h-16 rounded-xl bg-red-600 border-b-4 border-red-800 flex items-center justify-center shadow-lg group-hover:bg-red-500">
                                    <TrendingDown size={32} className="text-white" />
                                </div>
                                <span className="font-pixel text-xs text-red-400 uppercase">PUT (DOWN)</span>
                            </button>
                        </div>
                    ) : (
                        <div className="h-20 flex items-center">
                            {result === 'loss' && (
                                <PixelButton onClick={() => setStatus('idle')} variant='neutral'>
                                    Try Again
                                </PixelButton>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- CHART SELECT COMPONENT ---
export const ChartSelectComponent: React.FC<TaskComponentProps> = ({ task, onComplete }) => {
    const [status, setStatus] = useState<'idle' | 'success' | 'fail'>('idle');
    const [clickedIndex, setClickedIndex] = useState<number | null>(null);

    // Reuse prediction data for consistency or mock
    const mockData = useMemo(() => {
        const data: OHLCData[] = [];
        let price = 10000;
        for (let i = 0; i < 30; i++) {
            const open = price;
            const close = price + (Math.random() - 0.5) * 100;
            const high = Math.max(open, close) + Math.random() * 20;
            const low = Math.min(open, close) - Math.random() * 20;
            data.push({ time: i, open, high, low, close, volume: 1000 });
            price = close;
        }
        return data;
    }, []);

    const handleCandleClick = (idx: number) => {
        setClickedIndex(idx);
        // In a real app, validate against task.correctRegion or task.correctIndex
        // For loose validation, allow any click in mock mode or check if index is provided
        const isCorrect = task.correctIndex ? Math.abs(idx - task.correctIndex) < 3 : true;

        if (isCorrect) {
            setStatus('success');
            setTimeout(onComplete, 1500);
        } else {
            setStatus('fail');
            setTimeout(() => { setStatus('idle'); setClickedIndex(null); }, 1000);
        }
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4">
            <div className={`bg-gray-900 border-4 rounded-xl p-2 w-full max-w-5xl shadow-2xl relative transition-colors duration-500
                 ${status === 'success' ? 'border-green-500' : status === 'fail' ? 'border-red-500' : 'border-gray-700'}
            `}>
                <div className="absolute top-4 right-4 text-xs font-mono text-gray-500 z-20 bg-gray-900 px-2 rounded">INTERACTIVE MODE</div>

                <div className="h-80 w-full relative bg-gray-950 rounded border border-gray-800">
                    <TradingChart
                        data={mockData}
                        onCandleClick={handleCandleClick}
                        showSuccess={status === 'success' ? clickedIndex : null}
                    />
                </div>

                <div className="mt-4 pb-4 text-center">
                    <p className="text-gray-300 font-pixel text-sm uppercase tracking-wide">{task.challengeText}</p>
                    {status === 'success' && (
                        <div className="mt-2 text-green-400 font-bold flex items-center justify-center gap-2 animate-bounce font-pixel text-xs">
                            <Check size={16} /> PATTERN IDENTIFIED
                        </div>
                    )}
                    {status === 'fail' && (
                        <div className="mt-2 text-red-400 font-bold flex items-center justify-center gap-2 font-pixel text-xs">
                            <X size={16} /> TARGET MISSED
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- WAIT COMPONENT ---
export const WaitComponent: React.FC<TaskComponentProps> = ({ task, onComplete }) => {
    const [timeLeft, setTimeLeft] = useState(5);
    const [status, setStatus] = useState<'idle' | 'waiting' | 'failed' | 'success'>('idle');

    const startWait = () => {
        setStatus('waiting');
        setTimeLeft(5);
    };

    useEffect(() => {
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

    return (
        <div className="bg-gray-900 p-8 rounded-xl border-4 border-indigo-900 shadow-2xl max-w-md w-full text-center relative overflow-hidden">
            {/* Background pulse */}
            {status === 'waiting' && <div className="absolute inset-0 bg-indigo-500/10 animate-pulse"></div>}

            <h3 className="text-2xl font-bold mb-2 text-indigo-400 font-pixel uppercase">Discipline Test</h3>
            <p className="text-gray-400 mb-8 font-mono text-sm leading-relaxed">{task.challengeText || "Hold your position. Do NOT trade."}</p>

            <div className="relative w-48 h-48 mb-8 mx-auto flex items-center justify-center">
                {/* Timer Circle */}
                <svg className="w-full h-full transform -rotate-90">
                    <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-800" />
                    {status === 'waiting' && (
                        <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="8" fill="transparent"
                            className="text-indigo-500 transition-all duration-1000 ease-linear"
                            strokeDasharray={2 * Math.PI * 88}
                            strokeDashoffset={2 * Math.PI * 88 * ((5 - timeLeft) / 5)}
                        />
                    )}
                </svg>

                <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <div className="text-4xl font-mono font-bold text-white">
                        {status === 'idle' && <Clock size={48} />}
                        {status === 'waiting' && timeLeft}
                        {status === 'success' && <Check size={48} className="text-green-500" />}
                        {status === 'failed' && <X size={48} className="text-red-500" />}
                    </div>
                </div>
            </div>

            {status === 'idle' && (
                <PixelButton onClick={startWait} className="w-full">
                    INITIATE SEQUENCE
                </PixelButton>
            )}

            {status === 'waiting' && (
                <button
                    onClick={() => setStatus('failed')}
                    className="w-full py-4 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold transition-all animate-pulse font-pixel text-lg shadow-[0_0_20px_rgba(220,38,38,0.6)]"
                >
                    PANIC SELL !!!
                </button>
            )}

            {status === 'failed' && (
                <div className="text-red-400 animate-bounce">
                    <p className="mb-4 font-bold font-pixel text-xs uppercase">WEAK HANDS DETECTED</p>
                    <button onClick={() => setStatus('idle')} className="text-sm underline hover:text-white font-mono">
                        Retry
                    </button>
                </div>
            )}
        </div>
    );
};
