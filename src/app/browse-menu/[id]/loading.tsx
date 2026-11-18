import { Skeleton } from "@/components/ui/skeleton";

/** Streaming fallback shown while an item's details load. */
const ItemDetailsLoading = () => {
  return (
    <div className="w-full">
      {/* Breadcrumb skeleton */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto flex w-full max-w-7xl items-center gap-2 px-4 py-3 sm:px-6">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-40" />
        </div>
      </div>

      {/* Content skeleton */}
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:gap-10">
        {/* Left — gallery + description + vendor */}
        <div className="space-y-8">
          <Skeleton className="aspect-4/3 w-full rounded-2xl" />
          <div className="space-y-3">
            <Skeleton className="h-6 w-36" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
          <div className="rounded-2xl border border-border bg-card p-4">
            <Skeleton className="h-6 w-24" />
            <div className="mt-3 flex items-center gap-3">
              <Skeleton className="size-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-44" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          </div>
        </div>

        {/* Right — summary + order card */}
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex gap-2">
              <Skeleton className="h-5 w-32 rounded-full" />
              <Skeleton className="h-5 w-24 rounded-full" />
            </div>
            <Skeleton className="h-9 w-64 max-w-full" />
            <div className="flex items-center gap-5">
              <Skeleton className="h-9 w-28" />
              <Skeleton className="h-4 w-36" />
            </div>
          </div>

          <div className="space-y-4 rounded-2xl border border-border bg-card p-5">
            <Skeleton className="h-6 w-36" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-36" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-20 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-16 w-full" />
            </div>
            <Skeleton className="h-11 w-full rounded-lg" />
            <Skeleton className="h-4 w-64 max-w-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailsLoading;
