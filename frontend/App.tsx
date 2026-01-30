import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth } from './firebase'; // Import auth
import { useStore } from './store';
import { db } from './firebase';

import Home from './components/Home';

import RoadmapPage from './components/RoadmapPage';
import Classroom from './components/Classroom';
import LearningMode from './components/LearningMode';
import TopicExplanationPage from './components/TopicExplanationPage';
import GameMode from './components/GameMode';
import Leaderboard from './components/Leaderboard';
import Auth from './components/Auth'; // Import Auth
import Footer from './components/Footer';
import ContestLobby from './components/ContestLobby';
import ContestGame from './components/ContestGame';
import About from './components/About';

import { createUserIfNotExists } from './services/firebaseApi';
import { UserDoc } from './types/user';
import { UserProfile } from './types';
import { getRankName, getRankTier } from './utils/rankIcons';

// Global error tracker for debugging
let globalError = "";
const logError = (msg: string) => {
  console.error(msg);
  globalError = msg;
};



// ...

const mapUserDocToProfile = (doc: UserDoc, userId: string): UserProfile => {
  const rankTier = getRankTier(doc.totalProfit);
  return {
    userId,
    username: doc.name,
    walletBalance: doc.balance,
    totalProfit: doc.totalProfit,
    xp: doc.xp,
    level: 1, // Default
    rank: rankTier,
    rankName: getRankName(rankTier),
    totalTrades: 0,
    winningTrades: 0,
    losingTrades: 0,
    bestTrade: 0,
    worstTrade: 0,
    currentStreak: 0,
    longestStreak: 0,
    achievements: [],
    completedRooms: doc.completedRooms || [],
  };
};

const AppContent: React.FC = () => {
  const {
    theme,
    userId,
    setUserId,
    setUserProfile,
    syncFromFirebase,
  } = useStore();

  const [initializing, setInitializing] = React.useState(true);
  const [showAuth, setShowAuth] = React.useState(false);
  const location = useLocation();

  // 🔥 Auth Listener
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUserId(user.uid);

        // Load user profile
        try {
          const doc = await createUserIfNotExists(user.uid, user.displayName || 'Trader');
          const userProfile = mapUserDocToProfile(doc, user.uid);
          console.log("Loaded Profile from Firestore:", userProfile);
          setUserProfile(userProfile);
          setShowAuth(false);
        } catch (error: any) {
          const errMsg = error.message || error;
          logError('Error loading user profile: ' + errMsg);
          // If it's a permission error, we still want to hide the auth modal 
          // if the user is technically authed, but show the error banner.
          setShowAuth(false);
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
        totalProfit: data.totalProfit || 0,
        rank: getRankTier(data.totalProfit || 0), // Use Tier based on Profit
        completedRooms: data.completedRooms,
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

  const hideFooter = location.pathname.startsWith('/game') || location.pathname.includes('/learn/');

  return (
    <div
      className={`min-h-screen font-sans flex flex-col selection:bg-indigo-500 selection:text-white transition-colors duration-300 ${theme === 'dark'
        ? 'bg-gray-900 text-gray-100'
        : 'bg-parchment text-coffee'
        }`}
    >
      {showAuth && (
        <Auth onLoginSuccess={() => setShowAuth(false)} />
      )}

      {/* DEBUG ERROR BANNER */}
      {globalError && (
        <div className="fixed top-0 left-0 right-0 bg-red-600 text-white p-2 z-50 text-center font-bold">
          DEBUG ERROR: {globalError}
        </div>
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/roadmap" element={<RoadmapPage />} />
        <Route path="/module/:moduleId" element={<LearningMode />} />
        <Route path="/learn/:moduleId/:roomId" element={<TopicExplanationPage />} />
        <Route path="/learn/:moduleId/:roomId/classroom" element={<Classroom />} />
        <Route path="/learn" element={<RoadmapPage />} />
        <Route path="/game" element={<GameMode />} />
        <Route path="/leaderboard" element={<Leaderboard userId={userId || undefined} />} />
        <Route path="/contest" element={<ContestLobby />} />
        <Route path="/contest/:contestId" element={<ContestGame />} />
      </Routes>

      {!hideFooter && <Footer />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;
