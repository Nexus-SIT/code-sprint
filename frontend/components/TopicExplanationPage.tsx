import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { CURRICULUM } from '../data/curriculum';
import { useTypewriter } from '../hooks/useTypewriter';

const TopicExplanationPage: React.FC = () => {
    const { moduleId, roomId } = useParams<{ moduleId: string; roomId: string }>();
    const navigate = useNavigate();

    const [lines, setLines] = useState<string[]>([]);
    const [currentLineIndex, setCurrentLineIndex] = useState(0);
    const [showContinue, setShowContinue] = useState(false);

    // Load content
    useEffect(() => {
        const module = CURRICULUM.find(m => m.id === moduleId);
        const room = module?.rooms.find(r => r.id === roomId);

        if (room && room.tasks.length > 0) {
            // Aggregate descriptions from tasks to form the "lesson"
            const descriptionLines = room.tasks.map(t => t.description);
            setLines(descriptionLines);
        }
    }, [moduleId, roomId]);

    const currentText = lines[currentLineIndex] || '';
    const { displayedText, isComplete } = useTypewriter(currentText, 40);

    // Auto-advance logic
    useEffect(() => {
        if (isComplete) {
            const timeout = setTimeout(() => {
                if (currentLineIndex < lines.length - 1) {
                    setCurrentLineIndex(prev => prev + 1);
                } else {
                    setShowContinue(true);
                }
            }, 1500); // Wait 1.5s before next line
            return () => clearTimeout(timeout);
        }
    }, [isComplete, currentLineIndex, lines.length]);

    const handleContinue = () => {
        // Navigate to the actual classroom/quiz flow
        navigate(`/learn/${moduleId}/${roomId}`);
    };

    const handleBack = () => {
        navigate('/roadmap');
    };

    return (
        <div className="min-h-screen bg-[#111217] text-white flex flex-col md:flex-row overflow-hidden font-sans">

            {/* LEFT: Cat Mentor */}
            <div className="w-full md:w-1/2 flex items-center justify-center bg-[#1a1b26] relative p-8">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>

                {/* Back Button */}
                <button
                    onClick={handleBack}
                    className="absolute top-6 left-6 text-gray-400 hover:text-white flex items-center gap-2 z-20 transition-colors"
                >
                    <ArrowLeft size={20} /> Back
                </button>

                <motion.div
                    animate={{
                        y: [0, -20, 0],
                    }}
                    transition={{
                        y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                    }}
                    className="relative z-10 w-64 h-64 md:w-96 md:h-96"
                >
                    <img
                        src={!isComplete && Math.floor(Date.now() / 150) % 2 === 0 ? "/mentor/cat_happy.jpg" : "/mentor/cat_neutral.png"}
                        alt="Cat Mentor"
                        className="w-full h-full object-contain drop-shadow-2xl transition-opacity duration-75"
                    />
                </motion.div>
            </div>

            {/* RIGHT: Content */}
            <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-16 relative">
                <div className="max-w-xl">
                    <div className="mb-8">
                        <h2 className="text-[10px] font-black text-lime-500 uppercase tracking-widest mb-2">Mentor Explanation</h2>
                        <h1 className="text-3xl md:text-4xl font-black text-white mb-6">
                            {CURRICULUM.find(m => m.id === moduleId)?.rooms.find(r => r.id === roomId)?.title}
                        </h1>
                    </div>

                    <div className="space-y-6 min-h-[200px]">
                        <AnimatePresence mode="popLayout">
                            {lines.slice(0, currentLineIndex + 1).map((line, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="bg-gray-800/50 border-l-4 border-indigo-500 pl-4 py-2 rounded-r-lg"
                                >
                                    <p className="text-xl md:text-2xl text-gray-200 leading-relaxed font-medium">
                                        {idx === currentLineIndex ? displayedText : line}
                                        {idx === currentLineIndex && !isComplete && <span className="animate-pulse">|</span>}
                                    </p>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    <div className="h-20 mt-8 flex items-center">
                        {showContinue && (
                            <motion.button
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleContinue}
                                className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-3 shadow-lg shadow-indigo-600/20"
                            >
                                Start Challenges <ArrowRight size={20} />
                            </motion.button>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default TopicExplanationPage;
