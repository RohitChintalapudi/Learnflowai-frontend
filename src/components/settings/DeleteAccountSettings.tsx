import { useState, useEffect } from 'react';
import { SettingsCard, SettingsButton, SettingsInput } from './shared';
import { AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { SettingsAPI } from '../../lib/api';
import toast from 'react-hot-toast';
import { useNavigate } from '@tanstack/react-router';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { authClient } from '../../lib/auth-client';
import { authStore } from '../../store/authStore';
import { HoldToConfirmButton } from '../spectrumui/hold-to-confirm';

export function DeleteAccountSettings() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const { data: account } = useQuery({
    queryKey: ['accountSettings'],
    queryFn: async () => {
      const res = await SettingsAPI.getAccountSettings();
      return res.success ? res.data : null;
    },
  });

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
    if (!showDeleteModal) {
      setPassword('');
      setShowPassword(false);
      setPasswordError('');
    }
  }, [showDeleteModal]);

  const handleDeleteAccount = async () => {
    const isCredentialUser = account?.provider !== 'google';
    if (isCredentialUser && !password) {
      setPasswordError("Password is required.");
      return;
    }

    setIsDeleting(true);
    setPasswordError('');

    try {
      const res = await SettingsAPI.deleteAccount(isCredentialUser ? { password } : {});
      if (res.success) {
        toast.success("Account deleted successfully.");

        await authClient.signOut();
        queryClient.clear();
        authStore.setAuthenticated(false);
        navigate({ to: "/login" });
      }
    } catch (error: any) {
      const errMsg = error.message || "Unable to delete account. Please try again.";
      if (errMsg.toLowerCase().includes("password")) {
        setPasswordError(errMsg);
      } else {
        toast.error(errMsg);
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
          onClick={() => setShowDeleteModal(true)}
        >
          Delete Account
        </SettingsButton>
      </SettingsCard>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white dark:bg-black rounded-2xl w-full max-w-md overflow-hidden shadow-2xl shadow-orange-500/20 border border-orange-500/40"
            >
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

                {account?.provider !== 'google' && (
                  <div className="mt-4 text-left relative">
                    <SettingsInput
                      label="Confirm with Password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (passwordError) setPasswordError('');
                      }}
                      disabled={isDeleting}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-9 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    {passwordError && <p className="text-xs text-red-500 mt-1">{passwordError}</p>}
                  </div>
                )}
              </div>

              <div className="p-4 bg-stone-50 dark:bg-[#111] border-t border-orange-500/20 flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-xs text-stone-500 dark:text-stone-400 text-center sm:text-left order-2 sm:order-1">
                  Hold the button to delete forever
                </p>
                <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end order-1 sm:order-2">
                  <SettingsButton 
                    variant="outline" 
                    onClick={() => setShowDeleteModal(false)}
                    disabled={isDeleting}
                  >
                    Cancel
                  </SettingsButton>
                  <HoldToConfirmButton 
                    label="Delete Forever"
                    holdingLabel="Keep holding..."
                    confirmedLabel="Deleting..."
                    duration={1500}
                    onConfirm={handleDeleteAccount}
                    disabled={isDeleting}
                    variant="danger"
                    size="md"
                    className="font-bold min-w-[150px]"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
