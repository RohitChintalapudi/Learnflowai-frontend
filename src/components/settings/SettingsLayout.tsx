import { useState } from 'react';
import { DashboardLayout } from '../DashboardLayout';
import { AccountSettings } from './AccountSettings';
import { SecuritySettings } from './SecuritySettings';
import { StorageSettings } from './StorageSettings';
import { DeleteAccountSettings } from './DeleteAccountSettings';
import { HelpSupportSettings } from './HelpSupportSettings';
import { AboutSettings } from './AboutSettings';
import { motion } from 'framer-motion';

export type SettingsTab = 
  | 'account' 
  | 'security' 
  | 'storage' 
  | 'delete-account'
  | 'help-support' 
  | 'about';

const TABS: { id: SettingsTab; label: string }[] = [
  { id: 'account', label: 'Account' },
  { id: 'security', label: 'Security' },
  { id: 'storage', label: 'Storage' },
  { id: 'delete-account', label: 'Delete Account' },
  { id: 'help-support', label: 'Help & Support' },
  { id: 'about', label: 'About' },
];

export function SettingsLayout() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('account');

  const renderContent = () => {
    switch (activeTab) {
      case 'account': return <AccountSettings />;
      case 'security': return <SecuritySettings />;
      case 'storage': return <StorageSettings />;
      case 'delete-account': return <DeleteAccountSettings />;
      case 'help-support': return <HelpSupportSettings />;
      case 'about': return <AboutSettings />;
      default: return <AccountSettings />;
    }
  };

  return (
    <DashboardLayout headerTitle="Settings">
      <div className="flex-grow flex flex-col h-full bg-[#fafafa] dark:bg-[#090909] overflow-hidden">

        {/* Horizontal Navigation as Bubble/Pill list */}
        <div className="flex-none px-8 py-3 bg-transparent z-10">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {TABS.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center justify-center px-5 py-2 rounded-full text-xs font-semibold transition-all duration-300 select-none ${
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
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Layout */}
        <div className="flex-1 overflow-y-auto p-8 relative no-scrollbar">
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
