const API_BASE_URL = "http://localhost:3000/api";

export interface DocumentMetadata {
  id: string;
  title: string;
  fileType: "pdf" | "ppt" | "pptx" | "doc" | "docx";
  totalPages?: number;
  createdAt?: string;
  fileUrl?: string;
}

export const DocumentAPI = {
  /**
   * Upload a new document
   * @param file File object from the dropzone
   */
  async uploadDocument(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_BASE_URL}/documents/upload`, {
      method: "POST",
      credentials: "include", // Uses session cookie
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to upload document");
    }

    return response.json();
  },

  /**
   * Get all user documents
   */
  async getDocuments(): Promise<DocumentMetadata[]> {
    const response = await fetch(`${API_BASE_URL}/documents`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch documents");
    }

    return response.json();
  },

  /**
   * Get a single document by ID
   */
  async getDocument(id: string): Promise<DocumentMetadata> {
    const response = await fetch(`${API_BASE_URL}/documents/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch document details");
    }

    return response.json();
  },

  /**
   * Delete a document
   */
  async deleteDocument(id: string) {
    const response = await fetch(`${API_BASE_URL}/documents/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to delete document");
    }

    return response.json();
  },
};

export const WorkflowAPI = {
  /**
   * Generate an AI explanation for highlighted text
   */
  async generateExplanation(documentId: string, highlightedText: string) {
    const response = await fetch(`${API_BASE_URL}/workflow/explanation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ documentId, highlightedText }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to generate explanation");
    }

    return response.json();
  },

  /**
   * Generate AI interview questions for highlighted text
   */
  async generateInterviewQuestions(documentId: string, highlightedText: string) {
    const response = await fetch(`${API_BASE_URL}/workflow/interview-questions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ documentId, highlightedText }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to generate interview questions");
    }

    return response.json();
  },
};

