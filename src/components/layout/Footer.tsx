import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Clock,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

import MyLogo from "@/assets/pizza-logo.png";
import { MENU_CATEGORIES } from "@/config/menuCategories";

/** Primary navigation links (all resolve to real, working routes). */
const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Browse Menu", href: "/browse-menu" },
  { label: "Sign In", href: "/login" },
  { label: "Join Free", href: "/register" },
];

/** Contact rows — values live here so they are easy to swap for real ones. */
const CONTACTS = [
  { icon: Mail, label: "support@pizzahub.com", href: "mailto:support@pizzahub.com" },
  { icon: Phone, label: "+880 1700-000000", href: "tel:+8801700000000" },
  { icon: MapPin, label: "12 Mirpur Road, Dhaka 1216", href: null },
  { icon: Clock, label: "Sat – Thu · 11:00 AM – 11:00 PM", href: null },
];

/** Social profiles (opened in a new tab). */
const SOCIALS: { key: string; label: string; href: string }[] = [
  { key: "x", label: "PizzaHub on X", href: "https://x.com" },
  {
    key: "facebook",
    label: "PizzaHub on Facebook",
    href: "https://www.facebook.com",
  },
  {
    key: "instagram",
    label: "PizzaHub on Instagram",
    href: "https://www.instagram.com",
  },
  { key: "youtube", label: "PizzaHub on YouTube", href: "https://www.youtube.com" },
];

/** Brand marks — lucide-react ships no social icons, so they are inlined. */
const SOCIAL_PATHS: Record<string, string> = {
  /* X (formerly Twitter) */
  x: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
  /* Facebook */
  facebook:
    "M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06C2 17.08 5.66 21.24 10.44 21.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.49-3.91 3.77-3.91 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.91h-2.34v7.03C18.34 21.24 22 17.08 22 12.06z",
  /* Instagram (ring + lens + flash cut out with evenodd) */
  instagram:
    "M7.75 2h8.5A5.76 5.76 0 0 1 22 7.75v8.5A5.76 5.76 0 0 1 16.25 22h-8.5A5.76 5.76 0 0 1 2 16.25v-8.5A5.76 5.76 0 0 1 7.75 2zm0 2A3.75 3.75 0 0 0 4 7.75v8.5A3.75 3.75 0 0 0 7.75 20h8.5A3.75 3.75 0 0 0 20 16.25v-8.5A3.75 3.75 0 0 0 16.25 4h-8.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm5.75-3.4a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3z",
  /* YouTube (body + play button cut out with evenodd) */
  youtube:
    "M21.58 7.19a2.51 2.51 0 0 0-1.77-1.78C18.25 5 12 5 12 5s-6.25 0-7.81.41A2.51 2.51 0 0 0 2.42 7.2 26.2 26.2 0 0 0 2 12a26.2 26.2 0 0 0 .42 4.81 2.51 2.51 0 0 0 1.77 1.78C5.75 19 12 19 12 19s6.25 0 7.81-.41a2.51 2.51 0 0 0 1.77-1.78A26.2 26.2 0 0 0 22 12a26.2 26.2 0 0 0-.42-4.81zM10 15.02V8.98L15.2 12 10 15.02z",
};

