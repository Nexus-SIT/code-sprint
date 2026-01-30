import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CURRICULUM, Module, Room, Task } from '../data/curriculum';
import { ArrowLeft, HelpCircle, ChevronRight } from 'lucide-react';
import { QuizComponent, ChartSelectComponent } from './TaskComponents';

const Classroom: React.FC = () => {
    const { moduleId, roomId } = useParams<{ moduleId: string; roomId: string }>();
    const navigate = useNavigate();

    const [currentModule, setCurrentModule] = useState<Module | null>(null);
    const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
    const [activeTask, setActiveTask] = useState<Task | null>(null);

    useEffect(() => {
        if (moduleId && roomId) {
            const moduleFound = CURRICULUM.find(m => m.id === moduleId);
            const roomFound = moduleFound?.rooms.find(r => r.id === roomId);

            if (moduleFound && roomFound) {
                setCurrentModule(moduleFound);
                setCurrentRoom(roomFound);
                setActiveTask(roomFound.tasks[0]); // Default to first task
            }
        }
    }, [moduleId, roomId]);

    if (!currentModule || !currentRoom || !activeTask) {
        return <div className="text-white p-8">Loading Classroom...</div>;
    }

    const handleNextTask = () => {
        const currentIdx = currentRoom.tasks.findIndex(t => t.id === activeTask.id);
        if (currentIdx < currentRoom.tasks.length - 1) {
            setActiveTask(currentRoom.tasks[currentIdx + 1]);
        } else {
            // Room Complete - Go back to map
            // Ideally should mark room as complete here
            navigate('/roadmap');
        }
    };

    return (
        <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden font-sans">

            {/* Sidebar - Task List */}
            <aside className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
                <div className="p-4 border-b border-gray-700 flex items-center gap-2">
                    <button onClick={() => navigate('/roadmap')} className="text-gray-400 hover:text-white">
                        <ArrowLeft size={20} />
                    </button>
                    <div className="overflow-hidden">
                        <span className="font-bold text-sm block truncate">{currentModule.title}</span>
                        <span className="text-xs text-gray-500 truncate">{currentRoom.title}</span>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    <h3 className="text-xs font-mono text-gray-500 uppercase mb-2">TASKS</h3>
                    {currentRoom.tasks.map((task, idx) => (
                        <button
                            key={task.id}
                            onClick={() => setActiveTask(task)}
                            className={`w-full text-left p-3 rounded-lg text-sm flex items-start gap-3 transition-colors
                                ${activeTask.id === task.id ? 'bg-indigo-600 text-white' : 'bg-gray-700/30 text-gray-400 hover:bg-gray-700'}
                            `}
                        >
                            <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] border 
                                ${activeTask.id === task.id ? 'border-white/30 bg-white/10' : 'border-gray-600 bg-gray-800'}
                            `}>
                                {idx + 1}
                            </div>
                            <div>
                                <div className="font-medium">{task.title}</div>
                                <div className="text-[10px] opacity-70 mt-1">{task.type}</div>
                            </div>
                        </button>
                    ))}
                </div>
            </aside>

            {/* Main Content Split */}
            <main className="flex-1 flex flex-col md:flex-row">

                {/* Left: Theory & Instructions */}
                <div className="w-full md:w-1/3 bg-gray-800/50 p-8 border-r border-gray-700 overflow-y-auto">
                    <div className="max-w-md mx-auto">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-900/50 text-indigo-300 text-xs font-mono mb-6 border border-indigo-500/30">
                            <HelpCircle size={12} />
                            THEORY
                        </div>

                        <h1 className="text-3xl font-bold mb-4 text-white">{activeTask.title}</h1>
                        <p className="text-gray-300 leading-relaxed mb-8 text-lg">
                            {activeTask.description}
                        </p>

                        <div className="bg-gray-900/80 rounded-xl p-6 border border-indigo-500/30 relative overflow-hidden shadow-lg">
                            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                            <h3 className="text-indigo-400 font-bold mb-2 text-sm uppercase tracking-wider">Your Challenge</h3>
                            <p className="text-xl text-white font-medium">
                                {activeTask.challengeText}
                            </p>
                        </div>

                        <div className="mt-12">
                            <button
                                onClick={handleNextTask}
                                className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors"
                            >
                                Skip Task (Debug) <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right: Interactive Area (Chart/Quiz) */}
                <div className="flex-1 bg-black/50 relative flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

                    {/* Conditional Rendering of Interaction Components */}
                    <div className="w-full h-full flex items-center justify-center p-8">
                        {activeTask.type === 'QUIZ' && (
                            <QuizComponent task={activeTask} onComplete={handleNextTask} />
                        )}

                        {(activeTask.type === 'CHART_SELECT' || activeTask.type === 'WAIT' || activeTask.type === 'ACTION' || activeTask.type === 'DRAW_LINE') && (
                            // Mapping various types to ChartSelect for prototype, or specialized mocks if preferred
                            // For now, ChartSelect handles standard chart interactions
                            <ChartSelectComponent task={activeTask} onComplete={handleNextTask} />
                        )}

                        {activeTask.type === 'INFO' && (
                            <div className="bg-gray-800 p-8 rounded-xl max-w-sm text-center">
                                <h3 className="text-xl font-bold mb-4">Information Only</h3>
                                <p className="text-gray-400 mb-6">Read the theory and proceed.</p>
                                <button onClick={handleNextTask} className="px-6 py-2 bg-indigo-600 rounded-lg text-white hover:bg-indigo-500">
                                    Continue
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
