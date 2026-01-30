
import React from 'react';
import RoadmapView from './components/RoadmapView';

// Simplified static path data (taken from original mock data, minimal for static display)
const TRADER_PATH = {
  id: 'pro-trader-path',
  title: 'Introduction to Professional Trading',
  modules: [
    {
      id: 'm1',
      title: 'Module 1: Market Basics',
      rooms: [
        { id: 'm1-r1', title: 'Price Movement', iconType: 'terminal', thumbnail: 'https://img.icons8.com/isometric/100/laptop.png' },
        { id: 'm1-r2', title: 'Candle Anatomy', iconType: 'chart', thumbnail: 'https://img.icons8.com/isometric/100/laptop.png' },
        { id: 'm1-r3', title: 'Timeframes', iconType: 'terminal', thumbnail: 'https://img.icons8.com/isometric/100/laptop.png' }
      ]
    },
    {
      id: 'm2',
      title: 'Module 2: Market Structure',
      rooms: [
        { id: 'm2-r1', title: 'HH & HL Identification', iconType: 'chart', thumbnail: 'https://img.icons8.com/isometric/100/laptop.png' },
        { id: 'm2-r2', title: 'Downtrend Structure', iconType: 'shield', thumbnail: 'https://img.icons8.com/isometric/100/laptop.png' }
      ]
    }
  ]
};

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafd] dark:bg-[#0d1117] text-slate-800 dark:text-slate-200 font-sans">
      {/* Top Navbar (non-interactive) */}
      <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#161b22] flex items-center justify-between px-6 sticky top-0 z-[60]">
        <div className="flex items-center gap-10 h-full">
          <div className="flex items-center gap-3 cursor-default group">
            <div className="w-8 h-8 bg-slate-900 dark:bg-white rounded-md flex items-center justify-center font-black text-white dark:text-slate-900 transition-transform">
              TH
            </div>
            <span className="font-black text-lg dark:text-white">TradeHack</span>
          </div>

          <nav className="hidden lg:flex items-center gap-8 h-full">
            {['Dashboard', 'Learn', 'Practice', 'Compete'].map(item => (
              <button key={item} className={`text-xs font-bold h-full border-b-2 transition-all uppercase tracking-widest cursor-default ${(item === 'Dashboard') ? 'text-emerald-500 border-emerald-500' : 'text-slate-400 border-transparent'}`}>
                {item}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-6">
          <div className="bg-emerald-500 text-slate-900 text-[10px] font-black uppercase px-4 py-1.5 rounded-md">Go Premium</div>
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center font-bold text-white text-xs">A</div>
             <span className="text-sm font-bold text-slate-500">Anush</span>
          </div>
        </div>
      </header>

      {/* Static Roadmap view */}
      <RoadmapView path={TRADER_PATH} completedRooms={[]} />
    </div>
  );
};

export default App;
