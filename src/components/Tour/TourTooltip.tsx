import { motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight, SkipForward } from "lucide-react";

interface TourTooltipProps {
  title: string;
  description: string;
  stepNumber: number;
  totalSteps: number;
  estimatedTime?: number;
  position: { top: number; left: number };
  placement: "top" | "bottom" | "left" | "right";
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export function TourTooltip({
  title,
  description,
  stepNumber,
  totalSteps,
  position,
  placement,
  onNext,
  onPrev,
  onSkip,
  isFirst,
  isLast,
}: TourTooltipProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: placement === "top" ? 10 : -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      className="fixed z-[10000] w-[340px]"
      style={{ top: position.top, left: position.left }}
    >
      <div className="relative bg-white dark:bg-black rounded-2xl border border-orange-500/30 dark:border-orange-500/40 shadow-2xl dark:shadow-[0_0_40px_rgba(249,115,22,0.15)] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent pointer-events-none" />

        <div className="relative p-5">
          <div className="flex items-start justify-between mb-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-orange-500 bg-orange-500/10 px-2.5 py-1 rounded-full border border-orange-500/20">
              Step {stepNumber} of {totalSteps}
            </span>
            <button
              onClick={onSkip}
              className="text-stone-400 dark:text-white/50 hover:text-stone-600 dark:hover:text-white/90 transition-colors p-0.5"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <h3 className="text-[15px] font-bold text-stone-900 dark:text-white mb-1.5 leading-snug">
            {title}
          </h3>
          <p className="text-[12.5px] text-stone-600 dark:text-white/70 leading-relaxed mb-4">
            {description}
          </p>

          <div className="flex items-center justify-between gap-2">
            <div className="flex gap-1.5">
              {!isFirst && (
                <button
                  onClick={onPrev}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-white/10 hover:bg-stone-200 dark:hover:bg-white/20 text-stone-700 dark:text-white/80 hover:text-stone-900 dark:hover:text-white text-[11px] font-semibold transition-all active:scale-95"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  Back
                </button>
              )}
            </div>
            <div className="flex gap-1.5">
              <button
                onClick={onSkip}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-stone-400 dark:text-white/50 hover:text-stone-600 dark:hover:text-white/80 text-[11px] font-semibold transition-all hover:bg-stone-100 dark:hover:bg-white/10 active:scale-95"
              >
                <SkipForward className="h-3.5 w-3.5" />
                Skip
              </button>
              <button
                onClick={onNext}
                className="flex items-center gap-1 px-4 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-[11px] font-semibold transition-all shadow-lg shadow-orange-500/30 active:scale-95"
              >
                {isLast ? "Finish" : "Next"}
                {!isLast && <ChevronRight className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
