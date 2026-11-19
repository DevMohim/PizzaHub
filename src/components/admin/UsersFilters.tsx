"use client";

import { Search, ShieldCheck, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * Search + role/status filter bar for the admin Manage Users page.
 * Design only — wire up handlers when implementing functionality.
 */
const UsersFilters = () => {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
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
            placeholder="Search by name or email…"
            aria-label="Search users by name or email"
            className="h-10 pl-9"
          />
        </div>

        {/* Filter by role */}
        <Select name="role">
          <SelectTrigger className="h-10 w-full" aria-label="Filter by role">
            <Users
              className="text-muted-foreground size-4"
              aria-hidden="true"
            />
            <SelectValue placeholder="All Roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="customer">Customer</SelectItem>
            <SelectItem value="vendor">Vendor</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>

        {/* Filter by status */}
        <Select name="status">
          <SelectTrigger className="h-10 w-full" aria-label="Filter by status">
            <ShieldCheck
              className="text-muted-foreground size-4"
              aria-hidden="true"
            />
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="blocked">Blocked</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default UsersFilters;
