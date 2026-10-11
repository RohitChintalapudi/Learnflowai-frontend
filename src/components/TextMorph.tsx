"use client";

import { type ReactNode, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { cn } from "@/lib/utils";

export type TextMorphProps = {
  words?: string[];
  interval?: number;
  className?: string;
  charClassName?: string;
  prefix?: ReactNode;
};

const defaultWords = ["engineer", "designer"];

export function TextMorph({
  words = defaultWords,
  interval = 2500,
  className,
  charClassName,
  prefix = "20 •",
}: TextMorphProps) {
  const [index, setIndex] = useState(0);

  const wordsKey = words.join("\0");

  useEffect(() => {
    if (words.length <= 1) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, interval);

    return () => clearInterval(timer);
  }, [wordsKey, words.length, interval]);

  const currentWord = words[index % words.length] ?? "";
  const chars = useMemo(() => {
    return Array.from(currentWord);
  }, [currentWord]);

  if (!words.length) return null;

  return (
    <span className={cn("inline-flex items-center gap-1.5 shrink-0 whitespace-nowrap", className)}>
      {prefix !== null && prefix !== undefined && prefix !== "" ? (
        <span>{prefix}</span>
      ) : null}
      <AnimatePresence mode="popLayout">
        <motion.span
          key={`${index}-${currentWord}`}
          className="flex flex-nowrap shrink-0 whitespace-nowrap gap-[0.5px] overflow-hidden py-0.5"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.35 }}
        >
          {chars.map((char, i) => (
            <motion.span
              key={i}
              className={cn("inline-block shrink-0", charClassName)}
              initial={{ opacity: 0, y: 5, filter: "blur(5px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -5, filter: "blur(5px)" }}
              transition={{
                delay: i * 0.025,
                duration: 0.28,
              }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default TextMorph;
