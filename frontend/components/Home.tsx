import React from 'react';
import { useStore } from '../store';
import { BookOpen, Trophy, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const Home: React.FC = () => {
  const setMode = useStore((state) => state.setMode);
  const { walletBalance, xp } = useStore();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-20 pointer-events-none">
            <div className="absolute top-10 left-10 w-64 h-64 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
            <div className="absolute top-10 right-10 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="text-center mb-12">
            <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-4 tracking-tight">
                TRADE LEAGUE
            </h1>
            <p className="text-gray-400 text-xl max-w-2xl mx-auto">
                Master the markets. Compete for the top rank. 
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
            <motion.div 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setMode('LEARNING')}
                className="group cursor-pointer bg-gray-800/80 backdrop-blur-lg border-2 border-green-500/30 hover:border-green-400 rounded-3xl p-8 flex flex-col items-center text-center transition-all shadow-xl hover:shadow-green-500/20"
            >
                <div className="bg-green-500/20 p-6 rounded-full mb-6 group-hover:bg-green-500/30 transition-colors">
                    <BookOpen size={48} className="text-green-400" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Learning Mode</h2>
                <p className="text-gray-400">
                    Interactive tutorials. Learn candlestick patterns, support/resistance, and risk management with zero risk.
                </p>
            </motion.div>

            <motion.div 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setMode('GAME')}
                className="group cursor-pointer bg-gray-800/80 backdrop-blur-lg border-2 border-red-500/30 hover:border-red-400 rounded-3xl p-8 flex flex-col items-center text-center transition-all shadow-xl hover:shadow-red-500/20"
            >
                 <div className="bg-red-500/20 p-6 rounded-full mb-6 group-hover:bg-red-500/30 transition-colors">
                    <Trophy size={48} className="text-red-400" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Game Mode</h2>
                <p className="text-gray-400">
                    Ranked competitive trading. Test your strategy against real market volatility simulation.
                </p>
            </motion.div>
        </div>

        {/* User Stats Footer */}
        <div className="mt-16 flex gap-8 bg-gray-900/50 px-8 py-4 rounded-2xl border border-gray-800">
             <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                    <TrendingUp size={20} className="text-blue-400" />
                </div>
                <div>
                    <div className="text-xs text-gray-500 font-bold uppercase">Balance</div>
                    <div className="font-mono font-bold">${walletBalance.toLocaleString()}</div>
                </div>
             </div>
             <div className="w-px bg-gray-700"></div>
             <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Trophy size={20} className="text-purple-400" />
                </div>
                <div>
                    <div className="text-xs text-gray-500 font-bold uppercase">XP Earned</div>
                    <div className="font-mono font-bold">{xp} XP</div>
                </div>
             </div>
        </div>
    </div>
  );
};

export default Home;