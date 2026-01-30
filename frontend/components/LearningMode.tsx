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
        className="text-3xl leading-relaxed font-medium text-[#4E342E]"
      >
        {text}
      </motion.p>
    );
  };

  if (!currentModule) return <div>Loading...</div>;

  return (
    <div className="flex flex-col md:flex-row h-screen font-body overflow-hidden bg-wood-pattern">
      {/* LEFT: MENTOR SIDEBAR */}
      <MentorSidebar
        emotion={mentorEmotion}
        onBack={() => navigate('/learn')}
      />

      {/* RIGHT: CONTENT AREA */}
      <div className="flex-1 bg-[#FDFBF7] relative selection:bg-[#8D6E63] selection:text-white flex flex-col">

        {/* Decorative Top Border */}
        <div className="h-4 w-full bg-[#5D4037] relative z-20 shadow-md"></div>

        <div className="flex-1 p-6 md:p-12 overflow-y-auto relative custom-scrollbar">
          {/* Background Texture */}
          <div className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: "url('/bg.png')",
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}>
          </div>

          <div className="max-w-4xl mx-auto relative z-10 min-h-full flex flex-col">

            {/* Header: MODULE INFO - Wooden Sign Style */}
            <div className="mb-10 text-center relative group">
              <div className="inline-block bg-[#5D4037] text-[#FFE0B2] px-6 py-2 rounded-t-lg border-x-4 border-t-4 border-[#3E2723] shadow-lg relative z-10 font-pixel transform group-hover:-translate-y-1 transition-transform">
                MODULE {currentModuleIndex + 1}
              </div>
              <div className="bg-[#EFEBE9] border-4 border-[#5D4037] rounded-xl p-6 shadow-[0_8px_0_rgba(93,64,55,0.4)] relative">
                {/* Nails */}
                <div className="absolute top-3 left-3 w-3 h-3 rounded-full bg-[#BCAAA4] border border-[#5D4037] shadow-inner"></div>
                <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-[#BCAAA4] border border-[#5D4037] shadow-inner"></div>

                <h2 className="font-pixel text-[#3E2723] text-2xl md:text-3xl font-bold tracking-wide">
                  {currentModule.title}
                </h2>
                <p className="text-[#6D4C41] mt-2 text-base font-medium italic">
                  "{currentModule.description}"
                </p>
              </div>
            </div>

            {/* Header: MENTOR EXPLANATION LABEL */}
            <div className="mb-4 pl-4 flex items-center gap-3">
              <div className="h-[2px] w-12 bg-[#8D6E63]/50 rounded-full"></div>
              <h3 className="font-pixel text-[#8D6E63] uppercase tracking-widest text-sm md:text-base font-bold">
                {stage === 'result' ? 'MISSION STATUS' : (stage === 'task' ? 'CHALLENGE' : 'MENTOR SAYS')}
              </h3>
              <div className="h-[2px] flex-1 bg-[#8D6E63]/50 rounded-full"></div>
            </div>

            {/* Dialog Box - Premium RPG Style */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-white border-4 border-[#5D4037] rounded-2xl p-1 shadow-[8px_8px_0_rgba(62,39,35,0.2)] mb-8 relative min-h-[220px] flex items-stretch"
            >
              {/* Inner Bevel */}
              <div className="w-full bg-[#FAF8EF] border-2 border-[#D7CCC8]/50 rounded-xl p-8 flex items-center relative overflow-hidden">
                {/* Corner Decorations */}
                <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-[#D7CCC8]/30 rounded-tl-xl pointer-events-none"></div>
                <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-[#D7CCC8]/30 rounded-br-xl pointer-events-none"></div>

                <div className="w-full relative z-10">
                  {renderTypingText(displayedText)}

                  {/* Next Arrow Indicator (Floating) */}
                  {stage === 'explanation' && (
                    <motion.div
                      animate={{ y: [0, 5, 0] }}
                      transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                      className="absolute bottom-0 right-0 text-[#5D4037] cursor-pointer bg-[#FFE0B2] w-8 h-8 flex items-center justify-center rounded-full border-2 border-[#5D4037] shadow-sm hover:bg-[#FFCC80]"
                      onClick={handleNext}
                    >
                      ▼
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* INTERACTIVE CONTENT ZONE */}
            <div className="flex-1 mt-auto">
              <AnimatePresence mode="wait">
                {stage === 'explanation' && currentExplanation?.showLearningCards && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                  >
                    {currentExplanation.learningCards?.map((card, idx) => (
                      <div key={idx} className="group cursor-default">
                        <div className="bg-[#FFF8E1] border-b-4 border-r-4 border-[#8D6E63] p-5 rounded-xl text-center text-[#4E342E] font-bold shadow-sm transition-all transform group-hover:-translate-y-1 group-hover:shadow-md relative overflow-hidden h-full flex items-center justify-center">
                          <div className="absolute top-0 left-0 w-full h-1 bg-[#FFE0B2] opacity-50"></div>
                          <span className="relative z-10">{card}</span>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}

                {stage === 'task' && (
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-white border-4 border-[#5D4037] rounded-xl p-6 shadow-[0_10px_20px_rgba(0,0,0,0.1)] relative"
                  >
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#3E2723] text-[#FFE0B2] px-4 py-1 rounded-full text-xs font-pixel uppercase tracking-widest shadow-lg">
                      YOUR TURN
                    </div>

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
                    className="text-center py-8 bg-[#E8F5E9] border-4 border-[#2E7D32] rounded-3xl shadow-xl p-8"
                  >
                    <div className="text-7xl mb-6 filter drop-shadow-md animate-bounce">🎉</div>
                    <h2 className="text-3xl md:text-4xl font-bold text-[#1B5E20] mb-2 font-pixel tracking-wide text-shadow-sm">LESSON COMPLETE!</h2>
                    <p className="text-[#388E3C] mb-8 font-medium">You've mastered this concept.</p>

                    <button
                      onClick={handleNextModule}
                      className={`w-full max-w-sm px-8 py-5 rounded-xl border-b-[6px] font-bold text-xl active:border-b-0 active:translate-y-[6px] shadow-2xl transition-all font-pixel uppercase tracking-wider flex items-center justify-center gap-3 mx-auto
                          ${isLastModule
                          ? 'bg-[#3F51B5] text-white border-[#1A237E] hover:bg-[#303F9F]'
                          : 'bg-[#4CAF50] text-white border-[#1B5E20] hover:bg-[#43A047]'
                        }`}
                    >
                      {isLastModule ? 'RETURN TO MAP 🗺️' : <>NEXT MODULE <ArrowLeft className="rotate-180" /></>}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningMode;