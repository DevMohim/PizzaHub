import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const ProfileSettingsLoading = () => {
  return (
    <div
      className="w-full px-4 py-8 md:px-6"
      aria-busy="true"
      aria-label="Loading profile settings"
    >
      {/* Header Skeleton */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48 sm:h-9 sm:w-56" />
          <Skeleton className="h-4 w-72 max-w-full sm:w-105" />
        </div>
        <Skeleton className="h-5 w-32" />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {/* Profile Card Skeleton */}
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2">
              <Skeleton className="h-6 w-28" />
              <Skeleton className="h-4 w-64 max-w-full" />
            </div>
            {/* Edit Profile Button Skeleton (CardAction equivalent) */}
            <Skeleton className="h-8 w-28 rounded-md" />
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Avatar + Identity Skeleton */}
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <Skeleton className="size-20 shrink-0 rounded-full" />
              <div className="w-full space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Skeleton className="h-6 w-44" />
                  <Skeleton className="size-4 rounded-full" />
                </div>
                <Skeleton className="h-4 w-52" />
                <Skeleton className="h-5 w-24 rounded-full" />
              </div>
            </div>

            {/* 2x2 Details Grid Skeleton */}
            <div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 bg-card px-4 py-3"
                >
                  <Skeleton className="mt-0.5 size-8 shrink-0 rounded-lg" />
                  <div className="w-full space-y-2">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-5 w-36" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Side Column Skeleton */}
        <div className="flex flex-col gap-4">
          {/* Account Status Card Skeleton */}
          <Card className="relative overflow-hidden">
            <div
              className="absolute inset-x-0 top-0 h-1.5 opacity-40"
              style={{ background: "var(--gradient-primary)" }}
              aria-hidden="true"
            />
            <CardHeader className="space-y-2">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-14" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-10" />
              </div>
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-20" />
              </div>
            </CardContent>
          </Card>

          {/* Info Note Card Skeleton */}
          <Card>
            <CardHeader className="space-y-2.5">
              <Skeleton className="h-6 w-48" />
              <div className="space-y-1.5 pt-1">
                <Skeleton className="h-3.5 w-full" />
                <Skeleton className="h-3.5 w-11/12" />
                <Skeleton className="h-3.5 w-4/5" />
              </div>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettingsLoading;
