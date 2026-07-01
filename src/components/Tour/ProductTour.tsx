import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "@tanstack/react-router";
import { useProductTour } from "../../contexts/ProductTourContext";
import { Spotlight } from "./Spotlight";
import { TourTooltip } from "./TourTooltip";
import { DocumentAPI } from "../../lib/api";

function getTooltipPosition(
  targetRect: DOMRect | null,
  placement: "top" | "bottom" | "left" | "right",
  tooltipWidth: number,
  tooltipHeight: number,
  gap = 16,
) {
  if (!targetRect) return { top: 0, left: 0 };
  const cw = window.innerWidth;
  const ch = window.innerHeight;

  let top = 0;
  let left = 0;

  switch (placement) {
    case "top":
      top = targetRect.top - tooltipHeight - gap;
      left = targetRect.left + targetRect.width / 2 - tooltipWidth / 2;
      break;
    case "bottom":
      top = targetRect.bottom + gap;
      left = targetRect.left + targetRect.width / 2 - tooltipWidth / 2;
      break;
    case "left":
      top = targetRect.top + targetRect.height / 2 - tooltipHeight / 2;
      left = targetRect.left - tooltipWidth - gap;
      break;
    case "right":
      top = targetRect.top + targetRect.height / 2 - tooltipHeight / 2;
      left = targetRect.right + gap;
      break;
  }

  left = Math.max(16, Math.min(left, cw - tooltipWidth - 16));
  top = Math.max(16, Math.min(top, ch - tooltipHeight - 16));
  return { top, left };
}

export function ProductTour() {
  const {
    tourState,
    currentStep,
    totalSteps,
    nextStep,
    prevStep,
    endTour,
    setNavigating,
  } = useProductTour();
  const navigate = useNavigate();
  const location = useLocation();
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);
  const retryCountRef = useRef(0);

  const isActive = tourState.isActive;
  const stepIndex = tourState.currentStepIndex;
  const docIdRef = useRef<string | null>(null);

  const findTarget = useCallback(() => {
    if (!currentStep?.targetSelector) {
      setTargetRect(null);
      return null;
    }
    const el = document.querySelector(currentStep.targetSelector);
    if (el) {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setTargetRect(rect);
        retryCountRef.current = 0;
        return rect;
      }
    }
    return null;
  }, [currentStep]);

  useEffect(() => {
    if (!isActive || !currentStep) return;

    const targetRoute = currentStep.route;
    const currentPath = location.pathname;

    if (targetRoute === "/workspace") {
      if (!currentPath.startsWith("/workspace")) {
        setNavigating(true);
        setTargetRect(null);
        if (!docIdRef.current) {
          DocumentAPI.getDocuments().then((docs) => {
            if (docs.length > 0) {
              const randomDoc = docs[Math.floor(Math.random() * docs.length)];
              docIdRef.current = randomDoc.id;
              navigate({ to: `/workspace/${randomDoc.id}` as never });
            } else {
              navigate({ to: "/documents" as never });
            }
          });
        } else {
          navigate({ to: `/workspace/${docIdRef.current}` as never });
        }
        return;
      }
      setNavigating(false);
      if (!currentStep.targetSelector) {
        setTargetRect(null);
        return;
      }
      retryCountRef.current = 0;
      const tryFind = () => {
        const rect = findTarget();
        if (!rect && retryCountRef.current < 100) {
          retryCountRef.current++;
          setTimeout(tryFind, 100);
        }
      };
      const timer = setTimeout(tryFind, 150);
      return () => clearTimeout(timer);
    }

    if (currentPath !== targetRoute) {
      setNavigating(true);
      setTargetRect(null);
      navigate({ to: targetRoute as any });
      return;
    }

    setNavigating(false);

    if (!currentStep.targetSelector) {
      setTargetRect(null);
      return;
    }

    retryCountRef.current = 0;
    const tryFind = () => {
      const rect = findTarget();
      if (!rect && retryCountRef.current < 100) {
        retryCountRef.current++;
        setTimeout(tryFind, 100);
      }
    };
    const timer = setTimeout(tryFind, 150);
    return () => clearTimeout(timer);
  }, [isActive, stepIndex, currentStep, location.pathname, navigate, findTarget, setNavigating]);

  useEffect(() => {
    if (!isActive) return;
    const handleResize = () => findTarget();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isActive, findTarget]);

  useEffect(() => {
    if (!targetRect || !currentStep) return;
    const pos = getTooltipPosition(
      targetRect,
      currentStep.tooltipPosition ?? "bottom",
      340,
      200,
    );
    setTooltipPos(pos);
  }, [targetRect, currentStep]);

  if (!isActive || !currentStep) return null;

  const isFirst = stepIndex === 0;
  const isLast = stepIndex === totalSteps - 1;

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          key="tour-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9997]"
        >
          <div className="absolute inset-0 bg-black/40" />

          <AnimatePresence mode="wait">
            {!currentStep.targetSelector ? (
              <motion.div
                key={`card-${stepIndex}`}
                initial={{ opacity: 0, y: 30, scale: 0.93 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
                className="absolute inset-0 flex items-center justify-center p-8"
              >
                <div className="relative max-w-lg w-full">
                  <div className="relative bg-white dark:bg-black rounded-3xl border border-orange-500/30 dark:border-orange-500/40 shadow-2xl dark:shadow-[0_0_40px_rgba(249,115,22,0.15)] overflow-hidden p-8 text-center">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent pointer-events-none" />

                    <div className="relative">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-orange-500 bg-orange-500/10 px-2.5 py-1 rounded-full border border-orange-500/20">
                        Step {stepIndex + 1} of {totalSteps}
                      </span>

                      <h2 className="text-2xl font-bold text-stone-900 dark:text-white mt-4 mb-3">
                        {currentStep.title}
                      </h2>
                      <p className="text-[14px] text-stone-600 dark:text-white/70 leading-relaxed mb-6 max-w-sm mx-auto">
                        {currentStep.description}
                      </p>

                      <div className="flex items-center justify-center gap-3">
                        {!isFirst && (
                          <button
                            onClick={prevStep}
                            className="px-4 py-2 rounded-xl bg-stone-100 dark:bg-white/10 hover:bg-stone-200 dark:hover:bg-white/20 text-stone-700 dark:text-white/80 hover:text-stone-900 dark:hover:text-white text-[12px] font-semibold transition-all active:scale-95"
                          >
                            Back
                          </button>
                        )}
                        <button
                          onClick={endTour}
                          className="px-4 py-2 rounded-xl text-stone-400 dark:text-white/50 hover:text-stone-600 dark:hover:text-white/80 text-[12px] font-semibold transition-all hover:bg-stone-100 dark:hover:bg-white/10 active:scale-95"
                        >
                          Skip
                        </button>
                        <button
                          onClick={nextStep}
                          className="px-6 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-[12px] font-semibold transition-all shadow-lg shadow-orange-500/30 active:scale-95"
                        >
                          {isLast ? "Got it!" : "Next"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={`tooltip-${stepIndex}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0"
              >
                <Spotlight
                  targetRect={targetRect}
                  padding={8}
                  borderRadius={16}
                />
                <div ref={tooltipRef}>
                  <TourTooltip
                    title={currentStep.title}
                    description={currentStep.description}
                    stepNumber={stepIndex + 1}
                    totalSteps={totalSteps}
                    position={tooltipPos}
                    placement={currentStep.tooltipPosition ?? "bottom"}
                    onNext={nextStep}
                    onPrev={prevStep}
                    onSkip={endTour}
                    isFirst={isFirst}
                    isLast={isLast}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
