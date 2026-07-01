import { Search, X } from "lucide-react";

interface HistorySearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function HistorySearch({ value, onChange }: HistorySearchProps) {
  return (
    <div className="relative flex-1 max-w-md w-full">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--lf-text-secondary)] focus-within:text-[var(--lf-accent)] transition-colors" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by topic, document name, feature style..."
        className="w-full h-11 pl-11 pr-10 rounded-xl bg-white/60 dark:bg-black/35 border border-[var(--lf-border)] text-sm outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/10 transition-all placeholder:text-[var(--lf-text-secondary)] text-[var(--lf-text-primary)] backdrop-blur-md"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-[var(--lf-text-secondary)] hover:text-[var(--lf-text-primary)] hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}
