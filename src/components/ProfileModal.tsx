import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Trash2,
  Lock,
  User,
  FileText,
  StickyNote,
  HelpCircle,
  BrainCircuit,
  Camera,
  Loader2,
  Check
} from "lucide-react";
import toast from "react-hot-toast";
import { ProfileAPI } from "../lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { getFirstLetterOfFirstName } from "../lib/utils";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  image?: string;
  profileImage?: string;
  bio?: string;
  learningGoals?: string;
}

interface ProfileStats {
  documentsCount: number;
  notesCount: number;
  quizzesCount: number;
  explanationsCount: number;
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const queryClient = useQueryClient();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form State
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [learningGoals, setLearningGoals] = useState("");
  
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeletingAvatar, setIsDeletingAvatar] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [profileRes, statsRes] = await Promise.all([
        ProfileAPI.getProfile(),
        ProfileAPI.getProfileStats()
      ]);
      
      if (profileRes.success && profileRes.profile) {
        setProfile(profileRes.profile);
        setName(profileRes.profile.name || "");
        setBio(profileRes.profile.bio || "");
        setLearningGoals(profileRes.profile.learningGoals || "");
      }
      
      if (statsRes.success) {
        setStats(statsRes);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to load profile data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const hasChanges = 
    profile && (
      name !== (profile.name || "") ||
      bio !== (profile.bio || "") ||
      learningGoals !== (profile.learningGoals || "")
    );

  const isValid = name.trim().length > 0 && bio.length <= 300 && learningGoals.length <= 500;

  const handleSave = async () => {
    if (!hasChanges || !isValid) return;
    setIsSaving(true);
    try {
      const res = await ProfileAPI.updateProfile({ name, bio, learningGoals });
      if (res.success && res.profile) {
        setProfile(res.profile);
        localStorage.setItem("lf_user_name", res.profile.name || "");
        localStorage.setItem("lf_user_image", res.profile.profileImage || "");
        toast.success("Profile updated successfully!");
        queryClient.invalidateQueries({ queryKey: ['profile'] });
        queryClient.invalidateQueries({ queryKey: ['accountSettings'] });
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please select a valid image file (JPG, PNG, WEBP)");
      return;
    }

    // Validate size (e.g. 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setIsUploading(true);
    try {
      const res = await ProfileAPI.uploadAvatar(file);
      if (res.success && res.profileImage) {
        setProfile(prev => prev ? { ...prev, profileImage: res.profileImage } : null);
        localStorage.setItem("lf_user_image", res.profileImage);
        toast.success("Avatar uploaded successfully!");
        queryClient.invalidateQueries({ queryKey: ['profile'] });
        queryClient.invalidateQueries({ queryKey: ['accountSettings'] });
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to upload avatar");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDeleteAvatar = async () => {
    if (!window.confirm("Are you sure you want to remove your profile picture?")) return;
    setIsDeletingAvatar(true);
    try {
      const res = await ProfileAPI.deleteAvatar();
      if (res.success) {
        setProfile(prev => prev ? { ...prev, profileImage: undefined } : null);
        localStorage.setItem("lf_user_image", "");
        toast.success("Avatar removed");
        queryClient.invalidateQueries({ queryKey: ['profile'] });
        queryClient.invalidateQueries({ queryKey: ['accountSettings'] });
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to remove avatar");
    } finally {
      setIsDeletingAvatar(false);
    }
  };

  const isValidAvatarUrl = (url?: string | null) => {
    if (!url) return false;
    if (url.includes("/undefined") || url.includes("/null")) return false;
    return true;
  };

  const activeAvatar = [profile?.profileImage, profile?.image].find(isValidAvatarUrl) || "";
  const hasCustomAvatar = !!activeAvatar;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-[var(--lf-card)] dark:bg-zinc-950 border border-[var(--lf-border)] dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden card-shadow-lg"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[var(--lf-border)] dark:border-zinc-800/60 bg-[var(--lf-card)]/80 dark:bg-zinc-900/40 backdrop-blur-xl shrink-0 z-10 sticky top-0">
            <h2 className="text-xl font-bold text-[var(--lf-text-primary)] dark:text-white flex items-center gap-2">
              <User className="h-5 w-5 text-orange-500" /> My Profile
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[var(--lf-surface)] dark:hover:bg-zinc-800 text-[var(--lf-text-secondary)] dark:text-zinc-400 hover:text-[var(--lf-text-primary)] dark:hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 md:p-8 no-scrollbar">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <Loader2 className="h-8 w-8 text-orange-500 animate-spin" />
                <p className="text-[var(--lf-text-secondary)] dark:text-zinc-500 text-sm">Loading profile data...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Column: Avatar & Quick Stats */}
                <div className="space-y-6">
                  {/* Avatar Card */}
                  <div className="bg-[var(--lf-surface)] dark:bg-zinc-900/40 border border-[var(--lf-border)] dark:border-zinc-800 rounded-3xl p-6 flex flex-col items-center text-center relative overflow-hidden group card-shadow">
                    <div className="absolute inset-0 bg-gradient-to-b from-orange-500/5 to-transparent pointer-events-none" />
                    
                    <div className="relative mb-4">
                      <div className="w-32 h-32 rounded-full border-4 border-[var(--lf-border)] dark:border-zinc-800/80 overflow-hidden bg-[var(--lf-surface)] dark:bg-zinc-900 shadow-xl relative group-hover:border-orange-500/30 transition-colors flex items-center justify-center">
                        {hasCustomAvatar ? (
                          <img 
                            src={activeAvatar} 
                            alt="Profile" 
                            className={`w-full h-full object-cover transition-opacity duration-300 ${isUploading ? 'opacity-30' : 'opacity-100'}`} 
                          />
                        ) : (
                          <div className={`w-full h-full bg-gradient-to-br from-orange-500 to-amber-500 text-white font-extrabold text-4xl flex items-center justify-center select-none transition-opacity duration-300 ${isUploading ? 'opacity-30' : 'opacity-100'}`}>
                            {getFirstLetterOfFirstName(profile?.name)}
                          </div>
                        )}
                        
                        {/* Hover Overlay */}
                        <div 
                          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Camera className="h-6 w-6 text-white mb-1" />
                          <span className="text-xs font-bold text-white uppercase tracking-wider">Change</span>
                        </div>

                        {/* Loading Spinner */}
                        {isUploading && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Loader2 className="h-8 w-8 text-orange-500 animate-spin" />
                          </div>
                        )}
                      </div>

                      {hasCustomAvatar && !isUploading && (
                        <button 
                          onClick={handleDeleteAvatar}
                          disabled={isDeletingAvatar}
                          className="absolute bottom-0 right-0 p-2.5 bg-[var(--lf-card)] dark:bg-zinc-800 hover:bg-red-500/20 text-[var(--lf-text-secondary)] dark:text-zinc-400 hover:text-red-500 rounded-full border border-[var(--lf-border)] dark:border-zinc-700 hover:border-red-500/50 shadow-lg transition-all z-10"
                          title="Remove Photo"
                        >
                          {isDeletingAvatar ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        </button>
                      )}
                    </div>

                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/jpeg, image/png, image/jpg, image/webp"
                      onChange={handleAvatarUpload}
                    />

                    <h3 className="text-lg font-bold text-[var(--lf-text-primary)] dark:text-white mb-1">{profile?.name}</h3>
                    <p className="text-xs text-[var(--lf-text-secondary)] dark:text-zinc-500 font-medium bg-[var(--lf-surface)] dark:bg-zinc-800/50 px-3 py-1 rounded-full flex items-center gap-1.5 inline-flex border border-[var(--lf-border)] dark:border-zinc-700">
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                      Free Plan
                    </p>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[var(--lf-surface)] dark:bg-zinc-900/40 border border-[var(--lf-border)] dark:border-zinc-800 rounded-2xl p-4 flex flex-col items-center text-center group hover:border-orange-500/30 transition-colors">
                      <div className="h-10 w-10 rounded-full bg-orange-500/10 text-orange-500 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                        <FileText className="h-5 w-5" />
                      </div>
                      <span className="text-2xl font-black text-[var(--lf-text-primary)] dark:text-white">{stats?.documentsCount || 0}</span>
                      <span className="text-[10px] uppercase tracking-wider font-bold text-[var(--lf-text-secondary)] dark:text-zinc-500 mt-1">Docs</span>
                    </div>
                    <div className="bg-[var(--lf-surface)] dark:bg-zinc-900/40 border border-[var(--lf-border)] dark:border-zinc-800 rounded-2xl p-4 flex flex-col items-center text-center group hover:border-blue-500/30 transition-colors">
                      <div className="h-10 w-10 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                        <StickyNote className="h-5 w-5" />
                      </div>
                      <span className="text-2xl font-black text-[var(--lf-text-primary)] dark:text-white">{stats?.notesCount || 0}</span>
                      <span className="text-[10px] uppercase tracking-wider font-bold text-[var(--lf-text-secondary)] dark:text-zinc-500 mt-1">Notes</span>
                    </div>
                    <div className="bg-[var(--lf-surface)] dark:bg-zinc-900/40 border border-[var(--lf-border)] dark:border-zinc-800 rounded-2xl p-4 flex flex-col items-center text-center group hover:border-emerald-500/30 transition-colors">
                      <div className="h-10 w-10 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                        <HelpCircle className="h-5 w-5" />
                      </div>
                      <span className="text-2xl font-black text-[var(--lf-text-primary)] dark:text-white">{stats?.quizzesCount || 0}</span>
                      <span className="text-[10px] uppercase tracking-wider font-bold text-[var(--lf-text-secondary)] dark:text-zinc-500 mt-1">Quizzes</span>
                    </div>
                    <div className="bg-[var(--lf-surface)] dark:bg-zinc-900/40 border border-[var(--lf-border)] dark:border-zinc-800 rounded-2xl p-4 flex flex-col items-center text-center group hover:border-purple-500/30 transition-colors">
                      <div className="h-10 w-10 rounded-full bg-purple-500/10 text-purple-500 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                        <BrainCircuit className="h-5 w-5" />
                      </div>
                      <span className="text-2xl font-black text-[var(--lf-text-primary)] dark:text-white">{stats?.explanationsCount || 0}</span>
                      <span className="text-[10px] uppercase tracking-wider font-bold text-[var(--lf-text-secondary)] dark:text-zinc-500 mt-1">Explanations</span>
                    </div>
                  </div>
                </div>

                {/* Right Column: Editable Details */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Account Details Form */}
                  <div className="bg-[var(--lf-surface)] dark:bg-zinc-900/40 border border-[var(--lf-border)] dark:border-zinc-800 rounded-3xl p-6 md:p-8 space-y-6 card-shadow">
                    <h3 className="text-lg font-bold text-[var(--lf-text-primary)] dark:text-white border-b border-[var(--lf-border)] dark:border-zinc-800 pb-3">Personal Details</h3>
                    
                    <div className="space-y-5">
                      {/* Name Input */}
                      <div>
                        <label className="block text-sm font-semibold text-[var(--lf-text-secondary)] dark:text-zinc-400 mb-2">Display Name</label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-[var(--lf-bg)] dark:bg-zinc-950 border border-[var(--lf-border)] dark:border-zinc-800 rounded-xl px-4 py-3 text-[var(--lf-text-primary)] dark:text-white focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-colors"
                          placeholder="Your Name"
                        />
                      </div>

                      {/* Bio Input */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="block text-sm font-semibold text-[var(--lf-text-secondary)] dark:text-zinc-400">Bio</label>
                          <span className={`text-xs font-medium ${bio.length > 300 ? 'text-red-500' : 'text-[var(--lf-text-secondary)] dark:text-zinc-500'}`}>
                            {bio.length} / 300
                          </span>
                        </div>
                        <textarea
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          className={`w-full bg-[var(--lf-bg)] dark:bg-zinc-950 border ${bio.length > 300 ? 'border-red-500/50 focus:ring-red-500/50' : 'border-[var(--lf-border)] dark:border-zinc-800 focus:border-orange-500/50 focus:ring-orange-500/50'} rounded-xl px-4 py-3 text-[var(--lf-text-primary)] dark:text-white focus:outline-none focus:ring-1 transition-colors resize-none`}
                          rows={3}
                          placeholder="Write a short bio about yourself..."
                        />
                      </div>

                      {/* Learning Goals Input */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="block text-sm font-semibold text-[var(--lf-text-secondary)] dark:text-zinc-400">Learning Goals</label>
                          <span className={`text-xs font-medium ${learningGoals.length > 500 ? 'text-red-500' : 'text-[var(--lf-text-secondary)] dark:text-zinc-500'}`}>
                            {learningGoals.length} / 500
                          </span>
                        </div>
                        <textarea
                          value={learningGoals}
                          onChange={(e) => setLearningGoals(e.target.value)}
                          className={`w-full bg-[var(--lf-bg)] dark:bg-zinc-950 border ${learningGoals.length > 500 ? 'border-red-500/50 focus:ring-red-500/50' : 'border-[var(--lf-border)] dark:border-zinc-800 focus:border-orange-500/50 focus:ring-orange-500/50'} rounded-xl px-4 py-3 text-[var(--lf-text-primary)] dark:text-white focus:outline-none focus:ring-1 transition-colors resize-none`}
                          rows={4}
                          placeholder="What do you want to achieve with LearnFlow AI?"
                        />
                      </div>

                      {/* Email Input (Read Only) */}
                      <div>
                        <label className="block text-sm font-semibold text-[var(--lf-text-secondary)] dark:text-zinc-400 mb-2">Email Address</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Lock className="h-4 w-4 text-[var(--lf-text-secondary)] dark:text-zinc-600" />
                          </div>
                          <input
                            type="email"
                            value={profile?.email || ""}
                            readOnly
                            disabled
                            className="w-full bg-[var(--lf-bg)]/50 dark:bg-zinc-950/50 border border-[var(--lf-border)]/50 dark:border-zinc-800/50 rounded-xl py-3 pl-10 pr-4 text-[var(--lf-text-secondary)] dark:text-zinc-500 cursor-not-allowed"
                          />
                        </div>
                        <p className="text-xs text-[var(--lf-text-secondary)] dark:text-zinc-600 mt-2">Email addresses cannot be changed directly. Contact support if you need assistance.</p>
                      </div>

                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={handleSave}
                      disabled={!hasChanges || !isValid || isSaving}
                      className={`flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg active:scale-95 ${
                        hasChanges && isValid
                          ? "bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/25"
                          : "bg-[var(--lf-surface)] dark:bg-zinc-800 text-[var(--lf-text-secondary)] dark:text-zinc-500 cursor-not-allowed shadow-none"
                      }`}
                    >
                      {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                      {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </div>

              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
