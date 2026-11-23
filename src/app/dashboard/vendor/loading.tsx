import type { CSSProperties } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

function Skeleton({
  className = "",
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-muted ${className}`}
      style={style}
    />
  );
}

function StatSkeleton() {
  return (
    <Card className="py-4">
      <CardContent className="flex items-start justify-between gap-3 px-4">
        <div className="min-w-0 flex-1 space-y-3">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-9 w-16" />
        </div>
        <Skeleton className="size-10 shrink-0 rounded-xl" />
      </CardContent>
    </Card>
  );
}

function ChartSkeleton() {
  return (
    <Card className="xl:col-span-2">
      <CardHeader>
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-3 w-64 max-w-full" />
      </CardHeader>

      <CardContent>
        <div className="flex h-64 items-end gap-3 px-2 pt-4">
          {[35, 55, 42, 75, 60, 90, 68].map((height, index) => (
            <div
              key={index}
              className="flex flex-1 items-end"
              style={{ height: "100%" }}
            >
              <Skeleton
                className="w-full rounded-t-md"
                style={{ height: `${height}%` } as React.CSSProperties}
              />
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-between gap-2">
          {Array.from({ length: 7 }).map((_, index) => (
            <Skeleton key={index} className="h-3 w-8" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function PlanSkeleton() {
  return (
    <Card className="relative overflow-hidden">
      <div
        className="absolute inset-x-0 top-0 h-1.5"
        style={{ background: "var(--gradient-primary)" }}
      />

      <CardHeader>
        <div className="flex justify-end">
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-3/4" />
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Plan progress */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-12" />
          </div>
          <Skeleton className="h-2.5 w-full rounded-full" />
        </div>

        {/* Benefits */}
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex items-center gap-2">
              <Skeleton className="size-4 rounded-full" />
              <Skeleton className="h-3 flex-1" />
            </div>
          ))}
        </div>

        <Skeleton className="h-10 w-full rounded-lg" />
      </CardContent>
    </Card>
  );
}

function OrdersTableSkeleton() {
  return (
    <Card className="xl:col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-3 w-52 max-w-full" />
          </div>
          <Skeleton className="h-8 w-20 rounded-lg" />
        </div>
      </CardHeader>

      <CardContent>
        {/* Desktop Table */}
        <div className="hidden md:block">
          <div className="grid grid-cols-4 gap-4 border-b pb-3">
            {["w-12", "w-20", "w-16", "w-14"].map((width, index) => (
              <Skeleton key={index} className={`h-4 ${width}`} />
            ))}
          </div>

          <div className="divide-y">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="grid grid-cols-4 items-center gap-4 py-5"
              >
                <div className="space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
                <div className="flex justify-end">
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile List */}
        <div className="space-y-3 md:hidden">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="space-y-3 rounded-xl border p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-36" />
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
              <Skeleton className="h-3 w-full" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function CategoryChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-3 w-full" />
      </CardHeader>

      <CardContent>
        <div className="space-y-5 py-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-8" />
              </div>
              <Skeleton
                className="h-3 rounded-full"
                style={{
                  width: `${90 - index * 13}%`,
                }}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function VendorDashboardLoading() {
  return (
    <div className="w-full px-4 py-8 md:px-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="size-12 shrink-0 rounded-full" />

          <div className="space-y-2">
            <Skeleton className="h-7 w-64 max-w-full" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>

        <Skeleton className="h-10 w-40 rounded-lg" />
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <StatSkeleton key={index} />
        ))}
      </div>

      {/* Orders Chart + Plan */}
      <div className="mb-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <ChartSkeleton />
        <PlanSkeleton />
      </div>

      {/* Recent Orders + Category Chart */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <OrdersTableSkeleton />
        <CategoryChartSkeleton />
      </div>
    </div>
  );
}
