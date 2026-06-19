import React, { useState, useEffect, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { DashboardLayout } from "../../components/DashboardLayout";
import {
  Search,
  BookOpen,
  HelpCircle,
  FileQuestion,
  Trash2,
  Clock,
  X,
  CheckCircle2,
  AlertCircle,
  Award,
  Target,
  Brain,
  Star
} from "lucide-react";
import { QuizDashboardAPI } from "../../lib/api";
import toast from "react-hot-toast";

export const Route = createFileRoute("/_public/quizzes")({
  component: QuizDashboardPage,
});

interface QuizStats {
  totalQuizzes: number;
  thisWeek: number;
  thisMonth: number;
  averageScore?: number;
  totalQuestionsAnswered?: number;
  totalCorrect?: number;
}

interface QuizData {
  mcqs?: Array<{ question: string; options: string[]; answer: string; correctAnswer?: string }>;
  trueFalse?: Array<{ question: string; answer: boolean }>;
  shortAnswer?: Array<{ question: string; answer: string }>;
}

interface GeneratedQuiz {
  id: string;
  title: string;
  highlightedText: string;
  quizData: QuizData;
  totalQuestions: number;
  createdAt: string;
  score?: number;
  totalQuestionsSubmitted?: number;
  topicsToImprove?: string[];
}

// Custom hook for debouncing
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

function QuizDashboardPage() {
  const [stats, setStats] = useState<QuizStats | null>(null);
  const [quizzes, setQuizzes] = useState<GeneratedQuiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isStatsLoading, setIsStatsLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 400);

  const [selectedQuiz, setSelectedQuiz] = useState<GeneratedQuiz | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchQuizzes(debouncedSearch);
  }, [debouncedSearch]);

  const fetchStats = async () => {
    setIsStatsLoading(true);
    try {
      const res = await QuizDashboardAPI.getStats();
      if (res.success) {
        setStats({
          totalQuizzes: res.totalQuizzes,
          thisWeek: res.thisWeek,
          thisMonth: res.thisMonth,
        });
      }
    } catch (err: any) {
      console.error("Failed to fetch stats", err);
    } finally {
      setIsStatsLoading(false);
    }
  };

  const fetchQuizzes = async (search: string) => {
    setIsLoading(true);
    try {
      const res = await QuizDashboardAPI.getQuizzes(1, 20, search);
      if (res.success && res.quizzes) {
        setQuizzes(res.quizzes);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to load quizzes");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, quizId: string) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this quiz?")) return;
    
    setIsDeleting(quizId);
    try {
      // Optimistic update
      setQuizzes(prev => prev.filter(q => q.id !== quizId));
      
      const res = await QuizDashboardAPI.deleteQuiz(quizId);
      if (res.success) {
        toast.success("Quiz deleted successfully");
        fetchStats(); // refresh stats
      } else {
        throw new Error("Failed to delete");
      }
    } catch (err: any) {
      toast.error("Failed to delete quiz");
      fetchQuizzes(debouncedSearch); // revert
    } finally {
      setIsDeleting(null);
    }
  };

  const openQuizDetails = async (quiz: GeneratedQuiz) => {
    setSelectedQuiz(quiz);
    try {
      const res = await QuizDashboardAPI.getSingleQuiz(quiz.id);
      if (res.success && res.quiz) {
        setSelectedQuiz(res.quiz);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const closeDetails = () => setSelectedQuiz(null);

  // Compute analytics from quizzes
  const analytics = useMemo(() => {
    const submitted = quizzes.filter(q => q.score !== undefined && q.totalQuestionsSubmitted !== undefined);
    const totalCorrect = submitted.reduce((sum, q) => sum + (q.score || 0), 0);
    const totalAnswered = submitted.reduce((sum, q) => sum + (q.totalQuestionsSubmitted || 0), 0);
    const avgScore = submitted.length > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

    // Collect topics from quizzes with score below 5, grouped by topic with lowest score
    const topicData: Record<string, { count: number; lowestScore: number }> = {};
    quizzes.forEach(q => {
      const quizScore = q.score;
      if (quizScore !== undefined && quizScore < 5) {
        (q.topicsToImprove || []).forEach(t => {
          if (!topicData[t]) topicData[t] = { count: 0, lowestScore: Infinity };
          topicData[t].count++;
          topicData[t].lowestScore = Math.min(topicData[t].lowestScore, quizScore);
        });
      }
    });
    const sortedTopics = Object.entries(topicData).sort((a, b) => {
      if (a[1].lowestScore !== b[1].lowestScore) return a[1].lowestScore - b[1].lowestScore;
      return b[1].count - a[1].count;
    }).map(([topic, data]) => [topic, data.count] as [string, number]);
    const weakestTopic = sortedTopics.length > 0 ? sortedTopics[0][0] : null;

    return { avgScore, totalCorrect, totalAnswered, submittedCount: submitted.length, topics: sortedTopics, weakestTopic };
  }, [quizzes]);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  // Score color helper
  const scoreColor = (score: number, total: number) => {
    const pct = (score / total) * 100;
    if (pct >= 80) return "text-emerald-500";
    if (pct >= 60) return "text-amber-500";
    return "text-red-500";
  };
  const scoreBgColor = (score: number, total: number) => {
    const pct = (score / total) * 100;
    if (pct >= 80) return "bg-emerald-500/10 border-emerald-500/20";
    if (pct >= 60) return "bg-amber-500/10 border-amber-500/20";
    return "bg-red-500/10 border-red-500/20";
  };

  return (
    <DashboardLayout headerTitle={
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-bold">Quiz Dashboard</h2>
      </div>
    }>
      <div className="flex-1 overflow-y-auto p-8 relative no-scrollbar">
        <motion.div 
          variants={containerVariants} 
          initial="hidden" 
          animate="show" 
          className="max-w-[1400px] mx-auto pb-12"
        >
          {/* Header Description */}
          <motion.div variants={itemVariants} className="space-y-2 mb-8">
            <p className="text-[15px] text-[var(--lf-text-secondary)]">Track and revisit your generated AI quizzes to identify areas for improvement.</p>
          </motion.div>

          {/* Main layout: content left + topics sidebar right */}
          <div className="flex gap-8">

          {/* Left column — stats + search + quiz grid */}
          <div className="flex-1 min-w-0 space-y-8">

          {/* Analytics + Stats Section */}
          {isStatsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-28 bg-[var(--lf-card)] border border-[var(--lf-border)] rounded-2xl animate-pulse card-shadow" />
              ))}
            </div>
          ) : (
            <motion.div 
              variants={containerVariants} 
              initial="hidden" 
              animate="show" 
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              {/* Total Quizzes */}
              <motion.div 
                variants={itemVariants}
                className="bg-[var(--lf-card)] border border-[var(--lf-border)] card-shadow rounded-2xl p-6 hover:-translate-y-1 hover:border-orange-500/30 transition-all duration-300 group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/8 blur-[40px] rounded-full pointer-events-none" />
                <div className="flex items-center justify-between relative z-10">
                  <div>
                    <p className="text-[13px] font-bold text-[var(--lf-text-secondary)] uppercase tracking-wider mb-1">Total Quizzes</p>
                    <p className="text-3xl font-black text-[var(--lf-text-primary)]">{stats?.totalQuizzes || 0}</p>
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <BookOpen className="h-5 w-5 text-orange-500" />
                  </div>
                </div>
              </motion.div>

              {/* Average Score */}
              <motion.div 
                variants={itemVariants}
                className="bg-[var(--lf-card)] border border-[var(--lf-border)] card-shadow rounded-2xl p-6 hover:-translate-y-1 hover:border-orange-500/30 transition-all duration-300 group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/8 blur-[40px] rounded-full pointer-events-none" />
                <div className="flex items-center justify-between relative z-10">
                  <div>
                    <p className="text-[13px] font-bold text-[var(--lf-text-secondary)] uppercase tracking-wider mb-1">Avg Score</p>
                    <div className="flex items-baseline gap-1.5">
                      <p className="text-3xl font-black text-[var(--lf-text-primary)]">{analytics.submittedCount > 0 ? analytics.avgScore : "—"}</p>
                      {analytics.submittedCount > 0 && (
                        <span className="text-[16px] font-bold text-[var(--lf-text-secondary)]">%</span>
                      )}
                    </div>
                    <p className="text-[11px] text-[var(--lf-text-secondary)] mt-0.5">{analytics.submittedCount} quiz{analytics.submittedCount !== 1 ? "zes" : ""} submitted</p>
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Award className="h-5 w-5 text-emerald-500" />
                  </div>
                </div>
              </motion.div>

              {/* Questions Answered */}
              <motion.div 
                variants={itemVariants}
                className="bg-[var(--lf-card)] border border-[var(--lf-border)] card-shadow rounded-2xl p-6 hover:-translate-y-1 hover:border-orange-500/30 transition-all duration-300 group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/8 blur-[40px] rounded-full pointer-events-none" />
                <div className="flex items-center justify-between relative z-10">
                  <div>
                    <p className="text-[13px] font-bold text-[var(--lf-text-secondary)] uppercase tracking-wider mb-1">Questions</p>
                    <p className="text-3xl font-black text-[var(--lf-text-primary)]">
                      {analytics.totalAnswered > 0 ? `${analytics.totalCorrect}/${analytics.totalAnswered}` : "—"}
                    </p>
                    <p className="text-[11px] text-[var(--lf-text-secondary)] mt-0.5">
                      {analytics.totalAnswered > 0 ? `${Math.round((analytics.totalCorrect / analytics.totalAnswered) * 100)}% accuracy` : "No data yet"}
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Target className="h-5 w-5 text-blue-500" />
                  </div>
                </div>
              </motion.div>

            </motion.div>
          )}

          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-[var(--lf-text-secondary)]" />
            </div>
            <input
              type="text"
              placeholder="Search by title or text snippet..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[var(--lf-surface)] border border-[var(--lf-border)] text-[var(--lf-text-primary)] placeholder:text-[var(--lf-text-secondary)] rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50 transition-all shadow-sm"
            />
          </div>

          {/* Quiz Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-48 bg-[var(--lf-card)] border border-[var(--lf-border)] rounded-2xl animate-pulse card-shadow" />
              ))}
            </div>
          ) : quizzes.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-20 flex flex-col items-center justify-center text-center border border-dashed border-[var(--lf-border)] rounded-3xl bg-[var(--lf-surface)] relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/6 blur-[60px] rounded-full pointer-events-none" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-orange-400/5 blur-[50px] rounded-full pointer-events-none" />
              <FileQuestion className="h-16 w-16 text-[var(--lf-text-secondary)] opacity-50 mb-4" />
              <h3 className="text-xl font-bold text-[var(--lf-text-primary)] mb-2">No quizzes found</h3>
              <p className="text-[14px] text-[var(--lf-text-secondary)] max-w-md">
                Generate your first quiz from any document to test your knowledge and see it here.
              </p>
            </motion.div>
          ) : (
            <motion.div 
              variants={containerVariants} 
              initial="hidden" 
              animate="show" 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {quizzes.map(quiz => (
                <motion.div 
                  key={quiz.id}
                  variants={itemVariants}
                  className="bg-[var(--lf-card)] border border-[var(--lf-border)] card-shadow rounded-2xl p-5 flex flex-col h-full hover:border-orange-500/40 hover:shadow-[0_0_15px_rgba(249,115,22,0.1)] transition-all duration-300 group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/8 blur-[50px] rounded-full pointer-events-none" />
                  <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-orange-400/6 blur-[40px] rounded-full pointer-events-none" />

                  <div className="flex justify-between items-start mb-3 relative z-10">
                    <h3 className="text-[15px] font-bold text-[var(--lf-text-primary)] line-clamp-1 flex-1 pr-2" title={quiz.title}>
                      {quiz.title || "Untitled Quiz"}
                    </h3>
                    <button 
                      onClick={(e) => handleDelete(e, quiz.id)}
                      disabled={isDeleting === quiz.id}
                      className="text-[var(--lf-text-secondary)] hover:text-red-500 p-1.5 rounded-md hover:bg-red-500/10 transition-colors shrink-0"
                      title="Delete quiz"
                    >
                      {isDeleting === quiz.id ? (
                        <div className="h-4 w-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-2 text-[11px] font-bold text-[var(--lf-text-secondary)] uppercase tracking-wide mb-4 relative z-10">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{formatDate(quiz.createdAt)}</span>
                    <span className="w-1 h-1 rounded-full bg-[var(--lf-border)] mx-1"></span>
                    <span>{quiz.totalQuestions} Qs</span>
                  </div>

                  {/* Score badge */}
                  {quiz.score !== undefined && quiz.totalQuestionsSubmitted !== undefined ? (
                    <div className={`relative z-10 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border text-[12px] font-bold mb-3 ${scoreBgColor(quiz.score, quiz.totalQuestionsSubmitted)} ${scoreColor(quiz.score, quiz.totalQuestionsSubmitted)}`}>
                      <Star className="h-3.5 w-3.5" />
                      Score: {quiz.score}/{quiz.totalQuestionsSubmitted} ({Math.round((quiz.score / quiz.totalQuestionsSubmitted) * 100)}%)
                    </div>
                  ) : (
                    <div className="relative z-10 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-[var(--lf-border)] bg-[var(--lf-surface)] text-[12px] font-bold text-[var(--lf-text-secondary)] mb-3">
                      <HelpCircle className="h-3.5 w-3.5" />
                      Not attempted
                    </div>
                  )}
                  
                  <p className="text-[13px] text-[var(--lf-text-secondary)] line-clamp-3 mb-6 flex-1 italic bg-[var(--lf-surface)] p-3 rounded-xl border border-[var(--lf-border)] relative z-10">
                    "{quiz.highlightedText}"
                  </p>
                  
                  <button 
                    onClick={() => openQuizDetails(quiz)}
                    className="relative z-10 w-full py-2.5 bg-[var(--lf-accent)] text-white rounded-xl font-semibold text-sm hover:bg-[var(--lf-accent-hover)] transition-colors shadow-lg shadow-orange-500/20 active:scale-[0.98]"
                  >
                    View Quiz
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}

          </div>{/* end left column */}

          {/* ── Right Sidebar: Topics to Improve ─────────────────────── */}
          <div className="w-72 shrink-0 hidden lg:block">
            <div className="sticky top-0 space-y-6">
              <div className="bg-[var(--lf-card)] border border-[var(--lf-border)] card-shadow rounded-2xl p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/8 blur-[50px] rounded-full pointer-events-none" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <Brain className="h-5 w-5 text-purple-500" />
                    <h3 className="text-[15px] font-bold text-[var(--lf-text-primary)]">Topics to Improve</h3>
                  </div>

                  {analytics.topics.length > 0 ? (
                    <div className="space-y-3">
                      {analytics.topics.map(([topic, count], i) => (
                        <div key={i} className="flex items-center justify-between group">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className={`w-2 h-2 rounded-full shrink-0 ${
                              i === 0 ? "bg-red-500" : i === 1 ? "bg-amber-500" : "bg-orange-400"
                            }`} />
                            <span className="text-[13px] font-medium text-[var(--lf-text-primary)] truncate">{topic}</span>
                          </div>
                          <span className="text-[11px] font-bold text-[var(--lf-text-secondary)] ml-2">{count}x</span>
                        </div>
                      ))}
                      <div className="pt-3 mt-3 border-t border-[var(--lf-border)]">
                        <p className="text-[11px] text-[var(--lf-text-secondary)]">
                          {analytics.weakestTopic
                            ? `🔴 Focus on "${analytics.weakestTopic}" — it needs the most attention.`
                            : "Review the topics above to strengthen your understanding."}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <Target className="h-10 w-10 text-[var(--lf-text-secondary)]/30 mx-auto mb-2" />
                      <p className="text-[12px] text-[var(--lf-text-secondary)]">No topics yet.</p>
                      <p className="text-[11px] text-[var(--lf-text-secondary)] mt-1">Submit a quiz to get personalized improvement insights.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Overall Stats mini card */}
              {analytics.submittedCount > 0 && (
                <div className="bg-[var(--lf-card)] border border-[var(--lf-border)] card-shadow rounded-2xl p-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/8 blur-[40px] rounded-full pointer-events-none" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                      <Award className="h-5 w-5 text-emerald-500" />
                      <h3 className="text-[15px] font-bold text-[var(--lf-text-primary)]">Performance</h3>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-[12px] mb-1">
                          <span className="text-[var(--lf-text-secondary)]">Average Score</span>
                          <span className="font-bold text-[var(--lf-text-primary)]">{analytics.avgScore}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-[var(--lf-surface)] border border-[var(--lf-border)] overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-orange-500 to-emerald-500 transition-all duration-500"
                            style={{ width: `${analytics.avgScore}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex justify-between text-[12px]">
                        <span className="text-[var(--lf-text-secondary)]">Accuracy</span>
                        <span className="font-bold text-[var(--lf-text-primary)]">
                          {analytics.totalCorrect}/{analytics.totalAnswered}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>{/* end flex row */}

        </motion.div>
      </div>

      {/* Quiz Details Modal */}
      <AnimatePresence>
        {selectedQuiz && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-12">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={closeDetails}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl max-h-full flex flex-col bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/80 backdrop-blur-md sticky top-0 z-10">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">{selectedQuiz.title || "Quiz Details"}</h2>
                  <p className="text-sm text-zinc-400">Generated on {formatDate(selectedQuiz.createdAt)}</p>
                </div>
                <button 
                  onClick={closeDetails}
                  className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">

                {/* Score + Topics Section */}
                {(selectedQuiz.score !== undefined || (selectedQuiz.topicsToImprove && selectedQuiz.topicsToImprove.length > 0)) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedQuiz.score !== undefined && selectedQuiz.totalQuestionsSubmitted !== undefined && (
                      <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800">
                        <p className="text-xs text-zinc-500 uppercase tracking-wider font-bold mb-2">Score</p>
                        <div className="flex items-baseline gap-2">
                          <span className={`text-4xl font-black ${scoreColor(selectedQuiz.score, selectedQuiz.totalQuestionsSubmitted)}`}>
                            {Math.round((selectedQuiz.score / selectedQuiz.totalQuestionsSubmitted) * 100)}%
                          </span>
                          <span className="text-zinc-400 text-sm font-medium">
                            ({selectedQuiz.score}/{selectedQuiz.totalQuestionsSubmitted})
                          </span>
                        </div>
                      </div>
                    )}
                    {selectedQuiz.topicsToImprove && selectedQuiz.topicsToImprove.length > 0 && (
                      <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800">
                        <p className="text-xs text-zinc-500 uppercase tracking-wider font-bold mb-2">Topics to Improve</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedQuiz.topicsToImprove.map((topic, i) => (
                            <span key={i} className="px-3 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-[12px] font-semibold">
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Context Snippet */}
                <div className="p-4 rounded-xl bg-zinc-800/30 border border-zinc-700/50 text-zinc-300 italic text-sm">
                  <span className="font-semibold text-orange-400 not-italic mr-2">Context:</span>
                  "{selectedQuiz.highlightedText}"
                </div>

                {/* MCQs */}
                {selectedQuiz.quizData?.mcqs && selectedQuiz.quizData.mcqs.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-zinc-800 pb-2">
                      <HelpCircle className="h-5 w-5 text-orange-500" /> Multiple Choice
                    </h3>
                    <div className="grid gap-4">
                      {selectedQuiz.quizData.mcqs.map((mcq, idx) => {
                        const correctAns = mcq.correctAnswer || mcq.answer;
                        return (
                        <div key={idx} className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800">
                          <p className="text-white font-medium mb-4 flex gap-3">
                            <span className="text-zinc-500 font-bold">{idx + 1}.</span> 
                            {mcq.question}
                          </p>
                          <div className="space-y-2 pl-7">
                            {mcq.options?.map((opt, oIdx) => {
                              const isCorrect = opt === correctAns;
                              return (
                                <div 
                                  key={oIdx} 
                                  className={`p-3 rounded-xl border text-sm flex items-center gap-3 transition-colors ${
                                    isCorrect 
                                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
                                    : "bg-zinc-900 border-zinc-800 text-zinc-400"
                                  }`}
                                >
                                  {isCorrect ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <div className="w-4 shrink-0" />}
                                  {opt}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )})}
                    </div>
                  </div>
                )}

                {/* True/False */}
                {selectedQuiz.quizData?.trueFalse && selectedQuiz.quizData.trueFalse.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-zinc-800 pb-2 mt-8">
                      <CheckCircle2 className="h-5 w-5 text-blue-500" /> True or False
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      {selectedQuiz.quizData.trueFalse.map((tf, idx) => (
                        <div key={idx} className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col justify-between">
                          <p className="text-white font-medium mb-4 text-sm">
                            {tf.question}
                          </p>
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 self-start text-sm">
                            <span className="text-zinc-500">Answer:</span>
                            <span className={`font-bold ${tf.answer ? "text-emerald-400" : "text-red-400"}`}>
                              {tf.answer ? "True" : "False"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Short Answer */}
                {selectedQuiz.quizData?.shortAnswer && selectedQuiz.quizData.shortAnswer.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-zinc-800 pb-2 mt-8">
                      <AlertCircle className="h-5 w-5 text-purple-500" /> Short Answer
                    </h3>
                    <div className="grid gap-4">
                      {selectedQuiz.quizData.shortAnswer.map((sa, idx) => (
                        <div key={idx} className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800">
                          <p className="text-white font-medium mb-3 flex gap-3 text-sm">
                            <span className="text-zinc-500 font-bold">{idx + 1}.</span> 
                            {sa.question}
                          </p>
                          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 ml-7">
                            <p className="text-xs text-zinc-500 uppercase tracking-wider font-bold mb-1">Expected Answer</p>
                            <p className="text-zinc-300 text-sm">{sa.answer}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </DashboardLayout>
  );
}
