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



## Usability & Impact

### Target Audience
- **Students & Gen Z**: Who find traditional finance apps boring or intimidating.
- **Novice Investors**: People who want to trade but are afraid of losing money.

### User Experience (UX)
- **Gamified Onboarding**: Users essentially "play" a tutorial level rather than reading a manual.
- **Intuitive Design**: Familiar WASD/gaming controls and interface logic make the platform instantly usable for digital natives.
- **Responsive & Accessible**: High-contrast pixel art and clear, bite-sized text ensure readability across devices.

### Social & Educational Impact
1.  **Financial Safety Net**: We provide a sandbox where "blowing up an account" is a learning moment, not a financial disaster.
2.  **Behavioral Correction**: The system rewards *discipline* (setting stop-losses, patience) over gambling-like behavior, instilling good habits before real capital is at risk.
3.  **Community Learning**: By shifting trading from a lonely activity to a social one (polls, chats), we accelerate learning through peer exchange.

## Setup Instructions (Local)

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/Nexus-SIT/nexus-alpha.git
cd nexus-alpha
```

### 2. Backend Setup
The backend handles API requests and data persistence.
```bash
cd backend
npm install
npm start
```
*The backend server should now be running on port 5000 (default).*

### 3. Frontend Setup
Open a new terminal for the frontend.
```bash
# From the root directory
cd frontend
npm install
```

#### Configuration
Create a `.env.local` file in the `frontend` directory and add your API keys:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

#### Run the Application
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) to view it in the browser.
# See README_GUIDED_LEARNING.md and other docs in repo for detailed architecture and data models.
