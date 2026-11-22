import { redirect } from "next/navigation";
import { BadgeCheck, Users } from "lucide-react";
import UsersFilters from "@/components/admin/UsersFilters";
import UserRowActions from "@/components/admin/UserRowActions";
import StatusCapsule from "@/components/shared/StatusCapsule";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
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
import { getUserStatusStyle, userRoleStyles } from "@/config/userDisplay";
import type { IUser, UserRole } from "@/types/user.type";
import { getAllUser, getMyProfile } from "@/lib/api/users";
import { getTokenFromServer } from "@/lib/getTokenFromServer";

type SearchParams = Promise<{
  search?: string;
  role?: string;
}>;

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((word) => word[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

const formatDate = (value?: string) =>
  value
    ? new Date(value).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

const ManageUsersPage = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}) => {
  const token = await getTokenFromServer();

  if (!token) {
    redirect("/sign-in");
  }

  const profile = await getMyProfile(token);

  if (profile.role !== "admin") {
    redirect("/");
  }

  const params = await searchParams;
  const search = params.search?.trim() ?? "";
  const role =
    params.role === "vendor" || params.role === "customer"
      ? params.role
      : undefined;

  let users: IUser[] = [];
  let errorMessage: string | null = null;

  try {
    users = await getAllUser({ search: search || undefined, role }, token);
  } catch (error) {
    console.error("[admin/users] load failed:", error);
    errorMessage = "Users load করা যায়নি। Terminal এ error দেখুন।";
  }

  const blockedCount = users.filter((user) => user.isBlocked).length;

  return (
    <div className="w-full px-4 py-8 md:px-6">
      <div className="mb-5">
        <h1 className="font-heading text-2xl font-bold sm:text-3xl">
          Manage Users
        </h1>
        <p className="text-muted-foreground mt-1 max-w-2xl text-sm">
          View details, search by name or email, filter by role, and block or
          unblock accounts. Blocked users lose access to protected features.
        </p>
      </div>

      <div className="mb-5">
        <UsersFilters
          initial={{ search, role: role ?? "", status: "" }}
          resultCount={users.length}
        />
      </div>

      {errorMessage ? (
        <p className="text-destructive text-sm">{errorMessage}</p>
      ) : users.length > 0 ? (
        <Card className="gap-0 py-0">
          <CardHeader className="border-border border-b py-4">
            <CardTitle>All Users</CardTitle>
            <CardDescription>
              {users.length} users · {blockedCount} blocked
            </CardDescription>
            <CardAction>
              <Badge variant="secondary">{users.length} shown</Badge>
            </CardAction>
          </CardHeader>

          <CardContent className="px-0 pb-0">
            <Table className="min-w-180">
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-4 text-xs tracking-wide uppercase">
                    User
                  </TableHead>
                  <TableHead className="w-28 text-xs tracking-wide uppercase">
                    Role
                  </TableHead>
                  <TableHead className="w-28 text-xs tracking-wide uppercase">
                    Status
                  </TableHead>
                  <TableHead className="w-30 hidden text-xs tracking-wide uppercase lg:table-cell">
                    Joined
                  </TableHead>
                  <TableHead className="w-64 pr-4 text-right text-xs tracking-wide uppercase">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {users.map((user) => {
                  const roleStyle = userRoleStyles[user.role as UserRole] ?? {
                    label: user.role,
                    className: "border-border bg-muted text-muted-foreground",
                  };
                  const statusStyle = getUserStatusStyle(user.isBlocked);

                  return (
                    <TableRow key={user._id}>
                      <TableCell className="py-3 pl-4 align-middle whitespace-normal">
                        <div className="flex min-w-0 items-center gap-3">
                          <Avatar size="lg" className="shrink-0">
                            {user.image ? (
                              <AvatarImage src={user.image} alt={user.name} />
                            ) : null}
                            <AvatarFallback className="bg-primary/10 font-heading text-primary text-sm font-bold">
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>

                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-heading truncate text-sm font-semibold">
                                {user.name}
                              </span>
                              {user.emailVerified && (
                                <BadgeCheck
                                  className="text-success size-3.5 shrink-0"
                                  aria-hidden="true"
                                />
                              )}
                            </div>
                            <p className="text-muted-foreground truncate text-xs">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="py-3 align-middle">
                        <Badge
                          variant="outline"
                          className={roleStyle.className}
                        >
                          {roleStyle.label}
                        </Badge>
                      </TableCell>

                      <TableCell className="py-3 align-middle">
                        <StatusCapsule
                          label={statusStyle.label}
                          className={statusStyle.className}
                        />
                      </TableCell>

                      <TableCell className="text-muted-foreground hidden py-3 align-middle text-xs lg:table-cell">
                        {formatDate(user.createdAt)}
                      </TableCell>

                      <TableCell className="py-3 pr-4 align-middle">
                        <UserRowActions user={user} />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Empty className="border-border bg-muted/20 py-14">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Users aria-hidden="true" />
            </EmptyMedia>
            <EmptyTitle>No users found</EmptyTitle>
            <EmptyDescription>
              {search || role
                ? "কোনো user মিলছে না। Filter বদলে আবার চেষ্টা করুন।"
                : "Registered users will appear here as soon as they sign up."}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </div>
  );
};

export default ManageUsersPage;
