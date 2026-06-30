import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "../../components/DashboardLayout";
import { type GeneratedNotes, WorkflowAPI } from "../../lib/api";
import { Notebook, Download, Clock, ChevronRight, FileText, Lightbulb, BookOpen, GraduationCap, ArrowLeft, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useReactToPrint } from "react-to-print";

export const Route = createFileRoute("/_authenticated/notes")({
  component: NotesPage,
});

export interface SavedNote {
  id: string;
  documentId: string;
  createdAt: string;
  data: GeneratedNotes;
}

function NotesPage() {
  const queryClient = useQueryClient();
  const [selectedNote, setSelectedNote] = useState<SavedNote | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  const { data: savedNotes = [], isLoading } = useQuery({
    queryKey: ['notes'],
    queryFn: async () => {
      const response = await WorkflowAPI.getNotes();
      if (response.success && response.notes) {
        return response.notes.map((n: any) => ({
          id: n.id,
          documentId: n.documentId,
          createdAt: n.createdAt,
          data: n.notes
        }));
      }
      return [];
    }
  });

  const handleDownloadPDF = useReactToPrint({
    contentRef,
    documentTitle: selectedNote?.data?.title ? `${selectedNote.data.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_notes` : "Study_Notes",
    onAfterPrint: () => toast.success("PDF saved successfully!", { id: "pdf-toast" }),
    onPrintError: () => toast.error("Failed to generate PDF.", { id: "pdf-toast" }),
  });

  const triggerDownload = () => {
    toast.loading("Opening Print Dialog (Save as PDF)...", { id: "pdf-toast", duration: 2000 });
    handleDownloadPDF();
  };

  const deleteNote = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    
    const prevNotes = queryClient.getQueryData<SavedNote[]>(['notes']) || [];
    queryClient.setQueryData(['notes'], prevNotes.filter(n => n.id !== id));
    
    try {
      await WorkflowAPI.deleteNote(id);
      if (selectedNote?.id === id) {
        setSelectedNote(null);
      }
      toast.success("Note deleted.");
    } catch (err) {
      console.error("Failed to delete from backend", err);
      toast.error("Failed to delete note.");
      queryClient.setQueryData(['notes'], prevNotes);
    }
  };

  const printStyle: React.CSSProperties = { WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" };

  return (
    <DashboardLayout headerTitle="Saved Notes">
      <div className="flex-1 flex flex-col min-h-0 relative">
        <AnimatePresence mode="wait">
          {!selectedNote ? (
            <motion.div 
              key="list"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 overflow-y-auto p-8 no-scrollbar"
            >
              <div className="max-w-6xl mx-auto space-y-8">
                <div className="flex items-center gap-4 border-b border-[var(--lf-border)] pb-6">
                  <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center">
                    <Notebook className="h-6 w-6 text-orange-500" />
                  </div>
                  <div>
                    <h1 data-tour="notes-heading" className="text-2xl font-bold text-[var(--lf-text-primary)]">Your Recent Notes</h1>
                    <p className="text-[14px] text-[var(--lf-text-secondary)]">Access, review, and download your AI-generated study notes.</p>
                  </div>
                </div>

                {isLoading ? (
                  <div className="text-center py-20 bg-[var(--lf-surface)] rounded-3xl border border-[var(--lf-border)] border-dashed card-shadow">
                    <div className="animate-pulse flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-orange-500/20 mb-4" />
                      <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded w-48 mx-auto mb-2" />
                      <div className="h-3 bg-stone-200 dark:bg-stone-800 rounded w-64 mx-auto" />
                    </div>
                  </div>
                ) : savedNotes.length === 0 ? (
                  <div className="text-center py-20 bg-[var(--lf-surface)] rounded-3xl border border-[var(--lf-border)] border-dashed card-shadow">
                    <FileText className="h-12 w-12 text-[var(--lf-text-secondary)]/50 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-[var(--lf-text-primary)] mb-2">No notes yet</h3>
                    <p className="text-[14px] text-[var(--lf-text-secondary)]">Go to the AI Workspace, highlight some text, and generate notes to see them here.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedNotes.map((note: SavedNote) => (
                      <div 
                        key={note.id}
                        onClick={() => setSelectedNote(note)}
                        className="group p-6 rounded-3xl bg-[var(--lf-card)] border border-[var(--lf-border)] hover:border-orange-500/50 card-shadow hover:shadow-[0_8px_30px_rgba(249,115,22,0.12)] transition-all cursor-pointer flex flex-col h-full relative overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/10 blur-[60px] rounded-full pointer-events-none" />
                        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-orange-400/8 blur-[50px] rounded-full pointer-events-none" />
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/[0.03] via-transparent to-transparent pointer-events-none" />
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-2 text-[12px] font-medium text-[var(--lf-text-secondary)] bg-[var(--lf-bg)] px-2.5 py-1 rounded-full border border-[var(--lf-border)]">
                            <Clock className="h-3.5 w-3.5" />
                            {new Date(note.createdAt).toLocaleDateString()}
                          </div>
                          <button 
                            onClick={(e) => deleteNote(e, note.id)}
                            className="p-1.5 text-[var(--lf-text-secondary)] hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        
                        <h3 className="text-[18px] font-bold text-[var(--lf-text-primary)] mb-3 line-clamp-2 group-hover:text-[var(--lf-accent)] transition-colors">
                          {note.data.title}
                        </h3>
                        
                        <p className="text-[13px] leading-relaxed text-[var(--lf-text-secondary)] line-clamp-3 mb-6 flex-1">
                          {note.data.summary}
                        </p>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-[var(--lf-border)]">
                          <div className="flex items-center gap-3 text-[12px] font-bold text-[var(--lf-text-secondary)]">
                            <span className="flex items-center gap-1.5"><Lightbulb className="h-3.5 w-3.5 text-amber-500" /> {note.data.keyPoints.length}</span>
                            <span className="flex items-center gap-1.5"><BookOpen className="h-3.5 w-3.5 text-blue-500" /> {(note.data.importantConcepts || note.data.relatedConcepts || []).length}</span>
                          </div>
                          <div className="h-8 w-8 rounded-full bg-orange-500/10 flex items-center justify-center text-[var(--lf-accent)] group-hover:scale-110 transition-transform">
                            <ChevronRight className="h-4 w-4" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex-1 overflow-y-auto p-8 no-scrollbar"
            >
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                  <button 
                    onClick={() => setSelectedNote(null)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--lf-surface)] border border-[var(--lf-border)] hover:bg-[var(--lf-bg)] text-[14px] font-bold text-[var(--lf-text-primary)] transition-all"
                  >
                    <ArrowLeft className="h-4 w-4" /> Back to Notes
                  </button>
                  <button 
                    onClick={triggerDownload}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-[14px] shadow-lg shadow-orange-500/25 transition-all transform hover:scale-105 active:scale-95"
                  >
                    <Download className="h-4 w-4" /> Download PDF
                  </button>
                </div>

                {/* PDF Content Wrapper */}
                <div 
                  ref={contentRef}
                  id="pdf-content" 
                  className="bg-[var(--lf-card)] dark:bg-[#0c0a09] rounded-[2rem] border border-[var(--lf-border)] p-10 md:p-14 card-shadow-lg relative print:shadow-none print:border-none print:p-12 print:w-full print:max-w-none print:m-0 print:block"
                  style={printStyle}
                >
                  {/* Watermark - Shows up on every printed page */}
                  <div className="hidden print:flex fixed inset-0 w-full h-full items-center justify-center pointer-events-none opacity-[0.05] z-0">
                    <img src="/logo.png" className="w-[80%] max-w-[600px] object-contain" alt="Learnflow AI Watermark" />
                  </div>

                  <div className="relative z-10">
                    <div className="text-center pb-8 mb-8 border-b border-[var(--lf-border)]">
                    <h1 className="text-4xl font-extrabold text-[var(--lf-text-primary)] mb-6 leading-tight">
                      {selectedNote.data.title}
                    </h1>
                    <p className="text-[16px] leading-relaxed text-[var(--lf-text-secondary)] max-w-3xl mx-auto italic border-l-4 border-[var(--lf-accent)] pl-6 text-left">
                      {selectedNote.data.summary}
                    </p>
                  </div>

                  <div className="space-y-12 print:space-y-10">
                    <div className="space-y-6 print:break-inside-avoid print:p-4 rounded-xl print:bg-amber-500/5">
                      <h3 className="text-[20px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-3 border-b border-amber-500/20 pb-3">
                        <Lightbulb className="h-6 w-6" /> Key Points
                      </h3>
                      <ul className="space-y-4">
                        {selectedNote.data.keyPoints.map((point: any, i: number) => (
                          <li key={i} className="text-[15px] leading-relaxed text-[var(--lf-text-primary)] flex items-start gap-3">
                            <span className="text-amber-500 mt-1 flex-shrink-0">•</span> {typeof point === "object" && point !== null ? Object.values(point).join(": ") : point}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-6 print:break-inside-avoid print:p-4 rounded-xl print:bg-blue-500/5">
                      <h3 className="text-[20px] font-bold text-blue-600 dark:text-blue-400 flex items-center gap-3 border-b border-blue-500/20 pb-3">
                        <BookOpen className="h-6 w-6" /> Important Concepts
                      </h3>
                      <ul className="space-y-4">
                        {(selectedNote.data.importantConcepts || selectedNote.data.relatedConcepts || []).map((concept: any, i: number) => (
                          <li key={i} className="text-[15px] leading-relaxed text-[var(--lf-text-primary)] flex items-start gap-3">
                            <span className="text-blue-500 mt-1 flex-shrink-0">•</span> {typeof concept === "object" && concept !== null ? Object.values(concept).join(": ") : concept}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-6 print:break-inside-avoid print:p-4 rounded-xl print:bg-emerald-500/5">
                      <h3 className="text-[20px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-3 border-b border-emerald-500/20 pb-3">
                        <GraduationCap className="h-6 w-6" /> Exam Tips
                      </h3>
                      <ul className="space-y-4">
                        {selectedNote.data.examTips.map((tip: any, i: number) => (
                          <li key={i} className="text-[15px] leading-relaxed text-[var(--lf-text-primary)] flex items-start gap-3">
                            <span className="text-emerald-500 mt-1 flex-shrink-0">•</span> {typeof tip === "object" && tip !== null ? Object.values(tip).join(": ") : tip}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-6 print:break-inside-avoid print:p-4 rounded-xl print:bg-purple-500/5">
                      <h3 className="text-[20px] font-bold text-purple-600 dark:text-purple-400 flex items-center gap-3 border-b border-purple-500/20 pb-3">
                        <FileText className="h-6 w-6" /> Revision Notes
                      </h3>
                      <ul className="space-y-4">
                        {selectedNote.data.revisionNotes.map((note: any, i: number) => (
                          <li key={i} className="text-[15px] leading-relaxed text-[var(--lf-text-primary)] flex items-start gap-3">
                            <span className="text-purple-500 mt-1 flex-shrink-0">•</span> {typeof note === "object" && note !== null ? Object.values(note).join(": ") : note}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-16 pt-8 border-t border-[var(--lf-border)] text-center text-[12px] text-[var(--lf-text-secondary)] font-medium opacity-60">
                    Generated by Learnflow AI • {new Date(selectedNote.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
