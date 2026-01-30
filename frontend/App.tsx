import React from 'react';
import { useStore } from './store';
import Home from './components/Home';
import LearningMode from './components/LearningMode';
import GameMode from './components/GameMode';

const App: React.FC = () => {
  const mode = useStore((state) => state.mode);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans selection:bg-indigo-500 selection:text-white">
      {mode === 'HOME' && <Home />}
      {mode === 'LEARNING' && <LearningMode />}
      {mode === 'GAME' && <GameMode />}
    </div>
  );
};

export default App;