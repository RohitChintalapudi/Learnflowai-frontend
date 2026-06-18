import { useState, useEffect, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ZoomIn,
  ZoomOut,
  Search,
  ChevronRight,
  Brain,
  StickyNote,
  HelpCircle,
  Globe,
  Briefcase,
  GitMerge,
  Gamepad2,
  Sparkles,
  CheckCircle2,
  X,
  FileText
} from "lucide-react";
import { DashboardLayout } from "../../components/DashboardLayout";
import ReactMarkdown from "react-markdown";
import toast from "react-hot-toast";
import { WorkflowAPI, DocumentAPI, type DocumentMetadata } from "../../lib/api";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Configure PDF.js worker using unpkg to strictly match the react-pdf internal version
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export const Route = createFileRoute("/_public/workspace/$documentId")({
  component: WorkspacePage,
});

type FeatureType = "explain" | "notes" | "quiz" | "analogy" | "interview" | "mindmap" | "simulation" | null;

const features = [
  { id: "explain", label: "Explain", icon: Sparkles },
  { id: "notes", label: "Notes", icon: StickyNote },
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
              className="bg-white/80 dark:bg-black/80 backdrop-blur-xl border border-[var(--lf-border)] shadow-2xl rounded-2xl p-1.5 flex items-center gap-1"
            >
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-white/80 dark:border-t-black/80 backdrop-blur-xl" />
              
              {features.map((feature) => (
                <button
                  key={feature.id}
                  onClick={() => handleFeatureClick(feature.id)}
                  className={`flex flex-col items-center gap-1.5 px-3 py-2 rounded-xl transition-all group min-w-[70px] ${
                    feature.id === "explain"
                      ? "hover:bg-orange-500/20 text-orange-600 dark:text-orange-400 hover:shadow-[0_0_15px_rgba(249,115,22,0.4)]"
                      : "hover:bg-orange-500/10 hover:text-[var(--lf-accent)] text-[var(--lf-text-secondary)]"
                  }`}
                >
                  <feature.icon className={`h-4 w-4 transition-colors ${
                    feature.id === "explain"
                      ? "text-orange-500 animate-pulse"
                      : "text-[var(--lf-text-secondary)] group-hover:text-[var(--lf-accent)]"
                  }`} />
                  <span className={`text-[10px] font-bold transition-colors ${
                    feature.id === "explain"
                      ? "text-orange-600 dark:text-orange-400"
                      : "text-[var(--lf-text-secondary)] group-hover:text-[var(--lf-accent)]"
                  }`}>
                    {feature.id === "explain" ? "✨ Explain Concept" : feature.label}
                  </span>
                </button>
              ))}
              <div className="w-px h-8 bg-[var(--lf-border)] mx-1" />
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="p-2 text-[var(--lf-text-secondary)] hover:bg-red-500/10 hover:text-red-500 rounded-xl transition-colors"
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
                  <div className="p-4 rounded-2xl border border-[var(--lf-border)] bg-[var(--lf-surface)] flex gap-4">
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
                  {activeFeature === "notes" && <FeatureNotes />}
                  {activeFeature === "quiz" && <FeatureQuiz />}
                  {activeFeature === "analogy" && <FeatureAnalogy />}
                  {activeFeature === "interview" && <FeatureInterview />}
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
      <div className="flex items-center gap-3 mb-2">
        <Sparkles className="h-6 w-6 text-[var(--lf-accent)]" />
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
              containerClass = "p-5 rounded-2xl bg-orange-500/10 border border-orange-500/30 shadow-sm shadow-orange-500/10";
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

function FeatureNotes() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <StickyNote className="h-6 w-6 text-[var(--lf-accent)]" />
          <h2 className="text-2xl font-bold text-[var(--lf-text-primary)]">Smart Notes</h2>
        </div>
        <button className="text-[12px] font-bold text-[var(--lf-accent)] hover:underline">Save Note</button>
      </div>

      <div className="prose prose-sm dark:prose-invert max-w-none prose-orange">
        <h3>Topic Summary</h3>
        <ul>
          <li>Dynamic Programming optimizes recursive solutions.</li>
          <li>Uses memoization (top-down) or tabulation (bottom-up).</li>
          <li>Commonly used in optimization problems like shortest path or knapsack.</li>
        </ul>
        
        <h3>Key Formula Concepts</h3>
        <ul>
          <li><strong>State:</strong> What subproblem are we solving?</li>
          <li><strong>Transition:</strong> How does one subproblem relate to another?</li>
          <li><strong>Base Case:</strong> What is the simplest subproblem?</li>
        </ul>
      </div>
    </div>
  );
}

