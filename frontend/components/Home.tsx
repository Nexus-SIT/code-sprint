import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { auth } from '../firebase';
import { BookOpen, Trophy, TrendingUp, Coins, Star, Award, Target, Zap, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import Leaderboard from './Leaderboard';
import RankInfoModal from './RankInfoModal';
import { Info } from 'lucide-react';

const Home: React.FC = () => {
    const navigate = useNavigate();
    const { walletBalance, xp, userProfile, theme, userId } = useStore();
    const [isRankModalOpen, setIsRankModalOpen] = React.useState(false);

    return (
        <div className={`min-h-screen flex flex-col items-center p-6 relative font-body selection:bg-wood-light selection:text-parchment transition-colors ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-parchment text-coffee'}`}>

            {/* Theme Toggle - Top Right */}
            <div className="absolute top-6 right-6 z-20 flex gap-4 items-center">
                <button
                    onClick={() => setIsRankModalOpen(true)}
                    className="bg-amber-500 hover:bg-amber-600 text-white font-pixel text-[10px] px-3 py-2 rounded shadow-pixel border-2 border-amber-700 flex items-center gap-2"
                >
                    <Info size={14} /> RANK INFO
                </button>
                <ThemeToggle />
                <button
                    onClick={() => auth.signOut()}
                    className="bg-red-500 hover:bg-red-600 text-white font-pixel text-[10px] px-3 py-2 rounded shadow-pixel border-2 border-red-700"
                >
                    LOGOUT
                </button>
            </div>

            {/* Background Image */}
            <div className="absolute inset-0 pointer-events-none opacity-50 z-0 blur-sm" style={{ backgroundImage: "url('/bg.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}></div>

            <div className="text-center mb-8 z-10 relative">
                <img
                    src="/CCLogo.png"
                    alt="Candle Crush Logo"
                    className="w-64 md:w-96 mx-auto drop-shadow-pixel filter hover:scale-105 transition-transform duration-300"
                />
                <div className="flex items-center justify-center gap-2">
                    <div className="h-1 w-12 bg-wood-dark"></div>
                    <p className="text-wood text-xl font-bold uppercase tracking-widest">
                        Trading Valley
                    </p>
                    <div className="h-1 w-12 bg-wood-dark"></div>
                </div>
            </div>

            {/* Game Mode Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-8 relative z-10">
                {/* Tutorial Card */}
                <motion.div
                    whileHover={{ scale: 1.02, y: -5 }}
                    className={`rounded-xl p-6 shadow-pixel cursor-pointer transition-all ${theme === 'dark'
                        }`}
                    style={theme !== 'dark' ? { backgroundImage: "url('/tile.png')", backgroundSize: 'contain', backgroundRepeat: 'repeat' } : {}}
                >
                    <div className="flex flex-col items-center text-center">
                        <div className={`p-4 rounded-full mb-4 ${theme === 'dark' ? 'bg-green-900/30' : 'bg-green-600/20'
                            }`}>
                            <BookOpen size={40} className="text-green-500" />
                        </div>
                        <h3 className={`text-xl font-pixel mb-2 ${theme === 'dark' ? 'text-amber-300' : 'text-parchment'
                            }`}>
                            TUTORIAL
                        </h3>
                        <p className={`text-xs mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-parchment/80'
                            }`}>
                            Learn the basics.
                        </p>
                        <button
                            onClick={() => navigate('/roadmap')}
                            className="w-full bg-success text-white border-b-4 border-green-900 active:border-b-0 active:translate-y-1 rounded-lg py-3 font-pixel text-xs hover:bg-green-600 transition-all shadow-lg"
                        >
                            START LEARNING
                        </button>
                    </div>
                </motion.div>

                {/* Ranked Card */}
                <motion.div
                    whileHover={{ scale: 1.02, y: -5 }}
                    className={`rounded-xl p-6 shadow-pixel cursor-pointer transition-all ${theme === 'dark'
                        }`}
                    style={theme !== 'dark' ? { backgroundImage: "url('/tile.png')", backgroundSize: 'contain', backgroundRepeat: 'repeat' } : {}}
                >
                    <div className="flex flex-col items-center text-center">
                        <div className={`p-4 rounded-full mb-4 ${theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-600/20'
                            }`}>
                            <Trophy size={40} className="text-yellow-500" />
                        </div>
                        <h3 className={`text-xl font-pixel mb-2 ${theme === 'dark' ? 'text-amber-300' : 'text-parchment'
                            }`}>
                            RANKED
                        </h3>
                        <p className={`text-xs mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-parchment/80'
                            }`}>
                            Compete for glory.
                        </p>
                        <button
                            onClick={() => navigate('/game')}
                            className="w-full bg-blue-600 text-white border-b-4 border-blue-900 active:border-b-0 active:translate-y-1 rounded-lg py-3 font-pixel text-xs hover:bg-blue-500 transition-all shadow-lg"
                        >
                            FARM FUNDS
                        </button>
                    </div>
                </motion.div>

                {/* Leaderboard Card - NEW */}
                <motion.div
                    whileHover={{ scale: 1.02, y: -5 }}
                    className={`rounded-xl p-6 shadow-pixel cursor-pointer transition-all ${theme === 'dark'
                        }`}
                    style={theme !== 'dark' ? { backgroundImage: "url('/tile.png')", backgroundSize: 'contain', backgroundRepeat: 'repeat' } : {}}
                >
                    <div className="flex flex-col items-center text-center">
                        <div className={`p-4 rounded-full mb-4 ${theme === 'dark' ? 'bg-purple-900/30' : 'bg-purple-600/20'
                            }`}>
                            <Award size={40} className="text-purple-400" />
                        </div>
                        <h3 className={`text-xl font-pixel mb-2 ${theme === 'dark' ? 'text-amber-300' : 'text-parchment'
                            }`}>
                            LEADERBOARD
                        </h3>
                        <p className={`text-xs mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-parchment/80'
                            }`}>
                            Check top traders.
                        </p>
                        <button
                            onClick={() => navigate('/leaderboard')}
                            className="w-full bg-purple-600 text-white border-b-4 border-purple-900 active:border-b-0 active:translate-y-1 rounded-lg py-3 font-pixel text-xs hover:bg-purple-500 transition-all shadow-lg"
                        >
                            VIEW RANKINGS
                        </button>
                    </div>
                </motion.div>

                {/* Contest Card - NEW */}
                <motion.div
                    whileHover={{ scale: 1.02, y: -5 }}
                    className={`rounded-xl p-6 shadow-pixel cursor-pointer transition-all ${theme === 'dark'
                        }`}
                    style={theme !== 'dark' ? { backgroundImage: "url('/tile.png')", backgroundSize: 'contain', backgroundRepeat: 'repeat' } : {}}
                >
                    <div className="flex flex-col items-center text-center">
                        <div className={`p-4 rounded-full mb-4 ${theme === 'dark' ? 'bg-amber-900/30' : 'bg-amber-600/20'
                            }`}>
                            <Users size={40} className="text-amber-500" />
                        </div>
                        <h3 className={`text-xl font-pixel mb-2 ${theme === 'dark' ? 'text-amber-300' : 'text-parchment'
                            }`}>
                            CONTEST
                        </h3>
                        <p className={`text-xs mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-parchment/80'
                            }`}>
                            Challenge friends.
                        </p>
                        <button
                            onClick={() => navigate('/contest')}
                            className="w-full bg-amber-600 text-white border-b-4 border-amber-900 active:border-b-0 active:translate-y-1 rounded-lg py-3 font-pixel text-xs hover:bg-amber-500 transition-all shadow-lg"
                        >
                            ENTER ARENA
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* Stats Bar */}
            <div className={`max-w-4xl mx-auto mb-12 rounded-xl border-4 p-6 shadow-pixel relative z-10 ${theme === 'dark'
                ? 'bg-gray-800 border-gray-700'
                : 'bg-wood-dark border-wood'
                }`}>
                <div className="flex justify-around items-center flex-wrap gap-6">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-wood'
                            }`}>
                            <Coins size={32} className="text-yellow-400" />
                        </div>
                        <div>
                            <div className={`text-xs font-pixel uppercase mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-wood-light'
                                }`}>
                                FARM FUNDS
                            </div>
                            <div className={`font-pixel text-2xl ${theme === 'dark' ? 'text-amber-300' : 'text-parchment'
                                }`}>
                                ${walletBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                        </div>
                    </div>

                    <div className={`h-16 w-1 rounded-full ${theme === 'dark' ? 'bg-gray-600' : 'bg-wood'}`}></div>

                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-wood'}`}>
                            <Star size={32} className="text-yellow-400" />
                        </div>
                        <div>
                            <div className={`text-xs font-pixel uppercase mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-wood-light'}`}>
                                EXPERIENCE
                            </div>
                            <div className={`font-pixel text-2xl ${theme === 'dark' ? 'text-amber-300' : 'text-parchment'}`}>
                                {xp} XP
                            </div>
                        </div>
                    </div>

                    {userProfile && (
                        <>
                            <div className={`h-16 w-1 rounded-full ${theme === 'dark' ? 'bg-gray-600' : 'bg-wood'}`}></div>

                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-wood'}`}>
                                    <TrendingUp size={32} className={userProfile.totalProfit >= 0 ? 'text-green-500' : 'text-red-500'} />
                                </div>
                                <div>
                                    <div className={`text-xs font-pixel uppercase mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-wood-light'}`}>
                                        TOTAL PROFIT
                                    </div>
                                    <div className={`font-pixel text-2xl ${userProfile.totalProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                        ${userProfile.totalProfit.toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Bottom Section: Leaderboard */}
            <div className="max-w-4xl mx-auto w-full relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <Leaderboard userId={userId || undefined} limit={5} showBack={false} />
                </motion.div>
            </div>
            {/* Rank Info Modal */}
            <RankInfoModal
                isOpen={isRankModalOpen}
                onClose={() => setIsRankModalOpen(false)}
                theme={theme}
            />
        </div >

    );
};

export default Home;