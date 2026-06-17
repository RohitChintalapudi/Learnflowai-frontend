import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion, type Variants } from "framer-motion";
import {
  FileText,
  Brain,
  StickyNote,
  HelpCircle,
  History,
  Upload,
  ArrowRight,
  Flame,
  BookOpen,
  LayoutDashboard,
  ChevronRight,
  PlayCircle,
  Zap,
  BarChart3,
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

  return (
    <DashboardLayout headerTitle={
      <>
        Welcome back, Rohit{" "}
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
                  onClick={() => navigate({ to: "/workspace/demo-doc-123" })}
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
                value: "24",
                icon: FileText,
                color: "text-orange-400",
                bg: "bg-orange-500/10",
                border: "border-orange-500/20",
              },
              {
                title: "AI Explanations",
                value: "1,492",
                icon: Brain,
                color: "text-[var(--lf-accent)]",
                bg: "bg-[var(--lf-accent)]/10",
                border: "border-[var(--lf-accent)]/20",
              },
              {
                title: "Notes Created",
                value: "86",
                icon: StickyNote,
                color: "text-orange-400",
                bg: "bg-orange-500/10",
                border: "border-orange-500/20",
              },
              {
                title: "Learning Streak",
                value: "12 Days",
                icon: Flame,
                color: "text-orange-500",
                bg: "bg-orange-500/10",
                border: "border-orange-500/20",
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
                  <p className="text-[28px] font-bold text-[var(--lf-text-primary)] mb-1 leading-none">
                    {stat.value}
                  </p>
                  <p className="text-[12px] font-medium text-[var(--lf-text-secondary)]">
                    {stat.title}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* LEFT COLUMN (Recent Documents & Recommendations) */}
            <div className="lg:col-span-8 space-y-8">
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
                  {[
                    {
                      name: "DSA Notes.pdf",
                      time: "2 hours ago",
                      icon: FileText,
                      color: "text-orange-400",
                      bg: "bg-orange-500/10",
                    },
                    {
                      name: "DBMS Unit 3.pdf",
                      time: "Yesterday",
                      icon: FileText,
                      color: "text-[var(--lf-accent)]",
                      bg: "bg-[var(--lf-accent)]/10",
                    },
                    {
                      name: "Operating Systems.pdf",
                      time: "3 days ago",
                      icon: BookOpen,
                      color: "text-orange-500",
                      bg: "bg-orange-500/10",
                    },
                    {
                      name: "Computer Networks.ppt",
                      time: "1 week ago",
                      icon: LayoutDashboard,
                      color: "text-[var(--lf-accent)]",
                      bg: "bg-[var(--lf-accent)]/10",
                    },
                  ].map((doc, i) => (
                    <div
                      key={i}
                      onClick={() => navigate({ to: "/workspace/demo-doc-123" })}
                      className="group p-4 rounded-2xl bg-[var(--lf-card)] border border-[var(--lf-border)] hover:border-orange-500/40 card-shadow card-shadow-hover transition-all cursor-pointer flex items-center gap-4"
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${doc.bg} group-hover:scale-110 transition-transform`}
                      >
                        <doc.icon className={`h-5 w-5 ${doc.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-bold text-[var(--lf-text-primary)] truncate">
                          {doc.name}
                        </p>
                        <p className="text-[11px] text-[var(--lf-text-secondary)] mt-0.5">
                          {doc.time}
                        </p>
                      </div>
                      <button className="w-8 h-8 rounded-full flex items-center justify-center bg-[var(--lf-surface)] border border-[var(--lf-border)] group-hover:bg-[var(--lf-accent)] group-hover:border-[var(--lf-accent)] group-hover:text-white transition-colors">
                        <PlayCircle className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* AI Recommendations */}
              <motion.div variants={itemVariants}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[16px] font-bold text-[var(--lf-text-primary)] flex items-center gap-2">
                    <Brain className="h-4.5 w-4.5 text-[var(--lf-accent)]" />{" "}
                    AI Recommendations
                  </h3>
                </div>
                <div className="flex flex-col gap-3">
                  {[
                    {
                      action: "Revise",
                      target: "Dynamic Programming",
                      type: "Notes",
                      icon: StickyNote,
                      color: "text-orange-400",
                    },
                    {
                      action: "Take",
                      target: "Graph Algorithms Quiz",
                      type: "Quiz",
                      icon: HelpCircle,
                      color: "text-[var(--lf-accent)]",
                    },
                    {
                      action: "Review",
                      target: "DBMS Normalization",
                      type: "Simulations",
                      icon: Zap,
                      color: "text-orange-500",
                    },
                  ].map((rec, i) => (
                    <div
                      key={i}
                      className="group flex items-center justify-between p-4 rounded-2xl bg-[var(--lf-card)] border border-[var(--lf-border)] hover:bg-[var(--lf-surface)] hover:border-orange-500/30 card-shadow card-shadow-hover transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center bg-[var(--lf-surface)] border border-[var(--lf-border)] group-hover:scale-110 transition-transform`}
                        >
                          <rec.icon className={`h-4 w-4 ${rec.color}`} />
                        </div>
                        <div>
                          <p className="text-[14px] font-medium text-[var(--lf-text-primary)]">
                            <span className="text-[var(--lf-text-secondary)]">
                              {rec.action}
                            </span>{" "}
                            <span className="font-bold">{rec.target}</span>
                          </p>
                          <p className="text-[11px] text-[var(--lf-text-secondary)] mt-0.5">
                            Based on your recent mistakes
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-[var(--lf-text-secondary)] group-hover:text-[var(--lf-text-primary)] group-hover:translate-x-1 transition-transform" />
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* RIGHT COLUMN (Progress & Timeline) */}
            <div className="lg:col-span-4 space-y-8">
              {/* Learning Progress */}
              <motion.div
                variants={itemVariants}
                className="p-6 rounded-3xl bg-[var(--lf-card)] border border-[var(--lf-border)] card-shadow-lg relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-orange-500/10 to-transparent blur-[60px] rounded-full pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-28 h-28 bg-gradient-to-tr from-orange-500/8 to-transparent blur-[50px] rounded-full pointer-events-none" />
                <h3 className="text-[16px] font-bold text-[var(--lf-text-primary)] mb-5 flex items-center gap-2">
                  <BarChart3 className="h-4.5 w-4.5 text-[var(--lf-text-secondary)]" />{" "}
                  Learning Progress
                </h3>
                <div className="space-y-5">
                  {[
                    {
                      subject: "Data Structures & Algorithms",
                      progress: 78,
                      color: "bg-orange-400",
                    },
                    {
                      subject: "Database Management Systems",
                      progress: 45,
                      color: "bg-[var(--lf-accent)]",
                    },
                    {
                      subject: "Operating Systems",
                      progress: 92,
                      color: "bg-orange-500",
                    },
                  ].map((prog, i) => (
                    <div key={i}>
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-[13px] font-bold text-[var(--lf-text-primary)] truncate pr-4">
                          {prog.subject}
                        </span>
                        <span className="text-[11px] font-bold text-[var(--lf-text-secondary)]">
                          {prog.progress}%
                        </span>
                      </div>
                      <div className="h-2 w-full bg-[var(--lf-surface)] rounded-full overflow-hidden border border-[var(--lf-border)]">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${prog.progress}%` }}
                          transition={{
                            duration: 1,
                            ease: "easeOut",
                            delay: 0.2 + i * 0.1,
                          }}
                          className={`h-full ${prog.color} rounded-full`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Activity Timeline */}
              <motion.div
                variants={itemVariants}
                className="p-6 rounded-3xl bg-[var(--lf-card)] border border-[var(--lf-border)] card-shadow-lg relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-orange-500/10 to-transparent blur-[50px] rounded-full pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-orange-500/8 to-transparent blur-[40px] rounded-full pointer-events-none" />
                <h3 className="text-[16px] font-bold text-[var(--lf-text-primary)] mb-5 flex items-center gap-2">
                  <History className="h-4.5 w-4.5 text-[var(--lf-text-secondary)]" />{" "}
                  Recent Activity
                </h3>
                <div className="space-y-0 relative pl-2">
                  {[
                    {
                      action: "Generated Notes",
                      target: "for OS Deadlocks",
                      time: "2h ago",
                      icon: FileText,
                    },
                    {
                      action: "Asked AI",
                      target: '"Explain TCP Handshake"',
                      time: "4h ago",
                      icon: Brain,
                    },
                    {
                      action: "Completed Quiz",
                      target: "DBMS Normalization",
                      time: "Yesterday",
                      icon: HelpCircle,
                    },
                    {
                      action: "Uploaded",
                      target: "Computer Networks.pdf",
                      time: "2 days ago",
                      icon: Upload,
                    },
                  ].map((act, i, arr) => (
                    <div
                      key={i}
                      className="flex gap-4 relative group cursor-pointer"
                    >
                      {/* Timeline Line */}
                      {i !== arr.length - 1 && (
                        <div className="absolute left-[11px] top-7 bottom-0 w-px bg-[var(--lf-border)]" />
                      )}
                      <div className="relative z-10 w-6 h-6 rounded-full bg-[var(--lf-surface)] border border-[var(--lf-border)] flex items-center justify-center shrink-0 mt-0.5 group-hover:border-[var(--lf-text-secondary)] transition-colors">
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--lf-text-secondary)] group-hover:bg-[var(--lf-accent)] transition-colors" />
                      </div>
                      <div className="pb-6 pt-0.5">
                        <p className="text-[13px] font-medium text-[var(--lf-text-primary)]">
                          {act.action}{" "}
                          <span className="font-bold">{act.target}</span>
                        </p>
                        <p className="text-[11px] text-[var(--lf-text-secondary)] mt-0.5">
                          {act.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full py-2.5 mt-2 rounded-xl border border-[var(--lf-border)] text-[12px] font-semibold text-[var(--lf-text-primary)] hover:bg-[var(--lf-surface)] hover:text-[var(--lf-accent)] transition-colors">
                  View Full History
                </button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
