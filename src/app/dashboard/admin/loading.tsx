import { Card, CardContent, CardHeader } from "@/components/ui/card";

function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-lg bg-stone-200/80 ${className}`} />
  );
}

function StatCardSkeleton() {
  return (
    <Card className="rounded-2xl border-orange-100 bg-white shadow-sm">
      <CardContent className="flex items-center gap-4 p-5">
        <Skeleton className="h-11 w-11 shrink-0 rounded-xl" />

        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-7 w-16 rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
}

function QuickLinkSkeleton() {
  return (
    <Card className="h-full rounded-2xl border-orange-100 bg-white shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <Skeleton className="h-10 w-10 rounded-xl" />
        <Skeleton className="h-4 w-4 rounded-full" />
      </CardHeader>

      <CardContent className="space-y-3">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-3/4" />
      </CardContent>
    </Card>
  );
}

export default function AdminOverviewLoading() {
  return (
    <div className="min-h-screen bg-[#FFF8EF] p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 space-y-3">
        <Skeleton className="h-9 w-52 rounded-lg" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>

      {/* Statistics */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <StatCardSkeleton key={index} />
        ))}
      </div>

      {/* Pending Review Banner */}
      <Card className="mb-6 overflow-hidden rounded-2xl border-amber-200 bg-amber-50/70 shadow-sm">
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1 space-y-3">
            <Skeleton className="h-6 w-64 max-w-full bg-amber-200/70" />
            <Skeleton className="h-4 w-80 max-w-full bg-amber-200/70" />
          </div>

          <Skeleton className="h-10 w-32 rounded-xl bg-amber-200/70" />
        </CardContent>
      </Card>

      {/* Quick Links */}
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <QuickLinkSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
