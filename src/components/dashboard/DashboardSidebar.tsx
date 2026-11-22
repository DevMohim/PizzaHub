"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, Store, User } from "lucide-react";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useSession } from "@/lib/auth-client";
import type { UserRole } from "@/types/user.type";
import { cn } from "@/lib/utils";
import { roleBasedMenuItems } from "@/config/roleBasedMenuItems";

type NavItem = {
  label: string;
  href: string;
  icon: React.ElementType;
};

const getActiveHref = (pathname: string, items: NavItem[]) => {
  const normalize = (href: string) => href.replace(/\/+$/, "");

  const exact = items.find((item) => normalize(item.href) === pathname);
  if (exact) return exact.href;

  const parent = items
    .filter((item) => pathname.startsWith(`${normalize(item.href)}/`))
    .sort((a, b) => normalize(b.href).length - normalize(a.href).length)[0];

  return parent?.href;
};

const roleMeta: Record<UserRole, { label: string; icon: React.ElementType }> = {
  customer: { label: "Customer", icon: User },
  vendor: { label: "Vendor", icon: Store },
  admin: { label: "Admin", icon: ShieldCheck },
};

const isUserRole = (value: unknown): value is UserRole =>
  typeof value === "string" && value in roleMeta;

const DashboardSidebar = () => {
  const { data: session, isPending } = useSession();
  const pathname = usePathname();

  const sessionUser = session?.user;
  const role: UserRole = isUserRole(sessionUser?.role)
    ? sessionUser.role
    : "customer";
  const name = sessionUser?.name ?? "";
  const image = sessionUser?.image ?? undefined;

  const RoleIcon = roleMeta[role].icon;
  const items: NavItem[] = roleBasedMenuItems[role];
  const activeHref = getActiveHref(pathname, items);

  return (
    <Sidebar>
      <SidebarHeader className="mt-16 p-3">
        {isPending ? (
          <div className="border-sidebar-border bg-sidebar-accent/50 flex items-center gap-3 rounded-xl border p-2.5">
            <Skeleton className="size-11 rounded-xl" />
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <Skeleton className="h-3.5 w-28" />
              <Skeleton className="h-4 w-20 rounded-full" />
            </div>
          </div>
        ) : sessionUser ? (
          <div className="border-sidebar-border bg-sidebar-accent/50 flex items-center gap-3 rounded-xl border p-2.5 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-2">
            <Avatar className="ring-sidebar-primary/25 size-11 rounded-xl ring-2 group-data-[collapsible=icon]:size-8 after:rounded-xl">
              <AvatarImage src={image} alt={name} className="rounded-xl" />
              <AvatarFallback
                className="font-heading rounded-xl text-sm font-bold text-white"
                style={{ background: "var(--gradient-primary)" }}
              >
                {name.charAt(0).toUpperCase() || "?"}
              </AvatarFallback>
              <AvatarBadge className="bg-success" />
            </Avatar>

            <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
              <p
                className="font-heading truncate text-sm font-semibold"
                title={name}
              >
                {name}
              </p>
              <span className="bg-sidebar-primary text-sidebar-primary-foreground mt-1 inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold tracking-wide uppercase">
                <RoleIcon className="size-3" aria-hidden="true" />
                {roleMeta[role].label}
              </span>
            </div>
          </div>
        ) : null}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup />
        <SidebarMenu>
          {items.map((item) => {
            const isActive = activeHref === item.href;
            const Icon = item.icon;

            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  render={<Link href={item.href} />}
                  isActive={isActive}
                  className={cn(
                    "relative",
                    isActive &&
                      "data-active:bg-sidebar-primary/10! data-active:text-sidebar-primary! data-active:font-semibold!",
                  )}
                >
                  <Icon />
                  <span>{item.label}</span>
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="bg-sidebar-primary absolute inset-y-1.5 left-0 w-1 rounded-full"
                    />
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
        <SidebarGroup />
      </SidebarContent>

      <SidebarFooter />
    </Sidebar>
  );
};

export default DashboardSidebar;
