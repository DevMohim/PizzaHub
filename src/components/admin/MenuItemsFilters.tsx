"use client";

import { Search, SlidersHorizontal, UtensilsCrossed, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MENU_CATEGORIES } from "@/config/menuCategories";

const statusOptions = [
  { value: "all", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "rejected", label: "Rejected" },
];

const categoryOptions = [
  { value: "all", label: "All Categories" },
  ...MENU_CATEGORIES.map((category) => ({
    value: category.value,
    label: category.label,
  })),
];

interface MenuItemsFiltersProps {
  search: string;
  status: string;
  category: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onReset: () => void;
  hasFilters: boolean;
  resultCount: number;
  totalCount: number;
}

/**
 * Search + status/category filter bar for the admin Manage Menu Items page.
 * The page owns the filter state and passes it down as props.
 */
const MenuItemsFilters = ({
  search,
  status,
  category,
  onSearchChange,
  onStatusChange,
  onCategoryChange,
  onReset,
  hasFilters,
  resultCount,
  totalCount,
}: MenuItemsFiltersProps) => {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
      <div className="grid gap-3 md:grid-cols-[1fr_200px_220px]">
        {/* Search by item name or vendor email */}
        <div className="relative">
          <Search
            className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
            aria-hidden="true"
          />
          <Input
            type="search"
            name="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by item name or vendor email…"
            aria-label="Search menu items by name or vendor email"
            className="h-10 pl-9"
          />
        </div>

        {/* Filter by status */}
        <Select
          name="status"
          items={statusOptions}
          value={status}
          onValueChange={(value) => onStatusChange(value ?? "all")}
        >
          <SelectTrigger className="h-10 w-full" aria-label="Filter by status">
            <SlidersHorizontal
              className="text-muted-foreground size-4"
              aria-hidden="true"
            />
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Filter by category */}
        <Select
          name="category"
          items={categoryOptions}
          value={category}
          onValueChange={(value) => onCategoryChange(value ?? "all")}
        >
          <SelectTrigger className="h-10 w-full" aria-label="Filter by category">
            <UtensilsCrossed
              className="text-muted-foreground size-4"
              aria-hidden="true"
            />
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            {categoryOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Result count + clear button */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-muted-foreground text-xs">
          Showing{" "}
          <span className="text-foreground font-medium">{resultCount}</span> of{" "}
          {totalCount} {totalCount === 1 ? "submission" : "submissions"}
        </p>

        {hasFilters && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="text-muted-foreground h-7 text-xs"
          >
            <X aria-hidden="true" />
            Clear filters
          </Button>
        )}
      </div>
    </div>
  );
};

export default MenuItemsFilters;
