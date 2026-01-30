import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, ArrowRight, AlertCircle } from 'lucide-react';

const MarketSimChallenge: React.FC = () => {
    const navigate = useNavigate();
    const [phase, setPhase] = useState<'HEADLINE' | 'ACTION' | 'RESULT'>('HEADLINE');
    const [chartData, setChartData] = useState<number[]>([100, 102, 101, 103, 102, 104]);
    const [feedback, setFeedback] = useState<string>('');

    // Advance to Action phase after headline
    useEffect(() => {
        if (phase === 'HEADLINE') {
            const timer = setTimeout(() => setPhase('ACTION'), 3000);
            return () => clearTimeout(timer);
        }
    }, [phase]);

    const handleAction = (action: 'BUY' | 'WAIT') => {
        if (action === 'BUY') {
            // Animate price pump
            const pumpData = [...chartData];
            let price = 104;
            for (let i = 0; i < 10; i++) {
                price += Math.random() * 2 + 1; // Upward momentum
                pumpData.push(price);
            }
            setChartData(pumpData);
            setFeedback('Excellent! You capitalized on positive news.');
        } else {
            setFeedback('You missed the opportunity! Positive news usually drives price up.');
        }
        setPhase('RESULT');
    };

    const handleContinue = () => {
        // Navigate back to roadmap or next module (using existing generic completion route if available, or roadmap)
        // For prototype, back to roadmap is safest as "Room Complete"
        navigate('/roadmap');
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans overflow-hidden flex flex-col items-center justify-center p-4 relative">
            {/* Background noise */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>

            <div className="max-w-4xl w-full relative z-10">

                {/* HEADLINE PHASE */}
                <AnimatePresence>
                    {(phase === 'HEADLINE' || phase === 'ACTION') && (
                        <motion.div
                            initial={{ y: -50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -50, opacity: 0 }}
                            className="bg-red-900/80 border-l-4 border-red-500 p-6 mb-8 rounded shadow-lg backdrop-blur-sm"
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <AlertCircle className="text-red-400 animate-pulse" />
                                <span className="text-xs font-bold text-red-300 uppercase tracking-widest">Breaking News</span>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-black text-white">
                                Tech Giant "NextCorp" Reports Record Profits
                            </h1>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* CHART & INTERACTION AREA */}
                <div className="grid md:grid-cols-3 gap-8 items-center">

                    {/* CHART */}
                    <div className="md:col-span-2 bg-gray-800/50 rounded-xl border border-gray-700 p-6 h-96 relative overflow-hidden flex items-end">
                        {/* Simple SVG Line Chart */}
                        <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${chartData.length * 10} 150`}>
                            <motion.path
                                d={`M 0,${150 - (chartData[0] - 90) * 5} ` + chartData.map((p, i) => `L ${i * 10},${150 - (p - 90) * 5}`).join(' ')}
                                fill="none"
                                stroke="#4ade80"
                                strokeWidth="4"
                                strokeLinecap="round"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 1, ease: "linear" }}
                            />
                        </svg>

                        {/* Result Overlay */}
                        {phase === 'RESULT' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                            >
                                <div className="text-center p-6 bg-gray-900 border border-green-500/30 rounded-xl shadow-2xl">
                                    <h3 className="text-2xl font-bold text-green-400 mb-2">{feedback}</h3>
                                    <button
                                        onClick={handleContinue}
                                        className="mt-4 px-6 py-3 bg-green-600 hover:bg-green-500 rounded-lg font-bold flex items-center gap-2 mx-auto transition-colors"
                                    >
                                        Continue <ArrowRight size={16} />
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* CONTROLS */}
                    <div className="md:col-span-1 space-y-4">
                        {phase === 'ACTION' && (
                            <motion.div
                                initial={{ x: 50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                className="space-y-4"
                            >
                                <p className="text-gray-400 text-sm mb-4">How does the market react?</p>

                                <button
                                    onClick={() => handleAction('BUY')}
                                    className="w-full p-6 bg-green-600/20 hover:bg-green-600/40 border-2 border-green-500 rounded-xl text-left transition-all group"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-bold text-green-400 text-xl">BUY</span>
                                        <TrendingUp className="text-green-500 group-hover:scale-110 transition-transform" />
                                    </div>
                                    <span className="text-xs text-gray-400">Expect price to rise</span>
                                </button>

                                <button
                                    onClick={() => handleAction('WAIT')}
                                    className="w-full p-6 bg-gray-700/20 hover:bg-gray-700/40 border-2 border-gray-600 rounded-xl text-left transition-all"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-bold text-gray-300 text-xl">DO NOTHING</span>
                                    </div>
                                    <span className="text-xs text-gray-400">Wait for confirmation</span>
                                </button>
                            </motion.div>
                        )}

                        {phase === 'HEADLINE' && (
                            <div className="text-gray-500 italic text-sm text-center animate-pulse">
                                Analyzing market data...
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default MarketSimChallenge;
