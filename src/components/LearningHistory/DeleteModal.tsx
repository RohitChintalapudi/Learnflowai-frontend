import { Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
}

export function DeleteModal({ isOpen, onClose, onConfirm, title }: DeleteModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="relative bg-white dark:bg-[#111] rounded-2xl border border-red-500/20 shadow-2xl p-6 w-[340px] max-w-[90vw] overflow-hidden"
          >
            {/* Ambient Glows */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-bl from-red-500/20 to-transparent blur-3xl rounded-full pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-gradient-to-tr from-red-500/15 to-transparent blur-3xl rounded-full pointer-events-none" />

            <div className="text-center relative z-10">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
                <Trash2 className="h-5 w-5 text-red-500" />
              </div>
              <h3 className="text-base font-extrabold text-[var(--lf-text-primary)] mb-2">
                Delete Generation
              </h3>
              <p className="text-xs text-[var(--lf-text-secondary)] mb-6 leading-relaxed">
                Are you sure you want to delete <span className="font-semibold text-[var(--lf-text-primary)]">"{title}"</span>? This will permanently remove it from your learning history.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl border border-[var(--lf-border)] bg-[var(--lf-surface)] text-xs font-semibold text-[var(--lf-text-primary)] hover:bg-[var(--lf-bg)] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-semibold shadow-lg shadow-red-500/25 transition-all active:scale-[0.98]"
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
