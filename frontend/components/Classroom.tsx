
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TRADER_PATH } from '../data/mockData';
import { Module, Room, Task, TaskType } from '../types';
import { ArrowLeft, HelpCircle, ChevronRight, CheckCircle2, AlertTriangle, BookOpen } from 'lucide-react';
import { QuizComponent, ChartSelectComponent, WaitComponent, PredictComponent } from './TaskComponents'; // Added PredictComponent
import { useStore } from '../store';
import { completeTask } from '../services/firebaseApi';
import { motion, AnimatePresence } from 'framer-motion';

const Classroom: React.FC = () => {
    const { moduleId, roomId } = useParams<{ moduleId: string; roomId: string }>();
    const navigate = useNavigate();
    const { userId, theme } = useStore();

    const [currentModule, setCurrentModule] = useState<Module | null>(null);
    const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
    const [activeTask, setActiveTask] = useState<Task | null>(null);
    const [completedTaskIds, setCompletedTaskIds] = useState<string[]>([]);

    useEffect(() => {
        if (moduleId && roomId) {
            const moduleFound = TRADER_PATH.modules.find(m => m.id === moduleId);
            const roomFound = moduleFound?.rooms.find(r => r.id === roomId);

            if (moduleFound && roomFound) {
                setCurrentModule(moduleFound);
                setCurrentRoom(roomFound);
                setActiveTask(roomFound.tasks[0]); // Default to first task
            }
        }
    }, [moduleId, roomId]);

    if (!currentModule || !currentRoom || !activeTask) {
        return (
            <div className={`flex items-center justify-center h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-parchment text-wood-dark'}`}>
                Loading Classroom...
            </div>
        );
    }

    const handleTaskComplete = async () => {
        if (!activeTask || !currentRoom || !userId) return;

        // 1. Mark current task as done locally
        if (!completedTaskIds.includes(activeTask.id)) {
            setCompletedTaskIds(prev => [...prev, activeTask.id]);
        }

        const currentIdx = currentRoom.tasks.findIndex(t => t.id === activeTask.id);
        const isLastTask = currentIdx === currentRoom.tasks.length - 1;

        // 2. Persist progress (Credit rewards)
        try {
            // Reward calculation: reward - penalty (min 10)
            const pnl = Math.max(10, (activeTask.reward || 50));
            // Ensure userId is valid, completeTask requires string
            await completeTask(userId, roomId!, pnl, isLastTask);
            console.log("Task saved!");
        } catch (err) {
            console.error("Failed to save progress", err);
        }

        // 3. Navigate to next task or finish
        if (!isLastTask) {
            // Small delay for user to see success
            setTimeout(() => {
                setActiveTask(currentRoom.tasks[currentIdx + 1]);
            }, 1000);
        } else {
            // Room Complete
            setTimeout(() => {
                navigate('/learn');
            }, 1500);
        }
    };

    const handleSkip = () => {
        const currentIdx = currentRoom.tasks.findIndex(t => t.id === activeTask.id);
        if (currentIdx < currentRoom.tasks.length - 1) {
            setActiveTask(currentRoom.tasks[currentIdx + 1]);
        } else {
            navigate('/learn');
        }
    };

    const isDark = theme === 'dark';

    return (
        <div className={`flex h-screen overflow-hidden font-body selection:bg-wood-light selection:text-parchment
            ${isDark ? 'bg-gray-900 text-gray-100' : 'bg-parchment text-coffee'}
        `}>
            {/* Background Image */}
            <div className="absolute inset-0 pointer-events-none opacity-10 z-0 blur-sm"
                style={{ backgroundImage: "url('/bg.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
            </div>

            {/* Sidebar - Task List (Quest Log Style) */}
            <aside className={`w-64 flex flex-col items-center relative z-10 border-r-4 shadow-xl
                ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-wood border-wood-dark'}
            `}>
                <div className={`w-full p-4 border-b-4 flex items-center gap-2
                     ${isDark ? 'border-gray-700' : 'border-wood-dark bg-wood-dark/10'}
                `}>
                    <button onClick={() => navigate('/learn')} className={`transition-colors p-1 rounded
                         ${isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-wood-light text-wood-dark'}
                    `}>
                        <ArrowLeft size={20} />
                    </button>
                    <div className="overflow-hidden">
                        <span className={`font-pixel text-[10px] uppercase tracking-widest block truncate
                            ${isDark ? 'text-indigo-400' : 'text-wood-light'}
                        `}>{currentModule.title}</span>
                        <span className={`font-bold text-sm block truncate
                            ${isDark ? 'text-white' : 'text-wood-dark'}
                        `}>{currentRoom.title}</span>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto w-full p-4 space-y-3">
                    <h3 className={`text-xs font-bold uppercase tracking-widest mb-2 opacity-70 font-pixel
                         ${isDark ? 'text-gray-400' : 'text-wood-dark'}
                    `}>QUEST LOG</h3>

                    {currentRoom.tasks.map((task, idx) => {
                        const isActive = activeTask.id === task.id;
                        const isDone = completedTaskIds.includes(task.id);

                        return (
                            <button
                                key={task.id}
                                onClick={() => setActiveTask(task)}
                                className={`w-full text-left p-3 rounded-lg text-sm flex items-start gap-3 transition-all border-2
                                    ${isActive
                                        ? (isDark ? 'bg-indigo-900/50 border-indigo-500 text-white' : 'bg-parchment border-wood-dark text-wood-dark shadow-pixel')
                                        : (isDark ? 'bg-gray-700/30 border-transparent text-gray-400 hover:bg-gray-700' : 'bg-wood-light/50 border-transparent text-wood-dark hover:bg-wood-light')
                                    }
                                `}
                            >
                                <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] border shrink-0
                                    ${isActive
                                        ? (isDark ? 'border-indigo-300 bg-indigo-500 text-white' : 'border-wood-dark bg-wood-dark text-parchment')
                                        : (isDone
                                            ? 'bg-green-500 border-green-600 text-white'
                                            : (isDark ? 'border-gray-600 bg-gray-800' : 'border-wood-dark/50 bg-wood-light'))
                                    }
                                `}>
                                    {isDone ? <CheckCircle2 size={12} /> : idx + 1}
                                </div>
                                <div>
                                    <div className="font-bold leading-tight line-clamp-2">{task.title}</div>
                                    <div className="text-[10px] opacity-70 mt-1 uppercase font-pixel tracking-wider">{task.type}</div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </aside>

            {/* Main Content Split */}
            <main className="flex-1 flex flex-col md:flex-row overflow-hidden relative z-10">

                {/* Left: Theory & Instructions (Scroll Style) */}
                <div className={`w-full md:w-1/3 p-6 md:p-8 border-r-4 overflow-y-auto relative
                    ${isDark ? 'bg-gray-800/80 border-gray-700' : 'bg-parchment/90 border-wood-dark'}
                `}>
                    {/* Decorative top border for parchment feel */}
                    {!isDark && (
                        <div className="absolute top-0 left-0 w-full h-4 bg-wood-dark opacity-20"></div>
                    )}

                    <div className="max-w-md mx-auto">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase mb-4 border
                             ${isDark ? 'bg-indigo-900/50 text-indigo-300 border-indigo-500/30' : 'bg-wood-light text-wood-dark border-wood-dark'}
                        `}>
                            <BookOpen size={12} />
                            Briefing
                        </div>

                        <h1 className={`text-2xl font-black font-pixel mb-4 leading-tight
                             ${isDark ? 'text-white' : 'text-wood-dark'}
                        `}>{activeTask.title}</h1>

                        <div className={`prose prose-sm leading-relaxed mb-8
                             ${isDark ? 'prose-invert text-gray-300' : 'text-coffee'}
                        `}>
                            {activeTask.description}
                        </div>

                        <div className={`rounded-xl p-5 border-4 shadow-lg relative overflow-hidden
                             ${isDark ? 'bg-gray-900 border-indigo-500/50' : 'bg-wood-light border-wood shadow-pixel'}
                        `}>
                            <div className={`absolute top-0 left-0 w-1 h-full
                                 ${isDark ? 'bg-indigo-500' : 'bg-wood-dark'}
                            `}></div>
                            <h3 className={`font-black font-pixel text-xs uppercase tracking-widest mb-2
                                 ${isDark ? 'text-indigo-400' : 'text-wood-dark'}
                            `}>Mission Objective</h3>
                            <p className={`text-lg font-bold italic
                                 ${isDark ? 'text-white' : 'text-coffee'}
                            `}>
                                {activeTask.challengeText}
                            </p>
                        </div>

                        <div className="mt-8 flex justify-end">
                            <button
                                onClick={handleSkip}
                                className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity
                                     ${isDark ? 'text-gray-500 hover:text-white' : 'text-wood-dark'}
                                `}
                            >
                                Skip (Debug) <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right: Interactive Area (Chart/Quiz - Terminal Style) */}
                <div className={`flex-1 relative flex items-center justify-center overflow-hidden
                    ${isDark ? 'bg-black/50' : 'bg-[#2a2a2a]'}
                 `}>
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>

                    {/* CRT Scanline effect */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent bg-[length:100%_4px] pointer-events-none opacity-10"></div>

                    {/* Conditional Rendering of Interaction Components */}
                    <div className="w-full h-full flex items-center justify-center p-4 relative z-10">
                        {activeTask.type === TaskType.MULTIPLE_CHOICE && (
                            <QuizComponent task={activeTask} onComplete={handleTaskComplete} />
                        )}

                        {activeTask.type === TaskType.PREDICT_PRICE && (
                            <PredictComponent task={activeTask} onComplete={handleTaskComplete} />
                        )}

                        {(activeTask.type === TaskType.CLICK_CANDLE || activeTask.type === TaskType.ACTION || activeTask.type === TaskType.DRAW_LINE || activeTask.type === TaskType.CHART_SELECT) && (
                            <ChartSelectComponent task={activeTask} onComplete={handleTaskComplete} />
                        )}

                        {activeTask.type === TaskType.WAIT_TASK && (
                            <WaitComponent task={activeTask} onComplete={handleTaskComplete} />
                        )}

                        {activeTask.type === TaskType.INFO && (
                            <div className="bg-gray-800 p-8 rounded-xl max-w-sm text-center border-2 border-gray-600 shadow-2xl">
                                <h3 className="text-xl font-bold mb-4 text-white">Information Only</h3>
                                <p className="text-gray-400 mb-6">Review the briefing and continue using the button below.</p>
                                <button onClick={() => handleTaskComplete()} className="px-6 py-2 bg-indigo-600 rounded-lg text-white hover:bg-indigo-500 font-bold shadow-lg">
                                    Proceed »
                                </button>
                            </div>
                        )}
                    </div>

                </div>
            </main>
        </div>
    );
};

export default Classroom;
