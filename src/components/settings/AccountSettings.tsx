import React from 'react';
import { Mail, ShieldCheck, Clock, ExternalLink } from 'lucide-react';
import { SettingsCard, SettingsSectionHeader, SettingsButton } from './shared';
import { useQuery } from '@tanstack/react-query';
import { ProfileAPI } from '../../lib/api';

export function AccountSettings() {
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await ProfileAPI.getProfile();
      return res.success && res.profile ? res.profile : null;
    }
  });

  if (isLoading) {
    return (
      <div className="w-full space-y-8 animate-pulse">
        <div className="h-64 bg-stone-100 dark:bg-[#1A1A1A] rounded-2xl" />
        <div className="h-48 bg-stone-100 dark:bg-[#1A1A1A] rounded-2xl" />
      </div>
    );
  }

  const name = profile?.name || "LearnFlow User";
  const email = profile?.email || "Not Provided";
  const authProvider = profile?.provider || "Standard Authentication";
  
  const joinedDate = profile?.created_at 
    ? new Date(profile.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : "Recently Joined";

  const getAvatarUrl = () => {
    if (!profile) return "https://api.dicebear.com/7.x/notionists/svg?seed=User&backgroundColor=FF7A18";
    return profile.profileImage || `https://api.dicebear.com/7.x/notionists/svg?seed=${profile.name}&backgroundColor=FF7A18`;
  };

  return (
    <div className="w-full">
      <SettingsCard>
        <SettingsSectionHeader 
          title="Account Overview" 
          description="View your basic account information." 
        />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8 p-6 bg-stone-50/50 dark:bg-[#1A1A1A] rounded-2xl border border-stone-100 dark:border-[#2A2A2A]">
          <div className="w-24 h-24 rounded-full border-4 border-white dark:border-[#2A2A2A] overflow-hidden shadow-xl shrink-0 bg-stone-200 dark:bg-[#333]">
            <img 
              src={getAvatarUrl()} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-stone-900 dark:text-white">{name}</h2>
            <p className="text-stone-500 dark:text-stone-400">{email}</p>
            <div className="mt-4">
              <SettingsButton variant="outline" className="text-sm px-4">
                View Public Profile <ExternalLink className="w-3.5 h-3.5 ml-2 opacity-70" />
              </SettingsButton>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl hover:bg-stone-50 dark:hover:bg-[#1A1A1A] transition-colors gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-500/10 flex items-center justify-center text-orange-600 dark:text-orange-500 shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-stone-900 dark:text-white">Email Address</p>
                <p className="text-xs text-stone-500 dark:text-stone-400">Primary communication email</p>
              </div>
            </div>
            <span className="text-sm font-medium text-stone-700 dark:text-stone-300 sm:text-right break-all">{email}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl hover:bg-stone-50 dark:hover:bg-[#1A1A1A] transition-colors gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-500 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-stone-900 dark:text-white">Authentication Provider</p>
                <p className="text-xs text-stone-500 dark:text-stone-400">How you log into LearnFlow</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-stone-100 dark:bg-[#2A2A2A] w-fit">
              <span className="text-xs font-semibold text-stone-700 dark:text-stone-300">{authProvider}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl hover:bg-stone-50 dark:hover:bg-[#1A1A1A] transition-colors gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-500/10 flex items-center justify-center text-green-600 dark:text-green-500 shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-stone-900 dark:text-white">Member Since</p>
                <p className="text-xs text-stone-500 dark:text-stone-400">When you joined LearnFlow AI</p>
              </div>
            </div>
            <span className="text-sm font-medium text-stone-700 dark:text-stone-300 sm:text-right">{joinedDate}</span>
          </div>
        </div>

      </SettingsCard>
    </div>
  );
}
