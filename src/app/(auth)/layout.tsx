import Link from "next/link";
import { CheckCircle2, Pizza } from "lucide-react";

const highlights = [
  "Order fresh from local pizzerias",
  "Track every order in real time",
  "Grow your restaurant with a vendor dashboard",
];

/**
 * Shared split-screen shell for auth pages (Sign In / Sign Up).
 * Keeps branding in one place so every auth page stays consistent.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-2">
      {/* Brand panel */}
      <aside
        className="relative hidden flex-col justify-between overflow-hidden p-10 text-white lg:flex"
        style={{ background: "var(--gradient-primary)" }}
      >
        {/* Decorative shapes */}
        <div className="absolute -top-24 -right-24 size-80 rounded-full bg-white/10" />
        <div className="absolute -bottom-32 -left-16 size-96 rounded-full bg-black/10" />

        <Link href="/" className="relative flex items-center gap-2">
          <span className="grid size-10 place-items-center rounded-xl bg-white/15">
            <Pizza className="size-6" />
          </span>
          <span className="font-heading text-2xl font-extrabold tracking-tight">
            PizzaHub
          </span>
        </Link>

        <div className="relative max-w-md space-y-6">
          <h2 className="font-heading text-4xl font-extrabold leading-tight">
            Hot, fresh &amp; delivered to your door.
          </h2>
          <p className="text-white/85">
            Join PizzaHub to explore menus from local restaurants, place orders
            in seconds, or run your own pizzeria online.
          </p>
          <ul className="space-y-3">
            {highlights.map((item) => (
              <li key={item} className="flex items-center gap-3">
                <CheckCircle2 className="size-5 shrink-0 text-white" />
                <span className="text-white/90">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-sm text-white/70">
          © {new Date().getFullYear()} PizzaHub. All rights reserved.
        </p>
      </aside>

      {/* Form panel */}
      <main className="flex items-center justify-center bg-background px-4 py-10 sm:px-6">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
