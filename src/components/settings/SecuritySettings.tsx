import React, { useState, useEffect, useRef } from 'react';
import { SettingsCard, SettingsSectionHeader, SettingsButton, SettingsInput } from './shared';
import { Shield, Smartphone, Laptop, CheckCircle2, AlertTriangle, Eye, EyeOff, Loader2 } from 'lucide-react';
import { SettingsAPI } from '../../lib/api';
import toast from 'react-hot-toast';
import { useNavigate } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { authClient } from '../../lib/auth-client';
import { authStore } from '../../store/authStore';

export function SecuritySettings() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errors, setErrors] = useState<{ current?: string; new?: string; confirm?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const currentPasswordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showDeleteModal && !isDeleting) {
        setShowDeleteModal(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [showDeleteModal, isDeleting]);

  useEffect(() => {
    // Auto focus Current Password on mount
    currentPasswordRef.current?.focus();
    // Cleanup on unmount (security requirement)
    return () => {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setErrors({});
    };
  }, []);

  const getPasswordStrength = () => {
    if (!newPassword) return null;
    if (newPassword.length < 8) return 'Weak';
    
    const hasLetters = /[a-zA-Z]/.test(newPassword);
    const hasNumbers = /[0-9]/.test(newPassword);
    const hasUpper = /[A-Z]/.test(newPassword);
    const hasLower = /[a-z]/.test(newPassword);
    const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);

    if (newPassword.length >= 8 && hasUpper && hasLower && hasNumbers && hasSpecial) {
      return 'Strong';
    }
    
    if (newPassword.length >= 8 && hasLetters && hasNumbers) {
      return 'Medium';
    }

    return 'Weak';
  };

  const strength = getPasswordStrength();

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!currentPassword) newErrors.current = "Current password is required.";
    
    if (!newPassword) newErrors.new = "New password is required.";
    else if (newPassword.length < 8) newErrors.new = "New password must be at least 8 characters.";
    
    if (!confirmPassword) newErrors.confirm = "Please confirm your new password.";
    else if (confirmPassword !== newPassword) newErrors.confirm = "Passwords do not match.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isLoading) return;
    if (!validate()) return;

    setIsLoading(true);
    setErrors({});
    
    try {
      const res = await SettingsAPI.changePassword({ currentPassword, newPassword, confirmPassword });
      if (res.success) {
        toast.success(res.message || "Password updated successfully.");
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setShowCurrent(false);
        setShowNew(false);
        setShowConfirm(false);
      }
    } catch (error: any) {
      const message = error.message;
      if (message.toLowerCase().includes("current password is incorrect")) {
        setErrors({ current: "Current password is incorrect." });
      } else {
        toast.error(message || "Unable to update password. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      setDeleteError("Password is required.");
      return;
    }
    
    setIsDeleting(true);
    setDeleteError('');

    try {
      const res = await SettingsAPI.deleteAccount({ password: deletePassword });
      if (res.success) {
        toast.success("Account deleted successfully.");
        
        await authClient.signOut();
        queryClient.clear();
        authStore.setAuthenticated(false);
        navigate({ to: "/login" });
      }
    } catch (error: any) {
      if (error.message.toLowerCase().includes("invalid password")) {
        setDeleteError("Invalid password.");
      } else {
        toast.error("Unable to delete account. Please try again.");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="w-full space-y-8">
      {/* Change Password Card */}
      <SettingsCard>
        <SettingsSectionHeader 
          title="Change Password" 
          description="Update your password to keep your account secure." 
        />
        
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md mb-8">
          <div className="relative">
            <SettingsInput 
              label="Current Password"
              type={showCurrent ? "text" : "password"} 
              placeholder="Enter current password" 
              value={currentPassword}
              onChange={(e) => {
                setCurrentPassword(e.target.value);
                if (errors.current) setErrors(prev => ({ ...prev, current: undefined }));
              }}
              onKeyDown={handleKeyDown}
              ref={currentPasswordRef}
              disabled={isLoading}
            />
            <button 
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 top-9 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300"
            >
              {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            {errors.current && <p className="text-xs text-red-500 mt-1">{errors.current}</p>}
          </div>
          
          <div className="relative">
            <SettingsInput 
              label="New Password"
              type={showNew ? "text" : "password"} 
              placeholder="Enter new password" 
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                if (errors.new) setErrors(prev => ({ ...prev, new: undefined }));
              }}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />
            <button 
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-9 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300"
            >
              {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            {errors.new && <p className="text-xs text-red-500 mt-1">{errors.new}</p>}
          </div>

          <div className="relative">
            <SettingsInput 
              label="Confirm Password"
              type={showConfirm ? "text" : "password"} 
              placeholder="Confirm new password" 
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirm) setErrors(prev => ({ ...prev, confirm: undefined }));
              }}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />
            <button 
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-9 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300"
            >
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            {errors.confirm && <p className="text-xs text-red-500 mt-1">{errors.confirm}</p>}
          </div>

          {/* Password Strength Meter */}
          {newPassword && (
            <div className="pt-2">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-stone-500">
                  Password Strength: <strong className={
                    strength === 'Strong' ? 'text-green-500' : 
                    strength === 'Medium' ? 'text-orange-500' : 
                    'text-red-500'
                  }>{strength}</strong>
                </span>
              </div>
              <div className="flex gap-1 h-1.5 w-full rounded-full overflow-hidden bg-stone-100 dark:bg-[#2A2A2A]">
                <div className={`h-full rounded-full ${
                  strength === 'Strong' ? 'bg-green-500 w-1/3' : 
                  strength === 'Medium' ? 'bg-orange-500 w-1/3' : 
                  'bg-red-500 w-1/3'
                }`} />
                <div className={`h-full rounded-full ${
                  strength === 'Strong' ? 'bg-green-500 w-1/3' : 
                  strength === 'Medium' ? 'bg-orange-500 w-1/3 opacity-50' : 
                  'bg-stone-200 dark:bg-[#333] w-1/3'
                }`} />
                <div className={`h-full rounded-full ${
                  strength === 'Strong' ? 'bg-green-500 w-1/3' : 
                  'bg-stone-200 dark:bg-[#333] w-1/3'
                }`} />
              </div>
            </div>
          )}

          <div className="pt-2">
            <SettingsButton 
              variant="primary" 
              className="font-bold w-full sm:w-auto"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Password"
              )}
            </SettingsButton>
          </div>
        </form>
      </SettingsCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Two-Factor Authentication */}
        <SettingsCard>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-500/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-green-600 dark:text-green-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-900 dark:text-white">Two-Factor Auth</h3>
              <p className="text-sm text-stone-500">Add an extra layer of security</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-stone-50 dark:bg-[#1A1A1A] rounded-lg border border-stone-200 dark:border-[#2A2A2A] w-fit mb-6">
            <CheckCircle2 className="w-4 h-4 text-stone-400" />
            <span className="text-sm font-medium text-stone-600 dark:text-stone-400">Currently Disabled</span>
          </div>
          <SettingsButton variant="outline" className="w-full justify-center text-sm font-semibold">
            Enable 2FA
          </SettingsButton>
        </SettingsCard>

        {/* Active Devices */}
        <SettingsCard>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center">
              <Laptop className="w-5 h-5 text-blue-600 dark:text-blue-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-900 dark:text-white">Active Devices</h3>
              <p className="text-sm text-stone-500">Manage where you're logged in</p>
            </div>
          </div>
          
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Laptop className="w-4 h-4 text-stone-400" />
                <div>
                  <p className="text-sm font-medium text-stone-900 dark:text-white">MacBook Pro - Chrome</p>
                  <p className="text-xs text-green-500 font-medium">Current Session</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="w-4 h-4 text-stone-400" />
                <div>
                  <p className="text-sm font-medium text-stone-900 dark:text-white">iPhone 14 Pro - Safari</p>
                  <p className="text-xs text-stone-500">Last active: 2 hours ago</p>
                </div>
              </div>
              <button className="text-xs font-semibold text-red-500 hover:text-red-600">Revoke</button>
            </div>
          </div>
          
          <SettingsButton variant="outline" className="w-full justify-center text-sm font-semibold text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900/30 dark:hover:bg-red-900/20">
            Sign Out All Other Devices
          </SettingsButton>
        </SettingsCard>
      </div>

      {/* Recent Login Activity */}
      <SettingsCard>
        <SettingsSectionHeader title="Recent Login Activity" />
        <div className="overflow-hidden rounded-xl border border-stone-100 dark:border-[#2A2A2A] bg-stone-50/50 dark:bg-[#1A1A1A]">
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-100/50 dark:bg-[#222] border-b border-stone-200 dark:border-[#2A2A2A]">
              <tr>
                <th className="px-4 py-3 font-semibold text-stone-600 dark:text-stone-300">Device</th>
                <th className="px-4 py-3 font-semibold text-stone-600 dark:text-stone-300">Location</th>
                <th className="px-4 py-3 font-semibold text-stone-600 dark:text-stone-300">Date & Time</th>
                <th className="px-4 py-3 font-semibold text-stone-600 dark:text-stone-300">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-[#2A2A2A]">
              <tr>
                <td className="px-4 py-3 text-stone-900 dark:text-white">MacBook Pro (Mac OS)</td>
                <td className="px-4 py-3 text-stone-500">San Francisco, CA</td>
                <td className="px-4 py-3 text-stone-500">Today, 2:45 PM</td>
                <td className="px-4 py-3 text-green-500 font-medium">Success</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-stone-900 dark:text-white">iPhone 14 Pro (iOS)</td>
                <td className="px-4 py-3 text-stone-500">San Francisco, CA</td>
                <td className="px-4 py-3 text-stone-500">Yesterday, 9:12 AM</td>
                <td className="px-4 py-3 text-green-500 font-medium">Success</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-stone-900 dark:text-white">Unknown Device</td>
                <td className="px-4 py-3 text-stone-500">Seattle, WA</td>
                <td className="px-4 py-3 text-stone-500">Oct 10, 4:30 AM</td>
                <td className="px-4 py-3 text-red-500 font-medium flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Failed
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </SettingsCard>

      {/* Danger Zone */}
      <SettingsCard className="border-red-200 dark:border-red-900/30 bg-red-50/30 dark:bg-red-950/10">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-500/10 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-500" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-red-600 dark:text-red-500">Delete Account</h3>
          </div>
        </div>
        <p className="text-sm text-stone-600 dark:text-stone-400 mb-6 max-w-2xl">
          Deleting your account permanently removes your profile, documents, notes, quizzes, learning history, analytics, simulations, interview questions, and all associated data.
          <br /><br />
          <strong className="text-red-600 dark:text-red-400">This action cannot be undone.</strong>
        </p>
        <SettingsButton 
          variant="danger" 
          className="font-bold"
          onClick={() => {
            setDeletePassword('');
            setDeleteError('');
            setShowDeleteModal(true);
          }}
        >
          Delete Account
        </SettingsButton>
      </SettingsCard>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-stone-200 dark:border-[#2A2A2A]">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-500/10 flex items-center justify-center mb-4 mx-auto">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-center text-stone-900 dark:text-white mb-2">Delete Account?</h3>
              <p className="text-sm text-center text-stone-500 dark:text-stone-400 mb-6">
                This action is permanent.<br/>
                All of your LearnFlow data will be permanently deleted.<br/>
                This action cannot be undone.
              </p>
              
              <div className="space-y-4">
                <div className="relative">
                  <SettingsInput 
                    label="Please enter your password to confirm:"
                    type={showDeletePassword ? "text" : "password"} 
                    placeholder="Enter your password" 
                    value={deletePassword}
                    onChange={(e) => {
                      setDeletePassword(e.target.value);
                      if (deleteError) setDeleteError('');
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleDeleteAccount();
                      }
                    }}
                    disabled={isDeleting}
                    autoFocus
                  />
                  <button 
                    type="button"
                    onClick={() => setShowDeletePassword(!showDeletePassword)}
                    className="absolute right-3 top-9 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300"
                  >
                    {showDeletePassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  {deleteError && <p className="text-xs text-red-500 mt-1">{deleteError}</p>}
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-stone-50 dark:bg-[#222] border-t border-stone-200 dark:border-[#2A2A2A] flex justify-end gap-3">
              <SettingsButton 
                variant="outline" 
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
              >
                Cancel
              </SettingsButton>
              <SettingsButton 
                variant="danger" 
                onClick={handleDeleteAccount}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete Forever"
                )}
              </SettingsButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
