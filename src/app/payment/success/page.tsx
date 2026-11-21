import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Payment Successful | PizzaHub",
};

const PREMIUM_PLAN = {
  name: "Premium",
  price: 29.99,
  currency: "USD",
};

const formatPrice = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: PREMIUM_PLAN.currency,
}).format(PREMIUM_PLAN.price);

const SuccessPage = () => {
  return (
    <section className="flex w-full items-center justify-center px-4 py-12 sm:px-6">
      <Card className="animate-in fade-in-0 slide-in-from-bottom-4 w-full max-w-xl overflow-hidden">
        <CardContent className="flex flex-col items-center gap-6 p-6 text-center sm:p-10">
          {/* Success icon */}
          <div className="flex size-20 items-center justify-center rounded-full bg-success/10">
            <CheckCircle2 className="size-10 text-success" aria-hidden="true" />
          </div>

          {/* Copy */}
          <div className="flex flex-col items-center gap-3">
            <span className="bg-success/10 text-success inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase ring-1 ring-success/30">
              Payment confirmed
            </span>
            <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
              Payment{" "}
              <span className="gradient-text">successful</span>!
            </h1>
            <p className="text-muted-foreground max-w-md text-sm leading-relaxed sm:text-base">
              Your PizzaHub Premium subscription payment was completed. Your
              plan is now{" "}
              <span className="font-semibold text-foreground">active</span> —
              enjoy unlimited menu items, the Premium badge and featured
              placement for your restaurant.
            </p>
          </div>

          {/* Order summary */}
          <div className="w-full rounded-xl border border-border bg-muted/50 p-4">
            <div className="flex items-center justify-between gap-4">
              <span className="font-heading font-semibold text-foreground">
                Plan
              </span>
              <span className="font-sans text-sm font-medium text-foreground">
                {PREMIUM_PLAN.name} plan
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between gap-4">
              <span className="font-heading font-semibold text-foreground">
                Amount
              </span>
              <span className="font-heading text-lg font-bold text-foreground">
                {formatPrice}
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between gap-4">
              <span className="font-heading font-semibold text-foreground">
                Billing
              </span>
              <span className="font-sans text-sm font-medium text-foreground">
                Monthly
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex w-full flex-col gap-3 sm:flex-row">
            <Link
              href="/dashboard/vendor"
              className={buttonVariants({
                size: "lg",
                className:
                  "h-11 w-full rounded-xl bg-(image:--gradient-primary) font-heading text-base font-semibold text-white hover:opacity-90",
              })}
            >
              Go to Vendor Dashboard
            </Link>
            <Link
              href="/browse-menu"
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                className: "h-11 w-full rounded-xl",
              })}
            >
              Back to Menu
            </Link>
          </div>

          <p className="text-muted-foreground text-xs">
            A receipt and confirmation will be sent to your registered email
            address.
          </p>
        </CardContent>
      </Card>
    </section>
  );
};

export default SuccessPage;
