import { X, Copy, Download, RotateCw, Compass } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { LearningHistoryItem } from "../../lib/api";
import toast from "react-hot-toast";

interface HistoryDrawerProps {
  isOpen: boolean;
  item: LearningHistoryItem | null;
  onClose: () => void;
  onRegenerate: (item: LearningHistoryItem) => void;
}

export function HistoryDrawer({ isOpen, item, onClose, onRegenerate }: HistoryDrawerProps) {
  if (!item) return null;

  const copyToClipboard = () => {
    let textToCopy = "";
    if (item.activityType === "Explanation") {
      textToCopy = item.explanationText || "";
    } else if (item.activityType === "GeneratedNote") {
      const summary = item.notes?.summary || "";
      const kp = (item.notes?.keyPoints || []).join("\n- ");
      textToCopy = `AI Notes: ${item.title}\n\nSummary:\n${summary}\n\nKey Points:\n- ${kp}`;
    } else if (item.activityType === "GeneratedAnalogy") {
      textToCopy = `Title: ${item.title}\nStyle: ${item.style}\n\nAnalogy:\n${item.analogyData?.analogy || ""}\n\nExplanation:\n${item.analogyData?.explanation || ""}`;
    } else if (item.activityType === "GeneratedSimulation") {
      const stepsText = (item.simulationData?.steps || []).map((s: any) => `Step ${s.stepNumber}: ${s.title}\n${s.description}`).join("\n\n");
      textToCopy = `Simulation Overview:\n${item.simulationData?.overview || ""}\n\nSteps:\n${stepsText}`;
    } else {
      textToCopy = JSON.stringify(item, null, 2);
    }

    navigator.clipboard.writeText(textToCopy);
    toast.success("Content copied to clipboard!");
  };

  const handleDownload = () => {
    let content = "";
    if (item.activityType === "Explanation") {
      content = `LEARNFLOW AI EXPLANATION\nDocument: ${item.document?.title || "N/A"}\nGenerated: ${new Date(item.createdAt).toLocaleString()}\n\nTopic: ${item.highlightedText}\n\nExplanation:\n${item.explanationText || ""}`;
    } else if (item.activityType === "GeneratedNote") {
      const notesObj = item.notes || {};
      content = `LEARNFLOW AI NOTES: ${item.title}\nDocument: ${item.document?.title || "N/A"}\n\nSUMMARY:\n${notesObj.summary || ""}\n\nKEY POINTS:\n${(notesObj.keyPoints || []).map((pt: string) => `- ${pt}`).join("\n")}\n\nEXAM TIPS:\n${(notesObj.examTips || []).map((t: string) => `- ${t}`).join("\n")}`;
    } else if (item.activityType === "QuizSet" || item.activityType === "GeneratedQuiz") {
      const quiz = item.quizJson || item.quizData || {};
      const mcqs = quiz.mcqs || [];
      content = `LEARNFLOW AI QUIZ\nTopic: ${item.highlightedText || item.title}\nScore: ${item.score || 0}/${item.totalQuestions || 5}\n\nQUESTIONS:\n${mcqs.map((q: any, i: number) => `Q${i+1}: ${q.question}\nOptions:\n  A) ${q.options?.[0]}\n  B) ${q.options?.[1]}\n  C) ${q.options?.[2]}\n  D) ${q.options?.[3]}\nCorrect Answer: ${q.correctAnswer}\n`).join("\n")}`;
    } else if (item.activityType === "InterviewQuestionSet") {
      const qJson = item.questionsJson || {};
      const basic = qJson.basic || [];
      const intermediate = qJson.intermediate || [];
      const advanced = qJson.advanced || [];
      
      const renderSection = (title: string, list: any[]) => {
        return `${title.toUpperCase()} QUESTIONS:\n` + list.map((q, i) => `${i+1}. ${q.question}\nAnswer Guide: ${q.answerGuide || q.answer}\n`).join("\n");
      };
      
      content = `LEARNFLOW AI INTERVIEW PRACTICE\nTopic: ${item.highlightedText}\n\n${renderSection("basic", basic)}\n${renderSection("intermediate", intermediate)}\n${renderSection("advanced", advanced)}`;
    } else if (item.activityType === "GeneratedMindMap") {
      content = `LEARNFLOW AI MIND MAP: ${item.title}\nTopic: ${item.highlightedText}\n\nMap Hierarchy:\n` + JSON.stringify(item.mindMapData, null, 2);
    } else if (item.activityType === "GeneratedAnalogy") {
      content = `LEARNFLOW AI ANALOGY: ${item.title}\nStyle: ${item.style}\n\nANALOGY:\n${item.analogyData?.analogy || ""}\n\nEXPLANATION:\n${item.analogyData?.explanation || ""}`;
    } else if (item.activityType === "GeneratedSimulation") {
      const sim = item.simulationData || {};
      content = `LEARNFLOW AI INTERACTIVE SIMULATION\nType: ${item.simulationType}\nDifficulty: ${item.difficulty}\n\nOVERVIEW:\n${sim.overview || ""}\n\nSTEPS:\n${(sim.steps || []).map((s: any) => `Step ${s.stepNumber}: ${s.title}\n- Explanation: ${s.explanation}\n- Entities: ${s.activeEntities?.join(", ")}\n`).join("\n")}`;
    }

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${item.activityType.toLowerCase()}_export.txt`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Download started!");
  };

  const renderContentDetails = () => {
    switch (item.activityType) {
      case "Explanation":
        return (
          <div className="space-y-4">
            <div className="bg-orange-500/5 border border-orange-500/10 rounded-xl p-4 text-sm text-[var(--lf-text-secondary)] italic">
              "{item.highlightedText}"
            </div>
            <div className="prose dark:prose-invert max-w-none text-[14.5px] leading-relaxed text-[var(--lf-text-primary)] whitespace-pre-wrap">
              {item.explanationText}
            </div>
          </div>
        );

      case "GeneratedNote":
        const notesObj = item.notes || {};
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-[var(--lf-text-primary)]">{item.title}</h3>
            {notesObj.summary && (
              <div className="space-y-2">
                <h4 className="text-xs uppercase font-extrabold text-orange-500 tracking-wider">Summary</h4>
                <p className="text-sm leading-relaxed text-[var(--lf-text-secondary)] bg-[var(--lf-surface)] rounded-xl p-4">{notesObj.summary}</p>
              </div>
            )}
            {notesObj.keyPoints && notesObj.keyPoints.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs uppercase font-extrabold text-orange-500 tracking-wider">Key Takeaways</h4>
                <ul className="list-disc pl-5 text-sm space-y-1.5 text-[var(--lf-text-secondary)]">
                  {notesObj.keyPoints.map((kp: string, i: number) => (
                    <li key={i}>{kp}</li>
                  ))}
                </ul>
              </div>
            )}
            {notesObj.examTips && notesObj.examTips.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs uppercase font-extrabold text-orange-500 tracking-wider">💡 Exam Tips</h4>
                <div className="bg-amber-500/5 border border-amber-500/15 rounded-xl p-4 text-sm space-y-2 text-[var(--lf-text-secondary)]">
                  {notesObj.examTips.map((tip: string, i: number) => (
                    <p key={i}>• {tip}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case "QuizSet":
      case "GeneratedQuiz":
        const quizObj = item.quizJson || item.quizData || {};
        const mcqs = quizObj.mcqs || [];
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <span className="text-sm font-bold text-[var(--lf-text-primary)]">Quiz Progress</span>
              <span className="text-sm font-black text-orange-500 bg-orange-500/10 px-3 py-1 rounded-full">
                Score: {item.score || 0}/{item.totalQuestions || mcqs.length || 5}
              </span>
            </div>
            
            <div className="space-y-6">
              {mcqs.map((q: any, idx: number) => (
                <div key={idx} className="border border-[var(--lf-border)] rounded-xl p-4 bg-[var(--lf-surface)] space-y-3">
                  <p className="text-sm font-bold text-[var(--lf-text-primary)]">
                    {idx + 1}. {q.question}
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    {(q.options || []).map((opt: string, oIdx: number) => {
                      const isCorrect = opt === q.correctAnswer;
                      return (
                        <div
                          key={oIdx}
                          className={`text-xs px-3 py-2.5 rounded-lg border font-semibold ${
                            isCorrect
                              ? "bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-400"
                              : "border-[var(--lf-border)] text-[var(--lf-text-secondary)]"
                          }`}
                        >
                          {opt} {isCorrect && "✓"}
                        </div>
                      );
                    })}
                  </div>
                  {q.explanation && (
                    <div className="text-[11px] text-[var(--lf-text-secondary)] italic pt-1">
                      Explanation: {q.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case "InterviewQuestionSet":
        const qJson = item.questionsJson || {};
        const categories = [
          { name: "Basic", list: qJson.basic || [] },
          { name: "Intermediate", list: qJson.intermediate || [] },
          { name: "Advanced", list: qJson.advanced || [] },
        ];
        return (
          <div className="space-y-6">
            {categories.map((cat, cIdx) => (
              <div key={cIdx} className="space-y-4">
                <h4 className="text-xs uppercase font-extrabold text-purple-500 tracking-wider">
                  {cat.name} Questions
                </h4>
                {cat.list.length === 0 ? (
                  <p className="text-xs text-[var(--lf-text-secondary)]">No questions in this tier.</p>
                ) : (
                  <div className="space-y-4">
                    {cat.list.map((q: any, idx: number) => (
                      <div key={idx} className="border border-[var(--lf-border)] rounded-xl p-4 bg-[var(--lf-surface)] space-y-2">
                        <p className="text-sm font-bold text-[var(--lf-text-primary)]">
                          Q: {q.question}
                        </p>
                        <p className="text-xs text-[var(--lf-text-secondary)] leading-relaxed bg-white/60 dark:bg-black/35 rounded-lg p-3">
                          <span className="font-extrabold text-[var(--lf-text-primary)] block mb-1">Answer Guide:</span>
                          {q.answerGuide || q.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        );

      case "GeneratedMindMap":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-[var(--lf-text-primary)]">{item.title}</h3>
            <div className="border border-[var(--lf-border)] rounded-xl p-4 bg-[var(--lf-surface)] space-y-2">
              <h4 className="text-xs uppercase font-extrabold text-pink-500 tracking-wider">Topic Blueprint</h4>
              <pre className="text-xs overflow-x-auto text-[var(--lf-text-secondary)] max-w-full p-2 font-mono whitespace-pre-wrap">
                {JSON.stringify(item.mindMapData, null, 2)}
              </pre>
            </div>
          </div>
        );

      case "GeneratedAnalogy":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <h3 className="text-lg font-extrabold text-[var(--lf-text-primary)]">{item.title}</h3>
              <span className="text-[11px] font-bold bg-teal-500/10 text-teal-600 dark:text-teal-400 px-3 py-1 rounded-full border border-teal-500/20">
                Style: {item.style}
              </span>
            </div>
            
            <div className="space-y-4">
              <div className="bg-teal-500/5 border border-teal-500/10 rounded-xl p-4">
                <h4 className="text-xs uppercase font-extrabold text-teal-500 tracking-wider mb-2">The Analogy</h4>
                <p className="text-sm font-semibold leading-relaxed text-[var(--lf-text-primary)]">
                  {item.analogyData?.analogy || ""}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs uppercase font-extrabold text-[var(--lf-text-secondary)] tracking-wider">Detailed Explanation</h4>
                <p className="text-sm leading-relaxed text-[var(--lf-text-secondary)]">
                  {item.analogyData?.explanation || ""}
                </p>
              </div>
            </div>
          </div>
        );

      case "GeneratedSimulation":
        const sim = item.simulationData || {};
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <h3 className="text-lg font-extrabold text-[var(--lf-text-primary)]">Simulation</h3>
              <div className="flex gap-2">
                <span className="text-[10px] font-extrabold uppercase bg-orange-500/10 text-orange-500 px-2 py-0.5 rounded border border-orange-500/20">
                  {item.simulationType}
                </span>
                <span className="text-[10px] font-extrabold uppercase bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded border border-amber-500/20">
                  {item.difficulty}
                </span>
              </div>
            </div>
            
            <div className="space-y-4">
              {sim.overview && (
                <div className="space-y-1">
                  <h4 className="text-xs uppercase font-extrabold text-[var(--lf-text-secondary)] tracking-wider">Overview</h4>
                  <p className="text-sm text-[var(--lf-text-primary)] leading-relaxed bg-[var(--lf-surface)] rounded-xl p-4">{sim.overview}</p>
                </div>
              )}

              {sim.steps && sim.steps.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-xs uppercase font-extrabold text-orange-500 tracking-wider">Simulation Steps</h4>
                  <div className="space-y-3">
                    {sim.steps.map((s: any, idx: number) => (
                      <div key={idx} className="border border-[var(--lf-border)] rounded-xl p-4 space-y-2 relative bg-white/60 dark:bg-zinc-900/20">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-orange-500">Step {s.stepNumber}</span>
                          <span className="text-sm font-extrabold text-[var(--lf-text-primary)]">{s.title}</span>
                        </div>
                        <p className="text-xs text-[var(--lf-text-secondary)] leading-relaxed">{s.description || s.explanation}</p>
                        {s.activeEntities && s.activeEntities.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {s.activeEntities.map((ent: string, eIdx: number) => (
                              <span key={eIdx} className="text-[9px] bg-orange-500/10 text-orange-500 font-bold px-2 py-0.5 rounded">
                                {ent}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return (
          <pre className="text-xs bg-[var(--lf-surface)] rounded-xl p-4 overflow-x-auto text-[var(--lf-text-secondary)]">
            {JSON.stringify(item, null, 2)}
          </pre>
        );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-xs"
            onClick={onClose}
          />

          {/* Sliding panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="relative w-full max-w-lg h-full bg-white dark:bg-[#0c0c0c] border-l border-[var(--lf-border)] shadow-2xl flex flex-col z-10"
          >
            {/* Header */}
            <div className="h-16 px-6 border-b border-[var(--lf-border)] flex items-center justify-between bg-white/80 dark:bg-black/80 backdrop-blur-md sticky top-0">
              <div className="flex items-center gap-2">
                <Compass className="h-4.5 w-4.5 text-orange-500" />
                <span className="text-sm font-extrabold text-[var(--lf-text-primary)]">Generation Insight</span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-[var(--lf-surface)] text-[var(--lf-text-secondary)] hover:text-[var(--lf-text-primary)] transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Scrollable details container */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
              {/* Metadata badge summary */}
              <div className="grid grid-cols-2 gap-3 p-4 rounded-xl border border-[var(--lf-border)] bg-[var(--lf-surface)] text-xs">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--lf-text-secondary)] block">Document</span>
                  <span className="font-extrabold text-[var(--lf-text-primary)] truncate block">{item.document?.title || "Direct Input"}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--lf-text-secondary)] block">Created</span>
                  <span className="font-extrabold text-[var(--lf-text-primary)] block">{new Date(item.createdAt).toLocaleDateString()} • {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>

              {/* Dynamic details render */}
              {renderContentDetails()}
            </div>

            {/* Sticky Actions bar at bottom */}
            <div className="p-4 border-t border-[var(--lf-border)] bg-[var(--lf-surface)] flex gap-2">
              <button
                onClick={copyToClipboard}
                className="flex-1 py-2.5 rounded-xl border border-[var(--lf-border)] hover:border-orange-500/20 bg-white dark:bg-zinc-900/60 hover:bg-[var(--lf-surface)] text-xs font-semibold text-[var(--lf-text-primary)] flex items-center justify-center gap-2 transition-all"
              >
                <Copy className="h-4 w-4 text-[var(--lf-text-secondary)]" />
                <span>Copy</span>
              </button>
              
              <button
                onClick={handleDownload}
                className="flex-1 py-2.5 rounded-xl border border-[var(--lf-border)] hover:border-orange-500/20 bg-white dark:bg-zinc-900/60 hover:bg-[var(--lf-surface)] text-xs font-semibold text-[var(--lf-text-primary)] flex items-center justify-center gap-2 transition-all"
              >
                <Download className="h-4 w-4 text-[var(--lf-text-secondary)]" />
                <span>Download</span>
              </button>

              <button
                onClick={() => onRegenerate(item)}
                className="flex-1 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 transition-all active:scale-[0.98]"
              >
                <RotateCw className="h-4 w-4" />
                <span>Regenerate</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
