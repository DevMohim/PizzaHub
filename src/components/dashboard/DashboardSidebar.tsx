"use client";

import { ShieldCheck, Store, User } from "lucide-react";
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { TSessionUser, UserRole } from "@/types/user.type";
import { cn } from "cn";
import { roleBasedMenuItems } from "@/config/roleBasedMenuItems";
import Link from "next/link";

const roleMeta: Record<UserRole, { label: string; icon: typeof User }> = {
  customer: { label: "Customer", icon: User },
  vendor: { label: "Vendor", icon: Store },
  admin: { label: "Admin", icon: ShieldCheck },
};

const DashboardSidebar = () => {
  const { data: session, isPending } = useSession();
  const user: TSessionUser | undefined = session?.user
    ? { ...session.user, image: session.user.image ?? "" }
    : undefined;

  const role: UserRole = user && user.role in roleMeta ? user.role : "customer";
  const RoleIcon = roleMeta[role].icon;

  const items = roleBasedMenuItems

  return (
    <Sidebar>
      <SidebarHeader className="p-3 mt-16">
        {isPending ? (
          /* Loading state while the session is resolved */
          <div className="flex items-center gap-3 rounded-xl border border-sidebar-border bg-sidebar-accent/50 p-2.5">
            <Skeleton className="size-11 rounded-xl" />
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <Skeleton className="h-3.5 w-28" />
              <Skeleton className="h-4 w-20 rounded-full" />
            </div>
          </div>
        ) : user ? (
          <div className="flex items-center gap-3 rounded-xl border border-sidebar-border bg-sidebar-accent/50 p-2.5 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-2">
            {/* User image — rounded square */}
            <Avatar className="size-11 rounded-xl after:rounded-xl ring-2 ring-sidebar-primary/25 group-data-[collapsible=icon]:size-8">
              <AvatarImage
                src={user.image || undefined}
                alt={user.name}
                className="rounded-xl"
              />
              <AvatarFallback
                className="font-heading rounded-xl text-sm font-bold text-white"
                style={{ background: "var(--gradient-primary)" }}
              >
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
              <AvatarBadge className="bg-success" />
            </Avatar>

            {/* Name + role */}
            <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
              <p
                className="font-heading truncate text-sm font-semibold"
                title={user.name}
              >
                {user.name}
              </p>
              <span
                className={cn(
                  "mt-1 inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5",
                  "text-[11px] font-semibold uppercase tracking-wide",
                  role === "admin"
                    ? "bg-primary/10 text-primary"
                    : "bg-sidebar-primary text-sidebar-primary-foreground",
                )}
              >
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
          {items[role].map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton render={<Link href={item.href} />}>
                <item.icon />
                <span>{item.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
};

export default DashboardSidebar;
