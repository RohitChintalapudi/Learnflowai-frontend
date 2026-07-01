import { useState, useEffect } from 'react';
import { SettingsCard, SettingsButton, SettingsInput } from './shared';
import { AlertTriangle, Eye, EyeOff, Loader2 } from 'lucide-react';
import { SettingsAPI } from '../../lib/api';
import toast from 'react-hot-toast';
import { useNavigate } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { authClient } from '../../lib/auth-client';
import { authStore } from '../../store/authStore';

export function DeleteAccountSettings() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showDeleteModal && !isDeleting) {
        setShowDeleteModal(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [showDeleteModal, isDeleting]);

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
    <div className="w-full">
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
