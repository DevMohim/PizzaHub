import { Skeleton } from "@/components/ui/skeleton";

/** Streaming fallback shown while the Browse Menu page loads. */
const BrowseMenuLoading = () => {
  return (
    <div className="w-full">
      {/* Page header skeleton */}
      <section className="bg-(image:--gradient-warm) border-b border-border">
        <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
          <Skeleton className="h-6 w-40 rounded-full" />
          <Skeleton className="mt-4 h-9 w-72 max-w-full" />
          <Skeleton className="mt-3 h-5 w-96 max-w-full" />
        </div>
      </section>

      {/* Content skeleton */}
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
        {/* Filter bar skeleton */}
        <div className="mb-6 rounded-2xl border border-border bg-card p-4 shadow-xs">
          <div className="grid gap-3 md:grid-cols-[1fr_220px_220px]">
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        </div>

        <Skeleton className="mb-4 h-4 w-32" />

        {/* Card grid skeleton */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-border bg-card shadow-xs"
            >
              <Skeleton className="aspect-video w-full rounded-none" />
              <div className="space-y-3 p-4">
                <div className="flex items-center justify-between gap-3">
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-5 w-16" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-32" />
                <div className="flex items-center gap-2 border-t border-border pt-3">
                  <Skeleton className="size-7 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrowseMenuLoading;
