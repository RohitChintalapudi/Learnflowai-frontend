import { SettingsCard, SettingsSectionHeader, SettingsButton } from './shared';
import { HelpCircle, MessageCircle, FileText, Bug, GitBranch } from 'lucide-react';

export function HelpSupportSettings() {
  return (
    <div className="w-full space-y-8">
      <SettingsCard>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-stone-900 dark:text-white">Need Help?</h2>
          <p className="text-stone-500 dark:text-stone-400 mt-1">We're here to help you get the most from LearnFlow AI.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <a href="#" className="flex flex-col items-center gap-3 p-5 rounded-2xl border border-stone-200 dark:border-[#2A2A2A] hover:border-orange-200 dark:hover:border-orange-500/30 bg-stone-50/50 dark:bg-[#1A1A1A] transition-all cursor-pointer group">
            <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-500/10 flex items-center justify-center text-orange-600 dark:text-orange-500 group-hover:scale-110 transition-transform">
              <HelpCircle className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold text-stone-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-500">Help Center</span>
          </a>

          <a href="#" className="flex flex-col items-center gap-3 p-5 rounded-2xl border border-stone-200 dark:border-[#2A2A2A] hover:border-blue-200 dark:hover:border-blue-500/30 bg-stone-50/50 dark:bg-[#1A1A1A] transition-all cursor-pointer group">
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-500 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold text-stone-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-500">Documentation</span>
          </a>

          <a href="#" className="flex flex-col items-center gap-3 p-5 rounded-2xl border border-stone-200 dark:border-[#2A2A2A] hover:border-green-200 dark:hover:border-green-500/30 bg-stone-50/50 dark:bg-[#1A1A1A] transition-all cursor-pointer group">
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-500/10 flex items-center justify-center text-green-600 dark:text-green-500 group-hover:scale-110 transition-transform">
              <MessageCircle className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold text-stone-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-500">Community</span>
          </a>

          <a href="#" className="flex flex-col items-center gap-3 p-5 rounded-2xl border border-stone-200 dark:border-[#2A2A2A] hover:border-red-200 dark:hover:border-red-500/30 bg-stone-50/50 dark:bg-[#1A1A1A] transition-all cursor-pointer group">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-500/10 flex items-center justify-center text-red-600 dark:text-red-500 group-hover:scale-110 transition-transform">
              <Bug className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold text-stone-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-500">Report a Bug</span>
          </a>
        </div>
      </SettingsCard>

      <SettingsCard>
        <SettingsSectionHeader 
          title="Feedback" 
          description="We'd love to hear what you think of LearnFlow AI." 
        />
        
        <div className="space-y-4 mb-6">
          <textarea 
            rows={5}
            className="w-full bg-stone-50 dark:bg-[#1A1A1A] border border-stone-200 dark:border-[#2A2A2A] rounded-xl p-4 text-sm text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all resize-none placeholder:text-stone-400"
            placeholder="Tell us about your experience or suggest an improvement..."
          />
          <div className="flex items-center gap-3">
            <SettingsButton variant="primary" className="font-bold">
              Submit Feedback
            </SettingsButton>
            <SettingsButton variant="outline">
              Clear
            </SettingsButton>
          </div>
        </div>
      </SettingsCard>

      <SettingsCard>
        <SettingsSectionHeader title="Contact Support" description="Reach out to us directly through these channels." />
        <div className="flex flex-wrap items-center gap-4">
          <SettingsButton variant="outline" className="gap-2 font-medium">
            <MessageCircle className="w-4 h-4" /> Email
          </SettingsButton>
          <SettingsButton variant="outline" className="gap-2 font-medium text-[#5865F2] border-[#5865F2]/20 hover:bg-[#5865F2]/10">
            <MessageCircle className="w-4 h-4" /> Discord
          </SettingsButton>
          <SettingsButton variant="outline" className="gap-2 font-medium text-stone-700 dark:text-stone-300">
            <GitBranch className="w-4 h-4" /> GitHub Issues
          </SettingsButton>
        </div>
      </SettingsCard>
    </div>
  );
}
