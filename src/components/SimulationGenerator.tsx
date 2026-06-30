import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGenerateSimulation } from '../hooks/useGenerateSimulation';
import { 
  Play, 
  Pause,
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  Loader2, 
  AlertTriangle, 
  Activity, 
  Cpu, 
  User, 
  Sparkles,
  BookOpen,
  Trophy
} from 'lucide-react';

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 100 : dir < 0 ? -100 : 0,
    opacity: 0
  }),
  center: {
    x: 0,
    opacity: 1
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -100 : dir < 0 ? 100 : 0,
    opacity: 0
  })
};

interface SimulationGeneratorProps {
  documentId: string;
  highlightedText: string;
  onClose?: () => void;
}

export const SimulationGenerator: React.FC<SimulationGeneratorProps> = ({
  documentId,
  highlightedText,
  onClose,
}) => {
  const [simulationType, setSimulationType] = useState<"visual-flow" | "step-by-step" | "real-world">("visual-flow");
  const [difficulty, setDifficulty] = useState<"beginner" | "intermediate" | "advanced">("intermediate");
  const [activeStep, setActiveStep] = useState<number>(0);
  const [direction, setDirection] = useState<number>(0); // -1 for prev, 1 for next
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  
  // Auto-play / Video controller states
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(3000); // ms per step
  const [progressPercent, setProgressPercent] = useState<number>(0);

  const { mutate, data, isPending, isError, error, reset } = useGenerateSimulation();

  const simulation = data?.simulation;

  // Auto-play timer effect
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    let progressTimer: ReturnType<typeof setInterval>;

    if (isPlaying && simulation && !isCompleted) {
      const startTime = Date.now();
      
      // Update progress percent smoothly
      progressTimer = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const percent = Math.min((elapsed / playbackSpeed) * 100, 100);
        setProgressPercent(percent);
      }, 50);

      timer = setTimeout(() => {
        if (activeStep < simulation.steps.length - 1) {
          setDirection(1);
          setActiveStep(prev => prev + 1);
          setProgressPercent(0);
        } else {
          setIsCompleted(true);
          setIsPlaying(false);
          setProgressPercent(100);
        }
      }, playbackSpeed);
    } else {
      setProgressPercent(0);
    }

    return () => {
      clearTimeout(timer);
      clearInterval(progressTimer);
    };
  }, [isPlaying, activeStep, playbackSpeed, simulation, isCompleted]);

  const handleGenerate = () => {
    mutate({
      documentId,
      highlightedText,
      simulationType,
      difficulty,
    });
    setActiveStep(0);
    setIsCompleted(false);
    setIsPlaying(false);
    setProgressPercent(0);
  };

  const handleNext = () => {
    if (!simulation) return;
    setIsPlaying(false);
    if (activeStep < simulation.steps.length - 1) {
      setDirection(1);
      setActiveStep(prev => prev + 1);
    } else {
      setDirection(1);
      setIsCompleted(true);
    }
  };

  const handlePrev = () => {
    setIsPlaying(false);
    if (isCompleted) {
      setIsCompleted(false);
      setDirection(-1);
    } else if (activeStep > 0) {
      setDirection(-1);
      setActiveStep(prev => prev - 1);
    }
  };

  const togglePlay = () => {
    if (isCompleted) {
      handleRestart();
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleRestart = () => {
    setActiveStep(0);
    setIsCompleted(false);
    setDirection(0);
    setProgressPercent(0);
  };

  const handleResetAll = () => {
    reset();
    handleRestart();
    setIsPlaying(false);
  };



  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'beginner':
        return (
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
            Beginner
          </span>
        );
      case 'advanced':
        return (
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.15)] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 dark:bg-rose-400 animate-pulse" />
            Advanced
          </span>
        );
      case 'intermediate':
      default:
        return (
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.15)] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 dark:bg-amber-400 animate-pulse" />
            Intermediate
          </span>
        );
    }
  };

  const getTypeBadge = (type: string) => {
    const label = type === 'visual-flow' ? 'Visual Flow' : type === 'step-by-step' ? 'Step-by-Step' : 'Real World';
    return (
      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.15)] flex items-center gap-1.5">
        <Activity className="w-3.5 h-3.5" />
        {label}
      </span>
    );
  };



  return (
    <div className="w-full max-w-4xl mx-auto font-sans">
      <div className="relative overflow-hidden bg-white dark:bg-zinc-950/85 backdrop-blur-xl border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white rounded-2xl shadow-2xl p-6 md:p-8 transition-all">
        
        {/* Ambient glows */}
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-orange-500/5 dark:bg-orange-600/15 rounded-full blur-[110px] pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-orange-500/5 dark:bg-orange-600/15 rounded-full blur-[110px] pointer-events-none" />

        {/* Header */}
        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-zinc-100 dark:border-white/5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className="w-4 h-4 text-orange-500 dark:text-orange-400 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Interactive Engine</span>
            </div>
            <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
              {simulation ? simulation.title : "AI Simulation Generator"}
            </h2>
            {highlightedText && !simulation && (
              <p className="text-zinc-550 dark:text-zinc-400 text-sm mt-1 max-w-xl italic line-clamp-1">
                "{highlightedText}"
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            {simulation && (
              <>
                {getDifficultyBadge(simulation.difficulty)}
                {getTypeBadge(simulation.simulationType)}
              </>
            )}
            {onClose && (
              <button 
                onClick={onClose}
                className="px-3 py-1 rounded bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 border border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300 text-xs transition-all"
              >
                Close
              </button>
            )}
          </div>
        </div>

        {/* Canvas & Controls Container */}
        <div className="relative mt-6 min-h-[350px] flex flex-col justify-between">
          
          {/* Initial State / Input Configurations */}
          {!simulation && !isPending && !isError && (
            <div className="flex flex-col items-center py-8">
              <div className="w-16 h-16 rounded-2xl bg-orange-500/5 dark:bg-orange-600/10 border border-orange-200 dark:border-orange-500/20 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(249,115,22,0.15)]">
                <Cpu className="w-8 h-8 text-orange-500 dark:text-orange-400 animate-[spin_10s_linear_infinite]" />
              </div>
              
              <div className="w-full max-w-lg space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Simulation Type</label>
                  <div className="grid grid-cols-3 gap-3">
                    {(["visual-flow", "step-by-step", "real-world"] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setSimulationType(t)}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          simulationType === t
                            ? 'bg-orange-500/10 dark:bg-orange-600/20 border-orange-500 text-orange-600 dark:text-white shadow-[0_0_20px_rgba(249,115,22,0.15)]'
                            : 'bg-zinc-50 dark:bg-zinc-900/50 border-zinc-100 dark:border-white/5 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-white'
                        }`}
                      >
                        <span className="block text-xs font-semibold capitalize">{t.replace('-', ' ')}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Complexity Level</label>
                  <div className="grid grid-cols-3 gap-3">
                    {(["beginner", "intermediate", "advanced"] as const).map((d) => (
                      <button
                        key={d}
                        onClick={() => setDifficulty(d)}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          difficulty === d
                            ? 'bg-orange-500/10 dark:bg-orange-600/20 border-orange-500 text-orange-600 dark:text-white shadow-[0_0_20px_rgba(249,115,22,0.15)]'
                            : 'bg-zinc-50 dark:bg-zinc-900/50 border-zinc-100 dark:border-white/5 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-white'
                        }`}
                      >
                        <span className="block text-xs font-semibold capitalize">{d}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex justify-center">
                  <button
                    onClick={handleGenerate}
                    disabled={!documentId || !highlightedText}
                    className="group relative flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white rounded-xl font-bold shadow-lg shadow-orange-600/25 hover:shadow-orange-600/35 transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    Generate AI Simulation
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Loading stage */}
          {isPending && (
            <div className="flex flex-col items-center justify-center py-12 space-y-8 w-full">
              <div className="relative w-full max-w-md h-40 bg-zinc-50/50 dark:bg-zinc-900/40 rounded-xl border border-zinc-100 dark:border-white/5 p-4 flex items-center justify-around overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-500/5 via-transparent to-transparent animate-pulse" />
                
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex flex-col items-center space-y-3 z-10">
                    <div className="w-12 h-12 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center animate-pulse">
                      <div className="w-4 h-4 rounded-full bg-orange-550 dark:bg-orange-400 animate-ping" />
                    </div>
                    <div className="h-2 w-16 bg-zinc-200 dark:bg-white/10 rounded animate-pulse" />
                  </div>
                ))}

                {/* SVG flow line */}
                <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none opacity-40 dark:opacity-20">
                  <line x1="20%" y1="50%" x2="50%" y2="50%" stroke="orange" strokeWidth="2" strokeDasharray="4 4" className="animate-[dash_2s_linear_infinite]" />
                  <line x1="50%" y1="50%" x2="80%" y2="50%" stroke="orange" strokeWidth="2" strokeDasharray="4 4" className="animate-[dash_2s_linear_infinite]" />
                </svg>
              </div>

              <div className="text-center space-y-2">
                <h4 className="text-lg font-bold text-zinc-805 dark:text-white flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin text-orange-500 dark:text-orange-400" />
                  Synthesizing Interactive Simulator...
                </h4>
                <p className="text-zinc-550 dark:text-zinc-400 text-sm max-w-sm">
                  Analyzing structures, layout coordinates, and connecting signal nodes.
                </p>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {isError && (
            <div className="flex flex-col items-center justify-center py-12 space-y-6 w-full">
              <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shadow-[0_0_30px_rgba(244,63,94,0.15)]">
                <AlertTriangle className="w-8 h-8 text-rose-400" />
              </div>
              <div className="text-center space-y-2">
                <h4 className="text-lg font-bold text-zinc-900 dark:text-white">Generation Failed</h4>
                <p className="text-zinc-550 dark:text-zinc-400 text-sm max-w-md">
                  {error?.message || "An unexpected error occurred. Please try again."}
                </p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={handleResetAll}
                  className="px-5 py-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium transition-all"
                >
                  Configure
                </button>
                <button
                  onClick={handleGenerate}
                  className="px-5 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-semibold transition-all shadow-md shadow-orange-600/20"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {/* Active Simulation Player */}
          {simulation && !isCompleted && (
            <div className="space-y-6 w-full">
              
              {/* Video Timeline Scrubber */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs text-zinc-550 dark:text-zinc-400 font-semibold px-1">
                  <span className="flex items-center gap-1.5 text-orange-600 dark:text-orange-400">
                    <Activity className="w-3.5 h-3.5" />
                    Playback Progress
                  </span>
                  <span>
                    Step {activeStep + 1} of {simulation.steps.length}
                  </span>
                </div>
                
                {/* Clickable timeline line */}
                <div className="relative w-full h-2 bg-zinc-100 dark:bg-white/5 rounded-full overflow-hidden cursor-pointer group">
                  {/* Click/Scrub handles overlay */}
                  <div className="absolute inset-0 z-20 flex">
                    {simulation.steps.map((_, idx) => (
                      <div 
                        key={idx}
                        onClick={() => {
                          setDirection(idx > activeStep ? 1 : -1);
                          setActiveStep(idx);
                          setProgressPercent(0);
                        }}
                        className="flex-1 h-full hover:bg-white/10 transition-colors border-r border-white/5 last:border-r-0"
                        title={`Jump to step ${idx + 1}`}
                      />
                    ))}
                  </div>
                  
                  {/* Filled track representation */}
                  <div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 transition-all duration-300"
                    style={{ width: `${((activeStep) / simulation.steps.length) * 100}%` }}
                  />
                  
                  {/* Animated sub-step auto-play fill */}
                  {isPlaying && (
                    <div 
                      className="absolute top-0 h-full bg-orange-500/20 dark:bg-white/30"
                      style={{ 
                        left: `${(activeStep / simulation.steps.length) * 100}%`,
                        width: `${progressPercent / simulation.steps.length}%`
                      }}
                    />
                  )}
                </div>
              </div>

              {/* Dynamic Interactive Stage Map (Active Entity Arena) */}
              <div className="bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-white/5 rounded-2xl p-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-550 dark:text-zinc-400 mb-4 flex items-center gap-1.5 justify-center">
                  <Activity className="w-3.5 h-3.5 text-orange-500 dark:text-orange-400" />
                  Active Simulation Entities
                </h4>
                
                <div className="flex flex-wrap justify-center gap-4 py-2">
                  {simulation.entities.map((entity) => {
                    const currentStepData = simulation.steps[activeStep];
                    const isActive = currentStepData?.activeEntities.includes(entity.id);

                    return (
                      <motion.div
                        key={entity.id}
                        animate={{
                          scale: isActive ? 1.05 : 0.95,
                          opacity: isActive ? 1 : 0.35,
                          y: isActive ? [0, -4, 0] : 0,
                        }}
                        transition={isActive ? {
                          y: { repeat: Infinity, duration: 2, ease: "easeInOut" },
                          scale: { type: "spring", stiffness: 300, damping: 20 }
                        } : {}}
                        className={`flex flex-col items-center px-5 py-3.5 rounded-xl border min-w-[140px] transition-all cursor-default select-none ${
                          isActive
                            ? 'bg-white dark:bg-zinc-900 border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.15)] text-zinc-900 dark:text-white'
                            : 'bg-zinc-100/50 dark:bg-zinc-900/30 border-zinc-150 dark:border-white/5 text-zinc-450 dark:text-zinc-500 grayscale'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-lg ${isActive ? 'bg-orange-500/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-300' : 'bg-zinc-200/55 dark:bg-white/5 text-zinc-450 dark:text-zinc-500'}`}>
                            <User className="w-3.5 h-3.5" />
                          </div>
                          <span className="font-bold text-sm tracking-tight">{entity.label}</span>
                        </div>
                        <span className="text-[10px] opacity-70 mt-1">{entity.role}</span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Step Detail Presentation with Slide transition */}
              <div className="relative min-h-[150px] overflow-hidden">
                <AnimatePresence initial={false} custom={direction} mode="wait">
                  <motion.div
                    key={activeStep}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ type: "tween", ease: "easeInOut", duration: 0.25 }}
                    className="space-y-3"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-orange-600 dark:text-orange-400 border border-zinc-200 dark:border-white/5 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 dark:bg-orange-400 animate-pulse" />
                        Stage {activeStep + 1}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-zinc-900 dark:text-white leading-tight">{simulation.steps[activeStep]?.title}</h3>
                      <p className="text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed">{simulation.steps[activeStep]?.description}</p>
                      
                      {simulation.steps[activeStep]?.explanation && (
                        <div className="p-3 bg-zinc-50 dark:bg-white/5 rounded-xl border border-zinc-100 dark:border-white/5 mt-3">
                          <div className="text-[11px] font-bold text-zinc-550 dark:text-zinc-400 flex items-center gap-1.5 mb-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-orange-500 dark:text-orange-400" />
                            Technical Mechanism
                          </div>
                          <p className="text-zinc-650 dark:text-zinc-400 text-xs leading-relaxed italic">
                            {simulation.steps[activeStep]?.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Video Player Action Bar Controls */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/5">
                
                {/* Play/Pause & Speed Controller */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={togglePlay}
                    className={`p-2.5 rounded-full flex items-center justify-center transition-all ${
                      isPlaying 
                        ? 'bg-orange-600 hover:bg-orange-500 shadow-md shadow-orange-600/10' 
                        : 'bg-orange-600 hover:bg-orange-500 shadow-md shadow-orange-600/25'
                    }`}
                    title={isPlaying ? "Pause autoplay" : "Autoplay simulation like a video"}
                  >
                    {isPlaying ? <Pause className="w-4 h-4 text-white fill-white" /> : <Play className="w-4 h-4 text-white fill-white translate-x-0.5" />}
                  </button>

                  <div className="flex bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-lg p-0.5">
                    {[{ label: "0.5x", val: 5000 }, { label: "1x", val: 3000 }, { label: "2x", val: 1500 }].map((speed) => (
                      <button
                        key={speed.val}
                        onClick={() => setPlaybackSpeed(speed.val)}
                        className={`px-2.5 py-1 text-[10px] font-bold rounded ${
                          playbackSpeed === speed.val
                            ? 'bg-white dark:bg-zinc-800 text-orange-600 dark:text-orange-400 shadow-sm'
                            : 'text-zinc-550 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-white'
                        }`}
                      >
                        {speed.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Steps dot indicators */}
                <div className="hidden md:flex gap-1.5">
                  {simulation.steps.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setDirection(index > activeStep ? 1 : -1);
                        setActiveStep(index);
                        setProgressPercent(0);
                      }}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        index === activeStep 
                          ? 'bg-orange-500 w-6' 
                          : 'bg-zinc-200 dark:bg-white/10 hover:bg-zinc-300 dark:hover:bg-white/20'
                      }`}
                      aria-label={`Jump to step ${index + 1}`}
                    />
                  ))}
                </div>

                {/* Previous & Next standard buttons */}
                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  <button
                    onClick={handlePrev}
                    disabled={activeStep === 0}
                    className="flex items-center gap-1 px-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-750 dark:text-zinc-300 rounded-lg text-sm font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>
                  
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-1 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-sm font-semibold transition-all shadow-md shadow-orange-600/20"
                  >
                    {activeStep === simulation.steps.length - 1 ? 'Finish' : 'Next'}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* Takeaways Summary Screen */}
          {simulation && isCompleted && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center text-center py-6 space-y-6 w-full"
            >
              <div className="w-16 h-16 rounded-full bg-orange-500/10 dark:bg-orange-600/10 border border-orange-200 dark:border-orange-500/20 flex items-center justify-center shadow-[0_0_30px_rgba(249,115,22,0.2)]">
                <Trophy className="w-8 h-8 text-orange-500 dark:text-orange-400 animate-bounce" />
              </div>

              <div className="space-y-2 max-w-xl">
                <h3 className="text-2xl font-extrabold text-zinc-900 dark:text-white">Simulation Completed!</h3>
                <p className="text-zinc-550 dark:text-zinc-400 text-sm">
                  You have successfully completed this interactive learning session.
                </p>
              </div>

              <div className="w-full max-w-xl p-5 bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/5 rounded-xl text-left space-y-3">
                <h4 className="text-sm font-bold text-orange-600 dark:text-orange-400 tracking-wide uppercase">Core Summary & Key Takeaways</h4>
                <p className="text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed">
                  {simulation.summary}
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleResetAll}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-sm font-medium transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  Configure
                </button>
                <button
                  onClick={handleRestart}
                  className="flex items-center gap-1.5 px-6 py-2.5 rounded-lg bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-sm font-bold shadow-lg shadow-orange-600/20 transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  Replay Steps
                </button>
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
};
