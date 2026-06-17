import React, { useState, useEffect } from 'react'
import { createFileRoute, Outlet, Link, useLocation } from '@tanstack/react-router'
import { Sun, Moon, Send } from 'lucide-react'
import bgImage from '../assets/design.png'

export const Route = createFileRoute('/_public')({
  component: PublicLayout,
})

function PublicLayout() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  // Load theme preference on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light')
    
    setTheme(initialTheme)
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(nextTheme)
    localStorage.setItem('theme', nextTheme)
    
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const location = useLocation()
  const isHome = location.pathname === '/home'

  return (
    <div className={`min-h-screen flex flex-col relative text-stone-800 dark:text-stone-100 transition-colors duration-300 antialiased selection:bg-orange-100 dark:selection:bg-orange-900/40 selection:text-stone-900 ${isHome ? 'bg-white dark:bg-[#0c0a09]' : 'bg-transparent'}`}>
      {/* Static background image — only on auth pages */}
      {!isHome && (
        <img 
          src={bgImage} 
          alt="Background" 
          className="fixed inset-0 w-full h-full object-cover -z-10 pointer-events-none block opacity-80 dark:opacity-60 transition-opacity duration-300"
        />
      )}

      {/* Global Public Navbar */}
      <header className="sticky top-0 z-50 w-full bg-white/75 dark:bg-[#0c0a09]/80 backdrop-blur-md border-b border-stone-200/30 dark:border-orange-900/20 transition-colors duration-300">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-12">
          {/* Brand Logo & Name */}
          <Link to="/home" className="flex items-center gap-2.5 group focus:outline-none">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-orange-700 dark:from-orange-400 dark:to-orange-600 shadow-md shadow-orange-500/20 group-hover:scale-105 group-hover:shadow-orange-500/30 group-active:scale-95 transition-all duration-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 text-white"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-[15px] font-bold tracking-tight leading-none text-stone-900 dark:text-white">
                Learnflow <span className="text-orange-500 dark:text-orange-400">AI</span>
              </span>
              <span className="text-[10px] text-stone-400 dark:text-stone-500 leading-none mt-0.5">Learn Smarter, Understand Deeper</span>
            </div>
          </Link>

          {/* Center nav links */}
          <nav className="hidden md:flex items-center gap-1">
            {['Features', 'Pricing', 'About'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm font-medium px-3.5 py-2 rounded-lg text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-50 dark:hover:bg-stone-900/50 transition-all duration-200"
              >
                {item}
              </a>
            ))}
          </nav>

          {/* Right controls */}
          <nav className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-stone-500 hover:text-orange-600 dark:text-stone-400 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/30 transition-all duration-200 focus:outline-none"
              aria-label="Toggle light/dark theme"
            >
              {theme === 'light' ? (
                <Moon className="h-[18px] w-[18px]" />
              ) : (
                <Sun className="h-[18px] w-[18px]" />
              )}
            </button>

            {/* Login Link */}
            <Link
              to="/login"
              className="text-sm font-semibold px-4 py-2 rounded-lg border border-stone-200 dark:border-stone-700/60 text-stone-600 dark:text-stone-300 hover:bg-orange-50 dark:hover:bg-orange-950/20 hover:text-orange-600 dark:hover:text-orange-400 hover:border-orange-200 dark:hover:border-orange-800/50 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              activeProps={{ className: 'border-orange-400 dark:border-orange-600 text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/20' }}
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
      </header>

      {/* Page Content Container */}
      <main className="flex-grow flex flex-col relative z-10">
        <PageTransitionWrapper>
          <Outlet />
        </PageTransitionWrapper>
      </main>

      {/* Global Footer */}
      <footer className="w-full border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-[#0c0a09] pt-16 pb-8 mt-auto relative z-10 transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-12">
            
            {/* Brand & Newsletter */}
            <div className="lg:col-span-5 flex flex-col items-start">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-orange-700 dark:from-orange-400 dark:to-orange-600 shadow-sm shadow-orange-500/20">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-4.5 w-4.5 text-white">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                </div>
                <span className="text-lg font-extrabold tracking-tight text-stone-900 dark:text-white">
                  Learnflow <span className="text-orange-500 dark:text-orange-400">AI</span>
                </span>
              </div>
              <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed mb-6 max-w-sm">
                Transform the way you learn Computer Science. Our AI-powered tools provide instant interactive simulations and structured paths to master complex topics.
              </p>
              
              {/* Newsletter */}
              <div className="w-full max-w-sm">
                <p className="text-xs font-semibold text-stone-900 dark:text-white mb-2 uppercase tracking-wider">Subscribe to updates</p>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input type="email" placeholder="Enter your email" className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/50 text-sm focus:outline-none focus:border-orange-500 dark:focus:border-orange-500 transition-colors placeholder:text-stone-400" />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-stone-400 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/30 transition-colors">
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Links Columns */}
            <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
              {/* Product */}
              <div className="flex flex-col gap-3">
                <h4 className="text-sm font-bold text-stone-900 dark:text-white mb-1">Product</h4>
                <a href="#features" className="text-sm font-medium text-stone-500 dark:text-stone-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">Features</a>
                <a href="#simulations" className="text-sm font-medium text-stone-500 dark:text-stone-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">Simulations</a>
                <a href="#pricing" className="text-sm font-medium text-stone-500 dark:text-stone-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">Pricing</a>
                <Link to="/home" className="text-sm font-medium text-stone-500 dark:text-stone-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">Changelog</Link>
              </div>

              {/* Resources */}
              <div className="flex flex-col gap-3">
                <h4 className="text-sm font-bold text-stone-900 dark:text-white mb-1">Resources</h4>
                <Link to="/home" className="text-sm font-medium text-stone-500 dark:text-stone-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">Documentation</Link>
                <Link to="/home" className="text-sm font-medium text-stone-500 dark:text-stone-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">API Reference</Link>
                <Link to="/home" className="text-sm font-medium text-stone-500 dark:text-stone-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">Community Forum</Link>
                <Link to="/home" className="text-sm font-medium text-stone-500 dark:text-stone-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">Study Guides</Link>
              </div>

              {/* Company */}
              <div className="flex flex-col gap-3">
                <h4 className="text-sm font-bold text-stone-900 dark:text-white mb-1">Company</h4>
                <Link to="/home" className="text-sm font-medium text-stone-500 dark:text-stone-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">About Us</Link>
                <Link to="/home" className="text-sm font-medium text-stone-500 dark:text-stone-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">Careers</Link>
                <Link to="/home" className="text-sm font-medium text-stone-500 dark:text-stone-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">Blog</Link>
                <Link to="/home" className="text-sm font-medium text-stone-500 dark:text-stone-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">Contact</Link>
              </div>
            </div>

          </div>
          
          {/* Divider & Bottom Section */}
          <div className="pt-8 border-t border-stone-200 dark:border-stone-800/60 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-stone-400 dark:text-stone-500">
              © {new Date().getFullYear()} Learnflow AI. All rights reserved. Built for learners.
            </p>
            
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <div className="flex items-center gap-4 text-xs font-semibold text-stone-400 dark:text-stone-500">
                <a href="#" className="hover:text-orange-500 dark:hover:text-orange-400 transition-colors">Twitter</a>
                <a href="#" className="hover:text-orange-500 dark:hover:text-orange-400 transition-colors">GitHub</a>
                <a href="#" className="hover:text-orange-500 dark:hover:text-orange-400 transition-colors">LinkedIn</a>
              </div>
              <div className="h-3 w-px bg-stone-300 dark:bg-stone-700 hidden sm:block"></div>
              <div className="flex items-center gap-4 text-xs font-medium text-stone-400 dark:text-stone-500">
                <a href="#" className="hover:text-stone-900 dark:hover:text-white transition-colors">Privacy</a>
                <a href="#" className="hover:text-stone-900 dark:hover:text-white transition-colors">Terms</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Keyed wrapper — remounts on every route change, replaying the CSS animation
function PageTransitionWrapper({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  return (
    <AnimatedPage key={location.pathname}>
      {children}
    </AnimatedPage>
  )
}

// Separate component so useEffect fires on every remount (key change)
function AnimatedPage({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    // Lock scrolling for exactly the animation duration so the
    // translateY slide-up never triggers a scrollbar flash
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    const t = setTimeout(() => {
      document.body.style.overflow = prev
      document.documentElement.style.overflow = ''
    }, 480) // slightly longer than the 450ms animation

    return () => {
      clearTimeout(t)
      document.body.style.overflow = prev
      document.documentElement.style.overflow = ''
    }
  }, [])

  return (
    <div className="page-enter flex-grow flex flex-col overflow-hidden">
      {children}
    </div>
  )
}
