import React from 'react';
import { useStore } from '../store';
import { BookOpen, Trophy, TrendingUp, Coins, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const Home: React.FC = () => {
    const setMode = useStore((state) => state.setMode);
    const { walletBalance, xp } = useStore();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 relative bg-parchment font-body text-coffee selection:bg-wood-light selection:text-parchment">
            {/* Background Texture Hint */}
            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#7C492E 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>

            <div className="text-center mb-12 z-10 relative">
                <img
                    src="/CCLogo.png"
                    alt="Candle Crush Logo"
                    className="w-64 md:w-96 mx-auto mb-6 drop-shadow-pixel filter hover:scale-105 transition-transform duration-300"
                />
                <div className="flex items-center justify-center gap-2">
                    <div className="h-1 w-12 bg-wood-dark"></div>
                    <p className="text-wood text-xl font-bold uppercase tracking-widest">
                        Trading Valley
                    </p>
                    <div className="h-1 w-12 bg-wood-dark"></div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full z-10">
                {/* Learning Mode Sign */}
                <motion.div
                    whileHover={{ scale: 1.05, rotate: -1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setMode('LEARNING')}
                    className="cursor-pointer bg-wood border-4 border-wood-dark shadow-pixel rounded-lg relative group"
                >
                    {/* Nails */}
                    <div className="absolute top-2 left-2 w-3 h-3 bg-wood-dark rounded-full shadow-inner"></div>
                    <div className="absolute top-2 right-2 w-3 h-3 bg-wood-dark rounded-full shadow-inner"></div>

                    <div className="border-2 border-wood-light/50 border-dashed m-2 p-8 flex flex-col items-center text-center h-full justify-center">
                        <div className="bg-wood-dark/20 p-6 rounded-full mb-6 border-2 border-wood-light">
                            <BookOpen size={48} className="text-parchment drop-shadow-md" />
                        </div>
                        <h2 className="text-2xl font-pixel text-parchment mb-4 drop-shadow-sm">TUTORIAL</h2>
                        <p className="text-wood-light text-lg leading-tight opacity-90">
                            Plant your first seeds. Learn the basics of the market without any risk.
                        </p>
                    </div>
                </motion.div>

                {/* Game Mode Sign */}
                <motion.div
                    whileHover={{ scale: 1.05, rotate: 1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setMode('GAME')}
                    className="cursor-pointer bg-wood border-4 border-wood-dark shadow-pixel rounded-lg relative group"
                >
                    {/* Nails */}
                    <div className="absolute top-2 left-2 w-3 h-3 bg-wood-dark rounded-full shadow-inner"></div>
                    <div className="absolute top-2 right-2 w-3 h-3 bg-wood-dark rounded-full shadow-inner"></div>

                    <div className="border-2 border-wood-light/50 border-dashed m-2 p-8 flex flex-col items-center text-center h-full justify-center">
                        <div className="bg-wood-dark/20 p-6 rounded-full mb-6 border-2 border-wood-light">
                            <Trophy size={48} className="text-yellow-400 drop-shadow-md" />
                        </div>
                        <h2 className="text-2xl font-pixel text-parchment mb-4 drop-shadow-sm">RANKED</h2>
                        <p className="text-wood-light text-lg leading-tight opacity-90">
                            Face the storm. Compete in the grand market fair for glory and profit.
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* User Stats Footer */}
            <div className="mt-16 w-full max-w-2xl bg-wood-dark text-parchment p-1 rounded-t-lg border-t-4 border-wood mx-auto shadow-2xl z-10">
                <div className="border-2 border-wood-light/30 border-dashed rounded p-4 flex justify-around items-center">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-wood rounded border border-wood-light shadow-inner">
                            <Coins size={24} className="text-yellow-400" />
                        </div>
                        <div>
                            <div className="text-xs text-wood-light font-pixel uppercase mb-1">FARM FUNDS</div>
                            <div className="font-pixel text-xl">${walletBalance.toLocaleString()}</div>
                        </div>
                    </div>

                    <div className="h-12 w-1 bg-wood rounded-full opacity-30"></div>

                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-wood rounded border border-wood-light shadow-inner">
                            <Star size={24} className="text-yellow-400" />
                        </div>
                        <div>
                            <div className="text-xs text-wood-light font-pixel uppercase mb-1">Experience</div>
                            <div className="font-pixel text-xl">{xp} XP</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;