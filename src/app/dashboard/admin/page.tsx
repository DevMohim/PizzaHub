import Link from "next/link";
import { redirect } from "next/navigation";
import type { ElementType } from "react";
import {
  Users,
  Pizza,
  Clock,
  Receipt,
  ArrowRight,
  ClipboardCheck,
  UsersRound,
  User2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTokenFromServer } from "@/lib/getTokenFromServer";
import { getMyProfile, getAllUser } from "@/lib/api/users";
import { getAdminMenuItems } from "@/lib/api/menuItems";
import type { IUser } from "@/types/user.type";
import type { IMenuItem } from "@/types/menuItem.type";
import type { ITransaction } from "@/types/transaction.type";
import { getAllTransaction } from "@/lib/api/transaction";

const quickLinks = [
  {
    title: "Review menu submissions",
    description: "Approve or reject pending items from vendors.",
    href: "/dashboard/admin/menu-items",
    icon: ClipboardCheck,
  },
  {
    title: "Manage users",
    description: "Search, filter by role, and block or unblock accounts.",
    href: "/dashboard/admin/users",
    icon: Users,
  },
  {
    title: "View transactions",
    description: "Check vendor plans, amounts, and payment status.",
    href: "/dashboard/admin/transactions",
    icon: Receipt,
  },
];

/**
 * The admin menu-items endpoint returns a bare array today, while the typed
 * client expects a paginated `{ items, total, page, limit }` response. Accept
 * both shapes so the overview works regardless of which one the server sends.
 */
const toMenuItems = (response: unknown): IMenuItem[] => {
  if (Array.isArray(response)) return response as IMenuItem[];

  if (response && typeof response === "object" && "items" in response) {
    const items = (response as { items?: unknown }).items;
    return Array.isArray(items) ? (items as IMenuItem[]) : [];
  }

  return [];
};

function StatCard({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number;
  icon: ElementType;
  tone: string;
}) {
  return (
    <Card className="rounded-2xl border-orange-100 bg-white shadow-sm">
      <CardContent className="flex items-center gap-4 p-5">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tone}`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="truncate font-sans text-sm text-stone-500">{label}</p>
          <p className="font-heading text-2xl font-bold text-stone-900">
            {value.toLocaleString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default async function AdminOverviewPage() {
  const token = await getTokenFromServer();

  if (!token) {
    redirect("/login");
  }

  const profile = await getMyProfile(token);

  if (profile.role !== "admin") {
    redirect("/");
  }

  const [users, pendingItems, allMenuItems, transactions] = await Promise.all([
    getAllUser(token) as Promise<IUser[]>,
    getAdminMenuItems({ status: "pending" }, token).then(toMenuItems),
    getAdminMenuItems({}, token).then(toMenuItems),
    getAllTransaction(token) as Promise<ITransaction[]>,
  ]);

  const vendors = users.filter((user) => user.role === "vendor");
  const customers = users.filter((user) => user.role === "customer");

  const stats = [
    {
      label: "Registered users",
      value: users.length,
      icon: UsersRound,
      tone: "bg-orange-100 text-orange-700",
    },
    {
      label: "Vendors",
      value: vendors.length,
      icon: User2,
      tone: "bg-red-100 text-red-700",
    },
    {
      label: "Customers",
      value: customers.length,
      icon: User2,
      tone: "bg-amber-100 text-amber-700",
    },
    {
      label: "Menu items",
      value: allMenuItems.length,
      icon: Pizza,
      tone: "bg-emerald-100 text-emerald-700",
    },
    {
      label: "Pending menu items",
      value: pendingItems.length,
      icon: Clock,
      tone: "bg-yellow-100 text-yellow-800",
    },
    {
      label: "Transactions",
      value: transactions.length,
      icon: Receipt,
      tone: "bg-stone-200 text-stone-700",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FFF8EF] p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-stone-900 sm:text-3xl">
          Admin Overview
        </h1>
        <p className="mt-1 font-sans text-sm text-stone-600">
          Welcome, {profile.name}. Platform summary for users, vendors, menu
          items, and transactions.
        </p>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            tone={stat.tone}
          />
        ))}
      </div>

      {/* Pending review callout */}
      <Card className="mb-6 rounded-2xl border-amber-200 bg-amber-50/70 shadow-sm">
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-heading text-lg font-semibold text-stone-900">
              {pendingItems.length} menu items waiting for review
            </p>
            <p className="font-sans text-sm text-stone-600">
              Vendor submissions need your approval before they appear publicly.
            </p>
          </div>
          <Link
            href="/dashboard/admin/menu-items"
            className="inline-flex items-center whitespace-nowrap rounded-xl bg-(image:--gradient-primary) px-5 py-2.5 font-heading text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Review now
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </CardContent>
      </Card>

      {/* Quick links */}
      <div className="grid gap-4 md:grid-cols-3">
        {quickLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link key={link.href} href={link.href} className="group block">
              <Card className="h-full rounded-2xl border-orange-100 bg-white shadow-sm transition-colors group-hover:border-orange-300">
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-700">
                    <Icon className="h-5 w-5" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-stone-400 transition-transform group-hover:translate-x-1" />
                </CardHeader>
                <CardContent className="space-y-1">
                  <CardTitle className="font-heading text-base text-stone-900">
                    {link.title}
                  </CardTitle>
                  <p className="font-sans text-sm text-stone-500">
                    {link.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
