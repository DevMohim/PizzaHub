import { Card, CardContent, CardHeader } from "@/components/ui/card";

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-muted ${className}`} />;
}

function StatSkeleton() {
  return (
    <Card className="rounded-xl border px-4 py-3 shadow-xs">
      <div className="flex items-center justify-between gap-2">
        <Skeleton className="h-8 w-12" />
        <Skeleton className="size-9 rounded-lg" />
      </div>
      <Skeleton className="mt-2 h-3 w-20" />
    </Card>
  );
}

function RecentOrderSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-xl border p-3 sm:flex-row sm:items-center sm:gap-4">
      {/* Image */}
      <Skeleton className="h-32 w-full rounded-lg sm:size-16" />

      {/* Order details */}
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-3 w-48 max-w-full" />

        <div className="flex flex-wrap gap-4">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-28" />
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center justify-between border-t pt-3 sm:border-0 sm:pt-0">
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <Card className="relative overflow-hidden">
      <div
        className="absolute inset-x-0 top-0 h-1.5"
        style={{ background: "var(--gradient-primary)" }}
      />

      <CardHeader>
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-3 w-52 max-w-full" />
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <Skeleton className="size-12 shrink-0 rounded-full" />

          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-40 max-w-full" />
          </div>
        </div>

        <Skeleton className="h-10 w-full rounded-lg" />
      </CardContent>
    </Card>
  );
}

function BreakdownSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-3 w-full max-w-64" />
      </CardHeader>

      <CardContent className="space-y-5">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-12" />
            </div>
            <Skeleton className="h-2 w-full rounded-full" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default function CustomerOverviewLoading() {
  return (
    <div className="w-full px-4 py-8 md:px-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="size-12 shrink-0 rounded-full" />

          <div className="space-y-2">
            <Skeleton className="h-7 w-56 max-w-full sm:w-72" />
            <Skeleton className="h-4 w-64 max-w-full" />
          </div>
        </div>

        <Skeleton className="h-10 w-36 rounded-lg" />
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <StatSkeleton key={index} />
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {/* Recent Orders */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-3 w-44" />
              </div>

              <Skeleton className="h-8 w-20 rounded-lg" />
            </div>
          </CardHeader>

          <CardContent>
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <RecentOrderSkeleton key={index} />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="flex flex-col gap-4">
          <ProfileSkeleton />
          <BreakdownSkeleton />
        </div>
      </div>
    </div>
  );
}