function FeatureQuiz() {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <HelpCircle className="h-6 w-6 text-[var(--lf-accent)]" />
        <h2 className="text-2xl font-bold text-[var(--lf-text-primary)]">AI Quiz</h2>
      </div>

      <div className="p-6 rounded-3xl bg-[var(--lf-card)] border border-[var(--lf-border)] card-shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <span className="text-[12px] font-bold text-[var(--lf-accent)] bg-orange-500/10 px-3 py-1 rounded-full">Question 1 of 3</span>
        </div>
        
        <p className="text-[16px] font-bold text-[var(--lf-text-primary)] mb-6">
          Which technique stores previously computed results to avoid redundant calculations?
        </p>

        <div className="space-y-3">
          {["Greedy Algorithms", "Memoization", "Depth First Search", "Breadth First Search"].map((opt, i) => {
            const isCorrect = i === 1;
            const isSelected = selected === i;
            let btnClass = "border-[var(--lf-border)] bg-[var(--lf-surface)] hover:border-orange-500/50 hover:bg-[var(--lf-bg)]";
            
            if (submitted) {
              if (isCorrect) btnClass = "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
              else if (isSelected) btnClass = "border-red-500 bg-red-500/10 text-red-600 dark:text-red-400";
              else btnClass = "border-[var(--lf-border)] bg-[var(--lf-surface)] opacity-50";
            } else if (isSelected) {
              btnClass = "border-orange-500 bg-orange-500/10 text-[var(--lf-accent)] ring-2 ring-orange-500/20";
            }

            return (
              <button
                key={i}
                onClick={() => !submitted && setSelected(i)}
                disabled={submitted}
                className={`w-full text-left px-5 py-4 rounded-xl border text-[14px] font-medium transition-all duration-200 flex items-center justify-between ${btnClass}`}
              >
                <span><span className="font-bold opacity-50 mr-3">{["A", "B", "C", "D"][i]}.</span> {opt}</span>
                {submitted && isCorrect && <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
                {submitted && isSelected && !isCorrect && <X className="h-5 w-5 text-red-500" />}
              </button>
            );
          })}
        </div>

        {submitted && (
          <div className="mt-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <p className="text-[13px] text-emerald-700 dark:text-emerald-400 font-medium">
              <strong>Correct!</strong> Memoization is the top-down DP approach that caches the results of function calls.
            </p>
          </div>
        )}

        <button 
          onClick={() => setSubmitted(true)}
          disabled={selected === null || submitted}
          className="w-full mt-6 py-3 rounded-xl bg-[var(--lf-accent)] text-white text-[14px] font-bold disabled:opacity-50 transition-opacity"
        >
          {submitted ? "Next Question" : "Submit Answer"}
        </button>
      </div>
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

      <div className="p-8 rounded-3xl bg-gradient-to-br from-orange-500/10 to-[var(--lf-surface)] border border-orange-500/20 relative overflow-hidden">
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

function FeatureInterview() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <Briefcase className="h-6 w-6 text-[var(--lf-accent)]" />
        <h2 className="text-2xl font-bold text-[var(--lf-text-primary)]">Interview Questions</h2>
      </div>

      <div className="space-y-4">
        {[
          { q: "What is Dynamic Programming?", a: "DP is a method for solving complex problems by breaking them down into simpler subproblems and storing the results to avoid duplicate work." },
          { q: "Difference between Memoization and Tabulation?", a: "Memoization is top-down recursion with caching. Tabulation is bottom-up iteration building a table of solutions." },
          { q: "When should DP be preferred over Greedy?", a: "When the problem requires finding a global optimum and greedy choices might only yield a local optimum (e.g., 0/1 Knapsack problem)." },
        ].map((item, i) => (
          <details key={i} className="group p-5 rounded-2xl bg-[var(--lf-surface)] border border-[var(--lf-border)] cursor-pointer">
            <summary className="text-[15px] font-bold text-[var(--lf-text-primary)] list-none flex items-center justify-between">
              <span className="flex items-center gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded bg-orange-500/10 text-[var(--lf-accent)] text-[12px]">{i+1}</span>
                {item.q}
              </span>
              <ChevronRight className="h-5 w-5 text-[var(--lf-text-secondary)] group-open:rotate-90 transition-transform" />
            </summary>
            <div className="pt-4 mt-4 border-t border-[var(--lf-border)] text-[14px] leading-relaxed text-[var(--lf-text-secondary)]">
              {item.a}
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

      <div className="flex-1 rounded-3xl bg-[var(--lf-surface)] border border-[var(--lf-border)] flex items-center justify-center p-8 min-h-[400px]">
        {/* Simple CSS-based mind map representation */}
        <div className="flex items-center gap-8">
          <div className="px-6 py-4 rounded-2xl bg-orange-500 text-white font-bold shadow-lg shadow-orange-500/30">
            Dynamic Programming
          </div>
          
          <div className="flex flex-col gap-6 relative">
            {/* Connecting Lines */}
            <div className="absolute right-[100%] top-[20px] bottom-[20px] w-8 border-l-2 border-t-2 border-b-2 border-orange-500/30 rounded-l-xl" />
            <div className="absolute right-[100%] top-1/2 w-8 border-t-2 border-orange-500/30" />
            
            <div className="px-5 py-3 rounded-xl bg-[var(--lf-card)] border border-[var(--lf-border)] shadow-sm font-medium text-[13px] text-[var(--lf-text-primary)] relative">
              Memoization (Top-Down)
            </div>
            <div className="px-5 py-3 rounded-xl bg-[var(--lf-card)] border border-[var(--lf-border)] shadow-sm font-medium text-[13px] text-[var(--lf-text-primary)] relative">
              Tabulation (Bottom-Up)
            </div>
            <div className="px-5 py-3 rounded-xl bg-[var(--lf-card)] border border-[var(--lf-border)] shadow-sm font-medium text-[13px] text-[var(--lf-text-primary)] relative">
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
