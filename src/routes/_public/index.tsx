import { useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Sparkles,
  ArrowRight,
  Star,
  GraduationCap,
  BookOpen,
  Zap,
  Trophy,
  Brain,
  HelpCircle,
  FlaskConical,
  StickyNote,
  Map,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import { TextMorph } from "../../components/TextMorph";

export const Route = createFileRoute("/_public/")({
  component: HomePage,
});

type FeatureId = "ai" | "quiz" | "notes" | "sim" | "roadmap";

const statsData = [
  { icon: GraduationCap, value: "100+", label: "Active Learners" },
  { icon: BookOpen, value: "500+", label: "Topics Covered" },
  { icon: Zap, value: "Real-Time", label: "Learning Assistant" },
  { icon: Trophy, value: "95%", label: "Learner Satisfaction" },
];

const featureSections = [
  {
    id: "ai" as FeatureId,
    icon: Brain,
    title: "Smart Learning",
    desc: "Structured content with AI-powered explanations tailored to your pace.",
  },
  {
    id: "quiz" as FeatureId,
    icon: HelpCircle,
    title: "Interactive Quizzes & Interview QnA",
    desc: "Test your knowledge with quizzes and get instant AI feedback.",
  },
  {
    id: "sim" as FeatureId,
    icon: FlaskConical,
    title: "Real-time Simulations",
    desc: "Visualize complex concepts with interactive simulations.",
  },
  {
    id: "notes" as FeatureId,
    icon: StickyNote,
    title: "Notes & Flashcards",
    desc: "Create, organize, and revisit notes that stick with you.",
  },
  {
    id: "roadmap" as FeatureId,
    icon: Map,
    title: "Learning Roadmap",
    desc: "Follow a personalized path and track your progress.",
  },
];

const studentReviews = [
  {
    name: "Aarav Sharma",
    role: "CS Undergrad @ IIT Delhi",
    text: "The dynamic programming breakdowns are unmatched. Instead of just giving the memoized recurrence relation, the AI walked through the subproblem decision tree step-by-step. Went from dreading DP in LeetCode to actually understanding the state transitions.",
    rating: 5.0,
  },
  {
    name: "Elena Rostova",
    role: "Software Engineering Sophomore @ TU Munich",
    text: "Operating Systems virtual memory was completely confusing until I used the memory paging simulator here. Seeing dirty bits and page faults animate in real-time made everything click. Rated 4.5 only because I'm eagerly waiting for cache hierarchy simulations!",
    rating: 4.5,
  },
  {
    name: "Marcus Vance",
    role: "Junior @ Georgia Tech",
    text: "Genuinely replaces scouring 40-minute YouTube lectures for a 2-minute concept. The doubt clarification is razor-sharp on Computer Networks—especially TCP sliding windows and CIDR subnetting calculations. Super solid study companion.",
    rating: 4.0,
  },
  {
    name: "Priya Sundaram",
    role: "CS Senior @ BITS Pilani",
    text: "I used the AI quiz generator right before my Database Systems end-semester exam. It generated tricky B+ Tree insertion edge cases and ACID isolation level scenarios that literally showed up on my test paper.",
    rating: 5.0,
  },
  {
    name: "Devon Miller",
    role: "CS Student @ Oregon State",
    text: "The step-by-step doubt resolution doesn't just vomit code—it forces you to think through time complexity and edge cases. It feels like having a patient university TA available at 2 AM the night before deadlines.",
    rating: 4.5,
  },
  {
    name: "Chloe Zhang",
    role: "ECE & CS Junior @ UIUC",
    text: "System design and distributed systems concepts like Raft consensus and consistent hashing were always abstract in lecture slides. LearnFlow's interactive walkthroughs broke down leader election effortlessly.",
    rating: 5.0,
  },
  {
    name: "Rohan Mukherjee",
    role: "Pre-final Year @ NIT Trichy",
    text: "Hands down the best tool for untangling Graph algorithms (Dijkstra vs Bellman-Ford negative cycles). The interactive visualization made edge relaxations visually intuitive. Looking forward to even more roadmap topics!",
    rating: 4.0,
  },
  {
    name: "Maya Patel",
    role: "CS Senior @ University of Washington",
    text: "Mock interview prep with the AI assistant felt so natural. It pointed out subtle memory leaks in my C++ pointer manipulation that standard linters didn't flag. Helped me land my summer SWE internship!",
    rating: 5.0,
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((pos) => {
          if (rating >= pos) {
            return (
              <Star
                key={pos}
                className="h-4 w-4 fill-orange-400 text-orange-400 shrink-0"
              />
            );
          }
          if (rating >= pos - 0.5) {
            return (
              <div key={pos} className="relative h-4 w-4 shrink-0">
                <Star className="h-4 w-4 text-stone-300 dark:text-stone-700" />
                <div className="absolute inset-0 overflow-hidden w-1/2">
                  <Star className="h-4 w-4 fill-orange-400 text-orange-400" />
                </div>
              </div>
            );
          }
          return (
            <Star
              key={pos}
              className="h-4 w-4 text-stone-300 dark:text-stone-700 shrink-0"
            />
          );
        })}
      </div>
      <span className="text-xs font-semibold text-stone-700 dark:text-stone-300">
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

function HomePage() {
  const handleExploreFeatures = () => {
    const target = document.getElementById("features");
    if (target) {
      const offset = 76;
      const y = Math.max(0, target.getBoundingClientRect().top + window.scrollY - offset);
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  useEffect(() => {
    // One-time scroll on initial mount if page URL contains a hash
    const hash = window.location.hash.replace("#", "");
    if (hash) {
      const timer = setTimeout(() => {
        const target = document.getElementById(hash);
        if (target) {
          const offset = 76;
          const y = Math.max(0, target.getBoundingClientRect().top + window.scrollY - offset);
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="flex flex-col w-full bg-white dark:bg-black relative overflow-hidden">
      {/* Orange glows in zigzag — avoiding laptop area on right */}
      <div className="absolute top-[-5%] left-[-10%] w-[500px] h-[500px] bg-orange-500/25 dark:bg-orange-500/15 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute top-[15%] right-[-8%] w-[400px] h-[400px] bg-orange-500/15 dark:bg-orange-500/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-[40%] left-[-8%] w-[450px] h-[450px] bg-orange-500/25 dark:bg-orange-500/15 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-[60%] right-[-5%] w-[350px] h-[350px] bg-orange-500/15 dark:bg-orange-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[5%] left-[-5%] w-[400px] h-[400px] bg-orange-500/20 dark:bg-orange-500/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-[30%] left-[20%] w-[300px] h-[300px] bg-orange-500/15 dark:bg-orange-500/10 blur-[100px] rounded-full pointer-events-none" />

      {/* HERO SECTION */}
      <section id="about-us" className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-24 sm:pt-16 pb-12 -mt-20 flex flex-col xl:flex-row items-center gap-16 xl:gap-24 lg:gap-12 relative z-10 scroll-mt-20">
        {/* Left Copy */}
        <div className="flex-1 flex flex-col items-start w-full max-w-[500px] xl:w-[500px] xl:shrink-0 xl:scale-[1.1] lg:scale-100 scale-100 origin-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-orange-200 dark:border-orange-900/60 bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 text-xs font-semibold mb-6">
            <Sparkles className="h-3.5 w-3.5 shrink-0" />
            <span>Instant AI Doubt Clarification & Explanations</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.08] text-stone-900 dark:text-white mb-4 max-w-xl">
            <span className="block whitespace-nowrap">Learn Smarter.</span>
            <span className="flex items-center gap-2 whitespace-nowrap">
              <span>Understand</span>{" "}
              <TextMorph
                prefix=""
                words={["Better.", "Faster.", "Deeper."]}
                interval={2600}
                className="text-orange-500 dark:text-orange-400 inline-flex shrink-0 whitespace-nowrap"
                charClassName="text-orange-500 dark:text-orange-400"
              />
            </span>
          </h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed mb-6 max-w-[420px]">
            Highlight core text inside your study PDFs to instantly launch smart
            AI chats, quiz cards, and network protocol simulations inside the
            workspace.
          </p>
          <div className="flex flex-wrap gap-2.5 mb-8">
            <Link
              to="/signup"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold text-xs shadow-lg shadow-orange-500/25 transition-all duration-200"
            >
              Start Learning for Free <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <button
              onClick={handleExploreFeatures}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-semibold text-xs hover:bg-stone-100 dark:hover:bg-stone-900/50 transition-all duration-200 cursor-pointer"
            >
              Explore Features <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {["#f97316", "#ea580c", "#c2410c"].map((bg, i) => (
                <div
                  key={i}
                  className="h-7 w-7 rounded-full border-2 border-white dark:border-stone-900 flex items-center justify-center text-white text-[10px] font-bold"
                  style={{ backgroundColor: bg, zIndex: 3 - i }}
                >
                  {["A", "B", "C"][i]}
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-0.5">
              <div className="flex gap-0.5">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Star
                      key={i}
                      className="h-3 w-3 fill-orange-400 text-orange-400"
                    />
                  ))}
              </div>
              <span className="text-[11px] text-stone-500 dark:text-stone-400">
                Loved by 1000+ CS students
              </span>
            </div>
          </div>
        </div>

        {/* Right — Theme-Aware Laptop Mockup Images */}
        <div className="flex-[2] xl:flex-1 flex items-center justify-center w-full min-h-[200px] sm:min-h-[300px] md:min-h-[380px] overflow-visible xl:justify-end xl:pl-12 lg:pl-10 lg:-mr-0 xl:-mr-16">
          <div className="relative w-full">
            <img
              src="/light_theme_laptop.png"
              alt="LearnFlow AI on laptop"
              className="w-full h-auto block dark:hidden -mt-4"
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
            <img
              src="/dark_theme_laptop.png"
              alt="LearnFlow AI on laptop"
              className="w-full h-auto hidden dark:block"
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-1 -mt-[50px] sm:-mt-[90px] lg:-mt-[120px] relative z-20">
        <div className="grid grid-cols-1 min-[500px]:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsData.map((s) => (
            <div key={s.label} className="flex items-center gap-4 px-6 py-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/40">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-50 dark:bg-orange-950/40">
                <s.icon className="h-4.5 w-4.5 text-orange-500 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-lg font-extrabold text-stone-900 dark:text-white whitespace-nowrap">
                  {s.value}
                </p>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                  {s.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES ZIGZAG SECTION */}
      <section id="features" className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 scroll-mt-20">
        <div className="w-full mb-12">
          <div className="relative h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent mb-12" />
        </div>
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold tracking-tight text-stone-900 dark:text-white mb-4">
            Features We Provide
          </h2>
          <p className="text-lg text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
            Everything you need to master Computer Science with AI-powered tools
            designed for deep understanding.
          </p>
        </div>
        <div className="space-y-24">
          {featureSections.map((f, idx) => {
            const isLeft = idx % 2 === 0;

            const card = (
              <div
                key={f.title}
                className="group relative cursor-pointer"
              >
                {/* Glow effect on hover */}
                <div
                  className="absolute inset-0 rounded-3xl blur-2xl transition-all duration-500 bg-orange-500/0 opacity-0 group-hover:bg-orange-500/20 group-hover:opacity-100"
                />

                <div className="relative flex flex-col gap-4 p-6 sm:p-8 rounded-3xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-orange-500/50 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-orange-500/10">
                  {/* Icon container */}
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 dark:bg-orange-950/40">
                    <f.icon className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>

                  {/* Title and description */}
                  <div>
                    <h3 className="text-xl font-bold text-stone-900 dark:text-white mb-2">
                      {f.title}
                    </h3>
                    <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                      {f.desc}
                    </p>
                  </div>

                  {/* Interactive CTA */}
                  <div className="pt-4">
                    <Link
                      to="/signup"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold shadow-md shadow-orange-500/30 transition-all duration-300"
                    >
                      Explore<span className="hidden sm:inline">&nbsp;{f.title}</span> <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            );

            const description = (
              <div
                key={`desc-${f.title}`}
                className="flex flex-col justify-center gap-5"
              >
                {/* Left accent line */}
                <div className="relative pl-6 sm:pl-8">
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-orange-500 rounded-full" />

                  <div className="space-y-6">
                    <div>
                      <p className="text-lg font-bold text-stone-900 dark:text-white mb-3">
                        Why choose {f.title}?
                      </p>
                      <div className="text-base text-stone-600 dark:text-stone-400 leading-relaxed">
                        {f.title === "Smart Learning" &&
                          "Get structured explanations tailored to your specific pace. Our AI breaks down complex topics into bite-sized, understandable modules."}
                        {f.title === "Interactive Quizzes & Interview QnA" && (
                          <div className="space-y-4">
                            <p>
                              Reinforce your knowledge with active recall. Our
                              AI generates dynamic quizzes and interview
                              scenarios that adapt to your performance.
                            </p>
                            <ul className="space-y-2 mt-4 text-sm font-medium text-stone-700 dark:text-stone-300">
                              <li className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />{" "}
                                Topic-specific interactive quizzes
                              </li>
                              <li className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />{" "}
                                Mock technical interviews
                              </li>
                              <li className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />{" "}
                                Instant AI-driven feedback
                              </li>
                            </ul>
                          </div>
                        )}
                        {f.title === "Real-time Simulations" &&
                          "Don't just read about it, see it happen. Visualize network protocols and algorithms with interactive tools that make abstract concepts concrete."}
                        {f.title === "Notes & Flashcards" &&
                          "Effortlessly organize your study material. Create smart notes and flashcards that help you retain what you learn through spaced repetition."}
                        {f.title === "Learning Roadmap" &&
                          "Follow a proven path to mastery. Track your progress across your entire curriculum with a clear, personalized roadmap that keeps you on track."}
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="h-2.5 w-2.5 rounded-full bg-orange-500 shrink-0 mt-2" />
                      <p className="text-sm text-stone-500 dark:text-stone-400 font-medium">
                        Built to accelerate your CS learning journey.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );

            const cardEl = <div className="order-1 lg:order-none w-full">{card}</div>;
            const descEl = <div className="order-2 lg:order-none w-full">{description}</div>;

            return (
              <div
                key={f.title}
                className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center"
              >
                {isLeft ? (
                  <>
                    {cardEl}
                    {descEl}
                  </>
                ) : (
                  <>
                    {descEl}
                    {cardEl}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* SEPARATOR LINE */}
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
        <div className="relative h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
      </div>

      {/* REVIEWS CAROUSEL SECTION */}
      <section id="why-students-love-us" className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pb-16 scroll-mt-20">
        <div id="blog" className="sr-only" aria-hidden="true" />
        <div id="students-love" className="sr-only" aria-hidden="true" />
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 dark:text-white mb-2">
            Why Students Love Us
          </h2>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            Join thousands of CS learners who've transformed their understanding
          </p>
        </div>

        <div
          className="flex overflow-hidden group pb-4 -mx-6 sm:-mx-8 lg:-mx-12"
          style={{
            maskImage:
              "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
          }}
        >
          {/* Track 1 */}
          <div className="flex animate-marquee shrink-0 min-w-full gap-5 pr-5 items-stretch">
            {studentReviews.map((review, idx) => (
              <div key={`review-1-${idx}`} className="flex-shrink-0 w-80">
                <div className="relative rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/50 p-6 h-full overflow-hidden group/card hover:border-orange-400 dark:hover:border-orange-600 transition-all duration-300 flex flex-col justify-between">
                  <div className="absolute inset-0 rounded-2xl blur-2xl transition-all duration-500 bg-orange-500/0 group-hover/card:bg-orange-500/10 opacity-0 group-hover/card:opacity-100" />
                  <div className="relative z-10 space-y-4">
                    <StarRating rating={review.rating} />
                    <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                      "{review.text}"
                    </p>
                  </div>
                  <div className="relative z-10 flex items-center gap-3 pt-4 mt-4 border-t border-stone-200 dark:border-stone-800">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-stone-900 dark:text-white">
                        {review.name}
                      </p>
                      <p className="text-[10px] text-stone-500 dark:text-stone-400">
                        {review.role}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Track 2 */}
          <div
            className="flex animate-marquee shrink-0 min-w-full gap-5 pr-5 items-stretch"
            aria-hidden="true"
          >
            {studentReviews.map((review, idx) => (
              <div key={`review-2-${idx}`} className="flex-shrink-0 w-80">
                <div className="relative rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/50 p-6 h-full overflow-hidden group/card hover:border-orange-400 dark:hover:border-orange-600 transition-all duration-300 flex flex-col justify-between">
                  <div className="absolute inset-0 rounded-2xl blur-2xl transition-all duration-500 bg-orange-500/0 group-hover/card:bg-orange-500/10 opacity-0 group-hover/card:opacity-100" />
                  <div className="relative z-10 space-y-4">
                    <StarRating rating={review.rating} />
                    <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                      "{review.text}"
                    </p>
                  </div>
                  <div className="relative z-10 flex items-center gap-3 pt-4 mt-4 border-t border-stone-200 dark:border-stone-800">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-stone-900 dark:text-white">
                        {review.name}
                      </p>
                      <p className="text-[10px] text-stone-500 dark:text-stone-400">
                        {review.role}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEPARATOR LINE */}
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
        <div className="relative h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
      </div>

      {/* CTA BANNER SECTION */}
      <section id="careers" className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pb-24">
        <div className="flex flex-col items-center justify-center text-center gap-6 px-8 py-16 md:py-20 rounded-3xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/40 relative overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#f9731615_1px,transparent_1px),linear-gradient(to_bottom,#f9731615_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-[150%] bg-orange-500/10 dark:bg-orange-500/5 blur-[120px] pointer-events-none" />

          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-orange-100 dark:bg-orange-950/60 shadow-inner mb-2">
            <Sparkles className="h-7 w-7 text-orange-500 dark:text-orange-400" />
          </div>
          <div>
            <h3 className="text-3xl md:text-4xl font-extrabold text-stone-900 dark:text-white mb-4">
              Ready to begin your learning journey?
            </h3>
            <p className="text-base text-stone-500 dark:text-stone-400 max-w-xl mx-auto">
              Join thousands of students and master computer science concepts
              with absolute clarity through interactive simulations and smart AI
              tools.
            </p>
          </div>
          <Link
            to="/signup"
            className="mt-4 inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-base shadow-xl shadow-orange-500/20 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            Get Started for Free <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
