"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const ROLE_ROOTS = [
  { role: "customer", href: "/dashboard/customer" },
  { role: "vendor", href: "/dashboard/vendor" },
  { role: "admin", href: "/dashboard/admin" },
] as const;

const normalize = (path: string) => path.replace(/\/+$/, "");

/**
 * Shared dashboard top bar:
 * - Mobile: hamburger trigger so the offcanvas sidebar can be opened.
 * - Sub-pages: a "Back to dashboard" link (hidden on the role overview).
 */
const BackToDashboard = () => {
  const pathname = usePathname();
  const current = normalize(pathname);

  const match = ROLE_ROOTS.find(
    (root) => current === root.href || current.startsWith(`${root.href}/`),
  );

  const isOverview = !!match && current === match.href;

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-4 md:px-6",
        isOverview ? "pt-3 md:pt-0" : "pt-3 md:pt-4",
      )}
    >
      <SidebarTrigger className="-ml-1 md:hidden" />

      {match && !isOverview ? (
        <Link
          href={match.href}
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "-ml-1.5 text-muted-foreground hover:text-foreground",
          )}
        >
          <ArrowLeft aria-hidden="true" />
          Back to dashboard
        </Link>
      ) : null}
    </div>
  );
};

export default BackToDashboard;