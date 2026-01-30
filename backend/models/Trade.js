const fs = require('fs');
const path = require('path');

const TRADES_FILE = path.join(__dirname, '../data/trades.json');

class Trade {
    constructor(data) {
        this.tradeId = data.tradeId || this.generateId();
        this.userId = data.userId;
        this.symbol = data.symbol || 'MARKET';
        this.position = data.position; // 'BUY', 'SELL', 'HOLD'
        this.betAmount = data.betAmount;
        this.entryPrice = data.entryPrice;
        this.exitPrice = data.exitPrice;
        this.pnl = data.pnl;
        this.leverage = data.leverage || 5;
        this.timestamp = data.timestamp || new Date().toISOString();
        this.duration = data.duration || 0; // in seconds
    }

    generateId() {
        return 'trade_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Calculate P&L based on position type
    static calculatePnL(position, betAmount, entryPrice, exitPrice, leverage = 5) {
        let pnl = 0;

        if (position === 'BUY') {
            const percentChange = (exitPrice - entryPrice) / entryPrice;
            pnl = betAmount * percentChange * leverage;
        } else if (position === 'SELL') {
            const percentChange = (entryPrice - exitPrice) / entryPrice;
            pnl = betAmount * percentChange * leverage;
        } else if (position === 'HOLD') {
            pnl = 0; // No gain or loss
        }

        return Math.round(pnl * 100) / 100; // Round to 2 decimals
    }

    toJSON() {
        return {
            tradeId: this.tradeId,
            userId: this.userId,
            symbol: this.symbol,
            position: this.position,
            betAmount: this.betAmount,
            entryPrice: this.entryPrice,
            exitPrice: this.exitPrice,
            pnl: this.pnl,
            leverage: this.leverage,
            timestamp: this.timestamp,
            duration: this.duration
        };
    }

    // Static methods for file operations
    static loadTrades() {
        try {
            if (fs.existsSync(TRADES_FILE)) {
                const data = fs.readFileSync(TRADES_FILE, 'utf8');
                return JSON.parse(data);
            }
        } catch (error) {
            console.error('Error loading trades:', error);
        }
        return [];
    }

    static saveTrades(trades) {
        try {
            fs.writeFileSync(TRADES_FILE, JSON.stringify(trades, null, 2));
        } catch (error) {
            console.error('Error saving trades:', error);
        }
    }

    static create(tradeData) {
        const trade = new Trade(tradeData);
        const trades = Trade.loadTrades();
        trades.push(trade.toJSON());
        Trade.saveTrades(trades);
        return trade;
    }

    static getHistory(userId, limit = 50) {
        const trades = Trade.loadTrades();
        return trades
            .filter(t => t.userId === userId)
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, limit);
    }

    static getUserStats(userId) {
        const trades = Trade.loadTrades().filter(t => t.userId === userId);

        if (trades.length === 0) {
            return {
                totalTrades: 0,
                totalPnL: 0,
                winRate: 0,
                avgProfit: 0,
                avgLoss: 0,
                bestTrade: 0,
                worstTrade: 0
            };
        }

        const winningTrades = trades.filter(t => t.pnl > 0);
        const losingTrades = trades.filter(t => t.pnl < 0);

        return {
            totalTrades: trades.length,
            totalPnL: trades.reduce((sum, t) => sum + t.pnl, 0),
            winRate: (winningTrades.length / trades.length * 100).toFixed(1),
            avgProfit: winningTrades.length > 0
                ? (winningTrades.reduce((sum, t) => sum + t.pnl, 0) / winningTrades.length).toFixed(2)
                : 0,
            avgLoss: losingTrades.length > 0
                ? (losingTrades.reduce((sum, t) => sum + t.pnl, 0) / losingTrades.length).toFixed(2)
                : 0,
            bestTrade: Math.max(...trades.map(t => t.pnl)),
            worstTrade: Math.min(...trades.map(t => t.pnl))
        };
    }
}

module.exports = Trade;
