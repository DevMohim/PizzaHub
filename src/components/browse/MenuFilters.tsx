"use client";

import { ArrowUpDown, MapPin, Search, UtensilsCrossed, X } from "lucide-react";
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

const CATEGORY_OPTIONS = [
  { value: "all", label: "All Categories" },
  ...MENU_CATEGORIES.map((category) => ({
    value: category.value,
    label: category.label,
  })),
];

const SORT_OPTIONS = [
  { value: "default", label: "Newest first" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

interface MenuFiltersProps {
  search: string;
  category: string;
  location: string;
  sort: string;
  /** Unique locations from the loaded menu items. */
  locations: string[];
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onReset: () => void;
  hasFilters: boolean;
}

/**
 * Search + category/location filter bar for Browse Menu.
 * The page owns the filter state and passes it down as props.
 */
const MenuFilters = ({
  search,
  category,
  location,
  sort,
  locations,
  onSearchChange,
  onCategoryChange,
  onLocationChange,
  onSortChange,
  onReset,
  hasFilters,
}: MenuFiltersProps) => {
  const locationOptions = [
    { value: "all", label: "All Locations" },
    ...locations.map((item) => ({ value: item, label: item })),
  ];

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1.3fr_1fr_1fr_1fr]">
        {/* Search by name */}
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
            placeholder="Search pizza by name…"
            aria-label="Search menu by name"
            className="h-10 pl-9"
          />
        </div>

        {/* Filter by category */}
        <Select
          name="category"
          items={CATEGORY_OPTIONS}
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
            {CATEGORY_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Filter by location */}
        <Select
          name="location"
          items={locationOptions}
          value={location}
          onValueChange={(value) => onLocationChange(value ?? "all")}
        >
          <SelectTrigger className="h-10 w-full" aria-label="Filter by location">
            <MapPin
              className="text-muted-foreground size-4"
              aria-hidden="true"
            />
            <SelectValue placeholder="All Locations" />
          </SelectTrigger>
          <SelectContent>
            {locationOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort by price */}
        <Select
          name="sort"
          items={SORT_OPTIONS}
          value={sort}
          onValueChange={(value) => onSortChange(value ?? "default")}
        >
          <SelectTrigger className="h-10 w-full" aria-label="Sort menu items">
            <ArrowUpDown
              className="text-muted-foreground size-4"
              aria-hidden="true"
            />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Clear filters */}
      {hasFilters && (
        <div className="mt-3 flex justify-end">
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
        </div>
      )}
    </div>
  );
};

export default MenuFilters;