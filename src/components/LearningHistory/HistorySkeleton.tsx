export function HistorySkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Stats Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="bg-white/40 dark:bg-black/20 border border-[var(--lf-border)] rounded-2xl p-4 h-24 flex flex-col justify-between backdrop-blur-md" />
        ))}
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Timeline Skeleton */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div className="h-6 w-24 bg-gray-200 dark:bg-zinc-800 rounded-md animate-pulse" />
          <div className="space-y-4 pl-6 relative border-l-2 border-gray-100 dark:border-zinc-800">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-white/60 dark:bg-zinc-900/50 border border-[var(--lf-border)] rounded-2xl p-6 relative backdrop-blur-md space-y-4 animate-pulse"
              >
                <div className="absolute -left-[31px] top-6 w-4 h-4 rounded-full border-4 border-white dark:border-zinc-900 bg-gray-200 dark:bg-zinc-800" />
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-xl bg-gray-200 dark:bg-zinc-800" />
                    <div className="space-y-2">
                      <div className="h-4 w-28 bg-gray-200 dark:bg-zinc-800 rounded" />
                      <div className="h-3 w-40 bg-gray-200 dark:bg-zinc-800 rounded" />
                    </div>
                  </div>
                  <div className="h-3 w-16 bg-gray-200 dark:bg-zinc-800 rounded" />
                </div>
                <div className="h-4 w-full bg-gray-100 dark:bg-zinc-800/40 rounded" />
                <div className="h-4 w-2/3 bg-gray-100 dark:bg-zinc-800/40 rounded" />
                <div className="flex gap-2">
                  <div className="h-6 w-12 bg-gray-200 dark:bg-zinc-800 rounded-full" />
                  <div className="h-6 w-16 bg-gray-200 dark:bg-zinc-800 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Skeleton */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-white/60 dark:bg-zinc-900/50 border border-[var(--lf-border)] rounded-3xl p-6 backdrop-blur-md space-y-6">
            <div className="h-5 w-32 bg-gray-200 dark:bg-zinc-800 rounded" />
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800/50 pb-3 last:border-0 last:pb-0">
                  <div className="space-y-2">
                    <div className="h-3 w-16 bg-gray-200 dark:bg-zinc-800 rounded" />
                    <div className="h-4 w-28 bg-gray-200 dark:bg-zinc-800 rounded" />
                  </div>
                  <div className="h-7 w-7 rounded-lg bg-gray-200 dark:bg-zinc-800" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
