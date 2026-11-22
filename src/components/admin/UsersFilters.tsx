"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { RotateCcw, Search, ShieldCheck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ROLE_OPTIONS = [
  { value: "all", label: "All Roles" },
  { value: "customer", label: "Customer" },
  { value: "vendor", label: "Vendor" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "active", label: "Active" },
  { value: "blocked", label: "Blocked" },
];

interface UsersFiltersProps {
  initial: {
    search: string;
    role: string;
    status: string;
  };
  resultCount: number;
}

/**
 * Search + role/status filter bar for the admin Manage Users page.
 * The filters are part of the URL, so the server component can pass them to
 * `GET /api/users` and the page survives reloads and back/forward navigation.
 */
const UsersFilters = ({ initial, resultCount }: UsersFiltersProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(initial.search);
  const [previousInitialSearch, setPreviousInitialSearch] =
    useState(initial.search);

  // Keep the input in sync when the URL changes (e.g. browser back button).
  if (initial.search !== previousInitialSearch) {
    setPreviousInitialSearch(initial.search);
    setSearch(initial.search);
  }

  const updateParams = (changes: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(changes).forEach(([key, value]) => {
      if (!value || value === "all") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    const query = params.toString();

    startTransition(() => {
      router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
    });
  };

  // Wait until the user stops typing before updating the URL / refetching.
  useEffect(() => {
    const trimmed = search.trim();
    if (trimmed === initial.search) return;

    const timer = setTimeout(() => {
      updateParams({ search: trimmed || null });
    }, 400);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const hasFilters =
    initial.search !== "" || initial.role !== "all" || initial.status !== "all";

  const resetFilters = () => {
    setSearch("");
    startTransition(() => {
      router.push(pathname, { scroll: false });
    });
  };

  return (
    <div className="border-border bg-card space-y-3 rounded-2xl border p-4 shadow-xs">
      <div className="grid gap-3 md:grid-cols-[1fr_200px_200px]">
        {/* Search by name or email */}
        <div className="relative">
          <Search
            className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
            aria-hidden="true"
          />
          <Input
            type="search"
            name="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name or email…"
            aria-label="Search users by name or email"
            className="h-10 pl-9"
          />
        </div>

        {/* Filter by role */}
        <Select
          name="role"
          items={ROLE_OPTIONS}
          value={initial.role}
          onValueChange={(value) => updateParams({ role: value ?? "all" })}
        >
          <SelectTrigger className="h-10 w-full" aria-label="Filter by role">
            <Users
              className="text-muted-foreground size-4"
              aria-hidden="true"
            />
            <SelectValue placeholder="All Roles" />
          </SelectTrigger>
          <SelectContent>
            {ROLE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Filter by status */}
        <Select
          name="status"
          items={STATUS_OPTIONS}
          value={initial.status}
          onValueChange={(value) => updateParams({ status: value ?? "all" })}
        >
          <SelectTrigger className="h-10 w-full" aria-label="Filter by status">
            <ShieldCheck
              className="text-muted-foreground size-4"
              aria-hidden="true"
            />
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {hasFilters && (
        <div className="flex items-center justify-between gap-3">
          <p className="text-muted-foreground text-xs">
            {isPending
              ? "Filtering users…"
              : `${resultCount} ${resultCount === 1 ? "user" : "users"}`}
          </p>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            disabled={isPending}
            className="text-muted-foreground h-7 text-xs"
          >
            <RotateCcw aria-hidden="true" />
            Reset
          </Button>
        </div>
      )}
    </div>
  );
};

export default UsersFilters;