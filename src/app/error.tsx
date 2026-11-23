"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("[app error]", error);
  }, [error]);

  return (
    <main className="bg-(image:--gradient-warm) relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden px-4 py-16">
      <div className="relative w-full max-w-xl text-center">
        <div className="bg-destructive/10 text-destructive mx-auto mb-6 flex size-20 items-center justify-center rounded-full">
          <AlertTriangle className="size-10" aria-hidden="true" />
        </div>

        <p className="text-destructive font-heading text-sm font-semibold tracking-widest uppercase">
          Something went wrong
        </p>
        <h1 className="font-heading mt-2 text-3xl font-bold sm:text-4xl">
          Our kitchen hit a snag
        </h1>
        <p className="text-muted-foreground mx-auto mt-4 max-w-md text-sm sm:text-base">
          An unexpected error occurred while loading this page. Please try
          again, or head back home.
        </p>

        {error.digest && (
          <p className="text-muted-foreground mt-3 font-mono text-xs">
            Error ID: {error.digest}
          </p>
        )}

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className={cn(
              buttonVariants({ size: "lg" }),
              "h-11 w-full cursor-pointer bg-(image:--gradient-primary) text-white hover:opacity-90 sm:w-auto",
            )}
          >
            <RotateCcw aria-hidden="true" />
            Try again
          </button>
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "h-11 w-full sm:w-auto",
            )}
          >
            <Home aria-hidden="true" />
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
