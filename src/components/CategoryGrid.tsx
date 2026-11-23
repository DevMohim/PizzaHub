// src/components/CategoryGrid.tsx
"use client";

import Link from "next/link";
import { ArrowRight, LayoutGrid } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "motion/react";

type Category = { value: string; label: string };

const MotionLink = motion.create(Link);

const EASE = [0.22, 1, 0.36, 1] as const;

/** "01", "02", … */
const formatIndex = (index: number) => String(index + 1).padStart(2, "0");

const headerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

const gridVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

const CategoryGrid = ({ categories }: { categories: readonly Category[] }) => {
  const reduce = useReducedMotion();
  const viewport = { once: true, amount: 0.2 } as const;

  return (
    <section
      aria-labelledby="category-section-heading"
      className="bg-background w-full py-14 sm:py-16"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          variants={headerVariants}
          initial={reduce ? false : "hidden"}
          whileInView={reduce ? undefined : "visible"}
          viewport={viewport}
        >
          <p className="text-primary flex items-center gap-2.5 text-xs font-bold tracking-[0.18em] uppercase">
            <LayoutGrid className="size-3.5 shrink-0" aria-hidden="true" />
            Explore by category
          </p>

          <h2
            id="category-section-heading"
            className="font-heading mt-3 text-4xl font-bold tracking-tight sm:text-5xl"
          >
            Something for <span className="text-primary italic">everyone</span>
          </h2>

          <p className="text-muted-foreground mt-3 max-w-md text-sm leading-relaxed">
            From wood-fired classics to sweet finishes — pick a category and
            jump straight into the menu.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          className="mt-10 grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3"
          variants={gridVariants}
          initial={reduce ? false : "hidden"}
          whileInView={reduce ? undefined : "visible"}
          viewport={viewport}
        >
          {categories.map((category, index) => (
            <MotionLink
              key={category.value}
              href={`/browse-menu?category=${category.value}`}
              variants={cardVariants}
              whileHover={reduce ? undefined : { y: -4 }}
              className="group border-border bg-card relative flex min-h-42.5 flex-col justify-between overflow-hidden rounded-2xl border p-5 transition-colors duration-200 hover:border-primary/30 hover:shadow-lg sm:p-6"
            >
              {/* Decorative circle */}
              <span
                aria-hidden="true"
                className="bg-accent pointer-events-none absolute -top-12 -right-10 size-36 rounded-full transition-transform duration-300 group-hover:scale-110"
              />

              {/* Number */}
              <span className="text-primary font-heading relative text-sm font-bold tracking-[0.2em]">
                {formatIndex(index)}
              </span>

              {/* Name + arrow */}
              <div className="relative mt-8 flex items-end justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-heading line-clamp-2 text-lg leading-snug font-semibold">
                    {category.label}
                  </h3>
                </div>

                <span
                  aria-hidden="true"
                  className="border-border bg-background text-foreground group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground flex size-10 shrink-0 items-center justify-center rounded-full border transition-colors duration-200"
                >
                  <ArrowRight className="size-4" />
                </span>
              </div>
            </MotionLink>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CategoryGrid;
