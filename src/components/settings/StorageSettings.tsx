import { useState } from 'react';
import { SettingsCard, SettingsSectionHeader, SettingsButton } from './shared';
import { File, MessageSquare, Database, FileText, Download, Trash2, CheckCircle2, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { SettingsAPI } from '../../lib/api';
import toast from 'react-hot-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function StorageSettings() {
  const queryClient = useQueryClient();
  const [isExporting, setIsExporting] = useState(false);

  const { data: storage, isLoading } = useQuery({
    queryKey: ['storageSettings'],
    queryFn: async () => {
      const res = await SettingsAPI.getStorageSettings();
      return res.success ? res.data : null;
    }
  });

  const deleteCacheMutation = useMutation({
    mutationFn: SettingsAPI.deleteCache,
    onSuccess: (res) => {
      toast.success(res.message || "Cache deleted successfully.");
      queryClient.invalidateQueries({ queryKey: ['storageSettings'] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Unable to delete cache. Please try again.");
    }
  });

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

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 MB";
    const mb = bytes / (1024 * 1024);
    if (mb < 1) {
      return `${Math.round(bytes / 1024)} KB`;
    }
    return `${mb.toFixed(1)} MB`;
  };

  if (isLoading) {
    return (
      <div className="w-full space-y-8 animate-pulse">
        <div className="h-64 bg-stone-100 dark:bg-black rounded-2xl border border-orange-500/20 dark:border-orange-500/15" />
        <div className="h-48 bg-stone-100 dark:bg-black rounded-2xl border border-orange-500/20 dark:border-orange-500/15" />
      </div>
    );
  }

  // Fallbacks in case query data is missing
  const totalLimit = storage?.totalLimit || 2 * 1024 * 1024 * 1024;
  const totalUsed = storage?.totalUsed || 0;
  const percentageUsed = storage?.percentageUsed ?? 0;
  const breakdown = storage?.breakdown || {
    documents: { count: 0, sizeBytes: 0 },
    notes: { count: 0, sizeBytes: 0 },
    quizzes: { count: 0, sizeBytes: 0 },
    conversations: { count: 0, sizeBytes: 0 }
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
            <p className="text-sm font-bold text-stone-900 dark:text-white">{formatSize(totalUsed)} <span className="text-stone-500 font-normal">/ {formatSize(totalLimit)}</span></p>
          </div>
          <div className="h-3 w-full bg-stone-100 dark:bg-[#2A2A2A] rounded-full overflow-hidden mb-3 shadow-inner">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${percentageUsed}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full" 
            />
          </div>
          <p className="text-xs text-stone-500 font-medium">You have used {percentageUsed}% of your total plan storage.</p>
        </div>

        <div className="flex items-center gap-4 pt-4 border-t border-stone-100 dark:border-[#2A2A2A]">
          <SettingsButton variant="primary" className="gap-2 font-bold shadow-lg shadow-orange-500/20" onClick={handleExport} disabled={isExporting}>
            {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />} Download Data
          </SettingsButton>
          <SettingsButton 
            variant="outline" 
            className="gap-2 text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900/30 dark:hover:bg-red-900/20"
            onClick={() => deleteCacheMutation.mutate()}
            disabled={deleteCacheMutation.isPending}
          >
            {deleteCacheMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />} Delete Cache
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
                <p className="text-xs text-stone-500 mt-0.5">{breakdown.documents.count} PDFs and Docs</p>
              </div>
            </div>
            <p className="text-sm font-bold text-stone-900 dark:text-white">{formatSize(breakdown.documents.sizeBytes)}</p>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl border border-stone-100 dark:border-[#2A2A2A] bg-stone-50/50 dark:bg-[#1A1A1A] hover:border-blue-200 dark:hover:border-blue-500/30 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-500" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-stone-900 dark:text-white">Generated Notes</h4>
                <p className="text-xs text-stone-500 mt-0.5">{breakdown.notes.count} Markdown Files</p>
              </div>
            </div>
            <p className="text-sm font-bold text-stone-900 dark:text-white">{formatSize(breakdown.notes.sizeBytes)}</p>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl border border-stone-100 dark:border-[#2A2A2A] bg-stone-50/50 dark:bg-[#1A1A1A] hover:border-green-200 dark:hover:border-green-500/30 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-500/10 flex items-center justify-center">
                <Database className="w-5 h-5 text-green-600 dark:text-green-500" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-stone-900 dark:text-white">Quiz Files</h4>
                <p className="text-xs text-stone-500 mt-0.5">{breakdown.quizzes.count} Quizzes generated</p>
              </div>
            </div>
            <p className="text-sm font-bold text-stone-900 dark:text-white">{formatSize(breakdown.quizzes.sizeBytes)}</p>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl border border-stone-100 dark:border-[#2A2A2A] bg-stone-50/50 dark:bg-[#1A1A1A] hover:border-purple-200 dark:hover:border-purple-500/30 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-500/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-purple-600 dark:text-purple-500" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-stone-900 dark:text-white">AI Conversations</h4>
                <p className="text-xs text-stone-500 mt-0.5">{breakdown.conversations.count} Chat History items</p>
              </div>
            </div>
            <p className="text-sm font-bold text-stone-900 dark:text-white">{formatSize(breakdown.conversations.sizeBytes)}</p>
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
