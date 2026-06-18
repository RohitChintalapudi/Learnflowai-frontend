import React, { useState, useEffect } from "react";
import {
  createFileRoute,
  Outlet,
  Link,
  useLocation,
} from "@tanstack/react-router";
import { Sun, Moon } from "lucide-react";

export const Route = createFileRoute("/_public")({
  component: PublicLayout,
});

function PublicLayout() {
  const [isLoading, setIsLoading] = useState(() => {
    if (typeof window !== "undefined") {
      if (window.location.pathname === "/") {
        return true;
      }
      return !sessionStorage.getItem("hasSeenSplash");
    }
    return true;
  });

  const handleVideoEnd = () => {
    if (isLoading) {
      setIsLoading(false);
      sessionStorage.setItem("hasSeenSplash", "true");
    }
  };

  useEffect(() => {
    if (isLoading) {
      // Fallback timer in case video fails to load or play
      const timer = setTimeout(() => {
        handleVideoEnd();
      }, 8000); // 8 seconds maximum loading fallback
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof document !== "undefined") {
      return document.documentElement.classList.contains("dark") ? "dark" : "light";
    }
    return "light";
  });

  // Load theme preference on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const initialTheme = savedTheme || (systemPrefersDark ? "dark" : "light");

    setTheme(initialTheme);
    if (initialTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
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

  const location = useLocation();
  const isAppRoute = location.pathname === "/home" || location.pathname === "/documents" || location.pathname.startsWith("/workspace") || location.pathname.startsWith("/notes");
  const isLanding = location.pathname === "/";

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-black z-50 fixed inset-0">
        <video
          autoPlay
          muted
          playsInline
          onEnded={handleVideoEnd}
          onError={handleVideoEnd}
          className="w-full max-w-sm h-auto object-contain px-6"
        >
          <source src="/loading.mp4" type="video/mp4" />
          {/* Fallback if video fails to load */}
        </video>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex flex-col relative text-stone-800 dark:text-stone-100 transition-colors duration-300 antialiased selection:bg-orange-100 dark:selection:bg-orange-900/40 selection:text-stone-900 ${
        isAppRoute || isLanding 
          ? "bg-white dark:bg-[#0c0a09]" 
          : "bg-[url('/background.png')] dark:bg-[url('/background_dark.png')] bg-cover bg-[50%_-250px] bg-no-repeat"
      }`}
    >
      {/* Global Public Navbar */}
      {!isAppRoute && (
        <nav className="border-b border-stone-200 dark:border-[rgba(255,255,255,0.08)] bg-white/80 dark:bg-black/60 backdrop-blur-xl sticky top-0 z-50 transition-colors duration-300">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-12">
            {/* Brand Logo & Name */}
            <Link
              to="/"
              className="flex items-center gap-3 group focus:outline-none"
            >
              <div className="flex items-center justify-center group-hover:scale-105 group-active:scale-95 transition-transform duration-200">
                <img
                  src="/logo.png"
                  className="block dark:hidden h-7 w-auto object-contain"
                  alt="Learnflow AI Logo"
                />
                <img
                  src="/logo_dark.png"
                  className="hidden dark:block h-7 w-auto object-contain"
                  alt="Learnflow AI Logo"
                />
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-[16px] font-extrabold tracking-tight leading-none text-stone-900 dark:text-white">
                  Learnflow{" "}
                  <span className="text-orange-500 dark:text-orange-400">
                    AI
                  </span>
                </span>
                <span className="text-[10px] font-medium text-stone-500 dark:text-stone-400 leading-none mt-1">
                  Learn Smarter, Understand Deeper
                </span>
              </div>
            </Link>

            {/* Center nav links removed as requested */}

            {/* Right controls */}
            <nav className="flex items-center gap-3">
              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-stone-500 hover:text-orange-600 dark:text-stone-400 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/30 transition-all duration-200 focus:outline-none"
                aria-label="Toggle light/dark theme"
              >
                {theme === "light" ? (
                  <Moon className="h-[18px] w-[18px]" />
                ) : (
                  <Sun className="h-[18px] w-[18px]" />
                )}
              </button>

              {/* Login Link */}
              <Link
                to="/login"
                className="text-sm font-semibold px-4 py-2 rounded-lg border border-stone-200 dark:border-stone-700/60 text-stone-600 dark:text-stone-300 hover:bg-orange-50 dark:hover:bg-orange-950/20 hover:text-orange-600 dark:hover:text-orange-400 hover:border-orange-200 dark:hover:border-orange-800/50 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                activeProps={{
                  className:
                    "border-orange-400 dark:border-orange-600 text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/20",
                }}
              >
                Login
              </Link>

              {/* Sign Up */}
              <Link
                to="/signup"
                className="text-sm font-semibold px-5 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white transition-all duration-200 shadow-sm shadow-orange-500/20 hover:shadow-md hover:shadow-orange-500/30 active:scale-[0.97]"
              >
                Sign Up
              </Link>
            </nav>
          </div>
        </nav>
      )}

      {/* Page Content Container */}
      <main className="flex-grow flex flex-col relative z-10 h-full">
        {isAppRoute ? (
          <Outlet />
        ) : (
          <PageTransitionWrapper>
            <Outlet />
          </PageTransitionWrapper>
        )}
      </main>

      {/* Global Footer */}
      {!isAppRoute && (
        <footer className="w-full border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-[#0c0a09] pt-16 pb-8 mt-auto relative z-10 transition-colors duration-300">
          <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
            {/* Main Footer Content */}
            <div className="flex flex-col items-center justify-center text-center mb-8">
              {/* Brand */}
              <div className="flex items-center justify-center gap-2.5 mb-4">
                <img
                  src="/logo.png"
                  className="block dark:hidden h-8 w-auto object-contain"
                  alt="Learnflow AI Logo"
                />
                <img
                  src="/logo_dark.png"
                  className="hidden dark:block h-8 w-auto object-contain"
                  alt="Learnflow AI Logo"
                />
                <span className="text-xl font-extrabold tracking-tight text-stone-900 dark:text-white">
                  Learnflow{" "}
                  <span className="text-orange-500 dark:text-orange-400">
                    AI
                  </span>
                </span>
              </div>
              <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed max-w-md">
                Transform the way you learn Computer Science. Our AI-powered
                tools provide instant interactive simulations and structured
                paths to master complex topics.
              </p>
            </div>

            {/* Divider & Bottom Section */}
            <div className="pt-8 border-t border-stone-200 dark:border-stone-800/60 flex flex-col items-center justify-center gap-4">
              <p className="text-xs text-stone-400 dark:text-stone-500 text-center">
                © {new Date().getFullYear()} Learnflow AI. All rights reserved.<br/>
                Built for learners.
              </p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

// Keyed wrapper — remounts on every route change, replaying the CSS animation
function PageTransitionWrapper({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  return <AnimatedPage key={location.pathname}>{children}</AnimatedPage>;
}

// Separate component so useEffect fires on every remount (key change)
function AnimatedPage({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    // Lock scrolling for exactly the animation duration so the
    // translateY slide-up never triggers a scrollbar flash
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const t = setTimeout(() => {
      document.body.style.overflow = prev;
      document.documentElement.style.overflow = "";
    }, 480); // slightly longer than the 450ms animation

    return () => {
      clearTimeout(t);
      document.body.style.overflow = prev;
      document.documentElement.style.overflow = "";
    };
  }, []);

  return (
    <div className="page-enter flex-grow flex flex-col overflow-hidden">
      {children}
    </div>
  );
}
