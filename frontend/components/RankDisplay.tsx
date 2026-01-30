import React from 'react';
import RankIcon, { getRankName } from '../utils/rankIcons';
import { motion } from 'framer-motion';

interface RankDisplayProps {
    rank: number;
    rankName?: string;
    totalProfit?: number;
    nextRankProfit?: number;
    showProgress?: boolean;
    size?: 'small' | 'medium' | 'large';
}

const RankDisplay: React.FC<RankDisplayProps> = ({
    rank,
    rankName,
    totalProfit = 0,
    nextRankProfit,
    showProgress = false,
    size = 'medium'
}) => {
    const displayName = rankName || getRankName(rank);
    const iconSize = size === 'small' ? 32 : size === 'large' ? 64 : 48;

    // Calculate progress to next rank
    const progress = nextRankProfit && totalProfit >= 0
        ? Math.min(100, (totalProfit / nextRankProfit) * 100)
        : 0;

    return (
        <div className="flex items-center gap-3">
            <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            >
                <RankIcon tier={rank} size={iconSize} animated={rank >= 5} />
            </motion.div>

            <div className="flex flex-col">
                <div className="font-pixel text-sm text-parchment dark:text-gray-200">
                    {displayName}
                </div>

                {showProgress && nextRankProfit && (
                    <div className="mt-1">
                        <div className="w-32 h-2 bg-wood-dark/30 dark:bg-gray-700 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-gradient-to-r from-success to-green-400"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.5, ease: 'easeOut' }}
                            />
                        </div>
                        <div className="text-xs font-body text-wood-light dark:text-gray-400 mt-0.5">
                            {totalProfit.toLocaleString()} / {nextRankProfit.toLocaleString()}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RankDisplay;
