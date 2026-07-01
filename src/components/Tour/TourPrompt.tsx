import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X } from "lucide-react";

interface TourPromptProps {
  isOpen: boolean;
  onAccept: () => void;
  onSkip: () => void;
}

export function TourPrompt({ isOpen, onAccept, onSkip }: TourPromptProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="tour-prompt"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9997] flex items-center justify-center p-8"
        >
          <div className="absolute inset-0 bg-black/40" />
          <motion.div
            key="prompt-card"
            initial={{ opacity: 0, y: 30, scale: 0.93 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className="relative max-w-md w-full"
          >
            <div className="relative bg-white dark:bg-black rounded-3xl border border-orange-500/30 dark:border-orange-500/40 shadow-2xl dark:shadow-[0_0_40px_rgba(249,115,22,0.15)] overflow-hidden p-8 text-center">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent pointer-events-none" />

              <button
                onClick={onSkip}
                className="absolute top-4 right-4 text-stone-400 dark:text-white/50 hover:text-stone-600 dark:hover:text-white/90 transition-colors p-1"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center mx-auto mb-5 border border-orange-500/20">
                  <Sparkles className="h-8 w-8 text-orange-500" />
                </div>

                <h2 className="text-xl font-bold text-stone-900 dark:text-white mb-2">
                  Welcome to LearnFlow AI!
                </h2>
                <p className="text-[14px] text-stone-600 dark:text-white/70 leading-relaxed mb-8">
                  Would you like a quick tour to explore the key features and get started?
                </p>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={onAccept}
                    className="w-full px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-[13px] font-semibold transition-all shadow-lg shadow-orange-500/30 active:scale-95"
                  >
                    Yes, take the tour
                  </button>
                  <button
                    onClick={onSkip}
                    className="w-full px-6 py-3 rounded-xl bg-stone-100 dark:bg-white/10 hover:bg-stone-200 dark:hover:bg-white/20 text-stone-700 dark:text-white/80 hover:text-stone-900 dark:hover:text-white text-[13px] font-semibold transition-all active:scale-95"
                  >
                    Skip, I'll explore on my own
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
