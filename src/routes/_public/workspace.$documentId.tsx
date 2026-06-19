import { useState, useEffect, useMemo, useRef } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ZoomIn,
  ZoomOut,
  Search,
  ChevronRight,
  Brain,
  HelpCircle,
  Globe,
  Briefcase,
  GitMerge,
  Gamepad2,
  Sparkles,
  CheckCircle2,
  X,
  FileText,
  Copy,
  Notebook,
  Download,
  Lightbulb,
  GraduationCap,
  BookOpen
} from "lucide-react";
import { DashboardLayout } from "../../components/DashboardLayout";
import ReactMarkdown from "react-markdown";
import toast from "react-hot-toast";
import { WorkflowAPI, DocumentAPI, type DocumentMetadata, type GeneratedNotes } from "../../lib/api";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { useReactToPrint } from "react-to-print";

// Configure PDF.js worker using unpkg to strictly match the react-pdf internal version
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export const Route = createFileRoute("/_public/workspace/$documentId")({
  component: WorkspacePage,
});

type FeatureType = "explain" | "notes" | "quiz" | "analogy" | "interview" | "mindmap" | "simulation" | null;

const features = [
  { id: "explain", label: "Explain", icon: Sparkles },
  { id: "notes", label: "Generate Notes", icon: Notebook },
  { id: "quiz", label: "Quiz", icon: HelpCircle },
  { id: "analogy", label: "Analogy", icon: Globe },
  { id: "interview", label: "Interview Qs", icon: Briefcase },
  { id: "mindmap", label: "Mind Map", icon: GitMerge },
  { id: "simulation", label: "Simulation", icon: Gamepad2 },
] as const;

