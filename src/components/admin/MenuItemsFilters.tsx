"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { RotateCcw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MENU_CATEGORIES } from "@/config/menuCategories";

export interface VendorOption {
  value: string;
  label: string;
}

const STATUS_OPTIONS = [
  { value: "all", label: "সব status" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved (সব)" },
  { value: "active", label: "Active (live)" },
  { value: "inactive", label: "Inactive" },
  { value: "rejected", label: "Rejected" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "name-asc", label: "Name: A to Z" },
];

const selectClass =
  "border-input bg-background focus:ring-ring h-10 w-full rounded-lg border px-3 text-sm outline-none focus:ring-2";

interface MenuItemsFiltersProps {
  initial: {
    search: string;
    status: string;
    category: string;
    vendor: string;
    sort: string;
  };
  vendors: VendorOption[];
  resultCount: number;
  totalCount: number;
}

const MenuItemsFilters = ({
  initial,
  vendors,
  resultCount,
  totalCount,
}: MenuItemsFiltersProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(initial.search);
  const [previousInitialSearch, setPreviousInitialSearch] = useState(initial.search);

  // URL থেকে আসা নতুন search value এলে render-এর সময় input sync করা
  if (initial.search !== previousInitialSearch) {
    setPreviousInitialSearch(initial.search);
    setSearch(initial.search);
  }


  const updateParams = (changes: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(changes).forEach(([key, value]) => {
      if (
        value === null ||
        value === "" ||
        value === "all" ||
        (key === "sort" && value === "newest")
      ) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    // ফিল্টার বদলালে সবসময় প্রথম page থেকে শুরু
    params.delete("page");

    const query = params.toString();
    startTransition(() => {
      router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
    });
  };
  // Debounce: টাইপ শেষ হওয়ার পর URL আপডেট
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
    initial.search !== "" ||
    initial.status !== "all" ||
    initial.category !== "all" ||
    initial.vendor !== "all" ||
    initial.sort !== "newest";

  const resetFilters = () => {
    setSearch("");
    startTransition(() => {
      router.push(pathname, { scroll: false });
    });
  };

  return (
    <div className="border-border bg-card space-y-3 rounded-2xl border p-4 shadow-xs">
      <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
        <label className="relative block">
          <Search
            className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2"
            aria-hidden="true"
          />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Item name, description, location, বা vendor খুঁজুন"
            className="border-input bg-background focus:ring-ring h-10 w-full rounded-lg border pr-3 pl-9 text-sm outline-none focus:ring-2"
          />
        </label>

        <select
          value={initial.sort}
          onChange={(e) => updateParams({ sort: e.target.value })}
          className={selectClass}
          aria-label="Sort"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <Button
          type="button"
          variant="outline"
          onClick={resetFilters}
          disabled={!hasFilters || isPending}
          className="h-10"
        >
          <RotateCcw aria-hidden="true" />
          Reset
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <select
          value={initial.status}
          onChange={(e) => updateParams({ status: e.target.value })}
          className={selectClass}
          aria-label="Status"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <select
          value={initial.category}
          onChange={(e) => updateParams({ category: e.target.value })}
          className={selectClass}
          aria-label="Category"
        >
          <option value="all">সব category</option>
          {MENU_CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>

        <select
          value={initial.vendor}
          onChange={(e) => updateParams({ vendor: e.target.value })}
          className={selectClass}
          aria-label="Vendor"
        >
          <option value="all">সব vendor</option>
          {vendors.map((v) => (
            <option key={v.value} value={v.value}>
              {v.label}
            </option>
          ))}
        </select>
      </div>

      <p className="text-muted-foreground text-xs">
        {isPending
          ? "Loading..."
          : `${resultCount} / ${totalCount} টি item দেখাচ্ছে`}
      </p>
    </div>
  );
};

export default MenuItemsFilters;
