import type { Metadata } from "next";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Payment Cancelled | PizzaHub",
};

const CancelPage = () => {
  return (
    <section className="flex w-full items-center justify-center px-4 py-12 sm:px-6">
      <Card className="animate-in fade-in-0 slide-in-from-bottom-4 w-full max-w-xl overflow-hidden">
        <CardContent className="flex flex-col items-center gap-6 p-6 text-center sm:p-10">
          {/* Cancelled icon */}
          <div className="flex size-20 items-center justify-center rounded-full bg-warning/10">
            <AlertCircle className="size-10 text-warning" aria-hidden="true" />
          </div>

          {/* Copy */}
          <div className="flex flex-col items-center gap-3">
            <span className="bg-warning/10 text-warning inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase ring-1 ring-warning/30">
              Payment cancelled
            </span>
            <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
              Payment cancelled
            </h1>
            <p className="text-muted-foreground max-w-md text-sm leading-relaxed sm:text-base">
              We couldn&apos;t complete your payment, so your PizzaHub Premium
              subscription was not activated. No charge was made — you can retry
              the upgrade anytime.
            </p>
          </div>

          {/* Help note */}
          <div className="w-full rounded-xl border border-border bg-muted/50 p-4 text-center">
            <p className="text-muted-foreground text-sm">
              If you believe this was a mistake, contact our support team and
              we&apos;ll help you get your subscription sorted out.
            </p>
          </div>

          {/* Actions */}
          <div className="flex w-full flex-col gap-3 sm:flex-row">
            <Link
              href="/dashboard/vendor/subscription"
              className={buttonVariants({
                size: "lg",
                className:
                  "h-11 w-full rounded-xl bg-(image:--gradient-primary) font-heading text-base font-semibold text-white hover:opacity-90",
              })}
            >
              Back to Subscription
            </Link>
            <Link
              href="/browse-menu"
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                className: "h-11 w-full rounded-xl",
              })}
            >
              Go to Browse Menu
            </Link>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default CancelPage;
