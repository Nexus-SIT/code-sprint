import React from 'react';
import { motion } from 'framer-motion';
import { Path, Room } from '../types';
import Mascot from './Mascot';
import { useStore } from '../store';

const RoomNode: React.FC<{
  room: Room;
  completed: boolean;
  onClick: () => void;
  isRight: boolean;
  index: number;
  theme: 'light' | 'dark';
}> = ({ room, completed, onClick, isRight, index, theme }) => {
  const icons: Record<string, string> = {
    terminal: '💻',
    shield: '🛡️',
    chart: '📊',
    target: '🎯',
    sword: '⚔️',
    lock: '🔒',
    skull: '💀',
    heart: '❤️',
    cat: '🐱'
  };

  return (
    <div
      id={`room-node-${index}`}
      className={`relative flex items-center w-full min-h-[160px] ${isRight ? 'justify-end' : 'justify-start'
        }`}
    >
      <div
        onClick={onClick}
        className={`relative z-20 flex items-center gap-6 cursor-pointer group transition-transform hover:scale-105 ${isRight ? 'flex-row' : 'flex-row-reverse'
          }`}
      >
        {/* Label */}
        <div className={`flex flex-col ${isRight ? 'text-left' : 'text-right'}`}>
          <h4
            className={`text-sm font-bold font-pixel transition-colors ${theme === 'dark'
              ? 'text-slate-200 group-hover:text-amber-400'
              : 'text-coffee group-hover:text-amber-600'
              }`}
          >
            {room.title}
          </h4>

          <span
            className={`text-[10px] font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-slate-500' : 'text-wood-light'
              }`}
          >
            Click to Start
          </span>

          {completed && (
            <span className="text-[10px] font-black text-green-500 mt-1">
              ✓ COMPLETED
            </span>
          )}
        </div>

        {/* Isometric Platform */}
        <div className="relative w-32 h-24 flex items-center justify-center">
          {/* Shadow */}
          <div className="absolute bottom-2 w-24 h-12 bg-black/20 rounded-[100%] blur-md" />

          {/* Platform */}
          <div className="relative w-24 h-14">
            <div
              className={`absolute top-0 w-full h-full rounded-xl transition-all duration-300
                ${completed
                  ? 'bg-lime-500'
                  : 'bg-[#2d4a3e] group-hover:bg-[#3d5a4e]'
                }
                border-b-8 border-black/20 shadow-lg`}
              style={{ transform: 'rotateX(45deg) rotateZ(-10deg)' }}
            >
              <div className="absolute inset-1 border border-white/10 rounded-lg" />
            </div>

            {/* Floating Icon */}
            <div className="absolute inset-0 flex items-center justify-center text-3xl -mt-6 drop-shadow-xl animate-bounce-slow">
              {icons[room.iconType] || '📍'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface RoadmapViewProps {
  path: Path;
  completedRooms: string[];
  onSelectRoom: (moduleIndex: number, roomIndex: number) => void;
}

const RoadmapView: React.FC<RoadmapViewProps> = ({ path, completedRooms, onSelectRoom }) => {
  const { theme } = useStore();

  return (
    <div className={`flex-1 overflow-y-auto overflow-x-hidden p-4 lg:p-10
        ${theme === 'dark' ? 'bg-transparent' : 'bg-transparent'}
    `}>
      <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-10">

        {/* Left Column: Learning Path */}
        <div className="flex-1 space-y-16">

          {/* Hero Banner (Quest Board Style) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.02 }}
            className={`relative rounded-xl p-8 overflow-hidden shadow-pixel border-4
             ${theme === 'dark'
                ? 'bg-gray-800 border-gray-700 text-gray-100'
                : 'bg-parchment border-wood text-coffee'
              }
          `}>
            <div className="relative z-10">
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className={`text-2xl md:text-3xl font-bold font-pixel mb-4 tracking-tight
                ${theme === 'dark' ? 'text-amber-400' : 'text-wood-dark'}
              `}>Quest Board: Trading Mastery</motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className={`text-sm mb-6 max-w-md leading-relaxed font-medium
                ${theme === 'dark' ? 'text-gray-400' : 'text-coffee/80'}
              `}>
                Take on interactive trading scenarios. Master price action through direct application and capture flags to level up.
              </motion.p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`font-bold px-6 py-3 rounded-lg flex items-center gap-3 transition-all shadow-pixel active:scale-95 border-b-4 active:border-b-0 active:translate-y-1
                 ${theme === 'dark' ? 'bg-indigo-600 border-indigo-800 hover:bg-indigo-500 text-white' : 'bg-success text-white border-green-800 hover:bg-green-600'}
              `}>
                <span className="text-lg">▶</span>
                <span className="font-pixel text-xs">PLAY NOW</span>
              </motion.button>
            </div>
            {/* Decorative pattern */}
            {theme !== 'dark' && <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#8b4513 1px, transparent 0)', backgroundSize: '20px 20px' }} />}
          </motion.div>

          {/* Snake Path Layout */}
          <div className="relative flex flex-col gap-4">
            {module.rooms.map((room, rIdx) => (
              <RoomNode
                key={room.id}
                room={room}
                completed={completedRooms.includes(room.id)}
                onClick={() => onSelectRoom(mIdx, rIdx)}
                isRight={rIdx % 2 !== 0}
                index={rIdx}
                theme={theme}
              />
            ))}
          </div>
        </div>
      ))}
      </div>
      );
};

      export default RoadmapView;
