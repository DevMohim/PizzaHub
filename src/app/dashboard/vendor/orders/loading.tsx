import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const OrdersLoading = () => {
  return (
    <div
      className="w-full px-4 py-8 md:px-6"
      aria-busy="true"
      aria-label="Loading customer orders"
    >
      {/* Header Skeleton */}
      <div className="mb-6 space-y-2">
        <Skeleton className="h-8 w-48 sm:h-9 sm:w-56" />
        <Skeleton className="h-4 w-72 max-w-full sm:w-115" />
      </div>

      {/* 4-Column Stats Grid Skeleton */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="border-border bg-card rounded-xl border px-4 py-3 shadow-xs"
          >
            <div className="flex items-center justify-between gap-2">
              <Skeleton className="h-7 w-12 sm:h-8 sm:w-14" />
              <Skeleton className="size-9 shrink-0 rounded-lg" />
            </div>
            <Skeleton className="mt-1.5 h-3.5 w-20 sm:h-4 sm:w-24" />
          </div>
        ))}
      </div>

      {/* Main Orders Card Skeleton */}
      <Card className="gap-0 py-0">
        {/* Card Top Bar */}
        <div className="border-border flex flex-col gap-1.5 border-b px-4 py-4">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-64 max-w-full" />
        </div>

        {/* Desktop Table Skeleton */}
        <div className="hidden md:block">
          <div className="border-border grid grid-cols-6 gap-4 border-b px-4 py-3">
            <Skeleton className="h-3.5 w-20" />
            <Skeleton className="h-3.5 w-14" />
            <Skeleton className="h-3.5 w-20" />
            <Skeleton className="h-3.5 w-20" />
            <Skeleton className="h-3.5 w-16" />
            <Skeleton className="ml-auto h-3.5 w-16" />
          </div>

          <div className="divide-border divide-y">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="grid grid-cols-6 items-center gap-4 px-4 py-3.5"
              >
                {/* Customer */}
                <div className="flex items-center gap-2.5">
                  <Skeleton className="size-9 shrink-0 rounded-full" />
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-36" />
                  </div>
                </div>

                {/* Item */}
                <div className="flex items-center gap-2.5">
                  <Skeleton className="size-10 shrink-0 rounded-lg" />
                  <Skeleton className="h-4 w-28" />
                </div>

                {/* Delivery */}
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-36" />
                </div>

                {/* Message */}
                <Skeleton className="h-3.5 w-32" />

                {/* Status */}
                <Skeleton className="h-6 w-20 rounded-full" />

                {/* Actions */}
                <div className="flex justify-end gap-2">
                  <Skeleton className="h-8 w-16 rounded-md" />
                  <Skeleton className="h-8 w-16 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile List Skeleton */}
        <CardContent className="space-y-3 p-4 md:hidden">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="border-border space-y-3 rounded-xl border p-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <Skeleton className="size-9 shrink-0 rounded-full" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-36" />
                  </div>
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>

              <div className="bg-muted/60 flex items-center gap-2.5 rounded-lg p-2.5">
                <Skeleton className="size-12 shrink-0 rounded-lg" />
                <Skeleton className="h-4 w-36" />
              </div>

              <div className="flex items-end justify-between gap-2">
                <div className="space-y-1.5">
                  <Skeleton className="h-3.5 w-28" />
                  <Skeleton className="h-3 w-40" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-16 rounded-md" />
                  <Skeleton className="h-8 w-16 rounded-md" />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrdersLoading;
