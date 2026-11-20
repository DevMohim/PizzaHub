"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "cn";
import MyLogo from '@/assets/pizza-logo.png'
import Image from "next/image";
import { useSession } from "@/lib/auth-client";
import ShowMenuItems from "../Navbar/ShowMenuItems";
import CartDrawer from "../Navbar/CartDrawer";
import ThemeToggle from "../Navbar/ThemeToggle";
import { TSessionUser } from "@/types/user.type";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Browse Menu", href: "/browse-menu" },
];


function Logo() {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-2">
      <span
        className="grid size-9 place-items-center "
        
      >
        <Image src={MyLogo} alt="logo" width={40} height={40}></Image>
      </span>
      <span className="font-jakarta text-xl font-extrabold tracking-tight">
        Pizza<span className="text-primary">Hub</span>
      </span>
    </Link>
  );
}

function NavLink({ label, href }: { label: string; href: string }) {
  const pathname = usePathname();
  const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={cn(
        "font-heading relative rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
        isActive
          ? "text-primary"
          : "text-foreground/70 hover:bg-muted hover:text-foreground"
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
  const {data : session} = useSession()
  const user: TSessionUser | undefined = session?.user?.role
    ? {
        ...session.user,
        image: session.user.image ?? "",
        role: session.user.role as TSessionUser["role"],
      }
    : undefined

    const authenticateNavLinks = [
      { label: "Home", href: "/" },
      { label: "Browse Menu", href: "/browse-menu" },
      { label: "Dashboard", href: `/dashboard/${user?.role}` },
    ];

  return (
    <header className="bg-background/95 sticky top-0 z-50 border-b border-border backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        {/* Left: Logo */}
        <Logo />

        {/* Middle: Routes */}
        <nav
          className="hidden items-center md:flex"
          aria-label="Main navigation"
        >
          {user ? (
            <>
              {authenticateNavLinks.map((link) => (
                <NavLink key={link.href} {...link} />
              ))}
            </>
          ) : (
            <>
              {navLinks.map((link) => (
                <NavLink key={link.href} {...link} />
              ))}
            </>
          )}
        </nav>

        {/* Right: Theme, bag + Auth buttons */}
        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />
          {
            user?.role === 'customer' ? <><CartDrawer /></>: ''
          }
          {user ? (
            <>
              <ShowMenuItems user={user} />
            </>
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

          {/* Mobile menu toggle */}
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

      {/* Mobile: Routes + auth */}
      {mobileOpen && (
        <nav
          className="border-t border-border bg-background px-4 py-3 md:hidden"
          aria-label="Mobile navigation"
        >
          <div className="flex flex-col gap-1">
            {user ? (
              <>
                {authenticateNavLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="font-heading rounded-md px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-muted hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                ))}
              </>
            ) : (
              <>
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="font-heading rounded-md px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-muted hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                ))}
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
