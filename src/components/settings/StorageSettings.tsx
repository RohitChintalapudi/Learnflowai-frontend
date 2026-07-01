import { useState } from 'react';
import { SettingsCard, SettingsSectionHeader, SettingsButton } from './shared';
import { File, MessageSquare, Database, FileText, Download, Trash2, Settings, CheckCircle2, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { SettingsAPI } from '../../lib/api';
import toast from 'react-hot-toast';

export function StorageSettings() {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const { blob, filename } = await SettingsAPI.exportData();
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success("Your data has been exported successfully.");
    } catch (error: any) {
      toast.error(error.message || "Unable to export your data. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="w-full space-y-8">
      <SettingsCard>
        <SettingsSectionHeader 
          title="Storage Overview" 
          description="Manage your account storage and space." 
        />

        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-stone-900 dark:text-white uppercase tracking-wider">Storage Used</h3>
            <p className="text-sm font-bold text-stone-900 dark:text-white">780 MB <span className="text-stone-500 font-normal">/ 2 GB</span></p>
          </div>
          <div className="h-3 w-full bg-stone-100 dark:bg-[#2A2A2A] rounded-full overflow-hidden mb-3 shadow-inner">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '39%' }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full" 
            />
          </div>
          <p className="text-xs text-stone-500 font-medium">You have used 39% of your total plan storage.</p>
        </div>

        <div className="flex items-center gap-4 pt-4 border-t border-stone-100 dark:border-[#2A2A2A]">
          <SettingsButton variant="primary" className="gap-2 font-bold shadow-lg shadow-orange-500/20">
            <Settings className="w-4 h-4" /> Manage Storage
          </SettingsButton>
          <SettingsButton variant="outline" className="gap-2">
            <Download className="w-4 h-4" /> Download Data
          </SettingsButton>
          <SettingsButton variant="outline" className="gap-2 text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900/30 dark:hover:bg-red-900/20">
            <Trash2 className="w-4 h-4" /> Delete Cache
          </SettingsButton>
        </div>
      </SettingsCard>

      <SettingsCard>
        <SettingsSectionHeader title="Storage Breakdown" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-4 rounded-xl border border-stone-100 dark:border-[#2A2A2A] bg-stone-50/50 dark:bg-[#1A1A1A] hover:border-orange-200 dark:hover:border-orange-500/30 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-500/10 flex items-center justify-center">
                <File className="w-5 h-5 text-orange-600 dark:text-orange-500" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-stone-900 dark:text-white">Uploaded Documents</h4>
                <p className="text-xs text-stone-500 mt-0.5">142 PDFs and Docs</p>
              </div>
            </div>
            <p className="text-sm font-bold text-stone-900 dark:text-white">450 MB</p>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl border border-stone-100 dark:border-[#2A2A2A] bg-stone-50/50 dark:bg-[#1A1A1A] hover:border-blue-200 dark:hover:border-blue-500/30 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-500" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-stone-900 dark:text-white">Generated Notes</h4>
                <p className="text-xs text-stone-500 mt-0.5">380 Markdown Files</p>
              </div>
            </div>
            <p className="text-sm font-bold text-stone-900 dark:text-white">120 MB</p>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl border border-stone-100 dark:border-[#2A2A2A] bg-stone-50/50 dark:bg-[#1A1A1A] hover:border-green-200 dark:hover:border-green-500/30 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-500/10 flex items-center justify-center">
                <Database className="w-5 h-5 text-green-600 dark:text-green-500" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-stone-900 dark:text-white">Quiz Files</h4>
                <p className="text-xs text-stone-500 mt-0.5">85 Quizzes generated</p>
              </div>
            </div>
            <p className="text-sm font-bold text-stone-900 dark:text-white">105 MB</p>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl border border-stone-100 dark:border-[#2A2A2A] bg-stone-50/50 dark:bg-[#1A1A1A] hover:border-purple-200 dark:hover:border-purple-500/30 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-500/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-purple-600 dark:text-purple-500" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-stone-900 dark:text-white">AI Conversations</h4>
                <p className="text-xs text-stone-500 mt-0.5">Chat History</p>
              </div>
            </div>
            <p className="text-sm font-bold text-stone-900 dark:text-white">105 MB</p>
          </div>
        </div>
      </SettingsCard>

      <SettingsCard>
        <SettingsSectionHeader 
          title="Export Your Data" 
          description="Download a complete archive of your LearnFlow account. The exported ZIP includes all supported learning resources and profile information." 
        />
        
        <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {[
            "Profile",
            "Documents",
            "Notes",
            "Quizzes",
            "Interview Questions",
            "Mind Maps",
            "Analogies",
            "Simulations",
            "Learning History",
            "Analytics"
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-stone-700 dark:text-stone-300">
              <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" />
              <span className="text-sm font-medium">{item}</span>
            </div>
          ))}
        </div>

        <SettingsButton 
          variant="primary" 
          className="gap-2 font-bold" 
          onClick={handleExport}
          disabled={isExporting}
        >
          {isExporting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Exporting...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" /> Export My Data
            </>
          )}
        </SettingsButton>
      </SettingsCard>
    </div>
  );
}
