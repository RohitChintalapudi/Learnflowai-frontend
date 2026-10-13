"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface HoldToConfirmButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onConfirm"> {
  onConfirm?: () => void;
  duration?: number; // Duration in ms to hold (default: 1500)
  label?: string; // Default idle label
  holdingLabel?: string; // Label while holding
  confirmedLabel?: string; // Label once confirmed
  icon?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  resetDelay?: number; // ms before resetting to idle (0 keeps confirmed)
  disabled?: boolean;
  className?: string;
  variant?: "danger" | "default" | "outline";
}

export function HoldToConfirmButton({
  onConfirm,
  duration = 1500,
  label = "Hold to delete",
  holdingLabel,
  confirmedLabel = "Deleted",
  icon,
  size = "md",
  resetDelay = 1500,
  disabled = false,
  className,
  variant = "danger",
  ...props
}: HoldToConfirmButtonProps) {
  const [progress, setProgress] = useState(0); // 0 to 1
  const [isHolding, setIsHolding] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cleanupRaf = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const handleComplete = useCallback(() => {
    cleanupRaf();
    setIsHolding(false);
    setIsConfirmed(true);
    setProgress(1);

    if (onConfirm) {
      onConfirm();
    }

    if (resetDelay > 0) {
      resetTimerRef.current = setTimeout(() => {
        setIsConfirmed(false);
        setProgress(0);
      }, resetDelay);
    }
  }, [cleanupRaf, onConfirm, resetDelay]);

  const startHold = useCallback(() => {
    if (disabled || isConfirmed) return;

    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
      resetTimerRef.current = null;
    }

    setIsHolding(true);
    startTimeRef.current = performance.now();

    const tick = (now: number) => {
      if (!startTimeRef.current) return;
      const elapsed = now - startTimeRef.current;
      const currentProgress = Math.min(1, elapsed / duration);
      setProgress(currentProgress);

      if (currentProgress >= 1) {
        handleComplete();
      } else {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  }, [disabled, isConfirmed, duration, handleComplete]);

  const cancelHold = useCallback(() => {
    if (isConfirmed) return;
    cleanupRaf();
    setIsHolding(false);
    startTimeRef.current = null;
    setProgress(0);
  }, [isConfirmed, cleanupRaf]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      cleanupRaf();
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, [cleanupRaf]);

  // Sizing styles
  const sizeClasses = {
    sm: "h-8 px-3 text-xs gap-1.5 rounded-xl",
    md: "h-10 px-4 text-sm gap-2 rounded-xl",
    lg: "h-12 px-6 text-base gap-2.5 rounded-2xl",
  }[size];

  const ringDimensions = {
    sm: { size: 16, stroke: 2, radius: 6 },
    md: { size: 18, stroke: 2.5, radius: 7 },
    lg: { size: 22, stroke: 3, radius: 8 },
  }[size];

  const circumference = 2 * Math.PI * ringDimensions.radius;
  const strokeDashoffset = circumference * (1 - progress);

  // Variant styles
  const variantClasses = {
    danger: isConfirmed
      ? "bg-emerald-600 text-white shadow-emerald-600/30"
      : "bg-red-600 hover:bg-red-700 text-white shadow-red-600/25",
    default: isConfirmed
      ? "bg-emerald-600 text-white shadow-emerald-600/30"
      : "bg-zinc-900 hover:bg-black text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-900",
    outline: isConfirmed
      ? "border-emerald-600 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20"
      : "border border-red-300 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20",
  }[variant];

  const displayLabel = isConfirmed
    ? confirmedLabel
    : isHolding
    ? holdingLabel || label
    : label;

  return (
    <motion.button
      type="button"
      disabled={disabled}
      onPointerDown={startHold}
      onPointerUp={cancelHold}
      onPointerLeave={cancelHold}
      onPointerCancel={cancelHold}
      onContextMenu={(e) => e.preventDefault()}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          if (!isHolding) startHold();
        }
      }}
      onKeyUp={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          cancelHold();
        }
      }}
      animate={{
        scale: isHolding ? 0.97 : 1,
      }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className={cn(
        "relative overflow-hidden select-none font-semibold transition-colors duration-200 inline-flex items-center justify-center shadow-lg active:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none cursor-pointer",
        sizeClasses,
        variantClasses,
        className,
      )}
      aria-label={displayLabel}
      {...(props as any)}
    >
      {/* Background sweep progress bar */}
      <div
        className={cn(
          "absolute inset-y-0 left-0 pointer-events-none transition-[width] ease-linear",
          isConfirmed
            ? "bg-emerald-500/20"
            : variant === "danger"
            ? "bg-black/25 dark:bg-white/20"
            : "bg-orange-500/20"
        )}
        style={{
          width: `${progress * 100}%`,
          transitionDuration: isHolding ? "50ms" : "150ms",
        }}
      />

      {/* Progress Ring Icon or Check Icon */}
      <span className="relative z-10 shrink-0 flex items-center justify-center">
        <AnimatePresence mode="wait" initial={false}>
          {isConfirmed ? (
            <motion.span
              key="confirmed"
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="inline-flex items-center justify-center"
            >
              <Check className={size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4"} />
            </motion.span>
          ) : (
            <div
              className="relative inline-flex items-center justify-center"
              style={{
                width: ringDimensions.size,
                height: ringDimensions.size,
              }}
            >
              {/* Circular SVG Ring */}
              <svg
                className="absolute inset-0 -rotate-90 transform"
                width={ringDimensions.size}
                height={ringDimensions.size}
                viewBox={`0 0 ${ringDimensions.size} ${ringDimensions.size}`}
              >
                {/* Background Ring Track */}
                <circle
                  cx={ringDimensions.size / 2}
                  cy={ringDimensions.size / 2}
                  r={ringDimensions.radius}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={ringDimensions.stroke}
                  className="opacity-25"
                />
                {/* Foreground Animated Progress Arc */}
                <circle
                  cx={ringDimensions.size / 2}
                  cy={ringDimensions.size / 2}
                  r={ringDimensions.radius}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={ringDimensions.stroke}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className={cn(
                    "transition-[stroke-dashoffset] duration-75",
                    isHolding ? "opacity-100" : "opacity-0"
                  )}
                />
              </svg>

              {/* Center icon when not holding / idle */}
              <span className={cn("transition-transform duration-150", isHolding && "scale-90")}>
                {icon || <Trash2 className={size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"} />}
              </span>
            </div>
          )}
        </AnimatePresence>
      </span>

      {/* Button Text */}
      <span className="relative z-10 truncate whitespace-nowrap">
        {displayLabel}
      </span>
    </motion.button>
  );
}

export default HoldToConfirmButton;
