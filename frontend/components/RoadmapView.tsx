import React from 'react';
import { Room, Path } from '../types';
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
    <div className="max-w-4xl mx-auto py-20 px-4 relative z-10">
      {path.modules.map((module, mIdx) => (
        <div key={module.id} className="mb-24 relative">
          {/* Module Header */}
          <div className="flex flex-col items-center mb-12">
            <h2 className={`text-2xl font-pixel text-center px-6 py-3 rounded-xl border-b-4 
              ${theme === 'dark'
                ? 'bg-indigo-900/40 text-indigo-400 border-indigo-700'
                : 'bg-wood-light/20 text-wood-dark border-wood-light'}`}>
              {module.title}
            </h2>
          </div>

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
