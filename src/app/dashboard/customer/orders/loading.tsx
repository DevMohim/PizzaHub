import { Card, CardContent } from "@/components/ui/card";

const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse rounded-md bg-muted ${className}`} />
);

const StatSkeleton = () => (
  <div className="rounded-xl border bg-card px-4 py-3 shadow-xs">
    <div className="flex items-center justify-between gap-2">
      <Skeleton className="h-8 w-12 sm:h-9" />
      <Skeleton className="size-9 rounded-lg" />
    </div>
    <Skeleton className="mt-2 h-3 w-20 sm:w-24" />
  </div>
);

const OrderCardSkeleton = () => (
  <article className="flex flex-col gap-4 rounded-xl border bg-card p-4 shadow-xs sm:flex-row sm:items-stretch sm:gap-5">
    {/* Thumbnail */}
    <Skeleton className="h-40 w-full shrink-0 rounded-lg sm:h-auto sm:w-28" />

    {/* Details */}
    <div className="flex min-w-0 flex-1 flex-col gap-4">
      {/* Title + Status */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-5 w-40 max-w-full" />
          <Skeleton className="h-3 w-32 max-w-full" />
        </div>

        <Skeleton className="h-6 w-20 rounded-full" />
      </div>

      {/* Delivery Info */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex items-start gap-2">
          <Skeleton className="mt-0.5 size-4 shrink-0 rounded-full" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-4 w-28" />
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Skeleton className="mt-0.5 size-4 shrink-0 rounded-full" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-4 w-full max-w-40" />
          </div>
        </div>
      </div>

      {/* Optional Note */}
      <Skeleton className="h-4 w-full max-w-xs" />

      {/* Footer */}
      <div className="mt-auto flex flex-wrap items-end justify-between gap-3 border-t pt-3">
        <div className="flex items-center gap-1">
          <Skeleton className="size-3.5 rounded-full" />
          <Skeleton className="h-3 w-32" />
        </div>

        <Skeleton className="h-9 w-28 rounded-md" />
      </div>
    </div>
  </article>
);

const MyOrdersLoading = () => {
  return (
    <div className="w-full px-4 py-8 md:px-6">
      {/* Header */}
      <div className="mb-6 space-y-3">
        <Skeleton className="h-8 w-36 sm:h-9 sm:w-44" />

        <div className="space-y-2">
          <Skeleton className="h-3 w-full max-w-2xl" />
          <Skeleton className="h-3 w-full max-w-xl" />
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <StatSkeleton key={index} />
        ))}
      </div>

      {/* Orders List */}
      <Card className="gap-0 py-0">
        {/* Section Header */}
        <div className="flex flex-col gap-2 border-b px-4 py-4">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-3 w-full max-w-sm" />
        </div>

        {/* Order Cards */}
        <CardContent className="space-y-4 p-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <OrderCardSkeleton key={index} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default MyOrdersLoading;
