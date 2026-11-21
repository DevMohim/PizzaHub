
import Link from "next/link";
import { ArrowLeft, Check, Crown, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SubscriptionButtion from "@/components/vendor/SubscriptionButtion";




// Mock plan data — replace with plan info from API later
const premiumPlan = {
  name: "Premium",
  price: 29.99,
  currency: "USD",
  interval: "month",
  features: [
    "Unlimited active menu items",
    "Premium badge on your restaurant",
    "Featured placement on the homepage and menu",
    "Priority review for new menu items",
  ],
};


export default async function VendorSubscriptionCheckoutPage() {
  
  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/dashboard/vendor/subscription"
            className="inline-flex items-center gap-2 font-sans text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to subscription
          </Link>
          <h1 className="mt-3 font-heading text-2xl font-bold text-foreground sm:text-3xl">
            Upgrade to Premium
          </h1>
          <p className="mt-1 font-sans text-sm text-muted-foreground">
            Remove the item limit and get more visibility for your restaurant.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          {/* Plan details */}
          <Card className="rounded-2xl border-border shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-heading text-lg text-foreground">
                <Crown className="h-5 w-5 text-primary" />
                What you get with Premium
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <ul className="flex flex-col gap-3">
                {premiumPlan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-primary">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    <span className="font-sans text-sm text-foreground">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-2 flex items-start gap-3 rounded-xl bg-accent p-4">
                <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <p className="font-sans text-sm text-muted-foreground">
                  Your Premium plan activates after Stripe confirms the payment.
                  This usually takes a few seconds.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Summary + pay */}
          <div className="lg:sticky lg:top-6 lg:self-start">
            <Card className="rounded-2xl border-border shadow-sm">
              <CardHeader>
                <CardTitle className="font-heading text-lg text-foreground">
                  Order summary
                </CardTitle>
              </CardHeader>
              
              <SubscriptionButtion />
              
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
