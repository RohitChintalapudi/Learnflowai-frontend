import { useState, useEffect, useRef } from 'react';
import { SettingsCard, SettingsSectionHeader, SettingsButton, SettingsInput } from './shared';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { SettingsAPI } from '../../lib/api';
import toast from 'react-hot-toast';

export function SecuritySettings() {

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errors, setErrors] = useState<{ current?: string; new?: string; confirm?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const currentPasswordRef = useRef<HTMLInputElement>(null);

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



  return (
    <div className="w-full space-y-8">
      <div className="max-w-xl mx-auto w-full">
        {/* Change Password Card */}
        <SettingsCard>
          <SettingsSectionHeader 
            title="Change Password" 
            description="Update your password to keep your account secure." 
          />
          
          <form onSubmit={handleSubmit} className="space-y-4 w-full mb-8">
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
      </div>
    </div>
  );
}
