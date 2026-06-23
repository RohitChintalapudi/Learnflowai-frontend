import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ActivityCalendar } from 'react-activity-calendar';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import { AnalyticsAPI } from "../../lib/api";
import { DashboardLayout } from "../../components/DashboardLayout";
import { motion } from "framer-motion";
import { 
  Activity, 
  Brain, 
  Target, 
  TrendingUp, 
  Sparkles, 
  Lightbulb, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight,
  Clock,
  Calendar
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  PieChart, Pie, Cell
} from "recharts";

export const Route = createFileRoute('/_authenticated/analytics')({
  component: AnalyticsDashboard,
});

// -- Theming --

// -- Skeleton Loader --
function DashboardSkeleton() {
  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-8 flex-1 overflow-y-auto no-scrollbar">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="h-10 w-64 bg-[var(--lf-card)] border border-[var(--lf-border)] rounded-xl animate-pulse"></div>
        <div className="h-10 w-32 bg-[var(--lf-card)] border border-[var(--lf-border)] rounded-full animate-pulse"></div>
      </div>
      
      {/* Coach Skeleton */}
      <div className="w-full h-64 bg-[var(--lf-card)] border border-[var(--lf-border)] rounded-3xl p-8 relative overflow-hidden animate-pulse">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-12 w-12 rounded-xl bg-amber-500/10"></div>
          <div>
            <div className="h-7 w-48 bg-[var(--lf-border)] rounded-lg mb-2"></div>
            <div className="h-4 w-64 bg-[var(--lf-border)]/50 rounded-lg"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-24 rounded-2xl bg-[var(--lf-bg-secondary)]/50 border border-[var(--lf-border)]"></div>
          ))}
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-3">
          <Sparkles className="h-8 w-8 text-amber-500/50 animate-bounce" />
          <p className="text-[var(--lf-text-secondary)] font-medium">Coach Insights is analyzing your learning patterns...</p>
        </div>
      </div>

      {/* Metrics Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-[120px] bg-[var(--lf-card)] rounded-2xl border border-[var(--lf-border)] animate-pulse p-6">
            <div className="h-4 w-24 bg-[var(--lf-border)] rounded mb-4"></div>
            <div className="h-10 w-16 bg-[var(--lf-border)] rounded"></div>
          </div>
        ))}
      </div>

      {/* Middle Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 h-[400px] bg-[var(--lf-card)] rounded-2xl border border-[var(--lf-border)] animate-pulse p-6">
          <div className="h-6 w-48 bg-[var(--lf-border)] rounded mb-6"></div>
          <div className="h-64 w-full bg-[var(--lf-border)]/50 rounded-xl"></div>
        </div>
        <div className="lg:col-span-5 h-[400px] bg-[var(--lf-card)] rounded-2xl border border-[var(--lf-border)] animate-pulse flex flex-col items-center justify-center">
          <div className="h-48 w-48 rounded-full border-[16px] border-[var(--lf-border)]"></div>
        </div>
      </div>
    </div>
  );
}

// -- Main Component --
function AnalyticsDashboard() {
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    // Check initial state
    setIsDark(document.documentElement.classList.contains('dark'));
    // Listen for class changes on HTML element
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const { data: overview, isLoading: loadingOverview } = useQuery({ queryKey: ['analytics', 'overview'], queryFn: AnalyticsAPI.getOverview, refetchOnMount: 'always', gcTime: 0 });
  const { data: activity, isLoading: loadingActivity } = useQuery({ queryKey: ['analytics', 'activity'], queryFn: () => AnalyticsAPI.getActivity(30), refetchOnMount: 'always', gcTime: 0 });
  const { data: featureUsage, isLoading: loadingFeatures } = useQuery({ queryKey: ['analytics', 'featureUsage'], queryFn: AnalyticsAPI.getFeatureUsage, refetchOnMount: 'always', gcTime: 0 });
  const { data: topics, isLoading: loadingTopics } = useQuery({ queryKey: ['analytics', 'topics'], queryFn: AnalyticsAPI.getTopics, refetchOnMount: 'always', gcTime: 0 });
  const { data: consistency, isLoading: loadingConsistency } = useQuery({ queryKey: ['analytics', 'consistency'], queryFn: AnalyticsAPI.getConsistency, refetchOnMount: 'always', gcTime: 0 });
  const { data: productivity, isLoading: loadingProductivity } = useQuery({ queryKey: ['analytics', 'productivity'], queryFn: AnalyticsAPI.getProductivity, refetchOnMount: 'always', gcTime: 0 });
  const { data: revisions, isLoading: loadingRevisions } = useQuery({ queryKey: ['analytics', 'revisions'], queryFn: AnalyticsAPI.getRevisions, refetchOnMount: 'always', gcTime: 0 });
  const { data: insights, isLoading: loadingInsights } = useQuery({ queryKey: ['analytics', 'insights'], queryFn: AnalyticsAPI.getInsights, refetchOnMount: 'always', gcTime: 0 });
  const { data: activityYear, isLoading: loadingActivityYear } = useQuery({ queryKey: ['analytics', 'activity', 365], queryFn: () => AnalyticsAPI.getActivity(365), refetchOnMount: 'always', gcTime: 0 });

  const isLoading = loadingOverview || loadingActivity || loadingFeatures || loadingTopics || loadingConsistency || loadingProductivity || loadingRevisions || loadingInsights || loadingActivityYear;

  const generateYearData = React.useCallback((data?: { date: string; count: number }[]) => {
    const map = new Map<string, number>();
    if (data) {
      data.forEach(d => map.set(d.date.split('T')[0], d.count));
    }
    const result = [];
    const end = new Date();
    const start = new Date();
    start.setFullYear(start.getFullYear() - 1);
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateString = d.toISOString().split('T')[0];
      const count = map.get(dateString) || 0;
      let level = 0;
      if (count > 0) level = 1;
      if (count > 2) level = 2;
      if (count > 5) level = 3;
      if (count > 9) level = 4;
  
      result.push({
        date: dateString,
        count: count,
        level: level
      });
    }
    return result;
  }, []);
  
  const calendarData = React.useMemo(() => generateYearData(activityYear), [activityYear, generateYearData]);

  const explicitTheme = {
    light: ['#E5E7EB', '#FFE7C2', '#FFC266', '#FF9A1F', '#EA7A00'],
    dark: ['#333333', '#4A3620', '#8B5A1A', '#D97706', '#FF8C00'],
  };

  const totalActivities = React.useMemo(() => {
    return calendarData.reduce((sum, day) => sum + day.count, 0);
  }, [calendarData]);
  const currentYear = new Date().getFullYear();

  if (isLoading) return (
    <DashboardLayout headerTitle="Analytics">
      <DashboardSkeleton />
    </DashboardLayout>
  );

  return (
    <DashboardLayout headerTitle="Analytics">
      <div className="p-8 max-w-[1400px] mx-auto space-y-8 flex-1 overflow-y-auto no-scrollbar">
      
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[var(--lf-text-primary)]">AI Learning Analytics</h1>
        <div className="flex items-center gap-2 px-4 py-2 bg-[var(--lf-bg-secondary)] border border-[var(--lf-border-primary)] rounded-full text-sm font-medium text-[var(--lf-text-secondary)]">
          <Activity className="h-4 w-4 text-amber-500" />
          Last 30 Days
        </div>
      </header>

      {/* AI Coach Widget */}
      {insights && <AICoachWidget insights={insights} />}

      {/* Overview Metrics */}
      {overview && (
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <MetricCard 
            title="Total AI Interactions" 
            value={overview.totalAiInteractions} 
            icon={<Brain className="h-4.5 w-4.5 text-orange-400" />} 
            bg="bg-orange-500/10" 
            border="border-orange-500/20" 
          />
          <MetricCard 
            title="Notes Generated" 
            value={overview.notesGenerated} 
            icon={<CheckCircle2 className="h-4.5 w-4.5 text-[var(--lf-accent)]" />} 
            bg="bg-[var(--lf-accent)]/10" 
            border="border-[var(--lf-accent)]/20" 
          />
          <MetricCard 
            title="Quizzes Taken" 
            value={overview.quizzesGenerated} 
            icon={<Target className="h-4.5 w-4.5 text-orange-400" />} 
            bg="bg-orange-500/10" 
            border="border-orange-500/20" 
          />
          <MetricCard 
            title="Mind Maps Created" 
            value={overview.mindMapsGenerated} 
            icon={<TrendingUp className="h-4.5 w-4.5 text-[var(--lf-accent)]" />} 
            bg="bg-[var(--lf-accent)]/10" 
            border="border-[var(--lf-accent)]/20" 
          />
        </section>
      )}

      {/* Heatmap Section */}
      <section className="bg-[var(--lf-card)] border border-[var(--lf-border)] rounded-2xl p-8 card-shadow">
        <h3 className="text-lg font-semibold text-[var(--lf-text-primary)] mb-6 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-amber-500" /> Learning Consistency
        </h3>
        <div className="w-full overflow-x-auto pb-4 no-scrollbar">
          <div className="min-w-max md:flex md:justify-center">
            <ActivityCalendar
              data={calendarData}
              theme={explicitTheme}
              colorScheme={isDark ? 'dark' : 'light'}
              blockSize={12}
              blockRadius={2}
              blockMargin={4}
              fontSize={12}
              showWeekdayLabels={true}
              labels={{
                totalCount: `${totalActivities} learning activities in ${currentYear}`,
                legend: {
                  less: 'Less',
                  more: 'More'
                }
              }}
              renderBlock={(block, activity) => React.cloneElement(block as React.ReactElement<any>, {
                'data-tooltip-id': 'react-tooltip',
                'data-tooltip-content': `${activity.count} learning activities on ${activity.date}`,
                className: 'transition-all duration-200 hover:ring-2 hover:ring-orange-400 hover:ring-offset-1 hover:ring-offset-[var(--lf-bg-primary)] cursor-pointer',
              })}
            />
            <ReactTooltip id="react-tooltip" className="z-50" />
          </div>
        </div>
      </section>

      {/* Middle Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[var(--lf-card)] border border-[var(--lf-border)] rounded-2xl p-6 card-shadow relative overflow-hidden">
            <h3 className="text-lg font-semibold text-[var(--lf-text-primary)] mb-6 flex items-center gap-2">
              <Activity className="h-5 w-5 text-amber-500" /> Activity Timeline
            </h3>
            <div className="h-72">
              {activity && activity.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--lf-border-primary)" vertical={false} />
                    <XAxis dataKey="date" stroke="var(--lf-text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--lf-text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: 'var(--lf-bg-primary)', borderColor: 'var(--lf-border-primary)', borderRadius: '8px', color: 'var(--lf-text-primary)' }}
                      itemStyle={{ color: '#f59e0b' }}
                    />
                    <Area type="monotone" dataKey="count" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <EmptyState message="Not enough activity data. Keep learning!" />
              )}
            </div>
          </div>

          {/* Productivity Stats */}
          {productivity && (
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-[var(--lf-card)] border border-[var(--lf-border)] rounded-2xl p-6 card-shadow flex items-center gap-4">
                <div className="p-4 bg-blue-500/10 rounded-xl text-blue-500"><Calendar className="h-6 w-6" /></div>
                <div>
                  <p className="text-sm text-[var(--lf-text-secondary)] font-medium">Most Active Day</p>
                  <p className="text-xl font-bold text-[var(--lf-text-primary)]">{productivity.mostActiveDay || "N/A"}</p>
                </div>
              </div>
              <div className="bg-[var(--lf-card)] border border-[var(--lf-border)] rounded-2xl p-6 card-shadow flex items-center gap-4">
                <div className="p-4 bg-purple-500/10 rounded-xl text-purple-500"><Clock className="h-6 w-6" /></div>
                <div>
                  <p className="text-sm text-[var(--lf-text-secondary)] font-medium">Peak Hour</p>
                  <p className="text-xl font-bold text-[var(--lf-text-primary)]">{productivity.mostActiveHour || "N/A"}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Consistency Dial */}
        <div className="lg:col-span-5">
          <div className="bg-[var(--lf-card)] border border-[var(--lf-border)] rounded-2xl p-6 card-shadow h-full flex flex-col items-center justify-center">
            <h3 className="text-lg font-semibold text-[var(--lf-text-primary)] mb-8 w-full text-left flex items-center gap-2">
              <Target className="h-5 w-5 text-emerald-500" /> Consistency Score
            </h3>
            {consistency ? (
              <div className="relative w-64 h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[{ value: consistency.score }, { value: 100 - consistency.score }]}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={100}
                      startAngle={90}
                      endAngle={-270}
                      dataKey="value"
                      stroke="none"
                      cornerRadius={10}
                    >
                      <Cell fill="#10b981" />
                      <Cell fill="var(--lf-border-primary)" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-5xl font-black text-[var(--lf-text-primary)]">{consistency.score}</span>
                  <span className="text-sm font-medium text-emerald-500 mt-1 uppercase tracking-widest">{consistency.level}</span>
                </div>
              </div>
            ) : (
              <EmptyState message="Consistency data unavailable" />
            )}
            {consistency && (
              <div className="mt-6 flex flex-col items-center w-full px-2">
                <p className="text-center text-sm font-medium text-[var(--lf-text-primary)] mb-4">{consistency.reason}</p>
                <div className="w-full bg-[var(--lf-bg-secondary)]/50 rounded-xl p-3 border border-[var(--lf-border)] flex flex-col items-center">
                  <span className="text-[10px] text-[var(--lf-text-secondary)] uppercase font-bold tracking-wider mb-1.5">Score Calculation</span>
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-500/90 dark:text-emerald-400">
                    <span>Frequency (40%)</span>
                    <span className="text-[var(--lf-border-primary)]">&bull;</span>
                    <span>Streaks (40%)</span>
                    <span className="text-[var(--lf-border-primary)]">&bull;</span>
                    <span>Diversity (20%)</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Bottom Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Topics & Revisions */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-[var(--lf-card)] border border-[var(--lf-border)] rounded-2xl p-6 card-shadow">
            <h3 className="text-lg font-semibold text-[var(--lf-text-primary)] mb-6 flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" /> Top Topics Focus
            </h3>
            {topics && topics.length > 0 ? (
              <div className="space-y-3">
                {topics.slice(0, 5).map((t, i) => {
                  const maxFreq = Math.max(...topics.map(x => x.frequency));
                  const pct = Math.round((t.frequency / maxFreq) * 100);
                  return (
                    <div key={i} className="relative h-10 flex items-center px-4 rounded-lg overflow-hidden bg-[var(--lf-bg-secondary)] border border-[var(--lf-border-primary)] z-0">
                      <div className="absolute left-0 top-0 bottom-0 bg-blue-500/20 -z-10 rounded-l-lg" style={{ width: `${pct}%` }}></div>
                      <span className="font-medium text-[var(--lf-text-primary)] flex-1 truncate">{t.topic}</span>
                      <span className="text-[var(--lf-text-secondary)] text-sm font-semibold">{t.frequency}x</span>
                    </div>
                  );
                })}
              </div>
            ) : <EmptyState message="No topics identified yet." />}
          </div>

          <div className="bg-[var(--lf-card)] border border-[var(--lf-border)] rounded-2xl p-6 card-shadow">
            <h3 className="text-lg font-semibold text-[var(--lf-text-primary)] mb-6 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" /> Revision Recommendations
            </h3>
            {revisions && revisions.length > 0 ? (
              <div className="space-y-3">
                {revisions.map((rev, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-[var(--lf-border-primary)] bg-[var(--lf-bg-primary)] hover:bg-[var(--lf-bg-secondary)] transition-colors">
                    <div>
                      <h4 className="font-medium text-[var(--lf-text-primary)] truncate max-w-[200px] sm:max-w-[300px]">{rev.topic}</h4>
                      <p className="text-sm text-[var(--lf-text-secondary)]">Dormant for {rev.daysSinceLastReview} days</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      rev.priority === 'High' ? 'bg-red-500/20 text-red-500' : 
                      rev.priority === 'Medium' ? 'bg-amber-500/20 text-amber-500' : 
                      'bg-emerald-500/20 text-emerald-500'
                    }`}>
                      {rev.priority} Priority
                    </span>
                  </div>
                ))}
              </div>
            ) : <EmptyState message="You're all caught up!" />}
          </div>
        </div>

        {/* Radar Chart */}
        <div className="lg:col-span-6">
          <div className="bg-[var(--lf-card)] border border-[var(--lf-border)] rounded-2xl p-6 card-shadow h-full min-h-[400px] flex flex-col items-center">
            <h3 className="text-lg font-semibold text-[var(--lf-text-primary)] mb-2 w-full text-left flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-500" /> Feature Usage Distribution
            </h3>
            {featureUsage && featureUsage.length > 0 ? (
              <ResponsiveContainer width="100%" height={350}>
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={featureUsage}>
                  <PolarGrid stroke="var(--lf-border-primary)" />
                  <PolarAngleAxis dataKey="feature" tick={{ fill: 'var(--lf-text-secondary)', fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'var(--lf-bg-primary)', borderColor: 'var(--lf-border-primary)', borderRadius: '8px', color: 'var(--lf-text-primary)' }}
                  />
                  <Radar name="Usage" dataKey="count" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.4} />
                </RadarChart>
              </ResponsiveContainer>
            ) : <div className="flex-1 flex items-center"><EmptyState message="No feature usage data" /></div>}
          </div>
        </div>

      </section>

      </div>
    </DashboardLayout>
  );
}

// -- Sub Components --

function MetricCard({ title, value, icon, bg, border }: { title: string, value: number, icon: React.ReactNode, bg: string, border: string }) {
  return (
    <div className="group p-5 rounded-2xl bg-[var(--lf-card)] border border-[var(--lf-border)] hover:border-orange-500/30 card-shadow card-shadow-hover transition-all cursor-pointer relative overflow-hidden">
      <div
        className={`absolute top-0 right-0 w-24 h-24 ${bg} blur-2xl rounded-full translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-500`}
      />
      <div className="relative z-10">
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center ${bg} border ${border} mb-4 group-hover:scale-110 transition-transform`}
        >
          {icon}
        </div>
        <p className="text-[28px] font-bold text-[var(--lf-text-primary)] mb-1 leading-none">
          {value}
        </p>
        <p className="text-[12px] font-medium text-[var(--lf-text-secondary)]">
          {title}
        </p>
      </div>
    </div>
  );
}

function AICoachWidget({ insights }: { insights: any }) {
  return (
    <section className="bg-[var(--lf-card)] border border-[var(--lf-border)] rounded-3xl p-1 card-shadow relative overflow-hidden">
      {/* Animated glowing orb behind */}
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-32 -left-32 w-64 h-64 bg-amber-500 rounded-full blur-[100px] pointer-events-none"
      />
      
      <div className="bg-[var(--lf-bg-primary)]/40 backdrop-blur-3xl rounded-[22px] p-8 w-full h-full relative z-10">
        <div className="flex items-center gap-3 mb-8 border-b border-[var(--lf-border-primary)] pb-6">
          <div className="p-3 bg-amber-500/10 rounded-xl">
            <Sparkles className="h-6 w-6 text-amber-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-500 to-orange-400 bg-clip-text text-transparent">Coach Insights</h2>
            <p className="text-[var(--lf-text-secondary)] text-sm font-medium">Your personalized AI learning analysis</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <CoachQuadrant title="Strengths" items={insights.strengths} color="emerald" icon={<TrendingUp className="h-4 w-4" />} />
          <CoachQuadrant title="Focus Areas" items={insights.weaknesses} color="amber" icon={<Target className="h-4 w-4" />} />
          <CoachQuadrant title="Recommendations" items={insights.recommendations} color="indigo" icon={<Lightbulb className="h-4 w-4" />} />
          <CoachQuadrant title="Next Actions" items={insights.nextActions} color="fuchsia" icon={<ArrowRight className="h-4 w-4" />} />
        </div>
      </div>
    </section>
  );
}

function CoachQuadrant({ title, items, color, icon }: { title: string, items: string[], color: string, icon: React.ReactNode }) {
  const colorMap: Record<string, string> = {
    emerald: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    amber: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    indigo: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20",
    fuchsia: "text-fuchsia-500 bg-fuchsia-500/10 border-fuchsia-500/20",
  };
  const dotMap: Record<string, string> = {
    emerald: "bg-emerald-500",
    amber: "bg-amber-500",
    indigo: "bg-indigo-500",
    fuchsia: "bg-fuchsia-500",
  };

  return (
    <div className={`p-5 rounded-2xl border ${colorMap[color]} flex flex-col`}>
      <h4 className="font-bold mb-4 flex items-center gap-2">
        {icon} {title}
      </h4>
      {items && items.length > 0 ? (
        <ul className="space-y-3 flex-1">
          {items.map((item, i) => (
            <motion.li 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              key={i} 
              className="text-sm text-[var(--lf-text-primary)] flex items-start gap-2"
            >
              <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${dotMap[color]}`}></span>
              <span className="leading-relaxed">{item}</span>
            </motion.li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-[var(--lf-text-secondary)] italic flex-1">No data available.</p>
      )}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center border border-dashed border-[var(--lf-border-primary)] rounded-xl bg-[var(--lf-bg-secondary)]/50">
      <AlertCircle className="h-8 w-8 text-[var(--lf-text-secondary)] mb-3 opacity-50" />
      <p className="text-[var(--lf-text-secondary)] font-medium">{message}</p>
    </div>
  );
}
