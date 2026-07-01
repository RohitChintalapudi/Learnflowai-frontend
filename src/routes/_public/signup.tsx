import React, { useState, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react";
import { authStore } from "../../store/authStore";
import toast from "react-hot-toast";

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
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      toast.error("Please fill in all fields.");
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        "http://localhost:3000/api/auth/sign-up/email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          // IMPORTANT: This ensures the session cookie is saved in the browser!
          credentials: "include",
          body: JSON.stringify({
            name: `${firstName} ${lastName}`,
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
    <div className="flex-grow flex items-center justify-center min-h-[calc(100vh-64px)] px-4 py-12 sm:px-6 lg:px-8 relative">
      {/* Container Card with light/dark glassmorphism */}
      <div className="w-full max-w-[480px] bg-white/95 dark:bg-stone-950/95 backdrop-blur-md rounded-2xl border border-brown-200/60 dark:border-stone-800/60 p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.10)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.85)] hover:shadow-[0_30px_80px_rgba(0,0,0,0.12)] transition-all duration-300 transform hover:-translate-y-0.5">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-extrabold tracking-tight text-stone-900 dark:text-white">
            Create Your Account
          </h2>
          <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
            Join{" "}
            <span className="font-semibold text-orange-500 dark:text-orange-400">
              LearnFlow AI
            </span>{" "}
            and start your learning journey
          </p>
        </div>

        {/* Error Message banner if any */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 text-xs border border-red-100 dark:border-red-900/30">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* First Name & Last Name (Side by Side) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="firstName"
                className="block text-xs font-semibold text-stone-600 dark:text-stone-400 uppercase tracking-wider"
              >
                First Name
              </label>
              <div className="relative mt-1.5">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-stone-400 dark:text-stone-500" />
                </div>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                  className="w-full pl-10 pr-3 py-2.5 bg-stone-50/50 dark:bg-stone-900/50 hover:bg-stone-50 dark:hover:bg-stone-900 border border-stone-200 dark:border-stone-800/80 focus:bg-white dark:focus:bg-stone-950 rounded-lg text-sm text-stone-900 dark:text-white placeholder:text-stone-400 dark:placeholder:text-stone-600 focus:outline-none focus:border-orange-500 dark:focus:border-orange-500 focus:ring-2 focus:ring-orange-500/15 dark:focus:ring-orange-500/15 transition-all duration-200"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block text-xs font-semibold text-stone-600 dark:text-stone-400 uppercase tracking-wider"
              >
                Last Name
              </label>
              <div className="relative mt-1.5">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-stone-400 dark:text-stone-500" />
                </div>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name"
                  className="w-full pl-10 pr-3 py-2.5 bg-stone-50/50 dark:bg-stone-900/50 hover:bg-stone-50 dark:hover:bg-stone-900 border border-stone-200 dark:border-stone-800/80 focus:bg-white dark:focus:bg-stone-950 rounded-lg text-sm text-stone-900 dark:text-white placeholder:text-stone-400 dark:placeholder:text-stone-600 focus:outline-none focus:border-orange-500 dark:focus:border-orange-500 focus:ring-2 focus:ring-orange-500/15 dark:focus:ring-orange-500/15 transition-all duration-200"
                  required
                />
              </div>
            </div>
          </div>

          {/* Email field */}
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-semibold text-stone-600 dark:text-stone-400 uppercase tracking-wider"
            >
              Email
            </label>
            <div className="relative mt-1.5">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-stone-400 dark:text-stone-500" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50/50 dark:bg-stone-900/50 hover:bg-stone-50 dark:hover:bg-stone-900 border border-stone-200 dark:border-stone-800/80 focus:bg-white dark:focus:bg-stone-950 rounded-lg text-sm text-stone-900 dark:text-white placeholder:text-stone-400 dark:placeholder:text-stone-600 focus:outline-none focus:border-orange-500 dark:focus:border-orange-500 focus:ring-2 focus:ring-orange-500/15 dark:focus:ring-orange-500/15 transition-all duration-200"
                required
              />
            </div>
          </div>

          {/* Password field */}
          <div>
            <label
              htmlFor="password"
              className="block text-xs font-semibold text-stone-600 dark:text-stone-400 uppercase tracking-wider"
            >
              Password
            </label>
            <div className="relative mt-1.5">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-stone-400 dark:text-stone-500" />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                className="w-full pl-10 pr-10 py-2.5 bg-stone-50/50 dark:bg-stone-900/50 hover:bg-stone-50 dark:hover:bg-stone-900 border border-stone-200 dark:border-stone-800/80 focus:bg-white dark:focus:bg-stone-950 rounded-lg text-sm text-stone-900 dark:text-white placeholder:text-stone-400 dark:placeholder:text-stone-600 focus:outline-none focus:border-orange-500 dark:focus:border-orange-500 focus:ring-2 focus:ring-orange-500/15 dark:focus:ring-orange-500/15 transition-all duration-200"
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
          </div>

          {/* Confirm Password field */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-xs font-semibold text-stone-600 dark:text-stone-400 uppercase tracking-wider"
            >
              Confirm Password
            </label>
            <div className="relative mt-1.5">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-stone-400 dark:text-stone-500" />
              </div>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="w-full pl-10 pr-10 py-2.5 bg-stone-50/50 dark:bg-stone-900/50 hover:bg-stone-50 dark:hover:bg-stone-900 border border-stone-200 dark:border-stone-800/80 focus:bg-white dark:focus:bg-stone-950 rounded-lg text-sm text-stone-900 dark:text-white placeholder:text-stone-400 dark:placeholder:text-stone-600 focus:outline-none focus:border-orange-500 dark:focus:border-orange-500 focus:ring-2 focus:ring-orange-500/15 dark:focus:ring-orange-500/15 transition-all duration-200"
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
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 mt-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 dark:from-orange-500 dark:to-orange-600 dark:hover:from-orange-400 dark:hover:to-orange-600 text-white font-semibold rounded-lg text-sm transition-all duration-200 shadow-sm shadow-orange-500/25 hover:shadow-md hover:shadow-orange-500/35 active:scale-[0.98] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
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
        <div className="mt-6 text-center text-sm text-stone-500 dark:text-stone-400">
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
