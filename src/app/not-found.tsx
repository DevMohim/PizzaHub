import Link from "next/link";
import { ArrowLeft, Home, UtensilsCrossed } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <main className="bg-(image:--gradient-warm) relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden px-4 py-16">
      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="bg-primary/10 pointer-events-none absolute -top-24 -left-16 size-72 rounded-full blur-3xl"
      />
      <div
        aria-hidden="true"
        className="bg-secondary/10 pointer-events-none absolute -right-16 -bottom-24 size-72 rounded-full blur-3xl"
      />

      <div className="relative w-full max-w-xl text-center">
        {/* Pizza illustration */}
        <div className="mx-auto mb-6 flex size-40 items-center justify-center">
          <svg
            viewBox="0 0 200 200"
            className="animate-[spin_24s_linear_infinite] size-full drop-shadow-lg"
            aria-hidden="true"
          >
            {/* Crust */}
            <circle cx="100" cy="100" r="96" fill="#D98B3A" />
            {/* Sauce */}
            <circle cx="100" cy="100" r="84" fill="#C8102E" />
            {/* Cheese */}
            <circle cx="100" cy="100" r="78" fill="#FFD56B" />
            {/* Toppings */}
            <circle cx="70" cy="75" r="9" fill="#8B1E1E" />
            <circle cx="130" cy="80" r="8" fill="#8B1E1E" />
            <circle cx="95" cy="125" r="10" fill="#8B1E1E" />
            <circle cx="140" cy="130" r="7" fill="#2E7D32" />
            <circle cx="60" cy="130" r="7" fill="#2E7D32" />
            <circle cx="110" cy="60" r="6" fill="#2E7D32" />
            {/* Slice lines */}
            <line
              x1="100"
              y1="100"
              x2="100"
              y2="16"
              stroke="#D98B3A"
              strokeWidth="3"
            />
            <line
              x1="100"
              y1="100"
              x2="184"
              y2="100"
              stroke="#D98B3A"
              strokeWidth="3"
            />
            <line
              x1="100"
              y1="100"
              x2="16"
              y2="100"
              stroke="#D98B3A"
              strokeWidth="3"
            />
            <line
              x1="100"
              y1="100"
              x2="100"
              y2="184"
              stroke="#D98B3A"
              strokeWidth="3"
            />
          </svg>
        </div>

        <p className="text-primary font-heading text-sm font-semibold tracking-widest uppercase">
          Error 404
        </p>
        <h1 className="font-heading mt-2 text-4xl font-bold sm:text-5xl">
          Oops! This slice is missing
        </h1>
        <p className="text-muted-foreground mx-auto mt-4 max-w-md text-sm sm:text-base">
          The page you are looking for may have been moved, removed, or never
          existed. Let&apos;s get you back to something delicious.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className={cn(
              buttonVariants({ size: "lg" }),
              "h-11 w-full bg-(image:--gradient-primary) text-white hover:opacity-90 sm:w-auto",
            )}
          >
            <Home aria-hidden="true" />
            Back to Home
          </Link>
          <Link
            href="/browse-menu"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "h-11 w-full sm:w-auto",
            )}
          >
            <UtensilsCrossed aria-hidden="true" />
            Browse Menu
          </Link>
        </div>

        <Link
          href="/"
          className="text-muted-foreground hover:text-primary mt-6 inline-flex items-center gap-1.5 text-sm transition-colors"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Go back
        </Link>
      </div>
    </main>
  );
}
