"use client";

import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { createTransaction } from "@/lib/actions/transaction";

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

const formattedPrice = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: premiumPlan.currency,
}).format(premiumPlan.price);

const SubscriptionButton = () => {
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleCheckout = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsRedirecting(true);

    try {
      // Token apiFetch নিজেই পাঠায়। Price ও vendor server ঠিক করে।
      const result = await createTransaction();

      if (!result.url) {
        throw new Error("Checkout link পাওয়া যায়নি। আবার চেষ্টা করুন।");
      }

      window.location.assign(result.url);
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
      setIsRedirecting(false);
    }
  };

  return (
    <form onSubmit={handleCheckout}>
      <CardContent className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-heading font-semibold text-foreground">
              {premiumPlan.name} plan
            </p>
            <p className="font-sans text-xs text-muted-foreground">
              Billed every {premiumPlan.interval}
            </p>
          </div>
          <p className="font-heading text-xl font-bold text-foreground">
            {formattedPrice}
          </p>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <span className="font-heading font-semibold text-foreground">
            Total today
          </span>
          <span className="font-heading text-xl font-bold text-foreground">
            {formattedPrice}
          </span>
        </div>

        <Button
          type="submit"
          disabled={isRedirecting}
          className="h-12 w-full cursor-pointer rounded-xl bg-primary font-heading text-base font-semibold text-primary-foreground hover:bg-primary-hover disabled:opacity-70"
        >
          {isRedirecting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Redirecting to Stripe...
            </>
          ) : (
            "Continue to payment"
          )}
        </Button>

        <p className="text-muted-foreground flex items-center justify-center gap-1.5 text-center font-sans text-xs">
          <Lock className="h-3.5 w-3.5" />
          Secure payment by Stripe
        </p>
      </CardContent>
    </form>
  );
};

export default SubscriptionButton;
