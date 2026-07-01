import { FeatureBadge } from "./FeatureBadge";
import type { LearningHistoryItem } from "../../lib/api";
import { Eye, RotateCw, Trash2, Calendar, FileText } from "lucide-react";
import { motion } from "framer-motion";

interface TimelineCardProps {
  item: LearningHistoryItem;
  onView: (item: LearningHistoryItem) => void;
  onDelete: (item: LearningHistoryItem) => void;
  onRegenerate: (item: LearningHistoryItem) => void;
}

const colorMap: Record<string, { border: string; glow: string; text: string; bg: string }> = {
  Explanation: {
    border: "border-l-blue-500",
    glow: "shadow-blue-500/5",
    text: "text-blue-500",
    bg: "bg-blue-500/10"
  },
  GeneratedNote: {
    border: "border-l-green-500",
    glow: "shadow-green-500/5",
    text: "text-green-500",
    bg: "bg-green-500/10"
  },
  GeneratedQuiz: {
    border: "border-l-orange-500",
    glow: "shadow-orange-500/5",
    text: "text-orange-500",
    bg: "bg-orange-500/10"
  },
  QuizSet: {
    border: "border-l-orange-500",
    glow: "shadow-orange-500/5",
    text: "text-orange-500",
    bg: "bg-orange-500/10"
  },
  InterviewQuestionSet: {
    border: "border-l-purple-500",
    glow: "shadow-purple-500/5",
    text: "text-purple-500",
    bg: "bg-purple-500/10"
  },
  GeneratedMindMap: {
    border: "border-l-pink-500",
    glow: "shadow-pink-500/5",
    text: "text-pink-500",
    bg: "bg-pink-500/10"
  },
  GeneratedAnalogy: {
    border: "border-l-teal-500",
    glow: "shadow-teal-500/5",
    text: "text-teal-500",
    bg: "bg-teal-500/10"
  },
  GeneratedSimulation: {
    border: "border-l-red-500",
    glow: "shadow-red-500/5",
    text: "text-red-500",
    bg: "bg-red-500/10"
  }
};