function WorkspacePage() {
  const [activeFeature, setActiveFeature] = useState<FeatureType>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });
  const [highlightedText, setHighlightedText] = useState("");
  const [documentMetadata, setDocumentMetadata] = useState<DocumentMetadata | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1.0);

  // Memoize the file configuration to prevent react-pdf from refreshing endlessly on re-renders
  const pdfFile = useMemo(() => {
    if (!documentMetadata?.fileUrl) return null;
    return {
      url: documentMetadata.fileUrl.startsWith('http') ? documentMetadata.fileUrl : `http://localhost:3000${documentMetadata.fileUrl}`,
      withCredentials: true
    };
  }, [documentMetadata?.fileUrl]);

  // Fetch document metadata on mount
  useEffect(() => {
    const urlParts = window.location.pathname.split("/");
    const docId = urlParts[urlParts.length - 1];
    
    if (docId) {
      DocumentAPI.getDocument(docId)
        .then(doc => setDocumentMetadata(doc))
        .catch(err => toast.error("Failed to load document: " + err.message));
    }
  }, []);

  // Handle text selection
  const handleTextSelect = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      
      setMenuPos({
        x: rect.left + rect.width / 2,
        y: rect.top - 10,
      });
      setHighlightedText(selection.toString());
      setIsMenuOpen(true);
    } else {
      setIsMenuOpen(false);
    }
  };

  const [explanationContent, setExplanationContent] = useState<string>("");
  const [interviewQuestionsContent, setInterviewQuestionsContent] = useState<any>(null);
  const [quizContent, setQuizContent] = useState<any>(null);
  const [quizId, setQuizId] = useState<string | null>(null);
  const [notesContent, setNotesContent] = useState<GeneratedNotes | null>(null);

  const handleFeatureClick = async (featureId: FeatureType) => {
    setIsMenuOpen(false);
    setActiveFeature(featureId);
    
    if (featureId === "explain") {
      if (highlightedText.trim().length < 5) {
        toast.error("Please highlight at least 5 characters to explain.");
        setActiveFeature(null);
        return;
      }
      if (highlightedText.trim().length > 5000) {
        toast.error("Highlighted text is too long (max 5000 characters).");
        setActiveFeature(null);
        return;
      }

      setIsLoading(true);
      try {
        // We can extract documentId from the route path in a real scenario
        // Assuming Route.useParams() provides it:
        const urlParts = window.location.pathname.split("/");
        const docId = urlParts[urlParts.length - 1];
        
        const res = await WorkflowAPI.generateExplanation(docId, highlightedText);
        setExplanationContent(res.explanation);
        toast.success("Explanation generated successfully!");
      } catch (error: any) {
        toast.error(error.message || "Failed to generate explanation");
        setActiveFeature(null);
      } finally {
        setIsLoading(false);
      }
    } else if (featureId === "notes") {
      if (highlightedText.trim().length < 5) {
        toast.error("Please highlight at least 5 characters to generate notes.");
        setActiveFeature(null);
        return;
      }
      if (highlightedText.trim().length > 5000) {
        toast.error("Highlighted text is too long (max 5000 characters).");
        setActiveFeature(null);
        return;
      }

      setIsLoading(true);
      try {
        const urlParts = window.location.pathname.split("/");
        const docId = urlParts[urlParts.length - 1];
        
        const res = await WorkflowAPI.generateNotes(docId, highlightedText);
        setNotesContent(res.notes);
        
        toast.success("Notes generated successfully!");
      } catch (error: any) {
        toast.error(error.message || "Failed to generate notes");
        setActiveFeature(null);
      } finally {
        setIsLoading(false);
      }
    } else if (featureId === "interview") {
      if (highlightedText.trim().length < 5) {
        toast.error("Please highlight at least 5 characters to generate questions.");
        setActiveFeature(null);
        return;
      }
      if (highlightedText.trim().length > 5000) {
        toast.error("Highlighted text is too long (max 5000 characters).");
        setActiveFeature(null);
        return;
      }

      setIsLoading(true);
      try {
        const urlParts = window.location.pathname.split("/");
        const docId = urlParts[urlParts.length - 1];
        
        const res = await WorkflowAPI.generateInterviewQuestions(docId, highlightedText);
        setInterviewQuestionsContent(res.questions);
        toast.success("Interview questions generated successfully!");
      } catch (error: any) {
        toast.error(error.message || "Failed to generate interview questions");
        setActiveFeature(null);
      } finally {
        setIsLoading(false);
      }
    } else if (featureId === "quiz") {
      if (highlightedText.trim().length < 5) {
        toast.error("Please highlight at least 5 characters to generate a quiz.");
        setActiveFeature(null);
        return;
      }
      if (highlightedText.trim().length > 5000) {
        toast.error("Highlighted text is too long (max 5000 characters).");
        setActiveFeature(null);
        return;
      }

      setIsLoading(true);
      try {
        const urlParts = window.location.pathname.split("/");
        const docId = urlParts[urlParts.length - 1];
        
        const res = await WorkflowAPI.generateQuiz(docId, highlightedText);
        setQuizContent(res.quiz);
        setQuizId(res.id || null);
        toast.success("Quiz generated successfully!");
      } catch (error: any) {
        toast.error(error.message || "Failed to generate quiz");
        setActiveFeature(null);
      } finally {
        setIsLoading(false);
      }
    } else {
      // Mock for other features
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    }
  };

  return (
    <DashboardLayout 
      headerTitle={
        <div className="flex items-center gap-2 text-[var(--lf-text-secondary)] text-sm font-medium">
          <Link to="/documents" className="hover:text-[var(--lf-text-primary)] transition-colors">Documents</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-[var(--lf-text-primary)] font-bold truncate max-w-[200px]">
            {documentMetadata ? documentMetadata.title : "Loading Document..."}
          </span>
        </div>
      }
    >
      <div className="flex-1 flex overflow-hidden relative">
        {/* Floating Contextual Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{
                position: 'fixed',
                left: menuPos.x,
                top: menuPos.y,
                transform: 'translate(-50%, -100%)',
                zIndex: 100,
              }}
              className="bg-white/90 dark:bg-black/90 backdrop-blur-xl border border-orange-500/30 shadow-2xl shadow-orange-500/20 rounded-2xl p-2 flex items-center gap-1.5"
            >
              {/* Outer glow ring */}
              <div className="absolute inset-0 rounded-2xl bg-orange-500/5 blur-xl -z-10" />
              {/* Top glow accent */}
              <div className="absolute -top-px left-4 right-4 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />
              
              {/* Bottom arrow */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-white/90 dark:bg-black/90 border-r border-b border-orange-500/20" />
              
              {features.map((feature) => (
                <button
                  key={feature.id}
                  onClick={() => handleFeatureClick(feature.id)}
                  className="flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-xl transition-all duration-300 group min-w-[70px] relative overflow-hidden hover:bg-orange-500/10 hover:shadow-[0_0_20px_rgba(255,122,24,0.25)] active:scale-90"
                >
                  {/* Hover glow background */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-orange-500/0 to-orange-500/0 group-hover:from-orange-500/5 group-hover:to-orange-500/0 transition-all duration-300" />
                  
                  <feature.icon className="h-[18px] w-[18px] text-[var(--lf-text-secondary)] group-hover:text-[var(--lf-accent)] transition-all duration-300 group-hover:scale-110" />
                  <span className="text-[10px] font-bold text-[var(--lf-text-secondary)] group-hover:text-[var(--lf-accent)] transition-colors duration-300 whitespace-nowrap">
                    {feature.label}
                  </span>
                </button>
              ))}
              <div className="w-px h-8 bg-gradient-to-b from-transparent via-orange-500/20 to-transparent mx-1" />
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="p-2 text-[var(--lf-text-secondary)] hover:bg-red-500/10 hover:text-red-500 rounded-xl transition-all duration-200 active:scale-90"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* LEFT SECTION: Document Viewer */}
        <motion.div 
          layout
          initial={false}
          animate={{ width: activeFeature ? "55%" : "100%" }}
          className="border-r border-[var(--lf-border)] flex flex-col bg-[#F3F4F6] dark:bg-[#0c0a09] relative z-10 shrink-0" 
          onMouseUp={handleTextSelect}
        >
          {/* PDF Toolbar */}
          <div className="h-12 border-b border-[var(--lf-border)] bg-[var(--lf-bg)] flex items-center justify-between px-4 shrink-0">
            <div className="flex items-center gap-2">
              <button className="p-1.5 hover:bg-[var(--lf-surface)] rounded-lg text-[var(--lf-text-secondary)]">
                <Search className="h-4 w-4" />
              </button>
              <div className="w-px h-4 bg-[var(--lf-border)] mx-2" />
              <button className="p-1.5 hover:bg-[var(--lf-surface)] rounded-lg text-[var(--lf-text-secondary)]">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-xs font-medium text-[var(--lf-text-primary)] min-w-[60px] text-center">
                Total: {numPages || "-"}
              </span>
              <button className="p-1.5 hover:bg-[var(--lf-surface)] rounded-lg text-[var(--lf-text-secondary)]">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setZoom(z => Math.max(0.5, z - 0.2))}
                className="p-1.5 hover:bg-[var(--lf-surface)] rounded-lg text-[var(--lf-text-secondary)] active:scale-95 transition-transform"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <span className="text-xs font-medium text-[var(--lf-text-primary)] w-[40px] text-center">
                {Math.round(zoom * 100)}%
              </span>
              <button 
                onClick={() => setZoom(z => Math.min(3.0, z + 0.2))}
                className="p-1.5 hover:bg-[var(--lf-surface)] rounded-lg text-[var(--lf-text-secondary)] active:scale-95 transition-transform"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* PDF Page Viewer */}
          <div className="flex-1 relative bg-stone-100 dark:bg-stone-900 overflow-y-auto overflow-x-hidden flex flex-col items-center py-8">
            {pdfFile ? (
              <Document
                file={pdfFile}
                onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                onLoadError={(error) => {
                  console.error("PDF Load Error:", error);
                  toast.error("PDF Error: " + error.message);
                }}
                loading={
                  <div className="flex items-center justify-center p-12 text-stone-500 animate-pulse">
                    Loading PDF Document...
                  </div>
                }
                error={
                  <div className="flex flex-col items-center justify-center p-12 text-red-500">
                    <p className="font-bold text-lg">Failed to load PDF.</p>
                    <p className="text-sm mt-2 opacity-80">This could be a CORS issue with the backend. Check the console or toast message.</p>
                  </div>
                }
              >
                {numPages && Array.from(new Array(numPages), (_, index) => (
                  <Page
                    key={`page_${index + 1}`}
                    pageNumber={index + 1}
                    className="mb-8 shadow-xl border border-stone-200 dark:border-stone-800 rounded-sm overflow-hidden bg-white"
                    scale={zoom}
                    renderTextLayer={true}
                    renderAnnotationLayer={true}
                  />
                ))}
              </Document>
            ) : (
              <div className="flex items-center justify-center h-full text-stone-500">
                Loading Document Metadata...
              </div>
            )}
          </div>
        </motion.div>

        {/* RIGHT SECTION: AI Response Panel */}
        <AnimatePresence initial={false}>
          {activeFeature && (
            <motion.div 
              layout
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "45%", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="bg-[var(--lf-bg)] flex flex-col relative z-10 overflow-hidden shrink-0 border-l border-[var(--lf-border)]"
            >
              <div className="h-12 border-b border-[var(--lf-border)] flex items-center justify-between px-6 shrink-0 bg-[var(--lf-surface)]/50 backdrop-blur-md min-w-[300px]">
                <div className="flex items-center gap-2 text-[var(--lf-text-primary)] font-bold text-[13px]">
                  <Brain className="h-4 w-4 text-[var(--lf-accent)]" />
                  AI Learning Assistant
                </div>
                <button 
                  onClick={() => setActiveFeature(null)}
                  className="p-1.5 text-[var(--lf-text-secondary)] hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                  title="Close Panel"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 no-scrollbar relative min-w-[300px]">
                <AnimatePresence mode="wait">

              {isLoading && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6 flex flex-col items-center justify-center pt-10"
                >
                  <div className="relative w-20 h-20 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border border-orange-500/20 animate-ping duration-1000" />
                    <div className="absolute inset-2 rounded-full border border-orange-500/40 animate-pulse duration-700" />
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-orange-600 to-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.5)] flex items-center justify-center animate-bounce">
                      <Brain className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-[16px] font-bold text-[var(--lf-text-primary)] animate-pulse">
                      Analyzing Context...
                    </h3>
                    <p className="text-[13px] text-[var(--lf-text-secondary)] animate-pulse">
                      Searching the document to generate your explanation.
                    </p>
                  </div>
                  <div className="w-full max-w-xs h-1 bg-[var(--lf-surface)] rounded-full overflow-hidden mt-4">
                    <div className="h-full bg-gradient-to-r from-orange-400 via-orange-500 to-orange-400 animate-slide-right w-[200%]" />
                  </div>
                </motion.div>
              )}

              {activeFeature && !isLoading && (
                <motion.div
                  key="content"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="space-y-6 pb-20"
                >
                  {/* Context Header */}
                  <div className="p-4 rounded-2xl border border-[var(--lf-border)] bg-[var(--lf-surface)] flex gap-4 card-shadow">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0">
                      <FileText className="h-5 w-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-[var(--lf-text-secondary)] uppercase tracking-wider mb-1">
                        Selected Context
                      </p>
                      <p className="text-[13px] text-[var(--lf-text-primary)] italic border-l-2 border-[var(--lf-accent)] pl-3 line-clamp-3">
                        "{highlightedText || "Dynamic Programming is a problem-solving technique..."}"
                      </p>
                    </div>
                  </div>

                  {/* Feature Content */}
                  {activeFeature === "explain" && <FeatureExplain content={explanationContent} />}
                  {activeFeature === "notes" && <FeatureNotes notes={notesContent} loading={isLoading} />}
                  {activeFeature === "quiz" && <FeatureQuiz quiz={quizContent} quizId={quizId} />}
                  {activeFeature === "analogy" && <FeatureAnalogy />}
                  {activeFeature === "interview" && <FeatureInterview questions={interviewQuestionsContent} />}
                  {activeFeature === "mindmap" && <FeatureMindMap />}
                  {activeFeature === "simulation" && <FeatureSimulation />}

                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FEATURE COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function FeatureExplain({ content }: { content: string }) {
  // Parse sections based on markdown headings
  const parseSections = (markdown: string) => {
    const sections: { title: string; content: string }[] = [];
    const regex = /(?:^|\n)#{1,3}\s+(.*?)\n([\s\S]*?)(?=\n#{1,3}\s+|$)/g;
    let match;
    
    // Check if there's text before the first heading
    const firstHeadingIndex = markdown.indexOf("#");
    if (firstHeadingIndex > 0) {
      sections.push({
        title: "Overview",
        content: markdown.substring(0, firstHeadingIndex).trim()
      });
    } else if (firstHeadingIndex === -1 && markdown.trim()) {
       return [{ title: "Explanation", content: markdown.trim() }];
    }

    while ((match = regex.exec(markdown)) !== null) {
      sections.push({ title: match[1].trim(), content: match[2].trim() });
    }
    return sections;
  };

  const sections = content ? parseSections(content) : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2 group cursor-default">
        <div className="relative">
          <Sparkles className="h-6 w-6 text-[var(--lf-text-secondary)] group-hover:text-[var(--lf-accent)] transition-all duration-300" />
          <div className="absolute inset-0 h-6 w-6 bg-orange-500/0 group-hover:bg-orange-500/20 blur-xl rounded-full transition-all duration-300" />
        </div>
        <h2 className="text-2xl font-bold text-[var(--lf-text-primary)]">AI Explanation</h2>
      </div>

      {content ? (
        <div className="space-y-6">
          {sections.map((section, idx) => {
            const isRealWorld = section.title.toLowerCase().includes("real-world") || section.title.toLowerCase().includes("example");
            const isKeyPoints = section.title.toLowerCase().includes("key");
            const isImportantNotes = section.title.toLowerCase().includes("important") || section.title.toLowerCase().includes("note");

            let containerClass = "";
            let titleIcon = null;
            let titleClass = "text-[16px] font-bold text-[var(--lf-text-primary)] mb-3";

            if (isRealWorld) {
              containerClass = "p-5 rounded-2xl bg-orange-500/10 border border-orange-500/30 card-shadow-lg";
              titleIcon = <Globe className="h-5 w-5 text-orange-600 dark:text-orange-400" />;
              titleClass = "text-[15px] font-bold flex items-center gap-2 mb-3 text-orange-700 dark:text-orange-400";
            } else if (isKeyPoints) {
              containerClass = "p-5 rounded-2xl bg-[var(--lf-surface)] border border-[var(--lf-border)] card-shadow";
              titleIcon = <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
              titleClass = "text-[15px] font-bold flex items-center gap-2 mb-3 text-[var(--lf-text-primary)]";
            } else if (isImportantNotes) {
              containerClass = "p-5 rounded-2xl bg-red-500/5 border border-red-500/20";
              titleIcon = <Brain className="h-5 w-5 text-red-500" />;
              titleClass = "text-[15px] font-bold flex items-center gap-2 mb-3 text-red-600 dark:text-red-400";
            } else {
              containerClass = "text-[15px] leading-relaxed text-[var(--lf-text-primary)]";
            }

            return (
              <div key={idx} className={containerClass}>
                {titleIcon ? (
                  <h3 className={titleClass}>
                    {titleIcon} {section.title}
                  </h3>
                ) : (
                  <h3 className={titleClass}>{section.title}</h3>
                )}
                <div className="prose prose-sm dark:prose-invert max-w-none prose-orange prose-p:leading-relaxed prose-li:my-1">
                  <ReactMarkdown>{section.content}</ReactMarkdown>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-[14px] text-[var(--lf-text-secondary)] italic">
          No explanation generated yet.
        </div>
      )}
    </div>
  );
}

function FeatureNotes({
  notes,
  loading,
}: {
  notes: GeneratedNotes | null;
  loading: boolean;
}) {
  const contentRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = useReactToPrint({
    contentRef,
    documentTitle: notes?.title ? `${notes.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_notes` : "Study_Notes",
    onAfterPrint: () => toast.success("PDF saved successfully!", { id: "pdf-toast" }),
    onPrintError: () => toast.error("Failed to generate PDF.", { id: "pdf-toast" }),
  });

  const handleDownload = () => {
    toast.loading("Opening Print Dialog (Save as PDF)...", { id: "pdf-toast", duration: 2000 });
    handleDownloadPDF();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8 opacity-60">
        <Notebook className="h-16 w-16 mb-4 text-[var(--lf-text-secondary)] animate-pulse" />
        <p className="text-lg font-medium text-[var(--lf-text-secondary)]">Generating your notes...</p>
      </div>
    );
  }

  if (!notes) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8 opacity-60">
        <Notebook className="h-16 w-16 mb-4 text-[var(--lf-text-secondary)]" />
        <p className="text-lg font-medium text-[var(--lf-text-secondary)]">Highlight text and click Generate Notes to see them here.</p>
      </div>
    );
  }

  const printStyle: React.CSSProperties = { WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-[var(--lf-border)] pb-4">
        <div className="flex items-center gap-3">
          <Notebook className="h-6 w-6 text-[var(--lf-accent)]" />
          <h2 className="text-2xl font-bold text-[var(--lf-text-primary)]">AI Generated Notes</h2>
        </div>
        <button 
          onClick={handleDownload}
          className="flex items-center gap-2 px-3 py-1.5 bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 dark:text-orange-400 rounded-lg text-[13px] font-bold transition-colors"
        >
          <Download className="h-4 w-4" /> Download
        </button>
      </div>

      <div 
        ref={contentRef} 
        id="pdf-content-workspace" 
        className="p-6 md:p-10 rounded-3xl bg-[var(--lf-surface)] border border-[var(--lf-border)] card-shadow-lg space-y-8 relative print:shadow-none print:border-none print:p-12 print:w-full print:max-w-none print:m-0 print:block"
        style={printStyle}
      >
        {/* Watermark - Shows up on every printed page */}
        <div className="hidden print:flex fixed inset-0 w-full h-full items-center justify-center pointer-events-none opacity-[0.05] z-0">
          <img src="/logo.png" className="w-[80%] max-w-[600px] object-contain" alt="Learnflow AI Watermark" />
        </div>

        <div className="relative z-10 space-y-8">
          <div className="text-center pb-6 border-b border-[var(--lf-border)]">
          <h1 className="text-3xl font-extrabold text-[var(--lf-text-primary)] mb-4">{notes.title}</h1>
          <p className="text-[15px] leading-relaxed text-[var(--lf-text-secondary)] max-w-2xl mx-auto italic">
            "{notes.summary}"
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-1 print:gap-10">
          <div className="space-y-4 p-5 rounded-2xl bg-amber-500/5 border border-amber-500/10 transition-colors print:break-inside-avoid print:p-6">
            <h3 className="text-[16px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
              <Lightbulb className="h-5 w-5" /> Key Points
            </h3>
            <ul className="space-y-2">
              {notes.keyPoints.map((point, i) => (
                <li key={i} className="text-[14px] text-[var(--lf-text-primary)] flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">•</span> {point}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4 p-5 rounded-2xl bg-blue-500/5 border border-blue-500/10 transition-colors print:break-inside-avoid print:p-6">
            <h3 className="text-[16px] font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
              <BookOpen className="h-5 w-5" /> Important Concepts
            </h3>
            <ul className="space-y-2">
              {(notes.importantConcepts || notes.relatedConcepts || []).map((concept, i) => (
                <li key={i} className="text-[14px] text-[var(--lf-text-primary)] flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span> {concept}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4 p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 transition-colors print:break-inside-avoid print:p-6">
            <h3 className="text-[16px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
              <GraduationCap className="h-5 w-5" /> Exam Tips
            </h3>
            <ul className="space-y-2">
              {notes.examTips.map((tip, i) => (
                <li key={i} className="text-[14px] text-[var(--lf-text-primary)] flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">•</span> {tip}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4 p-5 rounded-2xl bg-purple-500/5 border border-purple-500/10 transition-colors print:break-inside-avoid print:p-6">
            <h3 className="text-[16px] font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
              <FileText className="h-5 w-5" /> Revision Notes
            </h3>
            <ul className="space-y-2">
              {notes.revisionNotes.map((note, i) => (
                <li key={i} className="text-[14px] text-[var(--lf-text-primary)] flex items-start gap-2">
                  <span className="text-purple-500 mt-0.5">•</span> {note}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

function FeatureQuiz(props: { quiz: any; quizId: string | null }) {
  const { quiz, quizId } = props;
  const [mcqAnswers, setMcqAnswers] = useState<Record<number, string>>({});
  const [tfAnswers, setTfAnswers] = useState<Record<number, boolean>>({});
  const [shortAnswers, setShortAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!quiz) {
    return (
      <div className="text-[14px] text-[var(--lf-text-secondary)] italic">
        No quiz generated yet.
      </div>
    );
  }

  const { score, total } = useMemo(() => {
    let s = 0;
    let t = (quiz.mcqs?.length || 0) + (quiz.trueFalse?.length || 0);
    quiz.mcqs?.forEach((q: any, i: number) => {
      if (mcqAnswers[i] === q.correctAnswer) s++;
    });
    quiz.trueFalse?.forEach((q: any, i: number) => {
      if (tfAnswers[i] === q.answer) s++;
    });
    return { score: s, total: t };
  }, [quiz, mcqAnswers, tfAnswers]);

  const handleSubmit = async () => {
    setIsSubmitted(true);
    if (quizId) {
      const topics = new Set<string>();
      quiz.mcqs?.forEach((q: any, i: number) => {
        if (mcqAnswers[i] !== q.correctAnswer && q.topic) topics.add(q.topic);
      });
      quiz.trueFalse?.forEach((q: any, i: number) => {
        if (tfAnswers[i] !== q.answer && q.topic) topics.add(q.topic);
      });
      const topicsToImprove = Array.from(topics);
      try {
        await WorkflowAPI.submitQuiz(quizId, score, total, topicsToImprove);
        toast.success("Quiz results saved!");
      } catch (err: any) {
        toast.error(err.message || "Failed to save quiz results");
        console.error("Failed to save quiz results", err);
        setIsSubmitted(false); // Revert submission state so they can try again
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <HelpCircle className="h-6 w-6 text-[var(--lf-accent)]" />
          <h2 className="text-2xl font-bold text-[var(--lf-text-primary)]">AI Quiz</h2>
        </div>
        {isSubmitted && (
          <div className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
            Score: {score} / {total}
          </div>
        )}
      </div>

      {/* Multiple Choice Section */}
      {quiz.mcqs && quiz.mcqs.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-[var(--lf-text-secondary)] uppercase tracking-wider">Multiple Choice</h3>
          {quiz.mcqs.map((q: any, i: number) => (
            <div key={`mcq-${i}`} className="p-6 rounded-3xl bg-[var(--lf-surface)] border border-[var(--lf-border)] card-shadow">
              <p className="text-[15px] font-medium text-[var(--lf-text-primary)] mb-4">
                <span className="text-[var(--lf-accent)] font-bold mr-2">{i + 1}.</span> {q.question}
              </p>
              <div className="space-y-2">
                {q.options.map((opt: string, optIdx: number) => {
                  const isSelected = mcqAnswers[i] === opt;
                  const isCorrect = q.correctAnswer === opt;
                  
                  let btnClass = "border-[var(--lf-border)] bg-[var(--lf-bg)] hover:border-orange-500/50";
                  if (isSubmitted) {
                    if (isCorrect) btnClass = "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400";
                    else if (isSelected) btnClass = "border-red-500 bg-red-500/10 text-red-700 dark:text-red-400";
                    else btnClass = "border-[var(--lf-border)] bg-[var(--lf-bg)] opacity-50";
                  } else if (isSelected) {
                    btnClass = "border-orange-500 bg-orange-500/10 text-[var(--lf-accent)] ring-1 ring-orange-500/20";
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => !isSubmitted && setMcqAnswers(prev => ({ ...prev, [i]: opt }))}
                      disabled={isSubmitted}
                      className={`w-full text-left px-4 py-3 rounded-xl border text-[14px] transition-all flex items-center justify-between ${btnClass}`}
                    >
                      <span>{opt}</span>
                      {isSubmitted && isCorrect && <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />}
                      {isSubmitted && isSelected && !isCorrect && <X className="h-4 w-4 text-red-500 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* True / False Section */}
      {quiz.trueFalse && quiz.trueFalse.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-[var(--lf-text-secondary)] uppercase tracking-wider">True or False</h3>
          {quiz.trueFalse.map((q: any, i: number) => {
            const isCorrectAnswer = q.answer;
            const userAnswer = tfAnswers[i];
            
            return (
              <div key={`tf-${i}`} className="p-6 rounded-3xl bg-[var(--lf-surface)] border border-[var(--lf-border)] card-shadow flex flex-col md:flex-row md:items-center justify-between gap-4">
                <p className="text-[15px] font-medium text-[var(--lf-text-primary)]">
                  <span className="text-[var(--lf-accent)] font-bold mr-2">{i + 1}.</span> {q.question}
                </p>
                <div className="flex gap-2 shrink-0">
                  {[true, false].map((val) => {
                    const isSelected = userAnswer === val;
                    const isCorrect = isCorrectAnswer === val;
                    
                    let btnClass = "border-[var(--lf-border)] bg-[var(--lf-bg)] hover:bg-[var(--lf-surface)]";
                    if (isSubmitted) {
                      if (isCorrect) btnClass = "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400";
                      else if (isSelected) btnClass = "border-red-500 bg-red-500/10 text-red-700 dark:text-red-400";
                      else btnClass = "border-[var(--lf-border)] bg-[var(--lf-bg)] opacity-50";
                    } else if (isSelected) {
                      btnClass = "border-orange-500 bg-orange-500/10 text-[var(--lf-accent)]";
                    }

                    return (
                      <button
                        key={String(val)}
                        onClick={() => !isSubmitted && setTfAnswers(prev => ({ ...prev, [i]: val }))}
                        disabled={isSubmitted}
                        className={`px-6 py-2 rounded-lg border text-sm font-bold transition-all ${btnClass}`}
                      >
                        {val ? "True" : "False"}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Short Answer Section */}
      {quiz.shortAnswer && quiz.shortAnswer.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-[var(--lf-text-secondary)] uppercase tracking-wider">Short Answer</h3>
          {quiz.shortAnswer.map((q: any, i: number) => (
            <div key={`sa-${i}`} className="p-6 rounded-3xl bg-[var(--lf-surface)] border border-[var(--lf-border)] card-shadow">
              <p className="text-[15px] font-medium text-[var(--lf-text-primary)] mb-4">
                <span className="text-[var(--lf-accent)] font-bold mr-2">{i + 1}.</span> {q.question}
              </p>
              <textarea
                value={shortAnswers[i] || ""}
                onChange={(e) => setShortAnswers(prev => ({ ...prev, [i]: e.target.value }))}
                disabled={isSubmitted}
                placeholder="Type your answer here..."
                className="w-full p-4 rounded-xl bg-[var(--lf-bg)] border border-[var(--lf-border)] text-[14px] text-[var(--lf-text-primary)] focus:outline-none focus:border-orange-500/50 resize-none min-h-[100px] disabled:opacity-70"
              />
              {isSubmitted && (
                <div className="mt-4 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <p className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-1">Expected Answer</p>
                  <p className="text-[14px] text-blue-700 dark:text-blue-400">{q.expectedAnswer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {!isSubmitted && (
        <button
          onClick={handleSubmit}
          className="w-full py-4 rounded-2xl bg-[var(--lf-accent)] text-white font-bold text-[15px] shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_25px_rgba(249,115,22,0.5)] transition-all transform hover:-translate-y-0.5 active:translate-y-0"
        >
          Submit Quiz
        </button>
      )}
    </div>
  );
}

function FeatureAnalogy() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <Globe className="h-6 w-6 text-[var(--lf-accent)]" />
        <h2 className="text-2xl font-bold text-[var(--lf-text-primary)]">Real World Analogy</h2>
      </div>

      <div className="p-8 rounded-3xl bg-gradient-to-br from-orange-500/10 to-[var(--lf-surface)] border border-orange-500/20 card-shadow-lg relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-orange-500/20 blur-3xl rounded-full" />
        
        <p className="text-[16px] leading-relaxed text-[var(--lf-text-primary)] font-medium mb-6 relative z-10">
          Imagine solving a maze and keeping a notebook of every path you've already explored.
        </p>
        
        <p className="text-[15px] leading-relaxed text-[var(--lf-text-secondary)] mb-6 relative z-10">
          Instead of exploring the same dead-end path again when you reach a crossroad, you simply refer to your notebook.
        </p>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 text-white text-[13px] font-bold shadow-lg shadow-orange-500/20">
          <Sparkles className="h-4 w-4" /> That is exactly how Dynamic Programming works.
        </div>
      </div>
    </div>
  );
}

function FeatureInterview({ questions }: { questions: any }) {
  const [activeTab, setActiveTab] = useState<"basic" | "intermediate" | "advanced">("basic");
  
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  if (!questions) {
    return (
      <div className="text-[14px] text-[var(--lf-text-secondary)] italic">
        No questions generated yet.
      </div>
    );
  }

  const tabs = [
    { id: "basic", label: "Basic" },
    { id: "intermediate", label: "Intermediate" },
    { id: "advanced", label: "Advanced" },
  ] as const;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <Briefcase className="h-6 w-6 text-[var(--lf-accent)]" />
        <h2 className="text-2xl font-bold text-[var(--lf-text-primary)]">Interview Questions</h2>
      </div>

      <div className="flex gap-2 p-1 bg-[var(--lf-surface)] border border-[var(--lf-border)] rounded-xl">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === tab.id
                ? "bg-[var(--lf-bg)] text-[var(--lf-text-primary)] shadow-sm border border-[var(--lf-border)]"
                : "text-[var(--lf-text-secondary)] hover:text-[var(--lf-text-primary)] hover:bg-[var(--lf-surface)]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {questions[activeTab]?.map((item: { q: string; a: string }, i: number) => (
          <details key={i} className="group p-5 rounded-2xl bg-[var(--lf-surface)] border border-[var(--lf-border)] hover:border-orange-500/50 transition-all card-shadow">
            <summary className="flex items-start justify-between gap-4 cursor-pointer list-none">
              <div className="flex items-start gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded bg-orange-500/10 text-[var(--lf-accent)] text-[12px] font-bold shrink-0 mt-0.5">
                  Q{i+1}
                </span>
                <p className="text-[14px] leading-relaxed text-[var(--lf-text-primary)] font-medium">
                  {item.q}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => { e.preventDefault(); handleCopy(item.q + "\n\nAnswer:\n" + item.a); }}
                  className="p-2 rounded-lg bg-[var(--lf-bg)] border border-[var(--lf-border)] text-[var(--lf-text-secondary)] hover:text-[var(--lf-accent)] hover:border-[var(--lf-accent)] opacity-0 group-hover:opacity-100 transition-all"
                  title="Copy Q&A"
                >
                  <Copy className="h-4 w-4" />
                </button>
                <ChevronRight className="h-5 w-5 text-[var(--lf-text-secondary)] group-open:rotate-90 transition-transform shrink-0" />
              </div>
            </summary>
            <div className="pt-4 mt-4 border-t border-[var(--lf-border)] pl-9">
              <p className="text-[13px] leading-relaxed text-[var(--lf-text-secondary)]">
                <span className="font-bold text-[var(--lf-text-primary)] mb-1 block">Answer:</span>
                {item.a}
              </p>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}

function FeatureMindMap() {
  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-2 shrink-0">
        <GitMerge className="h-6 w-6 text-[var(--lf-accent)]" />
        <h2 className="text-2xl font-bold text-[var(--lf-text-primary)]">AI Mind Map</h2>
      </div>

      <div className="flex-1 rounded-3xl bg-[var(--lf-surface)] border border-[var(--lf-border)] card-shadow flex items-center justify-center p-8 min-h-[400px]">
        {/* Simple CSS-based mind map representation */}
        <div className="flex items-center gap-8">
          <div className="px-6 py-4 rounded-2xl bg-orange-500 text-white font-bold card-shadow-lg">
            Dynamic Programming
          </div>
          
          <div className="flex flex-col gap-6 relative">
            {/* Connecting Lines */}
            <div className="absolute right-[100%] top-[20px] bottom-[20px] w-8 border-l-2 border-t-2 border-b-2 border-orange-500/30 rounded-l-xl" />
            <div className="absolute right-[100%] top-1/2 w-8 border-t-2 border-orange-500/30" />
            
            <div className="px-5 py-3 rounded-xl bg-[var(--lf-card)] border border-[var(--lf-border)] card-shadow font-medium text-[13px] text-[var(--lf-text-primary)] relative">
              Memoization (Top-Down)
            </div>
            <div className="px-5 py-3 rounded-xl bg-[var(--lf-card)] border border-[var(--lf-border)] card-shadow font-medium text-[13px] text-[var(--lf-text-primary)] relative">
              Tabulation (Bottom-Up)
            </div>
            <div className="px-5 py-3 rounded-xl bg-[var(--lf-card)] border border-[var(--lf-border)] card-shadow font-medium text-[13px] text-[var(--lf-text-primary)] relative">
              Optimal Substructure
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureSimulation() {
  const [step, setStep] = useState(0);
  const arr = [2, 4, 8, 12, 16, 20];
  const target = 16;
  
  // Simulation steps for target=16
  // Step 0: Initial
  // Step 1: Mid=8 (index 2). 8 < 16. Eliminate left.
  // Step 2: Mid=16 (index 4). Found!
  
  const getBoxStyle = (idx: number) => {
    if (step === 0) return "bg-[var(--lf-surface)] border-[var(--lf-border)] text-[var(--lf-text-primary)]";
    if (step === 1) {
      if (idx < 2) return "bg-stone-500/10 border-stone-500/20 text-stone-500/50 line-through"; // Eliminated
      if (idx === 2) return "bg-red-500/20 border-red-500 text-red-600 dark:text-red-400"; // Mid (too small)
      return "bg-[var(--lf-surface)] border-[var(--lf-border)] text-[var(--lf-text-primary)]"; // Remaining
    }
    if (step === 2) {
      if (idx <= 2) return "bg-stone-500/10 border-stone-500/20 text-stone-500/50 line-through";
      if (idx === 4) return "bg-emerald-500 border-emerald-500 text-white scale-110 shadow-lg shadow-emerald-500/30"; // Found
      return "bg-[var(--lf-surface)] border-[var(--lf-border)] text-[var(--lf-text-primary)]";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <Gamepad2 className="h-6 w-6 text-[var(--lf-accent)]" />
        <h2 className="text-2xl font-bold text-[var(--lf-text-primary)]">Interactive Simulation</h2>
      </div>
      
      <p className="text-[14px] text-[var(--lf-text-secondary)]">Binary Search Simulation</p>

      <div className="p-8 rounded-3xl bg-[var(--lf-card)] border border-[var(--lf-border)] card-shadow-lg text-center">
        <p className="text-[16px] font-bold text-[var(--lf-text-primary)] mb-8">
          Target Element: <span className="text-[var(--lf-accent)] px-3 py-1 bg-orange-500/10 rounded-lg">{target}</span>
        </p>
        
        <div className="flex justify-center gap-3 mb-8">
          {arr.map((num, i) => (
            <motion.div
              key={i}
              layout
              className={`w-12 h-12 flex flex-col items-center justify-center rounded-xl border-2 font-bold text-[16px] transition-all duration-500 ${getBoxStyle(i)}`}
            >
              {num}
              <span className="text-[9px] font-normal opacity-50 absolute -bottom-5">idx:{i}</span>
            </motion.div>
          ))}
        </div>

        <div className="h-20 flex items-center justify-center mb-6">
          {step === 0 && <p className="text-[14px] text-[var(--lf-text-secondary)]">Finding middle element...</p>}
          {step === 1 && <p className="text-[14px] text-[var(--lf-text-secondary)]">Middle is 8. Target 16 {">"} 8.<br/>Eliminating left half.</p>}
          {step === 2 && <p className="text-[15px] font-bold text-emerald-500">Target 16 found at index 4!</p>}
        </div>

        <div className="flex justify-center gap-4">
          <button 
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className="px-6 py-2 rounded-xl bg-[var(--lf-surface)] border border-[var(--lf-border)] font-semibold text-[13px] disabled:opacity-50"
          >
            Previous Step
          </button>
          <button 
            onClick={() => setStep(step === 2 ? 0 : step + 1)}
            className="px-6 py-2 rounded-xl bg-[var(--lf-accent)] text-white font-semibold text-[13px] shadow-lg shadow-orange-500/25"
          >
            {step === 2 ? "Reset" : "Next Step"}
          </button>
        </div>
      </div>
    </div>
  );
}
