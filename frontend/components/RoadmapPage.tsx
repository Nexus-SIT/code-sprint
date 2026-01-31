import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Monitor, Layout, GitBranch, ArrowLeft } from 'lucide-react';
import { modules } from './learning/modulesData';
import RoadmapView from './RoadmapView';

import { Path, Module, Room } from '../types';
import { useStore } from '../store';

const RoadmapPage: React.FC = () => {
    const navigate = useNavigate();
    const { theme, completedModules } = useStore();


    // Helper to convert our flat modules to the Path structure
    const createPathFromModules = (): Path => {
        const createSection = (id: string, title: string, desc: string, moduleSlice: typeof modules) => ({
            id,
            title,
            description: desc,
            rooms: moduleSlice.map(m => ({
                id: m.id,
                title: m.title,
                description: m.description,
                iconType: 'chart', // Default icon
                tasks: [],
                // Custom prop to store the original module
                originalModule: m
            } as any as Room)) // Type casting to satisfy Room interface which is slightly different
        });

        return {
            id: 'learning-path',
            title: 'Trading Mastery Path',
            description: 'Master the markets step by step.',
            modules: [
                createSection('sect-1', '🟢 The Basics', 'Foundation of knowledge', modules.slice(0, 5)),
                createSection('sect-2', '🟡 Technical Analysis', 'Reading the charts', modules.slice(5, 10)),
                createSection('sect-3', '🟠 Advanced Concepts', 'Professional strategies', modules.slice(10, 15)),
                createSection('sect-4', '🔴 Mastery & Psychology', 'The final steps', modules.slice(15, 18)),
            ]
        };
    };

    const learningPath = createPathFromModules();

    const handleEnterRoom = (moduleIndex: number, roomIndex: number) => {
        const section = learningPath.modules[moduleIndex];
        const room = section.rooms[roomIndex];
        // Navigate to the new learning mode route
        navigate(`/module/${room.id}`);
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
                        {/* <h1 className={`text-xl font-bold font-pixel flex items-center gap-2
                            ${theme === 'dark' ? 'text-amber-400' : 'text-wood-light'}
                        `}>
                            <Monitor className={theme === 'dark' ? 'text-indigo-400' : 'text-wood-light'} />
                            <span className="hidden sm:inline">CandleCrush - Trading Valley Path</span>
                        </h1> */}
                    </div>
                </div>
            </header>

            <main className="flex-1 flex flex-col relative z-10">
                <RoadmapView
                    path={learningPath}
                    completedRooms={completedModules}
                    onSelectRoom={handleEnterRoom}
                />
            </main>

            {/* Background Pattern for Light Mode */}
            {
                theme !== 'dark' && (
                    <div className="absolute inset-0 pointer-events-none opacity-10 z-0" style={{ backgroundImage: "url('/tile.png')", backgroundSize: '128px' }}></div>
                )
            }
        </div >
    );
};

export default RoadmapPage;
