
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
      className={`relative flex items-center w-full min-h-[160px] ${isRight ? 'justify-end pr-12 lg:pr-32' : 'justify-start pl-12 lg:pl-32'}`}
    >
      <div
        className={`relative z-20 flex items-center gap-10 group cursor-pointer transition-all duration-300 ${isRight ? 'flex-row' : 'flex-row-reverse'}`}
        onClick={onClick}
      >
        {/* Label Content */}
        <div className={`flex flex-col ${isRight ? 'text-left' : 'text-right'} min-w-[150px]`}>
          <h4 className="text-base font-black text-white group-hover:text-lime-400 transition-colors tracking-tight">
            {room.title}
          </h4>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">INTRO</span>
          {completed && (
            <div className={`flex items-center gap-1 mt-1 ${isRight ? 'justify-start' : 'justify-end'}`}>
              <span className="text-[9px] font-black text-lime-400">✓ COMPLETED</span>
            </div>
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

            {/* Icon */}
            <div className="absolute inset-0 flex items-center justify-center text-4xl -translate-y-12 -rotate-x-12 rotate-z-25 animate-float pointer-events-none">
              <span className="drop-shadow-2xl group-hover:-translate-y-3 transition-transform duration-700 block" style={{ transform: 'rotateX(-55deg) rotateZ(25deg)' }}>
                {icons[room.iconType] || '📍'}
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
  return (
    <div className="flex-1 bg-[#0d1117] overflow-y-auto overflow-x-hidden selection:bg-lime-500/30">
      <div className="max-w-[1000px] mx-auto p-4 lg:p-12 space-y-12">

        {/* Header Section with Mascot */}
        <div className="flex flex-col md:flex-row items-center justify-between bg-[#161b22] p-8 rounded-3xl border border-slate-800 shadow-2xl gap-6">
          <div className="flex items-center gap-6">
            <Mascot state="happy" message="Chart ready. Awaiting orders, Operator." />
            <div>
              <h1 className="text-3xl font-black text-white mb-2 tracking-tight">TradeHack Operations</h1>
              <p className="text-slate-400 font-medium">
                Current Mission: <span className="text-lime-400">Master Market Structure</span>
              </p>
            </div>
          </div>

          <div className="flex gap-4 text-center">
            <div className="bg-[#0d1117] p-4 rounded-xl border border-slate-800">
              <div className="text-2xl font-black text-white">{completedRooms.length}</div>
              <div className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Flags</div>
            </div>
            <div className="bg-[#0d1117] p-4 rounded-xl border border-slate-800">
              <div className="text-2xl font-black text-lime-500">94%</div>
              <div className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Accuracy</div>
            </div>
          </div>
        </div>

        {path.modules.map((module, modIndex) => (
          <div key={module.id} className="relative rounded-[40px] overflow-hidden border border-slate-800 shadow-2xl bg-[#11161d]">

            {/* Module Header */}
            <div className="bg-[#1c2431] p-10 lg:p-12 border-b border-slate-800">
              <span className="text-[10px] font-black text-lime-500 uppercase tracking-[0.4em] block mb-3">Module {modIndex + 1}</span>
              <h2 className="text-3xl lg:text-4xl font-black text-white leading-tight mb-3 tracking-tighter">
                {module.title}
              </h2>
              <p className="text-sm text-slate-400 font-medium max-w-xl leading-relaxed">
                {module.description}
              </p>
            </div>

            {/* Path Content */}
            <div className="relative p-12 lg:p-20 bg-[#0d1117]">

              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-slate-800 to-transparent opacity-50 hidden lg:block" />

              <div className="flex flex-col gap-4 relative">
                {module.rooms.map((room, roomIndex) => (
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

              {/* Module Action Footer */}
              <div className="mt-20 pt-10 border-t border-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-lime-500 animate-pulse shadow-[0_0_10px_rgba(132,204,22,0.5)]" />
                  <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.25em]">Active Recall Mode Enabled</span>
                </div>

                <button
                  onClick={() => {
                    const firstUncompleted = module.rooms.findIndex(r => !completedRooms.includes(r.id));
                    onSelectRoom(modIndex, firstUncompleted === -1 ? 0 : firstUncompleted);
                  }}
                  className="w-full sm:w-auto bg-lime-500 hover:bg-lime-400 text-slate-900 font-black px-10 py-4 rounded-2xl text-sm transition-all shadow-xl shadow-lime-500/20 active:scale-95 hover:-translate-y-0.5"
                >
                  Resume learning
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(2deg); }
        }
        .animate-float {
          animation: float 4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: #0d1117;
        }
        ::-webkit-scrollbar-thumb {
          background: #1c2431;
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #2d3a4d;
        }
      `}</style>
    </div>
  );
};

export default RoadmapView;
