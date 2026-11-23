import { Card, CardContent, CardHeader } from "@/components/ui/card";

const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse rounded-md bg-muted ${className}`} />
);

const UserRowSkeleton = () => (
  <div className="grid min-w-180 grid-cols-[minmax(240px,1fr)_112px_112px_120px_256px] items-center gap-4 border-b px-4 py-3 last:border-b-0">
    {/* User */}
    <div className="flex min-w-0 items-center gap-3">
      <Skeleton className="size-11 shrink-0 rounded-full" />

      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-44 max-w-full" />
      </div>
    </div>

    {/* Role */}
    <Skeleton className="h-6 w-20 rounded-full" />

    {/* Status */}
    <Skeleton className="h-6 w-20 rounded-full" />

    {/* Joined */}
    <Skeleton className="hidden h-3 w-20 lg:block" />

    {/* Actions */}
    <div className="flex justify-end gap-2">
      <Skeleton className="h-8 w-20 rounded-md" />
      <Skeleton className="size-8 rounded-md" />
    </div>
  </div>
);

const UsersLoading = () => {
  return (
    <div className="w-full px-4 py-8 md:px-6">
      {/* Header */}
      <div className="mb-5 space-y-3">
        <Skeleton className="h-8 w-44 sm:h-9 sm:w-52" />

        <div className="space-y-2">
          <Skeleton className="h-3 w-full max-w-2xl" />
          <Skeleton className="h-3 w-full max-w-xl" />
        </div>
      </div>

      {/* Users Filters */}
      <div className="mb-5 rounded-xl border bg-card p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Skeleton className="h-10 w-full flex-1" />
          <Skeleton className="h-10 w-full sm:w-36" />
          <Skeleton className="h-10 w-full sm:w-36" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      {/* Users Table */}
      <Card className="gap-0 overflow-hidden py-0">
        <CardHeader className="flex flex-row items-center justify-between gap-3 border-b py-4">
          <div className="space-y-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-3 w-36" />
          </div>

          <Skeleton className="h-6 w-20 rounded-full" />
        </CardHeader>

        <CardContent className="overflow-x-auto px-0 pb-0">
          {/* Table Header */}
          <div className="grid min-w-180 grid-cols-[minmax(240px,1fr)_112px_112px_120px_256px] gap-4 border-b bg-muted/20 px-4 py-3">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-3 w-10" />
            <Skeleton className="h-3 w-14" />
            <Skeleton className="hidden h-3 w-14 lg:block" />
            <Skeleton className="ml-auto h-3 w-16" />
          </div>

          {/* Table Rows */}
          {Array.from({ length: 6 }).map((_, index) => (
            <UserRowSkeleton key={index} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersLoading;
