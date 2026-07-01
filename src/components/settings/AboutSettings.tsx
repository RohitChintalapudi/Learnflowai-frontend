import { SettingsCard, SettingsButton } from './shared';
import { ExternalLink, GitBranch, Book, FileText, CheckCircle2, Code } from 'lucide-react';

export function AboutSettings() {
  return (
    <div className="w-full space-y-8">
      <SettingsCard className="text-center py-12">
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center shrink-0">
              <img src="/logo.png" className="block dark:hidden h-12 w-auto object-contain" alt="Learnflow AI Logo" />
              <img src="/logo_dark.png" className="hidden dark:block h-12 w-auto object-contain" alt="Learnflow AI Logo" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-stone-900 dark:text-white">LearnFlow <span className="text-orange-500">AI</span></h2>
          </div>
        </div>
        
        <p className="text-stone-500 dark:text-stone-400 max-w-md mx-auto mb-8">
          The intelligent workspace for modern computer science students. Master complex concepts with AI-powered simulations and interactive learning tools.
        </p>

        <div className="flex flex-col items-center gap-2 mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-stone-100 dark:bg-[#2A2A2A] text-sm font-medium text-stone-700 dark:text-stone-300">
            Version 2.4.0 (Enterprise)
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 ml-1" />
          </div>
          <span className="text-xs text-stone-400 dark:text-stone-500 font-mono">Build 8f3b2a1 (Production)</span>
        </div>

        <div className="flex items-center justify-center gap-4 mb-12">
          <SettingsButton variant="primary" className="gap-2 font-bold shadow-lg shadow-orange-500/20">
            <CheckCircle2 className="w-4 h-4" /> Check for Updates
          </SettingsButton>
          <SettingsButton variant="outline" className="gap-2">
            View Release Notes
          </SettingsButton>
        </div>

        <div className="border-t border-stone-100 dark:border-[#2A2A2A] w-full max-w-2xl mx-auto mb-8" />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 max-w-4xl mx-auto text-left">
          <a href="#" className="flex flex-col items-center text-center gap-3 p-4 rounded-xl hover:bg-stone-50 dark:hover:bg-[#1A1A1A] transition-colors group">
            <FileText className="w-6 h-6 text-stone-400 group-hover:text-stone-900 dark:group-hover:text-white transition-colors" />
            <span className="text-sm font-semibold text-stone-700 dark:text-stone-300 group-hover:text-stone-900 dark:group-hover:text-white">Terms of Service</span>
          </a>
          
          <a href="#" className="flex flex-col items-center text-center gap-3 p-4 rounded-xl hover:bg-stone-50 dark:hover:bg-[#1A1A1A] transition-colors group">
            <Book className="w-6 h-6 text-stone-400 group-hover:text-stone-900 dark:group-hover:text-white transition-colors" />
            <span className="text-sm font-semibold text-stone-700 dark:text-stone-300 group-hover:text-stone-900 dark:group-hover:text-white">Privacy Policy</span>
          </a>

          <a href="#" className="flex flex-col items-center text-center gap-3 p-4 rounded-xl hover:bg-stone-50 dark:hover:bg-[#1A1A1A] transition-colors group">
            <ExternalLink className="w-6 h-6 text-stone-400 group-hover:text-stone-900 dark:group-hover:text-white transition-colors" />
            <span className="text-sm font-semibold text-stone-700 dark:text-stone-300 group-hover:text-stone-900 dark:group-hover:text-white">Licenses</span>
          </a>

          <a href="#" className="flex flex-col items-center text-center gap-3 p-4 rounded-xl hover:bg-stone-50 dark:hover:bg-[#1A1A1A] transition-colors group">
            <Code className="w-6 h-6 text-stone-400 group-hover:text-stone-900 dark:group-hover:text-white transition-colors" />
            <span className="text-sm font-semibold text-stone-700 dark:text-stone-300 group-hover:text-stone-900 dark:group-hover:text-white">Open Source Credits</span>
          </a>

          <a href="#" className="flex flex-col items-center text-center gap-3 p-4 rounded-xl hover:bg-stone-50 dark:hover:bg-[#1A1A1A] transition-colors group">
            <GitBranch className="w-6 h-6 text-stone-400 group-hover:text-stone-900 dark:group-hover:text-white transition-colors" />
            <span className="text-sm font-semibold text-stone-700 dark:text-stone-300 group-hover:text-stone-900 dark:group-hover:text-white">GitHub Repo</span>
          </a>
        </div>
      </SettingsCard>

      <div className="text-center mt-8 pb-4">
        <p className="text-xs text-stone-400">
          &copy; {new Date().getFullYear()} LearnFlow AI Inc. All rights reserved.
        </p>
      </div>
    </div>
  );
}
