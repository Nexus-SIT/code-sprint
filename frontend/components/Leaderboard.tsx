import React, { useEffect, useState } from 'react';
import { Trophy, TrendingUp, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import RankIcon from '../utils/rankIcons';
import { LeaderboardEntry } from '../types';
import api from '../services/api';

interface LeaderboardProps {
    userId?: string;
    limit?: number;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ userId, limit = 10 }) => {
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [userPosition, setUserPosition] = useState<number | null>(null);

    useEffect(() => {
        fetchLeaderboard();
    }, [limit]);

    const fetchLeaderboard = async () => {
        try {
            setLoading(true);
            const data = await api.getLeaderboard(limit);
            setLeaderboard(data);

            // Get user's position if userId provided
            if (userId) {
                const posData = await api.getLeaderboardPosition(userId);
                setUserPosition(posData.position);
            }
        } catch (error) {
            console.error('Failed to fetch leaderboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const getMedalColor = (position: number) => {
        if (position === 1) return 'text-yellow-400';
        if (position === 2) return 'text-gray-300';
        if (position === 3) return 'text-amber-600';
        return 'text-wood-light dark:text-gray-500';
    };

    if (loading) {
        return (
            <div className="bg-parchment dark:bg-gray-800 rounded-lg border-4 border-wood-dark dark:border-gray-700 p-6 shadow-pixel">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-wood/20 dark:bg-gray-700 rounded w-1/2"></div>
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-16 bg-wood/10 dark:bg-gray-700 rounded"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-parchment dark:bg-gray-800 rounded-lg border-4 border-wood-dark dark:border-gray-700 p-6 shadow-pixel">
            <div className="flex items-center gap-3 mb-6">
                <Trophy className="w-8 h-8 text-yellow-500" />
                <h2 className="text-2xl font-pixel text-coffee dark:text-gray-100">HALL OF FAME</h2>
            </div>

            <div className="space-y-3">
                <AnimatePresence>
                    {leaderboard.map((entry, index) => {
                        const isCurrentUser = userId && entry.userId === userId;

                        return (
                            <motion.div
                                key={entry.userId}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ delay: index * 0.05 }}
                                className={`flex items-center gap-4 p-3 rounded-lg border-2 transition-all ${isCurrentUser
                                        ? 'bg-success/20 dark:bg-green-900/30 border-success dark:border-green-600 shadow-lg'
                                        : 'bg-wood/10 dark:bg-gray-700/50 border-wood-light/30 dark:border-gray-600 hover:bg-wood/20 dark:hover:bg-gray-700'
                                    }`}
                            >
                                {/* Position */}
                                <div className={`flex items-center justify-center w-10 h-10 font-pixel text-lg ${getMedalColor(entry.position)}`}>
                                    {entry.position <= 3 ? (
                                        <Trophy className="w-6 h-6" />
                                    ) : (
                                        <span>#{entry.position}</span>
                                    )}
                                </div>

                                {/* Rank Icon */}
                                <div className="flex-shrink-0">
                                    <RankIcon tier={entry.rank} size={40} />
                                </div>

                                {/* User Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="font-pixel text-sm text-coffee dark:text-gray-100 truncate">
                                        {entry.username}
                                    </div>
                                    <div className="text-xs font-body text-wood-light dark:text-gray-400">
                                        {entry.rankName}
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="flex flex-col items-end gap-1">
                                    <div className={`font-pixel text-sm flex items-center gap-1 ${entry.totalProfit >= 0 ? 'text-success dark:text-green-400' : 'text-failure dark:text-red-400'
                                        }`}>
                                        <TrendingUp className="w-4 h-4" />
                                        {entry.totalProfit >= 0 ? '+' : ''}{entry.totalProfit.toLocaleString()}
                                    </div>
                                    <div className="text-xs font-body text-wood-light dark:text-gray-400 flex items-center gap-1">
                                        <Target className="w-3 h-3" />
                                        {entry.winRate}% WR
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* User's position if not in top 10 */}
            {userId && userPosition && userPosition > limit && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 pt-4 border-t-2 border-wood-dark/30 dark:border-gray-600"
                >
                    <div className="text-center font-pixel text-sm text-wood-light dark:text-gray-400">
                        Your Position: #{userPosition}
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default Leaderboard;
