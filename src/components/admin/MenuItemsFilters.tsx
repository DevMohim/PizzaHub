"use client";

import { Search, SlidersHorizontal, UtensilsCrossed } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MENU_CATEGORIES } from "@/config/menuCategories";

/**
 * Search + status/category filter bar for the admin Manage Menu Items page.
 * Design only — wire up handlers when implementing functionality.
 */
const MenuItemsFilters = () => {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
      <div className="grid gap-3 md:grid-cols-[1fr_200px_220px]">
        {/* Search by item name */}
        <div className="relative">
          <Search
            className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
            aria-hidden="true"
          />
          <Input
            type="search"
            name="search"
            placeholder="Search by item name…"
            aria-label="Search menu items by name"
            className="h-10 pl-9"
          />
        </div>

        {/* Filter by status */}
        <Select name="status">
          <SelectTrigger className="h-10 w-full" aria-label="Filter by status">
            <SlidersHorizontal
              className="text-muted-foreground size-4"
              aria-hidden="true"
            />
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>

        {/* Filter by category */}
        <Select name="category">
          <SelectTrigger className="h-10 w-full" aria-label="Filter by category">
            <UtensilsCrossed
              className="text-muted-foreground size-4"
              aria-hidden="true"
            />
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {MENU_CATEGORIES.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default MenuItemsFilters;
