import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth } from './firebase'; // Import auth
import { useStore } from './store';
import { db } from './firebase';

import Home from './components/Home';
import LearningMode from './components/LearningMode'; // Legacy for now
import RoadmapPage from './components/RoadmapPage';
import Classroom from './components/Classroom';
import GameMode from './components/GameMode';
import Leaderboard from './components/Leaderboard';
import Auth from './components/Auth'; // Import Auth
import Footer from './components/Footer';
import TopicExplanationPage from './components/TopicExplanationPage';
import MarketSimChallenge from './components/challenges/MarketSimChallenge';

import { createUserIfNotExists } from './services/firebaseApi';
import { UserDoc } from './types/user';
import { UserProfile } from './types';

// ✅ Safe UUID generator (NO crypto issues)
const generateUserId = () => {
  return 'user_' + Math.random().toString(36).slice(2, 11);
};

const mapUserDocToProfile = (doc: UserDoc, userId: string): UserProfile => {
  return {
    userId,
    username: doc.name,
    walletBalance: doc.balance,
    totalProfit: doc.totalProfit,
    xp: doc.xp,
    level: 1, // Default
    rank: doc.rankScore,
    rankName: 'Novice', // Default
    totalTrades: 0,
    winningTrades: 0,
    losingTrades: 0,
    bestTrade: 0,
    worstTrade: 0,
    currentStreak: 0,
    longestStreak: 0,
    achievements: [],
  };
};

const App: React.FC = () => {
  const {
    theme,
    userId,
    setUserId,
    setUserProfile,
    syncFromFirebase,
  } = useStore();

  const [initializing, setInitializing] = React.useState(true);
  const [showAuth, setShowAuth] = React.useState(false);

  // 🔥 Auth Listener
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUserId(user.uid);

        // Load user profile
        try {
          const doc = await createUserIfNotExists(user.uid, user.displayName || 'Trader');
          const userProfile = mapUserDocToProfile(doc, user.uid);
          setUserProfile(userProfile);
          setShowAuth(false);
        } catch (error) {
          console.error('Error loading user profile:', error);
        }
      } else {
        setUserId(''); // Clear user
        setShowAuth(true); // Show login screen
      }
      setInitializing(false);
    });

    return () => unsubscribe();
  }, [setUserId, setUserProfile]);

  // 🔥 Realtime user sync (wallet, xp, rank)
  useEffect(() => {
    if (!userId) return;

    const userRef = doc(db, 'users', userId);

    const unsubscribe = onSnapshot(userRef, (snap) => {
      if (!snap.exists()) return;

      const data = snap.data();

      syncFromFirebase({
        balance: data.balance,
        xp: data.xp,
        rank: data.rankScore, // Corrected from data.rank
      });
    });

    return () => unsubscribe();
  }, [userId, syncFromFirebase]);

  if (initializing) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-parchment text-coffee'}`}>
        Fetching Ledger...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div
        className={`min-h-screen font-sans flex flex-col selection:bg-indigo-500 selection:text-white transition-colors duration-300 ${theme === 'dark'
          ? 'bg-gray-900 text-gray-100'
          : 'bg-parchment text-coffee'
          }`}
      >
        {showAuth && (
          <Auth onLoginSuccess={() => setShowAuth(false)} />
        )}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/roadmap" element={<RoadmapPage />} />
          <Route path="/learn/:moduleId/:roomId" element={<Classroom />} />
          <Route path="/learn" element={<RoadmapPage />} />
          <Route path="/game" element={<GameMode />} />
          <Route path="/room-1-1" element={<MarketSimChallenge />} />
          <Route path="/learning/module/:moduleId/topic/:roomId" element={<TopicExplanationPage />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter >
  );
};

export default App;
