const fs = require('fs');
const path = require('path');

const USERS_FILE = path.join(__dirname, '../data/users.json');

// Rank tier definitions with thresholds
const RANK_TIERS = [
    { tier: 0, name: 'Novice Trader', minProfit: -Infinity, maxProfit: 0, icon: 'novice' },
    { tier: 1, name: 'Apprentice Trader', minProfit: 0, maxProfit: 50000, icon: 'apprentice' },
    { tier: 2, name: 'Skilled Trader', minProfit: 50000, maxProfit: 150000, icon: 'skilled' },
    { tier: 3, name: 'Expert Trader', minProfit: 150000, maxProfit: 300000, icon: 'expert' },
    { tier: 4, name: 'Master Trader', minProfit: 300000, maxProfit: 600000, icon: 'master' },
    { tier: 5, name: 'Elite Trader', minProfit: 600000, maxProfit: 1000000, icon: 'elite' },
    { tier: 6, name: 'Legendary Trader', minProfit: 1000000, maxProfit: Infinity, icon: 'legendary' }
];

class User {
    constructor(data) {
        this.userId = data.userId || this.generateId();
        this.username = data.username || 'Trader';
        this.walletBalance = data.walletBalance || 100000;
        this.totalProfit = data.totalProfit || 0;
        this.xp = data.xp || 0;
        this.level = data.level || 1;
        this.rank = data.rank || 0;
        this.rankName = data.rankName || 'Novice Trader';
        this.totalTrades = data.totalTrades || 0;
        this.winningTrades = data.winningTrades || 0;
        this.losingTrades = data.losingTrades || 0;
        this.bestTrade = data.bestTrade || 0;
        this.worstTrade = data.worstTrade || 0;
        this.currentStreak = data.currentStreak || 0;
        this.longestStreak = data.longestStreak || 0;
        this.achievements = data.achievements || [];
        this.createdAt = data.createdAt || new Date().toISOString();
        this.lastActive = data.lastActive || new Date().toISOString();
    }

    // Calculate rank based on total profit
    updateRank() {
        for (let i = RANK_TIERS.length - 1; i >= 0; i--) {
            const tier = RANK_TIERS[i];
            if (this.totalProfit >= tier.minProfit && this.totalProfit < tier.maxProfit) {
                this.rank = tier.tier;
                this.rankName = tier.name;
                break;
            }
        }
    }

    // Calculate level from XP (every 1000 XP = 1 level)
    updateLevel() {
        this.level = Math.floor(this.xp / 1000) + 1;
    }

    // Add XP and check for achievements
    addXp(amount) {
        this.xp += amount;
        this.updateLevel();
    }

    // Execute a trade and update stats
    executeTrade(pnl, betAmount) {
        this.walletBalance += pnl;
        this.totalProfit += pnl;
        this.totalTrades++;

        if (pnl > 0) {
            this.winningTrades++;
            this.currentStreak++;
            this.longestStreak = Math.max(this.longestStreak, this.currentStreak);
            this.addXp(100);
        } else if (pnl < 0) {
            this.losingTrades++;
            this.currentStreak = 0;
            this.addXp(10);
        } else {
            this.addXp(25);
        }

        // Track best/worst trades
        if (pnl > this.bestTrade) this.bestTrade = pnl;
        if (pnl < this.worstTrade) this.worstTrade = pnl;

        this.updateRank();
        this.checkAchievements();
        this.lastActive = new Date().toISOString();
    }

