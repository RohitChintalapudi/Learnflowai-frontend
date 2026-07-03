import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link, useNavigate, useLocation } from "@tanstack/react-router";
import { ProfileAPI, AlertsAPI } from "../lib/api";
import type { Alert } from "../lib/api";
import { useQueryClient } from "@tanstack/react-query";

import {
  LayoutDashboard,
  FileText,
  Brain,
  StickyNote,
  HelpCircle,
  BarChart3,
  History,
  Settings,
  Bell,
  Sun,
  Moon,
  LogOut,
  ChevronLeft,
  ChevronRight,
  PlayCircle,
  CheckCheck,
  Trash2,
  Inbox,
} from "lucide-react";
import toast from "react-hot-toast";
import { ProfileModal } from "./ProfileModal";
import { authStore } from "../store/authStore";
import { authClient } from "../lib/auth-client";
import { useProductTour } from "../contexts/ProductTourContext";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/dashboard" },
  { icon: FileText, label: "Documents", to: "/documents" },
  { icon: Brain, label: "AI Workspace", to: "/workspace" },
  { icon: StickyNote, label: "Notes", to: "/notes" },
  { icon: HelpCircle, label: "Quizzes", to: "/quizzes" },
  { icon: BarChart3, label: "Analytics", to: "/analytics" },
  { icon: History, label: "Learning History", to: "/learning-history" },
  { icon: Settings, label: "Settings", to: "/settings" },
];

