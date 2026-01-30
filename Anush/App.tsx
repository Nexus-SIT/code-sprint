
import React, { useState, useCallback } from 'react';
import { TRADER_PATH } from './data/mockData';
import { Room, Task, MascotState } from './types';
import TradingChart from './components/TradingChart';
import Mascot from './components/Mascot';
import RoadmapView from './components/RoadmapView';

type ViewMode = 'roadmap' | 'room';

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('roadmap');
  const [balance, setBalance] = useState(1000);
  const [completedRooms, setCompletedRooms] = useState<string[]>([]);
  
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [activeRoomIndex, setActiveRoomIndex] = useState(0);
  const [activeTaskIndex, setActiveTaskIndex] = useState(0);
  
  const [mascotState, setMascotState] = useState<MascotState>('idle');
  const [mascotMessage, setMascotMessage] = useState("Hey Anush! If you get stuck, I'll pretend I knew it all along.");
  
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', index: number } | null>(null);

  const currentPath = TRADER_PATH;
  const currentModule = currentPath.modules[activeModuleIndex];
  const currentRoom = currentModule.rooms[activeRoomIndex];
  const currentTask = currentRoom.tasks[activeTaskIndex];

  const handleSelectRoom = (modIdx: number, roomIdx: number) => {
    setActiveModuleIndex(modIdx);
    setActiveRoomIndex(roomIdx);
    setActiveTaskIndex(0);
    setViewMode('room');
    setMascotState('idle');
    setMascotMessage(`Meow! Deploying virtual terminal for ${currentPath.modules[modIdx].rooms[roomIdx].title}.`);
  };

  const handleCandleClick = useCallback((index: number) => {
    if (feedback || !currentTask) return;

    if (index === currentTask.correctIndex) {
      setFeedback({ type: 'success', index });
      setMascotState('happy');
      setMascotMessage(`Flag Captured! Onwards and upwards. +$${currentTask.reward}`);
      setBalance(prev => prev + currentTask.reward);
      
      setTimeout(() => {
        setFeedback(null);
        if (activeTaskIndex < currentRoom.tasks.length - 1) {
          setActiveTaskIndex(prev => prev + 1);
          setMascotState('idle');
        } else {
          setMascotMessage("Mission Complete! Returning to base.");
          setCompletedRooms(prev => Array.from(new Set([...prev, currentRoom.id])));
        }
      }, 1500);
    } else {
      setFeedback({ type: 'error', index });
      setMascotState('dizzy');
      setMascotMessage(`Connection Refused. Try a different candle! -$${currentTask.penalty}`);
      setBalance(prev => Math.max(0, prev - currentTask.penalty));
      
      setTimeout(() => {
        setFeedback(null);
        setMascotState('idle');
      }, 1000);
    }
  }, [currentTask, activeTaskIndex, currentRoom, feedback]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafd] dark:bg-[#0d1117] text-slate-800 dark:text-slate-200 font-sans">
      {/* Top Navbar */}
      <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#161b22] flex items-center justify-between px-6 sticky top-0 z-[60]">
        <div className="flex items-center gap-10 h-full">
          <div 
            onClick={() => setViewMode('roadmap')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-8 h-8 bg-slate-900 dark:bg-white rounded-md flex items-center justify-center font-black text-white dark:text-slate-900 group-hover:scale-105 transition-transform">
              TH
            </div>
            <span className="font-black text-lg dark:text-white">TradeHack</span>
          </div>

          <nav className="hidden lg:flex items-center gap-8 h-full">
            {['Dashboard', 'Learn', 'Practice', 'Compete'].map(item => (
              <button 
                key={item}
                onClick={() => item === 'Dashboard' && setViewMode('roadmap')}
                className={`text-xs font-bold h-full border-b-2 transition-all uppercase tracking-widest ${
                  (viewMode === 'roadmap' && item === 'Dashboard') 
                  ? 'text-emerald-500 border-emerald-500' 
                  : 'text-slate-400 border-transparent hover:text-slate-600 dark:hover:text-white'
                }`}
              >
                {item}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-6">
          <button className="bg-emerald-500 text-slate-900 text-[10px] font-black uppercase px-4 py-1.5 rounded-md hover:bg-emerald-400 transition-all">
            Go Premium
          </button>
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center font-bold text-white text-xs">A</div>
             <span className="text-sm font-bold text-slate-500">Anush</span>
          </div>
        </div>
      </header>

      {viewMode === 'roadmap' ? (
        <RoadmapView 
          path={currentPath}
          completedRooms={completedRooms}
          onSelectRoom={handleSelectRoom}
        />
      ) : (
        <div className="flex flex-1 overflow-hidden animate-in fade-in duration-300">
          {/* Lab Sidebar */}
          <aside className="w-[400px] border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0d1117] flex flex-col p-6 overflow-y-auto">
             <button 
               onClick={() => setViewMode('roadmap')}
               className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-emerald-500 mb-8 flex items-center gap-2"
             >
               &larr; Terminate Instance
             </button>

             <div className="mb-8">
               <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-1 block">
                 Room: {currentRoom.title}
               </span>
               <h2 className="text-2xl font-black dark:text-white">{currentTask?.title || 'Mission Accomplished'}</h2>
             </div>

             {currentTask ? (
               <div className="space-y-6">
                 <div className="bg-slate-50 dark:bg-[#161b22] rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Briefing</h3>
                    {currentTask.theory.map((line, i) => (
                      <p key={i} className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-3 last:mb-0 border-l-2 border-emerald-500/40 pl-4">
                        {line}
                      </p>
                    ))}
                 </div>

                 <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-6 shadow-inner">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xs font-black text-emerald-500 uppercase tracking-widest">Question</span>
                      <span className="mono text-[10px] text-emerald-500/50">TASK_{activeTaskIndex + 1}</span>
                    </div>
                    <p className="text-lg font-bold dark:text-white mb-6">"{currentTask.question}"</p>
                    <button 
                      onClick={() => setMascotMessage(currentTask.hint)}
                      className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-emerald-500 transition-colors"
                    >
                      Need a hint?
                    </button>
                 </div>
               </div>
             ) : (
               <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-8 text-center space-y-4">
                 <div className="text-4xl">🏅</div>
                 <h3 className="text-xl font-bold text-emerald-500 uppercase">Room Cleared</h3>
                 <p className="text-sm text-slate-400">All flags captured! You gained +{currentRoom.tasks.length * 50} EXP.</p>
                 <button 
                   onClick={() => setViewMode('roadmap')}
                   className="w-full bg-emerald-500 text-slate-900 font-bold py-3 rounded-lg hover:bg-emerald-400 transition-all uppercase text-xs"
                 >
                   Back to Roadmap
                 </button>
               </div>
             )}

             <div className="mt-auto pt-10 flex justify-center sticky bottom-0 bg-white dark:bg-[#0d1117]">
                <Mascot state={mascotState} message={mascotMessage} />
             </div>
          </aside>

          {/* Main Lab View */}
          <main className="flex-1 bg-[#f8fafd] dark:bg-[#090c10] p-10 flex flex-col overflow-hidden">
             <div className="flex justify-between items-center mb-8">
                <div>
                   <h3 className="dark:text-white font-bold mb-1">Interactive Trading Terminal</h3>
                   <div className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Secure_Lab_Instance_#7822</span>
                   </div>
                </div>
                <div className="bg-white dark:bg-[#161b22] px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center gap-6 shadow-sm">
                   <div className="text-center">
                      <p className="text-[9px] font-black text-slate-400 uppercase">Profit</p>
                      <p className={`text-sm font-bold font-mono ${balance >= 1000 ? 'text-emerald-500' : 'text-rose-500'}`}>${balance}</p>
                   </div>
                   <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-800"></div>
                   <div className="text-center">
                      <p className="text-[9px] font-black text-slate-400 uppercase">Time</p>
                      <p className="text-sm font-bold font-mono dark:text-white">00:04:12</p>
                   </div>
                </div>
             </div>

             <div className="flex-1 flex items-center justify-center bg-white dark:bg-[#161b22]/30 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#10b981 1px, transparent 0)', backgroundSize: '40px 40px' }} />
                <TradingChart 
                  data={currentRoom.chartData} 
                  onCandleClick={handleCandleClick}
                  showSuccess={feedback?.type === 'success' ? feedback.index : null}
                  showError={feedback?.type === 'error' ? feedback.index : null}
                />
             </div>
          </main>
        </div>
      )}
    </div>
  );
};

export default App;
