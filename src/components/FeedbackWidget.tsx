import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquarePlus, X, Send, CheckCircle2, Sparkles, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import PeekRating from "./PeekRating";
import { FeedbackAPI } from "../lib/api";

export function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(4);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalRating = Math.max(1, Math.min(5, Math.round(Number(rating) || 5)));

    setIsSubmitting(true);
    try {
      await FeedbackAPI.submitFeedback({
        rating: finalRating,
        comment: comment.trim() || undefined,
      });

      setIsSuccess(true);
      toast.success("Thank you for your feedback!");

      setTimeout(() => {
        setIsOpen(false);
        setIsSuccess(false);
        setComment("");
        setRating(4);
      }, 1800);
    } catch (err: any) {
      console.error("Failed to submit feedback:", err);
      toast.error(err.message || "Failed to submit feedback");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <aside
      ref={widgetRef}
      aria-label="Feedback tool"
      className="fixed bottom-5 right-5 z-40 select-none font-sans"
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="absolute bottom-14 right-0 w-[310px] sm:w-[350px] rounded-2xl border border-stone-200/90 dark:border-stone-800/90 bg-white/95 dark:bg-stone-900/95 backdrop-blur-xl shadow-2xl shadow-stone-900/20 p-5 overflow-hidden text-stone-900 dark:text-stone-100"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-200/60 dark:border-stone-800/60">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold tracking-tight leading-none">
                    Share Feedback
                  </h2>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">
                    Help us improve your experience
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                aria-label="Close feedback widget"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Content Body */}
            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-8 flex flex-col items-center justify-center text-center space-y-2"
              >
                <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h4 className="text-base font-bold text-stone-900 dark:text-white">
                  Thank You!
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-400 max-w-[220px]">
                  Your review has been received and helps us make Learnflow AI even better.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                {/* PeekRating Interactive Row */}
                <div className="flex flex-col items-center justify-center py-2 bg-stone-50/80 dark:bg-stone-950/50 rounded-xl border border-stone-200/50 dark:border-stone-800/50">
                  <PeekRating
                    value={rating}
                    defaultValue={4}
                    count={5}
                    shape="star"
                    labels={["Poor", "Fair", "Good", "Great", "Superb"]}
                    activeColor="#f97316"
                    idleColor="#a1a1aa"
                    tipColor="#1c1917"
                    tipTextColor="#fafaf9"
                    size={32}
                    lift={8}
                    magnify={1.18}
                    riseDuration={320}
                    popScale={1.3}
                    showTip
                    allowClear={false}
                    onChange={(value) => setRating(value || 1)}
                    showLabels
                    readOnly={false}
                  />
                </div>

                {/* Comment Area */}
                <div>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us what you loved or how we can improve... (optional)"
                    rows={3}
                    className="w-full resize-none rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-950/60 p-3 text-xs text-stone-800 dark:text-stone-200 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-500/40 dark:focus:ring-orange-500/30 transition-all"
                  />
                </div>

                {/* Submit button */}
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 text-white text-xs font-semibold shadow-sm shadow-orange-500/20 active:scale-[0.98] transition-all cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-3.5 w-3.5" />
                        <span>Submit</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger floating button */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen((prev) => !prev)}
        className="group relative flex h-10 items-center gap-2 rounded-full border border-orange-200/80 dark:border-orange-900/60 bg-gradient-to-r from-orange-500 to-orange-600 px-3.5 text-white shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/35 transition-all duration-300 focus:outline-none"
        aria-label="Open feedback dialog"
      >
        <MessageSquarePlus className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:rotate-12" />
        <span className="text-xs font-bold tracking-wide">
          Feedback
        </span>
      </motion.button>
    </aside>
  );
}

export default FeedbackWidget;
