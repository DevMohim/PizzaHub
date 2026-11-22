import { redirect } from "next/navigation";
import {
  Clock,
  CookingPot,
  Mail,
  Package,
  ShoppingBag,
  XCircle,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import StatusCapsule from "@/components/shared/StatusCapsule";
import ActionBtns from "@/components/vendor/ActionBtns";
import { cn } from "@/lib/utils";
import { getTokenFromServer } from "@/lib/getTokenFromServer";
import { getMyProfile } from "@/lib/api/users";
import { getOrdersByVendorEmail } from "@/lib/api/orders";
import type { IOrder, OrderStatus } from "@/types/order.type";

const statusStyles: Record<OrderStatus, { label: string; className: string }> =
  {
    pending: {
      label: "Pending",
      className: "bg-warning/10 text-warning ring-warning/30",
    },
    accepted: {
      label: "Accepted",
      className: "bg-success/10 text-success ring-success/30",
    },
    rejected: {
      label: "Rejected",
      className: "bg-destructive/10 text-destructive ring-destructive/30",
    },
    cancelled: {
      label: "Cancelled",
      className: "bg-muted text-muted-foreground ring-border",
    },
  };

const formatDate = (value?: string) =>
  value
    ? new Date(value).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

const OrderPage = async () => {
  const token = await getTokenFromServer();

  if (!token) {
    redirect("/sign-in");
  }

  const profile = await getMyProfile(token);

  if (profile.role !== "vendor") {
    redirect("/");
  }

  const myOrders: IOrder[] = await getOrdersByVendorEmail(token);

  const total = myOrders.length;
  const pending = myOrders.filter((o) => o.status === "pending").length;
  const accepted = myOrders.filter((o) => o.status === "accepted").length;
  const rejected = myOrders.filter((o) => o.status === "rejected").length;

  const stats = [
    {
      label: "Total Orders",
      value: total,
      icon: ShoppingBag,
      tone: "text-primary bg-primary/10",
    },
    {
      label: "Pending",
      value: pending,
      icon: Clock,
      tone: "text-warning bg-warning/10",
    },
    {
      label: "Accepted",
      value: accepted,
      icon: CookingPot,
      tone: "text-success bg-success/10",
    },
    {
      label: "Rejected",
      value: rejected,
      icon: XCircle,
      tone: "text-destructive bg-destructive/10",
    },
  ] as const;

  return (
    <div className="w-full px-4 py-8 md:px-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold sm:text-3xl">
          Customer Orders
        </h1>
        <p className="text-muted-foreground mt-1.5 text-sm">
          Review and manage orders placed for your menu items. Accept or reject
          pending orders.
        </p>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="border-border bg-card rounded-xl border px-4 py-3 shadow-xs"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="font-heading text-2xl font-bold sm:text-3xl">
                  {stat.value}
                </p>
                <span
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-lg",
                    stat.tone,
                  )}
                >
                  <Icon className="size-4" aria-hidden="true" />
                </span>
              </div>
              <p className="text-muted-foreground mt-1 text-xs sm:text-sm">
                {stat.label}
              </p>
            </div>
          );
        })}
      </div>

      {total > 0 ? (
        <Card className="gap-0 py-0">
          <div className="border-border flex flex-col gap-1 border-b px-4 py-4">
            <h2 className="font-heading text-base font-medium">
              Orders for your items
            </h2>
            <p className="text-muted-foreground text-sm">
              {total} orders · {pending} pending · {accepted} accepted ·{" "}
              {rejected} rejected
            </p>
          </div>

          {/* Desktop table */}
          <Table className="hidden md:table">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-4 text-xs tracking-wide uppercase">
                  Customer
                </TableHead>
                <TableHead className="text-xs tracking-wide uppercase">
                  Item
                </TableHead>
                <TableHead className="text-xs tracking-wide uppercase">
                  Delivery
                </TableHead>
                <TableHead className="text-xs tracking-wide uppercase">
                  Message
                </TableHead>
                <TableHead className="text-xs tracking-wide uppercase">
                  Status
                </TableHead>
                <TableHead className="pr-4 text-right text-xs tracking-wide uppercase">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {myOrders.map((order) => {
                const status =
                  statusStyles[order.status] ?? statusStyles.pending;
                const customerInitial = (order.customerName ?? "?")
                  .charAt(0)
                  .toUpperCase();

                return (
                  <TableRow key={order._id}>
                    <TableCell className="py-3 pl-4 align-middle whitespace-normal">
                      <div className="flex min-w-0 items-center gap-2.5">
                        <Avatar className="size-9 shrink-0">
                          <AvatarFallback
                            className="font-heading text-xs font-bold text-white"
                            style={{ background: "var(--gradient-primary)" }}
                          >
                            {customerInitial}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="font-heading truncate text-sm font-semibold">
                            {order.customerName}
                          </p>
                          <p className="text-muted-foreground flex items-center gap-1 text-xs">
                            <Mail className="size-3" aria-hidden="true" />
                            <span className="truncate">
                              {order.customerEmail}
                            </span>
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="py-3 align-middle whitespace-normal">
                      <div className="flex min-w-0 items-center gap-2.5">
                        <div className="bg-muted relative size-10 shrink-0 overflow-hidden rounded-lg">
                          {order.itemImage ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={order.itemImage}
                              alt={order.itemName}
                              className="size-full object-cover"
                              loading="lazy"
                            />
                          ) : null}
                        </div>
                        <p className="font-heading truncate text-sm font-semibold">
                          {order.itemName}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell className="py-3 align-middle whitespace-normal">
                      <p className="font-medium">
                        {formatDate(order.deliveryDate)}
                      </p>
                      <p className="text-muted-foreground text-xs wrap-break-words">
                        {order.deliveryAddress}
                      </p>
                    </TableCell>

                    <TableCell className="py-3 align-middle whitespace-normal">
                      <p className="text-muted-foreground max-w-48 truncate text-xs italic">
                        {order.message ? `“${order.message}”` : "—"}
                      </p>
                    </TableCell>

                    <TableCell className="py-3 align-middle">
                      <StatusCapsule
                        label={status.label}
                        className={status.className}
                      />
                    </TableCell>

                    <TableCell className="py-3 pr-4 align-middle">
                      <div className="flex justify-end">
                        <ActionBtns order={order} />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {/* Mobile list */}
          <CardContent className="space-y-3 p-4 md:hidden">
            {myOrders.map((order) => {
              const status = statusStyles[order.status] ?? statusStyles.pending;
              return (
                <div
                  key={order._id}
                  className="border-border rounded-xl border p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <Avatar className="size-9 shrink-0">
                        <AvatarFallback
                          className="font-heading text-xs font-bold text-white"
                          style={{ background: "var(--gradient-primary)" }}
                        >
                          {(order.customerName ?? "?").charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="font-heading truncate text-sm font-semibold">
                          {order.customerName}
                        </p>
                        <p className="text-muted-foreground truncate text-xs">
                          {order.customerEmail}
                        </p>
                      </div>
                    </div>
                    <StatusCapsule
                      label={status.label}
                      className={status.className}
                    />
                  </div>

                  <div className="bg-muted/60 mt-3 flex items-center gap-2.5 rounded-lg p-2.5">
                    <div className="bg-muted relative size-12 shrink-0 overflow-hidden rounded-lg">
                      {order.itemImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={order.itemImage}
                          alt={order.itemName}
                          className="size-full object-cover"
                          loading="lazy"
                        />
                      ) : null}
                    </div>
                    <p className="font-heading truncate text-sm font-semibold">
                      {order.itemName}
                    </p>
                  </div>

                  <div className="mt-3 flex flex-wrap items-end justify-between gap-2">
                    <div className="text-muted-foreground text-xs">
                      <p>Delivery {formatDate(order.deliveryDate)}</p>
                      <p className="mt-0.5 wrap-break-words">
                        {order.deliveryAddress}
                      </p>
                      {order.message ? (
                        <p className="mt-0.5 italic">“{order.message}”</p>
                      ) : null}
                    </div>
                    <ActionBtns order={order} />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      ) : (
        <Card className="gap-0 py-0">
          <CardContent className="flex flex-col items-center gap-4 py-14 text-center">
            <span className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-2xl">
              <Package className="size-6" aria-hidden="true" />
            </span>
            <div className="space-y-1">
              <h2 className="font-heading text-base font-semibold">
                No orders yet
              </h2>
              <p className="text-muted-foreground text-sm">
                Orders placed for your menu items will appear here.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OrderPage;
