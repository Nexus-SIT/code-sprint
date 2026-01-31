import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Target } from 'lucide-react';
import { useStore } from '../store';
import { motion } from 'framer-motion';

const TasksPage: React.FC = () => {
    const navigate = useNavigate();
    const { theme } = useStore();

    return (
        <div className={`min-h-screen relative overflow-hidden font-body
            ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-parchment text-coffee'}
        `}>
            {/* Background Image - Full screen */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: "url('/tasks-bg.jpg')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}
            >
                {/* Overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 min-h-screen flex flex-col">
                {/* Header */}
                <header className="p-6">
                    <button
                        onClick={() => navigate('/')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:scale-105
                            ${theme === 'dark'
                                ? 'bg-gray-800/80 hover:bg-gray-700 text-white border-2 border-gray-600'
                                : 'bg-wood/80 hover:bg-wood-dark text-parchment border-2 border-wood-dark'}
                        `}
                    >
                        <ArrowLeft size={20} />
                        <span className="font-pixel text-sm">BACK</span>
                    </button>
                </header>

                {/* Main Content */}
                <div className="flex-1 flex items-center justify-center p-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="text-center"
                    >
                        <div className="mb-6 flex justify-center">
                            <div className="p-6 rounded-full bg-orange-500/20 backdrop-blur-sm border-4 border-orange-500 animate-bounce">
                                <Target size={64} className="text-orange-400" />
                            </div>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-pixel mb-4 text-white drop-shadow-[0_0_20px_rgba(255,165,0,0.8)]">
                            TASKS
                        </h1>

                        <p className="text-xl md:text-2xl font-pixel text-orange-300 mb-8 drop-shadow-lg">
                            Coming Soon...
                        </p>

                        <div className="max-w-md mx-auto bg-black/50 backdrop-blur-md p-6 rounded-xl border-2 border-orange-500/50">
                            <p className="text-gray-300 text-sm leading-relaxed">
                                This page is under construction. Daily challenges and tasks will be available here soon!
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default TasksPage;
