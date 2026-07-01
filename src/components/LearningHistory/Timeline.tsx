import { TimelineDayGroup } from "./TimelineDayGroup";
import type { LearningHistoryItem } from "../../lib/api";
import { Loader2, ChevronDown } from "lucide-react";

interface TimelineProps {
  items: LearningHistoryItem[];
  onView: (item: LearningHistoryItem) => void;
  onDelete: (item: LearningHistoryItem) => void;
  onRegenerate: (item: LearningHistoryItem) => void;
  hasMore: boolean;
  onLoadMore: () => void;
  isLoadingMore: boolean;
}

const getDayLabel = (dateStr: string) => {
  try {
    const d = new Date(dateStr);
    const now = new Date();
    
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const itemDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    
    if (itemDate.getTime() === today.getTime()) {
      return "Today";
    }
    if (itemDate.getTime() === yesterday.getTime()) {
      return "Yesterday";
    }
    
    // Within 7 days: show day name
    const diffDays = Math.floor((today.getTime() - itemDate.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays >= 0 && diffDays < 7) {
      return d.toLocaleDateString([], { weekday: 'long' });
    }
    
    // Older
    return d.toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' });
  } catch (e) {
    return "Older Activities";
  }
};

export function Timeline({
  items,
  onView,
  onDelete,
  onRegenerate,
  hasMore,
  onLoadMore,
  isLoadingMore,
}: TimelineProps) {
  // Group items by date label
  const groups: Record<string, LearningHistoryItem[]> = {};
  items.forEach((item) => {
    const label = getDayLabel(item.createdAt);
    if (!groups[label]) {
      groups[label] = [];
    }
    groups[label].push(item);
  });

  return (
    <div className="relative pl-6 space-y-8">
      {/* Central vertical connector line */}
      <div className="absolute left-[11px] top-4 bottom-4 w-[2px] bg-gradient-to-b from-orange-500/20 via-orange-500/10 to-transparent pointer-events-none" />

      {/* Render Day Groups */}
      {Object.keys(groups).map((dayLabel) => (
        <TimelineDayGroup
          key={dayLabel}
          day={dayLabel}
          items={groups[dayLabel]}
          onView={onView}
          onDelete={onDelete}
          onRegenerate={onRegenerate}
        />
      ))}

      {/* Infinite Scroll / Load More trigger */}
      {hasMore && (
        <div className="flex justify-center pt-6">
          <button
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-[var(--lf-border)] bg-white/70 dark:bg-zinc-900/50 hover:bg-[var(--lf-surface)] text-xs font-semibold text-[var(--lf-text-secondary)] hover:text-[var(--lf-text-primary)] transition-all active:scale-[0.97] disabled:opacity-50"
          >
            {isLoadingMore ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Loading more...</span>
              </>
            ) : (
              <>
                <ChevronDown className="h-3.5 w-3.5" />
                <span>Load older generations</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
