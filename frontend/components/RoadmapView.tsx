import React from 'react';
import { Path, Room } from '../types';
import { useStore } from '../store';
import { Play, CheckCircle, Flag } from 'lucide-react';

interface RoadmapViewProps {
  path: Path;
  completedRooms: string[];
  onSelectRoom: (moduleIndex: number, roomIndex: number) => void;
}

const RoomNode: React.FC<{
  room: Room;
  completed: boolean;
  onClick: () => void;
  isRight: boolean;
  index: number;
  theme: 'light' | 'dark';
}> = ({ room, completed, onClick, isRight, index, theme }) => {
  const icons: Record<string, string> = {
    terminal: '💻', shield: '🛡️', chart: '📊', target: '🎯', sword: '⚔️', lock: '🔒', skull: '💀', heart: '❤️', cat: '🐱'
  };

  return (
    <div
      id={`room-node-${index}`}
      className={`relative flex items-center w-full min-h-[160px] ${isRight ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`relative z-20 flex items-center gap-6 group cursor-pointer transition-transform hover:scale-105 ${isRight ? 'flex-row' : 'flex-row-reverse'}`}
        onClick={onClick}
      >
        {/* Label Content */}
        <div className={`flex flex-col ${isRight ? 'text-left' : 'text-right'}`}>
          <h4 className={`text-sm font-bold font-pixel transition-colors
            ${theme === 'dark' ? 'text-slate-200 group-hover:text-amber-400' : 'text-coffee group-hover:text-amber-600'}
          `}>
            {room.title}
          </h4>
          <span className={`text-[10px] font-bold uppercase tracking-widest
            ${theme === 'dark' ? 'text-slate-500' : 'text-wood-light'}
          `}>Click to Start</span>
          {completed && (
            <span className="text-[10px] font-black text-green-500 mt-1">✓ COMPLETED</span>
          )}
        </div>

        {/* Isometric 3D Platform */}
        <div className="relative w-32 h-24 flex items-center justify-center">
          <div className="absolute bottom-2 w-24 h-8 bg-black/40 rounded-[100%] blur-lg opacity-50" />

          <div className="relative w-24 h-12 transform-gpu" style={{ transform: 'rotateX(55deg) rotateZ(-25deg)' }}>
            {/* Front Side */}
            <div className={`absolute top-4 left-0 w-full h-full rounded-xl ${completed ? 'bg-lime-700' : 'bg-slate-800'} border-b-8 border-black/30`} />

            {/* Top Surface */}
            <div className={`absolute top-0 left-0 w-full h-full rounded-xl transition-all duration-300 shadow-xl
              ${completed ? 'bg-lime-500' : 'bg-[#2d3a35] group-hover:bg-[#3d4a45]'} 
              border border-white/10`}
            >
              <div className="absolute inset-2 border border-white/5 rounded-lg" />
            </div>

            {/* The Icon (Floating above) */}
            <div className="absolute inset-0 flex items-center justify-center text-3xl mb-8 filter drop-shadow-xl animate-float">
              <span className="group-hover:-translate-y-2 transition-transform duration-500">
                {icons[room.iconType as keyof typeof icons] || '📍'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import Mascot from './Mascot';

const RoadmapView: React.FC<RoadmapViewProps> = ({ path, completedRooms, onSelectRoom }) => {
  const { theme } = useStore();

  // Calculate Progress
  const totalFlags = path.modules.reduce((acc, module) => acc + module.rooms.length, 0);
  const collectedFlags = completedRooms.length;

  return (
    <div className={`flex-1 overflow-y-auto p-6 md:p-12 relative
      ${theme === 'dark' ? 'bg-transparent text-gray-100' : 'bg-transparent text-coffee'}
    `}>
      {/* Flags Counter */}
      <div className={`absolute top-6 right-6 md:top-12 md:right-12 flex items-center gap-3 px-4 py-2 border-4 rounded-xl font-bold font-pixel shadow-pixel z-10
        ${theme === 'dark'
          ? 'bg-gray-800 border-gray-700 text-amber-400'
          : 'bg-parchment border-wood text-wood-dark'}
      `}>
        <Flag className="w-5 h-5 fill-current animate-pulse" />
        <span className="text-xl md:text-2xl tracking-widest">{collectedFlags} / {totalFlags}</span>
      </div>

      <div className="max-w-4xl mx-auto space-y-12">
        <header className="space-y-4 relative">


          <h1 className={`text-2xl md:text-3xl font-bold font-pixel
            ${theme === 'dark' ? 'text-amber-400' : 'text-wood-dark'}
          `}>
            CandleCrush-Trading Valley
          </h1>
          <p className={`max-w-2xl font-medium opacity-80
            ${theme === 'dark' ? 'text-gray-400' : 'text-coffee/80'}
          `}>
            Embark on a journey to master the financial markets. Follow the sections below to unlock new levels of knowledge and test your skills.
          </p>
        </header>

        <div className="space-y-10">
          {path.modules.map((module, modIdx) => (
            <div key={module.id} className={`rounded-2xl border-4 overflow-hidden shadow-pixel
              ${theme === 'dark'
                ? 'bg-gray-800 border-gray-700'
                : 'bg-parchment border-wood'
              }
            `}>
              {/* Module Header */}
              <div className={`p-6 border-b-4
                ${theme === 'dark'
                  ? 'bg-gray-900/50 border-gray-700'
                  : 'bg-wood-light/20 border-wood-light/50 text-wood-dark'}
              `}>
                <div className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-60">
                  MODULE {modIdx + 1}
                </div>
                <h2 className="text-xl font-bold font-pixel">{module.title}</h2>
                <p className="text-sm mt-2 opacity-80">{module.description}</p>
              </div>

              {/* Rooms List */}
              <div className="divide-y-2 divide-black/5 dark:divide-white/5">
                {module.rooms.map((room, roomIdx) => {
                  const isCompleted = completedRooms.includes(room.id);
                  return (
                    <button
                      key={room.id}
                      onClick={() => onSelectRoom(modIdx, roomIdx)}
                      className={`w-full flex items-center justify-between p-5 transition-all hover:bg-black/5 dark:hover:bg-white/5 active:scale-[0.99] group text-left`}
                    >
                      <div className="flex items-center gap-5">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 shrink-0 transition-transform group-hover:scale-110
                          ${isCompleted
                            ? 'bg-green-500 border-green-600 text-white'
                            : (theme === 'dark'
                              ? 'bg-gray-700 border-gray-600 text-gray-400'
                              : 'bg-wood-light border-wood text-wood-dark')
                          }
                        `}>
                          {isCompleted ? <CheckCircle size={24} /> : <Play size={22} fill="currentColor" />}
                        </div>
                        <div>
                          <h3 className={`font-bold font-pixel text-lg
                            ${theme === 'dark' ? 'text-gray-200' : 'text-coffee'}
                          `}>
                            {room.title}
                          </h3>
                          <p className="text-sm opacity-60 line-clamp-1">{room.description || 'Master this topic'}</p>
                        </div>
                      </div>

                      <div className="hidden sm:block">
                        {isCompleted ? (
                          <span className="text-[10px] font-black text-green-500 px-3 py-1.5 bg-green-500/10 rounded-full uppercase tracking-tighter">
                            Completed
                          </span>
                        ) : (
                          <span className={`text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-tighter
                            ${theme === 'dark' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-wood/10 text-wood-dark'}
                          `}>
                            Start Quest
                          </span>
                        )}
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

export default RoadmapView;
