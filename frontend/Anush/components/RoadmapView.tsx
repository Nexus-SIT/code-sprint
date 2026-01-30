
import React from 'react';
import { Path, Module, Room } from '../types';

interface RoadmapViewProps {
  path: Path;
  completedRooms: string[];
} 

const RoomNode: React.FC<{ 
  room: Room; 
  completed: boolean; 
  isLastInModule: boolean;
}> = ({ room, completed, isLastInModule }) => {
  const getIcon = (type: Room['iconType']) => {
    switch (type) {
      case 'terminal': return '💻';
      case 'shield': return '🛡️';
      case 'chart': return '📊';
      case 'target': return '🎯';
      default: return '📍';
    }
  };

  return (
    <div className="relative flex flex-col items-center group">
      {/* Vertical Connection Line */}
      {!isLastInModule && (
        <div className="absolute top-16 w-0.5 h-20 bg-slate-200 dark:bg-slate-800 -z-10" />
      )}
      
      <div 
        className={`w-16 h-16 rounded-xl flex items-center justify-center text-2xl cursor-default transition-all duration-300 border-2 shadow-sm
          ${completed 
            ? 'bg-emerald-500 border-emerald-400 text-white scale-110' 
            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'}
        `}
      >
        {getIcon(room.iconType)}
      </div>
      
      <div className="mt-2 text-center max-w-[120px]">
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block leading-tight transition-colors">
          {room.title}
        </span>
        {completed && <span className="text-[10px] text-emerald-500 font-bold uppercase">Captured 🚩</span>}
      </div>
    </div>
  );
};

