# Project Name: Nexus-Alpha
Problem Statement ID: CS06SF
Team Name: Nexus-Alpha
College Name: Srinivas Institute Of Technology, Valachil, Mangalore

---

## Problem Statement
# Gamified Virtual Trading League for students:

provide a safe, educational environment that teaches retail students core stock-market concepts, risk management and chart-reading by letting them practice in a simulated league instead of risking real capital. Theme: Stock market and FinTech.

## Proposed Solution
We built a guided-learning + simulation platform that combines:
- 8 structured learning modules with a deterministic 3-step cat-mentor explanation flow (left → center → right).
- Interactive tasks immediately following lessons (MCQ, Matching, Prediction).
- A simulated trading game with candlestick charts, virtual capital, ranks and achievements to apply learned concepts.

This addresses inexperienced student traders by teaching practical rules (entry/exit, stop-loss, risk-reward, liquidity traps) and letting them practise in a safe league with rewards and progress tracking.

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