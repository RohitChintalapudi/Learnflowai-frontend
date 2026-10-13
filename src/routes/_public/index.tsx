import { useState, useRef, useEffect } from "react";
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
  Send,
  CheckCircle2,
  Circle,
  BarChart3,
  MessageSquare,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight as ChevronR,
  RotateCcw,
  X,
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

// Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡
// AI CHAT SCREEN
// Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡
const aiResponses: Record<string, string> = {
  default:
    "That's a great question! Let me break it down for you with a clear explanation.",
  tcp: "TCP uses a 3-step process: (1) Client sends SYN, (2) Server replies SYN-ACK, (3) Client sends ACK. Connection established! â‰¡Æ’Ã±Â¥",
  syn: "The SYN (Synchronize) packet is the first step in the TCP handshake. The client sends a random sequence number (e.g., seq=100) to initiate communication.",
  synack:
    "The SYN-ACK packet is sent by the server. It acknowledges the client's SYN (ack=101) and sends its own SYN parameter (seq=200).",
  ack: "The ACK (Acknowledge) packet is sent by the client. It acknowledges the server's SYN-ACK (ack=201) to finalize connection setup.",
  http: "HTTP (HyperText Transfer Protocol) is the foundation of data communication on the web. It's a request-response protocol between client and server.",
  "big-o":
    "Big-O notation describes algorithm efficiency. O(1) = constant, O(n) = linear, O(log n) = logarithmic. Always aim for the lowest complexity! â‰¡Æ’Ã´Ã¨",
  array:
    "Arrays store elements in contiguous memory. Access is O(1) by index, but insertion/deletion at middle is O(n). Perfect for fixed-size data! â‰¡Æ’Ã¹Ã¢âˆ©â••Ã…",
  recursion:
    "Recursion is when a function calls itself. Every recursive solution needs a base case to stop! Think of it like Russian nesting dolls â‰¡Æ’Â¬Ã¥",
  "linked list":
    "A linked list is a chain of nodes where each node holds data and a pointer to the next. O(1) insert at head, O(n) search.",
  stack:
    "A Stack is a Last-In, First-Out (LIFO) data structure. The last element added is the first one removed. Standard operations are Push and Pop. â‰¡Æ’Ã‘â‚§",
  roadmap:
    "Mastering computer science requires a solid roadmap. We recommend starting with fundamentals, moving to DSA, then network sockets! â‰¡Æ’Ã¹â•‘âˆ©â••Ã…",
};

function getAIResponse(input: string): string {
  const lower = input.toLowerCase();
  for (const [key, response] of Object.entries(aiResponses)) {
    if (key !== "default" && lower.includes(key)) return response;
  }
  return aiResponses.default;
}

interface ScreenAIProps {
  aiTriggerQuery: string | null;
  onQueryTriggered: () => void;
}

