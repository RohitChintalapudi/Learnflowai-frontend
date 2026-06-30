import { useState, useMemo } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Calendar, ArrowUpDown, SlidersHorizontal } from "lucide-react";

// API & Helpers
import { LearningHistoryAPI, WorkflowAPI, DocumentAPI, AnalyticsAPI } from "../../lib/api";
import type { LearningHistoryItem } from "../../lib/api";

// Layout & Custom components
import { DashboardLayout } from "../../components/DashboardLayout";
import { HistoryStats } from "../../components/LearningHistory/HistoryStats";
import { HistorySearch } from "../../components/LearningHistory/HistorySearch";
import { HistoryFilters } from "../../components/LearningHistory/HistoryFilters";
import { Timeline } from "../../components/LearningHistory/Timeline";
import { HistoryDrawer } from "../../components/LearningHistory/HistoryDrawer";
import { LearningInsightsSidebar } from "../../components/LearningHistory/LearningInsightsSidebar";
import { HistoryEmptyState } from "../../components/LearningHistory/HistoryEmptyState";
import { HistorySkeleton } from "../../components/LearningHistory/HistorySkeleton";
import { DeleteModal } from "../../components/LearningHistory/DeleteModal";

export const Route = createFileRoute("/_authenticated/learning-history")({
  component: LearningHistoryPage,
});

function LearningHistoryPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Search & Filter State
  const [search, setSearch] = useState("");
  const [feature, setFeature] = useState("All");
  const [dateRange, setDateRange] = useState("All Time");
  const [sort, setSort] = useState("Newest");

  // Selection states for Drawer and Delete Dialog
  const [selectedItem, setSelectedItem] = useState<LearningHistoryItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<LearningHistoryItem | null>(null);

  // 1. Fetch overall counts for stats
  const { data: overview, isLoading: isOverviewLoading } = useQuery({
    queryKey: ["analyticsOverview"],
    queryFn: () => AnalyticsAPI.getOverview(),
  });

  const { data: summary, isLoading: isSummaryLoading } = useQuery({
    queryKey: ["dashboardSummary"],
    queryFn: () => DocumentAPI.getDashboardSummary(),
  });

  // 2. Infinite query for history items list
  const {
    data: historyPages,
    isLoading: isHistoryLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["learningHistory", search, feature, dateRange, sort],
    queryFn: ({ pageParam = 1 }) =>
      LearningHistoryAPI.getHistory({
        page: pageParam,
        limit: 15,
        search,
        feature,
        dateRange,
        sort,
      }),
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.page + 1 : undefined),
    initialPageParam: 1,
  });

  // 3. Fetch suggestions from service
  const { data: suggestions = [], isLoading: isLoadingSuggestions } = useQuery({
    queryKey: ["learningSuggestions"],
    queryFn: () => LearningHistoryAPI.getSuggestions(),
  });

  // Consolidate list items from infinite scroll pages
  const allItems = useMemo(() => {
    return historyPages ? historyPages.pages.flatMap((page) => page.items) : [];
  }, [historyPages]);

  // Aggregate stats totals
  const stats = useMemo(() => {
    const docs = overview?.documentsUploaded ?? summary?.stats?.documentsCount ?? 0;
    const exps = overview?.explanationsGenerated ?? summary?.stats?.explanationsCount ?? 0;
    const notes = overview?.notesGenerated ?? summary?.stats?.notesCount ?? 0;
    const quizzes = overview?.quizzesGenerated ?? summary?.stats?.quizzesCount ?? 0;
    const maps = overview?.mindMapsGenerated ?? 0;
    const analogies = overview?.analogiesGenerated ?? 0;
    
    // We fetch a preview to sum total simulations
    const sims = allItems.filter(item => item.activityType === "GeneratedSimulation").length;
    
    return {
      documentsCount: docs,
      generationsCount: exps + notes + quizzes + maps + analogies + sims,
      notesCount: notes,
      quizzesCount: quizzes,
      mindMapsCount: maps,
      analogiesCount: analogies,
      simulationsCount: sims || 0
    };
  }, [overview, summary, allItems]);

  // Derived Insights
  const insights = useMemo(() => {
    const streak = summary?.stats?.learningStreak ?? 8;
    
    // Find favorite feature
    const counts: Record<string, number> = {};
    allItems.forEach(item => {
      counts[item.activityType] = (counts[item.activityType] || 0) + 1;
    });
    
    let fav = "AI Explanation";
    let max = 0;
    Object.keys(counts).forEach(key => {
      if (counts[key] > max) {
        max = counts[key];
        if (key === "Explanation") fav = "AI Explanation";
        else if (key === "GeneratedNote") fav = "AI Notes";
        else if (key === "QuizSet" || key === "GeneratedQuiz") fav = "AI Quiz";
        else if (key === "InterviewQuestionSet") fav = "Interview Questions";
        else if (key === "GeneratedMindMap") fav = "AI Mind Maps";
        else if (key === "GeneratedAnalogy") fav = "AI Analogies";
        else if (key === "GeneratedSimulation") fav = "AI Simulations";
      }
    });

    // Find most studied topic
    const topicCounts: Record<string, number> = {};
    allItems.forEach(item => {
      if (item.document?.title) {
        topicCounts[item.document.title] = (topicCounts[item.document.title] || 0) + 1;
      }
    });
    let topTopic = "Operating Systems";
    let topTopicMax = 0;
    Object.keys(topicCounts).forEach(title => {
      if (topicCounts[title] > topTopicMax) {
        topTopicMax = topicCounts[title];
        topTopic = title.replace(/\.[^/.]+$/, ""); // strip extension
      }
    });

    // Find last activity text
    let lastAct = "Generated Mind Map";
    if (allItems.length > 0) {
      const latest = allItems[0];
      if (latest.activityType === "Explanation") lastAct = "Asked Explanation";
      else if (latest.activityType === "GeneratedNote") lastAct = "Created Notes";
      else if (latest.activityType === "QuizSet" || latest.activityType === "GeneratedQuiz") lastAct = "Completed Quiz";
      else if (latest.activityType === "InterviewQuestionSet") lastAct = "Generated Interview practice";
      else if (latest.activityType === "GeneratedMindMap") lastAct = "Created Mind Map";
      else if (latest.activityType === "GeneratedAnalogy") lastAct = "Created Analogy";
      else if (latest.activityType === "GeneratedSimulation") lastAct = "Generated Simulation";
    }

    return {
      streak,
      favoriteFeature: fav,
      mostStudiedTopic: topTopic,
      lastActivity: lastAct
    };
  }, [allItems, summary]);

  // Action: Deletion
  const deleteMutation = useMutation({
    mutationFn: (param: { id: string; type: string }) =>
      LearningHistoryAPI.deleteHistoryItem(param.id, param.type),
    onSuccess: () => {
      toast.success("Activity removed from history.");
      setDeleteItem(null);
      queryClient.invalidateQueries({ queryKey: ["learningHistory"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardSummary"] });
      queryClient.invalidateQueries({ queryKey: ["analyticsOverview"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to delete item.");
    },
  });

  const confirmDelete = () => {
    if (deleteItem) {
      deleteMutation.mutate({ id: deleteItem.id, type: deleteItem.activityType });
    }
  };

  // Action: Regeneration
  const handleRegenerate = async (item: LearningHistoryItem) => {
    if (!item.documentId) {
      toast.error("Cannot regenerate without a source document reference.");
      return;
    }

    const toastId = toast.loading("Regenerating AI content...");
    try {
      if (item.activityType === "Explanation") {
        await WorkflowAPI.generateExplanation(item.documentId, item.highlightedText);
      } else if (item.activityType === "GeneratedNote") {
        await WorkflowAPI.generateNotes(item.documentId, item.highlightedText);
      } else if (item.activityType === "QuizSet" || item.activityType === "GeneratedQuiz") {
        await WorkflowAPI.generateQuiz(item.documentId, item.highlightedText);
      } else if (item.activityType === "InterviewQuestionSet") {
        await WorkflowAPI.generateInterviewQuestions(item.documentId, item.highlightedText);
      } else if (item.activityType === "GeneratedMindMap") {
        await WorkflowAPI.generateMindMap(item.documentId, item.highlightedText);
      } else if (item.activityType === "GeneratedAnalogy") {
        await WorkflowAPI.generateAnalogy(item.documentId, item.highlightedText, item.style || "creative");
      } else if (item.activityType === "GeneratedSimulation") {
        await WorkflowAPI.generateSimulation({
          documentId: item.documentId,
          highlightedText: item.highlightedText,
          simulationType: (item.simulationType as any) || "visual-flow",
          difficulty: (item.difficulty as any) || "intermediate",
        });
      } else {
        throw new Error("Unsupported activity type for regeneration");
      }

      toast.success("Regenerated successfully! Timeline updated.", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["learningHistory"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardSummary"] });
      queryClient.invalidateQueries({ queryKey: ["analyticsOverview"] });
    } catch (err: any) {
      console.error("Failed to regenerate:", err);
      toast.error(err.message || "Failed to regenerate AI content.", { id: toastId });
    }
  };

  const handleOpenDrawer = (item: LearningHistoryItem) => {
    setSelectedItem(item);
    setIsDrawerOpen(true);
  };

  const clearFilters = () => {
    setSearch("");
    setFeature("All");
    setDateRange("All Time");
    setSort("Newest");
  };

  const isFilterActive = search !== "" || feature !== "All" || dateRange !== "All Time";
  const pageLoading = isHistoryLoading || isOverviewLoading || isSummaryLoading;

  return (
    <DashboardLayout headerTitle="Learning History">
      <div className="flex-1 overflow-y-auto p-8 relative no-scrollbar">
        {/* Orange glow background */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[150px] pointer-events-none translate-x-1/4 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-500/8 rounded-full blur-[120px] pointer-events-none -translate-x-1/4 translate-y-1/4" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[130px] pointer-events-none" />

        <div className="max-w-[1200px] mx-auto space-y-8 pb-12 relative z-10">
          {/* Header Description */}
          <div className="space-y-1" data-tour="learning-history-heading">
            <h1 className="text-2xl font-black tracking-tight text-[var(--lf-text-primary)]">
              Study Memory Engine
            </h1>
            <p className="text-xs text-[var(--lf-text-secondary)]">
              Interactive timeline of all generated explanations, quizzes, mind maps, analogies, notes, and study sets.
            </p>
          </div>

          {pageLoading ? (
            <HistorySkeleton />
          ) : (
            <div className="space-y-8">
              {/* Quick stats row */}
              <HistoryStats stats={stats} />

              {/* Sub-header Search & Filters (Optimized Layout to avoid horizontal overflow) */}
              <div className="flex flex-col gap-4 bg-white/40 dark:bg-zinc-950/40 p-5 border border-[var(--lf-border)] rounded-2xl backdrop-blur-md">
                {/* Row 1: Search box and Date/Sort dropdowns */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <HistorySearch value={search} onChange={setSearch} />
                  
                  {/* Date & Sort selectors */}
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Date Ranges */}
                    <div className="flex items-center gap-1 bg-white/60 dark:bg-zinc-900/40 border border-[var(--lf-border)] rounded-xl p-1 backdrop-blur-md">
                      <Calendar className="h-3.5 w-3.5 text-[var(--lf-text-secondary)] ml-2 mr-1" />
                      {["All Time", "Today", "7 Days", "30 Days"].map((range) => {
                        const active = dateRange === range;
                        return (
                          <button
                            key={range}
                            onClick={() => setDateRange(range)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                              active
                                ? "bg-[var(--lf-surface)] text-[var(--lf-accent)] shadow-sm font-bold"
                                : "text-[var(--lf-text-secondary)] hover:text-[var(--lf-text-primary)]"
                            }`}
                          >
                            {range}
                          </button>
                        );
                      })}
                    </div>

                    {/* Sort */}
                    <div className="flex items-center gap-1 bg-white/60 dark:bg-zinc-900/40 border border-[var(--lf-border)] rounded-xl p-1 backdrop-blur-md">
                      <ArrowUpDown className="h-3.5 w-3.5 text-[var(--lf-text-secondary)] ml-2 mr-1" />
                      {["Newest", "Oldest"].map((s) => {
                        const active = sort === s;
                        return (
                          <button
                            key={s}
                            onClick={() => setSort(s)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                              active
                                ? "bg-[var(--lf-surface)] text-[var(--lf-accent)] shadow-sm font-bold"
                                : "text-[var(--lf-text-secondary)] hover:text-[var(--lf-text-primary)]"
                            }`}
                          >
                            {s}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="h-[1px] bg-[var(--lf-border)]" />

                {/* Row 2: Scrollable Feature Filter pills */}
                <HistoryFilters feature={feature} onChangeFeature={setFeature} />
              </div>

              {/* Layout splits */}
              <div className="grid grid-cols-12 gap-8 items-start !mt-4">
                {/* Timeline Column */}
                <div className="col-span-12 lg:col-span-8">
                  {allItems.length === 0 ? (
                    isFilterActive ? (
                      <div className="flex flex-col items-center justify-center p-8 text-center bg-white/60 dark:bg-zinc-900/40 border border-[var(--lf-border)] rounded-3xl backdrop-blur-md min-h-[300px] max-w-xl mx-auto space-y-4">
                        <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500">
                          <SlidersHorizontal className="h-5 w-5" />
                        </div>
                        <div className="space-y-1.5">
                          <h3 className="text-base font-extrabold text-[var(--lf-text-primary)]">
                            No matching generations found.
                          </h3>
                          <p className="text-xs text-[var(--lf-text-secondary)] leading-relaxed">
                            Try adjusting your filters or clearing your search query to see your learning history.
                          </p>
                        </div>
                        <button
                          onClick={clearFilters}
                          className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold shadow-lg shadow-orange-500/20 transition-all active:scale-[0.98]"
                        >
                          Clear Active Filters
                        </button>
                      </div>
                    ) : (
                      <HistoryEmptyState
                        onGenerateExplanation={() => navigate({ to: "/workspace" as any })}
                        onUploadDocument={() => navigate({ to: "/documents" as any })}
                      />
                    )
                  ) : (
                    <Timeline
                      items={allItems}
                      onView={handleOpenDrawer}
                      onDelete={setDeleteItem}
                      onRegenerate={handleRegenerate}
                      hasMore={hasNextPage}
                      onLoadMore={fetchNextPage}
                      isLoadingMore={isFetchingNextPage}
                    />
                  )}
                </div>

                {/* Sidebar Column */}
                <div className="col-span-12 lg:col-span-4 sticky top-6">
                  <LearningInsightsSidebar
                    streak={insights.streak}
                    mostStudiedTopic={insights.mostStudiedTopic}
                    favoriteFeature={insights.favoriteFeature}
                    lastActivity={insights.lastActivity}
                    suggestions={suggestions}
                    isLoadingSuggestions={isLoadingSuggestions}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Details drawer */}
      <HistoryDrawer
        isOpen={isDrawerOpen}
        item={selectedItem}
        onClose={() => setIsDrawerOpen(false)}
        onRegenerate={handleRegenerate}
      />

      {/* Deletion Dialog */}
      <DeleteModal
        isOpen={deleteItem !== null}
        onClose={() => setDeleteItem(null)}
        onConfirm={confirmDelete}
        title={
          deleteItem?.title ||
          deleteItem?.highlightedText?.substring(0, 30) +
            (deleteItem?.highlightedText && deleteItem.highlightedText.length > 30 ? "..." : "") ||
          "AI Generation"
        }
      />
    </DashboardLayout>
  );
}
