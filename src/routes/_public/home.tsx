import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion, type Variants } from "framer-motion";
import { useEffect, useState } from "react";
import { DocumentAPI, type DashboardSummary } from "../../lib/api";
import {
  FileText,
  Brain,
  StickyNote,
  History,
  Upload,
  ArrowRight,
  ChevronRight,
  PlayCircle,
  HelpCircle,
} from "lucide-react";
import { DashboardLayout } from "../../components/DashboardLayout";

export const Route = createFileRoute("/_public/home")({
  component: DashboardHomePage,
});

// Animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

function DashboardHomePage() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const data = await DocumentAPI.getDashboardSummary();
        setSummary(data);
      } catch (error) {
        console.error("Failed to load dashboard summary:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  return (
    <DashboardLayout headerTitle={
      <>
        Welcome back, {summary?.user?.name || ""} {" "}
        <span className="inline-block hover:animate-bounce cursor-pointer origin-bottom-right">
          👋
        </span>
      </>
    }>
      <div className="flex-1 overflow-y-auto p-8 relative no-scrollbar">
        <motion.div
          className="max-w-[1200px] mx-auto space-y-8 pb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* HERO SECTION */}
          <motion.div
            variants={itemVariants}
            className="relative rounded-3xl p-8 lg:p-10 border border-[var(--lf-border)] overflow-hidden bg-[var(--lf-card)] card-shadow-lg"
          >
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-orange-500/30 to-transparent blur-[100px] rounded-full pointer-events-none translate-x-1/3 -translate-y-1/3 animate-pulse-scale-1" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-orange-500/25 to-transparent blur-[80px] rounded-full pointer-events-none -translate-x-1/3 translate-y-1/3 animate-pulse-scale-2" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-orange-400/10 blur-[90px] rounded-full pointer-events-none animate-pulse-scale-3" />

            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/30 bg-orange-500/15 text-[var(--lf-accent)] text-xs font-semibold mb-5">
                <Brain className="h-3.5 w-3.5" /> AI-Powered Study Assistant
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight leading-[1.15] mb-4">
                Continue Your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--lf-accent)] to-orange-300">
                  Learning Journey.
                </span>
              </h1>
              <p className="text-[15px] text-[var(--lf-text-secondary)] leading-relaxed mb-8 max-w-lg">
                Upload a new document to instantly generate interactive notes,
                quizzes, and AI explanations tailored exactly to your
                curriculum.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <button 
                  onClick={() => navigate({ to: "/documents" })}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--lf-accent)] hover:bg-[var(--lf-accent-hover)] text-white text-sm font-semibold shadow-lg shadow-orange-500/25 transition-all hover:scale-105 active:scale-95"
                >
                  <Upload className="h-4 w-4" /> Upload Document
                </button>
                <button 
                  onClick={() => navigate({ to: "/workspace/$documentId", params: { documentId: "demo-doc-123" } })}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--lf-surface)] border border-[var(--lf-border)] hover:border-[var(--lf-text-secondary)] text-[var(--lf-text-primary)] text-sm font-semibold transition-all hover:bg-[var(--lf-bg)]"
                >
                  Open Workspace <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* STATS SECTION */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {[
              {
                title: "Documents Uploaded",
                value: summary?.stats.documentsCount ?? 0,
                icon: FileText,
                color: "text-orange-400",
                bg: "bg-orange-500/10",
                border: "border-orange-500/20",
              },
              {
                title: "AI Explanations",
                value: summary?.stats.explanationsCount ?? 0,
                icon: Brain,
                color: "text-[var(--lf-accent)]",
                bg: "bg-[var(--lf-accent)]/10",
                border: "border-[var(--lf-accent)]/20",
              },
              {
                title: "Notes Created",
                value: summary?.stats.notesCount ?? 0,
                icon: StickyNote,
                color: "text-orange-400",
                bg: "bg-orange-500/10",
                border: "border-orange-500/20",
              },
              {
                title: "Quizzes Taken",
                value: summary?.stats.quizzesCount ?? 0,
                icon: HelpCircle,
                color: "text-[var(--lf-accent)]",
                bg: "bg-[var(--lf-accent)]/10",
                border: "border-[var(--lf-accent)]/20",
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="group p-5 rounded-2xl bg-[var(--lf-card)] border border-[var(--lf-border)] hover:border-orange-500/30 card-shadow card-shadow-hover transition-all cursor-pointer relative overflow-hidden"
              >
                <div
                  className={`absolute top-0 right-0 w-24 h-24 ${stat.bg} blur-2xl rounded-full translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-500`}
                />
                <div className="relative z-10">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${stat.bg} border ${stat.border} mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <stat.icon className={`h-4.5 w-4.5 ${stat.color}`} />
                  </div>
                  {loading ? (
                    <div className="h-7 w-16 bg-stone-200 dark:bg-stone-800 animate-pulse rounded mb-1"></div>
                  ) : (
                    <p className="text-[28px] font-bold text-[var(--lf-text-primary)] mb-1 leading-none">
                      {stat.value}
                    </p>
                  )}
                  <p className="text-[12px] font-medium text-[var(--lf-text-secondary)]">
                    {stat.title}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 gap-8">
            {/* FULL COLUMN (Recent Documents & Recommendations) */}
            <div className="space-y-8">
              {/* Recent Documents */}
              <motion.div variants={itemVariants}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[16px] font-bold text-[var(--lf-text-primary)] flex items-center gap-2">
                    <History className="h-4.5 w-4.5 text-[var(--lf-text-secondary)]" />{" "}
                    Recent Documents
                  </h3>
                  <button onClick={() => navigate({ to: "/documents" })} className="text-[13px] font-semibold text-[var(--lf-text-secondary)] hover:text-[var(--lf-text-primary)] flex items-center gap-1">
                    View All <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {loading ? (
                    Array(4).fill(0).map((_, i) => (
                      <div key={i} className="h-20 bg-[var(--lf-card)] border border-[var(--lf-border)] rounded-2xl animate-pulse card-shadow"></div>
                    ))
                  ) : summary?.recentDocuments.length === 0 ? (
                    <div className="col-span-2 text-center py-6 text-[14px] text-[var(--lf-text-secondary)] italic">
                      No documents uploaded yet.
                    </div>
                  ) : (
                    summary?.recentDocuments.map((doc, i) => (
                      <div
                        key={i}
                        onClick={() => navigate({ to: "/workspace/$documentId", params: { documentId: String(doc.id) } })}
                        className="group p-4 rounded-2xl bg-[var(--lf-card)] border border-[var(--lf-border)] hover:border-orange-500/40 card-shadow card-shadow-hover transition-all cursor-pointer flex items-center gap-4"
                      >
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-orange-500/10 group-hover:scale-110 transition-transform`}
                        >
                          <FileText className={`h-5 w-5 text-orange-400`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[14px] font-bold text-[var(--lf-text-primary)] truncate" title={doc.title}>
                            {doc.title}
                          </p>
                          <p className="text-[11px] text-[var(--lf-text-secondary)] mt-0.5">
                            {new Date(doc.createdAt!).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                        <button className="w-8 h-8 rounded-full flex items-center justify-center bg-[var(--lf-surface)] border border-[var(--lf-border)] group-hover:bg-[var(--lf-accent)] group-hover:border-[var(--lf-accent)] group-hover:text-white transition-colors">
                          <PlayCircle className="h-4 w-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>

              {/* Recent Activity (Horizontal) */}
              <motion.div variants={itemVariants} className="pt-2">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[16px] font-bold text-[var(--lf-text-primary)] flex items-center gap-2">
                    <History className="h-4.5 w-4.5 text-[var(--lf-text-secondary)]" />{" "}
                    Recent Activity
                  </h3>
                </div>
                <div className="flex overflow-x-auto no-scrollbar gap-4 pb-4 snap-x">
                  {loading ? (
                    Array(4).fill(0).map((_, i) => (
                      <div key={i} className="min-w-[240px] h-24 bg-[var(--lf-card)] border border-[var(--lf-border)] rounded-2xl animate-pulse snap-start card-shadow"></div>
                    ))
                  ) : summary?.recentActivity.length === 0 ? (
                    <div className="text-[13px] text-[var(--lf-text-secondary)] italic">
                      No recent activity found.
                    </div>
                  ) : (
                    summary?.recentActivity.map((act, i) => (
                      <div
                        key={i}
                        className="min-w-[240px] max-w-[280px] p-4 rounded-2xl bg-[var(--lf-card)] border border-[var(--lf-border)] hover:border-orange-500/40 card-shadow card-shadow-hover transition-all cursor-pointer snap-start flex flex-col justify-between group"
                      >
                        <div className="flex items-center gap-3 mb-2">
                           <div className="w-8 h-8 rounded-full bg-[var(--lf-surface)] flex items-center justify-center shrink-0 border border-[var(--lf-border)] group-hover:border-[var(--lf-text-secondary)] transition-colors">
                             <div className="w-2 h-2 rounded-full bg-[var(--lf-text-secondary)] group-hover:bg-[var(--lf-accent)] transition-colors" />
                           </div>
                           <p className="text-[11px] text-[var(--lf-text-secondary)]">
                             {new Date(act.time).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                           </p>
                        </div>
                        <div>
                          <p className="text-[13px] font-medium text-[var(--lf-text-primary)] line-clamp-2">
                            {act.action}{" "}
                            <span className="font-bold" title={act.target}>{act.target}</span>
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>

            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
