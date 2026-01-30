import React from 'react';
import { Path, UserStats } from '../types';
import { Play, CheckCircle } from 'lucide-react';

interface DashboardViewProps {
  path: Path;
  stats: UserStats;
  completedRooms: string[];
  onSelectRoom: (modIdx: number, roomIdx: number) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ path, stats, completedRooms, onSelectRoom }) => {
  return (
    <div className="flex-1 overflow-y-auto bg-[#f0f2f5] dark:bg-[#0d1117] text-slate-800 dark:text-gray-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Welcome Card */}
        <div className="bg-white dark:bg-[#161b22] border border-gray-200 dark:border-gray-700 rounded-2xl p-8 shadow-sm flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black mb-2">My Dashboard</h2>
            <p className="text-gray-500 max-w-xl">
              Track your progress across all {stats.totalModules} modules.
              You have completed {stats.completedModules} modules with a score of {stats.averageScore}%.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.completedModules}</div>
              <div className="text-[10px] uppercase font-bold text-gray-400">Done</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">{stats.averageScore}%</div>
              <div className="text-[10px] uppercase font-bold text-gray-400">Avg</div>
            </div>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 gap-6">
          {path.modules.map((module, modIdx) => (
            <div key={module.id} className="bg-white dark:bg-[#161b22] border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                <div className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">Module {modIdx + 1}</div>
                <h3 className="text-xl font-bold">{module.title}</h3>
                <p className="text-sm text-gray-500 mt-2">{module.description}</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-[#0d1117]/50 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {module.rooms.map((room, roomIdx) => {
                  const isCompleted = completedRooms.includes(room.id);
                  return (
                    <button
                      key={room.id}
                      onClick={() => onSelectRoom(modIdx, roomIdx)}
                      className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all
                          ${isCompleted
                          ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800'
                          : 'bg-white dark:bg-[#161b22] border-gray-200 dark:border-gray-700 hover:border-indigo-400 hover:shadow-sm'}
                       `}
                    >
                      <div className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0
                          ${isCompleted ? 'bg-green-100 text-green-600' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}
                       `}>
                        {isCompleted ? <CheckCircle size={14} /> : <Play size={12} fill="currentColor" />}
                      </div>
                      <div className="overflow-hidden">
                        <div className={`text-sm font-bold truncate ${isCompleted ? 'text-green-700 dark:text-green-400' : 'text-gray-700 dark:text-gray-300'}`}>
                          {room.title}
                        </div>
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

export default DashboardView;