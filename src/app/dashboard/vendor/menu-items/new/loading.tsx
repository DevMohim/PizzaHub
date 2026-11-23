import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const NewMenuItemLoading = () => {
  return (
    <div
      className="w-full px-4 py-8 md:px-6"
      aria-busy="true"
      aria-label="Loading new menu item form"
    >
      {/* Header Skeleton */}
      <div className="mb-6 space-y-2">
        <Skeleton className="h-8 w-44 sm:h-9 sm:w-52" />
        <Skeleton className="h-4 w-72 max-w-full sm:w-110" />
      </div>

      {/* Form Card Skeleton */}
      <Card className="max-w-3xl">
        <CardHeader className="space-y-2 border-b pb-5">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-4 w-64 max-w-full" />
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          {/* Pizza Name & Category Row */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          </div>

          {/* Price & Prep Time Row */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-24 w-full rounded-md" />
          </div>

          {/* Image Upload Box */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-36 w-full rounded-xl" />
          </div>

          {/* Submit Action Row */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Skeleton className="h-10 w-24 rounded-md" />
            <Skeleton className="h-10 w-36 rounded-md" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewMenuItemLoading;
