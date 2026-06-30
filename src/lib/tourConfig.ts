export interface TourStep {
  id: string;
  route: string;
  targetSelector?: string;
  title: string;
  description: string;
  tooltipPosition?: "top" | "bottom" | "left" | "right";
  estimatedTime?: number;
}

export const tourSteps: TourStep[] = [
  {
    id: "welcome",
    route: "/dashboard",
    title: "Welcome to LearnFlow AI",
    description:
      "Your AI-powered learning companion for Computer Science. Let's take a quick tour to explore everything you can do.",
    tooltipPosition: "bottom",
    estimatedTime: 10,
  },
  {
    id: "sidebar",
    route: "/dashboard",
    targetSelector: "[data-tour='sidebar']",
    title: "Sidebar Navigation",
    description:
      "Access all major areas from here — Dashboard, Documents, AI Workspace, Notes, Quizzes, Analytics, and more.",
    tooltipPosition: "right",
    estimatedTime: 10,
  },
  {
    id: "dashboard",
    route: "/dashboard",
    targetSelector: "[data-tour='dashboard-heading']",
    title: "Dashboard Overview",
    description:
      "Your command center. View recent documents, quiz scores, quick stats, and jump back into your learning instantly.",
    tooltipPosition: "right",
    estimatedTime: 10,
  },
  {
    id: "documents",
    route: "/documents",
    targetSelector: "[data-tour='documents-heading']",
    title: "Your Document Library",
    description:
      "Upload PDFs and lecture notes. All your study materials are organized in one place, ready for AI-powered analysis.",
    tooltipPosition: "right",
    estimatedTime: 10,
  },
  {
    id: "workspace",
    route: "/workspace",
    title: "AI Workspace — Your Document is Open",
    description:
      "LearnFlow opens your document in a split-pane view. Highlight any text to access our full suite of AI tools — each designed to help you master any topic.",
    tooltipPosition: "bottom",
    estimatedTime: 15,
  },
  {
    id: "ai-features",
    route: "/workspace",
    title: "All AI Features at a Glance",
    description:
      "Explain concepts, generate study notes, create quizzes, prepare interview questions, visualize mind maps, explore analogies, and run simulations — all from within your document.",
    tooltipPosition: "bottom",
    estimatedTime: 15,
  },
  {
    id: "notes-library",
    route: "/notes",
    targetSelector: "[data-tour='notes-heading']",
    title: "Notes Library",
    description:
      "Browse all your AI-generated and manually created notes. Search, filter, and revisit key concepts anytime.",
    tooltipPosition: "right",
    estimatedTime: 10,
  },
  {
    id: "quiz-library",
    route: "/quizzes",
    targetSelector: "[data-tour='quizzes-heading']",
    title: "Quiz Library",
    description:
      "Review past quiz attempts, track scores, and identify weak topics. Practice makes perfect.",
    tooltipPosition: "right",
    estimatedTime: 10,
  },
  {
    id: "analytics",
    route: "/analytics",
    targetSelector: "[data-tour='analytics-heading']",
    title: "Analytics Dashboard",
    description:
      "Track your learning progress over time. See strengths, weaknesses, study streaks, and improvement trends.",
    tooltipPosition: "right",
    estimatedTime: 10,
  },
  {
    id: "learning-history",
    route: "/learning-history",
    targetSelector: "[data-tour='learning-history-heading']",
    title: "Learning Memory Engine",
    description:
      "Your personal AI study memory. Revisit, filter, search, copy, download, and regenerate every AI generation you build over time.",
    tooltipPosition: "right",
    estimatedTime: 10,
  },
  {
    id: "profile",
    route: "/dashboard",
    targetSelector: "[data-tour='profile-card']",
    title: "Your Profile",
    description:
      "Manage your profile, upload an avatar, and track your personal learning stats — documents, notes, quizzes, and more.",
    tooltipPosition: "right",
    estimatedTime: 10,
  },
  {
    id: "settings",
    route: "/dashboard",
    targetSelector: "[data-tour='settings-link']",
    title: "Settings",
    description:
      "Customize your experience. Toggle themes, adjust preferences, and access the 'Replay Tour' option anytime.",
    tooltipPosition: "right",
    estimatedTime: 10,
  },
  {
    id: "finish",
    route: "/documents",
    title: "You're All Set!",
    description:
      "Ready to start learning? Upload your first document and let AI transform the way you study Computer Science.",
    tooltipPosition: "bottom",
    estimatedTime: 10,
  },
];
