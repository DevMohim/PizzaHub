import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const MenuItemsLoading = () => {
  return (
    <div
      className="w-full px-4 py-8 md:px-6"
      aria-busy="true"
      aria-label="Loading menu items"
    >
      {/* Header Skeleton */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-44 sm:h-9 sm:w-52" />
          <Skeleton className="h-4 w-72 max-w-full sm:w-110" />
        </div>
        {/* Add Menu Item Button Skeleton */}
        <Skeleton className="h-10 w-40 shrink-0 rounded-md" />
      </div>

      {/* 3-Column Stats Grid Skeleton */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="border-border bg-card rounded-xl border px-4 py-3 shadow-xs"
          >
            <Skeleton className="h-7 w-12 sm:h-8 sm:w-14" />
            <Skeleton className="mt-1.5 h-3.5 w-20 sm:h-4 sm:w-24" />
          </div>
        ))}
      </div>

      {/* Menu Item Cards List Skeleton */}
      <div className="grid grid-cols-1 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
              {/* Left: Thumbnail + Title/Meta */}
              <div className="flex items-start gap-4 sm:items-center">
                <Skeleton className="size-20 shrink-0 rounded-xl sm:size-24" />
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Skeleton className="h-5 w-40 sm:w-52" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                  <Skeleton className="h-4 w-64 max-w-full sm:w-80" />
                  <div className="flex items-center gap-3 pt-0.5">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
              </div>

              {/* Right: Action Buttons */}
              <div className="flex items-center justify-end gap-2 sm:shrink-0">
                <Skeleton className="h-9 w-20 rounded-md" />
                <Skeleton className="size-9 rounded-md" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MenuItemsLoading;
