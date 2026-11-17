"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import { toast } from "react-hot-toast";
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
import { TSessionUser } from "@/types/user.type";
import { cn } from "cn";

const menuItems = (role: TSessionUser["role"]) => [
  {
    name: "Dashboard",
    url: `/dashboard/${role}`,
    icon: LayoutDashboard,
  },
  {
    name: "Profile",
    url: `/dashboard/${role}/profile`,
    icon: User,
  },
  {
   name : "Settings",
   url: "/settings",
   icon: Settings
  }
];

const ShowMenuItems = ({ user }: { user: TSessionUser }) => {
  const router = useRouter();

  const handleLogout = async () => {
    const { error } = await authClient.signOut();
    if (error) {
      toast.error(error.message ?? "Failed to log out");
      return;
    }
    toast.success("Logged out successfully");
    router.push("/");
    router.refresh();
  };

  return (
    <Popover>
      <PopoverTrigger
        nativeButton={false}
        aria-label="Open profile menu"
        render={
          <Avatar className="ring-ring/20 hover:ring-ring/50 cursor-pointer ring-2 transition-shadow">
            <AvatarImage src={user.image || undefined} alt={user.name} />
            <AvatarFallback className="font-heading text-sm font-semibold">
              {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
            <AvatarBadge className="bg-success size-2.5" />
          </Avatar>
        }
      />

      <PopoverContent align="end" className="w-64 p-0">
        {/* User info */}
        <div className="flex items-center gap-3 px-4 pt-3.5 pb-3">
          <Avatar className="size-10">
            <AvatarImage src={user.image || undefined} alt={user.name} />
            <AvatarFallback className="font-heading text-sm font-semibold">
              {user.name.charAt(0).toUpperCase()}
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
          <span className="bg-accent text-primary shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide">
            {user.role}
          </span>
        </div>

        <Separator />

        {/* Menu links */}
        <ul className="p-1.5">
          {menuItems(user.role).map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <Link
                  href={item.url}
                  className={cn(
                    "hover:bg-muted flex items-center gap-2.5 rounded-md px-3 py-2 text-sm",
                    "text-foreground/80 hover:text-foreground transition-colors"
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
              className={cn(
                "hover:bg-destructive/10 flex w-full cursor-pointer items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
                "text-destructive"
              )}
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
