import { Handle, Position } from '@xyflow/react';

interface CustomMindMapNodeProps {
  data: {
    label: string;
    isRoot?: boolean;
  };
}

export function CustomMindMapNode({ data }: CustomMindMapNodeProps) {
  const isRoot = data.isRoot;

  return (
    <div
      className={`px-6 py-4 rounded-2xl flex items-center justify-center text-center transition-all duration-300 min-w-[160px] max-w-[280px] backdrop-blur-md border ${
        isRoot
          ? "bg-gradient-to-br from-orange-500/90 to-orange-600/90 text-white font-bold border-orange-400 shadow-[0_8px_30px_rgba(249,115,22,0.4)]"
          : "bg-white/70 dark:bg-black/60 text-[var(--lf-text-primary)] font-medium border-stone-200/50 dark:border-stone-800/50 shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_25px_rgba(0,0,0,0.12)]"
      }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-stone-300 dark:bg-stone-600 border-2 border-white dark:border-stone-900 !rounded-full opacity-0 hover:opacity-100 transition-opacity"
      />
      <span className="text-[14px] leading-snug drop-shadow-sm">
        {data.label}
      </span>
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-stone-300 dark:bg-stone-600 border-2 border-white dark:border-stone-900 !rounded-full opacity-0 hover:opacity-100 transition-opacity"
      />
    </div>
  );
}
