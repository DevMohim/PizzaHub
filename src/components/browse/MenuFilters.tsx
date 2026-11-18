"use client";

import { MapPin, Search, UtensilsCrossed } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MENU_CATEGORIES } from "@/config/menuCategories";

interface MenuFiltersProps {
  /** Unique locations derived from the loaded menu items. */
  locations?: string[];
}

/**
 * Search + category/location filter bar for Browse Menu.
 * Design only — wire up handlers when implementing functionality.
 */
const MenuFilters = ({ locations = [] }: MenuFiltersProps) => {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
      <div className="grid gap-3 md:grid-cols-[1fr_220px_220px]">
        {/* Search by name */}
        <div className="relative">
          <Search
            className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
            aria-hidden="true"
          />
          <Input
            type="search"
            name="search"
            placeholder="Search pizza by name…"
            aria-label="Search menu by name"
            className="h-10 pl-9"
          />
        </div>

        {/* Filter by category */}
        <Select name="category">
          <SelectTrigger className="h-10 w-full" aria-label="Filter by category">
            <UtensilsCrossed className="text-muted-foreground size-4" aria-hidden="true" />
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

        {/* Filter by location */}
        <Select name="location">
          <SelectTrigger className="h-10 w-full" aria-label="Filter by location">
            <MapPin className="text-muted-foreground size-4" aria-hidden="true" />
            <SelectValue placeholder="All Locations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            {locations.map((location) => (
              <SelectItem key={location} value={location}>
                {location}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default MenuFilters;
