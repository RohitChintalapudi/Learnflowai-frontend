import React, { useState, useEffect } from "react";
import {
  createFileRoute,
  Outlet,
  Link,
  useLocation,
  redirect,
  useNavigate,
} from "@tanstack/react-router";
import {
  Sun,
  Moon,
  Mail,
  Menu,
  X,
} from "lucide-react";

import { authStore } from "../store/authStore";
import { authClient } from "../lib/auth-client";
import { motion, AnimatePresence } from "motion/react";
import AnimatedTabs from "../components/AnimatedTabs";

export const Route = createFileRoute("/_public")({
  beforeLoad: () => {
    if (authStore.isAuthenticated) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: PublicLayout,
});

function PublicLayout() {
  const navigate = useNavigate();

  // Check session in the background asynchronously
  useEffect(() => {
    if (!authStore.isAuthenticated && localStorage.getItem("lf_just_logged_out") !== "true") {
      authClient.getSession()
        .then(({ data: session }) => {
          if (session) {
            authStore.setAuthenticated(true);
            navigate({ to: "/dashboard" });
          }
        })
        .catch((err) => {
          console.error("Failed to check background active session:", err);
        });
    }
  }, [navigate]);

  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof document !== "undefined") {
      return document.documentElement.classList.contains("dark") ? "dark" : "light";
    }
    return "light";
  });

  // Load theme preference on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const initialTheme = savedTheme || "light";

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
  const isAppRoute = location.pathname === "/dashboard" || location.pathname === "/documents" || location.pathname.startsWith("/workspace") || location.pathname.startsWith("/notes") || location.pathname.startsWith("/quizzes") || location.pathname.startsWith("/analytics");
  const isLanding = location.pathname === "/";

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    checkScroll();
    window.addEventListener("scroll", checkScroll, { passive: true });
    return () => window.removeEventListener("scroll", checkScroll);
  }, []);

  const isAutoScrollingRef = React.useRef(false);
  const scrollTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const scrollToSection = (sectionId: string) => {
    if (location.pathname === "/") {
      isAutoScrollingRef.current = true;
      setActiveSection(sectionId);

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      if (sectionId === "about-us") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const el = document.getElementById(sectionId);
        if (el) {
          const headerOffset = 76;
          const elementTop = el.getBoundingClientRect().top + window.scrollY;
          const targetY = Math.max(0, elementTop - headerOffset);
          window.scrollTo({ top: targetY, behavior: "smooth" });
        }
      }

      // Lock activeSection for the entire duration of the smooth scroll travel (700ms)
      // and only sync the hash URL after arrival to avoid hash jump interference
      scrollTimeoutRef.current = setTimeout(() => {
        isAutoScrollingRef.current = false;
        if (sectionId === "about-us") {
          window.history.replaceState(null, "", window.location.pathname);
        } else {
          window.history.replaceState(null, "", `#${sectionId}`);
        }
      }, 700);
    } else {
      window.location.href = `/#${sectionId}`;
    }
  };

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isLanding) {
      setActiveSection("");
      return;
    }

    const sectionIds = ["about-us", "features", "why-students-love-us"];
    const handleScroll = () => {
      // Ignore scroll-spy while smoothly traveling to a clicked section
      if (isAutoScrollingRef.current) return;

      const scrollPosition = window.scrollY + 140;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el) {
          const elementTop = el.getBoundingClientRect().top + window.scrollY;
          if (elementTop <= scrollPosition) {
            setActiveSection(sectionIds[i]);
            return;
          }
        }
      }
      if (window.scrollY < 200) {
        setActiveSection("about-us");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLanding]);

  const navItems = [
    { label: "Overview", id: "about-us" },
    { label: "Features", id: "features" },
    { label: "Why Students Love Us", id: "why-students-love-us" },
  ];


  return (
    <div
      className={`min-h-screen flex flex-col relative text-stone-800 dark:text-stone-100 transition-colors duration-300 antialiased selection:bg-orange-100 dark:selection:bg-orange-900/40 selection:text-stone-900 ${
        isAppRoute || isLanding 
          ? "bg-white dark:bg-[#0c0a09]" 
          : "bg-[url('/background.png')] dark:bg-[url('/background_dark.png')] bg-cover bg-[50%_-250px] bg-no-repeat"
      }`}
    >
      {/* Global Public Sticky Animated Navbar */}
      {!isAppRoute && (
        <header
          className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
            isScrolled
              ? "border-b border-stone-200/90 dark:border-stone-800/90 bg-white/90 dark:bg-[#0c0a09]/90 backdrop-blur-xl shadow-xs shadow-stone-900/5 py-1.5"
              : "border-b border-transparent bg-white/75 dark:bg-[#0c0a09]/75 backdrop-blur-md py-3"
          }`}
        >
          <div className="mx-auto flex min-h-14 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-12 transition-all duration-300">
            {/* Brand Logo & Name */}
            <Link
              to="/"
              onClick={(e) => {
                if (isLanding) {
                  e.preventDefault();
                  scrollToSection("about-us");
                }
              }}
              className="flex min-w-0 items-center gap-2 sm:gap-3 group focus:outline-none"
            >
              <div className="flex items-center justify-center group-hover:scale-105 group-active:scale-95 transition-transform duration-200">
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
              </div>
              <div className="flex min-w-0 flex-col justify-center">
                <span className="text-[16px] font-extrabold tracking-tight leading-none text-stone-900 dark:text-white">
                  Learnflow{" "}
                  <span className="text-orange-500 dark:text-orange-400">
                    AI
                  </span>
                </span>
                <span className="hidden min-[420px]:inline-flex text-[10px] font-medium text-stone-500 dark:text-stone-400 leading-none mt-1">
                  Learn Smarter, Understand Deeper
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links with Motion animated tabs (Landing page only) */}
            {isLanding && (
              <div className="hidden md:flex items-center">
                <AnimatedTabs
                  tabs={navItems}
                  activeTab={isLanding ? activeSection : ""}
                  onChange={(_, id) => {
                    if (id) scrollToSection(id);
                  }}
                  layoutId="navbar-tab"
                />
              </div>
            )}

            {/* Right controls */}
            <nav className="flex items-center gap-1.5 sm:gap-3 shrink-0">
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
                className="text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 rounded-lg border border-stone-200 dark:border-stone-700/60 text-stone-600 dark:text-stone-300 hover:bg-orange-50 dark:hover:bg-orange-950/20 hover:text-orange-600 dark:hover:text-orange-400 hover:border-orange-200 dark:hover:border-orange-800/50 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
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
                className="text-xs sm:text-sm font-semibold px-3.5 sm:px-5 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white transition-all duration-200 shadow-sm shadow-orange-500/20 hover:shadow-md hover:shadow-orange-500/30 active:scale-[0.97]"
              >
                Sign Up
              </Link>

              {/* Mobile Menu Toggle Button (Landing page only) */}
              {isLanding && (
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen((prev) => !prev)}
                  className="md:hidden p-2 rounded-lg text-stone-600 dark:text-stone-300 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/30 transition-all duration-200 focus:outline-none"
                  aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                >
                  {mobileMenuOpen ? (
                    <X className="h-[18px] w-[18px]" />
                  ) : (
                    <Menu className="h-[18px] w-[18px]" />
                  )}
                </button>
              )}
            </nav>
          </div>

          {/* Mobile Navigation Dropdown */}
          <AnimatePresence>
            {isLanding && mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.22, ease: "easeInOut" }}
                className="overflow-hidden md:hidden border-t border-stone-200/80 dark:border-stone-800/80 bg-white/95 dark:bg-[#0c0a09]/95 backdrop-blur-xl px-4 py-3 space-y-1"
              >
                {navItems.map((item) => {
                  const isActive = isLanding && activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        scrollToSection(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`relative w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                        isActive
                          ? "text-orange-600 dark:text-orange-400 font-semibold"
                          : "text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800/50"
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="mobile-nav-pill"
                          className="absolute inset-0 rounded-lg bg-orange-50 dark:bg-orange-950/40"
                          initial={false}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 35,
                          }}
                        />
                      )}
                      <span className="relative z-10">{item.label}</span>
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </header>
      )}

      {/* Spacer for fixed navbar to prevent content overlapping */}
      {!isAppRoute && (
        <div className="h-16 sm:h-20 shrink-0 pointer-events-none" aria-hidden="true" />
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
        <footer className="w-full border-t border-stone-200 dark:border-stone-800/60 bg-white dark:bg-black pt-16 pb-8 mt-auto relative z-10 transition-colors duration-300">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 mb-12 md:mb-16">
              
              {/* Section 1: Brand */}
<div className="md:col-span-6 lg:col-span-5 flex flex-col items-start text-left max-w-sm">
  <Link to="/" className="flex flex-col items-start gap-4 mb-4 group">
    <div>
      <img
        src="/logo.png"
        className="block dark:hidden h-10 sm:h-12 w-auto object-contain transition-transform group-hover:scale-105"
        alt="Learnflow AI Logo"
      />
      <img
        src="/logo_dark.png"
        className="hidden dark:block h-10 sm:h-12 w-auto object-contain transition-transform group-hover:scale-105"
        alt="Learnflow AI Logo"
      />
    </div>
    <span className="text-lg font-bold tracking-tight text-stone-900 dark:text-white">
      Learnflow <span className="text-[#FF7A00]">AI</span>
    </span>
  </Link>
  <p className="text-sm font-medium text-stone-500 dark:text-stone-400">
                  Intelligent learning experiences designed for every student
                </p>
              </div>

              {/* Section 2: Company */}
              <div className="md:col-span-4 md:col-start-8 lg:col-span-3 lg:col-start-9 flex flex-col text-left">
                <div>
                  <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-6">Company</h3>
                  <ul className="space-y-5">
                    {[
                      { label: "Overview", type: "anchor", href: "/#about-us" },
                      { label: "Features", type: "anchor", href: "/#features" },
                      { label: "Why Students Love Us", type: "anchor", href: "/#why-students-love-us" },
                      { label: "Get Started", type: "anchor", href: "/#careers" }
                    ].map((link, i) => (
                      <li key={i}>
                        {link.type === 'anchor' ? (
                          <a 
                            href={link.href} 
                            onClick={(e) => {
                              e.preventDefault();
                              const targetId = link.href.split('#')[1];
                              scrollToSection(targetId);
                            }}
                            className="text-base font-medium text-stone-600 dark:text-stone-400 hover:text-[#FF7A00] dark:hover:text-[#FF7A00] cursor-pointer transition-all duration-300 hover:translate-x-1 inline-block"
                          >
                            {link.label}
                          </a>
                        ) : (
                          <Link 
                            to={link.href} 
                            className="text-base font-medium text-stone-600 dark:text-stone-400 hover:text-[#FF7A00] dark:hover:text-[#FF7A00] cursor-pointer transition-all duration-300 hover:translate-x-1 inline-block"
                          >
                            {link.label}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

            </div>

            {/* Divider & Bottom Section */}
            <div className="pt-8 border-t border-stone-200 dark:border-stone-800/60 flex flex-col md:flex-row items-center justify-between gap-5 md:gap-6">
              <p className="text-sm font-medium text-stone-500 dark:text-stone-400 text-center md:text-left">
                © {new Date().getFullYear()} Learnflow AI. All rights reserved.
              </p>
              
              <div className="flex items-center justify-center gap-4">
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full bg-stone-100 dark:bg-stone-900/50 text-stone-500 dark:text-stone-400 hover:text-[#FF7A00] dark:hover:text-[#FF7A00] hover:scale-110 hover:-translate-y-0.5 transition-all duration-300">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full bg-stone-100 dark:bg-stone-900/50 text-stone-500 dark:text-stone-400 hover:text-[#FF7A00] dark:hover:text-[#FF7A00] hover:scale-110 hover:-translate-y-0.5 transition-all duration-300">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
                <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full bg-stone-100 dark:bg-stone-900/50 text-stone-500 dark:text-stone-400 hover:text-[#FF7A00] dark:hover:text-[#FF7A00] hover:scale-110 hover:-translate-y-0.5 transition-all duration-300">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/></svg>
                </a>
              </div>

              <div className="flex items-center gap-2 text-sm font-medium text-stone-500 dark:text-stone-400 hover:text-[#FF7A00] dark:hover:text-[#FF7A00] transition-all duration-300 hover:translate-x-1 cursor-pointer">
                <Mail className="h-4 w-4" /> support@learnflow.ai
              </div>
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

// Separate component so pageSlideIn triggers smoothly
function AnimatedPage({ children }: { children: React.ReactNode }) {
  return (
    <div className="page-enter flex-grow flex flex-col">
      {children}
    </div>
  );
}
