
import React from 'react';
import { MascotState } from '../types';

interface MascotProps {
  state: MascotState;
  message?: string;
}

const Mascot: React.FC<MascotProps> = ({ state, message }) => {
  const getFace = () => {
    switch (state) {
      case 'happy': return '^ ω ^';
      case 'dizzy': return 'x ω x';
      case 'thinking': return '• ω •';
      case 'surprised': return 'O ω O';
      default: return 'u ω u';
    }
  };

  const getAnimation = () => {
    switch (state) {
      case 'happy': return 'animate-bounce';
      case 'dizzy': return 'animate-pulse';
      case 'thinking': return 'animate-bounce';
      default: return 'animate-none';
    }
  };

  return (
    <div className="flex flex-col items-center space-y-3 p-4 bg-slate-800 rounded-xl border border-slate-700 shadow-xl">
      <div className={`text-4xl transition-all duration-300 ${getAnimation()}`}>
        <div className="relative inline-block">
          {/* Cat Ears */}
          <div className="absolute -top-4 -left-1 text-slate-400">/ \</div>
          <div className="absolute -top-4 -right-1 text-slate-400">/ \</div>
          {/* Cat Body/Face */}
          <div className="bg-slate-700 p-4 rounded-full border-2 border-slate-500 flex items-center justify-center min-w-[100px] min-h-[100px] shadow-inner">
            <span className="mono font-bold text-emerald-400">{getFace()}</span>
          </div>
        </div>
      </div>
      <div className="text-center">
        <h3 className="font-bold text-emerald-400 text-sm mb-1 uppercase tracking-wider">Cipher the Cat</h3>
        {message && (
          <div className="bg-slate-900 px-4 py-2 rounded-lg border border-slate-700 text-xs text-slate-300 max-w-[200px] leading-relaxed">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default Mascot;
