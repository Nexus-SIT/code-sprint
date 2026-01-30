# 🎮 Gamified Virtual Trading League

A **gamified, risk-free virtual stock trading platform** with RPG-inspired design, ranking system, and real-time market data integration.

## ✨ Features

### 🎯 Core Features
- **Virtual Trading** with real-time market data from Yahoo Finance
- **7-Tier Ranking System** (Novice → Legendary Trader)
- **Day/Night Mode** toggle with theme persistence
- **Leaderboard** with top traders
- **Achievement System** with badges and XP rewards
- **Portfolio Tracking** with profit/loss analytics
- **RPG-Inspired UI** with rustic wooden theme

### 🏆 Ranking Tiers
1. **Novice Trader** (Bronze) - Starting rank
2. **Apprentice Trader** (Silver) - ₹0 - ₹50,000 profit
3. **Skilled Trader** (Gold) - ₹50,000 - ₹150,000 profit
4. **Expert Trader** (Blue) - ₹150,000 - ₹300,000 profit
5. **Master Trader** (Purple) - ₹300,000 - ₹600,000 profit
6. **Elite Trader** (Red) - ₹600,000 - ₹1,000,000 profit
7. **Legendary Trader** (Golden) - ₹1,000,000+ profit

### 🎖️ Achievement Badges
- First Steps, Hot Streak, Unstoppable
- Rising Star, Six Figures, Market Master
- Active Trader, Veteran Trader, Trading Legend
- And many more!

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
cd c:\Users\shetty\code-sprint\code-sprint
```

2. **Install Backend Dependencies**
```bash
cd backend
npm install
```

3. **Install Frontend Dependencies**
```bash
cd ../frontend
npm install
```

### Running the Application

#### Start Backend Server (Terminal 1)
```bash
cd backend
npm start
```
Backend will run on `http://localhost:3000`

#### Start Frontend Dev Server (Terminal 2)
```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:5173` (or next available port)

### API Endpoints

#### Market Data
- `GET /api/market/candles/:symbol` - Get candle data
- `GET /api/market/price/:symbol` - Get current price
- `GET /api/market/symbols` - Get popular symbols

#### User Management
- `POST /api/user/register` - Create/get user
- `GET /api/user/:userId` - Get user profile
- `PUT /api/user/:userId` - Update user profile

#### Trading
- `POST /api/trade/execute` - Execute trade
- `GET /api/trade/history/:userId` - Get trade history

#### Leaderboard & Rankings
- `GET /api/leaderboard` - Get top traders
- `GET /api/leaderboard/position/:userId` - Get user position
- `GET /api/ranks` - Get all rank tiers

#### Achievements
- `GET /api/achievements` - Get all achievements
- `GET /api/achievements/:userId` - Get user achievements

## 🎨 Tech Stack

### Backend
- **Express.js** - REST API server
- **Yahoo Finance 2** - Real-time market data
- **JSON File Storage** - User & trade persistence

### Frontend
- **React** - UI framework
- **TypeScript** - Type safety
- **Zustand** - State management
- **Recharts** - Candlestick charts
- **Framer Motion** - Animations
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

## 🎮 How to Play

1. **Start** - Launch the app and create your profile
2. **Choose Mode** - Select "RANKED" for competitive trading
3. **Analyze** - View the candlestick chart showing market movement
4. **Bet** - Choose your position (BUY/SELL/HOLD) and wager amount
5. **Watch** - See the market simulation play out
6. **Earn** - Gain profits, XP, and climb the ranks!

## 🌙 Theme Toggle

Click the sun/moon icon in the top-right corner to switch between:
- **Light Mode** - Classic parchment and wood theme
- **Dark Mode** - Modern dark theme with amber accents

Theme preference is saved to localStorage.

## 📊 Ranking System

Your rank is determined by **total profit**:
- Make profitable trades → Rank increases
- Lose money → Rank decreases
- Each rank has unique animated icon
- Progress bar shows distance to next rank

## 🎯 Achievements

Unlock achievements by:
- Completing trades
- Winning streaks
- Reaching profit milestones
- Maintaining high win rates

Each achievement awards XP to level up faster!

## 📁 Project Structure

```
code-sprint/
├── backend/
│   ├── models/
│   │   ├── User.js          # User model with rank logic
│   │   └── Trade.js         # Trade execution model
│   ├── services/
│   │   ├── marketService.js # Yahoo Finance integration
│   │   └── achievementService.js # Achievement logic
│   ├── data/
│   │   ├── users.json       # User storage
│   │   └── trades.json      # Trade history
│   └── index.js             # Express server
│
└── frontend/
    ├── components/
    │   ├── Home.tsx         # Landing page
    │   ├── GameMode.tsx     # Trading game
    │   ├── ThemeToggle.tsx  # Day/night toggle
    │   ├── RankDisplay.tsx  # Rank icon & progress
    │   └── Leaderboard.tsx  # Top traders
    ├── services/
    │   └── api.ts           # Backend API client
    ├── utils/
    │   └── rankIcons.tsx    # 7 unique rank SVGs
    ├── store.ts             # Zustand state
    └── types.ts             # TypeScript types
```

## 🔧 Development

### Backend Development
```bash
cd backend
npm run dev
```

### Frontend Development
```bash
cd frontend
npm run dev
```

### Build for Production
```bash
cd frontend
npm run build
```

## 🎯 Future Enhancements

- [ ] Trade history display component
- [ ] Profile stats dashboard
- [ ] Achievement notification animations
- [ ] Sound effects for trades
- [ ] Mobile app version
- [ ] Real-time multiplayer competitions
- [ ] AI trading assistant
- [ ] Database migration (MongoDB/PostgreSQL)

## 📜 License

This project is developed for **educational and learning purposes**.

## 🙌 Credits

Built with ❤️ for improving financial literacy among students.

---

**Happy Trading! 📈🎮**
