const API_BASE_URL = 'http://localhost:3000/api';

// API Response wrapper
interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string = API_BASE_URL) {
        this.baseUrl = baseUrl;
    }

    private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options?.headers,
                },
                ...options,
            });

            const data: ApiResponse<T> = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'API request failed');
            }

            return data.data as T;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Market endpoints
    async getCandles(symbol: string, interval = '5m', range = '1d') {
        return this.request<any>(`/market/candles/${symbol}?interval=${interval}&range=${range}`);
    }

    async getCurrentPrice(symbol: string) {
        return this.request<any>(`/market/price/${symbol}`);
    }

    async getSymbols() {
        return this.request<any[]>('/market/symbols');
    }

    // User endpoints
    async registerUser(username: string, userId?: string) {
        return this.request<any>('/user/register', {
            method: 'POST',
            body: JSON.stringify({ username, userId }),
        });
    }

    async getUser(userId: string) {
        return this.request<any>(`/user/${userId}`);
    }

    async updateUser(userId: string, data: any) {
        return this.request<any>(`/user/${userId}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    // Trade endpoints
    async executeTrade(tradeData: {
        userId: string;
        symbol?: string;
        position: 'BUY' | 'SELL' | 'HOLD';
        betAmount: number;
        entryPrice: number;
        exitPrice: number;
        duration?: number;
    }) {
        return this.request<any>('/trade/execute', {
            method: 'POST',
            body: JSON.stringify(tradeData),
        });
    }

    async getTradeHistory(userId: string, limit = 50) {
        return this.request<any>(`/trade/history/${userId}?limit=${limit}`);
    }

    // Leaderboard endpoints
    async getLeaderboard(limit = 10) {
        return this.request<any[]>(`/leaderboard?limit=${limit}`);
    }

    async getLeaderboardPosition(userId: string) {
        return this.request<any>(`/leaderboard/position/${userId}`);
    }

    // Achievement endpoints
    async getAllAchievements() {
        return this.request<any[]>('/achievements');
    }

    async getUserAchievements(userId: string) {
        return this.request<any>(`/achievements/${userId}`);
    }

    // Rank endpoints
    async getRankTiers() {
        return this.request<any[]>('/ranks');
    }

    // Health check
    async healthCheck() {
        return this.request<any>('/health');
    }
}

export const api = new ApiClient();
export default api;