    // Check and award achievements
    checkAchievements() {
        const newAchievements = [];

        // First Trade
        if (this.totalTrades === 1 && !this.achievements.includes('first_trade')) {
            newAchievements.push('first_trade');
        }

        // Win Streak achievements
        if (this.currentStreak >= 5 && !this.achievements.includes('streak_5')) {
            newAchievements.push('streak_5');
        }
        if (this.currentStreak >= 10 && !this.achievements.includes('streak_10')) {
            newAchievements.push('streak_10');
        }

        // Profit milestones
        if (this.totalProfit >= 50000 && !this.achievements.includes('profit_50k')) {
            newAchievements.push('profit_50k');
        }
        if (this.totalProfit >= 100000 && !this.achievements.includes('profit_100k')) {
            newAchievements.push('profit_100k');
        }
        if (this.totalProfit >= 500000 && !this.achievements.includes('profit_500k')) {
            newAchievements.push('profit_500k');
        }

        // Trade volume
        if (this.totalTrades >= 10 && !this.achievements.includes('trades_10')) {
            newAchievements.push('trades_10');
        }
        if (this.totalTrades >= 50 && !this.achievements.includes('trades_50')) {
            newAchievements.push('trades_50');
        }
        if (this.totalTrades >= 100 && !this.achievements.includes('trades_100')) {
            newAchievements.push('trades_100');
        }

        this.achievements.push(...newAchievements);
        return newAchievements;
    }

    // Get win rate percentage
    getWinRate() {
        if (this.totalTrades === 0) return 0;
        return ((this.winningTrades / this.totalTrades) * 100).toFixed(1);
    }

    // Get rank info
    getRankInfo() {
        const currentTier = RANK_TIERS[this.rank];
        const nextTier = RANK_TIERS[this.rank + 1];

        return {
            tier: this.rank,
            name: this.rankName,
            icon: currentTier.icon,
            currentProfit: this.totalProfit,
            nextRankProfit: nextTier ? nextTier.minProfit : null,
            progressToNext: nextTier
                ? ((this.totalProfit - currentTier.minProfit) / (nextTier.minProfit - currentTier.minProfit) * 100).toFixed(1)
                : 100
        };
    }

    toJSON() {
        return {
            userId: this.userId,
            username: this.username,
            walletBalance: this.walletBalance,
            totalProfit: this.totalProfit,
            xp: this.xp,
            level: this.level,
            rank: this.rank,
            rankName: this.rankName,
            totalTrades: this.totalTrades,
            winningTrades: this.winningTrades,
            losingTrades: this.losingTrades,
            bestTrade: this.bestTrade,
            worstTrade: this.worstTrade,
            currentStreak: this.currentStreak,
            longestStreak: this.longestStreak,
            achievements: this.achievements,
            createdAt: this.createdAt,
            lastActive: this.lastActive
        };
    }

    generateId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Static methods for file operations
    static loadUsers() {
        try {
            if (fs.existsSync(USERS_FILE)) {
                const data = fs.readFileSync(USERS_FILE, 'utf8');
                return JSON.parse(data);
            }
        } catch (error) {
            console.error('Error loading users:', error);
        }
        return [];
    }

    static saveUsers(users) {
        try {
            fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
        } catch (error) {
            console.error('Error saving users:', error);
        }
    }

    static findById(userId) {
        const users = User.loadUsers();
        const userData = users.find(u => u.userId === userId);
        return userData ? new User(userData) : null;
    }

    static create(userData) {
        const user = new User(userData);
        const users = User.loadUsers();
        users.push(user.toJSON());
        User.saveUsers(users);
        return user;
    }

    save() {
        const users = User.loadUsers();
        const index = users.findIndex(u => u.userId === this.userId);
        if (index !== -1) {
            users[index] = this.toJSON();
        } else {
            users.push(this.toJSON());
        }
        User.saveUsers(users);
    }

    static getLeaderboard(limit = 10) {
        const users = User.loadUsers();
        return users
            .sort((a, b) => b.totalProfit - a.totalProfit)
            .slice(0, limit)
            .map((u, index) => ({
                position: index + 1,
                userId: u.userId,
                username: u.username,
                totalProfit: u.totalProfit,
                rank: u.rank,
                rankName: u.rankName,
                winRate: u.totalTrades > 0 ? ((u.winningTrades / u.totalTrades) * 100).toFixed(1) : 0,
                totalTrades: u.totalTrades
            }));
    }
}

module.exports = { User, RANK_TIERS };
