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

        <div className="bg-wood-dark/50 rounded-xl border-4 border-wood-dark p-1 relative">
            {/* Header Sign */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-wood border-4 border-wood-dark px-6 py-2 rounded-lg shadow-xl z-10 flex items-center gap-2 transform hover:scale-105 transition-transform cursor-default">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <h2 className="text-lg font-pixel text-parchment uppercase tracking-wider text-shadow-sm">LEADERBOARD</h2>
                <Trophy className="w-5 h-5 text-yellow-500" />
            </div>

            <div className="bg-parchment/10 p-4 pt-8 rounded-lg space-y-3 h-full overflow-y-auto custom-scrollbar">
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
                                className={`relative group ${isCurrentUser ? 'z-10 scale-[1.02]' : ''}`}
                            >
                                {/* Wooden Slat Background */}
                                <div className={`absolute inset-0 rounded border-b-4 shadow-md transition-colors ${isCurrentUser
                                    ? 'bg-amber-700 border-amber-900'
                                    : 'bg-parchment border-[#cbbfa6]'
                                    }`}></div>

                                {/* Content */}
                                <div className="relative p-2 flex items-center gap-3">
                                    {/* Rank Icon Container */}
                                    <div className="flex-shrink-0 relative">
                                        <RankIcon tier={entry.rank} size={36} />
                                        {/* Position Badge */}
                                        <div className={`absolute -top-2 -left-2 w-6 h-6 rounded-full flex items-center justify-center font-pixel text-[10px] border-2 shadow-sm ${entry.position <= 3 ? 'bg-yellow-400 border-yellow-600 text-yellow-900' : 'bg-wood-dark border-wood text-parchment'
                                            }`}>
                                            {entry.position}
                                        </div>
                                    </div>

                                    {/* User Info */}
                                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                                        <div className={`font-pixel text-sm truncate leading-tight ${isCurrentUser ? 'text-parchment' : 'text-coffee'
                                            }`}>
                                            {entry.username}
                                        </div>
                                        <div className={`text-[10px] font-pixel uppercase opacity-70 ${isCurrentUser ? 'text-parchment' : 'text-wood-light'
                                            }`}>
                                            {entry.rankName}
                                        </div>
                                    </div>

                                    {/* Stats (Right Side) */}
                                    <div className={`text-right ${isCurrentUser ? 'text-parchment' : 'text-coffee'}`}>
                                        <div className="font-pixel text-xs">
                                            ₹{entry.totalProfit.toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* User's position fixed at bottom if needed (omitted for cleaner scroll look as per request) */}
        </div>
    );
};

export default Leaderboard;