/** Renders the brand mark for one social entry. */
const SocialIcon = ({ socialKey }: { socialKey: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    fillRule="evenodd"
    aria-hidden="true"
    className="size-4"
  >
    <path d={SOCIAL_PATHS[socialKey]} />
  </svg>
);

/** Column heading used across the footer link groups. */
const ColumnHeading = ({ children }: { children: ReactNode }) => (
  <h2 className="font-heading text-sm font-bold tracking-[0.14em] uppercase">
    {children}
  </h2>
);

/**
 * Site footer: brand identity + short description, important navigation
 * links, menu category shortcuts, contact details, social links and the
 * copyright bar. Static server component — mounted once in the root layout
 * so every page (including the homepage) ends with it.
 */
const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="relative isolate mt-auto overflow-hidden border-t border-white/10 bg-[#14100E] text-[#FFF9F3]">
      {/* Warm glow decorations */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -left-20 size-72 rounded-full bg-[radial-gradient(circle,rgba(229,57,53,0.35),transparent_70%)] blur-2xl"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -bottom-28 size-80 rounded-full bg-[radial-gradient(circle,rgba(255,138,0,0.28),transparent_70%)] blur-2xl"
      />

      {/* Gradient hairline along the top edge */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-0.5 bg-(image:--gradient-primary)"
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Link href="/" className="flex w-fit items-center gap-2.5">
              <span className="grid size-9 place-items-center">
                <Image src={MyLogo} alt="" width={40} height={40} />
              </span>
              <span className="font-heading text-xl font-extrabold tracking-tight">
                Pizza<span className="text-[#FF8A00]">Hub</span>
              </span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">
              PizzaHub connects you with trusted local pizzerias — browse
              approved menus, place an order in seconds and follow it all the
              way to your door.
            </p>

            {/* Social links */}
            <div className="mt-5 flex items-center gap-2.5">
              {SOCIALS.map((social) => (
                <a
                  key={social.key}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="border-white/15 text-white/80 hover:border-transparent hover:bg-(image:--gradient-primary) hover:text-white focus-visible:ring-primary grid size-9 place-items-center rounded-full border transition-all duration-200 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#14100E] focus-visible:outline-none"
                >
                  <SocialIcon socialKey={social.key} />
                </a>
              ))}
            </div>
          </div>

          {/* Important links */}
          <nav aria-label="Footer navigation" className="lg:col-span-3">
            <ColumnHeading>Explore</ColumnHeading>
            <ul className="mt-4 space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1.5 text-sm text-white/70 transition-colors duration-200 hover:text-white focus-visible:ring-primary rounded-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#14100E] focus-visible:outline-none"
                  >
                    <span
                      aria-hidden="true"
                      className="h-px w-0 bg-[#FF8A00] transition-all duration-200 group-hover:w-3"
                    />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Menu categories */}
          <nav aria-label="Menu categories" className="lg:col-span-2">
            <ColumnHeading>Categories</ColumnHeading>
            <ul className="mt-4 space-y-2.5">
              {MENU_CATEGORIES.map((category) => (
                <li key={category.value}>
                  <Link
                    href="/browse-menu"
                    className="text-sm text-white/70 transition-colors duration-200 hover:text-white focus-visible:ring-primary rounded-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#14100E] focus-visible:outline-none"
                  >
                    {category.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact information */}
          <div className="lg:col-span-3">
            <ColumnHeading>Contact</ColumnHeading>
            <ul className="mt-4 space-y-3">
              {CONTACTS.map(({ icon: Icon, label, href }) => {
                const content = (
                  <span className="flex items-start gap-2.5 text-sm text-white/70 transition-colors duration-200 group-hover:text-white">
                    <span className="bg-white/10 group-hover:bg-primary/20 mt-0.5 grid size-6 shrink-0 place-items-center rounded-md transition-colors duration-200">
                      <Icon className="size-3.5" aria-hidden="true" />
                    </span>
                    <span className="leading-relaxed">{label}</span>
                  </span>
                );

                return (
                  <li key={label}>
                    {href ? (
                      <a
                        href={href}
                        className="group focus-visible:ring-primary inline-flex rounded-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#14100E] focus-visible:outline-none"
                      >
                        {content}
                      </a>
                    ) : (
                      <span className="group">{content}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Copyright bar */}
        <div className="border-white/10 mt-12 flex flex-col items-center justify-between gap-3 border-t pt-6 text-xs text-white/55 sm:flex-row">
          <p>
            © {year} PizzaHub. All rights reserved.
          </p>
          <p className="flex items-center gap-1.5">
            Made with{" "}
            <span className="text-[#FF8A00]" aria-hidden="true">
              ♥
            </span>{" "}
            for pizza lovers everywhere.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
