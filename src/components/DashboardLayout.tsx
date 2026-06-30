import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useLocation } from "@tanstack/react-router";
import { ProfileAPI } from "../lib/api";
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
  Search,
  Bell,
  Sun,
  Moon,
  LogOut,
  ChevronLeft,
  ChevronRight,
  PlayCircle,
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
  { icon: Settings, label: "Settings", to: "#" },
];

export function DashboardLayout({ children, headerTitle, hideHeader = false }: { children: React.ReactNode, headerTitle?: React.ReactNode, hideHeader?: boolean }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { startTour } = useProductTour();
  const queryClient = useQueryClient();
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof document !== "undefined") {
      return document.documentElement.classList.contains("dark") ? "dark" : "light";
    }
    return "light";
  });
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof localStorage !== "undefined") {
      return localStorage.getItem("sidebar_collapsed") === "true";
    }
    return false;
  });

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await ProfileAPI.getProfile();
      return res.success && res.profile ? res.profile : null;
    }
  });

  const getAvatarUrl = () => {
    if (!profile) return "https://api.dicebear.com/7.x/notionists/svg?seed=User&backgroundColor=FF7A18";
    return profile.profileImage || `https://api.dicebear.com/7.x/notionists/svg?seed=${profile.name}&backgroundColor=FF7A18`;
  };

  const toggleSidebar = () => {
    setIsCollapsed(prev => {
      const next = !prev;
      localStorage.setItem("sidebar_collapsed", String(next));
      return next;
    });
  };

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

  try {
    await authClient.signOut();

    // Clear cached queries
    queryClient.clear();

    // Update auth state
    authStore.setAuthenticated(false);

    toast.success("You have been logged out.");
    navigate({ to: "/login" });
  } catch (err) {
    console.error("Logout failed:", err);

    // Ensure local state is cleared even if request fails
    queryClient.clear();
    authStore.setAuthenticated(false);

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
                src={getAvatarUrl()}
                alt="Profile"
                className="h-6 w-6 rounded-full object-cover"
              />
            </button>
          ) : (
            <button 
              onClick={() => setIsProfileModalOpen(true)}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-[var(--lf-surface)] border border-[var(--lf-border)] hover:border-orange-500/30 card-shadow hover:shadow-[0_0_15px_rgba(255,122,24,0.15)] transition-all duration-300 group"
            >
              <div className="h-9 w-9 rounded-full border border-[var(--lf-border)] overflow-hidden shrink-0 group-hover:ring-2 ring-orange-500/50 transition-all">
                <img
                  src={getAvatarUrl()}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold text-[var(--lf-text-primary)] group-hover:text-[var(--lf-accent)] transition-colors">{profile?.name || "User"}</p>
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
                  Welcome back, {profile?.name || "User"}
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
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--lf-text-secondary)] group-focus-within:text-[var(--lf-accent)] transition-colors" />
                <input
                  type="text"
                  placeholder="Search documents, notes, quizzes..."
                  className="w-[280px] h-[36px] pl-9 pr-4 rounded-full bg-[var(--lf-surface)] border border-[var(--lf-border)] text-[13px] outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all placeholder:text-[var(--lf-text-secondary)] text-[var(--lf-text-primary)]"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                  <kbd className="text-[9px] font-mono font-bold text-[var(--lf-text-secondary)] bg-[var(--lf-bg)] px-1.5 py-0.5 rounded border border-[var(--lf-border)]">
                    ⌘
                  </kbd>
                  <kbd className="text-[9px] font-mono font-bold text-[var(--lf-text-secondary)] bg-[var(--lf-bg)] px-1.5 py-0.5 rounded border border-[var(--lf-border)]">
                    K
                  </kbd>
                </div>
              </div>

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

              <button className="relative p-2 rounded-full hover:bg-[var(--lf-surface)] transition-colors text-[var(--lf-text-secondary)] hover:text-[var(--lf-text-primary)]">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 border-2 border-[var(--lf-bg)]" />
              </button>

              <button 
                onClick={() => setIsProfileModalOpen(true)}
                className="h-8 w-8 rounded-full border border-[var(--lf-border)] overflow-hidden cursor-pointer hover:ring-2 ring-orange-500/50 transition-all shrink-0"
              >
                <img
                  src={getAvatarUrl()}
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
                className="relative p-2 rounded-full hover:bg-red-500/10 transition-colors text-[var(--lf-text-secondary)] hover:text-red-500 group shrink-0"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
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
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowLogoutConfirm(false)}
          />
          <div className="relative bg-white dark:bg-[#111] rounded-2xl border border-orange-500/30 card-shadow-lg p-6 w-[320px] max-w-[90vw] overflow-hidden">
            <div className="absolute -top-8 -right-8 w-40 h-40 bg-gradient-to-bl from-orange-500/20 to-transparent blur-[70px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-tr from-orange-500/15 to-transparent blur-[60px] rounded-full pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/[0.03] to-transparent pointer-events-none" />
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
          </div>
        </div>
      )}
    </div>
  );
}
