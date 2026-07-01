import { SlidersHorizontal } from "lucide-react";

interface HistoryFiltersProps {
  feature: string;
  onChangeFeature: (feature: string) => void;
}

const features = [
  { id: "All", label: "All Space", color: "bg-gray-500" },
  { id: "Explanation", label: "🧠 Explanations", color: "bg-blue-500" },
  { id: "Notes", label: "📄 Notes", color: "bg-green-500" },
  { id: "Quiz", label: "❓ Quizzes", color: "bg-orange-500" },
  { id: "Interview", label: "💬 Interview Questions", color: "bg-purple-500" },
  { id: "Mind Map", label: "🗺️ Mind Maps", color: "bg-pink-500" },
  { id: "Analogy", label: "💡 Analogies", color: "bg-teal-500" },
  { id: "Simulation", label: "🕹️ Simulations", color: "bg-red-500" },
];

export function HistoryFilters({ feature, onChangeFeature }: HistoryFiltersProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1.5 no-scrollbar w-full">
      <div className="flex items-center gap-1.5 shrink-0 pr-3 border-r border-[var(--lf-border)] text-xs font-semibold text-[var(--lf-text-secondary)]">
        <SlidersHorizontal className="h-3.5 w-3.5" />
        <span>Filter</span>
      </div>

      <div className="flex gap-2 shrink-0">
        {features.map((f) => {
          const active = feature === f.id;
          return (
            <button
              key={f.id}
              onClick={() => onChangeFeature(f.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-300 ${
                active
                  ? "bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/25 scale-105"
                  : "bg-white/60 dark:bg-zinc-900/40 hover:bg-[var(--lf-surface)] text-[var(--lf-text-secondary)] hover:text-[var(--lf-text-primary)] border-[var(--lf-border)]"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-white" : f.color}`} />
              {f.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
