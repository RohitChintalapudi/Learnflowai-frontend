import { Brain, Upload, Sparkles } from "lucide-react";

interface HistoryEmptyStateProps {
  onGenerateExplanation: () => void;
  onUploadDocument: () => void;
}

export function HistoryEmptyState({ onGenerateExplanation, onUploadDocument }: HistoryEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-white/60 dark:bg-zinc-900/40 border border-[var(--lf-border)] rounded-3xl backdrop-blur-md min-h-[380px] max-w-xl mx-auto space-y-6 relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-to-tr from-orange-500/20 to-transparent blur-[70px] rounded-full pointer-events-none" />

      <div className="w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center relative z-10">
        <Sparkles className="h-7 w-7 text-orange-500" />
      </div>

      <div className="space-y-2 relative z-10 max-w-md">
        <h3 className="text-lg font-extrabold text-[var(--lf-text-primary)]">
          No AI generations yet.
        </h3>
        <p className="text-xs text-[var(--lf-text-secondary)] leading-relaxed">
          Generate your first AI explanation, quiz or notes to start building your learning history. It acts as the permanent database for all your custom curriculum resources.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-3 pt-2 relative z-10">
        <button
          onClick={onGenerateExplanation}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold shadow-lg shadow-orange-500/20 transition-all active:scale-[0.98]"
        >
          <Brain className="h-4 w-4" />
          <span>Generate Explanation</span>
        </button>
        <button
          onClick={onUploadDocument}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[var(--lf-border)] bg-[var(--lf-surface)] hover:bg-[var(--lf-bg)] text-[var(--lf-text-primary)] text-xs font-semibold transition-all active:scale-[0.98]"
        >
          <Upload className="h-4 w-4 text-[var(--lf-text-secondary)]" />
          <span>Upload Document</span>
        </button>
      </div>
    </div>
  );
}
