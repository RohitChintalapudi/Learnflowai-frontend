export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://learnflowai-backend-k32r.onrender.com";
const API_BASE_URL = `${BACKEND_URL}/api`;

import { authClient } from "./auth-client";

export interface DocumentMetadata {
  id: string;
  title: string;
  fileType: "pdf" | "ppt" | "pptx" | "doc" | "docx" | "txt";
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

    const response = await fetch(`${API_BASE_URL}/documents`, {
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

export interface SimulationEntity {
  id: string;
  label: string;
  role: string;
}

export interface SimulationStep {
  stepNumber: number;
  title: string;
  description: string;
  activeEntities: string[];
  explanation: string;
}

export interface SimulationData {
  id: string;
  title: string;
  simulationType: string;
  difficulty: string;
  overview: string;
  entities: SimulationEntity[];
  steps: SimulationStep[];
  summary: string;
}

export interface GenerateSimulationRequest {
  documentId: string;
  highlightedText: string;
  simulationType: "visual-flow" | "step-by-step" | "real-world";
  difficulty: "beginner" | "intermediate" | "advanced";
}

export interface GenerateSimulationResponse {
  success: boolean;
  message: string;
  simulation?: SimulationData;
}

export const WorkflowAPI = {
  /**
   * Generate an AI Educational Simulation
   */
  async generateSimulation(data: GenerateSimulationRequest): Promise<GenerateSimulationResponse> {
    const response = await fetch(`${API_BASE_URL}/workflow/simulation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to generate simulation");
    }

    return response.json();
  },

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

// --- Analytics Types & API ---

export interface OverviewStats {
  documentsUploaded: number;
  notesGenerated: number;
  quizzesGenerated: number;
  explanationsGenerated: number;
  interviewQuestionsGenerated: number;
  mindMapsGenerated: number;
  analogiesGenerated: number;
  totalAiInteractions: number;
}

export interface ActivityTimelineItem {
  date: string;
  count: number;
}

export interface FeatureUsageItem {
  feature: string;
  count: number;
}

export interface TopicItem {
  topic: string;
  frequency: number;
}

export interface ConsistencyScore {
  score: number;
  level: "Poor" | "Average" | "Good" | "Excellent";
  reason: string;
}

export interface ProductivityStats {
  mostActiveDay: string;
  mostActiveHour: string;
  averageDailyInteractions: number;
  totalLearningSessions: number;
}

export interface RevisionCandidate {
  topic: string;
  daysSinceLastReview: number;
  priority: "High" | "Medium" | "Low";
}

export interface AIInsights {
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  nextActions: string[];
}

export const AnalyticsAPI = {
  async getOverview(): Promise<OverviewStats> {
    const response = await fetch(`${API_BASE_URL}/analytics/overview`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch analytics overview");
    }
    const res = await response.json();
    return res.data !== undefined ? res.data : res;
  },

  async getActivity(days: number = 30): Promise<ActivityTimelineItem[]> {
    const response = await fetch(`${API_BASE_URL}/analytics/activity?days=${days}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch activity timeline");
    }
    const res = await response.json();
    return res.data !== undefined ? res.data : res;
  },

  async getFeatureUsage(): Promise<FeatureUsageItem[]> {
    const response = await fetch(`${API_BASE_URL}/analytics/feature-usage`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch feature usage");
    }
    const res = await response.json();
    return res.data !== undefined ? res.data : res;
  },

  async getTopics(): Promise<TopicItem[]> {
    const response = await fetch(`${API_BASE_URL}/analytics/topics`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch topics");
    }
    const res = await response.json();
    return res.data !== undefined ? res.data : res;
  },

  async getConsistency(): Promise<ConsistencyScore> {
    const response = await fetch(`${API_BASE_URL}/analytics/consistency`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch consistency score");
    }
    const res = await response.json();
    return res.data !== undefined ? res.data : res;
  },

  async getProductivity(): Promise<ProductivityStats> {
    const response = await fetch(`${API_BASE_URL}/analytics/productivity`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch productivity stats");
    }
    const res = await response.json();
    return res.data !== undefined ? res.data : res;
  },

  async getRevisions(): Promise<RevisionCandidate[]> {
    const response = await fetch(`${API_BASE_URL}/analytics/revisions`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch revision recommendations");
    }
    const res = await response.json();
    return res.data !== undefined ? res.data : res;
  },

  async getInsights(): Promise<AIInsights> {
    const response = await fetch(`${API_BASE_URL}/analytics/insights`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch AI insights");
    }
    const res = await response.json();
    const data = res.data !== undefined ? res.data : res;

    return {
      strengths: data.strengths || [],
      weaknesses: data.weaknesses || data.areasToImprove || [],
      recommendations: data.recommendations || [],
      nextActions: data.nextActions || (data.recommendations ? data.recommendations.map((r: string) => r.startsWith("Action:") ? r : `Focus: ${r}`) : []),
    };
  }
};

export interface PlanStatus {
  plan: "free" | "pro";
  interval: "monthly" | "yearly" | null;
  startedAt: string | null;
  expiresAt: string | null;
  isActive: boolean;
}

export const PlanAPI = {
  async getPlan(): Promise<PlanStatus> {
    const response = await fetch(`${API_BASE_URL}/plan`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch plan");
    }
    const res = await response.json();
    return res.data !== undefined ? res.data : res;
  },

  async upgradeToPro(interval: "monthly" | "yearly"): Promise<PlanStatus> {
    const response = await fetch(`${API_BASE_URL}/plan/upgrade`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ interval }),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to upgrade plan");
    }
    const res = await response.json();
    return res.data !== undefined ? res.data : res;
  }
};

export interface HistoryQueryOptions {
  page?: number;
  limit?: number;
  search?: string;
  feature?: string;
  dateRange?: string;
  sort?: string;
}

export interface LearningHistoryItem {
  id: string;
  userId: string;
  documentId: string;
  highlightedText: string;
  createdAt: string;
  activityType: "Explanation" | "GeneratedNote" | "GeneratedQuiz" | "QuizSet" | "InterviewQuestionSet" | "GeneratedMindMap" | "GeneratedAnalogy" | "GeneratedSimulation";
  document?: {
    title: string;
  };
  explanationText?: string;
  title?: string;
  notes?: any;
  quizData?: any;
  quizJson?: any;
  questionsJson?: any;
  mindMapData?: any;
  analogyData?: any;
  simulationData?: any;
  simulationType?: string;
  difficulty?: string;
  style?: string;
  score?: number;
  totalQuestions?: number;
  status?: string;
  topicsToImprove?: string[];
}

export interface HistoryListResponse {
  items: LearningHistoryItem[];
  total: number;
  hasMore: boolean;
  page: number;
  limit: number;
}

export interface SuggestionItem {
  topic: string;
  reason: string;
  priority: "High" | "Medium" | "Low";
}

export const LearningHistoryAPI = {
  async getHistory(options: HistoryQueryOptions = {}): Promise<HistoryListResponse> {
    const queryParams = new URLSearchParams();
    if (options.page) queryParams.append("page", options.page.toString());
    if (options.limit) queryParams.append("limit", options.limit.toString());
    if (options.search) queryParams.append("search", options.search);
    if (options.feature) queryParams.append("feature", options.feature);
    if (options.dateRange) queryParams.append("dateRange", options.dateRange);
    if (options.sort) queryParams.append("sort", options.sort);

    const response = await fetch(`${API_BASE_URL}/learning-history?${queryParams.toString()}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch learning history");
    }

    const resJson = await response.json();
    return resJson.data;
  },

  async getHistoryItem(id: string, activityType?: string): Promise<LearningHistoryItem> {
    const queryParams = new URLSearchParams();
    if (activityType) queryParams.append("type", activityType);

    const response = await fetch(`${API_BASE_URL}/learning-history/${id}?${queryParams.toString()}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch history details");
    }

    const resJson = await response.json();
    return resJson.data;
  },

  async deleteHistoryItem(id: string, activityType?: string): Promise<{ success: boolean; message: string }> {
    const queryParams = new URLSearchParams();
    if (activityType) queryParams.append("type", activityType);

    const response = await fetch(`${API_BASE_URL}/learning-history/${id}?${queryParams.toString()}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to delete history item");
    }

    return response.json();
  },

  async getSuggestions(): Promise<SuggestionItem[]> {
    const response = await fetch(`${API_BASE_URL}/learning-history/suggestions`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch personalized suggestions");
    }

    const resJson = await response.json();
    return resJson.data;
  }
};
export interface AccountSettingsData {
  id: string;
  fullName: string;
  email: string;
  avatarUrl: string;
  provider: string;
  memberSince: string;
}

export interface AccountSettingsResponse {
  success: boolean;
  data: AccountSettingsData;
}

export const SettingsAPI = {
  async getAccountSettings(): Promise<AccountSettingsResponse> {
    const { data, error } = await authClient.$fetch(`${API_BASE_URL}/settings/account`, {
      method: "GET",
    });


    if (error) {
      throw new Error(error.message || "Failed to fetch account settings");
    }

    return data as AccountSettingsResponse;
  },

  async changePassword(payload: { currentPassword: string; newPassword: string; confirmPassword: string }): Promise<{ success: boolean; message: string }> {
    const { data, error } = await authClient.$fetch(`${API_BASE_URL}/settings/change-password`, {
      method: "PATCH",
      body: payload
    });

    if (error) {
      throw new Error(error.message || "Unable to update password. Please try again.");
    }

    return data as { success: boolean; message: string };
  },

  async deleteAccount(payload: { password?: string }): Promise<{ success: boolean; message: string }> {
    const { data, error } = await authClient.$fetch(`${API_BASE_URL}/settings/delete-account`, {
      method: "DELETE",
      body: payload
    });

    if (error) {
      throw new Error(error.message || "Unable to delete account. Please try again.");
    }

    return data as { success: boolean; message: string };
  },

  async exportData(): Promise<{ blob: Blob, filename: string }> {
    let filename = "learnflow-data.zip";
    const { data, error } = await authClient.$fetch<Blob>(`${API_BASE_URL}/settings/export`, {
      method: "GET",
      responseType: "blob",
      onResponse: (context: any) => {
        const cd = context.response?.headers?.get("Content-Disposition");
        if (cd) {
          const match = cd.match(/filename="?([^"]+)"?/);
          if (match && match[1]) filename = match[1];
        }
      }
    } as any);

    if (error) {
      throw new Error(error.message || "Unable to export your data. Please try again.");
    }

    return { blob: data as Blob, filename };
  },

  async getStorageSettings(): Promise<{
    success: boolean;
    data: {
      totalLimit: number;
      totalUsed: number;
      percentageUsed: number;
      breakdown: {
        documents: { count: number; sizeBytes: number };
        notes: { count: number; sizeBytes: number };
        quizzes: { count: number; sizeBytes: number };
        conversations: { count: number; sizeBytes: number };
      }
    }
  }> {
    const { data, error } = await authClient.$fetch(`${API_BASE_URL}/settings/storage`, {
      method: "GET",
    });

    if (error) {
      throw new Error(error.message || "Failed to fetch storage settings");
    }

    return data as any;
  },

  async deleteCache(): Promise<{ success: boolean; message: string }> {
    const { data, error } = await authClient.$fetch(`${API_BASE_URL}/settings/storage/delete-cache`, {
      method: "POST",
    });

    if (error) {
      throw new Error(error.message || "Failed to delete cache");
    }

    return data as any;
  }
};

export interface Alert {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  type: "info" | "success" | "warning" | "error";
  createdAt: string;
}

export const AlertsAPI = {
  async getAlerts(): Promise<Alert[]> {
    const response = await fetch(`${API_BASE_URL}/alerts`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch alerts");
    }

    const resJson = await response.json();
    return resJson.alerts;
  },

  async markAllRead(): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_BASE_URL}/alerts/mark-all-read`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to mark alerts as read");
    }

    return response.json();
  },

  async deleteAlert(id: string): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_BASE_URL}/alerts/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to delete alert");
    }

    return response.json();
  },

  async seedAlerts(): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_BASE_URL}/alerts/seed`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to seed alerts");
    }

    return response.json();
  }
};

export const FeedbackAPI = {
  async submitFeedback(data: { rating: number; comment?: string }): Promise<{ success: boolean; message: string }> {
    const payload: { rating: number; comment?: string } = {
      rating: Math.max(1, Math.min(5, Math.round(Number(data.rating) || 5))),
    };

    if (data.comment && typeof data.comment === "string" && data.comment.trim()) {
      payload.comment = data.comment.trim();
    }

    const response = await fetch(`${API_BASE_URL}/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to submit feedback (${response.status})`);
    }

    return response.json();
  },

  async getMyFeedback(): Promise<{ success: boolean; data: any[] }> {
    const response = await fetch(`${API_BASE_URL}/feedback`, {
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to get feedback");
    }

    return response.json();
  },
};

