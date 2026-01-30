import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Monitor } from 'lucide-react';
import { CURRICULUM } from '../data/curriculum';
import RoadmapView from './RoadmapView';
import { Path } from '../types';

const RoadmapPage: React.FC = () => {
    const navigate = useNavigate();

    // Mock user data - normally would come from a context or store
    const [completedRooms, setCompletedRooms] = useState<string[]>(['room-1-1']);

    // Construct the Path object required by RoadmapView
    const learningPath: Path = {
        id: 'main-path',
        title: 'Trading Valley InfoSec',
        description: 'From Script Kiddie to Elite Operator',
        modules: CURRICULUM
    };

    const handleEnterRoom = (moduleIndex: number, roomIndex: number) => {
        const module = CURRICULUM[moduleIndex];
        if (module && module.rooms[roomIndex]) {
            const room = module.rooms[roomIndex];
            navigate(`/learning/module/${module.id}/topic/${room.id}`);
        }
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
                </div>
            </header>

            <main className="flex-1 flex flex-col">
                <RoadmapView
                    path={learningPath}
                    completedRooms={completedRooms}
                    onSelectRoom={handleEnterRoom}
                />
            </main>
        </div>
    );
};

export default RoadmapPage;
