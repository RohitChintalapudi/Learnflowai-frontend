import React from "react";
import { Brain, StickyNote, HelpCircle, MessageSquare, GitFork, Lightbulb, Activity } from "lucide-react";

interface FeatureBadgeProps {
  type: string;
}

export function FeatureBadge({ type }: FeatureBadgeProps) {
  const badgeConfig: Record<string, { label: string; icon: React.ComponentType<any>; color: string }> = {
    Explanation: {
      label: "AI Explanation",
      icon: Brain,
      color: "bg-blue-500/10 text-blue-500 border-blue-500/20"
    },
    GeneratedNote: {
      label: "AI Notes",
      icon: StickyNote,
      color: "bg-green-500/10 text-green-500 border-green-500/20"
    },
    GeneratedQuiz: {
      label: "AI Quiz",
      icon: HelpCircle,
      color: "bg-orange-500/10 text-orange-500 border-orange-500/20"
    },
    QuizSet: {
      label: "AI Quiz Set",
      icon: HelpCircle,
      color: "bg-orange-500/10 text-orange-500 border-orange-500/20"
    },
    InterviewQuestionSet: {
      label: "AI Interview",
      icon: MessageSquare,
      color: "bg-purple-500/10 text-purple-500 border-purple-500/20"
    },
    GeneratedMindMap: {
      label: "AI Mind Map",
      icon: GitFork,
      color: "bg-pink-500/10 text-pink-500 border-pink-500/20"
    },
    GeneratedAnalogy: {
      label: "AI Analogy",
      icon: Lightbulb,
      color: "bg-teal-500/10 text-teal-500 border-teal-500/20"
    },
    GeneratedSimulation: {
      label: "AI Simulation",
      icon: Activity,
      color: "bg-red-500/10 text-red-500 border-red-500/20"
    }
  };

  const config = badgeConfig[type] || {
    label: "AI Generation",
    icon: Brain,
    color: "bg-gray-500/10 text-gray-500 border-gray-500/20"
  };

  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${config.color}`}>
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </div>
  );
}
