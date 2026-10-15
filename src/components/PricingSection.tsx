import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Check, Sparkles, Zap } from "lucide-react";

export function PricingSection() {
  const [yearly, setYearly] = useState(true);

  const freeFeatures = [
    "Up to 5 document uploads / month",
    "Smart AI text doubt explanations",
    "10 targeted quizzes per week",
    "Essential study notes & summaries",
    "Light & dark theme workspace",
    "Standard community support",
  ];

  const proFeatures = [
    "Unlimited document uploads (PDF, DOCX, PPT)",
    "Interactive visual simulations & entity flows",
    "Dynamic interactive mind maps with graph export",
    "Real-world analogies across diverse relatable styles",
    "Unlimited adaptive AI flash quizzes & QnA",
    "Full student readiness & exam analytics dashboard",
    "High-speed low-latency Groq AI inference",
    "Priority 24/7 student support & early feature access",
  ];

  return (
    <section id="pricing" className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pb-20 scroll-mt-20">
      {/* Header Container */}
      <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-12">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-orange-200 dark:border-orange-900/60 bg-orange-50/70 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 text-xs font-semibold tracking-wide uppercase mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Plans & Pricing</span>
        </div>

        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-stone-900 dark:text-white mb-4">
          Simple, transparent student pricing
        </h2>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-stone-500 dark:text-stone-400 leading-relaxed">
          Invest in your learning clarity. Start completely free and upgrade to Pro whenever you need unlimited simulations and deep mastery tools.
        </p>

        {/* Billing Switcher (Yearly / Monthly) */}
        <div className="mt-8 flex items-center justify-center gap-3 select-none">
          <span
            onClick={() => setYearly(true)}
            className={`text-xs sm:text-sm font-semibold cursor-pointer transition-colors ${
              yearly
                ? "text-stone-900 dark:text-white"
                : "text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300"
            }`}
          >
            Yearly{" "}
            <span className="inline-block ml-1 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400 text-[10.5px] font-bold">
              Save 20%
            </span>
          </span>

          <button
            type="button"
            role="switch"
            aria-checked={!yearly}
            aria-label="Toggle billing frequency"
            onClick={() => setYearly((prev) => !prev)}
            className="relative inline-flex h-7 w-13 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-stone-200 dark:bg-stone-800 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:focus:ring-offset-stone-950"
          >
            <span
              className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-gradient-to-r from-orange-500 to-orange-600 shadow-md ring-0 transition duration-200 ease-in-out ${
                !yearly ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>

          <span
            onClick={() => setYearly(false)}
            className={`text-xs sm:text-sm font-semibold cursor-pointer transition-colors ${
              !yearly
                ? "text-stone-900 dark:text-white"
                : "text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300"
            }`}
          >
            Monthly
          </span>
        </div>
      </div>

      {/* 2-Tier Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
        {/* Tier 1: Free Plan */}
        <div className="relative rounded-3xl border border-stone-200/90 dark:border-stone-800/90 bg-white dark:bg-stone-900/60 p-7 sm:p-9 flex flex-col justify-between hover:border-stone-300 dark:hover:border-stone-700 transition-all duration-300 hover:shadow-lg hover:shadow-stone-900/5">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-white">
                Free
              </h3>
              <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
                Forever Free
              </span>
            </div>

            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mb-6 min-h-[40px]">
              Essential AI study assistant for daily doubt resolution and concept review.
            </p>

            {/* Price figure */}
            <div className="flex items-baseline gap-1.5 mb-7 pb-6 border-b border-stone-100 dark:border-stone-800/80">
              <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-stone-900 dark:text-white">
                ₹0
              </span>
              <span className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
                / forever
              </span>
            </div>

            {/* Feature List */}
            <div className="mb-8">
              <p className="text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-4">
                What's included:
              </p>
              <ul className="space-y-3">
                {freeFeatures.map((feat) => (
                  <li key={feat} className="flex items-start gap-3 text-xs sm:text-sm text-stone-600 dark:text-stone-300">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 mt-0.5">
                      <Check className="h-3 w-3 stroke-[2.5]" />
                    </span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Link
            to="/signup"
            className="w-full text-center py-3 px-4 rounded-xl border border-stone-300 dark:border-stone-700 hover:border-stone-400 dark:hover:border-stone-600 bg-stone-50 hover:bg-stone-100 dark:bg-stone-800/60 dark:hover:bg-stone-800 text-stone-900 dark:text-white text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer"
          >
            Get Started Free
          </Link>
        </div>

        {/* Tier 2: Pro Plan (Featured) */}
        <div className="relative rounded-3xl border-2 border-orange-500 dark:border-orange-500 bg-white dark:bg-stone-900/90 p-7 sm:p-9 flex flex-col justify-between shadow-2xl shadow-orange-500/10 hover:shadow-orange-500/20 transition-all duration-300">
          {/* Ambient Glow */}
          <div className="absolute inset-0 -z-10 rounded-3xl bg-orange-500/5 blur-xl pointer-events-none" />

          {/* Popular Badge */}
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
            <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-bold shadow-md shadow-orange-500/30 uppercase tracking-wider">
              <Zap className="w-3 h-3 fill-current" />
              Most Popular
            </span>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3 pt-1">
              <h3 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-white flex items-center gap-2">
                Pro
                <span className="flex h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
              </h3>
              <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-orange-100 dark:bg-orange-950/70 text-orange-700 dark:text-orange-400">
                Full Power
              </span>
            </div>

            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mb-6 min-h-[40px]">
              Complete access to interactive simulations, mind maps, analogies, and exam analytics.
            </p>

            {/* Price figure */}
            <div className="flex items-baseline gap-1.5 mb-7 pb-6 border-b border-stone-100 dark:border-stone-800/80">
              <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-stone-900 dark:text-white">
                {yearly ? "₹79" : "₹99"}
              </span>
              <span className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
                / month
              </span>
              {yearly && (
                <span className="ml-2 text-[11px] font-medium text-stone-500 dark:text-stone-400">
                  (billed ₹948/yr)
                </span>
              )}
            </div>

            {/* Feature List */}
            <div className="mb-8">
              <p className="text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Everything in Free, plus:
              </p>
              <ul className="space-y-3">
                {proFeatures.map((feat) => (
                  <li key={feat} className="flex items-start gap-3 text-xs sm:text-sm text-stone-700 dark:text-stone-200">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-950/70 text-orange-600 dark:text-orange-400 mt-0.5">
                      <Check className="h-3 w-3 stroke-[2.5]" />
                    </span>
                    <span className="font-medium">{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Link
            to="/signup"
            className="w-full text-center py-3.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-xs sm:text-sm font-bold shadow-lg shadow-orange-500/25 hover:shadow-orange-500/35 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            Upgrade to Pro
          </Link>
        </div>
      </div>

      {/* Guarantee & Trust Footer */}
      <div className="mt-12 text-center text-xs text-stone-500 dark:text-stone-400 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
        <span className="inline-flex items-center gap-1.5">
          🔒 7-day money-back guarantee
        </span>
        <span className="inline-flex items-center gap-1.5">
          ⚡ Instant plan activation
        </span>
        <span className="inline-flex items-center gap-1.5">
          💳 Secure UPI, Cards & NetBanking
        </span>
        <span className="inline-flex items-center gap-1.5">
          ❌ Cancel anytime with 1 click
        </span>
      </div>
    </section>
  );
}

export default PricingSection;
