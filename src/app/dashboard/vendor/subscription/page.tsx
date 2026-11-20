import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  CheckCircle2,
  Crown,
  Sparkles,
  Store,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "cn";

/* -------------------------------------------------------------------------- */
/*                          Plan data                                         */
/* -------------------------------------------------------------------------- */

/**
 * Each plan card is driven by this array, so adding/removing a feature only
 * means editing one line here. UI only — no checkout is wired up yet.
 */
const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Everything you need to get your pizzeria online.",
    highlight: false,
    cta: "Your current plan",
    features: [
      "Up to 3 active menu items",
      "Basic vendor dashboard",
      "Order management",
    ],
  },
  {
    name: "Premium",
    price: "$29.99",
    period: "/ month",
    description:
      "Grow without limits and stand out from the competition.",
    highlight: true,
    cta: "Upgrade to Premium",
    features: [
      "Unlimited active menu items",
      "Premium vendor badge",
      "Featured menu placement",
      "All Free features",
    ],
  },
] as const;

/* -------------------------------------------------------------------------- */
/*                          Small shared bits                                 */
/* -------------------------------------------------------------------------- */

/** Section heading (small uppercase label + big title + subtitle). */
const SectionHeading = ({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) => (
  <div className="mx-auto max-w-2xl text-center">
    <span className="bg-primary/10 text-primary inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase">
      <Sparkles className="size-3.5" aria-hidden="true" />
      {eyebrow}
    </span>
    <h1 className="font-heading mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
      {title}
    </h1>
    <p className="text-muted-foreground mt-2 text-sm sm:text-base">
      {subtitle}
    </p>
  </div>
);

/* -------------------------------------------------------------------------- */
/*                              Page                                          */
/* -------------------------------------------------------------------------- */

const VendorSubscriptionPage = () => {
  return (
    <div className="w-full px-4 py-8 md:px-6">
      <SectionHeading
        eyebrow="Vendor plans"
        title="Choose the right plan for your pizzeria"
        subtitle="Start free and upgrade any time. Upgrade to Premium to unlock unlimited menu items and featured placement."
      />

      {/* Plan cards */}
      <div className="mx-auto mt-8 grid max-w-4xl grid-cols-1 gap-5 md:grid-cols-2">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={cn(
              "relative overflow-hidden",
              plan.highlight
                ? "ring-2 ring-primary shadow-lg"
                : "ring-1 ring-foreground/10",
            )}
          >
            {/* Gradient top bar for the highlighted plan */}
            {plan.highlight && (
              <>
                <div
                  className="absolute inset-x-0 top-0 h-1.5"
                  style={{ background: "var(--gradient-primary)" }}
                  aria-hidden="true"
                />
                {/* "Most popular" badge */}
                <Badge
                  className="absolute top-3 right-3 bg-(image:--gradient-primary) text-white"
                  variant="outline"
                >
                  <Crown aria-hidden="true" />
                  Most popular
                </Badge>
              </>
            )}

            <CardContent className="flex h-full flex-col gap-5 pt-6">
              {/* Plan name */}
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "flex size-9 items-center justify-center rounded-xl",
                    plan.highlight
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {plan.highlight ? (
                    <Crown className="size-5" aria-hidden="true" />
                  ) : (
                    <Store className="size-5" aria-hidden="true" />
                  )}
                </span>
                <h2 className="font-heading text-xl font-bold">{plan.name}</h2>
              </div>

              {/* Price */}
              <div>
                <div className="flex items-end gap-1">
                  <span className="font-heading text-4xl font-extrabold tracking-tight">
                    {plan.price}
                  </span>
                  <span className="text-muted-foreground mb-1 text-sm">
                    {plan.period}
                  </span>
                </div>
                <p className="text-muted-foreground mt-1 text-sm">
                  {plan.description}
                </p>
              </div>

              {/* Features */}
              <ul className="flex-1 space-y-2.5 text-sm">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <CheckCircle2
                      className="text-success mt-0.5 size-4 shrink-0"
                      aria-hidden="true"
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              {plan.highlight ? (
                <Link
                  href="/checkout"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "h-11 w-full bg-(image:--gradient-primary) text-white hover:opacity-90",
                  )}
                >
                  {plan.cta}
                  <ArrowRight aria-hidden="true" />
                </Link>
              ) : (
                <button
                  type="button"
                  disabled
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "h-11 w-full cursor-not-allowed opacity-60",
                  )}
                >
                  <Check aria-hidden="true" />
                  {plan.cta}
                </button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Feature comparison */}
      <Card className="mx-auto mt-8 max-w-4xl">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="text-muted-foreground px-4 py-3 font-medium">
                    What you get
                  </th>
                  <th className="text-muted-foreground px-4 py-3 text-center font-medium">
                    Free
                  </th>
                  <th className="text-muted-foreground px-4 py-3 text-center font-medium">
                    Premium
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: "Active menu items", free: "Up to 3", premium: "Unlimited" },
                  { feature: "Vendor dashboard", free: true, premium: true },
                  { feature: "Order management", free: true, premium: true },
                  { feature: "Premium vendor badge", free: false, premium: true },
                  { feature: "Featured menu placement", free: false, premium: true },
                ].map((row) => (
                  <tr
                    key={row.feature}
                    className="border-b border-border/60 last:border-0"
                  >
                    <td className="px-4 py-3 font-medium">{row.feature}</td>
                    <td className="px-4 py-3 text-center">
                      {typeof row.free === "boolean" ? (
                        row.free ? (
                          <Check className="text-success mx-auto size-4" aria-label="Included" />
                        ) : (
                          <X className="text-muted-foreground mx-auto size-4" aria-label="Not included" />
                        )
                      ) : (
                        <span className="text-muted-foreground">{row.free}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {typeof row.premium === "boolean" ? (
                        row.premium ? (
                          <Check className="text-success mx-auto size-4" aria-label="Included" />
                        ) : (
                          <X className="text-muted-foreground mx-auto size-4" aria-label="Not included" />
                        )
                      ) : (
                        <span className="font-heading text-primary font-semibold">
                          {row.premium}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Footnote */}
      <p className="text-muted-foreground mx-auto mt-6 flex max-w-2xl items-center justify-center gap-1.5 text-center text-xs">
        <BadgeCheck className="size-4 shrink-0" aria-hidden="true" />
        Cancel any time. Premium is billed monthly and can be cancelled whenever
        you like.
      </p>
    </div>
  );
};

export default VendorSubscriptionPage;