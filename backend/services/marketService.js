const yahooFinance = require('yahoo-finance2').default;

class MarketService {
    constructor() {
        this.cache = new Map();
        this.cacheTimeout = 60000; // 1 minute cache
    }

    // Get real-time candle data for a symbol
    async getCandles(symbol, interval = '5m', range = '1d') {
        const cacheKey = `${symbol}_${interval}_${range}`;

        // Check cache
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.cacheTimeout) {
                return cached.data;
            }
        }

        try {
            // Fetch from Yahoo Finance
            const result = await yahooFinance.chart(symbol, {
                period1: this.getPeriodStart(range),
                interval: interval
            });

            if (!result || !result.quotes || result.quotes.length === 0) {
                throw new Error('No data available');
            }

            // Format data for frontend
            const candles = result.quotes.map((quote, index) => ({
                time: index,
                timestamp: quote.date ? quote.date.getTime() : Date.now(),
                open: quote.open || 0,
                high: quote.high || 0,
                low: quote.low || 0,
                close: quote.close || 0,
                volume: quote.volume || 0
            })).filter(c => c.close > 0); // Remove invalid candles

            // Cache the result
            this.cache.set(cacheKey, {
                data: candles,
                timestamp: Date.now()
            });

            return candles;
        } catch (error) {
            console.error(`Error fetching candles for ${symbol}:`, error.message);

            // Fallback to generated data if API fails
            return this.generateFallbackCandles(100, 200);
        }
    }

    // Get multiple symbols at once
    async getMultipleCandles(symbols, interval = '5m', range = '1d') {
        const promises = symbols.map(symbol =>
            this.getCandles(symbol, interval, range).catch(err => {
                console.error(`Failed to fetch ${symbol}:`, err.message);
                return null;
            })
        );

        const results = await Promise.all(promises);

        return symbols.reduce((acc, symbol, index) => {
            if (results[index]) {
                acc[symbol] = results[index];
            }
            return acc;
        }, {});
    }

    // Get current price for a symbol
    async getCurrentPrice(symbol) {
        try {
            const quote = await yahooFinance.quote(symbol);
            return {
                symbol: symbol,
                price: quote.regularMarketPrice,
                change: quote.regularMarketChange,
                changePercent: quote.regularMarketChangePercent,
                timestamp: Date.now()
            };
        } catch (error) {
            console.error(`Error fetching price for ${symbol}:`, error.message);
            return null;
        }
    }

    // Helper to calculate period start time
    getPeriodStart(range) {
        const now = new Date();
        const periods = {
            '1d': 1,
            '5d': 5,
            '1mo': 30,
            '3mo': 90,
            '6mo': 180,
            '1y': 365
        };

        const days = periods[range] || 1;
        return new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    }

    // Fallback data generator (same as frontend)
    generateFallbackCandles(count, startPrice = 100) {
        let currentPrice = startPrice;
        const candles = [];

        for (let i = 0; i < count; i++) {
            const volatility = currentPrice * 0.02; // 2% volatility
            const change = (Math.random() - 0.5) * volatility;

            const open = currentPrice;
            const close = currentPrice + change;
            const high = Math.max(open, close) + Math.random() * (volatility * 0.5);
            const low = Math.min(open, close) - Math.random() * (volatility * 0.5);

            candles.push({
                time: i,
                timestamp: Date.now() + i * 60000,
                open: Math.round(open * 100) / 100,
                high: Math.round(high * 100) / 100,
                low: Math.round(low * 100) / 100,
                close: Math.round(close * 100) / 100,
                volume: Math.floor(Math.random() * 1000000)
            });

            currentPrice = close;
        }

        return candles;
    }

    // Get popular Indian stocks for the game
    getPopularSymbols() {
        return [
            { symbol: 'RELIANCE.NS', name: 'Reliance Industries' },
            { symbol: 'TCS.NS', name: 'Tata Consultancy Services' },
            { symbol: 'HDFCBANK.NS', name: 'HDFC Bank' },
            { symbol: 'INFY.NS', name: 'Infosys' },
            { symbol: 'ICICIBANK.NS', name: 'ICICI Bank' },
            { symbol: 'HINDUNILVR.NS', name: 'Hindustan Unilever' },
            { symbol: 'BHARTIARTL.NS', name: 'Bharti Airtel' },
            { symbol: 'ITC.NS', name: 'ITC Limited' },
            { symbol: 'SBIN.NS', name: 'State Bank of India' },
            { symbol: 'BAJFINANCE.NS', name: 'Bajaj Finance' }
        ];
    }

    // Clear cache
    clearCache() {
        this.cache.clear();
    }
}

module.exports = new MarketService();
