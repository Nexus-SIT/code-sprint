import React from 'react';
import { motion } from 'framer-motion';
import { Path, Room } from '../types';
import Mascot from './Mascot';
import { useStore } from '../store';

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
      {/* Main Node Container */}
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

        {/* 3D Platform Wrapper */}
        <div className="relative w-32 h-24 flex items-center justify-center">
          {/* Shadow/Base */}
          <div className="absolute bottom-2 w-24 h-12 bg-black/20 rounded-[100%] blur-md" />

          {/* The Isometric Block */}
          <div className="relative w-24 h-14">
            {/* Top Surface */}
            <div className={`absolute top-0 w-full h-full rounded-xl transition-all duration-300 
              ${completed ? 'bg-lime-500' : 'bg-[#2d4a3e] group-hover:bg-[#3d5a4e]'} 
              border-b-8 border-black/20 shadow-lg`}
              style={{ transform: 'rotateX(45deg) rotateZ(-10deg)' }}
            >
              {/* Inner highlight */}
              <div className="absolute inset-1 border border-white/10 rounded-lg" />
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

          {/* User Section - Mascot */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <Mascot state="happy" message="Ready for your next mission, farmer?" />
              <div>
                <h3 className={`text-2xl font-bold font-pixel
                    ${theme === 'dark' ? 'text-white' : 'text-wood-dark'}
                `}>Hello Trader!</h3>
                <p className={`text-xs font-bold font-pixel uppercase
                    ${theme === 'dark' ? 'text-gray-500' : 'text-wood-light'}
                `}>Let's harvest some profits today!</p>
              </div>
            </div>
          </div>

          {/* Modules Path */}
          {path.modules.map((module, modIndex) => (
            <div key={module.id} className="relative">
              {/* Module Header */}
              <div className={`rounded-t-2xl border-4 border-b-0 shadow-sm p-8 relative overflow-hidden
                 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-wood border-wood-dark'}
              `}>
                <div className="z-10 relative">
                  <span className={`text-[10px] font-black uppercase tracking-[0.3em] block mb-2
                     ${theme === 'dark' ? 'text-indigo-400' : 'text-parchment/70'}
                  `}>Module {modIndex + 1}</span>
                  <h2 className={`text-2xl font-bold font-pixel leading-tight mb-2
                     ${theme === 'dark' ? 'text-white' : 'text-parchment'}
                  `}>{module.title}</h2>
                  <p className={`text-xs max-w-lg
                     ${theme === 'dark' ? 'text-gray-400' : 'text-parchment/80'}
                  `}>{module.description}</p>
                </div>
              </div>

              {/* The Path Map View */}
              <div className={`p-12 lg:p-20 relative border-4 border-t-0 rounded-b-2xl
                 ${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-parchment border-wood-dark'}
              `}>

                {/* SVG Path Overlay */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                  {module.rooms.map((_, i) => {
                    if (i === module.rooms.length - 1) return null;
                    const isFromRight = i % 2 !== 0;

                    // Logic to draw lines based on staggered nodes
                    // Since nodes are in flex layout, we approximate the path
                    const yStart = 100 + i * 160 + 80; // Approx center of room i (based on min-h-160)
                    const yEnd = 100 + (i + 1) * 160 + 80; // Approx center of room i+1

                    const xStart = isFromRight ? 'calc(100% - 100px)' : '100px';
                    const xEnd = isFromRight ? '100px' : 'calc(100% - 100px)';

                    return (
                      <path
                        key={`path-${i}`}
                        d={`M ${isFromRight ? '70%' : '30%'},${yStart} C ${isFromRight ? '30%' : '70%'},${yStart} ${isFromRight ? '70%' : '30%'},${yEnd} ${isFromRight ? '30%' : '70%'},${yEnd}`}
                        fill="none"
                        stroke={theme === 'dark' ? '#374151' : '#8b4513'}
                        strokeOpacity={theme === 'dark' ? '0.5' : '0.2'}
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeDasharray="12, 12"
                        className="animate-path-dash"
                      />
                    );
                  })}
                </svg>

                <div className="max-w-2xl mx-auto flex flex-col relative z-20">
                  {module.rooms.map((room, roomIndex) => (
                    <RoomNode
                      key={room.id}
                      index={roomIndex}
                      room={room}
                      completed={completedRooms.includes(room.id)}
                      onClick={() => onSelectRoom(modIndex, roomIndex)}
                      isRight={roomIndex % 2 !== 0}
                      theme={theme}
                    />
                  ))}
                </div>

                {/* Module Footer Actions */}
                <div className={`mt-20 pt-10 border-t-2 flex flex-col sm:flex-row items-center justify-between gap-6
                    ${theme === 'dark' ? 'border-gray-800' : 'border-wood/20'}
                `}>
                  <div className="flex items-center gap-4">
                    <span className={`text-[10px] font-black uppercase tracking-widest
                        ${theme === 'dark' ? 'text-gray-500' : 'text-wood-light'}
                    `}>Active Recall Mode Enabled</span>
                  </div>
                  <div className="flex gap-4 w-full sm:w-auto">
                    <button
                      onClick={() => onSelectRoom(modIndex, 0)}
                      className={`flex-1 sm:flex-none font-bold px-8 py-2.5 rounded-xl text-xs transition-all shadow-lg active:scale-95
                        ${theme === 'dark' ? 'bg-indigo-600 text-white hover:bg-indigo-500' : 'bg-wood text-parchment hover:bg-wood-dark'}
                      `}
                    >
                      RESUME LEARNING
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Widgets */}
        <div className="w-full lg:w-[360px] space-y-8">
          <div className={`border-4 rounded-xl p-8 shadow-pixel
             ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-parchment border-wood'}
          `}>
            <div className="flex justify-between items-center mb-6">
              <h4 className={`font-bold font-pixel text-sm
                 ${theme === 'dark' ? 'text-white' : 'text-coffee'}
              `}>Teams & Workspaces</h4>
            </div>
            <p className={`text-xs leading-relaxed mb-8
                 ${theme === 'dark' ? 'text-gray-400' : 'text-coffee/70'}
            `}>
              Collaborate with other farmers and compete in group leaderboards.
            </p>
            <button className={`w-full font-bold py-4 rounded-xl text-[11px] uppercase tracking-widest transition-all border-b-4 active:border-b-0 active:translate-y-1
                ${theme === 'dark'
                ? 'bg-gray-700 hover:bg-gray-600 text-white border-gray-900'
                : 'bg-wood hover:bg-wood-dark text-parchment border-wood-dark'}
            `}>
              Browse Workspaces
            </button>
          </div>

          <div className={`border-4 rounded-xl p-8 shadow-pixel
             ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-parchment border-wood'}
          `}>
            <div className="flex items-center gap-3 mb-8">
              <span className="text-xl">🔥</span>
              <span className={`text-[10px] font-black uppercase tracking-widest
                 ${theme === 'dark' ? 'text-gray-500' : 'text-wood-light'}
              `}>3 Day Streak</span>
            </div>
            <div className={`space-y-4 pt-6 border-t-2
                 ${theme === 'dark' ? 'border-gray-700' : 'border-wood/20'}
            `}>
              {[
                { label: 'Flags Captured', val: completedRooms.length },
                { label: 'Accuracy', val: '94%' },
                { label: 'Status', val: 'SECURE' }
              ].map((item, i) => (
                <div key={i} className={`flex justify-between items-center text-[10px] font-black uppercase tracking-widest
                     ${theme === 'dark' ? 'text-gray-500' : 'text-wood-light'}
                `}>
                  <span>{item.label}</span>
                  <span className={`font-pixel font-bold
                     ${theme === 'dark' ? 'text-indigo-400' : 'text-coffee'}
                  `}>{item.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s infinite ease-in-out;
        }
        @keyframes dash {
          to {
            stroke-dashoffset: -24;
          }
        }
        .animate-path-dash {
          animation: dash 3s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default RoadmapView;
