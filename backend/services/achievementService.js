// Achievement definitions with RPG-style descriptions
const ACHIEVEMENTS = {
    // First steps
    first_trade: {
        id: 'first_trade',
        name: 'First Steps',
        description: 'Execute your first trade',
        icon: '🎯',
        rarity: 'common',
        xpReward: 100
    },

    // Trading streaks
    streak_5: {
        id: 'streak_5',
        name: 'Hot Streak',
        description: 'Win 5 trades in a row',
        icon: '🔥',
        rarity: 'uncommon',
        xpReward: 500
    },
    streak_10: {
        id: 'streak_10',
        name: 'Unstoppable',
        description: 'Win 10 trades in a row',
        icon: '⚡',
        rarity: 'rare',
        xpReward: 1000
    },

    // Profit milestones
    profit_50k: {
        id: 'profit_50k',
        name: 'Rising Star',
        description: 'Reach ₹50,000 total profit',
        icon: '⭐',
        rarity: 'uncommon',
        xpReward: 300
    },
    profit_100k: {
        id: 'profit_100k',
        name: 'Six Figures',
        description: 'Reach ₹100,000 total profit',
        icon: '💰',
        rarity: 'rare',
        xpReward: 500
    },
    profit_500k: {
        id: 'profit_500k',
        name: 'Market Master',
        description: 'Reach ₹500,000 total profit',
        icon: '👑',
        rarity: 'epic',
        xpReward: 2000
    },
    profit_1m: {
        id: 'profit_1m',
        name: 'Millionaire Trader',
        description: 'Reach ₹1,000,000 total profit',
        icon: '💎',
        rarity: 'legendary',
        xpReward: 5000
    },

    // Trade volume
    trades_10: {
        id: 'trades_10',
        name: 'Getting Started',
        description: 'Complete 10 trades',
        icon: '📊',
        rarity: 'common',
        xpReward: 200
    },
    trades_50: {
        id: 'trades_50',
        name: 'Active Trader',
        description: 'Complete 50 trades',
        icon: '📈',
        rarity: 'uncommon',
        xpReward: 500
    },
    trades_100: {
        id: 'trades_100',
        name: 'Veteran Trader',
        description: 'Complete 100 trades',
        icon: '🏆',
        rarity: 'rare',
        xpReward: 1000
    },
    trades_500: {
        id: 'trades_500',
        name: 'Trading Legend',
        description: 'Complete 500 trades',
        icon: '🎖️',
        rarity: 'epic',
        xpReward: 3000
    },

    // Win rate achievements
    winrate_70: {
        id: 'winrate_70',
        name: 'Consistent Winner',
        description: 'Achieve 70% win rate (min 20 trades)',
        icon: '🎲',
        rarity: 'rare',
        xpReward: 800
    },
    winrate_80: {
        id: 'winrate_80',
        name: 'Sharp Shooter',
        description: 'Achieve 80% win rate (min 50 trades)',
        icon: '🎯',
        rarity: 'epic',
        xpReward: 2000
    },

    // Special achievements
    perfect_day: {
        id: 'perfect_day',
        name: 'Perfect Day',
        description: 'Win 10 trades in a single day',
        icon: '☀️',
        rarity: 'rare',
        xpReward: 1000
    },
    comeback_king: {
        id: 'comeback_king',
        name: 'Comeback King',
        description: 'Recover from -50k to positive profit',
        icon: '🦅',
        rarity: 'epic',
        xpReward: 1500
    },
    risk_taker: {
        id: 'risk_taker',
        name: 'Risk Taker',
        description: 'Place a bet of ₹50,000 or more',
        icon: '🎰',
        rarity: 'uncommon',
        xpReward: 300
    },
    diamond_hands: {
        id: 'diamond_hands',
        name: 'Diamond Hands',
        description: 'Hold through 5 consecutive trades',
        icon: '💎',
        rarity: 'uncommon',
        xpReward: 400
    }
};

class AchievementService {
    // Get all achievement definitions
    getAllAchievements() {
        return Object.values(ACHIEVEMENTS);
    }

    // Get achievement by ID
    getAchievement(achievementId) {
        return ACHIEVEMENTS[achievementId] || null;
    }

    // Get achievements by rarity
    getByRarity(rarity) {
        return Object.values(ACHIEVEMENTS).filter(a => a.rarity === rarity);
    }

    // Check if user qualifies for new achievements
    checkUserAchievements(user, tradeHistory) {
        const newAchievements = [];
        const userAchievements = user.achievements || [];

        // First trade
        if (user.totalTrades === 1 && !userAchievements.includes('first_trade')) {
            newAchievements.push('first_trade');
        }

        // Streaks
        if (user.currentStreak >= 5 && !userAchievements.includes('streak_5')) {
            newAchievements.push('streak_5');
        }
        if (user.currentStreak >= 10 && !userAchievements.includes('streak_10')) {
            newAchievements.push('streak_10');
        }

        // Profit milestones
        if (user.totalProfit >= 50000 && !userAchievements.includes('profit_50k')) {
            newAchievements.push('profit_50k');
        }
        if (user.totalProfit >= 100000 && !userAchievements.includes('profit_100k')) {
            newAchievements.push('profit_100k');
        }
        if (user.totalProfit >= 500000 && !userAchievements.includes('profit_500k')) {
            newAchievements.push('profit_500k');
        }
        if (user.totalProfit >= 1000000 && !userAchievements.includes('profit_1m')) {
            newAchievements.push('profit_1m');
        }

        // Trade volume
        if (user.totalTrades >= 10 && !userAchievements.includes('trades_10')) {
            newAchievements.push('trades_10');
        }
        if (user.totalTrades >= 50 && !userAchievements.includes('trades_50')) {
            newAchievements.push('trades_50');
        }
        if (user.totalTrades >= 100 && !userAchievements.includes('trades_100')) {
            newAchievements.push('trades_100');
        }
        if (user.totalTrades >= 500 && !userAchievements.includes('trades_500')) {
            newAchievements.push('trades_500');
        }

        // Win rate achievements
        const winRate = user.totalTrades > 0 ? (user.winningTrades / user.totalTrades) * 100 : 0;
        if (winRate >= 70 && user.totalTrades >= 20 && !userAchievements.includes('winrate_70')) {
            newAchievements.push('winrate_70');
        }
        if (winRate >= 80 && user.totalTrades >= 50 && !userAchievements.includes('winrate_80')) {
            newAchievements.push('winrate_80');
        }

        return newAchievements.map(id => ACHIEVEMENTS[id]);
    }

    // Format achievements for display
    formatUserAchievements(achievementIds) {
        return achievementIds.map(id => ACHIEVEMENTS[id]).filter(a => a);
    }

    // Calculate total XP from achievements
    calculateAchievementXP(achievementIds) {
        return achievementIds.reduce((total, id) => {
            const achievement = ACHIEVEMENTS[id];
            return total + (achievement ? achievement.xpReward : 0);
        }, 0);
    }
}

module.exports = new AchievementService();
