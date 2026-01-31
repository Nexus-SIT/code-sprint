import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Target, Award, Zap, Calendar, Info } from 'lucide-react';
import { useStore } from '../store';
import api from '../services/api';
import RankInfoModal from './RankInfoModal';

interface ProfileStatsProps {
    userId?: string;
}

const ProfileStats: React.FC<ProfileStatsProps> = ({ userId: propUserId }) => {
    const { userId: storeUserId, userProfile, theme } = useStore();
    const userId = propUserId || storeUserId;

    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isRankModalOpen, setIsRankModalOpen] = useState(false);

    useEffect(() => {
        if (userId) {
            fetchStats();
        }
    }, [userId]);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const tradeData = await api.getTradeHistory(userId!, 100);
            setStats(tradeData.stats);
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading || !userProfile) {
        return (
            <div className={`rounded-lg border-4 p-6 ${theme === 'dark'
                ? 'bg-gray-800 border-gray-700'
                : 'bg-parchment border-wood-dark'
                }`}>
                <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-wood/20 dark:bg-gray-700 rounded w-1/3"></div>
                    <div className="grid grid-cols-2 gap-4">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-20 bg-wood/10 dark:bg-gray-700 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    const statCards = [
        {
            icon: <Target className="w-6 h-6" />,
            label: 'Win Rate',
            value: `${userProfile.totalTrades > 0 ? ((userProfile.winningTrades / userProfile.totalTrades) * 100).toFixed(1) : 0}%`,
            color: 'text-blue-500',
            bgColor: 'bg-blue-500/10'
        },
        {
            icon: <TrendingUp className="w-6 h-6" />,
            label: 'Total Profit',
            value: `₹${userProfile.totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            color: userProfile.totalProfit >= 0 ? 'text-green-500' : 'text-red-500',
            bgColor: userProfile.totalProfit >= 0 ? 'bg-green-500/10' : 'bg-red-500/10'
        },
        {
            icon: <Award className="w-6 h-6" />,
            label: 'Best Trade',
            value: `₹${userProfile.bestTrade.toLocaleString()}`,
            color: 'text-yellow-500',
            bgColor: 'bg-yellow-500/10'
        },
        {
            icon: <TrendingDown className="w-6 h-6" />,
            label: 'Worst Trade',
            value: `₹${userProfile.worstTrade.toLocaleString()}`,
            color: 'text-red-500',
            bgColor: 'bg-red-500/10'
        },
        {
            icon: <Zap className="w-6 h-6" />,
            label: 'Current Streak',
            value: `${userProfile.currentStreak} wins`,
            color: 'text-purple-500',
            bgColor: 'bg-purple-500/10'
        },
        {
            icon: <Calendar className="w-6 h-6" />,
            label: 'Total Trades',
            value: userProfile.totalTrades,
            color: 'text-indigo-500',
            bgColor: 'bg-indigo-500/10'
        }
    ];

    return (
        <div className={`rounded-lg border-4 p-6 shadow-pixel ${theme === 'dark'
            ? 'bg-gray-800 border-gray-700'
            : 'bg-parchment border-wood-dark'
            }`}>
            <h2 className={`text-2xl font-pixel mb-6 ${theme === 'dark' ? 'text-amber-400' : 'text-wood-dark'
                }`}>
                TRADING STATS
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {statCards.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`${stat.bgColor} rounded-lg p-4 border-2 ${theme === 'dark' ? 'border-gray-600' : 'border-wood-light/30'
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`${stat.color}`}>
                                {stat.icon}
                            </div>
                            <div className="flex-1">
                                <div className={`text-xs font-body mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-wood-light'
                                    }`}>
                                    {stat.label}
                                </div>
                                <div className={`text-xl font-pixel ${stat.color}`}>
                                    {stat.value}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Level Progress */}
            <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <span className={`text-sm font-pixel ${theme === 'dark' ? 'text-gray-300' : 'text-coffee'
                            }`}>
                            Level {userProfile.level}
                        </span>
                        <button
                            onClick={() => setIsRankModalOpen(true)}
                            className={`p-1 rounded-full transition-colors ${theme === 'dark' ? 'hover:bg-gray-700 text-amber-500' : 'hover:bg-wood-light/20 text-wood-dark'}`}
                            title="View Rank Information"
                        >
                            <Info className="w-4 h-4" />
                        </button>
                    </div>
                    <span className={`text-xs font-body ${theme === 'dark' ? 'text-gray-400' : 'text-wood-light'
                        }`}>
                        {userProfile.xp % 1000} / 1000 XP
                    </span>
                </div>
                <div className={`w-full h-3 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-gray-700' : 'bg-wood-dark/30'
                    }`}>
                    <motion.div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${(userProfile.xp % 1000) / 10}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                </div>
            </div>

            <RankInfoModal
                isOpen={isRankModalOpen}
                onClose={() => setIsRankModalOpen(false)}
                theme={theme}
            />
        </div>
    );
};

export default ProfileStats;
