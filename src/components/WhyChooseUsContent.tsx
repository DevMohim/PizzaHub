// src/components/home/WhyChooseUsContent.tsx
"use client";

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
  type LucideIcon,
} from "lucide-react";
import { motion, useReducedMotion, type Variants } from "motion/react";

/** Icon নাম থেকে component বের করার map — client এ থাকবে */
const ICONS: Record<string, LucideIcon> = {
  Flame,
  BadgeCheck,
  Route,
  MapPinned,
  ShieldCheck,
  ChefHat,
};

export type BenefitData = {
  iconName: keyof typeof ICONS;
  title: string;
  description: string;
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

const WhyChooseUsContent = ({
  benefits,
  promises,
}: {
  benefits: BenefitData[];
  promises: string[];
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
      aria-labelledby="why-section-heading"
      className="border-border bg-accent/40 w-full border-y py-14 sm:py-16"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div className="max-w-2xl" variants={fadeUp} {...motionProps}>
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
            From craving to doorstep in a few taps — here is what makes ordering
            on PizzaHub different.
          </p>
        </motion.div>

        <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-3">
          {/* Benefit cards */}
          <motion.div
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:col-span-2"
            variants={gridVariants}
            {...motionProps}
          >
            {benefits.map((benefit) => {
              const Icon = ICONS[benefit.iconName];

              return (
                <motion.article
                  key={benefit.title}
                  variants={cardVariants}
                  whileHover={reduce ? undefined : { y: -4 }}
                  className="group border-border bg-background hover:border-primary/30 flex flex-col rounded-2xl border p-5 transition-[border-color,box-shadow] duration-200 hover:shadow-lg sm:p-6"
                >
                  <span className="bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground flex size-11 shrink-0 items-center justify-center rounded-xl transition-colors duration-200">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>

                  <h3 className="font-heading mt-4 text-lg leading-snug font-semibold">
                    {benefit.title}
                  </h3>

                  <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                    {benefit.description}
                  </p>
                </motion.article>
              );
            })}
          </motion.div>

          {/* Highlighted promise card */}
          <motion.aside
            className="flex flex-col justify-between gap-6 overflow-hidden rounded-2xl bg-(image:--gradient-primary) p-6 text-white shadow-lg sm:p-8"
            variants={fadeUp}
            transition={{ delay: 0.15 }}
            {...motionProps}
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
                {promises.map((promise) => (
                  <li
                    key={promise}
                    className="flex items-start gap-2.5 text-sm"
                  >
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
          </motion.aside>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsContent;
