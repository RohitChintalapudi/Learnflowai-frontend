import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGenerateSimulation } from "../hooks/useGenerateSimulation";
import { Settings } from "lucide-react";
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Loader2,
  AlertTriangle,
  Activity,
  Cpu,
  User,
  Sparkles,
  BookOpen,
  Trophy,
} from "lucide-react";

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 100 : dir < 0 ? -100 : 0,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -100 : dir < 0 ? 100 : 0,
    opacity: 0,
  }),
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
  const [simulationType, setSimulationType] = useState<
    "visual-flow" | "step-by-step" | "real-world"
  >("visual-flow");
  const [difficulty, setDifficulty] = useState<
    "beginner" | "intermediate" | "advanced"
  >("intermediate");
  const [activeStep, setActiveStep] = useState<number>(0);
  const [direction, setDirection] = useState<number>(0); // -1 for prev, 1 for next
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Auto-play / Video controller states
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(3000); // ms per step
  const [progressPercent, setProgressPercent] = useState<number>(0);

  const { mutate, data, isPending, isError, error, reset } =
    useGenerateSimulation();

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
          setActiveStep((prev) => prev + 1);
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
      setActiveStep((prev) => prev + 1);
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
      setActiveStep((prev) => prev - 1);
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
      case "beginner":
        return (
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Beginner
          </span>
        );
      case "advanced":
        return (
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.15)] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
            Advanced
          </span>
        );
      case "intermediate":
      default:
        return (
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.15)] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Intermediate
          </span>
        );
    }
  };

  const getTypeBadge = (type: string) => {
    const label =
      type === "visual-flow"
        ? "Visual Flow"
        : type === "step-by-step"
          ? "Step-by-Step"
          : "Real World";
    return (
      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.15)] flex items-center gap-1.5">
        <Activity className="w-3.5 h-3.5" />
        {label}
      </span>
    );
  };
  const loadingSteps = [
    "Analyzing highlighted content...",
    "Extracting key concepts...",
    "Generating simulation entities...",
    "Building interactive flow...",
    "Preparing learning experience...",
  ];

  const [loadingIndex, setLoadingIndex] = useState(0);

  useEffect(() => {
    if (!isPending) return;

    const interval = setInterval(() => {
      setLoadingIndex((prev) => (prev + 1) % loadingSteps.length);
    }, 1000);

    return () => clearInterval(interval);
  }, [isPending]);

  return (
    <div className="w-full mx-auto font-sans">
      <div className="relative overflow-hidden bg-[var(--lf-card)] backdrop-blur-xl border card-shadow-lg border border-[var(--lf-border)] rounded-2xl shadow-2xl p-6 md:p-8">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-orange-500/10 blur-[90px] rounded-full" />
        {/* Ambient glows */}
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-orange-500/10 rounded-full blur-[110px] pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-amber-500/10 rounded-full blur-[110px] pointer-events-none" />

        {/* Header */}

        <div className="relative flex flex-col gap-2 pb-3">
          <div>
            <h2 className="text-2xl font-extrabold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent tracking-tight mb-2">
              {simulation ? simulation.title : "AI Simulation Generator"}
            </h2>

            {simulation && (
              <div className="flex items-center mb-2">
                <button
                  onClick={handleResetAll}
                  className="
        w-9 h-9
        rounded-full
        bg-[var(--lf-surface)]
        border border-[var(--lf-border)]
        flex items-center justify-center
        text-[var(--lf-accent)]
        hover:bg-orange-500/10
        hover:border-orange-500/30
        transition-all duration-300
      "
                  title="Back to Configuration"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            )}
            {highlightedText && !simulation && (
              <div className="mt-1 px-3 py-2 rounded-lg bg-[var(--lf-surface)] border border-[var(--lf-border)]">
                <p className="text-xs text-[var(--lf-text-secondary)] truncate">
                  {highlightedText}
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col items-start gap-1">
            {simulation && (
              <div className="flex flex-wrap items-center gap-2 mt-0">
                {getDifficultyBadge(simulation.difficulty)}

                {getTypeBadge(simulation.simulationType)}

                <div className="px-2 py-1 rounded-full bg-[var(--lf-surface)] border border-[var(--lf-border)] text-xs font-semibold text-[var(--lf-text-secondary)]">
                  {simulation.steps.length} Steps
                </div>
              </div>
            )}
            {onClose && (
              <button
                onClick={onClose}
                className="
      px-3 py-1.5
      rounded-xl
      bg-[var(--lf-surface)]
      border border-[var(--lf-border)]
      text-[var(--lf-text-secondary)]
      text-sm
      font-medium
      hover:text-[var(--lf-text-primary)]
      hover:border-orange-500/40
      hover:bg-orange-500/5
      transition-all duration-300
    "
              >
                Close
              </button>
            )}
          </div>
        </div>

        {/* Canvas & Controls Container */}
        <div className="relative mt-2 min-h-[300px] flex flex-col justify-between">
          {/* Initial State / Input Configurations */}
          {!simulation && !isPending && !isError && (
            <div className="flex flex-col items-center py-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-5 shadow-[0_0_30px_rgba(255,122,24,0.18)]">
                <Cpu className="w-8 h-8 text-[var(--lf-accent)] animate-pulse" />
              </div>

              <h3 className="text-xl font-bold text-[var(--lf-text-primary)] mb-2">
                Create Interactive Simulation
              </h3>

              <p className="text-[var(--lf-text-secondary)] max-w-xl mb-6">
                Transform highlighted content into an engaging AI-powered
                simulation with guided steps, active entities and real-world
                learning experiences.
              </p>

              <div className="w-full max-w-lg space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-[var(--lf-text-primary)] mb-2">
                    Simulation Type
                  </label>

                  <div className="grid grid-cols-3 gap-2">
                    {(
                      ["visual-flow", "step-by-step", "real-world"] as const
                    ).map((t) => (
                      <button
                        key={t}
                        onClick={() => setSimulationType(t)}
                        className={`p-3 rounded-xl border transition-all duration-300 ${
                          simulationType === t
                            ? "bg-orange-500/10 border-orange-500/30 text-[var(--lf-accent)] shadow-[0_0_20px_rgba(255,122,24,0.15)]"
                            : "bg-[var(--lf-surface)] border-[var(--lf-border)] text-[var(--lf-text-secondary)] hover:border-orange-500/20 hover:bg-orange-500/5"
                        }`}
                      >
                        <span className="block text-sm font-semibold capitalize">
                          {t.replace("-", " ")}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[var(--lf-text-primary)] mb-2">
                    Complexity Level
                  </label>

                  <div className="grid grid-cols-3 gap-2">
                    {(["beginner", "intermediate", "advanced"] as const).map(
                      (d) => (
                        <button
                          key={d}
                          onClick={() => setDifficulty(d)}
                          className={`p-3 rounded-xl border transition-all duration-300 ${
                            difficulty === d
                              ? "bg-orange-500/10 border-orange-500/30 text-[var(--lf-accent)] shadow-[0_0_20px_rgba(255,122,24,0.15)]"
                              : "bg-[var(--lf-surface)] border-[var(--lf-border)] text-[var(--lf-text-secondary)] hover:border-orange-500/20 hover:bg-orange-500/5"
                          }`}
                        >
                          <span className="block text-sm font-semibold capitalize">
                            {d}
                          </span>
                        </button>
                      ),
                    )}
                  </div>
                </div>
                <div className="pt-3 flex justify-center">
                  <button
                    onClick={handleGenerate}
                    disabled={!documentId || !highlightedText}
                    className="group flex items-center gap-2 px-6 py-3 bg-[var(--lf-accent)] hover:opacity-90 text-white rounded-xl font-semibold shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
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
              <div className="relative w-full max-w-lg rounded-3xl bg-[var(--lf-card)] border border-[var(--lf-border)] p-8 overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-500/10 blur-[70px] rounded-full" />

                <div className="flex justify-center gap-8 relative z-10">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex flex-col items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                        <div className="w-4 h-4 rounded-full bg-[var(--lf-accent)] animate-ping" />
                      </div>

                      <div className="h-2 w-16 rounded-full bg-[var(--lf-surface)] animate-pulse" />
                    </div>
                  ))}
                </div>

                <div className="mt-8 h-2 rounded-full bg-[var(--lf-surface)] overflow-hidden">
                  <div className="h-full w-2/3 bg-[var(--lf-accent)] animate-pulse rounded-full" />
                </div>

                {/* AI Pipeline */}
                <div className="mt-6 space-y-3">
                  {[
                    "Content Analysis",
                    "Concept Extraction",
                    "Simulation Generation",
                    "Interactive Experience",
                  ].map((step, index) => (
                    <motion.div
                      key={step}
                      animate={{
                        opacity: index <= loadingIndex ? 1 : 0.4,
                      }}
                      className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                        index <= loadingIndex
                          ? "bg-orange-500/5 border border-orange-500/20"
                          : "border border-[var(--lf-border)]"
                      }`}
                    >
                      <div
                        className={`w-2.5 h-2.5 rounded-full ${
                          index <= loadingIndex
                            ? "bg-[var(--lf-accent)]"
                            : "bg-[var(--lf-border)]"
                        }`}
                      />

                      <span className="text-sm font-medium text-[var(--lf-text-primary)]">
                        {step}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="text-center max-w-md">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Loader2 className="w-5 h-5 animate-spin text-[var(--lf-accent)]" />

                  <h4 className="text-lg font-bold text-[var(--lf-text-primary)]">
                    Building Interactive Simulation
                  </h4>
                </div>

                <p className="text-sm text-[var(--lf-text-secondary)]">
                  {loadingSteps[loadingIndex]}
                </p>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {isError && (
            <div className="flex flex-col items-center justify-center py-12 space-y-6 w-full">
              <div className="w-20 h-20 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shadow-[0_0_35px_rgba(239,68,68,0.15)]">
                <AlertTriangle className="w-10 h-10 text-red-500" />
              </div>

              <div className="text-center max-w-md">
                <h4 className="text-xl font-bold text-[var(--lf-text-primary)] mb-2">
                  Simulation Generation Failed
                </h4>

                <p className="text-sm text-[var(--lf-text-secondary)]">
                  {error?.message ||
                    "Something went wrong while creating the simulation. Please try again."}
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleResetAll}
                  className="px-5 py-3 rounded-xl bg-[var(--lf-surface)] border border-[var(--lf-border)] text-[var(--lf-text-secondary)] hover:text-[var(--lf-text-primary)] hover:border-orange-500/30 transition-all"
                >
                  Configure Again
                </button>

                <button
                  onClick={handleGenerate}
                  className="px-5 py-3 rounded-xl bg-[var(--lf-accent)] text-white font-semibold hover:opacity-90 transition-all"
                >
                  Retry Generation
                </button>
              </div>
            </div>
          )}

          {/* Active Simulation Player */}
          {simulation && !isCompleted && (
            <div className="space-y-4 w-full">
              {/* Video Timeline Scrubber */}
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <span className="flex items-center gap-2 text-[var(--lf-accent)] text-sm font-semibold">
                    {simulation.simulationType === "visual-flow" && (
                      <>
                        <Activity className="w-4 h-4" />
                        Visual Flow
                      </>
                    )}

                    {simulation.simulationType === "step-by-step" && (
                      <>
                        <BookOpen className="w-4 h-4" />
                        Step-by-Step Learning
                      </>
                    )}

                    {simulation.simulationType === "real-world" && (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Real World Scenario
                      </>
                    )}
                  </span>

                  <div className="px-2.5 py-1 rounded-full bg-[var(--lf-surface)] border border-[var(--lf-border)] text-xs font-medium text-[var(--lf-text-secondary)]">
                    {simulation.simulationType === "visual-flow" &&
                      `Flow ${activeStep + 1}/${simulation.steps.length}`}

                    {simulation.simulationType === "step-by-step" &&
                      `Step ${activeStep + 1}/${simulation.steps.length}`}

                    {simulation.simulationType === "real-world" &&
                      `Scene ${activeStep + 1}/${simulation.steps.length}`}
                  </div>
                </div>

                {/* Clickable timeline line */}
                {simulation.simulationType !== "real-world" && (
                  <div className="relative w-full h-2.5 bg-[var(--lf-surface)] border border-[var(--lf-border)] rounded-full overflow-hidden cursor-pointer group">
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
                          className="flex-1 h-full hover:bg-orange-500/10 transition-all duration-300 border-r border-[var(--lf-border)] last:border-r-0"
                          title={`Jump to step ${idx + 1}`}
                        />
                      ))}
                    </div>

                    {/* Filled track representation */}
                    <div
                      className="absolute top-0 left-0 h-full bg-[var(--lf-accent)] transition-all duration-300"
                      style={{
                        width: `${(activeStep / simulation.steps.length) * 100}%`,
                      }}
                    />

                    {/* Animated sub-step auto-play fill */}
                    {isPlaying && (
                      <div
                        className="absolute top-0 h-full bg-[var(--lf-accent)]/30 transition-all duration-200"
                        style={{
                          left: `${(activeStep / simulation.steps.length) * 100}%`,
                          width: `${progressPercent / simulation.steps.length}%`,
                        }}
                      />
                    )}
                  </div>
                )}
              </div>
              {/* Dynamic Interactive Stage Map (Active Entity Arena) */}
              <div className="bg-[var(--lf-card)] border border-[var(--lf-border)] rounded-2xl p-3 card-shadow-lg">
                <h4 className="text-xs font-bold text-[var(--lf-text-primary)] mb-2 flex items-center gap-2 justify-center">
                  {simulation.simulationType === "visual-flow" && (
                    <>
                      <Activity className="w-4 h-4 text-[var(--lf-accent)]" />
                      Flow Nodes
                    </>
                  )}

                  {simulation.simulationType === "step-by-step" && (
                    <>
                      <BookOpen className="w-4 h-4 text-[var(--lf-accent)]" />
                      Learning Components
                    </>
                  )}

                  {simulation.simulationType === "real-world" && (
                    <>
                      <Sparkles className="w-4 h-4 text-[var(--lf-accent)]" />
                      Real World Actors
                    </>
                  )}
                </h4>

                <div className={`py-1 flex flex-wrap justify-center gap-2`}>
                  {simulation.entities.map((entity, index) => {
                    const currentStepData = simulation.steps[activeStep];

                    const isActive = currentStepData?.activeEntities.includes(
                      entity.id,
                    );

                    return (
                      <motion.div
                        key={entity.id}
                        animate={{
                          scale: isActive ? 1.02 : 1,
                          opacity: isActive ? 1 : 0.75,
                          y: isActive ? [0, -2, 0] : 0,
                        }}
                        transition={
                          isActive
                            ? {
                                y: {
                                  repeat: Infinity,
                                  duration: 2,
                                  ease: "easeInOut",
                                },
                              }
                            : {}
                        }
                        className={`flex flex-col items-center px-2.5 py-2 rounded-lg border w-[125px] transition-all cursor-default select-none ${
                          isActive
                            ? "bg-orange-500/10 border-orange-500/30 shadow-[0_0_16px_rgba(255,122,24,0.18)] text-[var(--lf-text-primary)]"
                            : "bg-[var(--lf-card)] border-[var(--lf-border)] text-[var(--lf-text-primary)]"
                        }`}
                      >
                        <div className="flex justify-center mb-1.5">
                          

                          <span
                            className={`font-semibold text-sm text-center leading-tight ${
                              isActive
                                ? "text-[var(--lf-text-primary)]"
                                : "text-[var(--lf-text-secondary)]"
                            }`}
                          >
                            {entity.label}
                          </span>
                        </div>

                        <span
                          className={`text-[10px] mt-0.5 text-center leading-tight line-clamp-1 ${
                            isActive
                              ? "text-[var(--lf-text-secondary)]"
                              : "text-[var(--lf-text-secondary)] opacity-70"
                          }`}
                        >
                          {simulation.simulationType === "real-world"
                            ? `Actor • ${entity.role}`
                            : entity.role}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
              {/* Step Detail Presentation with Slide transition */}
              <div className="relative min-h-[130px] overflow-visible">
                <AnimatePresence initial={false} custom={direction} mode="wait">
                  <motion.div
                    key={activeStep}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      type: "tween",
                      ease: "easeInOut",
                      duration: 0.2,
                    }}
                    className={`${
                      simulation.simulationType === "visual-flow"
                        ? "space-y-3"
                        : simulation.simulationType === "real-world"
                          ? "space-y-3"
                          : "space-y-2"
                    }`}
                  >
                    {simulation.simulationType === "visual-flow" && (
                      <div className="bg-[var(--lf-card)] border border-[var(--lf-border)] rounded-2xl p-3">
                        <div className="flex items-center gap-2 mb-3">
                          <Activity className="w-4 h-4 text-[var(--lf-accent)]" />
                          <span className="font-bold text-xs text-[var(--lf-accent)]">
                            Visual Algorithm Flow
                          </span>
                        </div>

                        <div className="w-full overflow-hidden pb-2">
  <div className="flex items-center justify-center gap-2 flex-wrap px-2 py-1">
  {simulation.steps
    .slice(0, activeStep + 1)
    .map((step, idx) => {
      const isCurrent = idx === activeStep;
      const isVisited = idx < activeStep;

      return (
        <motion.button
          key={idx}
          onClick={() => {
            setDirection(idx > activeStep ? 1 : -1);
            setActiveStep(idx);
            setProgressPercent(0);
          }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.98 }}
          animate={{
            scale: isCurrent ? 1.05 : 1,
          }}
          className={`w-[150px] rounded-xl border px-3 py-3 text-center transition-all duration-300 ${
            isCurrent
              ? "bg-orange-500/10 border-orange-500/40 shadow-[0_0_18px_rgba(255,122,24,0.18)]"
              : isVisited
                ? "bg-emerald-500/10 border-emerald-500/40 shadow-[0_0_18px_rgba(16,185,129,0.18)]"
                : "bg-[var(--lf-surface)] border-[var(--lf-border)] hover:border-orange-500/20"
          }`}
        >
          <h4
            className={`text-sm font-semibold leading-tight line-clamp-2 ${
              isCurrent
                ? "text-[var(--lf-text-primary)]"
                : isVisited
                  ? "text-emerald-700 dark:text-emerald-300"
                  : "text-[var(--lf-text-primary)]"
            }`}
          >
            {step.title}
          </h4>
        </motion.button>
      );
    })}
</div>
</div>

                        <div className="mt-3 p-3 rounded-xl bg-orange-500/5 border border-orange-500/20">
                          <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="w-3.5 h-3.5 text-[var(--lf-accent)]" />
                            <span className="text-xs font-semibold text-[var(--lf-accent)]">
                              Current Node Insights
                            </span>
                          </div>

                          <h4 className="font-semibold text-sm text-[var(--lf-text-primary)] mb-1 line-clamp-1">
                            {simulation.steps[activeStep]?.title}
                          </h4>

                          <p className="text-sm text-[var(--lf-text-secondary)] leading-5 line-clamp-2">
                            {simulation.steps[activeStep]?.description}
                          </p>

                          {simulation.steps[activeStep]?.explanation && (
                            <div className="mt-2 pt-2 border-t border-orange-500/10">
                              <p className="text-sm text-[var(--lf-text-secondary)] leading-5 line-clamp-2">
                                <span className="font-semibold text-[var(--lf-accent)]">
                                  Why this node matters:
                                </span>{" "}
                                {simulation.steps[activeStep]?.explanation}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    {simulation?.simulationType === "real-world" && (
                      <div className="space-y-3">
                        {/* Learning Concept */}
                        <div className="bg-[var(--lf-card)] border border-[var(--lf-border)] rounded-2xl p-3 card-shadow-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <BookOpen className="w-4 h-4 text-[var(--lf-accent)]" />
                            <h4 className="text-xs font-bold text-[var(--lf-text-primary)]">
                              Learning Concept
                            </h4>
                          </div>

                          <h3 className="text-lg font-bold text-[var(--lf-text-primary)] mb-2 line-clamp-1">
                            {simulation.steps[activeStep]?.title}
                          </h3>

                          <div className="p-3 rounded-xl bg-orange-500/5 border border-orange-500/20">
                            <p className="text-sm text-[var(--lf-text-secondary)] leading-5 line-clamp-3">
                              {simulation.steps[activeStep]?.description}
                            </p>
                          </div>
                        </div>

                        {/* Real World Example */}
                        <div className="bg-gradient-to-br from-orange-500/5 to-orange-500/10 border border-orange-500/20 rounded-2xl p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="w-4 h-4 text-[var(--lf-accent)]" />
                            <h4 className="text-xs font-bold text-[var(--lf-text-primary)]">
                              Interactive Scenario
                            </h4>
                          </div>
                          {/* Dynamic Actors */}
                          <div className="flex flex-wrap gap-2 mb-3">
                            {simulation.entities.map((entity) => (
                              <motion.div
                                key={entity.id}
                                whileHover={{ scale: 1.02 }}
                                className="px-2.5 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20"
                              >
                                <div className="flex items-center gap-1.5">
                                  <User className="w-3 h-3 text-[var(--lf-accent)]" />
                                  <div>
                                    <div className="text-sm font-semibold text-[var(--lf-text-primary)] leading-tight">
                                      {entity.label}
                                    </div>

                                    <div className="text-[9px] text-[var(--lf-text-secondary)] leading-tight">
                                      {entity.role}
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>

                          {/* Story Bubble */}
                          <div className="relative rounded-xl bg-orange-500/5 border border-orange-500/15 p-3">
                            <div className="absolute -top-1 left-5 w-2.5 h-2.5 rotate-45 bg-orange-500/5 border-l border-t border-orange-500/15" />

                            <div className="flex items-start gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0">
                                <Sparkles className="w-4 h-4 text-[var(--lf-accent)]" />
                              </div>

                              <div className="flex-1">
                                <p className="text-smtext-[var(--lf-text-secondary)] leading-5 line-clamp-3">
                                  {simulation.steps[activeStep]?.description}
                                </p>
                              </div>
                            </div>
                          </div>

                          {simulation.steps[activeStep]?.explanation && (
                            <div className="mt-3 rounded-xl bg-[var(--lf-surface)] border border-[var(--lf-border)] p-3">
                              <div className="flex items-center gap-2 mb-2">
                                <BookOpen className="w-3.5 h-3.5 text-[var(--lf-accent)]" />
                                <span className="text-xs font-semibold text-[var(--lf-accent)]">
                                  Scenario Insight
                                </span>
                              </div>
                              <p className="text-sm text-[var(--lf-text-secondary)] leading-5 line-clamp-3">
                                {simulation.steps[activeStep]?.explanation}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Stage Badge */}
                    <div className="flex items-center gap-2">
                      {simulation.simulationType === "step-by-step" && (
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-orange-500/10 text-[var(--lf-accent)] border border-orange-500/20 flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-[var(--lf-accent)] animate-pulse" />
                          Step {activeStep + 1}
                        </span>
                      )}
                    </div>

                    {/* Step Content Card */}
                    {simulation.simulationType === "step-by-step" && (
                      <div className="bg-[var(--lf-card)] border border-[var(--lf-border)] rounded-2xl p-3 card-shadow-lg">
                        <h3 className="text-lg font-bold text-[var(--lf-text-primary)] leading-tight mb-2 line-clamp-1">
                          {simulation.steps[activeStep]?.title}
                        </h3>

                        <p className="text-sm text-[var(--lf-text-secondary)] leading-5 line-clamp-3">
                          {simulation.steps[activeStep]?.description}
                        </p>

                        {simulation.steps[activeStep]?.explanation && (
                          <div className="mt-3 p-3 bg-[var(--lf-surface)] rounded-xl border border-[var(--lf-border)]">
                            <div className="text-sm font-semibold text-[var(--lf-accent)] flex items-center gap-2 mb-1">
                              <BookOpen className="w-3.5 h-3.5" />
                              Technical Mechanism
                            </div>

                            <p className="text-sm text-[var(--lf-text-secondary)] leading-5 italic line-clamp-3">
                              {simulation.steps[activeStep]?.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
              {/* Video Player Action Bar Controls */}
              <div className="sticky bottom-0 z-20 bg-[var(--lf-card)]/95 backdrop-blur-md flex flex-wrap items-center justify-between gap-2 pt-2 pb-2 px-2 border-t border-[var(--lf-border)] rounded-b-2xl">
                {/* Play/Pause & Speed Controller */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={togglePlay}
                    className={`p-2 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      isPlaying
                        ? "bg-amber-500 text-white shadow-lg"
                        : "bg-[var(--lf-accent)] text-white shadow-lg"
                    }`}
                    title={isPlaying ? "Pause autoplay" : "Autoplay simulation"}
                  >
                    {isPlaying ? (
                      <Pause className="w-3.5 h-3.5 fill-white" />
                    ) : (
                      <Play className="w-3.5 h-3.5 fill-white translate-x-0.5" />
                    )}
                  </button>

                  {simulation.simulationType !== "real-world" && (
                    <div className="flex bg-[var(--lf-surface)] border border-[var(--lf-border)] rounded-lg p-0.5">
                      {[
                        { label: "0.5x", val: 5000 },
                        { label: "1x", val: 3000 },
                        { label: "2x", val: 1500 },
                      ].map((speed) => (
                        <button
                          key={speed.val}
                          onClick={() => setPlaybackSpeed(speed.val)}
                          className={`px-2 py-1 text-sm font-semibold rounded-md transition-all ${
                            playbackSpeed === speed.val
                              ? "bg-orange-500/10 text-[var(--lf-accent)]"
                              : "text-[var(--lf-text-secondary)] hover:text-[var(--lf-text-primary)]"
                          }`}
                        >
                          {speed.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {/* Step Indicators */}
                {simulation.simulationType !== "real-world" && (
                  <div className="hidden md:flex gap-1">
                    {simulation.steps.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setDirection(index > activeStep ? 1 : -1);
                          setActiveStep(index);
                          setProgressPercent(0);
                        }}
                        className={`transition-all duration-300 rounded-full ${
                          index === activeStep
                            ? "w-5 h-2 bg-[var(--lf-accent)]"
                            : "w-2 h-2 bg-[var(--lf-border)] hover:bg-orange-500/30"
                        }`}
                        aria-label={`Jump to step ${index + 1}`}
                      />
                    ))}
                  </div>
                )}

                {/* Previous & Next */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handlePrev}
                    disabled={activeStep === 0}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[var(--lf-surface)] border border-[var(--lf-border)] text-sm font-medium text-[var(--lf-text-secondary)] hover:text-[var(--lf-text-primary)] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    {simulation.simulationType === "real-world"
                      ? "Previous Scene"
                      : simulation.simulationType === "visual-flow"
                        ? "Previous Node"
                        : "Previous"}
                  </button>
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[var(--lf-accent)] text-white text-sm font-semibold hover:opacity-90 transition-all shadow-lg"
                  >
                    {simulation.simulationType === "visual-flow"
                      ? activeStep === simulation.steps.length - 1
                        ? "Complete Flow"
                        : "Next Node"
                      : simulation.simulationType === "real-world"
                        ? activeStep === simulation.steps.length - 1
                          ? "Finish Scenario"
                          : "Continue Story"
                        : activeStep === simulation.steps.length - 1
                          ? "Finish"
                          : "Next"}

                    <ChevronRight className="w-3.5 h-3.5" />
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
              className="flex flex-col items-center text-center py-5 space-y-4 w-full"
            >
              <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shadow-[0_0_20px_rgba(255,122,24,0.18)]">
                <Trophy className="w-7 h-7 text-[var(--lf-accent)] animate-bounce" />
              </div>
              <div className="space-y-2 max-w-xl">
                <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-[var(--lf-accent)] text-sm font-semibold">
                  {simulation.simulationType === "visual-flow"
                    ? "🎉 Flow Completed"
                    : simulation.simulationType === "real-world"
                      ? "🎉 Scenario Completed"
                      : "🎉 Simulation Complete"}
                </div>

                <h3 className="text-xl font-bold text-[var(--lf-text-primary)]">
                  {simulation.simulationType === "visual-flow"
                    ? "Flow Successfully Completed!"
                    : simulation.simulationType === "real-world"
                      ? "Scenario Successfully Completed!"
                      : "Great Job!"}
                </h3>

                <p className="text-sm text-[var(--lf-text-secondary)] leading-5">
                  {simulation.simulationType === "visual-flow"
                    ? "You have successfully completed the visual learning flow."
                    : simulation.simulationType === "real-world"
                      ? "You have successfully explored the complete real-world scenario."
                      : "You have successfully completed this interactive learning simulation."}
                </p>
              </div>

              <div className="w-full max-w-2xl bg-[var(--lf-card)] border border-[var(--lf-border)] rounded-2xl p-3 card-shadow-lg text-left">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-[var(--lf-accent)]" />
                  <h4 className="text-xs font-bold text-[var(--lf-text-primary)]">
                    {simulation.simulationType === "visual-flow"
                      ? "Flow Summary"
                      : simulation.simulationType === "real-world"
                        ? "Scenario Insights"
                        : "Core Summary & Key Takeaways"}
                  </h4>
                </div>

                <p className="text-sm text-[var(--lf-text-secondary)] leading-5 line-clamp-5">
                  {simulation.summary}
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-2">
                <button
                  onClick={handleResetAll}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[var(--lf-surface)] border border-[var(--lf-border)] text-sm font-medium text-[var(--lf-text-secondary)] hover:text-[var(--lf-text-primary)] transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Configure Again
                </button>

                <button
                  onClick={handleRestart}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[var(--lf-accent)] text-white text-sm font-semibold hover:opacity-90 transition-all shadow-lg"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  {simulation.simulationType === "visual-flow"
                    ? "Replay Flow"
                    : simulation.simulationType === "real-world"
                      ? "Replay Scenario"
                      : "Replay Simulation"}
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
