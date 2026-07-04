import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { 
  ReactFlow, 
  ReactFlowProvider, 
  Controls, 
  Background, 
  useNodesState, 
  useEdgesState, 
  useReactFlow,
  MarkerType,
  type Node,
  type Edge
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import * as dagre from "dagre";
import { CustomMindMapNode } from "../../components/CustomMindMapNode";
import { toPng } from "html-to-image";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
  BookOpen,
  Film,
  Baby,
  Swords,
  ArrowRight
} from "lucide-react";
import { DashboardLayout } from "../../components/DashboardLayout";
import ReactMarkdown from "react-markdown";
import toast from "react-hot-toast";
import { WorkflowAPI, DocumentAPI, BACKEND_URL, type GeneratedNotes } from "../../lib/api";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { DocxViewer } from "../../components/DocxViewer";
import { PptxViewer } from "../../components/PptxViewer";
import { useScrollPageNavigation } from "../../hooks/useScrollPageNavigation";
import { useReactToPrint } from "react-to-print";
import { SimulationGenerator } from "../../components/SimulationGenerator";

// Configure PDF.js worker using unpkg to strictly match the react-pdf internal version
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export const Route = createFileRoute("/_authenticated/workspace/$documentId")({
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
  const queryClient = useQueryClient();
  const [activeFeature, setActiveFeature] = useState<FeatureType>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });
  const [highlightedText, setHighlightedText] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [zoom, setZoom] = useState(1.0);

  const { documentId: docId } = Route.useParams();

  const { data: documentMetadata, isError: isMetadataError, error: metadataError } = useQuery({
    queryKey: ['document', docId],
    queryFn: async () => {
      if (!docId) throw new Error("No document ID specified");
      return await DocumentAPI.getDocument(docId);
    },
    enabled: !!docId,
    retry: 1,
  });

  const { data: txtContent, isError: isTxtError, error: txtError, isLoading: isTxtLoading } = useQuery({
    queryKey: ['text-file', docId],
    queryFn: async () => {
      if (!docId) throw new Error("No document ID specified");
      const response = await fetch(`${BACKEND_URL}/api/documents/${docId}/download`, {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch text file (status ${response.status})`);
      }
      return await response.text();
    },
    enabled: !!docId && documentMetadata?.fileType === "txt",
    retry: 1,
  });

  const safeFileDownloadUrl = useMemo(() => {
    if (!docId) return null;
    return `${BACKEND_URL}/api/documents/${docId}/download`;
  }, [docId]);

  const handleDownloadDocument = async () => {
    if (!docId || !safeFileDownloadUrl) return;

    try {
      const response = await fetch(safeFileDownloadUrl, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Download failed with status ${response.status}`);
      }

      const blob = await response.blob();
      const fileName = documentMetadata?.title || `document-${docId}`;
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      toast.success("Download started");
    } catch (error: any) {
      toast.error(error.message || "Failed to download document");
    }
  };

  useEffect(() => {
    if (isMetadataError && metadataError) {
      toast.error("Failed to load document metadata: " + (metadataError as Error).message, {
        id: "load-document-metadata-error",
      });
    }
  }, [isMetadataError, metadataError]);

  // Fetch PDF blob via backend proxy to avoid CORS issues
  const { data: documentBlob, isError: isDocumentBlobError, error: documentBlobError, isLoading: isDocumentBlobLoading } = useQuery({
    queryKey: ['document-blob', docId, documentMetadata?.fileType],
    queryFn: async () => {
      if (!docId) throw new Error("No document ID specified");
      const response = await fetch(`${BACKEND_URL}/api/documents/${docId}/download`, {
        credentials: "include"
      });
      if (!response.ok) {
        throw new Error(`Failed to download document (status ${response.status})`);
      }
      return await response.blob();
    },
    enabled: !!docId && documentMetadata?.fileType === "pdf",
    retry: 1,
  });

  const [pdfFileUrl, setPdfFileUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!documentBlob) {
      setPdfFileUrl(null);
      return;
    }
    const url = URL.createObjectURL(documentBlob);
    setPdfFileUrl(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [documentBlob]);

  useEffect(() => {
    if (isDocumentBlobError && documentBlobError) {
      toast.error("Document Download Error: " + (documentBlobError as Error).message, {
        id: "document-download-error",
      });
    }
  }, [isDocumentBlobError, documentBlobError]);

  const safeDocxUrl = useMemo(() => {
    if (!docId) return null;
    return `${BACKEND_URL}/api/documents/${docId}/download`;
  }, [docId]);

  const syncDetectedPageCount = useCallback((pageCount: number) => {
    if (!docId) return;
    queryClient.setQueryData(["document-page-count", docId], pageCount);
    queryClient.setQueryData(["document", docId], (prev: any) => prev ? { ...prev, totalPages: pageCount } : prev);
    queryClient.setQueryData(["documents"], (prev: any) => {
      if (!Array.isArray(prev)) return prev;
      return prev.map((doc: any) => doc.id === docId ? { ...doc, totalPages: pageCount } : doc);
    });
  }, [docId, queryClient]);

  const handleDocumentLoadSuccess = useCallback((pageCount: number) => {
    setTotalPages(pageCount);
    syncDetectedPageCount(pageCount);
  }, [syncDetectedPageCount]);

  const handlePdfLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    handleDocumentLoadSuccess(numPages);
  }, [handleDocumentLoadSuccess]);

  const handlePdfLoadError = useCallback((error: Error) => {
    console.error("PDF Load Error:", error);
    toast.error("PDF Render Error: " + error.message, {
      id: "pdf-render-error"
    });
  }, []);

  const handleDocxLoadSuccess = useCallback((numPages: number) => {
    handleDocumentLoadSuccess(numPages);
  }, [handleDocumentLoadSuccess]);

  useEffect(() => {
    setTotalPages(1);
  }, [docId, documentMetadata?.fileType]);

  const navigationResetKey = `${docId ?? ""}-${documentMetadata?.fileType ?? ""}-${totalPages}`;
  const { scrollContainerRef, currentPage, scrollToPage } = useScrollPageNavigation(
    totalPages,
    navigationResetKey,
  );

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const handlePrevPage = () => {
    scrollToPage(Math.max(1, currentPage - 1));
  };

  const handleNextPage = () => {
    scrollToPage(Math.min(totalPages, currentPage + 1));
  };

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
  const [analogyContent, setAnalogyContent] = useState<any | null>(null);
  const [isAnalogySelectingStyle, setIsAnalogySelectingStyle] = useState(false);
  const [interviewQuestionsContent, setInterviewQuestionsContent] = useState<any>(null);
  const [quizContent, setQuizContent] = useState<any>(null);
  const [quizId, setQuizId] = useState<string | null>(null);
  const [notesContent, setNotesContent] = useState<GeneratedNotes | null>(null);
  const [mindMapContent, setMindMapContent] = useState<any>(null);

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
        const res = await WorkflowAPI.generateExplanation(docId, highlightedText);
        setExplanationContent(res.explanation);
        toast.success("Explanation generated successfully!", { id: "explain-success" });
      } catch (error: any) {
        toast.error(error.message || "Failed to generate explanation", { id: "explain-error" });
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
        const res = await WorkflowAPI.generateNotes(docId, highlightedText);
        setNotesContent(res.notes);
        
        toast.success("Notes generated successfully!", { id: "notes-success" });
      } catch (error: any) {
        toast.error(error.message || "Failed to generate notes", { id: "notes-error" });
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
        const res = await WorkflowAPI.generateInterviewQuestions(docId, highlightedText);
        setInterviewQuestionsContent(res.questions);
        toast.success("Interview questions generated successfully!", { id: "interview-success" });
      } catch (error: any) {
        toast.error(error.message || "Failed to generate interview questions", { id: "interview-error" });
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
        const res = await WorkflowAPI.generateQuiz(docId, highlightedText);
        setQuizContent(res.quiz);
        setQuizId(res.id || null);
        toast.success("Quiz generated successfully!", { id: "quiz-success" });
      } catch (error: any) {
        toast.error(error.message || "Failed to generate quiz", { id: "quiz-error" });
        setActiveFeature(null);
      } finally {
        setIsLoading(false);
      }
    } else if (featureId === "mindmap") {
      if (highlightedText.trim().length < 5) {
        toast.error("Please highlight at least 5 characters to generate a mind map.");
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
        const res = await WorkflowAPI.generateMindMap(docId, highlightedText);
        setMindMapContent(res.mindMap);
        toast.success("Mind map generated successfully!", { id: "mindmap-success" });
      } catch (error: any) {
        toast.error(error.message || "Failed to generate mind map", { id: "mindmap-error" });
        setActiveFeature(null);
      } finally {
        setIsLoading(false);
      }
    } else if (featureId === "analogy") {
      if (highlightedText.trim().length < 5) {
        toast.error("Please highlight at least 5 characters to generate an analogy.");
        setActiveFeature(null);
        return;
      }
      if (highlightedText.trim().length > 5000) {
        toast.error("Highlighted text is too long (max 5000 characters).");
        setActiveFeature(null);
        return;
      }
      setIsAnalogySelectingStyle(true);
      setAnalogyContent(null);
    } else {
      // Mock for other features
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    }
  };

  const handleGenerateAnalogy = async (style: string) => {
    setIsAnalogySelectingStyle(false);
    setIsLoading(true);
    try {
      const res = await WorkflowAPI.generateAnalogy(docId, highlightedText, style);
      setAnalogyContent(res.analogy);
      toast.success("Analogy generated successfully!", { id: "analogy-success" });
    } catch (error: any) {
      toast.error(error.message || "Failed to generate analogy", { id: "analogy-error" });
      setActiveFeature(null);
    } finally {
      setIsLoading(false);
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
                  data-tour={`ai-${feature.id === "analogy" ? "analogies" : feature.id === "simulation" ? "simulations" : feature.id}`}
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
          {/* Document Toolbar */}
          {(!documentMetadata || ["pdf", "docx", "txt", "ppt", "pptx"].includes(documentMetadata.fileType)) && (
          <div className="h-12 border-b border-[var(--lf-border)] bg-[var(--lf-bg)] flex items-center justify-between px-4 shrink-0">
            <div className="flex items-center gap-2">
              <button className="p-1.5 hover:bg-[var(--lf-surface)] rounded-lg text-[var(--lf-text-secondary)]">
                <Search className="h-4 w-4" />
              </button>
              <div className="w-px h-4 bg-[var(--lf-border)] mx-2" />
              <button
                onClick={handlePrevPage}
                disabled={!canGoPrevious}
                className="p-1.5 hover:bg-[var(--lf-surface)] rounded-lg text-[var(--lf-text-secondary)] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-xs font-medium text-[var(--lf-text-primary)] min-w-[120px] text-center">
                Current: {currentPage} / Total: {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={!canGoNext}
                className="p-1.5 hover:bg-[var(--lf-surface)] rounded-lg text-[var(--lf-text-secondary)] disabled:opacity-40 disabled:cursor-not-allowed"
              >
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
              <button
                onClick={handleDownloadDocument}
                className="px-3 py-1 rounded-xl bg-[var(--lf-surface)] border border-[var(--lf-border)] text-[var(--lf-text-secondary)] hover:bg-[var(--lf-accent)] hover:text-white transition-all"
              >
                Download
              </button>
            </div>
          </div>
          )}

          {/* Document Viewer (PDF or DocViewer) */}
          <div
            ref={scrollContainerRef}
            className="flex-1 relative bg-stone-100 dark:bg-stone-900 overflow-y-auto overflow-x-hidden flex flex-col items-center py-8"
          >
            {!documentMetadata && !isMetadataError ? (
              <div className="flex items-center justify-center h-full text-stone-500">
                Loading Document Metadata...
              </div>
            ) : isMetadataError ? (
              <div className="flex flex-col items-center justify-center p-12 text-red-500 text-center">
                <FileText className="h-12 w-12 text-red-400 mb-4" />
                <p className="font-bold text-lg">Failed to load document.</p>
                <p className="text-sm mt-2 opacity-80">{(metadataError as Error)?.message || "Check server connection."}</p>
              </div>
            ) : documentMetadata?.fileType === "pdf" ? (
              isDocumentBlobLoading ? (
                <div className="flex items-center justify-center p-12 text-stone-500 animate-pulse">
                  Downloading PDF document...
                </div>
              ) : isDocumentBlobError ? (
                <div className="flex flex-col items-center justify-center p-12 text-red-500 text-center">
                  <p className="font-bold text-lg">Failed to load document.</p>
                  <p className="text-sm mt-2 opacity-80">This document file is missing or cannot be retrieved from the server.</p>
                </div>
              ) : pdfFileUrl ? (
                <Document
                  file={pdfFileUrl}
                  onLoadSuccess={handlePdfLoadSuccess}
                  onLoadError={handlePdfLoadError}
                  loading={
                    <div className="flex items-center justify-center p-12 text-stone-500 animate-pulse">
                      Loading PDF Document...
                    </div>
                  }
                  error={
                    <div className="flex flex-col items-center justify-center p-12 text-red-500">
                      <p className="font-bold text-lg">Failed to render PDF.</p>
                      <p className="text-sm mt-2 opacity-80">An error occurred while parsing the PDF contents.</p>
                    </div>
                  }
                >
                  {Array.from({ length: totalPages }, (_, index) => (
                    <div key={`page_${index + 1}`} data-page-number={index + 1}>
                      <Page
                        pageNumber={index + 1}
                        className="mb-8 shadow-xl border border-stone-200 dark:border-stone-800 rounded-sm overflow-hidden bg-white"
                        scale={zoom}
                        renderTextLayer={true}
                        renderAnnotationLayer={true}
                      />
                    </div>
                  ))}
                </Document>
              ) : (
                <div className="flex items-center justify-center h-full text-stone-500">
                  Preparing document...
                </div>
              )
            ) : ["docx", "doc"].includes(documentMetadata?.fileType || "") ? (
              <div className="w-full h-full flex flex-col p-4 bg-stone-100 dark:bg-stone-900">
                <DocxViewer 
                  fileUrl={safeDocxUrl || ""} 
                  zoom={zoom} 
                  onLoadSuccess={handleDocxLoadSuccess} 
                />
              </div>
            ) : ["ppt", "pptx"].includes(documentMetadata?.fileType || "") ? (
              <div className="w-full h-full flex flex-col p-4 bg-stone-100 dark:bg-stone-900">
                <PptxViewer
                  fileUrl={safeFileDownloadUrl || ""}
                  zoom={zoom}
                  onLoadSuccess={handleDocxLoadSuccess}
                />
              </div>
            ) : documentMetadata?.fileType === "txt" ? (
              isTxtLoading ? (
                <div className="flex items-center justify-center p-12 text-stone-500 animate-pulse">
                  Loading text document...
                </div>
              ) : isTxtError ? (
                <div className="flex flex-col items-center justify-center p-12 text-red-500 text-center">
                  <p className="font-bold text-lg">Failed to load text document.</p>
                  <p className="text-sm mt-2 opacity-80">{(txtError as Error)?.message || "Unable to retrieve the text file."}</p>
                </div>
              ) : (
                <div className="w-full h-full p-6 overflow-auto bg-white text-sm text-stone-800 dark:bg-stone-900 dark:text-stone-100 rounded-3xl whitespace-pre-wrap break-words">
                  {txtContent || "No text content found."}
                </div>
              )
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-stone-500 p-8 text-center space-y-4">
                <FileText className="h-12 w-12 text-stone-400" />
                <p className="font-medium text-[var(--lf-text-primary)]">
                  Local Preview not natively supported for .{documentMetadata?.fileType}
                </p>
                <p className="text-sm">
                  Only PDF, DOCX, and TXT files support local browser rendering. For other document types, use the download button to access them directly.
                </p>
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
                      {activeFeature === "mindmap" ? "Generating Mind Map..." : 
                       activeFeature === "quiz" ? "Generating Quiz..." : 
                       activeFeature === "notes" ? "Generating Notes..." : 
                       activeFeature === "interview" ? "Generating Questions..." : 
                       activeFeature === "analogy" ? "Crafting the perfect analogy..." : 
                       "Analyzing Context..."}
                    </h3>
                    <p className="text-[13px] text-[var(--lf-text-secondary)] animate-pulse">
                      {activeFeature === "mindmap" ? "Structuring your text into a visual hierarchy." : 
                       activeFeature === "analogy" ? "Mapping technical concepts to relatable themes." :
                       "Searching the document to generate your content."}
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
                 
                  {/* Feature Content */}
                  {activeFeature === "explain" && <FeatureExplain content={explanationContent} />}
                  {activeFeature === "notes" && <FeatureNotes notes={notesContent} loading={isLoading} />}
                  {activeFeature === "quiz" && <FeatureQuiz quiz={quizContent} quizId={quizId} />}
                  {activeFeature === "analogy" && <FeatureAnalogy analogy={analogyContent} onSelectStyle={handleGenerateAnalogy} isSelectingStyle={isAnalogySelectingStyle} onResetStyle={() => { setAnalogyContent(null); setIsAnalogySelectingStyle(true); }} />}
                  {activeFeature === "interview" && <FeatureInterview questions={interviewQuestionsContent} />}
                  {activeFeature === "mindmap" && <FeatureMindMap mindMap={mindMapContent} />}
                  {activeFeature === "simulation" && <SimulationGenerator documentId={docId || ""} highlightedText={highlightedText} />}

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

            let containerClass;
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
              {notes.keyPoints.map((point: any, i: number) => (
                <li key={i} className="text-[14px] text-[var(--lf-text-primary)] flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">•</span> {typeof point === "object" && point !== null ? Object.values(point).join(": ") : point}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4 p-5 rounded-2xl bg-blue-500/5 border border-blue-500/10 transition-colors print:break-inside-avoid print:p-6">
            <h3 className="text-[16px] font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
              <BookOpen className="h-5 w-5" /> Important Concepts
            </h3>
            <ul className="space-y-2">
              {(notes.importantConcepts || notes.relatedConcepts || []).map((concept: any, i: number) => (
                <li key={i} className="text-[14px] text-[var(--lf-text-primary)] flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span> {typeof concept === "object" && concept !== null ? Object.values(concept).join(": ") : concept}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4 p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 transition-colors print:break-inside-avoid print:p-6">
            <h3 className="text-[16px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
              <GraduationCap className="h-5 w-5" /> Exam Tips
            </h3>
            <ul className="space-y-2">
              {notes.examTips.map((tip: any, i: number) => (
                <li key={i} className="text-[14px] text-[var(--lf-text-primary)] flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">•</span> {typeof tip === "object" && tip !== null ? Object.values(tip).join(": ") : tip}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4 p-5 rounded-2xl bg-purple-500/5 border border-purple-500/10 transition-colors print:break-inside-avoid print:p-6">
            <h3 className="text-[16px] font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
              <FileText className="h-5 w-5" /> Revision Notes
            </h3>
            <ul className="space-y-2">
              {notes.revisionNotes.map((note: any, i: number) => (
                <li key={i} className="text-[14px] text-[var(--lf-text-primary)] flex items-start gap-2">
                  <span className="text-purple-500 mt-0.5">•</span> {typeof note === "object" && note !== null ? Object.values(note).join(": ") : note}
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

  const { score, total } = useMemo(() => {
    if (!quiz) return { score: 0, total: 0 };
    let s = 0;
    const t = (quiz.mcqs?.length || 0) + (quiz.trueFalse?.length || 0);
    quiz.mcqs?.forEach((q: any, i: number) => {
      if (mcqAnswers[i] === q.correctAnswer) s++;
    });
    quiz.trueFalse?.forEach((q: any, i: number) => {
      if (tfAnswers[i] === q.answer) s++;
    });
    return { score: s, total: t };
  }, [quiz, mcqAnswers, tfAnswers]);

  if (!quiz) {
    return (
      <div className="text-[14px] text-[var(--lf-text-secondary)] italic">
        No quiz generated yet.
      </div>
    );
  }

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
          <h3 className="text-sm font-bold text-[var(--lf-text-secondary)] uppercase tracking-wider">Short Answer <span className="text-[10px] font-normal text-[var(--lf-text-secondary)] normal-case">(optional for improvement)</span></h3>
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

function FeatureAnalogy({ analogy, onSelectStyle, isSelectingStyle, onResetStyle }: { analogy?: any, onSelectStyle?: (style: string) => void, isSelectingStyle?: boolean, onResetStyle?: () => void }) {
  const styles = [
    { id: "gaming", label: "Gaming", icon: Gamepad2 },
    { id: "story", label: "Story", icon: BookOpen },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "real-world", label: "Real World", icon: Globe },
    { id: "sports", label: "Sports", icon: Swords },
    { id: "movie", label: "Movie", icon: Film },
    { id: "eli10", label: "Explain Like I'm 10", icon: Baby },
  ];

  if (isSelectingStyle && onSelectStyle) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="h-6 w-6 text-[var(--lf-accent)]" />
          <h2 className="text-2xl font-bold text-[var(--lf-text-primary)]">Choose Analogy Style</h2>
        </div>
        <p className="text-[14px] text-[var(--lf-text-secondary)]">
          Select a theme to map these technical concepts into something relatable!
        </p>
        <div className="grid grid-cols-2 gap-4 mt-6">
          {styles.map((s) => (
            <button
              key={s.id}
              onClick={() => onSelectStyle(s.id)}
              className="flex flex-col items-center justify-center gap-3 p-5 rounded-2xl border border-[var(--lf-border)] bg-[var(--lf-surface)] hover:bg-[var(--lf-accent)]/5 hover:border-[var(--lf-accent)]/50 transition-all group card-shadow relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--lf-accent)]/0 to-[var(--lf-accent)]/0 group-hover:from-[var(--lf-accent)]/10 group-hover:to-transparent transition-all duration-500" />
              <div className="p-3 rounded-xl bg-[var(--lf-surface)] border border-[var(--lf-border)] text-[var(--lf-text-secondary)] group-hover:bg-[var(--lf-accent)] group-hover:text-white transition-all duration-300 shadow-sm relative z-10">
                <s.icon className="h-6 w-6" />
              </div>
              <span className="font-bold text-[14px] text-[var(--lf-text-primary)] relative z-10">{s.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (!analogy) return null;

  const StyleIcon = styles.find(s => s.id === analogy.style)?.icon || Sparkles;

  return (
    <div className="space-y-8 pb-10">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <StyleIcon className="h-6 w-6 text-[var(--lf-accent)]" />
          <h2 className="text-2xl font-bold text-[var(--lf-text-primary)]">Analogy: {analogy.style.toUpperCase()}</h2>
        </div>
        {onResetStyle && (
          <button 
            onClick={onResetStyle}
            className="px-3 py-1.5 rounded-lg border border-[var(--lf-border)] text-[12px] font-bold text-[var(--lf-text-secondary)] hover:text-[var(--lf-accent)] hover:bg-[var(--lf-accent)]/10 transition-colors flex items-center gap-2"
          >
            Change Style
          </button>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-[28px] font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-500 leading-tight pb-1">
          {analogy.title}
        </h3>
        <p className="text-[15px] leading-relaxed text-[var(--lf-text-secondary)] font-medium">
          {analogy.summary}
        </p>
      </div>

      <div className="space-y-4">
        <h4 className="text-[12px] font-bold text-[var(--lf-text-secondary)] uppercase tracking-wider mb-2">Concept Mappings</h4>
        <div className="space-y-4">
          {analogy.mappings?.map((mapping: any, idx: number) => (
            <div key={idx} className="group p-5 rounded-2xl bg-[var(--lf-surface)] border border-[var(--lf-border)] card-shadow hover:shadow-[0_8px_30px_rgba(249,115,22,0.1)] transition-all duration-300">
              <div className="flex items-center gap-4 mb-3">
                <div className="flex-1 px-4 py-2.5 bg-gradient-to-br from-orange-500/10 to-amber-500/5 rounded-xl border border-orange-500/20 flex items-center justify-center text-center shadow-sm">
                  <span className="font-bold text-orange-600 dark:text-orange-400 text-[14px]">{mapping.analogyElement}</span>
                </div>
                <ArrowRight className="h-5 w-5 text-stone-400 shrink-0" />
                <div className="flex-1 px-4 py-2.5 bg-stone-100 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 flex items-center justify-center text-center shadow-sm">
                  <span className="font-bold text-[var(--lf-text-primary)] text-[14px]">{mapping.conceptElement}</span>
                </div>
              </div>
              <p className="text-[14px] text-[var(--lf-text-secondary)] text-center leading-relaxed mt-4 bg-stone-50 dark:bg-stone-900/50 p-3 rounded-xl">
                {mapping.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 relative overflow-hidden card-shadow">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 blur-2xl rounded-full" />
          <h4 className="text-[13px] font-bold text-emerald-600 dark:text-emerald-400 mb-2 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" /> Why it works
          </h4>
          <p className="text-[13px] text-[var(--lf-text-secondary)] leading-relaxed relative z-10">
            {analogy.whyItWorks}
          </p>
        </div>
        <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20 relative overflow-hidden card-shadow">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 blur-2xl rounded-full" />
          <h4 className="text-[13px] font-bold text-amber-600 dark:text-amber-400 mb-2 flex items-center gap-2">
            <Lightbulb className="h-4 w-4" /> Limitations
          </h4>
          <p className="text-[13px] text-[var(--lf-text-secondary)] leading-relaxed relative z-10">
            {analogy.limitations}
          </p>
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

const nodeTypes = {
  custom: CustomMindMapNode,
};

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 220;
const nodeHeight = 60;

const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'TB') => {
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const newNode = { ...node };

    newNode.targetPosition = direction === 'TB' ? 'top' : 'left' as any;
    newNode.sourcePosition = direction === 'TB' ? 'bottom' : 'right' as any;

    // We are shifting the dagre node position (anchor=center center) to the top left
    // so it matches the React Flow node anchor point (top left).
    newNode.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };

    return newNode;
  });

  return { nodes: layoutedNodes, edges };
};

function MindMapFlow({ mindMap }: { mindMap: any }) {
  const { fitView } = useReactFlow();
  
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  useEffect(() => {
    if (!mindMap?.nodes || !mindMap?.edges) return;

    // Determine root node (usually the first one or node with no incoming edges)
    // For simplicity, we can assume the first node is the root or check edge targets
    const targetIds = new Set(mindMap.edges.map((e: any) => e.target));
    
    const initialNodes: Node[] = mindMap.nodes.map((n: any) => ({
      id: n.id,
      type: 'custom',
      data: { 
        label: n.label, 
        isRoot: !targetIds.has(n.id) 
      },
      position: { x: 0, y: 0 }, // Will be calculated by dagre
    }));

    const initialEdges: Edge[] = mindMap.edges.map((e: any, idx: number) => ({
      id: `e-${e.source}-${e.target}-${idx}`,
      source: e.source,
      target: e.target,
      animated: true,
      style: { stroke: 'rgba(249, 115, 22, 0.5)', strokeWidth: 2 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: 'rgba(249, 115, 22, 0.5)',
      },
    }));

    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      initialNodes,
      initialEdges
    );

    setNodes(layoutedNodes);
    setEdges(layoutedEdges);

    // Give React Flow a frame to render the new nodes before fitting the view
    setTimeout(() => {
      fitView({ duration: 800, padding: 0.2 });
    }, 50);
  }, [mindMap, setNodes, setEdges, fitView]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      fitView
      className="bg-white/50 dark:bg-black/20"
      style={{ width: '100%', height: '100%' }}
      minZoom={0.1}
      maxZoom={2}
    >
      <Background color="#ccc" gap={16} />
      <Controls className="!bg-white dark:!bg-[#1a1a1a] !border-[var(--lf-border)] !shadow-lg !rounded-xl overflow-hidden [&>button]:!border-b-[var(--lf-border)] [&>button]:!bg-transparent dark:[&_path]:!fill-[var(--lf-text-primary)]" />
    </ReactFlow>
  );
}

function FeatureMindMap({ mindMap }: { mindMap: any }) {
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);

  if (!mindMap) {
    return (
      <div className="text-[14px] text-[var(--lf-text-secondary)] italic">
        No mind map generated yet.
      </div>
    );
  }

  const handleExplainFlow = async () => {
    if (!mindMap?.id) {
      toast.error("Mind map ID not found.");
      return;
    }
    
    setIsExplaining(true);
    setExplanation(null);
    
    try {
      const res = await WorkflowAPI.explainMindMap(mindMap.id);
      setExplanation(res.explanation);
    } catch (err: any) {
      console.error("Explanation failed:", err);
      toast.error(err.message || "Failed to generate explanation.");
    } finally {
      setIsExplaining(false);
    }
  };

  const handleDownloadPNG = () => {
    const rfElement = document.querySelector('.react-flow') as HTMLElement;
    if (!rfElement) return;
    
    // Add a slight toast to show processing
    const loadingToast = toast.loading("Generating PNG...");

    toPng(rfElement, {
      backgroundColor: document.documentElement.classList.contains('dark') ? '#000000' : '#ffffff',
      pixelRatio: 2, // higher res
    }).then((dataUrl) => {
      const link = document.createElement('a');
      link.download = mindMap?.title ? `${mindMap.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_mindmap.png` : 'mindmap.png';
      link.href = dataUrl;
      link.click();
      toast.success("Mind map downloaded successfully!", { id: loadingToast });
    }).catch((err) => {
      console.error(err);
      toast.error("Failed to download mind map.", { id: loadingToast });
    });
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-2 shrink-0">
        <div className="flex items-center gap-3">
          <GitMerge className="h-6 w-6 text-[var(--lf-accent)]" />
          <h2 className="text-2xl font-bold text-[var(--lf-text-primary)]">AI Mind Map</h2>
        </div>
        <button 
          onClick={handleDownloadPNG}
          className="flex items-center gap-2 px-3 py-1.5 bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 dark:text-orange-400 rounded-lg text-[13px] font-bold transition-colors"
        >
          <Download className="h-4 w-4" /> Download PNG
        </button>
      </div>

      <div className="flex-1 rounded-3xl bg-[var(--lf-surface)] border border-[var(--lf-border)] card-shadow overflow-hidden min-h-[500px] flex flex-col relative">
        <div className="p-4 border-b border-[var(--lf-border)] shrink-0 bg-white/50 dark:bg-black/20 backdrop-blur-md z-10">
          <h3 className="font-bold text-[var(--lf-text-primary)]">{mindMap.title}</h3>
        </div>
        <div className="flex-1 relative w-full h-full cursor-grab active:cursor-grabbing">
          <ReactFlowProvider>
            <div className="w-full h-full absolute inset-0">
              <MindMapFlow mindMap={mindMap} />
            </div>
          </ReactFlowProvider>
        </div>
      </div>

      <div className="shrink-0 flex flex-col gap-4">
        {!explanation && !isExplaining && (
          <button
            onClick={handleExplainFlow}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500/10 to-amber-500/10 hover:from-orange-500/20 hover:to-amber-500/20 border border-orange-500/20 text-orange-600 dark:text-orange-400 font-bold text-[15px] flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(249,115,22,0.15)] group"
          >
            <Sparkles className="h-5 w-5 group-hover:rotate-12 transition-transform" />
            ✨ Explain the Flow
          </button>
        )}

        {isExplaining && (
          <div className="w-full py-4 rounded-2xl bg-[var(--lf-surface)] border border-[var(--lf-border)] flex items-center justify-center gap-3">
            <div className="w-5 h-5 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
            <span className="text-[14px] font-medium text-[var(--lf-text-secondary)] animate-pulse">
              Analyzing structural logic...
            </span>
          </div>
        )}

        <AnimatePresence>
          {explanation && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: 10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <div className="p-6 rounded-3xl bg-[var(--lf-surface)] border border-orange-500/30 card-shadow-lg relative backdrop-blur-md">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="h-5 w-5 text-orange-500" />
                  <h3 className="font-bold text-[16px] text-[var(--lf-text-primary)]">Flow Explanation</h3>
                </div>
                <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-p:text-[var(--lf-text-secondary)]">
                  <ReactMarkdown>{explanation}</ReactMarkdown>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}


