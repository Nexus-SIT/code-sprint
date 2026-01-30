
import React from 'react';
import { Path, Module, Room } from '../types';

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
}> = ({ room, completed, onClick, isRight, index }) => {
  const icons = {
    terminal: '💻', shield: '🛡️', chart: '📊', target: '🎯', sword: '⚔️', lock: '🔒', skull: '💀', heart: '❤️', cat: '🐱'
  };

  return (
    <div
      id={`room-node-${index}`}
      className={`relative flex items-center w-full min-h-[180px] ${isRight ? 'justify-end' : 'justify-start'}`}
    >
      {/* Main Node Container */}
      <div
        className={`relative z-20 flex items-center gap-8 group cursor-pointer transition-transform hover:scale-105 ${isRight ? 'flex-row' : 'flex-row-reverse'}`}
        onClick={onClick}
      >
        {/* Label Content */}
        <div className={`flex flex-col ${isRight ? 'text-left' : 'text-right'}`}>
          <h4 className="text-sm font-black dark:text-slate-200 group-hover:text-lime-400 transition-colors">
            {room.title}
          </h4>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Intro</span>
          {completed && (
            <span className="text-[9px] font-black text-lime-400 mt-1">✓ COMPLETED</span>
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
                {icons[room.iconType] || '📍'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const RoadmapView: React.FC<RoadmapViewProps> = ({ path, completedRooms, onSelectRoom }) => {
  return (
    <div className="flex-1 bg-[#f8fafd] dark:bg-[#0d1117] overflow-y-auto overflow-x-hidden">
      <div className="max-w-[1400px] mx-auto p-4 lg:p-10 flex flex-col lg:flex-row gap-10">

        {/* Left Column: Learning Path */}
        <div className="flex-1 space-y-16">

          {/* Hero Banner */}
          <div className="relative bg-gradient-to-r from-[#051c2c] to-[#0a2e45] rounded-3xl p-10 overflow-hidden text-white border border-slate-800 shadow-2xl">
            <div className="relative z-10">
              <h2 className="text-3xl font-black mb-4 tracking-tight">Ready to level up?</h2>
              <p className="text-sm text-slate-300 mb-8 max-w-md leading-relaxed">
                Take on interactive trading scenarios. Master price action through direct application and capture flags to level up.
              </p>

            </div>
            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 0)', backgroundSize: '20px 20px' }} />
          </div>

          {/* User Section */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center text-4xl shadow-xl border border-slate-700">🐱</div>
              <div>
                <h3 className="text-2xl font-black dark:text-white">Hey Anush!</h3>
                <p className="text-xs text-slate-500 font-medium">Ready for your next mission, operator?</p>
              </div>
            </div>
          </div>

          {/* Modules Path */}
          {path.modules.map((module, modIndex) => (
            <div key={module.id} className="relative">
              {/* Module Header */}
              <div className="bg-[#1e293b] rounded-t-3xl border-t border-x border-slate-700 shadow-xl p-8 relative overflow-hidden">
                <div className="z-10 relative">
                  <span className="text-[10px] font-black text-lime-500 uppercase tracking-[0.3em] block mb-2">Module {modIndex + 1}</span>
                  <h2 className="text-2xl font-black text-white leading-tight mb-2">{module.title}</h2>
                  <p className="text-xs text-slate-400 max-w-lg">{module.description}</p>
                </div>
              </div>

              {/* The Path Map View with Zigzag Lines */}
              <div className="bg-[#161b22] p-12 lg:p-20 relative border border-slate-700 rounded-b-3xl">

                {/* SVG Path Overlay */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                  <defs>
                    <linearGradient id="line-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#84cc16" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#84cc16" stopOpacity="0.1" />
                    </linearGradient>
                  </defs>
                  {module.rooms.map((_, i) => {
                    if (i === module.rooms.length - 1) return null;
                    const isFromRight = i % 2 !== 0;

                    // Logic to draw lines based on staggered nodes
                    // Since nodes are in flex layout, we approximate the path
                    const yStart = 100 + i * 180 + 90; // Approx center of room i
                    const yEnd = 100 + (i + 1) * 180 + 90; // Approx center of room i+1

                    const xStart = isFromRight ? 'calc(100% - 100px)' : '100px';
                    const xEnd = isFromRight ? '100px' : 'calc(100% - 100px)';

                    return (
                      <path
                        key={`path-${i}`}
                        d={`M ${isFromRight ? '70%' : '30%'},${yStart} C ${isFromRight ? '30%' : '70%'},${yStart} ${isFromRight ? '70%' : '30%'},${yEnd} ${isFromRight ? '30%' : '70%'},${yEnd}`}
                        fill="none"
                        stroke="url(#line-grad)"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeDasharray="10, 10"
                        className="animate-path-dash"
                      />
                    );
                  })}
                </svg>

                <div className="max-w-2xl mx-auto flex flex-col relative">
                  {module.rooms.map((room, roomIndex) => (
                    /* Removed unused isLast prop from RoomNode */
                    <RoomNode
                      key={room.id}
                      index={roomIndex}
                      room={room}
                      completed={completedRooms.includes(room.id)}
                      onClick={() => onSelectRoom(modIndex, roomIndex)}
                      isRight={roomIndex % 2 !== 0}
                    />
                  ))}
                </div>

                {/* Module Footer Actions */}
                <div className="mt-20 pt-10 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Recall Mode Enabled</span>
                  </div>
                  <div className="flex gap-4 w-full sm:w-auto">
                    <button
                      onClick={() => onSelectRoom(modIndex, 0)}
                      className="flex-1 sm:flex-none bg-lime-500 hover:bg-lime-400 text-slate-900 font-black px-8 py-2.5 rounded-xl text-xs transition-all shadow-lg shadow-lime-500/10"
                    >
                      Resume learning
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Widgets */}
        <div className="w-full lg:w-[360px] space-y-8">


          <div className="bg-white dark:bg-[#161b22] border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <span className="text-lime-500 text-xl">🔥</span>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">3 Day Streak</span>
            </div>
            <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
              {[
                { label: 'Flags Captured', val: completedRooms.length },
                { label: 'Accuracy', val: '94%' },
                { label: 'Status', val: 'SECURE' }
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  <span>{item.label}</span>
                  <span className="text-lime-500 font-mono">{item.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        @keyframes dash {
          to {
            stroke-dashoffset: -20;
          }
        }
        .animate-path-dash {
          animation: dash 2s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default RoadmapView;
