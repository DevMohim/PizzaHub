import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const SubscriptionCheckoutLoading = () => {
  return (
    <div
      className="min-h-screen bg-background p-4 sm:p-6 lg:p-8"
      aria-busy="true"
      aria-label="Loading subscription checkout"
    >
      <div className="mx-auto max-w-4xl">
        {/* Header Skeleton */}
        <div className="mb-6">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="mt-3 h-8 w-52 sm:h-9 sm:w-60" />
          <Skeleton className="mt-2 h-4 w-72 max-w-full sm:w-96" />
        </div>

        {/* 2-Column Checkout Grid */}
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          {/* Left: Plan Details Card Skeleton */}
          <Card className="rounded-2xl border-border shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Skeleton className="size-5 rounded-full" />
                <Skeleton className="h-6 w-48" />
              </div>
            </CardHeader>

            <CardContent className="flex flex-col gap-4">
              {/* 4 Feature Rows */}
              <div className="flex flex-col gap-3">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Skeleton className="mt-0.5 size-5 shrink-0 rounded-full" />
                    <Skeleton className="h-4 w-56 sm:w-72" />
                  </div>
                ))}
              </div>

              {/* Info Callout Box Skeleton */}
              <div className="mt-2 flex items-start gap-3 rounded-xl bg-accent/60 p-4">
                <Skeleton className="mt-0.5 size-5 shrink-0 rounded-full" />
                <div className="w-full space-y-1.5">
                  <Skeleton className="h-3.5 w-full" />
                  <Skeleton className="h-3.5 w-4/5" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right: Sticky Order Summary Card Skeleton */}
          <div className="lg:sticky lg:top-6 lg:self-start">
            <Card className="rounded-2xl border-border shadow-sm">
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2.5 border-b border-border pb-4">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-14" />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-14" />
                  <Skeleton className="h-6 w-20" />
                </div>

                <Skeleton className="h-11 w-full rounded-md" />
                <Skeleton className="mx-auto h-3 w-44" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionCheckoutLoading;
