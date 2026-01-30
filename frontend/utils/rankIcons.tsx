import React from 'react';

interface RankIconProps {
    tier: number;
    size?: number;
    className?: string;
    animated?: boolean;
}

const RankIcon: React.FC<RankIconProps> = ({ tier, size = 48, className = '', animated = false }) => {
    const getIconByTier = (tier: number) => {
        const animClass = animated ? 'animate-pulse' : '';

        switch (tier) {
            case 0: // Novice
                return (
                    <svg width={size} height={size} viewBox="0 0 64 64" className={`${className} ${animClass}`}>
                        <circle cx="32" cy="32" r="28" fill="#8B7355" stroke="#5C4033" strokeWidth="3" />
                        <path d="M32 12 L38 28 L54 28 L42 38 L46 54 L32 44 L18 54 L22 38 L10 28 L26 28 Z" fill="#A0826D" stroke="#5C4033" strokeWidth="2" />
                        <text x="32" y="38" fontSize="16" fill="#3E2723" fontWeight="bold" textAnchor="middle">N</text>
                    </svg>
                );

            case 1: // Apprentice
                return (
                    <svg width={size} height={size} viewBox="0 0 64 64" className={`${className} ${animClass}`}>
                        <circle cx="32" cy="32" r="28" fill="#C0C0C0" stroke="#808080" strokeWidth="3" />
                        <path d="M32 12 L38 28 L54 28 L42 38 L46 54 L32 44 L18 54 L22 38 L10 28 L26 28 Z" fill="#E8E8E8" stroke="#808080" strokeWidth="2" />
                        <circle cx="32" cy="32" r="8" fill="#A0A0A0" />
                        <text x="32" y="38" fontSize="14" fill="#3E2723" fontWeight="bold" textAnchor="middle">A</text>
                    </svg>
                );

            case 2: // Skilled
                return (
                    <svg width={size} height={size} viewBox="0 0 64 64" className={`${className} ${animClass}`}>
                        <circle cx="32" cy="32" r="28" fill="#FFD700" stroke="#DAA520" strokeWidth="3" />
                        <path d="M32 12 L38 28 L54 28 L42 38 L46 54 L32 44 L18 54 L22 38 L10 28 L26 28 Z" fill="#FFF4A3" stroke="#DAA520" strokeWidth="2" />
                        <circle cx="32" cy="32" r="10" fill="#FFE55C" />
                        <text x="32" y="38" fontSize="14" fill="#8B6914" fontWeight="bold" textAnchor="middle">S</text>
                    </svg>
                );

            case 3: // Expert
                return (
                    <svg width={size} height={size} viewBox="0 0 64 64" className={`${className} ${animClass}`}>
                        <defs>
                            <linearGradient id="expertGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#4A90E2" />
                                <stop offset="100%" stopColor="#357ABD" />
                            </linearGradient>
                        </defs>
                        <circle cx="32" cy="32" r="28" fill="url(#expertGrad)" stroke="#2C5F8D" strokeWidth="3" />
                        <path d="M32 10 L36 24 L50 24 L40 32 L44 46 L32 38 L20 46 L24 32 L14 24 L28 24 Z" fill="#6CB4E8" stroke="#2C5F8D" strokeWidth="2" />
                        <polygon points="32,18 36,26 44,26 38,32 40,40 32,35 24,40 26,32 20,26 28,26" fill="#8FCFFF" />
                        <text x="32" y="38" fontSize="14" fill="#FFF" fontWeight="bold" textAnchor="middle">E</text>
                    </svg>
                );

            case 4: // Master
                return (
                    <svg width={size} height={size} viewBox="0 0 64 64" className={`${className} ${animClass}`}>
                        <defs>
                            <linearGradient id="masterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#9B59B6" />
                                <stop offset="100%" stopColor="#8E44AD" />
                            </linearGradient>
                            <radialGradient id="masterGlow">
                                <stop offset="0%" stopColor="#D7BDE2" stopOpacity="0.8" />
                                <stop offset="100%" stopColor="#9B59B6" stopOpacity="0" />
                            </radialGradient>
                        </defs>
                        <circle cx="32" cy="32" r="30" fill="url(#masterGlow)" />
                        <circle cx="32" cy="32" r="28" fill="url(#masterGrad)" stroke="#6C3483" strokeWidth="3" />
                        <path d="M32 8 L36 22 L50 22 L40 30 L44 44 L32 36 L20 44 L24 30 L14 22 L28 22 Z" fill="#C39BD3" stroke="#6C3483" strokeWidth="2" />
                        <circle cx="32" cy="32" r="12" fill="#BB8FCE" />
                        <text x="32" y="38" fontSize="14" fill="#FFF" fontWeight="bold" textAnchor="middle">M</text>
                    </svg>
                );

            case 5: // Elite
                return (
                    <svg width={size} height={size} viewBox="0 0 64 64" className={`${className} ${animClass}`}>
                        <defs>
                            <linearGradient id="eliteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#E74C3C" />
                                <stop offset="100%" stopColor="#C0392B" />
                            </linearGradient>
                            <radialGradient id="eliteGlow">
                                <stop offset="0%" stopColor="#F1948A" stopOpacity="0.9" />
                                <stop offset="100%" stopColor="#E74C3C" stopOpacity="0" />
                            </radialGradient>
                        </defs>
                        <circle cx="32" cy="32" r="30" fill="url(#eliteGlow)" />
                        <circle cx="32" cy="32" r="28" fill="url(#eliteGrad)" stroke="#922B21" strokeWidth="3" />
                        <path d="M32 6 L37 20 L52 20 L41 28 L46 42 L32 34 L18 42 L23 28 L12 20 L27 20 Z" fill="#EC7063" stroke="#922B21" strokeWidth="2" />
                        <path d="M32 14 L35 24 L45 24 L37 30 L40 40 L32 34 L24 40 L27 30 L19 24 L29 24 Z" fill="#F5B7B1" />
                        <circle cx="32" cy="32" r="10" fill="#F1948A" />
                        <text x="32" y="38" fontSize="13" fill="#FFF" fontWeight="bold" textAnchor="middle">EL</text>
                    </svg>
                );

            case 6: // Legendary
                return (
                    <svg width={size} height={size} viewBox="0 0 64 64" className={`${className} ${animClass ? 'animate-spin-slow' : ''}`}>
                        <defs>
                            <linearGradient id="legendGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#FFD700" />
                                <stop offset="50%" stopColor="#FFA500" />
                                <stop offset="100%" stopColor="#FF8C00" />
                            </linearGradient>
                            <radialGradient id="legendGlow">
                                <stop offset="0%" stopColor="#FFEB3B" stopOpacity="1" />
                                <stop offset="50%" stopColor="#FFC107" stopOpacity="0.5" />
                                <stop offset="100%" stopColor="#FF9800" stopOpacity="0" />
                            </radialGradient>
                            <filter id="glow">
                                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>
                        <circle cx="32" cy="32" r="32" fill="url(#legendGlow)" />
                        <circle cx="32" cy="32" r="28" fill="url(#legendGrad)" stroke="#B8860B" strokeWidth="3" filter="url(#glow)" />
                        <path d="M32 4 L38 18 L54 18 L42 26 L48 40 L32 32 L16 40 L22 26 L10 18 L26 18 Z" fill="#FFEB3B" stroke="#B8860B" strokeWidth="2" />
                        <path d="M32 12 L36 22 L46 22 L38 28 L42 38 L32 32 L22 38 L26 28 L18 22 L28 22 Z" fill="#FFF9C4" />
                        <circle cx="32" cy="32" r="12" fill="#FFE082" />
                        <circle cx="32" cy="32" r="8" fill="#FFEB3B" />
                        <text x="32" y="38" fontSize="12" fill="#8B6914" fontWeight="bold" textAnchor="middle">★L★</text>
                    </svg>
                );

            default:
                return (
                    <svg width={size} height={size} viewBox="0 0 64 64" className={className}>
                        <circle cx="32" cy="32" r="28" fill="#999" stroke="#666" strokeWidth="3" />
                        <text x="32" y="38" fontSize="16" fill="#FFF" fontWeight="bold" textAnchor="middle">?</text>
                    </svg>
                );
        }
    };

    return getIconByTier(tier);
};

