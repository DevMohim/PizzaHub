import {
  BadgeCheck,
  MessageSquareQuote,
  Star,
} from "lucide-react";

/** A single customer quote shown in the testimonials grid. */
type Testimonial = {
  quote: string;
  name: string;
  meta: string;
  /** Initials rendered in the avatar circle (no external image requests). */
  initials: string;
  /** Tailwind classes tinting the avatar circle per person. */
  avatarClassName: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Ordered a pepperoni for the family on Friday night and it showed up still steaming. The order status updated the whole way, so no guessing when to set the table.",
    name: "Ayesha Rahman",
    meta: "Customer · Dhaka",
    initials: "AR",
    avatarClassName: "bg-primary/15 text-primary",
  },
  {
    quote:
      "I love that every item I see has already been approved. I've never clicked on something that turned out to be missing or out of date — the menu just works.",
    name: "Tanvir Hasan",
    meta: "Customer · Chattogram",
    initials: "TH",
    avatarClassName: "bg-accent text-accent-foreground",
  },
  {
    quote:
      "Placing the order took under a minute: pick the pizza, add the address, choose the delivery date. I cancelled one pending order and it went through instantly.",
    name: "Sadia Islam",
    meta: "Customer · Sylhet",
    initials: "SI",
    avatarClassName: "bg-primary/15 text-primary",
  },
  {
    quote:
      "The category and location filters made finding a proper vegetarian pizza genuinely easy. Ended up ordering from a small place two streets away.",
    name: "Rakib Hossain",
    meta: "Customer · Dhaka",
    initials: "RH",
    avatarClassName: "bg-accent text-accent-foreground",
  },
  {
    quote:
      "My dashboard shows every order with its status and delivery date in one list. As someone who orders lunch at work constantly, that's the feature I needed.",
    name: "Nusrat Jahan",
    meta: "Customer · Khulna",
    initials: "NJ",
    avatarClassName: "bg-primary/15 text-primary",
  },
  {
    quote:
      "Support replied about a delivery question the same evening, and the vendor had already accepted the order. Small touches, but that's why I keep coming back.",
    name: "Imran Kabir",
    meta: "Customer · Rajshahi",
    initials: "IK",
    avatarClassName: "bg-accent text-accent-foreground",
  },
];

/** Five-star rating row — every testimonial in this curated set is 5★. */
const Rating = () => (
  <div className="flex items-center gap-0.5" aria-label="Rated 5 out of 5 stars">
    {Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className="fill-primary text-primary size-4"
        aria-hidden="true"
      />
    ))}
  </div>
);

/**
 * Homepage "Customer testimonials" section, placed after the
 * "Why choose PizzaHub" band. Static server component: quote glyph +
 * five-star rating + quote + initials avatar per card, in a
 * 1 col mobile → 2 cols tablet → 3 cols desktop grid.
 */
const Testimonials = () => {
  return (
    <section
      aria-labelledby="testimonials-section-heading"
      className="w-full bg-background py-14 sm:py-16"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="reveal-on-scroll flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-primary flex items-center gap-2.5 text-xs font-bold tracking-[0.18em] uppercase">
              <MessageSquareQuote className="size-3.5 shrink-0" aria-hidden="true" />
              Customer testimonials
            </p>

            <h2
              id="testimonials-section-heading"
              className="font-heading mt-3 text-4xl font-bold tracking-tight sm:text-5xl"
            >
              What our <span className="text-primary italic">customers say</span>
            </h2>

            <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
              Real words from people who ordered their last pizza through
              PizzaHub — no scripts, just dinner.
            </p>
          </div>

          {/* Aggregate rating chip */}
          <div className="border-border bg-card flex w-fit shrink-0 items-center gap-3 rounded-2xl border px-4 py-3 shadow-xs">
            <span className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-xl">
              <Star className="size-5 fill-primary" aria-hidden="true" />
            </span>
            <div className="leading-tight">
              <p className="font-heading text-xl font-bold">5.0</p>
              <p className="text-muted-foreground text-xs">
                from our first customers
              </p>
            </div>
          </div>
        </div>

        {/* Testimonial grid */}
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {TESTIMONIALS.map((testimonial, index) => (
            <figure
              key={testimonial.name}
              className="reveal-on-scroll border-border bg-card group relative flex h-full flex-col overflow-hidden rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg sm:p-6"
              style={{
                animationRange: `entry ${index * 5}% entry ${index * 5 + 65}%`,
              }}
            >
              {/* Decorative oversized quote mark */}
              <span
                aria-hidden="true"
                className="text-primary/10 font-heading pointer-events-none absolute -top-4 right-4 text-7xl leading-none font-bold select-none"
              >
                &ldquo;
              </span>

              <Rating />

              <blockquote className="text-foreground/90 relative mt-4 flex-1 text-sm leading-relaxed">
                {testimonial.quote}
              </blockquote>

              <figcaption className="border-border mt-5 flex items-center gap-3 border-t pt-4">
                <span
                  className={`font-heading flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${testimonial.avatarClassName}`}
                  aria-hidden="true"
                >
                  {testimonial.initials}
                </span>

                <div className="min-w-0 leading-tight">
                  <p className="font-heading truncate text-sm font-semibold">
                    {testimonial.name}
                  </p>
                  <p className="text-muted-foreground truncate text-xs">
                    {testimonial.meta}
                  </p>
                </div>

                <BadgeCheck
                  className="text-primary ml-auto size-4 shrink-0"
                  aria-hidden="true"
                />
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
