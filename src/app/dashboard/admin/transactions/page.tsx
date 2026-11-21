import {
  BadgeCheck,
  CalendarDays,
  ChevronDown,
  CircleX,
  Clock3,
  Crown,
  Eye,
  Info,
  Receipt,
  RefreshCw,
  Search,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import StatusCapsule from "@/components/shared/StatusCapsule";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAllTransaction } from "@/lib/api/transaction";
import { getAllUser } from "@/lib/api/users";
import {
  ITransaction,
  ITransactionVendor,
  MongoDateValue,
  MongoObjectId,
} from "@/types/transaction.type";
import { IUser } from "@/types/user.type";
import { cn } from "cn";
import { getTokenFromServer } from "@/lib/getTokenFromServer";

/* ------------------------------------------------------------------ */
/*  Formatting helpers                                                 */
/* ------------------------------------------------------------------ */

const transactionStatusStyles: Record<
  string,
  { label: string; className: string }
> = {
  paid: {
    label: "Paid",
    className: "bg-success/10 text-success ring-success/30",
  },
  pending: {
    label: "Pending",
    className: "bg-warning/10 text-warning ring-warning/30",
  },
  failed: {
    label: "Failed",
    className: "bg-destructive/10 text-destructive ring-destructive/30",
  },
  refunded: {
    label: "Refunded",
    className: "bg-muted text-muted-foreground ring-border",
  },
};

const avatarTones = [
  "bg-primary/10 text-primary",
  "bg-secondary/10 text-secondary",
  "bg-success/10 text-success",
  "bg-warning/10 text-warning",
];

const filters = ["All", "Paid", "Pending", "Refunded", "Failed"];

const getStatusStyle = (status?: string) => {
  const key = status?.toLowerCase() ?? "";
  return (
    transactionStatusStyles[key] ?? {
      label: key ? key.charAt(0).toUpperCase() + key.slice(1) : "Unknown",
      className: "bg-muted text-muted-foreground ring-border",
    }
  );
};

/** Reads a plain ISO string or an extended-JSON `{ $date }` value. */
const parseDate = (value?: MongoDateValue | null) => {
  if (!value) return null;

  const raw = typeof value === "string" ? value : value.$date;
  const date = new Date(raw);

  return Number.isNaN(date.getTime()) ? null : date;
};

/** Reads a plain ObjectId string or an extended-JSON `{ $oid }` value. */
const resolveId = (value?: MongoObjectId | { _id?: string } | null) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if ("$oid" in value && value.$oid) return value.$oid;
  if ("_id" in value && value._id) return value._id;
  return "";
};

const formatDate = (date: Date) =>
  date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const formatTime = (date: Date) =>
  date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

const formatMonth = (date: Date) =>
  date.toLocaleDateString("en-GB", {
    month: "short",
    year: "numeric",
  });

