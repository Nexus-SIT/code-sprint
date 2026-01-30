import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { BookOpen, Trophy, TrendingUp, Coins, Star, Award, Target, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import Leaderboard from './Leaderboard';
import { getRankIcon, getRankColor } from '../utils/rankIcons';

const Home: React.FC = () => {
    const navigate = useNavigate();
    const { walletBalance, xp, userProfile, theme, userId } = useStore();

    return (
        <div className={`min-h-screen flex flex-col items-center p-6 relative font-body selection:bg-wood-light selection:text-parchment transition-colors ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-parchment text-coffee'
            }`}>
            {/* Theme Toggle - Top Right */}
            <div className="absolute top-6 right-6 z-20">
                <ThemeToggle />
            </div>

            {/* Background Texture */}
            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#7C492E 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>

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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-8">
                {/* Tutorial Card */}
                <motion.div
                    whileHover={{ scale: 1.02, y: -5 }}
                    className={`rounded-xl border-4 p-6 shadow-pixel cursor-pointer transition-all ${theme === 'dark'
                        ? 'bg-gray-800 border-gray-700 hover:border-green-500'
                        : 'bg-wood border-wood-dark hover:border-green-600'
                        }`}
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
                            onClick={() => navigate('/learn')}
                            className="w-full bg-success text-white border-b-4 border-green-900 active:border-b-0 active:translate-y-1 rounded-lg py-3 font-pixel text-xs hover:bg-green-600 transition-all shadow-lg"
                        >
                            START LEARNING
                        </button>
                    </div>
                </motion.div>

                {/* Ranked Card */}
                <motion.div
                    whileHover={{ scale: 1.02, y: -5 }}
                    className={`rounded-xl border-4 p-6 shadow-pixel cursor-pointer transition-all ${theme === 'dark'
                        ? 'bg-gray-800 border-gray-700 hover:border-blue-500'
                        : 'bg-wood border-wood-dark hover:border-blue-600'
                        }`}
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
                    className={`rounded-xl border-4 p-6 shadow-pixel cursor-pointer transition-all ${theme === 'dark'
                        ? 'bg-gray-800 border-gray-700 hover:border-purple-500'
                        : 'bg-wood border-wood-dark hover:border-purple-600'
                        }`}
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
            </div>

            {/* Stats Bar */}
            <div className={`max-w-4xl mx-auto mb-12 rounded-xl border-4 p-6 shadow-pixel ${theme === 'dark'
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
                                ${walletBalance.toLocaleString()}
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
                                        ₹{userProfile.totalProfit.toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Bottom Section: Stats and Leaderboard */}
            {userProfile && userId && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {/* Trading Stats */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className={`rounded-xl border-4 p-6 shadow-pixel ${theme === 'dark'
                            ? 'bg-gray-800 border-gray-700'
                            : 'bg-wood border-wood-dark'
                            }`}
                    >
                        <h2 className={`text-2xl font-pixel mb-6 text-center ${theme === 'dark' ? 'text-amber-400' : 'text-parchment'
                            }`}>
                            TRADING STATS
                        </h2>

                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { icon: <Target size={24} />, label: 'Win Rate', value: `${userProfile.totalTrades > 0 ? ((userProfile.winningTrades / userProfile.totalTrades) * 100).toFixed(1) : 0}%`, color: 'text-blue-500' },
                                { icon: <Award size={24} />, label: 'Best Trade', value: `₹${userProfile.bestTrade.toLocaleString()}`, color: 'text-yellow-500' },
                                { icon: <Zap size={24} />, label: 'Win Streak', value: `${userProfile.currentStreak}`, color: 'text-purple-500' },
                                { icon: <TrendingUp size={24} />, label: 'Total Trades', value: `${userProfile.totalTrades}`, color: 'text-green-500' }
                            ].map((stat, i) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.4 + i * 0.1 }}
                                    className={`p-4 rounded-lg border-2 ${theme === 'dark'
                                        ? 'bg-gray-700/50 border-gray-600'
                                        : 'bg-wood-dark/30 border-wood-light/30'
                                        }`}
                                >
                                    <div className={`${stat.color} mb-2`}>
                                        {stat.icon}
                                    </div>
                                    <div className={`text-xs mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-wood-light'
                                        }`}>
                                        {stat.label}
                                    </div>
                                    <div className={`text-xl font-pixel ${stat.color}`}>
                                        {stat.value}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Leaderboard */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <Leaderboard userId={userId} limit={5} />
                    </motion.div>
                </div>
            )}
        </div >

    );
};

export default Home;