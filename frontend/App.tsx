import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useStore } from './store';
import Home from './components/Home';
import LearningMode from './components/LearningMode'; // Legacy for now
import RoadmapPage from './components/RoadmapPage';
import Classroom from './components/Classroom';
import GameMode from './components/GameMode';
import api from './services/api';

const App: React.FC = () => {
  const { theme, userId, setUserId, setUserProfile } = useStore();

  // Initialize user on app load
  useEffect(() => {
    const initUser = async () => {
      try {
        let currentUserId = userId;

        // Create or get user
        if (!currentUserId) {
          const userData = await api.registerUser('Trader');
          currentUserId = userData.userId;
          setUserId(currentUserId);
        }

        // Fetch user profile
        if (currentUserId) {
          const profile = await api.getUser(currentUserId);
          setUserProfile(profile);
        }
      } catch (error) {
        console.error('Failed to initialize user:', error);
      }
    };

    initUser();
  }, []);

  return (
    <BrowserRouter>
      <div className={`min-h-screen font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-300 ${theme === 'dark'
        ? 'bg-gray-900 text-gray-100'
        : 'bg-parchment text-coffee'
        }`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/roadmap" element={<RoadmapPage />} />
          <Route path="/learn/:moduleId/:roomId" element={<Classroom />} />
          <Route path="/learn" element={<LearningMode />} />
          <Route path="/game" element={<GameMode />} />
        </Routes>
      </div>
    </BrowserRouter >
  );
};

export default App;