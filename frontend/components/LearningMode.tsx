import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../store';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { modules } from './learning';
import MentorSidebar from './learning/MentorSidebar';
import TaskMCQ from './learning/TaskMCQ';
import TaskMatch from './learning/TaskMatch';
import TaskPrediction from './learning/TaskPrediction';
import TaskChart from './learning/TaskChart';

const LearningMode: React.FC = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const { addXp, completedModules, markModuleComplete } = useStore();

  // 1. Module Management
  const initialIndex = modules.findIndex(m => m.id === moduleId);

  // DEBUG LOGGING
  useEffect(() => {
    console.log("Debugging LearningMode:", {
      moduleId,
      initialIndex,
      params: moduleId
    });
  }, [moduleId, initialIndex]);

  const [currentModuleIndex, setCurrentModuleIndex] = useState(initialIndex >= 0 ? initialIndex : 0);
  const currentModule = modules[currentModuleIndex] || modules[0];

  useEffect(() => {
    console.log("Current Module State:", {
      currentModuleIndex,
      moduleTitle: currentModule?.title,
      taskType: currentModule?.task?.type,
      hasTask: !!currentModule?.task
    });
  }, [currentModule, currentModuleIndex]);

  const isLastModule = currentModuleIndex === modules.length - 1;

  // Sync index if URL changes
  useEffect(() => {
    const idx = modules.findIndex(m => m.id === moduleId);
    if (idx >= 0) setCurrentModuleIndex(idx);
  }, [moduleId]);

  // 2. Lesson Flow State (Lifted from ModuleCard)
  const [currentExplanationIndex, setCurrentExplanationIndex] = useState(0);
  const [stage, setStage] = useState<'explanation' | 'task' | 'result'>('explanation');
  const [isTyping, setIsTyping] = useState(true);

  // Initialize with first explanation (safe check)
  const initialExp = currentModule?.explanations?.[0];
  const [displayedText, setDisplayedText] = useState(initialExp?.catMessage || '');
  const [mentorEmotion, setMentorEmotion] = useState<'happy' | 'neutral' | 'sad' | 'alert' | 'thinking'>('happy');

  // Reset state when module changes
  useEffect(() => {
    if (currentModule) {
      const firstExp = currentModule.explanations[0];
      setCurrentExplanationIndex(0);
      setStage('explanation');
      setIsTyping(true);
      setDisplayedText(firstExp?.catMessage || '');
      setMentorEmotion('happy');
    }
  }, [currentModuleIndex]);


  const currentExplanation = stage === 'explanation' ? currentModule.explanations[currentExplanationIndex] : null;
  const isLastExplanation = currentExplanationIndex === (currentModule.explanations?.length || 0) - 1;

  // 3. Handlers
  const handleNext = () => {
    if (isLastExplanation) {
      setStage('task');
      setDisplayedText(currentModule.task.question || "Let's test what you've learned!");
      setMentorEmotion('thinking');
      setIsTyping(false); // Task text is instant or short
    } else {
      const nextIdx = currentExplanationIndex + 1;
      const nextExp = currentModule.explanations[nextIdx];
      setCurrentExplanationIndex(nextIdx);
      setDisplayedText(nextExp.catMessage);
      setIsTyping(true);
      // Randomize emotion slightly for liveliness
      setMentorEmotion(Math.random() > 0.5 ? 'happy' : 'neutral');
    }
  };

  const handleTaskComplete = (isCorrect: boolean) => {
    if (stage === 'result') return;

    if (isCorrect) {
      setDisplayedText(currentModule.taskCompleteMessage);
      setMentorEmotion('happy');
      setStage('result');

      setStage('result');

      // Mark complete immediately when showing result
      markModuleComplete(currentModule.id);
      addXp(currentModule.points);

    } else {
      setDisplayedText(currentModule.taskIncorrectMessage);
      setMentorEmotion('sad');
      // Retry logic usually handled by task component internally or just stay in task stage
    }
  };

  const handleNextModule = () => {
    if (currentModuleIndex + 1 < modules.length) {
      navigate(`/module/${modules[currentModuleIndex + 1].id}`);
    } else {
      navigate('/learn'); // Back to map if finished all
    }
  };


  // 4. Render Helpers
  const renderTypingText = (text: string) => {
    // Simple typing effect or just render
    return (
      <motion.p
        key={text}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-xl leading-relaxed font-medium text-[#4E342E]"
      >
        {text}
      </motion.p>
    );
  };

  if (!currentModule) return <div>Loading...</div>;

  return (
    <div className="flex flex-col md:flex-row h-screen font-body overflow-hidden">
      {/* LEFT: MENTOR SIDEBAR */}
      <MentorSidebar
        emotion={mentorEmotion}
        onBack={() => navigate('/learn')}
      />

      {/* RIGHT: CONTENT AREA */}
      <div className="flex-1 bg-[#F5F5DC] p-8 md:p-12 overflow-y-auto relative selection:bg-[#8D6E63] selection:text-white">
        {/* Parchment Texture Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-30"
          style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cream-paper.png')" }}>
        </div>

        <div className="max-w-3xl mx-auto relative z-10 h-full flex flex-col justify-center">

          {/* Header: MODULE INFO */}
          <div className="mb-6 border-b-2 border-[#8D6E63]/20 pb-4">
            <h2 className="font-pixel text-[#5D4037] text-2xl font-bold flex items-center gap-3">
              <span className="bg-[#8D6E63] text-white px-3 py-1 rounded-lg text-sm tracking-wider">
                MODULE {currentModuleIndex + 1}
              </span>
              {currentModule.title}
            </h2>
            <p className="text-[#8D6E63] mt-1 text-sm font-medium opacity-80 pl-1">
              {currentModule.description}
            </p>
          </div>

          {/* Header: MENTOR EXPLANATION */}
          <div className="mb-4">
            <h3 className="font-pixel text-[#8D6E63] uppercase tracking-widest text-xs font-bold mb-2">
              {stage === 'result' ? 'MISSION ACCOMPLISHED' : (stage === 'task' ? 'TASK' : 'MENTOR EXPLANATION')}
            </h3>
          </div>

          {/* Dialog Box */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-[#D7CCC8] border-4 border-[#8D6E63] rounded-2xl p-8 mb-8 shadow-[8px_8px_0_#5D4037] relative min-h-[200px] flex items-center"
          >
            {/* Text Content */}
            <div className="w-full">
              {renderTypingText(displayedText)}

              {/* Next Arrow Indicator */}
              {stage === 'explanation' && (
                <motion.div
                  animate={{ y: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="absolute bottom-4 right-4 text-[#8D6E63] cursor-pointer"
                  onClick={handleNext}
                >
                  ▼
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* INTERACTIVE CONTENT ZONE */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {stage === 'explanation' && currentExplanation?.showLearningCards && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                  {currentExplanation.learningCards?.map((card, idx) => (
                    <div key={idx} className="bg-white/50 border-2 border-[#8D6E63] border-dashed rounded-xl p-4 text-center text-[#5D4037] font-bold shadow-sm">
                      {card}
                    </div>
                  ))}
                </motion.div>
              )}

              {stage === 'task' && (
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="bg-white border-4 border-[#5D4037] rounded-xl p-6 shadow-lg"
                >
                  {currentModule.task.type === 'MCQ' && (
                    <TaskMCQ
                      question={''} // Text is already in the main bubble
                      options={currentModule.task.options || []}
                      onComplete={handleTaskComplete}
                    />
                  )}
                  {currentModule.task.type === 'MATCH' && (
                    <TaskMatch
                      matches={currentModule.task.matches || []}
                      onComplete={handleTaskComplete}
                    />
                  )}
                  {currentModule.task.type === 'CHART' && (
                    <TaskChart
                      data={currentModule.task.chart!.data}
                      correctIndices={currentModule.task.chart!.correctIndices}
                      instruction={currentModule.task.chart!.instruction}
                      onAnswer={handleTaskComplete}
                    />
                  )}
                  {currentModule.task.type === 'PREDICTION' && currentModule.task.prediction && (
                    <TaskPrediction
                      prediction={currentModule.task.prediction}
                      onComplete={handleTaskComplete}
                    />
                  )}
                </motion.div>
              )}

              {stage === 'result' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="text-6xl mb-4">🎉</div>
                  <h2 className="text-3xl font-bold text-[#3E2723] mb-6 font-pixel">LESSON COMPLETE!</h2>

                  <button
                    onClick={handleNextModule}
                    className={`px-8 py-4 rounded-xl border-b-4 font-bold text-xl active:border-b-0 active:translate-y-1 shadow-xl transition-all font-pixel
                      ${isLastModule
                        ? 'bg-[#3F51B5] text-white border-[#1A237E] hover:bg-[#303F9F]'
                        : 'bg-[#4CAF50] text-white border-[#1B5E20] hover:bg-[#43A047]'
                      }`}
                  >
                    {isLastModule ? 'RETURN TO MAP 🗺️' : 'NEXT MODULE ➡'}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LearningMode;