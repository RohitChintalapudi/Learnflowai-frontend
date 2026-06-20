export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
const API_BASE_URL = `${BACKEND_URL}/api`;

export interface DocumentMetadata {
  id: string;
  title: string;
  fileType: "pdf" | "ppt" | "pptx" | "doc" | "docx";
  totalPages?: number;
  createdAt?: string;
  fileUrl?: string;
}

export interface GeneratedNotes {
  title: string;
  summary: string;
  keyPoints: string[];
  importantConcepts?: string[];
  relatedConcepts?: string[];
  importantSubtopics?: string[];
  examTips: string[];
  revisionNotes: string[];
}

export interface DashboardSummary {
  user: {
    name: string;
  };
  stats: {
    documentsCount: number;
    explanationsCount: number;
    notesCount: number;
    quizzesCount: number;
    learningStreak: number;
  };
  recentDocuments: DocumentMetadata[];
  recentActivity: {
    id: string;
    action: string;
    target: string;
    time: string;
    type: string;
  }[];
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
   * Get dashboard summary
   */
  async getDashboardSummary(): Promise<DashboardSummary> {
    const response = await fetch(`${API_BASE_URL}/dashboard/summary`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch dashboard summary");
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
   * Generate an AI analogy for highlighted text based on a specific style
   */
  async generateAnalogy(documentId: string, highlightedText: string, style: string) {
    const response = await fetch(`${API_BASE_URL}/workflow/analogy`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ documentId, highlightedText, style }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to generate analogy");
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

  /**
   * Generate AI quiz for highlighted text
   */
  async generateQuiz(documentId: string, highlightedText: string) {
    const response = await fetch(`${API_BASE_URL}/workflow/quiz`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ documentId, highlightedText }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to generate quiz");
    }

    return response.json();
  },

  /**
   * Get all user quizzes
   */
  async getQuizzes() {
    const response = await fetch(`${API_BASE_URL}/workflow/quiz`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch quizzes");
    }

    return response.json();
  },

  /**
   * Submit quiz score and get analysis
   */
  async submitQuiz(quizId: string, score: number, totalQuestions: number, topicsToImprove: string[]) {
    const response = await fetch(`${API_BASE_URL}/workflow/quiz/${quizId}/submit`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ score, totalQuestions, topicsToImprove }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to submit quiz");
    }

    return response.json();
  },

  /**
   * Generate AI notes for highlighted text
   */
  async generateNotes(documentId: string, highlightedText: string) {
    const response = await fetch(`${API_BASE_URL}/workflow/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ documentId, highlightedText }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to generate notes");
    }

    return response.json();
  },

  /**
   * Delete an AI generated note
   */
  async deleteNote(noteId: string) {
    const response = await fetch(`${API_BASE_URL}/workflow/notes/${noteId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to delete note");
    }

    return response.json();
  },

  /**
   * Generate an AI mind map for highlighted text
   */
  async generateMindMap(documentId: string, highlightedText: string) {
    const response = await fetch(`${API_BASE_URL}/workflow/mindmap`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ documentId, highlightedText }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to generate mind map");
    }

    return response.json();
  },

  /**
   * Explain an AI generated mind map
   */
  async explainMindMap(mindMapId: string) {
    const response = await fetch(`${API_BASE_URL}/workflow/mindmap/explain`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ mindMapId }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to explain mind map");
    }

    return response.json();
  },


  /**
   * Get all AI generated notes for the user
   */
  async getNotes() {
    const response = await fetch(`${API_BASE_URL}/workflow/notes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch notes");
    }

    return response.json();
  },
};

export const QuizDashboardAPI = {
  async getStats() {
    const response = await fetch(`${API_BASE_URL}/quizzes/stats`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch quiz stats");
    }
    return response.json();
  },

  async getQuizzes(page: number = 1, limit: number = 20, search?: string) {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (search) {
      queryParams.append("search", search);
    }
    
    const response = await fetch(`${API_BASE_URL}/quizzes?${queryParams.toString()}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch quizzes");
    }
    return response.json();
  },

  async getSingleQuiz(quizId: string) {
    const response = await fetch(`${API_BASE_URL}/quizzes/${quizId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch quiz details");
    }
    return response.json();
  },

  async deleteQuiz(quizId: string) {
    const response = await fetch(`${API_BASE_URL}/quizzes/${quizId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to delete quiz");
    }
    return response.json();
  }
};

export const ProfileAPI = {
  async getProfile() {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch profile");
    }
    return response.json();
  },

  async updateProfile(data: { name?: string; bio?: string; learningGoals?: string }) {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to update profile");
    }
    return response.json();
  },

  async getProfileStats() {
    const response = await fetch(`${API_BASE_URL}/profile/stats`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch profile stats");
    }
    return response.json();
  },

  async uploadAvatar(file: File) {
    const formData = new FormData();
    formData.append("avatar", file);
    
    const response = await fetch(`${API_BASE_URL}/profile/avatar`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to upload avatar");
    }
    return response.json();
  },

  async deleteAvatar() {
    const response = await fetch(`${API_BASE_URL}/profile/avatar`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to delete avatar");
    }
    return response.json();
  }
};
