
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Play } from 'lucide-react';
import { TRADER_PATH } from '../data/mockData';
import { useTypewriter } from '../hooks/useTypewriter';
import { useStore } from '../store';
import CandleChart from './CandleChart';

const TopicExplanationPage: React.FC = () => {
    const { moduleId, roomId } = useParams<{ moduleId: string; roomId: string }>();
    const navigate = useNavigate();
    const { theme } = useStore();

    const [lines, setLines] = useState<string[]>([]);
    const [currentLineIndex, setCurrentLineIndex] = useState(0);
    const [showContinue, setShowContinue] = useState(false);
    const [chartData, setChartData] = useState<any[]>([]);
    const [isMouthOpen, setIsMouthOpen] = useState(false);

    // Derived state for current module/room
    const module = TRADER_PATH.modules.find(m => m.id === moduleId);
    const room = module?.rooms.find(r => r.id === roomId);

    // Load content
    useEffect(() => {
        if (room) {
            let descriptionLines: string[] = [];

            // Aggregate theory from ALL tasks
            if (room.tasks && room.tasks.length > 0) {
                room.tasks.forEach(task => {
                    if (task.theory) {
                        descriptionLines.push(...task.theory);
                    } else if (task.description) {
                        descriptionLines.push(task.description);
                    }
                });
            } else {
                descriptionLines = [room.description || ''];
            }

            // Remove duplicates just in case
            descriptionLines = [...new Set(descriptionLines)];

            setLines(descriptionLines);

            if (room.chartData && room.chartData.length > 0) {
                setChartData(room.chartData);
            }
        }
    }, [moduleId, roomId]);

    const currentText = lines[currentLineIndex] || '';
    const { displayedText, isComplete } = useTypewriter(currentText, 25); // Faster typing speed

    // Talking animation
    useEffect(() => {
        if (!isComplete) {
            const interval = setInterval(() => setIsMouthOpen(prev => !prev), 150);
            return () => clearInterval(interval);
        } else {
            setIsMouthOpen(false);
        }
    }, [isComplete]);

    // Auto-advance logic (optional, user can also click)
    useEffect(() => {
        if (isComplete && currentLineIndex < lines.length - 1) {
            const timeout = setTimeout(() => {
                setCurrentLineIndex(prev => prev + 1);
            }, 1200); // 1.2s pause between lines automatic advance
            return () => clearTimeout(timeout);
        } else if (isComplete && currentLineIndex === lines.length - 1) {
            setShowContinue(true);
        }
    }, [isComplete, currentLineIndex, lines.length]);

    const handleContinue = () => {
        // Special redirect for implicit challenge room
        if (moduleId === 'module-1' && roomId === 'room-1-1') {
            navigate('/room-1-1');
            return;
        }
        // Navigate to the actual classroom/quiz flow
        navigate(`/learn/${moduleId}/${roomId}/classroom`);
    };

    const handleBack = () => {
        navigate('/learn');
    };

    // Quick skip
    const handleSkip = () => {
        setCurrentLineIndex(lines.length - 1);
        setShowContinue(true);
    };

    if (!room) return <div>Loading...</div>;

    return (
        <div className={`min-h-screen flex flex-col md:flex-row overflow-hidden font-body selection:bg-wood-light selection:text-parchment relative
            ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-parchment text-coffee'}
        `}>
            {/* Background Image */}
            <div className="absolute inset-0 pointer-events-none opacity-20 z-0 blur-sm"
                style={{ backgroundImage: "url('/bg.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
            </div>

            {/* LEFT: Cat Mentor */}
            <div className={`w-full md:w-5/12 flex items-center justify-center relative p-8 border-b-4 md:border-b-0 md:border-r-4 z-10
                ${theme === 'dark' ? 'bg-gray-800/90 border-gray-700' : 'bg-wood/90 border-wood-dark'}
            `}>
                {/* Back Button */}
                <button
                    onClick={handleBack}
                    className={`absolute top-6 left-6 flex items-center gap-2 z-20 transition-all font-pixel text-xs px-4 py-2 rounded shadow-pixel border-b-4 active:border-b-0 active:translate-y-1 active:mt-1
                        ${theme === 'dark'
                            ? 'bg-gray-700 text-gray-300 border-gray-900 hover:bg-gray-600'
                            : 'bg-wood-light text-wood-dark border-wood-dark hover:bg-parchment'}
                    `}
                >
                    <ArrowLeft size={16} /> BACK
                </button>

                {/* Portrait Frame */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`relative z-10 w-64 h-64 md:w-96 md:h-96 p-4 rounded-xl border-4 shadow-2xl mt-12 md:mt-0
                        ${theme === 'dark' ? 'bg-gray-700 border-gray-900' : 'bg-[#eec39a] border-[#8b4513]'}
                    `}
                >
                    <div className="w-full h-full bg-black/20 rounded-lg shadow-inner overflow-hidden relative flex items-end justify-center">
                        <img
                            src={isMouthOpen ? '/mentor/CatNormalOpen.png' : '/mentor/CatNormal.png'}
                            alt="Mentor"
                            className="h-[90%] object-contain filter drop-shadow-xl"
                        />
                        {/* Nameplate */}
                        <div className={`absolute -bottom-6 left-1/2 transform -translate-x-1/2 px-6 py-2 rounded-lg border-4 shadow-pixel min-w-[200px] text-center
                        ${theme === 'dark' ? 'bg-indigo-600 border-gray-900 text-white' : 'bg-wood-dark border-wood-light text-parchment'}
                    `}>
                            <h3 className="font-pixel text-lg tracking-widest">MENTOR</h3>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* RIGHT: Content */}
            <div className={`w-full md:w-7/12 flex flex-col relative z-10 h-[60vh] md:h-screen
                ${theme === 'dark' ? 'bg-gray-900/95' : 'bg-parchment/95'}
            `}>
                <div className="flex-1 overflow-y-auto p-6 md:p-12 pb-32">
                    <div className="max-w-2xl mx-auto w-full">
                        {/* Header */}
                        <div className="mb-8 text-center md:text-left">
                            <h2 className={`text-[10px] font-black uppercase tracking-widest mb-2
                                ${theme === 'dark' ? 'text-indigo-400' : 'text-wood-light'}
                            `}>{module?.title}</h2>
                            <h1 className={`text-2xl md:text-4xl font-black font-pixel mb-6
                                ${theme === 'dark' ? 'text-white' : 'text-wood-dark'}
                            `}>
                                {room.title}
                            </h1>
                        </div>

                        {/* Chart Area - Styled like Game Mode */}
                        {chartData.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-8 w-full"
                            >
                                <div className={`rounded-lg border-4 shadow-pixel relative flex flex-col p-1 overflow-hidden h-64 md:h-80
                                     ${theme === 'dark' ? 'bg-gray-800 border-gray-600' : 'bg-parchment border-wood-dark'}
                                `}>
                                    {/* Window Frame Inner Border */}
                                    <div className="absolute inset-0 border-2 border-wood opacity-30 pointer-events-none rounded sm:hidden"></div>
                                    <div className="flex-1 w-full h-full p-2">
                                        <CandleChart data={chartData} height="100%" />
                                    </div>
                                    {/* Chart Caption */}
                                    <div className="absolute top-2 left-2 px-2 py-1 bg-black/50 text-white text-[10px] font-pixel rounded">
                                        MARKET DATA VISUALIZATION
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Dialogue Box */}
                        <div className={`min-h-[200px] p-6 md:p-8 rounded-xl border-4 shadow-pixel relative mb-24
                            ${theme === 'dark' ? 'bg-gray-800 border-gray-600' : 'bg-wood-light/30 border-wood'}
                        `}>
                            <div className="space-y-4">
                                {lines.slice(0, currentLineIndex + 1).map((line, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className={`pb-2 ${idx !== lines.length - 1 ? 'border-b border-dashed border-gray-400/30' : ''}`}
                                    >
                                        <p className={`text-lg md:text-xl font-medium font-pixel leading-relaxed
                                            ${theme === 'dark' ? 'text-gray-200' : 'text-coffee'}
                                        `}>
                                            {idx === currentLineIndex ? displayedText : line}
                                            {idx === currentLineIndex && !isComplete && <span className="animate-pulse">|</span>}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Skip Button (if not done) */}
                            {!showContinue && (
                                <button
                                    onClick={handleSkip}
                                    className="absolute bottom-2 right-2 text-xs opacity-50 hover:opacity-100 font-bold uppercase tracking-widest"
                                >
                                    Skip »
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer Action Area - Fixed at bottom */}
                <div className={`absolute bottom-0 left-0 right-0 p-6 border-t-4 backdrop-blur-md
                    ${theme === 'dark'
                        ? 'bg-gray-900/90 border-gray-700'
                        : 'bg-wood/90 border-wood-dark'}
                `}>
                    <div className="max-w-2xl mx-auto flex justify-between items-center">
                        <div className="text-xs font-bold uppercase tracking-widest opacity-60">
                            {currentLineIndex + 1} / {lines.length} SEGMENTS
                        </div>

                        {showContinue ? (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleContinue}
                                className={`px-8 py-4 rounded-xl font-bold font-pixel flex items-center gap-3 shadow-pixel border-b-4 active:border-b-0 active:translate-y-1 active:mt-1 transition-all
                                    ${theme === 'dark'
                                        ? 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-900'
                                        : 'bg-success hover:bg-green-600 text-white border-green-800'}
                                `}
                            >
                                START CHALLENGES <ArrowRight size={20} />
                            </motion.button>
                        ) : (
                            <button
                                onClick={() => setCurrentLineIndex(prev => Math.min(prev + 1, lines.length - 1))}
                                disabled={!isComplete && currentLineIndex < lines.length - 1}
                                className="px-6 py-3 rounded-lg bg-gray-500/20 font-bold opacity-50 cursor-not-allowed"
                            >
                                ...
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopicExplanationPage;
