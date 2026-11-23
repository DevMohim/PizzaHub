import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse rounded-md bg-muted ${className}`} />
);

const StatCardSkeleton = () => (
  <Card className="rounded-2xl shadow-sm">
    <CardContent className="flex items-start justify-between gap-4 p-5">
      <div className="min-w-0 flex-1 space-y-3">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-7 w-28" />
        <Skeleton className="h-3 w-40" />
      </div>

      <Skeleton className="size-11 shrink-0 rounded-xl" />
    </CardContent>
  </Card>
);

const TransactionRowSkeleton = () => (
  <div className="grid min-w-5xl grid-cols-[minmax(220px,1.5fr)_128px_112px_112px_208px_144px] items-center gap-4 border-b px-4 py-4 last:border-b-0">
    {/* Vendor */}
    <div className="flex min-w-0 items-center gap-3">
      <Skeleton className="size-11 shrink-0 rounded-full" />

      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-3 w-36" />
      </div>
    </div>

    {/* Plan */}
    <div className="space-y-2">
      <Skeleton className="h-6 w-20 rounded-full" />
      <Skeleton className="h-3 w-16" />
    </div>

    {/* Amount */}
    <Skeleton className="h-4 w-20" />

    {/* Status */}
    <Skeleton className="h-6 w-16 rounded-full" />

    {/* Transaction ID */}
    <Skeleton className="h-4 w-36" />

    {/* Date */}
    <div className="space-y-2">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-3 w-16" />
    </div>
  </div>
);

const TransactionPageLoading = () => {
  return (
    <div className="w-full px-4 py-8 md:px-6">
      {/* Header */}
      <section className="relative overflow-hidden rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <Skeleton className="hidden size-12 shrink-0 rounded-xl sm:block" />

            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Skeleton className="h-8 w-36" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>

              <div className="space-y-2">
                <Skeleton className="h-3 w-full max-w-xl" />
                <Skeleton className="h-3 w-80 max-w-full" />
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3 rounded-xl border bg-muted/30 px-3.5 py-2.5">
            <Skeleton className="size-8 rounded-lg" />

            <div className="space-y-2">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <StatCardSkeleton key={index} />
        ))}
      </div>

      {/* Payment History */}
      <Card className="mt-5 gap-0 overflow-hidden rounded-2xl py-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between gap-3 border-b py-4">
          <div className="space-y-2">
            <CardTitle className="text-base">
              <Skeleton className="h-5 w-32" />
            </CardTitle>
            <CardDescription>
              <Skeleton className="h-3 w-64 max-w-full" />
            </CardDescription>
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        </CardHeader>

        <CardContent className="overflow-x-auto px-0">
          {/* Table Header */}
          <div className="grid min-w-5xl grid-cols-[minmax(220px,1.5fr)_128px_112px_112px_208px_144px] gap-4 border-b bg-muted/20 px-4 py-3">
            {["w-16", "w-12", "w-16", "w-14", "w-24", "w-12"].map(
              (width, index) => (
                <Skeleton key={index} className={`h-3 ${width}`} />
              ),
            )}
          </div>

          {/* Table Rows */}
          {Array.from({ length: 6 }).map((_, index) => (
            <TransactionRowSkeleton key={index} />
          ))}
        </CardContent>

        {/* Footer */}
        <CardFooter className="flex flex-col gap-3 border-t bg-muted/30 py-3 sm:flex-row sm:items-center sm:justify-between">
          <Skeleton className="h-3 w-36" />

          <Skeleton className="h-3 w-24" />
        </CardFooter>
      </Card>

      {/* Read-only Note */}
      <div className="mt-4 flex items-start gap-2.5 rounded-xl border bg-muted/30 px-4 py-3">
        <Skeleton className="mt-0.5 size-4 shrink-0 rounded-full" />

        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-full max-w-2xl" />
          <Skeleton className="h-3 w-full max-w-xl" />
        </div>
      </div>
    </div>
  );
};

export default TransactionPageLoading;
