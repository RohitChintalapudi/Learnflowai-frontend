import { motion, AnimatePresence } from "framer-motion";

interface SpotlightProps {
  targetRect: DOMRect | null;
  padding?: number;
  borderRadius?: number;
}

export function Spotlight({
  targetRect,
  padding = 8,
  borderRadius = 16,
}: SpotlightProps) {
  return (
    <AnimatePresence>
      {targetRect && (
        <motion.div
          key="spotlight"
          initial={{
            opacity: 0,
            scale: 0.95,
            x: targetRect.left - padding,
            y: targetRect.top - padding,
            width: targetRect.width + padding * 2,
            height: targetRect.height + padding * 2,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            x: targetRect.left - padding,
            y: targetRect.top - padding,
            width: targetRect.width + padding * 2,
            height: targetRect.height + padding * 2,
          }}
          exit={{
            opacity: 0,
            scale: 0.95,
            transition: { duration: 0.15 },
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            mass: 0.8,
          }}
          className="fixed z-[9998] pointer-events-none"
          style={{
            borderRadius,
            boxShadow: "0 0 0 9999px rgba(0,0,0,0.55)",
            WebkitBoxShadow: "0 0 0 9999px rgba(0,0,0,0.55)",
          }}
        />
      )}
      {targetRect && (
        <motion.div
          key="spotlight-ring"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{
            opacity: [0.6, 1, 0.6],
            scale: 1,
          }}
          transition={{
            opacity: { repeat: Infinity, duration: 2, ease: "easeInOut" },
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
          className="fixed z-[9999] pointer-events-none rounded-[20px] border-2 border-orange-400/60"
          style={{
            left: targetRect.left - padding - 4,
            top: targetRect.top - padding - 4,
            width: targetRect.width + padding * 2 + 8,
            height: targetRect.height + padding * 2 + 8,
          }}
        />
      )}
    </AnimatePresence>
  );
}
