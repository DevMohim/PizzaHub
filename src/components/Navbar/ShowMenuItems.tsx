"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LayoutDashboard, LogOut, User } from "lucide-react";
import toast from "react-hot-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types/user.type";

interface ShowMenuItemsProps {
  user: {
    name: string;
    email: string;
    image?: string | null;
    role: UserRole;
  };
}

const getMenuLinks = (role: UserRole) => [
  {
    name: "Dashboard",
    url: `/dashboard/${role}`,
    icon: LayoutDashboard,
  },
  {
    name: "Profile",
    url: `/dashboard/${role}/settings`,
    icon: User,
  },
];

const ShowMenuItems = ({ user }: ShowMenuItemsProps) => {
  const router = useRouter();
  const initial = user.name?.charAt(0).toUpperCase() ?? "?";

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      toast.success("Logged out successfully");
      router.push("/");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to log out");
    }
  };

  return (
    <Popover>
      <PopoverTrigger
        nativeButton={false}
        aria-label="Open profile menu"
        render={
          <Avatar className="ring-ring/20 hover:ring-ring/50 ring-2 cursor-pointer transition-shadow">
            <AvatarImage src={user.image || undefined} alt={user.name} />
            <AvatarFallback className="font-heading text-sm font-semibold">
              {initial}
            </AvatarFallback>
            <AvatarBadge className="bg-success size-2.5" />
          </Avatar>
        }
      />

      <PopoverContent align="end" className="w-64 p-0">
        <div className="flex items-center gap-3 px-4 pt-3.5 pb-3">
          <Avatar className="size-10">
            <AvatarImage src={user.image || undefined} alt={user.name} />
            <AvatarFallback className="font-heading text-sm font-semibold">
              {initial}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="font-heading truncate text-sm font-semibold">
              {user.name}
            </p>
            <p className="text-muted-foreground truncate text-xs">
              {user.email}
            </p>
          </div>
          <span className="bg-accent text-primary shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold tracking-wide uppercase">
            {user.role}
          </span>
        </div>

        <Separator />

        <ul className="p-1.5">
          {getMenuLinks(user.role).map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <Link
                  href={item.url}
                  className={cn(
                    "hover:bg-muted text-foreground/80 hover:text-foreground flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
                  )}
                >
                  <Icon className="text-muted-foreground size-4" />
                  <span className="font-heading font-medium">{item.name}</span>
                </Link>
              </li>
            );
          })}

          <li>
            <button
              type="button"
              onClick={handleLogout}
              className="hover:bg-destructive/10 text-destructive flex w-full cursor-pointer items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors"
            >
              <LogOut className="size-4" />
              <span className="font-heading font-medium">Logout</span>
            </button>
          </li>
        </ul>
      </PopoverContent>
    </Popover>
  );
};

export default ShowMenuItems;
