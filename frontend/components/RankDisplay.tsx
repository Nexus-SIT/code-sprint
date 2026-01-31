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
        <div className="relative group">
            {/* Shield Container Background (using SVG or CSS shape) */}
            <div className="absolute inset-0 bg-wood-dark rounded-b-full shadow-pixel transform scale-110 opacity-50 translate-y-1"></div>

            <div className="relative bg-wood border-4 border-wood-dark rounded-b-[40px] rounded-t-lg p-4 flex flex-col items-center shadow-lg w-48 transition-transform hover:scale-105">
                {/* Shiny Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none rounded-b-[36px] rounded-t-lg"></div>

                {/* Star / Rank Icon */}
                <div className="-mt-10 mb-2 relative z-10 drop-shadow-xl">
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    >
                        <RankIcon tier={rank} size={64} animated={rank >= 5} />
                    </motion.div>
                </div>

                {/* Rank Name */}
                <div className="font-pixel text-base text-parchment uppercase tracking-wide text-center drop-shadow-md mb-3">
                    {displayName}
                </div>

                {/* Progress Bar (Ingrained) */}
                {showProgress && nextRankProfit && (
                    <div className="w-full relative">
                        {/* Bar Background (Inset) */}
                        <div className="h-4 bg-wood-darker rounded-full shadow-inner border border-wood-light/20 overflow-hidden relative">
                            {/* Striped Texture */}
                            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 2px, transparent 2px, transparent 6px)' }}></div>

                            <motion.div
                                className="h-full bg-gradient-to-r from-amber-600 to-yellow-500 shadow-md"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.5, ease: 'easeOut' }}
                            />
                        </div>

                        <div className="text-[10px] font-pixel text-wood-light text-center mt-1 opacity-80">
                            {progress.toFixed(0)}% TO NEXT TIER
                        </div>
                    </div>
                )}
            </div>

            {/* Tooltip for exact values */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none z-20 font-body">
                {totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / {nextRankProfit?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} XP
            </div>
        </div>
    );
};

export default RankDisplay;
