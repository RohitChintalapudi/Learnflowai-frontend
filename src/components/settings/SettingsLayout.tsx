import { useState } from 'react';
import { DashboardLayout } from '../DashboardLayout';
import { AccountSettings } from './AccountSettings';
import { SecuritySettings } from './SecuritySettings';
import { NotificationSettings } from './NotificationSettings';
import { StorageSettings } from './StorageSettings';
import { HelpSupportSettings } from './HelpSupportSettings';
import { AboutSettings } from './AboutSettings';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

export type SettingsTab = 
  | 'account' 
  | 'security' 
  | 'notifications' 
  | 'storage' 
  | 'help-support' 
  | 'about';

const TABS: { id: SettingsTab; label: string }[] = [
  { id: 'account', label: 'Account' },
  { id: 'security', label: 'Security' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'storage', label: 'Storage' },
  { id: 'help-support', label: 'Help & Support' },
  { id: 'about', label: 'About' },
];

export function SettingsLayout() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('account');
  
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof document !== 'undefined') {
      return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    }
    return 'light';
  });

  const toggleTheme = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'account': return <AccountSettings />;
      case 'security': return <SecuritySettings />;
      case 'notifications': return <NotificationSettings />;
      case 'storage': return <StorageSettings />;
      case 'help-support': return <HelpSupportSettings />;
      case 'about': return <AboutSettings />;
      default: return <AccountSettings />;
    }
  };

  return (
    <DashboardLayout hideHeader={true}>
      <div className="flex-grow flex flex-col h-full bg-[#fafafa] dark:bg-[#090909] overflow-hidden">
        
        {/* Sticky Header with Title and Theme Switcher */}
        <div className="flex-none px-8 pt-8 pb-4 bg-[#fafafa] dark:bg-[#090909] z-20">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-stone-900 dark:text-white">Settings</h1>
              <p className="text-stone-500 dark:text-stone-400 mt-1">Manage your account, preferences, and application settings.</p>
            </div>
            
            {/* Theme Switcher Segmented Control */}
            <div className="flex items-center bg-stone-200/50 dark:bg-[#1A1A1A] p-1 rounded-xl shadow-sm border border-stone-200/50 dark:border-[#2A2A2A]">
              <button
                onClick={() => toggleTheme('light')}
                className={`relative flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors z-10 ${
                  theme === 'light' ? 'text-stone-900' : 'text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'
                }`}
              >
                {theme === 'light' && (
                  <motion.div
                    layoutId="theme-indicator"
                    className="absolute inset-0 bg-white rounded-lg shadow-sm"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <Sun className="w-4 h-4 relative z-10" />
                <span className="relative z-10">Light</span>
              </button>
              
              <button
                onClick={() => toggleTheme('dark')}
                className={`relative flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors z-10 ${
                  theme === 'dark' ? 'text-white' : 'text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'
                }`}
              >
                {theme === 'dark' && (
                  <motion.div
                    layoutId="theme-indicator"
                    className="absolute inset-0 bg-[#2A2A2A] rounded-lg shadow-sm"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <Moon className="w-4 h-4 relative z-10" />
                <span className="relative z-10">Dark</span>
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Navigation */}
        <div className="flex-none px-8 border-b border-stone-200 dark:border-[#2A2A2A] bg-[#fafafa]/80 dark:bg-[#090909]/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'text-orange-600 dark:text-orange-500' 
                    : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTabUnderline"
                    className="absolute left-0 right-0 bottom-0 h-0.5 bg-orange-500"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content Layout */}
        <div className="flex-1 overflow-y-auto p-8 relative">
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
