import React, { useState, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react";
import { authStore } from "../../store/authStore";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../../lib/auth-client";

export const Route = createFileRoute("/_public/signup")({
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Add custom scrollbar hiding class on mount
    document.documentElement.classList.add("no-scrollbar");
    document.body.classList.add("no-scrollbar");

    return () => {
      // Remove class on unmount
      document.documentElement.classList.remove("no-scrollbar");
      document.body.classList.remove("no-scrollbar");
    };
  }, []);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<{ password?: string; confirm?: string }>({});
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getPasswordStrength = () => {
    if (!password) return null;
    if (password.length < 8) return "Weak";

    const hasLetters = /[a-zA-Z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);

    if (password.length >= 8 && hasUpper && hasLower && hasNumbers && hasSpecial) {
      return "Strong";
    }

    if (password.length >= 8 && hasLetters && hasNumbers) {
      return "Medium";
    }

    return "Weak";
  };

  const strength = getPasswordStrength();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPasswordErrors({});

    if (!firstName || !email || !password || !confirmPassword) {
      toast.error("Please fill in all required fields.");
      setError("Please fill in all required fields.");
      return;
    }

    const newPasswordErrors: { password?: string; confirm?: string } = {};

    if (password.length < 8) {
      newPasswordErrors.password = "Password must be at least 8 characters long.";
    } else if (password.length > 64) {
      newPasswordErrors.password = "Password cannot exceed 64 characters.";
    } else if (!/[A-Z]/.test(password)) {
      newPasswordErrors.password = "Password must contain at least one uppercase letter.";
    } else if (!/[a-z]/.test(password)) {
      newPasswordErrors.password = "Password must contain at least one lowercase letter.";
    } else if (!/[0-9]/.test(password)) {
      newPasswordErrors.password = "Password must contain at least one number.";
    }

    if (password !== confirmPassword) {
      newPasswordErrors.confirm = "Passwords do not match.";
    }

    if (newPasswordErrors.password || newPasswordErrors.confirm) {
      setPasswordErrors(newPasswordErrors);
      const firstError = newPasswordErrors.password || newPasswordErrors.confirm;
      toast.error(firstError!);
      setError(firstError!);
      return;
    }

    setIsLoading(true);

    try {
          const fullName = lastName.trim()
            ? `${firstName.trim()} ${lastName.trim()}`
            : firstName.trim();

          const response = await fetch(
            `${BACKEND_URL}/api/auth/sign-up/email`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              // IMPORTANT: This ensures the session cookie is saved in the browser!
              credentials: "include",
              body: JSON.stringify({
                name: fullName,
                email: email,
                password: password,
              }),
            },
          );

      const data = await response.json();

      if (!response.ok) {
        // Backend returns validation or "user already exists" errors here
        throw new Error(data.message || "Sign up failed");
      }

      console.log("Sign up successful!", data);
      authStore.setAuthenticated(true);
      if (data && data.user) {
        localStorage.setItem("lf_user_name", data.user.name || "");
        localStorage.setItem("lf_user_image", data.user.image || "");
      }
      toast.success("Account created successfully!");
      navigate({ to: "/dashboard" });
    } catch (err: any) {
      console.error("Error during sign up:", err.message);
      toast.error(err.message || "An error occurred during sign up.");
      setError(err.message || "An error occurred during sign up.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center min-h-[calc(100vh-64px)] px-4 py-3 sm:py-5 relative">
      {/* Container Card with light/dark glassmorphism */}
      <div className="w-full max-w-[415px] sm:max-w-[425px] bg-white/95 dark:bg-stone-950/95 backdrop-blur-md rounded-2xl border border-brown-200/60 dark:border-stone-800/60 p-5 sm:p-6 shadow-[0_15px_35px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.7)] hover:shadow-[0_20px_45px_rgba(0,0,0,0.12)] transition-all duration-300 transform hover:-translate-y-0.5">
        {/* Header */}
        <div className="text-center mb-4">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 dark:text-white">
            Create Your Account
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-stone-500 dark:text-stone-400">
            Join{" "}
            <span className="font-semibold text-orange-500 dark:text-orange-400">
              LearnFlow AI
            </span>{" "}
            and start your learning journey
          </p>
        </div>

        {/* Error Message banner if any */}
        {error && (
          <div className="mb-3 p-2.5 rounded-lg bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 text-xs border border-red-100 dark:border-red-900/30">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* First Name & Last Name (Side by Side) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label
                htmlFor="firstName"
                className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400 uppercase tracking-wider"
              >
                First Name
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-stone-400 dark:text-stone-500" />
                </div>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                  autoComplete="given-name"
                  className="w-full pl-9 pr-3 py-2 bg-stone-50/50 dark:bg-stone-900/50 hover:bg-stone-50 dark:hover:bg-stone-900 border border-stone-200 dark:border-stone-800/80 focus:bg-white dark:focus:bg-stone-950 rounded-lg text-xs sm:text-sm text-stone-900 dark:text-white placeholder:text-stone-400 dark:placeholder:text-stone-600 focus:outline-none focus:border-orange-500 dark:focus:border-orange-500 focus:ring-2 focus:ring-orange-500/15 dark:focus:ring-orange-500/15 transition-all duration-200"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400 uppercase tracking-wider"
              >
                Last Name <span className="text-stone-400 dark:text-stone-500 font-normal lowercase">(optional)</span>
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-stone-400 dark:text-stone-500" />
                </div>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name"
                  autoComplete="family-name"
                  className="w-full pl-9 pr-3 py-2 bg-stone-50/50 dark:bg-stone-900/50 hover:bg-stone-50 dark:hover:bg-stone-900 border border-stone-200 dark:border-stone-800/80 focus:bg-white dark:focus:bg-stone-950 rounded-lg text-xs sm:text-sm text-stone-900 dark:text-white placeholder:text-stone-400 dark:placeholder:text-stone-600 focus:outline-none focus:border-orange-500 dark:focus:border-orange-500 focus:ring-2 focus:ring-orange-500/15 dark:focus:ring-orange-500/15 transition-all duration-200"
                />
              </div>
            </div>
          </div>

          {/* Email field */}
          <div>
            <label
              htmlFor="email"
              className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400 uppercase tracking-wider"
            >
              Email
            </label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-stone-400 dark:text-stone-500" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                autoComplete="username"
                className="w-full pl-9 pr-4 py-2 bg-stone-50/50 dark:bg-stone-900/50 hover:bg-stone-50 dark:hover:bg-stone-900 border border-stone-200 dark:border-stone-800/80 focus:bg-white dark:focus:bg-stone-950 rounded-lg text-xs sm:text-sm text-stone-900 dark:text-white placeholder:text-stone-400 dark:placeholder:text-stone-600 focus:outline-none focus:border-orange-500 dark:focus:border-orange-500 focus:ring-2 focus:ring-orange-500/15 dark:focus:ring-orange-500/15 transition-all duration-200"
                required
              />
            </div>
          </div>

          {/* Password field */}
          <div>
            <label
              htmlFor="password"
              className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400 uppercase tracking-wider"
            >
              Password
            </label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-stone-400 dark:text-stone-500" />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordErrors.password) setPasswordErrors((prev) => ({ ...prev, password: undefined }));
                  if (error) setError(null);
                }}
                placeholder="Create a password"
                autoComplete="new-password"
                className={`w-full pl-9 pr-9 py-2 bg-stone-50/50 dark:bg-stone-900/50 hover:bg-stone-50 dark:hover:bg-stone-900 border ${
                  passwordErrors.password
                    ? "border-red-400 dark:border-red-500 focus:border-red-500 focus:ring-red-500/15"
                    : "border-stone-200 dark:border-stone-800/80 focus:border-orange-500 dark:focus:border-orange-500 focus:ring-orange-500/15 dark:focus:ring-orange-500/15"
                } focus:bg-white dark:focus:bg-stone-950 rounded-lg text-xs sm:text-sm text-stone-900 dark:text-white placeholder:text-stone-400 dark:placeholder:text-stone-600 focus:outline-none focus:ring-2 transition-all duration-200`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600 dark:text-stone-500 dark:hover:text-stone-400 focus:outline-none transition-colors duration-200"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {passwordErrors.password && (
              <p className="text-xs text-red-500 dark:text-red-400 mt-1">{passwordErrors.password}</p>
            )}

            {/* Password Strength Meter */}
            {password && (
              <div className="pt-1.5">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[11px] font-medium text-stone-500 dark:text-stone-400">
                    Password Strength:{" "}
                    <strong
                      className={
                        strength === "Strong"
                          ? "text-emerald-500"
                          : strength === "Medium"
                          ? "text-orange-500"
                          : "text-red-500"
                      }
                    >
                      {strength}
                    </strong>
                  </span>
                </div>
                <div className="flex gap-1 h-1 w-full rounded-full overflow-hidden bg-stone-100 dark:bg-[#2A2A2A]">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      strength === "Strong"
                        ? "bg-emerald-500 w-1/3"
                        : strength === "Medium"
                        ? "bg-orange-500 w-1/3"
                        : "bg-red-500 w-1/3"
                    }`}
                  />
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      strength === "Strong"
                        ? "bg-emerald-500 w-1/3"
                        : strength === "Medium"
                        ? "bg-orange-500 w-1/3 opacity-50"
                        : "bg-stone-200 dark:bg-[#333] w-1/3"
                    }`}
                  />
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      strength === "Strong"
                        ? "bg-emerald-500 w-1/3"
                        : "bg-stone-200 dark:bg-[#333] w-1/3"
                    }`}
                  />
                </div>

                {/* Requirements Checklist */}
                <div className="grid grid-cols-2 gap-1 mt-2 text-[10.5px]">
                  <span
                    className={`flex items-center gap-1.5 transition-colors ${
                      password.length >= 8
                        ? "text-emerald-600 dark:text-emerald-400 font-medium"
                        : "text-stone-400 dark:text-stone-500"
                    }`}
                  >
                    <span
                      className={`inline-block w-1.5 h-1.5 rounded-full transition-colors ${
                        password.length >= 8 ? "bg-emerald-500" : "bg-stone-300 dark:bg-stone-700"
                      }`}
                    />
                    8+ characters
                  </span>
                  <span
                    className={`flex items-center gap-1.5 transition-colors ${
                      /[A-Z]/.test(password)
                        ? "text-emerald-600 dark:text-emerald-400 font-medium"
                        : "text-stone-400 dark:text-stone-500"
                    }`}
                  >
                    <span
                      className={`inline-block w-1.5 h-1.5 rounded-full transition-colors ${
                        /[A-Z]/.test(password) ? "bg-emerald-500" : "bg-stone-300 dark:bg-stone-700"
                      }`}
                    />
                    1 uppercase letter
                  </span>
                  <span
                    className={`flex items-center gap-1.5 transition-colors ${
                      /[a-z]/.test(password)
                        ? "text-emerald-600 dark:text-emerald-400 font-medium"
                        : "text-stone-400 dark:text-stone-500"
                    }`}
                  >
                    <span
                      className={`inline-block w-1.5 h-1.5 rounded-full transition-colors ${
                        /[a-z]/.test(password) ? "bg-emerald-500" : "bg-stone-300 dark:bg-stone-700"
                      }`}
                    />
                    1 lowercase letter
                  </span>
                  <span
                    className={`flex items-center gap-1.5 transition-colors ${
                      /[0-9]/.test(password)
                        ? "text-emerald-600 dark:text-emerald-400 font-medium"
                        : "text-stone-400 dark:text-stone-500"
                    }`}
                  >
                    <span
                      className={`inline-block w-1.5 h-1.5 rounded-full transition-colors ${
                        /[0-9]/.test(password) ? "bg-emerald-500" : "bg-stone-300 dark:bg-stone-700"
                      }`}
                    />
                    1 number
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password field */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400 uppercase tracking-wider"
            >
              Confirm Password
            </label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-stone-400 dark:text-stone-500" />
              </div>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (passwordErrors.confirm) setPasswordErrors((prev) => ({ ...prev, confirm: undefined }));
                  if (error) setError(null);
                }}
                placeholder="Confirm your password"
                autoComplete="new-password"
                className={`w-full pl-9 pr-9 py-2 bg-stone-50/50 dark:bg-stone-900/50 hover:bg-stone-50 dark:hover:bg-stone-900 border ${
                  passwordErrors.confirm
                    ? "border-red-400 dark:border-red-500 focus:border-red-500 focus:ring-red-500/15"
                    : "border-stone-200 dark:border-stone-800/80 focus:border-orange-500 dark:focus:border-orange-500 focus:ring-orange-500/15 dark:focus:ring-orange-500/15"
                } focus:bg-white dark:focus:bg-stone-950 rounded-lg text-xs sm:text-sm text-stone-900 dark:text-white placeholder:text-stone-400 dark:placeholder:text-stone-600 focus:outline-none focus:ring-2 transition-all duration-200`}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600 dark:text-stone-500 dark:hover:text-stone-400 focus:outline-none transition-colors duration-200"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {passwordErrors.confirm ? (
              <p className="text-xs text-red-500 dark:text-red-400 mt-1">{passwordErrors.confirm}</p>
            ) : confirmPassword && password ? (
              confirmPassword === password ? (
                <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium">✓ Passwords match</p>
              ) : (
                <p className="text-xs text-red-500 dark:text-red-400 mt-1">Passwords do not match</p>
              )
            ) : null}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 mt-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 dark:from-orange-500 dark:to-orange-600 dark:hover:from-orange-400 dark:hover:to-orange-600 text-white font-semibold rounded-lg text-xs sm:text-sm transition-all duration-200 shadow-sm shadow-orange-500/25 hover:shadow-md hover:shadow-orange-500/35 active:scale-[0.98] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Creating account...</span>
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-4 text-center text-xs sm:text-sm text-stone-500 dark:text-stone-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:underline transition-colors"
          >
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
}
