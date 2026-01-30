import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Monitor, Layout, GitBranch } from 'lucide-react';
import { TRADER_PATH } from '../data/mockData';
import RoadmapView from './RoadmapView';
import DashboardView from './DashboardView';
import { Path } from '../types';

const RoadmapPage: React.FC = () => {
    const navigate = useNavigate();
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
        <div className="min-h-screen bg-[#111217] text-gray-100 font-sans selection:bg-indigo-500 overflow-x-hidden flex flex-col">
            {/* Header */}
            <header className="bg-[#1a1b26] border-b border-gray-800 p-4 sticky top-0 z-50 shadow-md">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white transition-colors flex items-center gap-1">
                            &larr; <span className="hidden md:inline">Home</span>
                        </button>
                        <h1 className="text-xl font-bold text-white flex items-center gap-2">
                            <Monitor className="text-indigo-500" />
                            <span className="hidden sm:inline">Trading Valley Path</span>
                        </h1>
                    </div>

                    {/* View Toggle */}
                    <div className="flex bg-gray-900/50 p-1 rounded-lg border border-gray-700 backdrop-blur-sm">
                        <button
                            onClick={() => setViewMode('dashboard')}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'dashboard' ? 'bg-gray-700 text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'}`}
                        >
                            <Layout size={14} /> Dashboard
                        </button>
                        <button
                            onClick={() => setViewMode('path')}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'path' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'}`}
                        >
                            <GitBranch size={14} /> Path
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1 flex flex-col">
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
        </div>
    );
};

export default RoadmapPage;