export default RankIcon;

// Helper function to get rank name
export const getRankName = (tier: number): string => {
    const names = [
        'Novice Trader',
        'Apprentice Trader',
        'Skilled Trader',
        'Expert Trader',
        'Master Trader',
        'Elite Trader',
        'Legendary Trader'
    ];
    return names[tier] || 'Unknown';
};

export const RANK_THRESHOLDS = [
    { tier: 0, name: 'Novice Trader', minProfit: -Infinity },
    { tier: 1, name: 'Apprentice Trader', minProfit: 1000 },
    { tier: 2, name: 'Skilled Trader', minProfit: 50000 },
    { tier: 3, name: 'Expert Trader', minProfit: 150000 },
    { tier: 4, name: 'Master Trader', minProfit: 300000 },
    { tier: 5, name: 'Elite Trader', minProfit: 600000 },
    { tier: 6, name: 'Legendary Trader', minProfit: 1000000 }
];

export const getRankTier = (profit: number): number => {
    for (let i = RANK_THRESHOLDS.length - 1; i >= 0; i--) {
        if (profit >= RANK_THRESHOLDS[i].minProfit) {
            return RANK_THRESHOLDS[i].tier;
        }
    }
    return 0; // Default to Novice
};

// Helper function to get rank color
export const getRankColor = (tier: number): string => {
    const colors = [
        '#8B7355', // Bronze
        '#C0C0C0', // Silver
        '#FFD700', // Gold
        '#4A90E2', // Blue
        '#9B59B6', // Purple
        '#E74C3C', // Red
        '#FFA500'  // Orange/Gold
    ];
    return colors[tier] || '#999';
};

// Helper function to get rank icon as JSX
export const getRankIcon = (tier: number, size: number = 48) => {
    return <RankIcon tier={tier} size={size} />;
};
