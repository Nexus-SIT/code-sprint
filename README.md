# Project Name: CandleCrush

Problem Statement ID: CS06SF

Team Name: Nexus-Alpha

College Name: Srinivas Institute Of Technology, Valachil, Mangalore

---

## Problem Statement
# Gamified Virtual Trading League for students:

provide a safe, educational environment that teaches retail students core stock-market concepts, risk management and chart-reading by letting them practice in a simulated league instead of risking real capital. Theme: Stock market and FinTech.

## Proposed Solution
We built **CandleCrush**, a gamified educational platform that transforms stock market learning into an engaging, risk-free experience. 

Our solution combines three core pillars:

### 1. Immersive Guided Learning
- **Interactive Storytelling**: A "Stardew Valley" inspired pixel-art world where users are guided by a virtual cat mentor.
- **Structured Curriculum**: 8 progressive learning modules (from basic terminology to advanced patterns) with a deterministic teaching flow.
- **Active Recall**: Immediate knowledge reinforcement through interactive tasks (Match-the-following, Prediction challenges, Quizzes) embedded after every lesson.

### 2. Gamified Trading Simulation (The Arena)
- **Risk-Free Trading**: A real-time market simulation where students trade on live candlestick charts using virtual capital.
- **Competitive League**: A 7-tier ranking system where users compete for higher ranks based on their portfolio performance (Profit/Loss).
- **Dynamic Challenges**: Users execute Buy/Sell/Hold decisions in fast-paced scenarios to test their instincts.

### 3. Social & Competitive Ecosystem
- **Community Hub**: A built-in chat system for users to discuss strategies, share tips, and participate in community polls.
- **Progression System**: A comprehensive XP and achievement system that rewards consistency, accurate predictions, and learning milestones.
- **Leaderboards**: Global and friend-based leaderboards to foster healthy competition.

## Innovation & Creativity
- Deterministic cat-mentor teaching system with typing animations and staged learning cards.
- Gamified league with 7-tier ranking, achievements and XP to encourage retention.
- Seamless hand-off from micro-lessons to practice scenarios — teaches then tests immediately.

## Technical Complexity & Stack
Backend
- Express.js (REST API)
- Yahoo Finance 2 (market data)
- JSON-file based persistence for users/trades

Frontend
- React + TypeScript
- Zustand for state
- Recharts for candlestick charts
- Framer Motion for animations
- Tailwind CSS for styling
- Lucide React for icons

See README_GUIDED_LEARNING.md and other docs in repo for detailed architecture and data models.

## Usability & Impact
Users: students and novice retail traders.
Interaction: follow learning modules, attempt tasks, then play the trading simulation to apply learning. Earn XP, badges and climb leaderboards.
Impact: reduce early-money mistakes by teaching risk-management and disciplined entry/exit behavior before users trade real funds.

## Setup Instructions (Local)
1. Clone repository
```bash
git clone https://github.com/Nexus-SIT/nexus-alpha.git
cd nexus-alpha