export function DashboardLayout({ children, headerTitle, hideHeader = false }: { children: React.ReactNode, headerTitle?: React.ReactNode, hideHeader?: boolean }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { startTour } = useProductTour();
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof localStorage !== "undefined") {
      return (localStorage.getItem("theme") as "light" | "dark") || "light";
    }
    return "light";
  });
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof localStorage !== "undefined") {
      return localStorage.getItem("sidebar_collapsed") === "true";
    }
    return false;
  });

  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const alertsDropdownRef = useRef<HTMLDivElement>(null);

  // Click outside to close notifications dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (alertsDropdownRef.current && !alertsDropdownRef.current.contains(event.target as Node)) {
        setIsAlertsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch alerts with polling (every 10 seconds)
  const { data: alerts = [] } = useQuery<Alert[]>({
    queryKey: ['alerts'],
    queryFn: AlertsAPI.getAlerts,
    refetchInterval: 10000,
    enabled: !!session && !isLoggingOut,
  });

  const unreadCount = alerts.filter(a => !a.read).length;

  const markAllReadMutation = useMutation({
    mutationFn: AlertsAPI.markAllRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to mark alerts as read");
    }
  });

  const deleteAlertMutation = useMutation({
    mutationFn: AlertsAPI.deleteAlert,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to delete alert");
    }
  });

  const seedAlertsMutation = useMutation({
    mutationFn: AlertsAPI.seedAlerts,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
      toast.success("Demo alerts successfully seeded");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to seed demo alerts");
    }
  });

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await ProfileAPI.getProfile();
      if (res.success && res.profile) {
        localStorage.setItem("lf_user_name", res.profile.name || "");
        localStorage.setItem("lf_user_image", res.profile.profileImage || "");
        return res.profile;
      }
      return null;
    },
    enabled: !!session && !isLoggingOut,
  });

  const sessionUser = session?.user;
  const cachedName = typeof window !== "undefined" ? localStorage.getItem("lf_user_name") || "" : "";
  const cachedImage = typeof window !== "undefined" ? localStorage.getItem("lf_user_image") || "" : "";

  const isValidAvatarUrl = (url?: string | null) => {
    if (!url) return false;
    if (url.includes("/undefined") || url.includes("/null")) return false;
    return true;
  };

  const displayName = sessionUser?.name || profile?.name || cachedName || "User";
  const displayImage = isValidAvatarUrl(profile?.profileImage)
    ? profile?.profileImage!
    : isValidAvatarUrl(sessionUser?.image)
      ? sessionUser?.image!
      : isValidAvatarUrl(cachedImage)
        ? cachedImage
        : "/default-avatar.svg";

  const toggleSidebar = () => {
    setIsCollapsed(prev => {
      const next = !prev;
      localStorage.setItem("sidebar_collapsed", String(next));
      return next;
    });
  };

  useEffect(() => {
    if (sessionUser?.name) {
      localStorage.setItem("lf_user_name", sessionUser.name);
    }
    if (sessionUser?.image) {
      localStorage.setItem("lf_user_image", sessionUser.image);
    }
  }, [sessionUser]);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    const currentTheme = isDark ? "dark" : "light";
    const timer = setTimeout(() => {
      setTheme(currentTheme);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleLogout = () => setShowLogoutConfirm(true);

  const confirmLogout = async () => {
    setShowLogoutConfirm(false);
    setIsLoggingOut(true);

    try {
      await authClient.signOut();

      // Clear cached queries
      queryClient.clear();

      // Update auth state
      authStore.setAuthenticated(false);
      localStorage.removeItem("lf_user_name");
      localStorage.removeItem("lf_user_image");

      toast.success("You have been logged out.");
      navigate({ to: "/login" });
    } catch (err) {
      console.error("Logout failed:", err);

      // Ensure local state is cleared even if request fails
      queryClient.clear();
      authStore.setAuthenticated(false);
      localStorage.removeItem("lf_user_name");
      localStorage.removeItem("lf_user_image");

      navigate({ to: "/login" });
    }
  };
  return (
    <div className="h-screen w-full flex bg-[var(--lf-bg)] text-[var(--lf-text-primary)] overflow-hidden selection:bg-[var(--lf-accent)] selection:text-white font-sans relative">
      {/* ── SIDEBAR ────────────────────────────────────────────────────────── */}
      <aside data-tour="sidebar" className={`flex-shrink-0 border-r border-[var(--lf-border)] bg-white/80 dark:bg-black/60 backdrop-blur-xl flex flex-col relative z-20 transition-all duration-300 ${isCollapsed ? "w-[76px]" : "w-64"}`}>
        
        {/* Toggle Collapse Button */}
        <button 
          onClick={toggleSidebar}
          className="absolute -right-3.5 top-20 bg-[var(--lf-surface)] border border-[var(--lf-border)] text-[var(--lf-text-secondary)] hover:text-[var(--lf-text-primary)] hover:border-orange-500/50 rounded-full p-1.5 z-50 transition-colors shadow-sm"
        >
          {isCollapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
        </button>

        <div className="h-16 flex items-center justify-center border-b border-[var(--lf-border)] transition-all">
          <Link to="/dashboard" className={`flex items-center gap-3 hover:opacity-80 transition-opacity w-full px-6 ${isCollapsed ? "justify-center px-0" : ""}`}>
            <div className="flex items-center justify-center shrink-0">
              <img src="/logo.png" className="block dark:hidden h-6 w-auto object-contain" alt="Learnflow AI Logo" />
              <img src="/logo_dark.png" className="hidden dark:block h-6 w-auto object-contain" alt="Learnflow AI Logo" />
            </div>
            {!isCollapsed && (
              <span className="text-[17px] font-extrabold tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">
                Learnflow <span className="text-[var(--lf-accent)]">AI</span>
              </span>
            )}
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1.5 no-scrollbar overflow-x-hidden">
          {navItems.map((item, idx) => {
            const Icon = item.icon;
            const active = location.pathname.startsWith(item.to) && item.to !== "#" && item.to !== "/" && (item.to === "/dashboard" ? location.pathname === "/dashboard" : true);
            return (
                <Link
                  key={idx}
                  to={item.to}
                  title={isCollapsed ? item.label : undefined}
                  {...(item.label === "Settings" ? { "data-tour": "settings-link" } : {})}
                className={`w-full flex items-center rounded-xl transition-all duration-200 group relative overflow-hidden ${isCollapsed ? "justify-center p-3" : "gap-3 px-3 py-2.5"} ${active ? "bg-gradient-to-r from-orange-500/15 to-orange-500/5 text-[var(--lf-accent)] shadow-sm shadow-orange-500/10" : "text-[var(--lf-text-secondary)] hover:bg-[var(--lf-surface)] hover:text-[var(--lf-text-primary)] hover:shadow-sm"} active:scale-[0.97]`}
              >
                {/* Active background glow */}
                {active && (
                  <>
                    <div className="absolute inset-0 rounded-xl bg-orange-500/10 blur-md" />
                    <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full bg-gradient-to-b from-orange-500 to-orange-400 shadow-sm shadow-orange-500/50" />
                  </>
                )}
                
                {/* Hover shimmer effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none" />

                {/* When collapsed, if active, show a small left indicator */}
                {active && isCollapsed && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-r-full bg-[var(--lf-accent)] z-10 shrink-0" />
                )}

                <Icon className={`h-[18px] w-[18px] relative z-10 shrink-0 transition-transform duration-200 group-hover:scale-110 ${active ? "text-[var(--lf-accent)]" : "text-[var(--lf-text-secondary)] group-hover:text-[var(--lf-text-primary)]"}`} />
                
                {!isCollapsed && (
                  <span className="text-[13.5px] font-medium relative z-10 whitespace-nowrap overflow-hidden text-ellipsis">{item.label}</span>
                )}

                {active && !isCollapsed && (
                  <div className="ml-auto w-1.5 h-5 rounded-full bg-gradient-to-b from-orange-500 to-orange-400 relative z-10 shrink-0 shadow-sm shadow-orange-500/50" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Profile Card */}
        <div data-tour="profile-card" className={`p-4 border-t border-[var(--lf-border)] transition-all ${isCollapsed ? "px-2" : ""}`}>
          {isCollapsed ? (
            <button 
              onClick={() => setIsProfileModalOpen(true)}
              className="w-full flex items-center justify-center p-3 rounded-xl bg-[var(--lf-surface)] border border-[var(--lf-border)] hover:border-orange-500/50 group transition-all card-shadow" 
              title="Profile"
            >
              <img
                src={displayImage}
                alt="Profile"
                className="h-6 w-6 rounded-full object-cover"
              />
            </button>
          ) : (
            <button 
              onClick={() => setIsProfileModalOpen(true)}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-[var(--lf-surface)] border border-[var(--lf-border)] hover:border-orange-500/30 card-shadow hover:shadow-[0_0_15px_rgba(255,122,24,0.15)] transition-all duration-300 group"
            >
              <div className="h-9 w-9 rounded-full border border-[var(--lf-border)] overflow-hidden shrink-0 group-hover:ring-2 ring-orange-500/50 transition-all flex items-center justify-center bg-stone-100 dark:bg-stone-900">
                <img
                  src={displayImage}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold text-[var(--lf-text-primary)] group-hover:text-[var(--lf-accent)] transition-colors">{displayName}</p>
                <p className="text-[11px] text-[var(--lf-text-secondary)]">Edit Profile</p>
              </div>
              <div className="w-6 h-6 rounded-full bg-orange-500/10 flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
                <span className="text-xs text-orange-500">›</span>
              </div>
            </button>
          )}
        </div>
      </aside>

      {/* ── MAIN CONTENT AREA ──────────────────────────────────────────────── */}
      <main data-tour="dashboard-content" className="flex-1 flex flex-col relative z-10 overflow-hidden bg-transparent">
        {/* Background Ambient Glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
          <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] rounded-full bg-orange-500/[0.03] dark:bg-orange-500/[0.06] blur-[130px]" />
          <div className="absolute bottom-[20%] right-[10%] w-[600px] h-[600px] rounded-full bg-amber-500/[0.02] dark:bg-amber-600/[0.04] blur-[150px]" />
        </div>

        {/* Top Header */}
        {!hideHeader && (
          <header className="h-16 px-8 flex items-center justify-between border-b border-[var(--lf-border)] bg-white/80 dark:bg-black/70 backdrop-blur-md sticky top-0 z-30">
            <div className="flex items-center gap-2">
              {headerTitle === undefined ? (
                <h2 className="text-lg font-bold">
                  Welcome back, {displayName}
                </h2>
              ) : typeof headerTitle === "string" ? (
                <h2 className="text-lg font-bold">
                  {headerTitle}
                </h2>
              ) : (
                headerTitle
              )}
            </div>

            <div className="flex items-center gap-5">
              <button
                onClick={toggleTheme}
                className="relative p-2 rounded-full hover:bg-[var(--lf-surface)] transition-colors text-[var(--lf-text-secondary)] hover:text-[var(--lf-text-primary)]"
              >
                {theme === "light" ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                )}
              </button>

              <div className="relative" ref={alertsDropdownRef}>
                <button
                  onClick={() => setIsAlertsOpen(!isAlertsOpen)}
                  className="relative p-2 rounded-full hover:bg-[var(--lf-surface)] transition-colors text-[var(--lf-text-secondary)] hover:text-[var(--lf-text-primary)]"
                  title="Notifications"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 h-4 min-w-[16px] px-1 rounded-full bg-rose-500 text-[9px] font-bold text-white flex items-center justify-center border border-[var(--lf-bg)] shadow-[0_0_8px_rgba(244,63,94,0.3)]">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {isAlertsOpen && (
                  <div className="absolute right-0 mt-2 w-[340px] max-w-[calc(100vw-32px)] bg-white dark:bg-[#111] rounded-2xl border border-[var(--lf-border)] card-shadow-lg overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-[var(--lf-border)] flex items-center justify-between bg-white/50 dark:bg-black/20 backdrop-blur-sm">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[13.5px] font-bold">Notifications</span>
                        {unreadCount > 0 && (
                          <span className="text-[10px] bg-orange-500/10 text-orange-500 font-bold px-1.5 py-0.5 rounded-full">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {unreadCount > 0 && (
                          <button
                            onClick={() => markAllReadMutation.mutate()}
                            className="text-[11px] font-medium text-orange-500 hover:text-orange-600 flex items-center gap-1"
                            title="Mark all as read"
                          >
                            <CheckCheck className="h-3 w-3" />
                            <span>Mark read</span>
                          </button>
                        )}
                        {alerts.length === 0 && (
                          <button
                            onClick={() => seedAlertsMutation.mutate()}
                            className="text-[11px] font-medium text-[var(--lf-text-secondary)] hover:text-[var(--lf-text-primary)]"
                          >
                            Seed demo
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Content List */}
                    <div className="max-h-[300px] overflow-y-auto divide-y divide-[var(--lf-border)] no-scrollbar">
                      {alerts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                          <div className="w-10 h-10 rounded-full bg-[var(--lf-surface)] border border-[var(--lf-border)] flex items-center justify-center mb-2">
                            <Inbox className="h-5 w-5 text-[var(--lf-text-secondary)]" />
                          </div>
                          <p className="text-xs font-semibold text-[var(--lf-text-primary)]">All caught up!</p>
                          <p className="text-[11px] text-[var(--lf-text-secondary)] mt-1">No alerts or notifications yet.</p>
                          <button
                            onClick={() => seedAlertsMutation.mutate()}
                            className="mt-3 px-3 py-1 text-[11px] font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg hover:shadow-md transition-all active:scale-95"
                          >
                            Seed Demo Alerts
                          </button>
                        </div>
                      ) : (
                        alerts.map((alert) => (
                          <div
                            key={alert.id}
                            className={`p-4 flex gap-3 transition-colors hover:bg-[var(--lf-surface)] relative group ${
                              !alert.read ? "bg-orange-500/[0.015] dark:bg-orange-500/[0.03]" : ""
                            }`}
                          >
                            {/* Type Indicator Dot */}
                            {!alert.read && (
                              <span className="absolute left-2.5 top-5.5 h-1.5 w-1.5 rounded-full bg-orange-500 shrink-0" />
                            )}

                            {/* Icon / Content */}
                            <div className="flex-1 min-w-0 pl-1.5">
                              <p className="text-[12.5px] font-semibold text-[var(--lf-text-primary)] truncate">
                                {alert.title}
                              </p>
                              <p className="text-[11.5px] text-[var(--lf-text-secondary)] mt-0.5 leading-normal break-words">
                                {alert.message}
                              </p>
                              <span className="text-[10px] text-[var(--lf-text-secondary)] mt-1 block">
                                {new Date(alert.createdAt).toLocaleDateString()}
                              </span>
                            </div>

                            {/* Action Buttons (Dismiss/Delete) */}
                            <div className="flex items-start shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => deleteAlertMutation.mutate(alert.id)}
                                className="p-1 rounded hover:bg-red-500/10 text-[var(--lf-text-secondary)] hover:text-red-500 transition-colors"
                                title="Delete notification"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              <button 
                onClick={() => setIsProfileModalOpen(true)}
                className="h-8 w-8 rounded-full border border-[var(--lf-border)] overflow-hidden cursor-pointer hover:ring-2 ring-orange-500/50 transition-all shrink-0 flex items-center justify-center bg-stone-100 dark:bg-stone-900"
              >
                <img
                  src={displayImage}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              </button>

              <button
                onClick={startTour}
                className="relative p-2 rounded-full hover:bg-[var(--lf-surface)] transition-colors text-[var(--lf-text-secondary)] hover:text-orange-500 group shrink-0"
                title="Replay Product Tour"
              >
                <PlayCircle className="h-5 w-5" />
              </button>

              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-[13px] font-semibold transition-colors shadow-lg shadow-red-500/20 shrink-0"
              >
                Logout
              </button>
            </div>
          </header>
        )}

        {/* Scrollable / Container Content */}
        {children}
      </main>

      <ProfileModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
      />

      {/* ── LOGOUT CONFIRMATION MODAL ──────────────────────────────────────── */}
      <AnimatePresence>
      {showLogoutConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowLogoutConfirm(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative bg-white dark:bg-black rounded-2xl border border-orange-500/40 shadow-2xl shadow-orange-500/20 p-6 w-[320px] max-w-[90vw] overflow-hidden"
          >
            <div className="text-center relative z-10">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-orange-500/10 flex items-center justify-center">
                <LogOut className="h-5 w-5 text-orange-500" />
              </div>
              <h3 className="text-[16px] font-bold text-[var(--lf-text-primary)] mb-2">
                Confirm Logout
              </h3>
              <p className="text-[13px] text-[var(--lf-text-secondary)] mb-6 leading-relaxed">
                Are you sure you want to log out? You'll need to sign in again to access your dashboard.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl border border-[var(--lf-border)] bg-[var(--lf-surface)] text-[13px] font-semibold text-[var(--lf-text-primary)] hover:bg-[var(--lf-bg)] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmLogout}
                  className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-[13px] font-semibold shadow-lg shadow-red-500/25 transition-all hover:scale-105 active:scale-95"
                >
                  Logout
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}
