import { FileText, Brain, StickyNote, HelpCircle, GitFork, Lightbulb, Activity } from "lucide-react";

interface HistoryStatsProps {
  stats: {
    documentsCount: number;
    generationsCount: number;
    notesCount: number;
    quizzesCount: number;
    mindMapsCount: number;
    analogiesCount: number;
    simulationsCount: number;
  };
}

export function HistoryStats({ stats }: HistoryStatsProps) {
  const statItems = [
    {
      label: "Documents Studied",
      value: stats.documentsCount,
      icon: FileText,
      color: "from-blue-500/10 to-blue-500/5 text-blue-500 dark:text-blue-400 border-blue-500/20"
    },
    {
      label: "AI Generations",
      value: stats.generationsCount,
      icon: Brain,
      color: "from-amber-500/10 to-amber-500/5 text-amber-500 dark:text-amber-400 border-amber-500/20"
    },
    {
      label: "Notes",
      value: stats.notesCount,
      icon: StickyNote,
      color: "from-green-500/10 to-green-500/5 text-green-500 dark:text-green-400 border-green-500/20"
    },
    {
      label: "Quizzes",
      value: stats.quizzesCount,
      icon: HelpCircle,
      color: "from-orange-500/10 to-orange-500/5 text-orange-500 dark:text-orange-400 border-orange-500/20"
    },
    {
      label: "Mind Maps",
      value: stats.mindMapsCount,
      icon: GitFork,
      color: "from-pink-500/10 to-pink-500/5 text-pink-500 dark:text-pink-400 border-pink-500/20"
    },
    {
      label: "Analogies",
      value: stats.analogiesCount,
      icon: Lightbulb,
      color: "from-teal-500/10 to-teal-500/5 text-teal-500 dark:text-teal-400 border-teal-500/20"
    },
    {
      label: "Simulations",
      value: stats.simulationsCount,
      icon: Activity,
      color: "from-red-500/10 to-red-500/5 text-red-500 dark:text-red-400 border-red-500/20"
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
      {statItems.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className={`relative overflow-hidden rounded-2xl border p-4 bg-gradient-to-br ${item.color} backdrop-blur-md transition-all duration-300 hover:scale-[1.03] hover:shadow-md`}
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider opacity-85 text-[var(--lf-text-secondary)]">
                {item.label}
              </span>
              <Icon className="h-4 w-4 opacity-80" />
            </div>
            <div className="text-2xl font-black tracking-tight text-[var(--lf-text-primary)]">
              {item.value}
            </div>
          </div>
        );
      })}
    </div>
  );
}
