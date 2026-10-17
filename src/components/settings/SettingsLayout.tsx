import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DashboardLayout } from '../DashboardLayout';
import { PlanSettings } from './PlanSettings';
import { AccountSettings } from './AccountSettings';
import { SecuritySettings } from './SecuritySettings';
import { StorageSettings } from './StorageSettings';
import { DeleteAccountSettings } from './DeleteAccountSettings';
import { SettingsAPI } from '../../lib/api';
import { motion } from 'framer-motion';

export type SettingsTab =
  | 'account'
  | 'plan'
  | 'security'
  | 'storage'
  | 'delete-account';

const ALL_TABS: { id: SettingsTab; label: string }[] = [
  { id: 'account', label: 'Account' },
  { id: 'plan', label: 'Plan' },
  { id: 'storage', label: 'Storage' },
  { id: 'security', label: 'Change Password' },
  { id: 'delete-account', label: 'Delete Account' },
];

export function SettingsLayout() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('account');

  const { data: account } = useQuery({
    queryKey: ['accountSettings'],
    queryFn: async () => {
      const res = await SettingsAPI.getAccountSettings();
      return res.success ? res.data : null;
    },
  });

  const provider = account?.provider || "";
  const tabs = provider === "google"
    ? ALL_TABS.filter(t => t.id !== 'security')
    : ALL_TABS;

  const renderContent = () => {
    switch (activeTab) {
      case 'account': return <AccountSettings />;
      case 'plan': return <PlanSettings />;
      case 'storage': return <StorageSettings />;
      case 'security': return <SecuritySettings />;
      case 'delete-account': return <DeleteAccountSettings />;
      default: return <AccountSettings />;
    }
  };

  return (
    <DashboardLayout headerTitle="Settings">
      <div className="flex-grow flex flex-col h-full bg-[#fafafa] dark:bg-[#090909] overflow-hidden">

        {/* Horizontal Navigation as Bubble/Pill list */}
        <div className="flex-none px-4 sm:px-6 lg:px-8 py-3 bg-transparent z-10 w-full flex justify-center">
          <div className="flex items-center justify-center gap-2 overflow-x-auto no-scrollbar py-1 max-w-full">
            {tabs.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center justify-center px-5 py-2 rounded-full text-xs font-semibold transition-all duration-300 select-none shrink-0 ${
                    active
                      ? "text-white shadow-lg shadow-orange-500/25 border border-orange-500 scale-105"
                      : "bg-white/60 dark:bg-zinc-900/40 border border-stone-200 dark:border-[#2A2A2A] text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-zinc-800/60 hover:text-stone-900 dark:hover:text-stone-200"
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="activeTabBubble"
                      className="absolute inset-0 rounded-full bg-orange-500 -z-10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 whitespace-nowrap">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Layout */}
        <div className="flex-1 overflow-y-auto responsive-page-pad mobile-safe-bottom relative no-scrollbar">
          <div className="max-w-6xl mx-auto h-full pb-16">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
