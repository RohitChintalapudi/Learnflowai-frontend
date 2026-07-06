import React, { useState, useRef } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardLayout } from "../../components/DashboardLayout";
import {
  UploadCloud,
  FileText,
  Clock,
  Trash2,
  File as FileIcon,
  PlayCircle,
  AlertTriangle,
} from "lucide-react";
import { DocumentAPI, BACKEND_URL } from "../../lib/api";
import type { DocumentMetadata } from "../../lib/api";
import { detectDocumentPageCount } from "../../lib/documentPageCount";
import toast from "react-hot-toast";

export const Route = createFileRoute("/_authenticated/documents")({
  component: DocumentsPage,
});

const PAGINATED_FILE_TYPES = new Set(["pdf", "doc", "docx", "ppt", "pptx"]);

function DocumentPageCount({ doc }: { doc: DocumentMetadata }) {
  const { data: pageCount, isLoading, isError } = useQuery({
    queryKey: ["document-page-count", doc.id],
    queryFn: async () => {
      const downloadUrl = `${BACKEND_URL}/api/documents/${doc.id}/download`;
      return detectDocumentPageCount(doc.fileType, downloadUrl);
    },
    enabled: PAGINATED_FILE_TYPES.has(doc.fileType),
    staleTime: Infinity,
    retry: 1,
  });

  if (!PAGINATED_FILE_TYPES.has(doc.fileType)) {
    return <span className="px-2 py-0.5 rounded border border-[var(--lf-border)] text-[var(--lf-text-secondary)] bg-[var(--lf-surface)]">N/A</span>;
  }

  if (isLoading) {
    return <span className="px-2 py-0.5 rounded border border-[var(--lf-border)] text-[var(--lf-text-secondary)] bg-[var(--lf-surface)]">...</span>;
  }

  if (isError || typeof pageCount !== "number") {
    return <span className="px-2 py-0.5 rounded border border-[var(--lf-border)] text-[var(--lf-text-secondary)] bg-[var(--lf-surface)]">--</span>;
  }

  return (
    <span className="px-2 py-0.5 rounded border border-[var(--lf-border)] text-[var(--lf-text-secondary)] bg-[var(--lf-surface)]">
      {pageCount} Pages
    </span>
  );
}

function DocumentsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { data: documents = [], isLoading } = useQuery({
    queryKey: ['documents'],
    queryFn: () => DocumentAPI.getDocuments(),
  });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleUpload(e.target.files[0]);
    }
  };

  const handleUpload = async (file: File) => {
    // Valid MIME types
    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "text/plain",
    ];
    
    if (!validTypes.includes(file.type)) {
      toast.error("Unsupported file type. Please upload PDF, Word, or PPT files.");
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      toast.error("File is too large. Maximum size is 20MB.");
      return;
    }

    setUploading(true);
    try {
      await DocumentAPI.uploadDocument(file);
      toast.success("Document uploaded successfully!");
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] });
    } catch (error: any) {
      toast.error(error.message || "Failed to upload document.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const confirmDelete = async () => {
    if (!documentToDelete) return;
    
    // Optimistic UI Update Option (or just wait for backend)
    const prevDocs = queryClient.getQueryData<DocumentMetadata[]>(['documents']) || [];
    queryClient.setQueryData(['documents'], prevDocs.filter((d) => d.id !== documentToDelete));
    
    try {
      await DocumentAPI.deleteDocument(documentToDelete);
      toast.success("Document deleted");
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] });
    } catch (error: any) {
      toast.error(error.message || "Failed to delete document");
      queryClient.setQueryData(['documents'], prevDocs); // Revert on failure
    } finally {
      setDocumentToDelete(null);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Unknown";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <DashboardLayout headerTitle="Documents">
      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {documentToDelete && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setDocumentToDelete(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[var(--lf-card)] border border-[var(--lf-border)] rounded-2xl card-shadow-lg p-6 w-full max-w-sm relative z-10 overflow-hidden"
            >
              <div className="flex items-center gap-4 mb-4 text-red-500">
                <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold">Delete Document?</h3>
              </div>
              <p className="text-[13px] text-[var(--lf-text-secondary)] mb-6">
                Are you sure you want to delete this document? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => setDocumentToDelete(null)}
                  className="px-4 py-2 rounded-xl text-[13px] font-semibold text-[var(--lf-text-secondary)] hover:bg-[var(--lf-surface)] transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete}
                  className="px-4 py-2 rounded-xl text-[13px] font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6 lg:p-8 pb-24 lg:pb-8 relative no-scrollbar">
        <div className="max-w-[1200px] mx-auto space-y-5 sm:space-y-6 lg:space-y-8 pb-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 data-tour="documents-heading" className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--lf-text-primary)] mb-2">
                Documents
              </h1>
              <p className="text-[15px] text-[var(--lf-text-secondary)]">
                Upload, organize, and access your learning resources powered by AI.
              </p>
            </div>

          </div>

          {/* Upload Area */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative rounded-2xl sm:rounded-3xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center p-6 sm:p-8 lg:p-12 overflow-hidden cursor-pointer text-center ${
              isDragging
                ? "border-orange-500 bg-orange-500/5 scale-[1.02] shadow-xl shadow-orange-500/10"
                : "border-[var(--lf-border)] bg-[var(--lf-card)] hover:border-orange-500/30 hover:bg-[var(--lf-surface)] card-shadow"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            {/* Hidden File Input */}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={handleFileSelect} 
              accept=".pdf,.doc,.docx,.ppt,.pptx" 
            />

            {/* Animated background glows */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-orange-500/10 to-transparent blur-[60px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-purple-500/5 to-transparent blur-[50px] rounded-full pointer-events-none" />

            <AnimatePresence mode="wait">
              {uploading ? (
                <motion.div
                  key="uploading"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex flex-col items-center relative z-10"
                >
                  <div className="w-16 h-16 rounded-full border-4 border-orange-500/20 border-t-orange-500 animate-spin mb-4" />
                  <p className="text-[15px] font-bold text-[var(--lf-text-primary)]">
                    Uploading Document...
                  </p>
                  <p className="text-[13px] text-[var(--lf-text-secondary)] mt-1">
                    Please wait while we process the file.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex flex-col items-center relative z-10 pointer-events-none"
                >
                  <div className="w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <UploadCloud className="h-8 w-8 text-orange-500" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-[var(--lf-text-primary)] mb-2">
                    Drop your study materials here
                  </h3>
                  <p className="text-[12.5px] sm:text-[13px] text-[var(--lf-text-secondary)] mb-6">
                    Supported files: PDF, PPT, PPTX, DOC, DOCX (Max 20MB)
                  </p>
                  <button
                    className="px-6 py-2.5 rounded-xl bg-[var(--lf-accent)] hover:bg-[var(--lf-accent-hover)] text-white text-[13px] font-semibold shadow-lg shadow-orange-500/25 transition-all active:scale-95 pointer-events-auto"
                    onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                  >
                    Browse Files
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Documents Grid / Empty State */}
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-[var(--lf-border)] border-t-[var(--lf-accent)] rounded-full animate-spin"></div>
            </div>
          ) : documents.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 mx-auto bg-[var(--lf-surface)] rounded-full flex items-center justify-center mb-6">
                <FileIcon className="h-10 w-10 text-[var(--lf-text-secondary)] opacity-50" />
              </div>
              <h3 className="text-xl font-bold text-[var(--lf-text-primary)] mb-2">
                No Documents Yet
              </h3>
              <p className="text-[14px] text-[var(--lf-text-secondary)] max-w-sm mx-auto">
                Upload your first learning resource and start learning with AI.
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6"
            >
              <AnimatePresence>
                {documents.map((doc) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    key={doc.id}
                    className="group rounded-2xl sm:rounded-3xl bg-[var(--lf-card)] border border-[var(--lf-border)] hover:border-orange-500/40 card-shadow card-shadow-hover transition-all flex flex-col overflow-hidden relative"
                  >
                    <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/10 blur-[60px] rounded-full pointer-events-none" />
                    <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-orange-400/8 blur-[50px] rounded-full pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/[0.03] via-transparent to-transparent pointer-events-none" />
                    
                    <div className="p-5 flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-orange-500/10 text-orange-500">
                        <FileText className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[15px] font-bold text-[var(--lf-text-primary)] truncate mb-1" title={doc.title}>
                          {doc.title}
                        </h4>
                        <div className="flex flex-wrap gap-2 text-[11px] font-semibold">
                          <span className="px-2 py-0.5 rounded border border-orange-500/30 text-orange-500 bg-orange-500/5 uppercase">
                            {doc.fileType}
                          </span>
                          <DocumentPageCount doc={doc} />
                        </div>
                      </div>
                    </div>

                    <div className="px-5 py-3 border-t border-[var(--lf-border)] bg-[var(--lf-surface)]/50 flex items-center justify-between text-[11px] text-[var(--lf-text-secondary)] font-medium">
                      <div className="flex flex-col gap-1">
                        <span className="flex items-center gap-1.5"><Clock className="h-3 w-3" /> Uploaded {formatDate(doc.createdAt)}</span>
                        {/* Removing static Opened time for now as it's not in the API model */}
                      </div>
                    </div>

                    <div className="p-3 border-t border-[var(--lf-border)] flex items-center gap-2 relative z-10">
                      <button
                        onClick={() => navigate({ to: "/workspace/$documentId", params: { documentId: String(doc.id) } })}
                        className="flex-1 py-2 rounded-xl bg-[var(--lf-surface)] border border-[var(--lf-border)] hover:bg-[var(--lf-accent)] hover:border-[var(--lf-accent)] hover:text-white text-[13px] font-bold text-[var(--lf-text-primary)] transition-all group/btn flex items-center justify-center gap-2"
                      >
                        Open Document <PlayCircle className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDocumentToDelete(doc.id)}
                        className="p-2 rounded-xl border border-[var(--lf-border)] hover:border-red-500/50 hover:bg-red-500/10 text-[var(--lf-text-secondary)] hover:text-red-500 transition-colors"
                        title="Delete Document"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
