import React from 'react';
import { Path, UserStats } from '../types';
import { Play, CheckCircle } from 'lucide-react';
import { useStore } from '../store';

interface DashboardViewProps {
    path: Path;
    stats: UserStats;
    completedRooms: string[];
    onSelectRoom: (modIdx: number, roomIdx: number) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ path, stats, completedRooms, onSelectRoom }) => {
    const { theme } = useStore();

    return (
        <div className={`flex-1 overflow-y-auto p-4 md:p-8 
      ${theme === 'dark' ? 'bg-transparent text-gray-100' : 'bg-transparent text-coffee'}
    `}>
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Welcome Card */}
                <div className={`border-4 rounded-xl p-6 shadow-pixel relative overflow-hidden
          ${theme === 'dark'
                        ? 'bg-gray-800 border-gray-700'
                        : 'bg-wood border-wood-dark text-parchment'
                    }
        `}>
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h2 className={`text-2xl md:text-3xl font-bold font-pixel mb-2 
                ${theme === 'dark' ? 'text-amber-400' : 'text-parchment'}
              `}>
                                My Dashboard
                            </h2>
                            <p className={`max-w-xl text-sm md:text-base font-medium
                ${theme === 'dark' ? 'text-gray-400' : 'text-parchment/80'}
              `}>
                                Track your progress across all {stats.totalModules} modules.
                                You have completed {stats.completedModules} modules with a score of {stats.averageScore}%.
                            </p>
                        </div>
                        <div className="flex gap-6">
                            <div className={`p-4 rounded-lg flex flex-col items-center min-w-[100px] border-2
                ${theme === 'dark' ? 'bg-gray-700/50 border-gray-600' : 'bg-wood-dark/50 border-wood-light/30'}
              `}>
                                <div className={`text-3xl font-bold font-pixel
                  ${theme === 'dark' ? 'text-white' : 'text-parchment'}
                `}>{stats.completedModules}</div>
                                <div className={`text-[10px] uppercase font-bold tracking-widest
                  ${theme === 'dark' ? 'text-gray-400' : 'text-wood-light'}
                `}>Done</div>
                            </div>
                            <div className={`p-4 rounded-lg flex flex-col items-center min-w-[100px] border-2
                ${theme === 'dark' ? 'bg-gray-700/50 border-gray-600' : 'bg-wood-dark/50 border-wood-light/30'}
              `}>
                                <div className="text-3xl font-bold font-pixel text-green-400">{stats.averageScore}%</div>
                                <div className={`text-[10px] uppercase font-bold tracking-widest
                  ${theme === 'dark' ? 'text-gray-400' : 'text-wood-light'}
                `}>Avg</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modules Grid */}
                <div className="grid grid-cols-1 gap-6">
                    {path.modules.map((module, modIdx) => (
                        <div key={module.id} className={`rounded-xl border-4 overflow-hidden shadow-pixel transition-transform hover:scale-[1.01]
              ${theme === 'dark'
                                ? 'bg-gray-800 border-gray-700'
                                : 'bg-parchment border-wood'
                            }
            `}>
                            <div className={`p-6 border-b-4
                ${theme === 'dark' ? 'border-gray-700' : 'bg-wood-light/20 border-wood-light/50'}
              `}>
                                <div className={`text-[10px] font-black uppercase tracking-widest mb-1
                    ${theme === 'dark' ? 'text-indigo-400' : 'text-wood-dark'}
                `}>Module {modIdx + 1}</div>
                                <h3 className={`text-xl font-bold font-pixel
                    ${theme === 'dark' ? 'text-white' : 'text-coffee'}
                `}>{module.title}</h3>
                                <p className={`text-sm mt-2 font-medium
                    ${theme === 'dark' ? 'text-gray-400' : 'text-coffee/70'}
                `}>{module.description}</p>
                            </div>
                            <div className={`p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3
                ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-wood/5'}
              `}>
                                {module.rooms.map((room, roomIdx) => {
                                    const isCompleted = completedRooms.includes(room.id);
                                    return (
                                        <button
                                            key={room.id}
                                            onClick={() => onSelectRoom(modIdx, roomIdx)}
                                            className={`flex items-center gap-3 p-3 rounded-lg border-2 text-left transition-all active:scale-95
                          ${isCompleted
                                                    ? (theme === 'dark'
                                                        ? 'bg-green-900/20 border-green-800'
                                                        : 'bg-green-100 border-green-300')
                                                    : (theme === 'dark'
                                                        ? 'bg-gray-800/50 border-gray-700 hover:border-gray-500'
                                                        : 'bg-white/50 border-wood-light hover:border-wood')
                                                }
                       `}
                                        >
                                            <div className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 border
                          ${isCompleted
                                                    ? 'bg-green-500 text-white border-green-600'
                                                    : (theme === 'dark' ? 'bg-gray-700 text-gray-500 border-gray-600' : 'bg-wood-light text-wood-dark border-wood')
                                                }
                       `}>
                                                {isCompleted ? <CheckCircle size={16} /> : <Play size={14} fill="currentColor" />}
                                            </div>
                                            <div className="overflow-hidden">
                                                <div className={`text-sm font-bold font-pixel truncate
                            ${isCompleted
                                                        ? 'text-green-600 dark:text-green-400'
                                                        : (theme === 'dark' ? 'text-gray-300' : 'text-coffee')
                                                    }
                        `}>
                                                    {room.title}
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DashboardView;