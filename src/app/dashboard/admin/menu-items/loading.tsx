import { Card, CardContent } from "@/components/ui/card";

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-muted ${className}`} />;
}

function FilterSkeleton() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      <Skeleton className="h-10 w-full sm:w-64" />
      <Skeleton className="h-10 w-full sm:w-36" />
      <Skeleton className="h-10 w-full sm:w-36" />
      <Skeleton className="h-10 w-full sm:w-40" />
      <Skeleton className="h-10 w-full sm:w-32" />
    </div>
  );
}

function MenuItemRowSkeleton() {
  return (
    <div className="flex flex-col gap-3 border-b p-4 last:border-0 md:grid md:grid-cols-[minmax(180px,1.5fr)_1fr_1fr_1fr_auto] md:items-center md:gap-4">
      {/* Menu item */}
      <div className="flex min-w-0 items-center gap-3">
        <Skeleton className="size-14 shrink-0 rounded-xl" />
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-4 w-32 max-w-full" />
          <Skeleton className="h-3 w-44 max-w-full" />
        </div>
      </div>

      {/* Vendor */}
      <div className="flex items-center gap-2">
        <Skeleton className="size-8 shrink-0 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>

      {/* Category */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>

      {/* Status */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Skeleton className="size-8 rounded-lg" />
        <Skeleton className="size-8 rounded-lg" />
        <Skeleton className="size-8 rounded-lg" />
      </div>
    </div>
  );
}

function MobileMenuItemSkeleton() {
  return (
    <Card className="rounded-xl">
      <CardContent className="space-y-4 p-4">
        <div className="flex items-center gap-3">
          <Skeleton className="size-16 shrink-0 rounded-xl" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-4 w-36 max-w-full" />
            <Skeleton className="h-3 w-48 max-w-full" />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>

        <div className="flex items-center justify-between border-t pt-3">
          <Skeleton className="h-4 w-20" />
          <div className="flex gap-2">
            <Skeleton className="size-8 rounded-lg" />
            <Skeleton className="size-8 rounded-lg" />
            <Skeleton className="size-8 rounded-lg" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function MenuItemsLoading() {
  return (
    <div className="w-full px-4 py-8 md:px-6">
      {/* Header */}
      <div className="mb-5 space-y-3">
        <Skeleton className="h-8 w-64 max-w-full rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full max-w-2xl" />
          <Skeleton className="h-4 w-3/4 max-w-xl" />
        </div>
      </div>

      {/* Main Manager */}
      <Card className="overflow-hidden rounded-2xl">
        <CardContent className="space-y-5 p-4 sm:p-5">
          {/* Search and filters */}
          <FilterSkeleton />

          {/* Results information */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-4 w-24" />
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block">
            {/* Table Header */}
            <div className="grid grid-cols-[minmax(180px,1.5fr)_1fr_1fr_1fr_auto] items-center gap-4 border-b px-4 py-3">
              {["w-24", "w-20", "w-24", "w-20", "w-16"].map((width, index) => (
                <Skeleton key={index} className={`h-3 ${width}`} />
              ))}
            </div>

            {/* Table Rows */}
            <div>
              {Array.from({ length: 7 }).map((_, index) => (
                <MenuItemRowSkeleton key={index} />
              ))}
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="space-y-3 md:hidden">
            {Array.from({ length: 5 }).map((_, index) => (
              <MobileMenuItemSkeleton key={index} />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
            <Skeleton className="h-4 w-40" />

            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-20 rounded-lg" />
              <Skeleton className="h-9 w-9 rounded-lg" />
              <Skeleton className="h-9 w-9 rounded-lg" />
              <Skeleton className="h-9 w-9 rounded-lg" />
              <Skeleton className="h-9 w-20 rounded-lg" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
