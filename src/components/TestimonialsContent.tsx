// src/components/home/TestimonialsContent.tsx
"use client";

import { BadgeCheck, MessageSquareQuote, Star } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "motion/react";

export type Testimonial = {
  quote: string;
  name: string;
  meta: string;
  initials: string;
  avatarClassName: string;
};

const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

const gridVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

/** Five-star rating row — every testimonial in this curated set is 5★. */
const Rating = () => (
  <div
    className="flex items-center gap-0.5"
    aria-label="Rated 5 out of 5 stars"
  >
    {Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className="fill-primary text-primary size-4"
        aria-hidden="true"
      />
    ))}
  </div>
);

const TestimonialsContent = ({
  testimonials,
}: {
  testimonials: Testimonial[];
}) => {
  const reduce = useReducedMotion();
  const viewport = { once: true, amount: 0.2 } as const;
  const motionProps = {
    initial: reduce ? false : ("hidden" as const),
    whileInView: reduce ? undefined : ("visible" as const),
    viewport,
  };

  return (
    <section
      aria-labelledby="testimonials-section-heading"
      className="bg-background w-full py-14 sm:py-16"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"
          variants={fadeUp}
          {...motionProps}
        >
          <div className="max-w-2xl">
            <p className="text-primary flex items-center gap-2.5 text-xs font-bold tracking-[0.18em] uppercase">
              <MessageSquareQuote
                className="size-3.5 shrink-0"
                aria-hidden="true"
              />
              Customer testimonials
            </p>

            <h2
              id="testimonials-section-heading"
              className="font-heading mt-3 text-4xl font-bold tracking-tight sm:text-5xl"
            >
              What our{" "}
              <span className="text-primary italic">customers say</span>
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
        </motion.div>

        {/* Testimonial grid */}
        <motion.div
          className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3"
          variants={gridVariants}
          {...motionProps}
        >
          {testimonials.map((testimonial) => (
            <motion.figure
              key={testimonial.name}
              variants={cardVariants}
              whileHover={reduce ? undefined : { y: -4 }}
              className="group border-border bg-card hover:border-primary/30 relative flex h-full flex-col overflow-hidden rounded-2xl border p-5 transition-[border-color,box-shadow] duration-200 hover:shadow-lg sm:p-6"
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
            </motion.figure>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsContent;
