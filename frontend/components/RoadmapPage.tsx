import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Monitor, Layout, GitBranch, ArrowLeft } from 'lucide-react';
import { TRADER_PATH } from '../data/mockData';
import RoadmapView from './RoadmapView';
import DashboardView from './DashboardView';
import { Path } from '../types';
import { useStore } from '../store';

const RoadmapPage: React.FC = () => {
    const navigate = useNavigate();
    const { theme } = useStore();
    const [viewMode, setViewMode] = useState<'dashboard' | 'path'>('path');
    const [completedRooms, setCompletedRooms] = useState<string[]>(['r1']); // Updated ID to match mockData

    // Use the path from mockData
    const learningPath = TRADER_PATH;

    const handleEnterRoom = (moduleIndex: number, roomIndex: number) => {
        const module = learningPath.modules[moduleIndex];
        if (module && module.rooms[roomIndex]) {
            const room = module.rooms[roomIndex];
            navigate(`/learn/${module.id}/${room.id}`);
        }
    };

    // Calculate stats for Dashboard
    const stats = {
        totalModules: learningPath.modules.length,
        completedModules: 0,
        averageScore: 94,
        updateBalance: () => { }
    };

    return (
        <div className={`min-h-screen font-body selection:bg-wood-light selection:text-parchment overflow-x-hidden flex flex-col transition-colors duration-300
            ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-parchment text-coffee'}
        `}>
            {/* Header */}
            <header className={`p-4 sticky top-0 z-50 shadow-pixel border-b-4 
                ${theme === 'dark'
                    ? 'bg-gray-800 border-gray-700'
                    : 'bg-wood border-wood-dark'
                }`}>
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/')}
                            className={`transition-colors flex items-center gap-2 font-pixel text-xs px-3 py-1 rounded
                                ${theme === 'dark'
                                    ? 'bg-red-500/20 text-red-400 hover:bg-red-500/40 border border-red-500/50'
                                    : 'bg-failure text-white border-b-4 border-red-900 active:border-b-0 active:translate-y-1 active:mt-1 hover:bg-red-700'
                                }`}
                        >
                            <ArrowLeft size={16} /> <span className="hidden md:inline">EXIT</span>
                        </button>
                        <h1 className={`text-xl font-bold font-pixel flex items-center gap-2
                            ${theme === 'dark' ? 'text-amber-400' : 'text-wood-light'}
                        `}>
                            <Monitor className={theme === 'dark' ? 'text-indigo-400' : 'text-wood-light'} />
                            <span className="hidden sm:inline">Trading Valley Path</span>
                        </h1>
                    </div>

                    {/* View Toggle */}
                    <div className={`flex p-1 rounded-lg border backdrop-blur-sm
                        ${theme === 'dark' ? 'bg-gray-900/50 border-gray-700' : 'bg-wood-dark/50 border-wood-light'}
                    `}>
                        <button
                            onClick={() => setViewMode('dashboard')}
                            className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-pixel transition-all
                                ${viewMode === 'dashboard'
                                    ? (theme === 'dark' ? 'bg-gray-700 text-white shadow-sm' : 'bg-parchment text-wood-dark shadow-sm')
                                    : (theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-wood-light hover:text-parchment')
                                }`}
                        >
                            <Layout size={14} /> DASHBOARD
                        </button>
                        <button
                            onClick={() => setViewMode('path')}
                            className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-pixel transition-all
                                ${viewMode === 'path'
                                    ? (theme === 'dark' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-parchment text-wood-dark shadow-sm')
                                    : (theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-wood-light hover:text-parchment')
                                }`}
                        >
                            <GitBranch size={14} /> PATH
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1 flex flex-col relative z-10">
                {viewMode === 'dashboard' ? (
                    <DashboardView
                        path={learningPath}
                        stats={stats}
                        completedRooms={completedRooms}
                        onSelectRoom={handleEnterRoom}
                    />
                ) : (
                    <RoadmapView
                        path={learningPath}
                        completedRooms={completedRooms}
                        onSelectRoom={handleEnterRoom}
                    />
                )}
            </main>

            {/* Background Pattern for Light Mode */}
            {theme !== 'dark' && (
                <div className="absolute inset-0 pointer-events-none opacity-10 z-0" style={{ backgroundImage: "url('/tile.png')", backgroundSize: '128px' }}></div>
            )}
        </div>
    );
};

export default RoadmapPage;
