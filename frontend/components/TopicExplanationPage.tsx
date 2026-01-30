
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { TRADER_PATH } from '../data/mockData';
import { useTypewriter } from '../hooks/useTypewriter';
import { useStore } from '../store';
import TradingChart from './TradingChart';

const TopicExplanationPage: React.FC = () => {
    const { moduleId, roomId } = useParams<{ moduleId: string; roomId: string }>();
    const navigate = useNavigate();
    const { theme } = useStore();

    const [lines, setLines] = useState<string[]>([]);
    const [currentLineIndex, setCurrentLineIndex] = useState(0);
    const [showContinue, setShowContinue] = useState(false);
    const [chartData, setChartData] = useState<any[]>([]);

    // Load content
    useEffect(() => {
        // Find module in TRADER_PATH
        const module = TRADER_PATH.modules.find(m => m.id === moduleId);
        const room = module?.rooms.find(r => r.id === roomId);

        if (room) {
            // Aggregate descriptions from tasks to form the "lesson"
            // If tasks contain 'theory', use that as it's more detailed
            let descriptionLines: string[] = [];

            if (room.tasks && room.tasks.length > 0) {
                // Prefer theory from the first task if available, effectively making the room about the first task's concept
                if (room.tasks[0].theory) {
                    descriptionLines = room.tasks[0].theory;
                } else {
                    descriptionLines = room.tasks.map(t => t.description || '');
                }
            } else {
                descriptionLines = [room.description || ''];
            }

            setLines(descriptionLines);

            if (room.chartData && room.chartData.length > 0) {
                setChartData(room.chartData);
            }
        }
    }, [moduleId, roomId]);

    const currentText = lines[currentLineIndex] || '';
    const { displayedText, isComplete } = useTypewriter(currentText, 30);

    // Auto-advance logic
    useEffect(() => {
        if (isComplete) {
            const timeout = setTimeout(() => {
                if (currentLineIndex < lines.length - 1) {
                    setCurrentLineIndex(prev => prev + 1);
                } else {
                    setShowContinue(true);
                }
            }, 1000); // 1s pause between lines
            return () => clearTimeout(timeout);
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

    return (
        <div className={`min-h-screen flex flex-col md:flex-row overflow-hidden font-body selection:bg-wood-light selection:text-parchment
            ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-parchment text-coffee'}
        `}>

            {/* LEFT: Cat Mentor */}
            <div className={`w-full md:w-5/12 flex items-center justify-center relative p-8 border-r-4
                ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-wood border-wood-dark'}
            `}>
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "url('/tile.png')", backgroundSize: '64px' }}></div>

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
                    className={`relative z-10 w-80 h-80 md:w-[450px] md:h-[450px] p-4 rounded-xl border-4 shadow-2xl
                        ${theme === 'dark' ? 'bg-gray-700 border-gray-900' : 'bg-[#eec39a] border-[#8b4513]'}
                    `}
                >
                    <div className="w-full h-full bg-black/20 rounded-lg shadow-inner overflow-hidden relative">
                        <img
                            src={(!isComplete && Math.floor(Date.now() / 200) % 2 === 0) ? "/mentor/CatJoyFull.png" : "/mentor/CatNormal.png"}
                            alt="Cat Mentor"
                            className="w-full h-full object-contain filter drop-shadow-2xl"
                        />
                    </div>
                    {/* Nameplate */}
                    <div className={`absolute -bottom-6 left-1/2 transform -translate-x-1/2 px-6 py-2 rounded-lg border-4 shadow-pixel
                        ${theme === 'dark' ? 'bg-indigo-600 border-gray-900 text-white' : 'bg-wood-dark border-wood-light text-parchment'}
                    `}>
                        <h3 className="font-pixel text-lg tracking-widest">MENTOR</h3>
                    </div>
                </motion.div>
            </div>

            {/* RIGHT: Content */}
            <div className={`w-full md:w-7/12 flex flex-col justify-center p-8 md:p-16 relative overflow-y-auto
                ${theme === 'dark' ? 'bg-gray-900' : 'bg-parchment'}
            `}>
                <div className="max-w-2xl mx-auto w-full">
                    {/* Header */}
                    <div className="mb-8">
                        <h2 className={`text-[10px] font-black uppercase tracking-widest mb-2
                            ${theme === 'dark' ? 'text-indigo-400' : 'text-wood-light'}
                        `}>MENTOR EXPLANATION</h2>
                        <h1 className={`text-2xl md:text-4xl font-black font-pixel mb-6
                            ${theme === 'dark' ? 'text-white' : 'text-wood-dark'}
                        `}>
                            {TRADER_PATH.modules.find(m => m.id === moduleId)?.rooms.find(r => r.id === roomId)?.title}
                        </h1>
                    </div>

                    {/* Chart Area */}
                    {chartData.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-8 w-full"
                        >
                            <TradingChart
                                data={chartData}
                                onCandleClick={() => { }} // No interaction needed for explanation phase usually, but required by props
                            />
                        </motion.div>
                    )}

                    {/* Dialogue Box */}
                    <div className={`min-h-[250px] p-6 md:p-8 rounded-xl border-4 shadow-pixel relative
                        ${theme === 'dark' ? 'bg-gray-800 border-gray-600' : 'bg-wood-light/30 border-wood'}
                    `}>
                        <AnimatePresence mode="popLayout">
                            {lines.slice(0, currentLineIndex + 1).map((line, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`mb-4 pb-2 border-b-2 border-dashed last:border-0
                                        ${theme === 'dark' ? 'border-gray-700' : 'border-wood/20'}
                                    `}
                                >
                                    <p className={`text-lg md:text-xl font-medium font-pixel leading-relaxed
                                        ${theme === 'dark' ? 'text-gray-200' : 'text-coffee'}
                                    `}>
                                        {idx === currentLineIndex ? displayedText : line}
                                        {idx === currentLineIndex && !isComplete && <span className="animate-pulse">|</span>}
                                    </p>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {/* Triangle indicator for next line */}
                        {!isComplete && (
                            <div className={`absolute bottom-4 right-4 animate-bounce
                                ${theme === 'dark' ? 'text-indigo-400' : 'text-wood-dark'}
                            `}>▼</div>
                        )}

                    </div>

                    {/* Action Area */}
                    <div className="h-24 mt-8 flex items-center justify-end">
                        {showContinue && (
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
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default TopicExplanationPage;
