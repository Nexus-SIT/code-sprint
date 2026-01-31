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
Unlike generic trading apps, CandleCrush introduces several novel approaches to financial literacy:

1.  **"Companion-First" Pedagogy**:
    Instead of dry text, we use an animated **Cat Mentor** that typifies the learning journey. The mentor reacts emotionally to your success and failure, lowering the intimidation barrier of complex financial topics and preventing user drop-off.

2.  **The "Zero-Latency" Learning Loop**:
    We solved the passive learning problem by enforcing immediate application. Users don't just read about a "Bullish Engulfing Pattern"; they must immediately identify it in a generated chart puzzle or predict its outcome within the same module context.

3.  **Psychological "Safe-Box"**:
    Most simulators only track numbers. Our "Contest Arena" is designed to simulate the *emotions* of trading (FOMO, panic selling) in a risk-free environment. By gamifying the P&L swings, we teach emotional regulation—the trader's most vital skill.

4.  **Disarming Aesthetic**:
    We deliberately chose a **Pixel-Art / RPG style** (reminiscent of Stardew Valley) to continuously signal "Game" over "Work". This visual innovation makes technical analysis feel like unlocking skills in a video game rather than studying for a finance exam.

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
