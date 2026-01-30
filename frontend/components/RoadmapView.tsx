import React from 'react';
import { Path, Room } from '../types';
import { useStore } from '../store';
import { Play, CheckCircle } from 'lucide-react';

interface RoadmapViewProps {
  path: Path;
  completedRooms: string[];
  onSelectRoom: (moduleIndex: number, roomIndex: number) => void;
}

const RoadmapView: React.FC<RoadmapViewProps> = ({ path, completedRooms, onSelectRoom }) => {
  const { theme } = useStore();

  return (
    <div className={`flex-1 overflow-y-auto p-6 md:p-12
      ${theme === 'dark' ? 'bg-transparent text-gray-100' : 'bg-transparent text-coffee'}
    `}>
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="space-y-4">
          <h1 className={`text-3xl md:text-4xl font-bold font-pixel
            ${theme === 'dark' ? 'text-amber-400' : 'text-wood-dark'}
          `}>
            Trading Valley Path
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
                  Module {modIdx + 1}
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