export function TimelineCard({ item, onView, onDelete, onRegenerate }: TimelineCardProps) {
  const colors = colorMap[item.activityType] || {
    border: "border-l-gray-400",
    glow: "shadow-gray-400/5",
    text: "text-gray-500",
    bg: "bg-gray-500/10"
  };

  const getPreviewText = (item: LearningHistoryItem) => {
    if (item.activityType === "Explanation") {
      return item.explanationText || "";
    }
    if (item.activityType === "GeneratedNote") {
      if (typeof item.notes === "string") return item.notes;
      return item.notes?.summary || item.notes?.title || "";
    }
    if (item.activityType === "QuizSet") {
      return `Interactive quiz on "${item.highlightedText || "selected topic"}" with score ${item.score || 0}/${item.totalQuestions || 5}.`;
    }
    if (item.activityType === "GeneratedQuiz") {
      return `AI quiz generated on topic: ${item.title || item.highlightedText}`;
    }
    if (item.activityType === "InterviewQuestionSet") {
      return `Interview practice questions generated for: ${item.highlightedText}`;
    }
    if (item.activityType === "GeneratedMindMap") {
      return `Interactive mind map structure generated for: ${item.highlightedText}`;
    }
    if (item.activityType === "GeneratedAnalogy") {
      if (typeof item.analogyData === "string") return item.analogyData;
      return item.analogyData?.analogy || item.analogyData?.explanation || "";
    }
    if (item.activityType === "GeneratedSimulation") {
      if (typeof item.simulationData === "string") return item.simulationData;
      return item.simulationData?.overview || item.simulationData?.summary || "";
    }
    return "";
  };

  const getTags = (item: LearningHistoryItem) => {
    const tags: string[] = [];
    if (item.activityType === "Explanation") {
      tags.push("Explanation");
    } else if (item.activityType === "GeneratedNote") {
      tags.push("Notes", "Study Guide");
    } else if (item.activityType === "QuizSet" || item.activityType === "GeneratedQuiz") {
      tags.push("Quiz", `Score: ${item.score || 0}/${item.totalQuestions || 5}`);
      if (item.topicsToImprove && Array.isArray(item.topicsToImprove)) {
        tags.push(...item.topicsToImprove.slice(0, 1));
      }
    } else if (item.activityType === "InterviewQuestionSet") {
      tags.push("InterviewPrep", "Q&A");
    } else if (item.activityType === "GeneratedMindMap") {
      tags.push("Visual Flow", "MindMap");
    } else if (item.activityType === "GeneratedAnalogy") {
      tags.push("Analogy", item.style || "Concept");
    } else if (item.activityType === "GeneratedSimulation") {
      tags.push(item.simulationType || "Simulation", item.difficulty || "Interactive");
    }
    return Array.from(new Set(tags)).filter(Boolean).slice(0, 3);
  };

  // Format time
  const formatTime = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return "";
    }
  };

  const preview = getPreviewText(item);
  const tags = getTags(item);

  return (
    <motion.div
      layout
      whileHover={{ y: -4, scale: 1.01 }}
      className={`group relative bg-white/70 dark:bg-zinc-900/40 border border-[var(--lf-border)] border-l-4 ${colors.border} rounded-2xl p-6 backdrop-blur-md shadow-sm transition-all duration-300 ${colors.glow} hover:shadow-lg`}
    >
      {/* Timeline Bullet indicator (matches color code) */}
      <div className={`absolute -left-[31px] top-6 w-3 h-3 rounded-full border-2 border-white dark:border-zinc-950 ${colors.bg} flex items-center justify-center`}>
        <div className={`w-1.5 h-1.5 rounded-full bg-current ${colors.text}`} />
      </div>

      <div className="flex flex-col gap-3">
        {/* Card Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <FeatureBadge type={item.activityType} />
          
          <div className="flex items-center gap-1.5 text-xs text-[var(--lf-text-secondary)] font-medium">
            <Calendar className="h-3.5 w-3.5" />
            <span>{formatTime(item.createdAt)}</span>
          </div>
        </div>

        {/* Content Info */}
        <div className="space-y-1">
          {item.document?.title && (
            <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wide uppercase text-orange-500/90">
              <FileText className="h-3 w-3 shrink-0" />
              <span className="truncate max-w-[280px]">{item.document.title}</span>
            </div>
          )}
          
          <h4 className="text-base font-extrabold tracking-tight text-[var(--lf-text-primary)] leading-snug">
            {item.title || item.highlightedText?.substring(0, 60) + (item.highlightedText?.length > 60 ? "..." : "") || "AI Assistant Generation"}
          </h4>
        </div>

        {/* Topic details or quote */}
        {item.highlightedText && (
          <div className="text-xs text-[var(--lf-text-secondary)] italic border-l-2 border-orange-500/20 pl-2 py-0.5 truncate">
            Topic: "{item.highlightedText}"
          </div>
        )}

        {/* Short Text Preview */}
        {preview && (
          <p className="text-sm text-[var(--lf-text-secondary)] leading-relaxed line-clamp-2 pr-2">
            {preview}
          </p>
        )}

        {/* Footer Actions and Tags */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-[var(--lf-border)] mt-1">
          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center text-[10px] font-semibold bg-gray-100 dark:bg-zinc-800/60 text-[var(--lf-text-secondary)] px-2 py-0.5 rounded-md"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onView(item)}
              title="View Details"
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-orange-500/10 hover:bg-orange-500 text-orange-500 hover:text-white transition-all duration-200"
            >
              <Eye className="h-3.5 w-3.5" />
              <span>View</span>
            </button>
            <button
              onClick={() => onRegenerate(item)}
              title="Regenerate Content"
              className="p-1.5 rounded-lg text-xs text-[var(--lf-text-secondary)] hover:text-[var(--lf-text-primary)] hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <RotateCw className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => onDelete(item)}
              title="Delete Activity"
              className="p-1.5 rounded-lg text-xs text-red-500 hover:bg-red-500/10 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
