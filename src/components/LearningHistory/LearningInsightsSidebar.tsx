import { Flame, BookOpen, Star, Zap, Lightbulb, Loader2 } from "lucide-react";
import type { SuggestionItem } from "../../lib/api";

interface LearningInsightsSidebarProps {
  streak: number;
  mostStudiedTopic: string;
  favoriteFeature: string;
  lastActivity: string;
  suggestions: SuggestionItem[];
  isLoadingSuggestions: boolean;
}

export function LearningInsightsSidebar({
  streak,
  mostStudiedTopic,
  favoriteFeature,
  lastActivity,
  suggestions,
  isLoadingSuggestions,
}: LearningInsightsSidebarProps) {
  const statsList = [
    {
      label: "Learning Streak",
      value: `${streak} Day${streak === 1 ? "" : "s"}`,
      icon: Flame,
      color: "text-red-500 bg-red-500/10",
      desc: streak > 0 ? "Keep the momentum going!" : "Start a streak today!"
    },
    {
      label: "Most Studied",
      value: mostStudiedTopic || "None yet",
      icon: BookOpen,
      color: "text-blue-500 bg-blue-500/10",
      desc: "Top curriculum topic"
    },
    {
      label: "Favorite Feature",
      value: favoriteFeature || "None yet",
      icon: Star,
      color: "text-orange-500 bg-orange-500/10",
      desc: "Most used generator"
    },
    {
      label: "Last Activity",
      value: lastActivity || "None yet",
      icon: Zap,
      color: "text-purple-500 bg-purple-500/10",
      desc: "Recent generation event"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Premium Statistics Card */}
      <div className="bg-white/60 dark:bg-zinc-900/40 border border-[var(--lf-border)] rounded-3xl p-6 backdrop-blur-md space-y-6">
        <div className="flex items-center gap-2 border-b pb-4">
          <Flame className="h-5 w-5 text-orange-500" />
          <h3 className="text-base font-extrabold text-[var(--lf-text-primary)]">AI Learning Insights</h3>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {statsList.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className="flex items-start gap-3.5 p-3 rounded-2xl hover:bg-[var(--lf-surface)] transition-colors duration-200"
              >
                <div className={`p-2.5 rounded-xl shrink-0 ${stat.color}`}>
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--lf-text-secondary)] block">
                    {stat.label}
                  </span>
                  <span className="text-sm font-extrabold text-[var(--lf-text-primary)] truncate block leading-snug">
                    {stat.value}
                  </span>
                  <span className="text-[10px] text-[var(--lf-text-secondary)] block">
                    {stat.desc}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Personalized AI suggestions */}
      <div className="bg-white/60 dark:bg-zinc-900/40 border border-[var(--lf-border)] rounded-3xl p-6 backdrop-blur-md space-y-4">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-4.5 w-4.5 text-amber-500" />
          <h3 className="text-sm font-extrabold text-[var(--lf-text-primary)]">AI Recommendations</h3>
        </div>
        
        {isLoadingSuggestions ? (
          <div className="flex flex-col items-center justify-center py-6 text-[var(--lf-text-secondary)] gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-orange-500" />
            <span className="text-xs">Analyzing learning memory...</span>
          </div>
        ) : suggestions.length === 0 ? (
          <p className="text-xs text-[var(--lf-text-secondary)] leading-relaxed">
            AI recommendations will appear here as you generate explanations, study guides, and test sets.
          </p>
        ) : (
          <div className="space-y-3.5">
            {suggestions.map((suggestion, idx) => {
              const priorityColors = {
                High: "bg-rose-500/10 text-rose-500 border-rose-500/20 dark:bg-rose-500/20",
                Medium: "bg-amber-500/10 text-amber-500 border-amber-500/20 dark:bg-amber-500/20",
                Low: "bg-gray-500/10 text-gray-500 border-gray-500/20 dark:bg-zinc-800/40",
              };
              const badgeColor = priorityColors[suggestion.priority] || priorityColors.Low;

              return (
                <div
                  key={idx}
                  className="relative bg-[var(--lf-surface)] border border-[var(--lf-border)] rounded-xl p-3.5 text-xs text-[var(--lf-text-secondary)] leading-relaxed hover:border-orange-500/30 transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-extrabold text-[var(--lf-text-primary)] text-sm">
                      {suggestion.topic}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold border uppercase shrink-0 ${badgeColor}`}>
                      {suggestion.priority}
                    </span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-[var(--lf-text-secondary)]">
                    {suggestion.reason}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
