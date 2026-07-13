export default function CategoryLoading() {
  return (
    <div>
      {/* Header skeleton */}
      <div className="py-4 md:py-12 bg-[#003459] px-4 md:px-16 lg:px-16 flex items-center">
        <div className="h-6 md:h-8 w-64 bg-white/20 rounded animate-pulse" />
      </div>

      {/* Product grid skeleton */}
      <div className="px-4 md:px-16 lg:px-16 py-6 md:py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden animate-pulse">
              <div className="aspect-square bg-gray-200 dark:bg-zinc-800" />
              <div className="p-3 space-y-2">
                <div className="h-4 w-3/4 bg-gray-200 dark:bg-zinc-800 rounded" />
                <div className="h-4 w-1/2 bg-gray-200 dark:bg-zinc-800 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
