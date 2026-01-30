const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { User, RANK_TIERS } = require('./models/User');
const Trade = require('./models/Trade');
const marketService = require('./services/marketService');
const achievementService = require('./services/achievementService');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize data files if they don't exist
const usersFile = path.join(dataDir, 'users.json');
const tradesFile = path.join(dataDir, 'trades.json');

if (!fs.existsSync(usersFile)) {
    fs.writeFileSync(usersFile, JSON.stringify([], null, 2));
}
if (!fs.existsSync(tradesFile)) {
    fs.writeFileSync(tradesFile, JSON.stringify([], null, 2));
}

// ============ MARKET DATA ENDPOINTS ============

// Get candle data for a symbol
app.get('/api/market/candles/:symbol', async (req, res) => {
    try {
        const { symbol } = req.params;
        const { interval = '5m', range = '1d' } = req.query;

        const candles = await marketService.getCandles(symbol, interval, range);

        res.json({
            success: true,
            symbol,
            data: candles,
            count: candles.length
        });
    } catch (error) {
        console.error('Error fetching candles:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get current price for a symbol
app.get('/api/market/price/:symbol', async (req, res) => {
    try {
        const { symbol } = req.params;
        const price = await marketService.getCurrentPrice(symbol);

        if (!price) {
            return res.status(404).json({
                success: false,
                error: 'Symbol not found'
            });
        }

        res.json({
            success: true,
            data: price
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get list of popular symbols
app.get('/api/market/symbols', (req, res) => {
    res.json({
        success: true,
        data: marketService.getPopularSymbols()
    });
});

// ============ USER ENDPOINTS ============

// Create or get user
app.post('/api/user/register', (req, res) => {
    try {
        const { username, userId } = req.body;

        // Check if user already exists
        if (userId) {
            const existingUser = User.findById(userId);
            if (existingUser) {
                return res.json({
                    success: true,
                    data: existingUser.toJSON(),
                    message: 'User already exists'
                });
            }
        }

        // Create new user
        const user = User.create({ username: username || 'Trader' });

        res.json({
            success: true,
            data: user.toJSON(),
            message: 'User created successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get user profile
app.get('/api/user/:userId', (req, res) => {
    try {
        const { userId } = req.params;
        const user = User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        res.json({
            success: true,
            data: {
                ...user.toJSON(),
                rankInfo: user.getRankInfo(),
                winRate: user.getWinRate()
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Update user profile
app.put('/api/user/:userId', (req, res) => {
    try {
        const { userId } = req.params;
        const user = User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        // Update allowed fields
        const { username } = req.body;
        if (username) user.username = username;

        user.save();

        res.json({
            success: true,
            data: user.toJSON(),
            message: 'User updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ============ TRADE ENDPOINTS ============

// Execute a trade
app.post('/api/trade/execute', (req, res) => {
    try {
        const { userId, symbol, position, betAmount, entryPrice, exitPrice, duration } = req.body;

        // Validate inputs
        if (!userId || !position || !betAmount || !entryPrice || !exitPrice) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields'
            });
        }

        // Get user
        const user = User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        // Check if user has enough balance
        if (betAmount > user.walletBalance) {
            return res.status(400).json({
                success: false,
                error: 'Insufficient balance'
            });
        }

        // Calculate P&L
        const pnl = Trade.calculatePnL(position, betAmount, entryPrice, exitPrice);

        // Create trade record
        const trade = Trade.create({
            userId,
            symbol: symbol || 'MARKET',
            position,
            betAmount,
            entryPrice,
            exitPrice,
            pnl,
            duration: duration || 0
        });

        // Update user stats
        const newAchievements = user.executeTrade(pnl, betAmount);
        user.save();

        res.json({
            success: true,
            data: {
                trade: trade.toJSON(),
                user: user.toJSON(),
                newAchievements: achievementService.formatUserAchievements(newAchievements),
                rankInfo: user.getRankInfo()
            },
            message: pnl >= 0 ? 'Trade successful!' : 'Trade completed'
        });
    } catch (error) {
        console.error('Trade execution error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get trade history
app.get('/api/trade/history/:userId', (req, res) => {
    try {
        const { userId } = req.params;
        const { limit = 50 } = req.query;

        const history = Trade.getHistory(userId, parseInt(limit));
        const stats = Trade.getUserStats(userId);

        res.json({
            success: true,
            data: {
                trades: history,
                stats
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ============ LEADERBOARD ENDPOINTS ============

// Get leaderboard
app.get('/api/leaderboard', (req, res) => {
    try {
        const { limit = 10 } = req.query;
        const leaderboard = User.getLeaderboard(parseInt(limit));

        res.json({
            success: true,
            data: leaderboard
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get user's leaderboard position
app.get('/api/leaderboard/position/:userId', (req, res) => {
    try {
        const { userId } = req.params;
        const allUsers = User.loadUsers();
        const sorted = allUsers.sort((a, b) => b.totalProfit - a.totalProfit);
        const position = sorted.findIndex(u => u.userId === userId) + 1;

        res.json({
            success: true,
            data: {
                position,
                totalPlayers: allUsers.length
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ============ ACHIEVEMENT ENDPOINTS ============

// Get all achievements
app.get('/api/achievements', (req, res) => {
    try {
        const achievements = achievementService.getAllAchievements();

        res.json({
            success: true,
            data: achievements
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get user achievements
app.get('/api/achievements/:userId', (req, res) => {
    try {
        const { userId } = req.params;
        const user = User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        const userAchievements = achievementService.formatUserAchievements(user.achievements);
        const allAchievements = achievementService.getAllAchievements();

        res.json({
            success: true,
            data: {
                unlocked: userAchievements,
                locked: allAchievements.filter(a => !user.achievements.includes(a.id)),
                progress: {
                    unlocked: userAchievements.length,
                    total: allAchievements.length,
                    percentage: ((userAchievements.length / allAchievements.length) * 100).toFixed(1)
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ============ RANK ENDPOINTS ============

// Get rank tiers
app.get('/api/ranks', (req, res) => {
    res.json({
        success: true,
        data: RANK_TIERS
    });
});

// ============ HEALTH CHECK ============

app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Trading API Server running on http://localhost:${PORT}`);
    console.log(`📊 Market data: http://localhost:${PORT}/api/market/symbols`);
    console.log(`🏆 Leaderboard: http://localhost:${PORT}/api/leaderboard`);
    console.log(`✅ Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
