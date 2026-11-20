import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  ChefHat,
  CircleCheck,
  Flame,
  MapPinned,
  Route,
  ShieldCheck,
  Star,
} from "lucide-react";

/** A single benefit shown in the "Why choose PizzaHub" grid. */
type Benefit = {
  icon: typeof Flame;
  title: string;
  description: string;
};

const BENEFITS: Benefit[] = [
  {
    icon: Flame,
    title: "Fresh from real kitchens",
    description:
      "Every pizza is prepared to order by local pizzerias — no reheated slices and no frozen shortcuts.",
  },
  {
    icon: BadgeCheck,
    title: "A menu you can trust",
    description:
      "Dishes are reviewed and approved by our team before they appear, so what you see is what you get.",
  },
  {
    icon: Route,
    title: "Track every order",
    description:
      "Follow your order from pending to accepted in your dashboard — clear statuses instead of guesswork.",
  },
  {
    icon: MapPinned,
    title: "Local spots, not chains",
    description:
      "Browse independent restaurants by location and keep your spending inside the neighbourhood.",
  },
  {
    icon: ShieldCheck,
    title: "Cancel while it's pending",
    description:
      "Changed your mind? Cancel your own pending order in one tap before the kitchen starts cooking.",
  },
  {
    icon: ChefHat,
    title: "Vendors who care",
    description:
      "Premium partners earn a featured spot, so the best-reviewed kitchens rise to the top of the menu.",
  },
];

/** Promise bullets inside the highlighted side card. */
const PROMISES = [
  "Only approved, active menu items",
  "Transparent prices and order statuses",
  "Customer, vendor and admin roles secured server-side",
];

/**
 * Homepage "Why choose PizzaHub?" section. Placed directly after the
 * category section. Static server component: a warm tinted band with six
 * benefit cards on the left and a gradient "promise" card + CTA on the
 * right (1 col mobile → 2 cols tablet → 3 cols desktop on the card grid).
 */
const WhyChooseUs = () => {
  return (
    <section
      aria-labelledby="why-section-heading"
      className="border-border w-full border-y bg-accent/40 py-14 sm:py-16"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="reveal-on-scroll max-w-2xl">
          <p className="text-primary flex items-center gap-2.5 text-xs font-bold tracking-[0.18em] uppercase">
            <Star className="size-3.5 shrink-0" aria-hidden="true" />
            Why choose PizzaHub
          </p>

          <h2
            id="why-section-heading"
            className="font-heading mt-3 text-4xl font-bold tracking-tight sm:text-5xl"
          >
            Built for <span className="text-primary italic">pizza lovers</span>
          </h2>

          <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
            From craving to doorstep in a few taps — here is what makes
            ordering on PizzaHub different.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-3">
          {/* Benefit cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-2 sm:gap-5">
            {BENEFITS.map((benefit, index) => (
              <article
                key={benefit.title}
                className="reveal-on-scroll border-border bg-background group flex flex-col rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg sm:p-6"
                style={{
                  animationRange: `entry ${index * 5}% entry ${index * 5 + 65}%`,
                }}
              >
                <span className="bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground flex size-11 shrink-0 items-center justify-center rounded-xl transition-colors duration-200">
                  <benefit.icon className="size-5" aria-hidden="true" />
                </span>

                <h3 className="font-heading mt-4 text-lg leading-snug font-semibold">
                  {benefit.title}
                </h3>

                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </article>
            ))}
          </div>

          {/* Highlighted promise card */}
          <aside
            className="reveal-on-scroll flex flex-col justify-between gap-6 overflow-hidden rounded-2xl bg-(image:--gradient-primary) p-6 text-white shadow-lg sm:p-8"
            style={{ animationRange: "entry 15% entry 80%" }}
          >
            <div>
              <p className="flex items-center gap-2.5 text-xs font-bold tracking-[0.18em] uppercase opacity-90">
                <CircleCheck className="size-3.5 shrink-0" aria-hidden="true" />
                The PizzaHub promise
              </p>

              <h3 className="font-heading mt-3 text-3xl leading-tight font-bold">
                Hot pizza, happy people.
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-white/85">
                We keep the small stuff simple so you can focus on the important
                part — dinner.
              </p>

              <ul className="mt-5 space-y-3">
                {PROMISES.map((promise) => (
                  <li key={promise} className="flex items-start gap-2.5 text-sm">
                    <CircleCheck
                      className="mt-0.5 size-4 shrink-0"
                      aria-hidden="true"
                    />
                    <span className="leading-relaxed">{promise}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href="/browse-menu"
              className="bg-background text-primary inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-colors duration-200 hover:bg-white focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent focus-visible:outline-none"
            >
              Explore Pizza Menu
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
