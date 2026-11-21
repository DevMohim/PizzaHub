import Link from "next/link";
import {
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  Mail,
  Pencil,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import EditProfileDialog from "@/components/customer/EditProfileDialog";

/* "14 Jan 2026" from an ISO date / Date value. */
const formatDate = (value?: string | Date | null) => {
  if (!value) return "—";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const ProfileSettingsPage = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;

  /* Safely extract profile data — fall back to defaults when user is missing. */
  const name = user?.name ?? "Pizza Lover";
  const email = user?.email ?? "No email";
  const image = user?.image ?? "";
  const role = user?.role ?? "customer";
  const emailVerified = user?.emailVerified ?? false;
  const createdAt = user?.createdAt;

  const roleLabel = role.charAt(0).toUpperCase() + role.slice(1);

  const rows: Array<{
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: string;
  }> = [
    { icon: UserRound, label: "Full name", value: name },
    { icon: Mail, label: "Email address", value: email },
    { icon: ShieldCheck, label: "Role", value: roleLabel },
    { icon: CalendarDays, label: "Member since", value: formatDate(createdAt) },
  ];

  return (
    <div className="w-full px-4 py-8 md:px-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold sm:text-3xl">
            Profile Settings
          </h1>
          <p className="text-muted-foreground mt-1.5 text-sm">
            View your account details. Use the button below to update your name
            or profile image.
          </p>
        </div>
        <Link
          href="/dashboard/customer"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to Overview
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {/* Profile card */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="font-heading">My Profile</CardTitle>
            <CardDescription>
              Your personal information as a PizzaHub customer.
            </CardDescription>

            <EditProfileDialog
              user={{
                name,
                email,
                image,
                role: role as "customer" | "vendor" | "admin",
              }}
              trigger={
                <Button
                  type="button"
                  size="sm"
                  className="cursor-pointer bg-(image:--gradient-primary) text-white hover:opacity-90"
                >
                  <Pencil aria-hidden="true" />
                  Edit Profile
                </Button>
              }
            />
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Avatar + identity */}
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <Avatar className="size-20 ring-2 ring-primary/25">
                {image ? <AvatarImage src={image} alt={name} /> : null}
                <AvatarFallback
                  className="font-heading text-lg font-bold text-white"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  {name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-heading truncate text-xl font-bold">
                    {name}
                  </h2>
                  {emailVerified && (
                    <BadgeCheck
                      className="text-success size-4 shrink-0"
                      aria-label="Verified email"
                    />
                  )}
                </div>
                <p className="text-muted-foreground mt-0.5 flex items-center gap-1 text-sm">
                  <Mail className="size-3.5" aria-hidden="true" />
                  {email}
                </p>
                <Badge variant="secondary" className="mt-2">
                  <ShieldCheck aria-hidden="true" />
                  {roleLabel}
                </Badge>
              </div>
            </div>

            {/* Details */}
            <dl className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
              {rows.map((row) => {
                const Icon = row.icon;
                return (
                  <div
                    key={row.label}
                    className="flex items-start gap-3 bg-card px-4 py-3"
                  >
                    <span className="text-muted-foreground bg-muted mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg">
                      <Icon className="size-4" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <dt className="text-muted-foreground text-xs">
                        {row.label}
                      </dt>
                      <dd className="font-medium wrap-break-words">
                        {row.value}
                      </dd>
                    </div>
                  </div>
                );
              })}
            </dl>
          </CardContent>
        </Card>

        {/* Side column — account card */}
        <div className="flex flex-col gap-4">
          <Card className="relative overflow-hidden">
            <div
              className="absolute inset-x-0 top-0 h-1.5"
              style={{ background: "var(--gradient-primary)" }}
              aria-hidden="true"
            />
            <CardHeader>
              <CardTitle className="font-heading">Account</CardTitle>
              <CardDescription>Your PizzaHub account status.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Status</span>
                <span className="bg-success/10 text-success inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase ring-1 ring-success/30">
                  <span
                    className="size-1.5 rounded-full bg-current"
                    aria-hidden="true"
                  />
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Email verified</span>
                <span className="font-medium">
                  {emailVerified ? "Yes" : "No"}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Role</span>
                <span className="font-medium">{roleLabel}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-heading">
                Need to change something?
              </CardTitle>
              <CardDescription>
                Only your name and profile image can be edited from here. Your
                role, blocked status, and subscription are managed by the
                platform and cannot be changed through your profile.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettingsPage;
