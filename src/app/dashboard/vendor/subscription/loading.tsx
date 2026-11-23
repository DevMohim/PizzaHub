import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const VendorSubscriptionLoading = () => {
  return (
    <div
      className="w-full px-4 py-8 md:px-6"
      aria-busy="true"
      aria-label="Loading subscription plans"
    >
      {/* Centered Header Skeleton */}
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <Skeleton className="h-6 w-28 rounded-full" />
        <Skeleton className="mt-4 h-9 w-72 sm:h-10 sm:w-110" />
        <Skeleton className="mt-2.5 h-4 w-80 max-w-full sm:w-120" />
        <Skeleton className="mt-1.5 h-4 w-64 max-w-full sm:w-80" />
      </div>

      {/* 2-Column Plan Cards Skeleton */}
      <div className="mx-auto mt-8 grid max-w-4xl grid-cols-1 gap-5 md:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => {
          const isHighlighted = index === 1;

          return (
            <Card
              key={index}
              className={
                isHighlighted
                  ? "relative overflow-hidden ring-2 ring-primary/40"
                  : "relative overflow-hidden ring-1 ring-foreground/10"
              }
            >
              {isHighlighted && (
                <div
                  className="absolute inset-x-0 top-0 h-1.5 opacity-40"
                  style={{ background: "var(--gradient-primary)" }}
                  aria-hidden="true"
                />
              )}

              <CardContent className="flex h-full flex-col gap-5 pt-6">
                {/* Plan Title + Optional Badge */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="size-9 rounded-xl" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                  {isHighlighted && (
                    <Skeleton className="h-5 w-24 rounded-full" />
                  )}
                </div>

                {/* Price & Description */}
                <div className="space-y-2">
                  <div className="flex items-end gap-2">
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="mb-1 h-4 w-16" />
                  </div>
                  <Skeleton className="h-4 w-64 max-w-full" />
                </div>

                {/* Feature List */}
                <div className="flex-1 space-y-2.5">
                  {Array.from({ length: isHighlighted ? 4 : 3 }).map(
                    (__, fIndex) => (
                      <div key={fIndex} className="flex items-center gap-2">
                        <Skeleton className="size-4 shrink-0 rounded-full" />
                        <Skeleton className="h-4 w-44 sm:w-52" />
                      </div>
                    ),
                  )}
                </div>

                {/* CTA Button Skeleton */}
                <Skeleton className="h-11 w-full rounded-md" />
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Comparison Table Skeleton */}
      <Card className="mx-auto mt-8 max-w-4xl overflow-hidden">
        <CardContent className="p-0">
          <div className="border-border grid grid-cols-3 items-center gap-4 border-b px-4 py-3">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="mx-auto h-4 w-12" />
            <Skeleton className="mx-auto h-4 w-16" />
          </div>

          <div className="divide-border/60 divide-y">
            {Array.from({ length: 5 }).map((_, rowIndex) => (
              <div
                key={rowIndex}
                className="grid grid-cols-3 items-center gap-4 px-4 py-3.5"
              >
                <Skeleton className="h-4 w-36 sm:w-44" />
                <Skeleton className="mx-auto h-4 w-14 rounded-full" />
                <Skeleton className="mx-auto h-4 w-16 rounded-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Footnote Skeleton */}
      <div className="mx-auto mt-6 flex max-w-2xl items-center justify-center gap-2">
        <Skeleton className="size-4 shrink-0 rounded-full" />
        <Skeleton className="h-3.5 w-72 max-w-full sm:w-96" />
      </div>
    </div>
  );
};

export default VendorSubscriptionLoading;
