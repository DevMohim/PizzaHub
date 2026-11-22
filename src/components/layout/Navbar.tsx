"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import MyLogo from "@/assets/pizza-logo.png";
import { useSession } from "@/lib/auth-client";
import ShowMenuItems from "@/components/Navbar/ShowMenuItems";
import CartDrawer from "@/components/Navbar/CartDrawer";
import ThemeToggle from "@/components/Navbar/ThemeToggle";
import type { UserRole } from "@/types/user.type";

type NavLinkItem = { label: string; href: string };

const PUBLIC_LINKS: NavLinkItem[] = [
  { label: "Home", href: "/" },
  { label: "Browse Menu", href: "/browse-menu" },
];

const isUserRole = (value: unknown): value is UserRole =>
  value === "customer" || value === "vendor" || value === "admin";

function Logo() {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-2">
      <span className="grid size-9 place-items-center">
        <Image src={MyLogo} alt="PizzaHub logo" width={40} height={40} />
      </span>
      <span className="font-jakarta text-xl font-extrabold tracking-tight">
        Pizza<span className="text-primary">Hub</span>
      </span>
    </Link>
  );
}

function NavLink({ label, href }: NavLinkItem) {
  const pathname = usePathname();
  const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={cn(
        "font-heading relative rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
        isActive
          ? "text-primary"
          : "text-foreground/70 hover:bg-muted hover:text-foreground",
      )}
    >
      {label}
      {isActive && (
        <span
          className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full"
          style={{ background: "var(--gradient-primary)" }}
        />
      )}
    </Link>
  );
}

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session } = useSession();

  const role = isUserRole(session?.user?.role) ? session.user.role : null;
  const isLoggedIn = Boolean(session?.user && role);

  const links: NavLinkItem[] = isLoggedIn
    ? [...PUBLIC_LINKS, { label: "Dashboard", href: `/dashboard/${role}` }]
    : PUBLIC_LINKS;

  return (
    <header className="bg-background/95 border-border sticky top-0 z-50 border-b backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />

        <nav
          className="hidden items-center md:flex"
          aria-label="Main navigation"
        >
          {links.map((link) => (
            <NavLink key={link.href} {...link} />
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />

          {role === "customer" && <CartDrawer />}

          {isLoggedIn && session?.user ? (
            <ShowMenuItems
              user={{
                name: session.user.name,
                email: session.user.email,
                image: session.user.image,
                role: role!,
              }}
            />
          ) : (
            <>
              <Link
                href="/login"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "hidden sm:inline-flex",
                )}
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className={cn(
                  buttonVariants({ variant: "default", size: "lg" }),
                  "bg-(image:--gradient-primary) text-white hover:opacity-90",
                )}
              >
                Join Free
              </Link>
            </>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <nav
          className="border-border bg-background border-t px-4 py-3 md:hidden"
          aria-label="Mobile navigation"
        >
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="font-heading text-foreground/80 hover:bg-muted hover:text-foreground rounded-md px-3 py-2 text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
