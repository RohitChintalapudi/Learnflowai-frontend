import { TimelineCard } from "./TimelineCard";
import type { LearningHistoryItem } from "../../lib/api";

interface TimelineDayGroupProps {
  day: string;
  items: LearningHistoryItem[];
  onView: (item: LearningHistoryItem) => void;
  onDelete: (item: LearningHistoryItem) => void;
  onRegenerate: (item: LearningHistoryItem) => void;
}

export function TimelineDayGroup({ day, items, onView, onDelete, onRegenerate }: TimelineDayGroupProps) {
  return (
    <div className="space-y-4">
      {/* Date Header Indicator */}
      <div className="sticky top-16 z-10 bg-[var(--lf-bg)] py-2 flex items-center gap-3">
        <span className="text-sm font-extrabold tracking-tight text-[var(--lf-text-primary)]">
          {day}
        </span>
        <div className="flex-1 h-[1px] bg-[var(--lf-border)]" />
        <span className="text-[11px] font-semibold text-[var(--lf-text-secondary)] px-2 bg-[var(--lf-surface)] border border-[var(--lf-border)] rounded-md">
          {items.length} {items.length === 1 ? "activity" : "activities"}
        </span>
      </div>

      {/* Cards List in this group */}
      <div className="space-y-6">
        {items.map((item) => (
          <TimelineCard
            key={item.id}
            item={item}
            onView={onView}
            onDelete={onDelete}
            onRegenerate={onRegenerate}
          />
        ))}
      </div>
    </div>
  );
}