const RoadmapView: React.FC<RoadmapViewProps> = ({ path, completedRooms }) => {
  return (
    <div className="flex-1 bg-[#f8fafd] dark:bg-[#0d1117] overflow-y-auto">
      <div className="max-w-[1400px] mx-auto p-4 lg:p-8 flex flex-col lg:flex-row gap-8">
        
        {/* Main Content Area */}
        <div className="flex-1 space-y-8">
          
          {/* Hero Banner */}
          <div className="relative bg-[#051c2c] rounded-2xl p-8 overflow-hidden text-white flex items-center justify-between border border-slate-800">
            <div className="relative z-10 max-w-lg">
              <h2 className="text-2xl font-bold mb-2">Ready to level up?</h2>
              <p className="text-sm text-slate-300 mb-6">
                Over 400 challenges are ready for you to take on. Earn badges and level up while you test your skills!
              </p>
              <div className="bg-[#10b981] text-slate-900 font-bold px-6 py-2 rounded-lg flex items-center gap-2">
                <span>▶</span> Play now
              </div>
            </div>
            <div className="hidden md:flex gap-4 relative z-10">
               <div className="w-20 h-20 bg-slate-800/50 rounded-full border border-slate-700 flex items-center justify-center text-3xl">🛡️</div>
               <div className="w-20 h-20 bg-slate-800/50 rounded-full border border-slate-700 flex items-center justify-center text-3xl">💎</div>
               <div className="w-20 h-20 bg-slate-800/50 rounded-full border border-slate-700 flex items-center justify-center text-3xl">🔥</div>
            </div>
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 0)', backgroundSize: '24px 24px' }} />
          </div>

          {/* User Greeting & Navigation Tabs */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center text-2xl">🐱</div>
              <div>
                <h3 className="text-lg font-bold dark:text-white">Hey Anush!</h3>
                <p className="text-xs text-slate-500 italic">If you get stuck, I'll pretend I knew it all along.</p>
              </div>
            </div>

            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pt-4">
               <h4 className="text-sm font-bold uppercase tracking-widest text-slate-400">My Learning</h4>
               <div className="flex gap-6">
                  {['Current', 'Recent', 'Saved'].map(tab => (
                    <button key={tab} className={`pb-2 text-xs font-bold transition-all border-b-2 ${tab === 'Current' ? 'text-emerald-500 border-emerald-500' : 'text-slate-500 border-transparent'}`}>
                      {tab}
                    </button>
                  ))}
               </div>
            </div>
          </div>

          {/* Module Section */}
          {path.modules.map((module, modIndex) => (
            <div key={module.id} className="bg-white dark:bg-[#161b22] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
               {/* Module Header */}
               <div className="p-8 border-b border-slate-200 dark:border-slate-800 flex items-center gap-6">
                  <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center overflow-hidden">
                     <img src="https://img.icons8.com/isometric/100/laptop.png" className="w-16 h-16 dark:invert" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Module {modIndex + 1}</span>
                    <h2 className="text-2xl font-black dark:text-white leading-tight">{module.title}</h2>
                  </div>
               </div>

               {/* Path Map */}
               <div className="p-12 flex flex-col items-center">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-y-24 gap-x-32 relative">
                    {module.rooms.map((room, roomIndex) => (
                      <RoomNode 
                        key={room.id}
                        room={room}
                        completed={completedRooms.includes(room.id)}
                        isLastInModule={roomIndex === module.rooms.length - 1}
                      />
                    ))}
                  </div>

                  <div className="mt-20 pt-12 border-t border-slate-100 dark:border-slate-800 w-full flex justify-between items-center">
                     <div className="flex gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Classic View</span>
                     </div>
                     <div className="flex gap-4">
                        <span className="text-xs font-bold text-slate-500 px-4 py-2">View path</span>
                        <div className="bg-emerald-500 text-slate-900 font-bold px-6 py-2 rounded-lg text-xs">Resume learning</div>
                     </div>
                  </div>
               </div>
            </div>
          ))}
        </div>

        {/* Right Sidebar */}
        <div className="w-full lg:w-[320px] space-y-6">
          
          <div className="bg-white dark:bg-[#161b22] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
             <div className="flex justify-between items-center mb-6">
               <h4 className="font-black text-slate-700 dark:text-slate-300 text-sm">Check Out Workspaces!</h4>
               <span className="text-slate-400">×</span>
             </div>
             <p className="text-xs text-slate-500 leading-relaxed mb-6">
               Join workspaces to collaboratively hack with your team and access features like team leader boards and more.
             </p>
             <div className="w-full bg-[#1e293b] text-white font-bold py-3 rounded-lg text-xs text-center">
               Join Workspaces
             </div>
          </div>

          <div className="bg-white dark:bg-[#161b22] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
             <div className="flex items-center gap-2 mb-4">
                <span className="text-emerald-500 text-sm">⏰</span>
                <span className="text-xs font-bold text-slate-500">2 days to next mission</span>
             </div>
             <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center text-xl">🚩</div>
                <div>
                   <h4 className="font-bold dark:text-white text-sm">Mission Complete!</h4>
                   <p className="text-[10px] text-slate-500">Onwards and upwards</p>
                </div>
             </div>
             <div className="space-y-3">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                   <span>Answer Questions</span>
                   <span className="text-emerald-500">✓</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                   <span>Streak Days</span>
                   <span className="text-emerald-500">3 ✓</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                   <span>Start Virtual Machine</span>
                   <span className="text-emerald-500">✓</span>
                </div>
             </div>
          </div>

          <div className="bg-white dark:bg-[#161b22] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
             <div className="flex justify-between items-center mb-6">
                <h4 className="font-black text-slate-700 dark:text-slate-300 text-sm">Silver League</h4>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Week 1</span>
             </div>
             <div className="space-y-4">
                {[
                  { name: 'budumanit', score: 330, rank: 8 },
                  { name: 'kulanush18', score: 280, rank: 9, self: true },
                  { name: 'wikki02', score: 210, rank: 10 }
                ].map((user, i) => (
                  <div key={i} className={`flex items-center justify-between p-2 rounded-lg ${user.self ? 'bg-emerald-500/5 border border-emerald-500/20' : ''}`}>
                    <div className="flex items-center gap-3">
                      <span className="w-4 text-[10px] font-black text-slate-500">{user.rank}</span>
                      <div className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold text-white ${i===0?'bg-orange-500':i===1?'bg-emerald-500':'bg-slate-600'}`}>
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className={`text-[11px] font-bold ${user.self ? 'text-emerald-500' : 'dark:text-slate-300'}`}>{user.name}</span>
                    </div>
                    <span className="text-[10px] mono text-slate-500">{user.score} pts</span>
                  </div>
                ))}
             </div>
             <span className="w-full mt-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">View League</span>
          </div>

          <div className="bg-white dark:bg-[#161b22] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
             <h4 className="font-black text-slate-700 dark:text-slate-300 text-sm mb-4">Your Stats</h4>
             <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-xl text-emerald-500 font-bold">A</div>
                <div>
                   <h4 className="font-bold dark:text-white text-sm">Anush</h4>
                   <p className="text-[10px] text-slate-500 uppercase tracking-widest">Level 2 [Apprentice]</p>
                </div>
             </div>
             <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold text-slate-500">
                   <span>EXP</span>
                   <span>75%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                   <div className="w-3/4 h-full bg-emerald-500" />
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadmapView;