function ScreenAI({ aiTriggerQuery, onQueryTriggered }: ScreenAIProps) {
  const [messages, setMessages] = useState([
    {
      from: "ai",
      text: "Hi Ananya! â‰¡Æ’Ã¦Ã¯ Ask me anything about CS Î“Ã‡Ã¶ TCP, algorithms, data structures, HTTP...",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll INSIDE the container only
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing]);

  // Process parent trigger queries
  useEffect(() => {
    if (aiTriggerQuery) {
      const text = aiTriggerQuery;
      onQueryTriggered(); // Clear in parent
      setMessages((m) => [...m, { from: "user", text }]);
      setTyping(true);
      const t = setTimeout(() => {
        setTyping(false);
        setMessages((m) => [...m, { from: "ai", text: getAIResponse(text) }]);
      }, 900);
      return () => clearTimeout(t);
    }
  }, [aiTriggerQuery]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    setMessages((m) => [...m, { from: "user", text }]);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((m) => [...m, { from: "ai", text: getAIResponse(text) }]);
    }, 900);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-black rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-800">
      <div className="flex items-center gap-1.5 px-2.5 py-1.5 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-black shrink-0">
        <MessageSquare className="h-3 w-3 text-orange-500" />
        <span className="text-[8.5px] font-bold text-stone-900 dark:text-white">
          AI Assistant
        </span>
        <span className="ml-auto text-[6.5px] text-emerald-600 dark:text-emerald-500 font-medium flex items-center gap-1">
          <span className="h-1 w-1 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
          Online
        </span>
      </div>
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-2 py-2 space-y-2 bg-stone-50/50 dark:bg-black"
        style={{ height: 140 }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}
          >
            {m.from === "ai" && (
              <div className="h-3.5 w-3.5 rounded-full bg-orange-100 dark:bg-orange-950 flex items-center justify-center mr-1 mt-0.5 shrink-0">
                <Brain className="h-2 w-2 text-orange-600 dark:text-orange-500" />
              </div>
            )}
            <div
              className={`text-[7.5px] px-2 py-1.5 rounded-xl max-w-[82%] leading-relaxed ${
                m.from === "user"
                  ? "bg-orange-500 text-white rounded-br-none font-sans font-medium shadow-sm"
                  : "bg-white dark:bg-stone-900 text-stone-800 dark:text-white rounded-bl-none shadow-sm border border-stone-200 dark:border-stone-700"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex items-center gap-1">
            <div className="h-3.5 w-3.5 rounded-full bg-orange-100 dark:bg-orange-950 flex items-center justify-center mr-1 shrink-0">
              <Brain className="h-2 w-2 text-orange-600 dark:text-orange-500" />
            </div>
            <div className="bg-white dark:bg-stone-900 px-2 py-1 rounded-xl rounded-bl-none flex gap-1 items-center shadow-sm border border-stone-200 dark:border-stone-700">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-0.5 w-0.5 rounded-full bg-stone-300 dark:bg-stone-400 animate-bounce"
                  style={{ animationDelay: `${i * 150}ms` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center gap-1 px-2 py-1 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-black shrink-0">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ask: explain TCP, stacks..."
          className="flex-1 text-[7.5px] px-1.5 py-1 rounded bg-white dark:bg-stone-900 text-stone-900 dark:text-white placeholder:text-stone-400 dark:placeholder:text-stone-600 outline-none border border-stone-200 dark:border-stone-700 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
        />
        <button
          onClick={send}
          className="flex h-5 w-5 items-center justify-center rounded bg-orange-500 hover:bg-orange-600 transition-colors"
        >
          <Send className="h-2.5 w-2.5 text-white" />
        </button>
      </div>
    </div>
  );
}

// Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡
// QUIZ SCREEN
// Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡
const quizQuestions = [
  {
    q: "In TCP 3-Way Handshake, what does the server send after receiving SYN?",
    options: ["SYN only", "SYN-ACK", "ACK only", "FIN"],
    correct: 1,
    explain:
      "The server responds with SYN-ACK to acknowledge the client's SYN and send its own.",
  },
  {
    q: "Which data structure uses LIFO (Last In, First Out)?",
    options: ["Queue", "Heap", "Stack", "Tree"],
    correct: 2,
    explain:
      "A Stack follows LIFO Î“Ã‡Ã¶ the last element pushed is the first one popped.",
  },
  {
    q: "What is the time complexity of binary search?",
    options: ["O(n)", "O(nâ”¬â–“)", "O(log n)", "O(1)"],
    correct: 2,
    explain:
      "Binary search halves the search space each step Î“Ã‡Ã¶ O(log n) complexity.",
  },
  {
    q: "Which HTTP method is used to send data to a server?",
    options: ["GET", "DELETE", "HEAD", "POST"],
    correct: 3,
    explain:
      "POST sends data to the server, typically to create a new resource.",
  },
];

interface ScreenQuizProps {
  quizTriggerIdx: number;
  onQuizTriggered: () => void;
}

function ScreenQuiz({ quizTriggerIdx, onQuizTriggered }: ScreenQuizProps) {
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const q = quizQuestions[qIdx];

  useEffect(() => {
    if (quizTriggerIdx !== null && quizTriggerIdx !== undefined) {
      setQIdx(quizTriggerIdx);
      setSelected(null);
      setDone(false);
      onQuizTriggered();
    }
  }, [quizTriggerIdx]);

  const choose = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    if (i === q.correct) setScore((s) => s + 1);
  };

  const next = () => {
    if (qIdx + 1 >= quizQuestions.length) {
      setDone(true);
      return;
    }
    setQIdx((n) => n + 1);
    setSelected(null);
  };

  const reset = () => {
    setQIdx(0);
    setSelected(null);
    setScore(0);
    setDone(false);
  };

  if (done)
    return (
      <div className="flex flex-col items-center justify-center h-full gap-2 px-3 text-center">
        <Trophy className="h-6 w-6 text-orange-500" />
        <p className="text-[8.5px] font-bold text-stone-800 dark:text-white leading-tight">
          Quiz Complete!
        </p>
        <p className="text-[7.5px] text-stone-500 dark:text-stone-400">
          You scored{" "}
          <span className="font-bold text-orange-500">
            {score}/{quizQuestions.length}
          </span>
        </p>
        <div className="w-20 bg-stone-100 dark:bg-stone-800 rounded-full h-1 my-1">
          <div
            className="bg-gradient-to-r from-orange-400 to-orange-600 h-1 rounded-full transition-all"
            style={{ width: `${(score / quizQuestions.length) * 100}%` }}
          />
        </div>
        <button
          onClick={reset}
          className="flex items-center gap-1 text-[7px] px-2.5 py-1 rounded bg-orange-500 text-white hover:bg-orange-600 transition-colors"
        >
          <RotateCcw className="h-2 w-2" /> Retry
        </button>
      </div>
    );

  return (
    <div className="flex flex-col h-full px-2.5 py-1.5 bg-white dark:bg-black rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm dark:shadow-none">
      <div className="flex items-center gap-1.5 mb-1.5 border-b border-stone-200 dark:border-stone-800 pb-1.5 shrink-0">
        <HelpCircle className="h-3 w-3 text-orange-500" />
        <span className="text-[8.5px] font-bold text-stone-900 dark:text-white">
          Quizzes & Interview QnA
        </span>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="text-[6.5px] text-emerald-600 dark:text-emerald-500 font-medium">
            Score: {score}
          </span>
          <span className="text-[6.5px] text-stone-600 dark:text-stone-400 bg-stone-100 dark:bg-stone-900 px-1 py-0.5 rounded-full font-mono">
            Q{qIdx + 1}/{quizQuestions.length}
          </span>
        </div>
      </div>
      <p className="text-[8px] font-semibold text-stone-800 dark:text-white mb-2 leading-snug">
        {q.q}
      </p>
      <div
        className="space-y-1 overflow-y-auto pr-1"
        style={{ maxHeight: 105 }}
      >
        {q.options.map((opt, i) => {
          const isSelected = selected === i;
          const isCorrect = i === q.correct;
          const show = selected !== null;
          return (
            <button
              key={i}
              onClick={() => choose(i)}
              className={`w-full text-left text-[7px] px-2 py-1 rounded-lg border transition-all flex items-center gap-1.5 ${
                show
                  ? isCorrect
                    ? "border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 font-medium"
                    : isSelected
                      ? "border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400"
                      : "border-stone-200 dark:border-stone-800 text-stone-400 dark:text-stone-600 opacity-40"
                  : "border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-orange-400 dark:hover:border-orange-500 hover:bg-stone-50 dark:hover:bg-stone-900 cursor-pointer bg-white dark:bg-transparent"
              }`}
            >
              {show && isCorrect ? (
                <CheckCircle2 className="h-2 w-2 text-emerald-500 shrink-0" />
              ) : (
                <Circle className="h-2 w-2 text-stone-600 shrink-0" />
              )}
              <span className="truncate">{opt}</span>
            </button>
          );
        })}
      </div>
      {selected !== null && (
        <div className="mt-1 pb-1 shrink-0">
          <p className="text-[6.5px] text-stone-400 italic mb-1">
            â‰¡Æ’Ã†Ã­ {q.explain}
          </p>
          <button
            onClick={next}
            className="w-full text-[7.5px] py-1 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-semibold transition-colors"
          >
            {qIdx + 1 >= quizQuestions.length
              ? "Results Î“Ã¥Ã†"
              : "Next Question Î“Ã¥Ã†"}
          </button>
        </div>
      )}
    </div>
  );
}

// Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡
// NOTES SCREEN
// Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡
function ScreenNotes() {
  const [notes, setNotes] = useState([
    {
      id: 1,
      title: "TCP Handshake",
      tag: "Networking",
      body: "SYN Î“Ã¥Ã† SYN-ACK Î“Ã¥Ã† ACK. Establishes reliable connection between client and server.",
    },
    {
      id: 2,
      title: "OSI Model",
      tag: "Networking",
      body: "7 layers: Physical, Data Link, Network, Transport, Session, Presentation, Application.",
    },
    {
      id: 3,
      title: "Big-O Cheat",
      tag: "DSA",
      body: "O(1) constant â”¬â•– O(log n) logarithmic â”¬â•– O(n) linear â”¬â•– O(nâ”¬â–“) quadratic.",
    },
  ]);
  const [open, setOpen] = useState<number | null>(null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [newMode, setNewMode] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");

  const openNote = notes.find((n) => n.id === open);

  if (newMode)
    return (
      <div className="flex flex-col h-full px-2.5 py-1.5">
        <div className="flex items-center gap-1.5 mb-1.5 border-b border-stone-100 dark:border-stone-800 pb-1.5 shrink-0">
          <button
            onClick={() => setNewMode(false)}
            className="text-stone-400 hover:text-stone-600"
          >
            <X className="h-3 w-3" />
          </button>
          <span className="text-[8.5px] font-bold text-stone-700 dark:text-stone-300">
            New Note
          </span>
          <button
            onClick={() => {
              if (newTitle.trim()) {
                setNotes((n) => [
                  ...n,
                  {
                    id: Date.now(),
                    title: newTitle,
                    tag: "My Notes",
                    body: newBody,
                  },
                ]);
                setNewMode(false);
                setNewTitle("");
                setNewBody("");
              }
            }}
            className="ml-auto text-[7px] px-1.5 py-0.5 rounded bg-emerald-500 text-white font-medium"
          >
            Save
          </button>
        </div>
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Title..."
          className="text-[8px] font-semibold text-stone-800 dark:text-white bg-transparent outline-none border-b border-stone-200 dark:border-stone-700 pb-1 mb-1.5 w-full"
        />
        <textarea
          value={newBody}
          onChange={(e) => setNewBody(e.target.value)}
          placeholder="Write something..."
          className="flex-1 text-[7.5px] text-stone-600 dark:text-stone-400 bg-transparent outline-none resize-none leading-normal"
        />
      </div>
    );

  if (open !== null && openNote)
    return (
      <div className="flex flex-col h-full px-2.5 py-1.5">
        <div className="flex items-center gap-1.5 mb-1.5 border-b border-stone-100 dark:border-stone-800 pb-1.5 shrink-0">
          <button
            onClick={() => {
              setOpen(null);
              setEditing(false);
            }}
            className="text-stone-400 hover:text-stone-600"
          >
            <ChevronLeft className="h-3 w-3" />
          </button>
          <span className="text-[8.5px] font-bold text-stone-700 dark:text-stone-300 truncate max-w-[80px]">
            {openNote.title}
          </span>
          <div className="ml-auto flex gap-1 items-center">
            {editing ? (
              <button
                onClick={() => {
                  setNotes((n) =>
                    n.map((x) => (x.id === open ? { ...x, body: draft } : x)),
                  );
                  setEditing(false);
                }}
                className="text-[7px] px-1.5 py-0.5 rounded bg-emerald-500 text-white"
              >
                Save
              </button>
            ) : (
              <button
                onClick={() => {
                  setDraft(openNote.body);
                  setEditing(true);
                }}
                className="text-[7px] px-1.5 py-0.5 rounded border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400"
              >
                Edit
              </button>
            )}
            <button
              onClick={() => {
                setNotes((n) => n.filter((x) => x.id !== open));
                setOpen(null);
              }}
              className="text-red-400 hover:text-red-500"
            >
              <Trash2 className="h-2.5 w-2.5" />
            </button>
          </div>
        </div>
        <span className="text-[6.5px] text-emerald-500 font-semibold mb-1 block shrink-0">
          {openNote.tag}
        </span>
        <div className="flex-1 overflow-y-auto">
          {editing ? (
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="w-full h-full text-[7.5px] text-stone-750 dark:text-stone-300 bg-stone-50 dark:bg-stone-900 rounded p-1 outline-none resize-none border border-stone-200 dark:border-stone-700 leading-normal"
            />
          ) : (
            <p className="text-[7.5px] text-stone-600 dark:text-stone-400 leading-normal font-sans">
              {openNote.body}
            </p>
          )}
        </div>
      </div>
    );

  return (
    <div className="flex flex-col h-full bg-white dark:bg-black rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm dark:shadow-none">
      <div className="flex items-center gap-1.5 px-2.5 py-1.5 border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-black rounded-t-2xl shrink-0">
        <StickyNote className="h-3 w-3 text-orange-500" />
        <span className="text-[8.5px] font-bold text-stone-900 dark:text-white">
          Smart Notes
        </span>
        <button
          onClick={() => setNewMode(true)}
          className="ml-auto flex items-center gap-0.5 text-[6.5px] px-1.5 py-0.5 rounded bg-orange-600 text-white hover:bg-orange-700 transition-colors"
        >
          <Plus className="h-2 w-2" /> New
        </button>
      </div>
      <div
        className="flex-1 overflow-y-auto px-2 py-2 space-y-1 bg-white dark:bg-black"
        style={{ maxHeight: 145 }}
      >
        {notes.map((n) => (
          <button
            key={n.id}
            onClick={() => setOpen(n.id)}
            className="w-full text-left px-2 py-1.5 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 hover:border-orange-500 dark:hover:border-orange-600 transition-colors block shadow-sm"
          >
            <div className="flex items-center justify-between mb-0.5">
              <p className="text-[8px] font-bold text-stone-900 dark:text-white truncate max-w-[90px]">
                {n.title}
              </p>
              <span className="text-[5.5px] px-1 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400 shrink-0">
                {n.tag}
              </span>
            </div>
            <p className="text-[7px] text-stone-500 dark:text-stone-400 line-clamp-1">
              {n.body}
            </p>
          </button>
        ))}
        {notes.length === 0 && (
          <p className="text-[7.5px] text-stone-600 text-center py-6">
            No notes yet.
          </p>
        )}
      </div>
    </div>
  );
}

// Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡
// SIMULATION SCREEN
// Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡
const simSteps = [
  {
    label: "SYN Sent (seq=100)",
    detail: "SYN",
    from: "client",
    color: "bg-blue-500",
    info: "Client initiates connection with SYN.",
  },
  {
    label: "SYN-ACK Received (ack=101)",
    detail: "SYN-ACK",
    from: "server",
    color: "bg-orange-500",
    info: "Server replies acknowledging SYN.",
  },
  {
    label: "ACK Confirmed (ack=201)",
    detail: "ACK",
    from: "client",
    color: "bg-emerald-500",
    info: "Client finishes. Sockets connected! â‰¡Æ’Ã±Â¥",
  },
];

interface ScreenSimProps {
  simStep: number;
  onSimStepChange: (s: number) => void;
}

function ScreenSim({ simStep, onSimStepChange }: ScreenSimProps) {
  const [step, setStep] = useState(-1);
  const [playing, setPlaying] = useState(false);

  // Sync with prop
  useEffect(() => {
    setStep(simStep);
  }, [simStep]);

  useEffect(() => {
    if (!playing) return;
    if (step >= simSteps.length - 1) {
      setPlaying(false);
      return;
    }
    const t = setTimeout(() => {
      const nextStep = step + 1;
      setStep(nextStep);
      onSimStepChange(nextStep);
    }, 1200);
    return () => clearTimeout(t);
  }, [playing, step]);

  const start = () => {
    setStep(-1);
    onSimStepChange(-1);
    setPlaying(true);
    setTimeout(() => {
      setStep(0);
      onSimStepChange(0);
    }, 300);
  };
  const reset = () => {
    setStep(-1);
    onSimStepChange(-1);
    setPlaying(false);
  };

  return (
    <div className="flex flex-col h-full px-2.5 py-1.5 bg-white dark:bg-black rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm dark:shadow-none">
      <div className="flex items-center gap-1 mb-1.5 border-b border-stone-200 dark:border-stone-800 pb-1.5 shrink-0">
        <FlaskConical className="h-3 w-3 text-orange-500" />
        <span className="text-[8.5px] font-bold text-stone-900 dark:text-white">
          TCP Handshake Demo
        </span>
      </div>

      <div className="flex items-start justify-between mb-1.5 px-1 font-mono text-[6.5px]">
        {/* Client */}
        <div className="flex flex-col items-center">
          <div className="px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950 border border-blue-250 text-blue-600 dark:text-blue-400 font-bold">
            CLIENT
          </div>
          <div
            className="w-0.5 bg-stone-200 dark:bg-stone-750"
            style={{ height: 60 }}
          />
        </div>

        {/* Packet flow lines */}
        <div className="flex-1 mx-2 space-y-1.5 pt-4">
          {simSteps.map((s, i) => (
            <div
              key={i}
              className={`transition-all duration-350 ${i <= step ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"}`}
            >
              <div
                className={`flex items-center gap-1 ${s.from === "client" ? "flex-row" : "flex-row-reverse"}`}
              >
                <span
                  className={`text-[5.5px] font-bold text-white px-1 rounded ${s.color} shrink-0`}
                >
                  {s.detail}
                </span>
                <div
                  className={`flex-1 h-px ${i <= step ? s.color : "bg-stone-200"}`}
                />
                <span>{s.from === "client" ? "Î“Ã¥Ã†" : "Î“Ã¥Ã‰"}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Server */}
        <div className="flex flex-col items-center">
          <div className="px-1.5 py-0.5 rounded bg-orange-50 dark:bg-orange-950 border border-orange-250 text-orange-600 dark:text-orange-400 font-bold">
            SERVER
          </div>
          <div
            className="w-0.5 bg-stone-200 dark:bg-stone-750"
            style={{ height: 60 }}
          />
        </div>
      </div>

      {step >= 0 && (
        <div className="text-[6.5px] text-stone-600 dark:text-stone-400 bg-white dark:bg-stone-850 rounded p-1.5 border border-stone-150 dark:border-stone-800 mb-1 leading-normal shadow-sm">
          {simSteps[step].info}
        </div>
      )}

      <div className="flex gap-1.5 mt-auto">
        {!playing && step < 0 && (
          <button
            onClick={start}
            className="flex-1 text-[7px] py-1 rounded bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-colors"
          >
            Î“Ã»â•¢ Auto Play
          </button>
        )}
        {(playing || step >= 0) && (
          <>
            {!playing && step < simSteps.length - 1 && (
              <button
                onClick={() => {
                  const ns = step + 1;
                  setStep(ns);
                  onSimStepChange(ns);
                }}
                className="flex-1 text-[7px] py-1 rounded bg-blue-500 text-white font-semibold transition-colors hover:bg-blue-600"
              >
                Next Step
              </button>
            )}
            <button
              onClick={reset}
              className="flex items-center justify-center gap-0.5 text-[7px] px-2 py-1 rounded border border-stone-200 dark:border-stone-700 text-stone-650 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              <RotateCcw className="h-2 w-2" /> Reset
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡
// ROADMAP SCREEN
// Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡
const roadmapItems = [
  {
    title: "Programming Fundamentals",
    subtopics: ["Variables & Loops", "OOP"],
    initProgress: 100,
  },
  {
    title: "Data Structures",
    subtopics: ["Arrays", "Stacks & Queues"],
    initProgress: 100,
  },
  {
    title: "Algorithms",
    subtopics: ["Binary Search", "Recursion"],
    initProgress: 65,
  },
  {
    title: "Computer Networks",
    subtopics: ["OSI Layers", "TCP Handshake"],
    initProgress: 30,
  },
];

function ScreenRoadmap() {
  const [progress, setProgress] = useState(() =>
    roadmapItems.map((r) => r.initProgress),
  );
  const [selected, setSelected] = useState<number | null>(null);
  const total = Math.round(
    progress.reduce((a, b) => a + b, 0) / progress.length,
  );

  return (
    <div className="flex flex-col h-full bg-white dark:bg-black rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm dark:shadow-none">
      <div className="flex items-center gap-1 px-2.5 py-1.5 border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-black rounded-t-2xl shrink-0">
        <Map className="h-3 w-3 text-rose-500" />
        <span className="text-[8.5px] font-bold text-stone-900 dark:text-white">
          Roadmap
        </span>
        <div className="ml-auto flex items-center gap-0.5">
          <BarChart3 className="h-2 w-2 text-orange-500" />
          <span className="text-[7.5px] text-orange-500 font-bold">
            {total}% Done
          </span>
        </div>
      </div>
      <div
        className="flex-1 overflow-y-auto px-2 py-1.5 space-y-1"
        style={{ maxHeight: 145 }}
      >
        {roadmapItems.map((item, i) => {
          const p = progress[i];
          const done = p === 100;
          const active = p > 0 && p < 100;
          const isOpen = selected === i;
          return (
            <div
              key={i}
              className="rounded border border-stone-100 dark:border-stone-850 overflow-hidden bg-white dark:bg-stone-900 shadow-sm"
            >
              <button
                onClick={() => setSelected(isOpen ? null : i)}
                className="w-full flex items-center gap-1.5 px-2 py-1.5 hover:bg-stone-50 dark:hover:bg-stone-800/40 transition-colors"
              >
                <div
                  className={`h-3 w-3 rounded-full flex items-center justify-center border shrink-0 ${done ? "bg-emerald-500 border-emerald-500" : active ? "bg-orange-500 border-orange-500" : "border-stone-300 dark:border-stone-600"}`}
                >
                  {done && <CheckCircle2 className="h-2 w-2 text-white" />}
                  {active && <div className="h-1 w-1 rounded-full bg-white" />}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between">
                    <p
                      className={`text-[7.5px] font-bold truncate ${done ? "text-emerald-600 dark:text-emerald-400" : active ? "text-orange-550" : "text-stone-500"}`}
                    >
                      {item.title}
                    </p>
                    <span className="text-[6px] text-stone-400 ml-1">{p}%</span>
                  </div>
                </div>
                <ChevronR
                  className={`h-2.5 w-2.5 text-stone-400 transition-transform ${isOpen ? "rotate-90" : ""}`}
                />
              </button>
              {isOpen && (
                <div className="border-t border-stone-100 dark:border-stone-800 px-2 py-1.5 bg-stone-50/50 dark:bg-stone-900/30">
                  <div className="grid grid-cols-2 gap-1 mb-1.5">
                    {item.subtopics.map((sub) => (
                      <div
                        key={sub}
                        className="flex items-center gap-0.5 text-[6.5px] text-stone-500"
                      >
                        <Circle className="h-1 w-1 text-stone-300 shrink-0" />
                        {sub}
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() =>
                        setProgress((pr) => {
                          const n = [...pr];
                          n[i] = Math.min(100, n[i] + 35);
                          return n;
                        })
                      }
                      disabled={p === 100}
                      className="flex-1 text-[6.5px] py-0.5 rounded bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-40 transition-colors"
                    >
                      Advance
                    </button>
                    <button
                      onClick={() =>
                        setProgress((pr) => {
                          const n = [...pr];
                          n[i] = 0;
                          return n;
                        })
                      }
                      className="text-[6.5px] px-1 py-0.5 rounded border border-stone-200 dark:border-stone-700 text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-850 transition-colors"
                    >
                      <RotateCcw className="h-1.5 w-1.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡
// DEFAULT DASHBOARD SCREEN
// Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡
export function ScreenDashboard() {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-white dark:bg-[#111] p-3 text-center">
      <div className="h-7 w-7 rounded bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center mb-1.5 shadow-sm shadow-orange-500/20">
        <Sparkles className="h-4.5 w-4.5 text-white" />
      </div>
      <p className="text-[9.5px] font-bold text-stone-800 dark:text-white mb-0.5">
        Welcome to LearnFlow AI
      </p>
      <p className="text-[7.5px] text-stone-500 dark:text-stone-400 max-w-[160px] leading-relaxed mb-2">
        Click on any orange-highlighted term in the PDF to view interactive
        simulations and quiz challenges instantly.
      </p>
      <div className="inline-flex items-center gap-1 text-[7px] text-orange-500 bg-orange-50 dark:bg-orange-950/40 px-2 py-0.5 rounded font-medium border border-orange-100 dark:border-orange-900/30">
        Highlighter Active Î“Â£Ã…âˆ©â••Ã…
      </div>
    </div>
  );
}

interface ScreenPDFProps {
  highlightedKeyword: string | null;
  onKeywordClick: (keyword: string) => void;
}

export function ScreenPDF({ highlightedKeyword, onKeywordClick }: ScreenPDFProps) {
  const keywords = [
    { key: "tcp", label: "TCP 3-Way Handshake" },
    { key: "syn", label: "SYN" },
    { key: "synack", label: "SYN-ACK" },
    { key: "ack", label: "ACK" },
    { key: "bigo", label: "Big-O notation" },
    { key: "stack", label: "Stacks (LIFO)" },
  ];

  return (
    <div className="h-full bg-stone-100 dark:bg-stone-950 text-stone-900 dark:text-stone-100 overflow-y-auto p-3">
      <div className="rounded-3xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm p-4 space-y-3">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-[9px] font-semibold text-stone-800 dark:text-white">
              Lecture Notes
            </p>
            <p className="text-[7.5px] text-stone-500 dark:text-stone-400">
              Tap any highlighted term to activate a tool.
            </p>
          </div>
          <span className="text-[7px] font-semibold text-orange-600 dark:text-orange-400">
            PDF Viewer
          </span>
        </div>

        <div className="rounded-3xl bg-orange-50 dark:bg-orange-950/30 p-3 border border-orange-100 dark:border-orange-900/40">
          <p className="text-[8px] font-semibold text-orange-700 dark:text-orange-300 mb-2">
            Highlighted concept
          </p>
          <p className="text-[8.5px] leading-snug text-stone-700 dark:text-stone-100">
            The{" "}
            <span className="font-semibold text-orange-600 dark:text-orange-400">
              TCP 3-Way Handshake
            </span>{" "}
            is the core connection setup used to open a reliable channel between
            client and server.
          </p>
        </div>

        <p className="text-[7.5px] leading-relaxed text-stone-600 dark:text-stone-300">
          The Transport Layer establishes end-to-end communication between
          hosts. It uses a{" "}
          <span className="font-semibold text-orange-600 dark:text-orange-400">
            reliable process
          </span>{" "}
          where the client and server exchange handshake packets before sending
          data.
        </p>

        <div className="space-y-2 text-[7.5px] leading-relaxed">
          <p>
            Start with the{" "}
            <button
              type="button"
              onClick={() => onKeywordClick("tcp")}
              className={`font-semibold border-b transition-colors ${
                highlightedKeyword === "tcp"
                  ? "text-orange-600 border-orange-400"
                  : "text-stone-900 dark:text-stone-100 border-stone-300 hover:text-orange-500 hover:border-orange-300"
              }`}
            >
              TCP 3-Way Handshake
            </button>{" "}
            to understand how connection setup works.
          </p>

          <p>
            Then review the packet sequence steps:{" "}
            <button
              type="button"
              onClick={() => onKeywordClick("syn")}
              className={`font-semibold border-b transition-colors ${
                highlightedKeyword === "syn"
                  ? "text-orange-600 border-orange-400"
                  : "text-stone-900 dark:text-stone-100 border-stone-300 hover:text-orange-500 hover:border-orange-300"
              }`}
            >
              SYN
            </button>
            ,{" "}
            <button
              type="button"
              onClick={() => onKeywordClick("synack")}
              className={`font-semibold border-b transition-colors ${
                highlightedKeyword === "synack"
                  ? "text-orange-600 border-orange-400"
                  : "text-stone-900 dark:text-stone-100 border-stone-300 hover:text-orange-500 hover:border-orange-300"
              }`}
            >
              SYN-ACK
            </button>
            , and{" "}
            <button
              type="button"
              onClick={() => onKeywordClick("ack")}
              className={`font-semibold border-b transition-colors ${
                highlightedKeyword === "ack"
                  ? "text-orange-600 border-orange-400"
                  : "text-stone-900 dark:text-stone-100 border-stone-300 hover:text-orange-500 hover:border-orange-300"
              }`}
            >
              ACK
            </button>
            .
          </p>

          <p>
            For algorithm analysis, tap{" "}
            <button
              type="button"
              onClick={() => onKeywordClick("bigo")}
              className={`font-semibold border-b transition-colors ${
                highlightedKeyword === "bigo"
                  ? "text-orange-600 border-orange-400"
                  : "text-stone-900 dark:text-stone-100 border-stone-300 hover:text-orange-500 hover:border-orange-300"
              }`}
            >
              Big-O notation
            </button>{" "}
            or{" "}
            <button
              type="button"
              onClick={() => onKeywordClick("stack")}
              className={`font-semibold border-b transition-colors ${
                highlightedKeyword === "stack"
                  ? "text-orange-600 border-orange-400"
                  : "text-stone-900 dark:text-stone-100 border-stone-300 hover:text-orange-500 hover:border-orange-300"
              }`}
            >
              Stacks (LIFO)
            </button>
            .
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2 text-[7.5px] text-stone-500 dark:text-stone-400">
          {keywords.map((term) => (
            <button
              key={term.key}
              type="button"
              onClick={() => onKeywordClick(term.key)}
              className={`rounded-xl border px-2 py-1 text-left transition-colors ${
                highlightedKeyword === term.key
                  ? "border-orange-400 bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300"
                  : "border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950/70 hover:border-orange-200 hover:bg-orange-100 dark:hover:border-orange-900/40"
              }`}
            >
              {term.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡
// MAIN PAGE
// Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡
function HomePage() {
  const [activeFeature, setActiveFeature] = useState<FeatureId | null>(null);
  const [highlightedKeyword, setHighlightedKeyword] = useState<string | null>(
    null,
  );

  // Hoisted state triggers to synchronize PDF clicks with side panel tools
  const [aiTriggerQuery, setAiTriggerQuery] = useState<string | null>(null);
  const [quizTriggerIdx, setQuizTriggerIdx] = useState<number>(0);
  const [simStep, setSimStep] = useState<number>(-1);

  // Side-panel screens selection
  const screens: Record<FeatureId, React.ReactNode> = {
    ai: (
      <ScreenAI
        aiTriggerQuery={aiTriggerQuery}
        onQueryTriggered={() => setAiTriggerQuery(null)}
      />
    ),
    quiz: (
      <ScreenQuiz quizTriggerIdx={quizTriggerIdx} onQuizTriggered={() => {}} />
    ),
    notes: <ScreenNotes />,
    sim: <ScreenSim simStep={simStep} onSimStepChange={(s) => setSimStep(s)} />,
    roadmap: <ScreenRoadmap />,
  };

  // Handle PDF keyword selection & open corresponding feature tool
  const handleKeywordClick = (keyword: string) => {
    setHighlightedKeyword(keyword);
    if (keyword === "tcp") {
      setActiveFeature("sim");
      setSimStep(-1);
    } else if (keyword === "syn") {
      setActiveFeature("sim");
      setSimStep(0);
    } else if (keyword === "synack") {
      setActiveFeature("sim");
      setSimStep(1);
    } else if (keyword === "ack") {
      setActiveFeature("sim");
      setSimStep(2);
    } else if (keyword === "bigo") {
      setActiveFeature("ai");
      setAiTriggerQuery("Explain Big-O notation simply");
    } else if (keyword === "stack") {
      setActiveFeature("quiz");
      setQuizTriggerIdx(1); // Index 1 is the Stack (LIFO) question
    }
  };

  // Sync active feature back to PDF highlight highlights
  const handleFeatureToggle = (fid: FeatureId) => {
    if (activeFeature === fid) {
      setActiveFeature(null);
      setHighlightedKeyword(null);
    } else {
      setActiveFeature(fid);
      // Autofill keywords based on selected tool tab
      if (fid === "sim") {
        setHighlightedKeyword("tcp");
        setSimStep(-1);
      } else if (fid === "ai") {
        setHighlightedKeyword("bigo");
      } else if (fid === "quiz") {
        setHighlightedKeyword("stack");
      } else {
        setHighlightedKeyword(null);
      }
    }
  };

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

  // Prevent TS unused variable errors for WIP code
  void screens;
  void highlightedKeyword;
  void handleKeywordClick;

  return (
    <div className="flex flex-col w-full bg-white dark:bg-black relative overflow-hidden">

      {/* Orange glows in zigzag — avoiding laptop area on right */}
      <div className="absolute top-[-5%] left-[-10%] w-[500px] h-[500px] bg-orange-500/25 dark:bg-orange-500/15 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute top-[15%] right-[-8%] w-[400px] h-[400px] bg-orange-500/15 dark:bg-orange-500/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-[40%] left-[-8%] w-[450px] h-[450px] bg-orange-500/25 dark:bg-orange-500/15 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-[60%] right-[-5%] w-[350px] h-[350px] bg-orange-500/15 dark:bg-orange-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[5%] left-[-5%] w-[400px] h-[400px] bg-orange-500/20 dark:bg-orange-500/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-[30%] left-[20%] w-[300px] h-[300px] bg-orange-500/15 dark:bg-orange-500/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Î“Ã¶Ã‡Î“Ã¶Ã‡ HERO SECTION Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡ */}
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
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-semibold text-xs hover:bg-stone-100 dark:hover:bg-stone-900/50 transition-all duration-200"
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
            />
            <img
              src="/dark_theme_laptop.png"
              alt="LearnFlow AI on laptop"
              className="w-full h-auto hidden dark:block"
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

      {/* Î“Ã¶Ã‡Î“Ã¶Ã‡ FEATURES ZIGZAG SECTION Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡ */}
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
                    <button
                      onClick={() => handleFeatureToggle(f.id)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold shadow-md shadow-orange-500/30 transition-all duration-300"
                    >
                      Explore<span className="hidden sm:inline">&nbsp;{f.title}</span> <ArrowRight className="h-4 w-4" />
                    </button>
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
                className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center`}
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

      {/* Î“Ã¶Ã‡Î“Ã¶Ã‡ SEPARATOR LINE Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡ */}
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
        <div className="relative h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
      </div>

      {/* Î“Ã¶Ã‡Î“Ã¶Ã‡ REVIEWS CAROUSEL SECTION Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡ */}
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
            {[
              {
                name: "Alex Chen",
                role: "CS Student @ MIT",
                text: "Finally understood networking concepts! The interactive simulations made TCP handshakes click.",
                rating: 5,
              },
              {
                name: "Jordan Lee",
                role: "CS Student @ Stanford",
                text: "The AI explanations are so clear. No more watching 10 different YouTube videos for one topic.",
                rating: 5,
              },
              {
                name: "Sam Patel",
                role: "CS Student @ UC Berkeley",
                text: "Quiz generation is insane. Covers exactly what I need to study, instantly from my notes.",
                rating: 5,
              },
              {
                name: "Taylor Kim",
                role: "Bootcamp Graduate",
                text: "Went from struggling with data structures to acing my technical interviews. Game changer!",
                rating: 5,
              },
              {
                name: "Casey Quinn",
                role: "CS Student @ CMU",
                text: "Loved the learning roadmap feature. Finally have a structured path through hard topics.",
                rating: 5,
              },
            ].map((review, idx) => (
              <div key={`review-1-${idx}`} className="flex-shrink-0 w-80">
                <div className="relative rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/50 p-6 h-full overflow-hidden group/card hover:border-orange-400 dark:hover:border-orange-600 transition-all duration-300">
                  <div className="absolute inset-0 rounded-2xl blur-2xl transition-all duration-500 bg-orange-500/0 group-hover/card:bg-orange-500/10 opacity-0 group-hover/card:opacity-100" />
                  <div className="relative z-10 space-y-4">
                    <div className="flex gap-1">
                      {Array(review.rating)
                        .fill(0)
                        .map((_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 fill-orange-400 text-orange-400"
                          />
                        ))}
                    </div>
                    <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                      "{review.text}"
                    </p>
                    <div className="flex items-center gap-3 pt-2 border-t border-stone-200 dark:border-stone-800">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-sm">
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
              </div>
            ))}
          </div>

          {/* Track 2 */}
          <div
            className="flex animate-marquee shrink-0 min-w-full gap-5 pr-5 items-stretch"
            aria-hidden="true"
          >
            {[
              {
                name: "Alex Chen",
                role: "CS Student @ MIT",
                text: "Finally understood networking concepts! The interactive simulations made TCP handshakes click.",
                rating: 5,
              },
              {
                name: "Jordan Lee",
                role: "CS Student @ Stanford",
                text: "The AI explanations are so clear. No more watching 10 different YouTube videos for one topic.",
                rating: 5,
              },
              {
                name: "Sam Patel",
                role: "CS Student @ UC Berkeley",
                text: "Quiz generation is insane. Covers exactly what I need to study, instantly from my notes.",
                rating: 5,
              },
              {
                name: "Taylor Kim",
                role: "Bootcamp Graduate",
                text: "Went from struggling with data structures to acing my technical interviews. Game changer!",
                rating: 5,
              },
              {
                name: "Casey Quinn",
                role: "CS Student @ CMU",
                text: "Loved the learning roadmap feature. Finally have a structured path through hard topics.",
                rating: 5,
              },
            ].map((review, idx) => (
              <div key={`review-2-${idx}`} className="flex-shrink-0 w-80">
                <div className="relative rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/50 p-6 h-full overflow-hidden group/card hover:border-orange-400 dark:hover:border-orange-600 transition-all duration-300">
                  <div className="absolute inset-0 rounded-2xl blur-2xl transition-all duration-500 bg-orange-500/0 group-hover/card:bg-orange-500/10 opacity-0 group-hover/card:opacity-100" />
                  <div className="relative z-10 space-y-4">
                    <div className="flex gap-1">
                      {Array(review.rating)
                        .fill(0)
                        .map((_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 fill-orange-400 text-orange-400"
                          />
                        ))}
                    </div>
                    <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                      "{review.text}"
                    </p>
                    <div className="flex items-center gap-3 pt-2 border-t border-stone-200 dark:border-stone-800">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-sm">
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
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Î“Ã¶Ã‡Î“Ã¶Ã‡ SEPARATOR LINE Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡ */}
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
        <div className="relative h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
      </div>

      {/* Î“Ã¶Ã‡Î“Ã¶Ã‡ CTA BANNER SECTION Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡Î“Ã¶Ã‡ */}
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
