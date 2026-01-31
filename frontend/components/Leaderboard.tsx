import React, { useEffect, useState } from 'react';
import { Trophy, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import RankIcon from '../utils/rankIcons';
import { LeaderboardEntry } from '../types';
import { subscribeToLeaderboard } from '../services/firebaseApi';

interface LeaderboardProps {
    userId?: string;
    limit?: number;
    showBack?: boolean;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ userId, limit = 10, showBack = true }) => {
    const navigate = useNavigate();
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [userPosition, setUserPosition] = useState<number | null>(null);

    useEffect(() => {
        setLoading(true);
        const unsubscribe = subscribeToLeaderboard((entries) => {
            setLeaderboard(entries);
            setLoading(false);

            // Calculate user position from loaded entries if present
            if (userId) {
                const userEntry = entries.find(e => e.userId === userId);
                if (userEntry) {
                    setUserPosition(userEntry.position);
                }
            }
        }, limit);

        return () => unsubscribe();
    }, [limit, userId]);

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
        <div className="bg-wood-dark/50 rounded-xl border-4 border-wood-dark p-1 relative mt-16">
            {/* Header Sign */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-wood border-4 border-wood-dark px-6 py-2 rounded-lg shadow-xl z-10 flex items-center gap-2 transform hover:scale-105 transition-transform cursor-default">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <div className="flex flex-col items-center">
                    <h2 className="text-sm md:text-base font-pixel text-parchment uppercase tracking-wider text-shadow-sm leading-none mb-1">
                        {limit === 5 ? 'GLOBAL RANK' : 'LEADERBOARD'}
                    </h2>
                    {limit === 5 && (
                        <div className="text-[7px] md:text-[8px] font-pixel text-amber-200 uppercase tracking-tight whitespace-nowrap">
                            TOP 5 GLOBAL PLAYERS
                        </div>
                    )}
                </div>
                <Trophy className="w-5 h-5 text-yellow-500" />
            </div>

            {/* Back Button */}
            {showBack && (
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-2 left-2 bg-failure text-white border-2 border-red-900 rounded p-1 z-20 hover:bg-red-700 transition-colors shadow-sm"
                    title="Leave Leaderboard"
                >
                    <ArrowLeft size={16} />
                </button>
            )}

            <div className="bg-parchment/10 p-4 pt-8 rounded-lg space-y-3 h-full overflow-y-auto custom-scrollbar">
                <AnimatePresence>
                    {leaderboard.length === 0 ? (
                        <div className="text-center py-8">
                            <div className="text-wood-light font-pixel text-lg opacity-70 mb-2">NO TRADERS FOUND</div>
                            <div className="text-xs text-wood-light/50 font-pixel">Be the first to trade!</div>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {leaderboard.map((entry, index) => {
                                const isCurrentUser = userId === entry.userId;
                                return (
                                    <motion.div
                                        key={entry.userId}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className={`relative group rounded-lg overflow-hidden border-b-4 transition-transform hover:scale-[1.02] ${isCurrentUser
                                            ? 'bg-amber-700 border-amber-900 z-10 ring-2 ring-yellow-400'
                                            : 'bg-parchment border-[#cbbfa6]'}`}
                                    >
                                        <div className="relative p-3 flex items-center gap-3">
                                            {/* Rank & Position */}
                                            <div className="flex-shrink-0 relative">
                                                <RankIcon tier={entry.rank} size={40} />
                                                <div className={`absolute -top-1 -left-1 w-6 h-6 rounded-full flex items-center justify-center font-pixel text-[10px] border-2 shadow-sm ${entry.position <= 3
                                                    ? 'bg-yellow-400 border-yellow-600 text-yellow-900'
                                                    : 'bg-wood-dark border-wood text-parchment'
                                                    }`}>
                                                    {entry.position}
                                                </div>
                                            </div>

                                            {/* User Details */}
                                            <div className="flex-1 min-w-0">
                                                <div className={`font-pixel text-sm truncate ${isCurrentUser ? 'text-parchment' : 'text-coffee'}`}>
                                                    {entry.username || 'Anonymous Trader'}
                                                </div>
                                                <div className={`text-[10px] font-pixel uppercase ${isCurrentUser ? 'text-parchment/70' : 'text-wood-light'}`}>
                                                    {entry.rankName}
                                                </div>
                                            </div>

                                            {/* Profit */}
                                            <div className={`text-right font-pixel text-sm ${isCurrentUser ? 'text-parchment' : 'text-coffee'}`}>
                                                ₹{entry.totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Leaderboard;