const formatCurrency = (amount: number, currency = "usd") => {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount);
  } catch {
    return `${currency.toUpperCase()} ${amount.toFixed(2)}`;
  }
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((word) => word[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

/* ------------------------------------------------------------------ */
/*  Small building blocks                                              */
/* ------------------------------------------------------------------ */

const StatCard = ({
  label,
  value,
  hint,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  hint: string;
  icon: React.ElementType;
  tone: string;
}) => (
  <Card className="rounded-2xl shadow-sm">
    <CardContent className="flex items-start justify-between gap-4 p-5">
      <div className="min-w-0">
        <p className="text-muted-foreground text-[11px] font-semibold tracking-wider uppercase">
          {label}
        </p>
        <p className="font-heading mt-2 text-2xl font-bold tracking-tight">
          {value}
        </p>
        <p className="text-muted-foreground mt-1 text-xs">{hint}</p>
      </div>
      <span
        className={cn(
          "flex size-11 shrink-0 items-center justify-center rounded-xl",
          tone,
        )}
      >
        <Icon className="size-5" aria-hidden="true" />
      </span>
    </CardContent>
  </Card>
);

const PlanBadge = ({ plan }: { plan?: string }) =>
  plan?.toLowerCase() === "premium" ? (
    <Badge
      variant="outline"
      className="gap-1 border-secondary/40 bg-secondary/10 font-heading text-secondary"
    >
      <Crown aria-hidden="true" />
      Premium
    </Badge>
  ) : (
    <Badge variant="outline" className="text-muted-foreground">
      Free
    </Badge>
  );

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

const TransactionPage = async () => {
  let transactions: ITransaction[] = [];
  let users: IUser[] = [];
  let loadError: string | null = null;

  try {
    const token = await getTokenFromServer()
    const [transactionData, userData] = await Promise.all([
      getAllTransaction(token) as Promise<ITransaction[]>,
      // Vendor details are only used to enrich the table — never block it.
      getAllUser(token).catch(() => [] as IUser[]),
    ]);

    transactions = Array.isArray(transactionData) ? transactionData : [];
    users = Array.isArray(userData) ? userData : [];
  } catch (error) {
    loadError =
      error instanceof Error
        ? error.message
        : "Could not load transactions right now.";
  }

  const usersById = new Map(users.map((user) => [user._id, user]));

  const sortedTransactions = [...transactions].sort((a, b) => {
    const dateA = parseDate(a.createdAt)?.getTime() ?? 0;
    const dateB = parseDate(b.createdAt)?.getTime() ?? 0;
    return dateB - dateA;
  });

  const paidTransactions = sortedTransactions.filter(
    (transaction) => transaction.status?.toLowerCase() === "paid",
  );
  const pendingTransactions = sortedTransactions.filter(
    (transaction) => transaction.status?.toLowerCase() === "pending",
  );
  const attentionTransactions = sortedTransactions.filter((transaction) => {
    const status = transaction.status?.toLowerCase();
    return status === "failed" || status === "refunded";
  });

  const totalCollected = paidTransactions.reduce(
    (sum, transaction) => sum + Number(transaction.amount ?? 0),
    0,
  );
  const pendingAmount = pendingTransactions.reduce(
    (sum, transaction) => sum + Number(transaction.amount ?? 0),
    0,
  );
  const attentionAmount = attentionTransactions.reduce(
    (sum, transaction) => sum + Number(transaction.amount ?? 0),
    0,
  );
  const summaryCurrency = paidTransactions[0]?.currency ?? "usd";

  const latestDate = sortedTransactions[0]
    ? parseDate(sortedTransactions[0].createdAt)
    : null;

  const stats = [
    {
      label: "Total collected",
      value: formatCurrency(totalCollected, summaryCurrency),
      hint: `${paidTransactions.length} verified ${
        paidTransactions.length === 1 ? "payment" : "payments"
      } on record`,
      icon: Wallet,
      tone: "bg-primary/10 text-primary",
    },
    {
      label: "Successful payments",
      value: String(paidTransactions.length),
      hint: `of ${transactions.length} ${
        transactions.length === 1 ? "transaction" : "transactions"
      }`,
      icon: BadgeCheck,
      tone: "bg-success/10 text-success",
    },
    {
      label: "Awaiting confirmation",
      value: String(pendingTransactions.length),
      hint:
        pendingTransactions.length === 0
          ? "No pending payments"
          : `${formatCurrency(pendingAmount, summaryCurrency)} pending webhook`,
      icon: Clock3,
      tone: "bg-warning/10 text-warning",
    },
    {
      label: "Needs attention",
      value: String(attentionTransactions.length),
      hint:
        attentionTransactions.length === 0
          ? "No failed or refunded payments"
          : `${formatCurrency(attentionAmount, summaryCurrency)} failed or refunded`,
      icon: CircleX,
      tone: "bg-destructive/10 text-destructive",
    },
  ];

  return (
    <div className="w-full px-4 py-8 md:px-6">
      {/* Header */}
      <section className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-20 -right-16 size-52 rounded-full bg-secondary/10 blur-2xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 left-1/3 size-48 rounded-full bg-primary/10 blur-3xl"
        />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <span className="hidden size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20 sm:flex">
              <Receipt className="size-6" aria-hidden="true" />
            </span>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
                  Transactions
                </h1>
                <Badge
                  variant="outline"
                  className="border-border bg-muted/60 text-muted-foreground"
                >
                  <ShieldCheck className="text-success" aria-hidden="true" />
                  Read-only
                </Badge>
              </div>
              <p className="text-muted-foreground mt-1 max-w-2xl text-sm">
                Review vendor subscription payments verified through Stripe.
                Payment records can’t be edited or marked successful from this
                dashboard.
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3 rounded-xl border border-border bg-muted/30 px-3.5 py-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg bg-success/10 text-success">
              <RefreshCw className="size-4" aria-hidden="true" />
            </span>
            <div className="text-xs leading-tight">
              <p className="font-medium">Stripe verified</p>
              <p className="text-muted-foreground">
                {latestDate ? `Latest ${formatDate(latestDate)}` : "No payments yet"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {loadError ? (
        <Card className="mt-5 rounded-2xl shadow-sm">
          <CardContent className="py-14">
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <CircleX aria-hidden="true" />
                </EmptyMedia>
                <EmptyTitle>Couldn’t load transactions</EmptyTitle>
                <EmptyDescription>{loadError}</EmptyDescription>
              </EmptyHeader>
            </Empty>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Stats */}
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>

          {sortedTransactions.length > 0 ? (
            <Card className="mt-5 gap-0 overflow-hidden rounded-2xl py-0 shadow-sm">
              <CardHeader className="border-b border-border py-4">
                <CardTitle className="text-base">Payment history</CardTitle>
                <CardDescription>
                  Server-verified vendor subscription transactions.
                </CardDescription>
                <CardAction>
                  <div className="hidden items-center gap-2 sm:flex">
                    <Badge
                      variant="outline"
                      className="border-success/30 bg-success/10 text-success"
                    >
                      {paidTransactions.length} paid
                    </Badge>
                    {pendingTransactions.length > 0 && (
                      <Badge
                        variant="outline"
                        className="border-warning/30 bg-warning/10 text-warning"
                      >
                        {pendingTransactions.length} pending
                      </Badge>
                    )}
                  </div>
                </CardAction>
              </CardHeader>

              {/* Toolbar */}
              <div className="flex flex-col gap-3 border-b border-border px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="relative w-full lg:max-w-xs">
                  <Search
                    aria-hidden="true"
                    className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
                  />
                  <input
                    type="search"
                    readOnly
                    aria-label="Search vendor or transaction ID"
                    placeholder="Search vendor or transaction ID"
                    className="h-9 w-full rounded-lg border border-input bg-background pr-3 pl-9 text-sm shadow-xs outline-none transition placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {filters.map((filter, index) => (
                      <span
                        key={filter}
                        className={cn(
                          "inline-flex h-8 items-center rounded-full px-3 text-xs font-medium whitespace-nowrap",
                          index === 0
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "border border-border bg-background text-muted-foreground",
                        )}
                      >
                        {filter}
                      </span>
                    ))}
                  </div>

                  <span className="text-muted-foreground inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 text-xs font-medium whitespace-nowrap">
                    <CalendarDays className="size-3.5" aria-hidden="true" />
                    {latestDate ? formatMonth(latestDate) : "All time"}
                    <ChevronDown className="size-3.5" aria-hidden="true" />
                  </span>
                </div>
              </div>

              <CardContent className="px-0">
                <Table className="min-w-5xl">
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="pl-4 text-[11px] tracking-wider uppercase">
                        Vendor
                      </TableHead>
                      <TableHead className="w-32 text-[11px] tracking-wider uppercase">
                        Plan
                      </TableHead>
                      <TableHead className="w-28 text-[11px] tracking-wider uppercase">
                        Amount
                      </TableHead>
                      <TableHead className="w-28 text-[11px] tracking-wider uppercase">
                        Status
                      </TableHead>
                      <TableHead className="w-52 text-[11px] tracking-wider uppercase">
                        Transaction
                      </TableHead>
                      <TableHead className="w-36 text-[11px] tracking-wider uppercase">
                        Date
                      </TableHead>
                      <TableHead className="w-16 pr-4 text-right text-[11px] tracking-wider uppercase">
                        View
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {sortedTransactions.map((transaction, index) => {
                      const statusStyle = getStatusStyle(transaction.status);
                      const vendorId = resolveId(transaction.vendorId);
                      const vendorRef: ITransactionVendor | null =
                        typeof transaction.vendorId === "object"
                          ? transaction.vendorId
                          : null;
                      const vendor = vendorId
                        ? usersById.get(vendorId)
                        : undefined;

                      const vendorName =
                        vendor?.businessName ??
                        vendor?.name ??
                        vendorRef?.businessName ??
                        vendorRef?.name ??
                        "Unknown vendor";
                      const vendorEmail =
                        vendor?.email ??
                        vendorRef?.email ??
                        (vendorId ? `#${vendorId.slice(0, 8)}` : "No vendor reference");
                      const vendorImage = vendor?.image ?? vendorRef?.image;
                      const transactionRef =
                        transaction.stripeSessionId ||
                        resolveId(transaction._id) ||
                        "—";
                      const createdDate = parseDate(transaction.createdAt);

                      return (
                        <TableRow key={resolveId(transaction._id)}>
                          {/* Vendor */}
                          <TableCell className="py-3 pl-4 align-middle whitespace-normal">
                            <div className="flex min-w-0 items-center gap-3">
                              <Avatar size="lg" className="shrink-0">
                                {vendorImage ? (
                                  <AvatarImage
                                    src={vendorImage}
                                    alt={vendorName}
                                  />
                                ) : null}
                                <AvatarFallback
                                  className={cn(
                                    "font-heading text-sm font-bold",
                                    avatarTones[index % avatarTones.length],
                                  )}
                                >
                                  {getInitials(vendorName)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="min-w-0">
                                <p className="font-heading truncate text-sm font-semibold">
                                  {vendorName}
                                </p>
                                <p className="text-muted-foreground truncate text-xs">
                                  {vendorEmail}
                                </p>
                              </div>
                            </div>
                          </TableCell>

                          {/* Plan */}
                          <TableCell className="py-3 align-middle">
                            <div className="flex flex-col items-start gap-1">
                              <PlanBadge plan={transaction.plan} />
                              <span className="text-muted-foreground text-[11px]">
                                {transaction.stripeSubscriptionId
                                  ? "Auto-renewing"
                                  : "One-time"}
                              </span>
                            </div>
                          </TableCell>

                          {/* Amount */}
                          <TableCell className="py-3 align-middle">
                            <span className="font-heading text-sm font-bold">
                              {formatCurrency(
                                Number(transaction.amount ?? 0),
                                transaction.currency,
                              )}
                            </span>
                          </TableCell>

                          {/* Status */}
                          <TableCell className="py-3 align-middle">
                            <StatusCapsule
                              label={statusStyle.label}
                              className={statusStyle.className}
                            />
                          </TableCell>

                          {/* Stripe session */}
                          <TableCell className="py-3 align-middle">
                            <span
                              title={`Transaction ${resolveId(transaction._id)}`}
                              className="text-muted-foreground block max-w-44 truncate font-mono text-xs"
                            >
                              {transactionRef}
                            </span>
                          </TableCell>

                          {/* Date */}
                          <TableCell className="py-3 align-middle">
                            {createdDate ? (
                              <>
                                <span className="block text-xs font-medium">
                                  {formatDate(createdDate)}
                                </span>
                                <span className="text-muted-foreground block text-[11px]">
                                  {formatTime(createdDate)}
                                </span>
                              </>
                            ) : (
                              <span className="text-muted-foreground text-xs">
                                —
                              </span>
                            )}
                          </TableCell>

                          {/* Action */}
                          <TableCell className="py-3 pr-4 text-right align-middle">
                            <span
                              className="text-muted-foreground inline-flex size-8 items-center justify-center rounded-lg border border-border bg-background"
                              aria-hidden="true"
                            >
                              <Eye className="size-4" />
                            </span>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>

              <CardFooter className="flex flex-col gap-3 border-t border-border bg-muted/30 py-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-muted-foreground text-xs">
                  Showing{" "}
                  <span className="text-foreground font-medium">
                    {sortedTransactions.length}
                  </span>{" "}
                  {sortedTransactions.length === 1
                    ? "transaction"
                    : "transactions"}
                </p>

                <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                  <Clock3 className="size-3.5" aria-hidden="true" />
                  Newest first
                </div>
              </CardFooter>
            </Card>
          ) : (
            <Empty className="mt-5 rounded-2xl border-border bg-muted/20 py-14">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Receipt aria-hidden="true" />
                </EmptyMedia>
                <EmptyTitle>No transactions yet</EmptyTitle>
                <EmptyDescription>
                  Vendor subscription payments will appear here after Stripe
                  confirms a checkout.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
        </>
      )}

      {/* Read-only note */}
      <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-border bg-muted/30 px-4 py-3 text-xs">
        <Info
          className="mt-0.5 size-4 shrink-0 text-secondary"
          aria-hidden="true"
        />
        <p className="text-muted-foreground">
          <span className="text-foreground font-medium">
            Read-only records.
          </span>{" "}
          Subscription payments are confirmed by server-verified Stripe
          webhooks. Admins can’t edit transactions or mark a payment successful.
        </p>
      </div>
    </div>
  );
};

export default TransactionPage;
