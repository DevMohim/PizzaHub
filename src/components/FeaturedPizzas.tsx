// src/components/FeaturedPizzas.tsx
"use client";

import Link from "next/link";
import { ArrowRight, Flame, MapPin, Pizza } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "motion/react";

import { IMenuItem } from "@/types/menuItem.type";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getCategoryLabel } from "@/config/menuCategories";

const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

const FeaturedPizzas = ({ items }: { items: IMenuItem[] }) => {
  const reduce = useReducedMotion();
  const viewport = { once: true, amount: 0.2 } as const;

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Header */}
      <motion.div
        className="mb-10 max-w-2xl"
        variants={fadeUp}
        initial={reduce ? false : "hidden"}
        whileInView={reduce ? undefined : "visible"}
        viewport={viewport}
      >
        <p className="text-primary flex items-center gap-2.5 text-xs font-bold tracking-[0.18em] uppercase">
          <Flame className="size-3.5 shrink-0" aria-hidden="true" />
          Customer favorites
        </p>

        <h2 className="font-heading mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
          Features <span className="text-primary italic">Pizzas</span>
        </h2>

        <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
          Handpicked by our community — the most loved pizzas from trusted local
          pizzerias, fresh out of the oven and ready to order.
        </p>
      </motion.div>

      {/* Carousel block: একবার ভেসে উঠবে, slide এর ভেতরে হস্তক্ষেপ করবে না */}
      <motion.div
        variants={fadeUp}
        initial={reduce ? false : "hidden"}
        whileInView={reduce ? undefined : "visible"}
        viewport={viewport}
      >
        <Carousel opts={{ align: "start", loop: true }} className="w-full">
          <CarouselContent className="-ml-4">
            {items.map((item) => (
              <CarouselItem
                key={item._id}
                className="flex flex-col pl-4 sm:basis-1/2 lg:basis-1/3"
              >
                <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
                  {/* Image */}
                  <div className="relative aspect-video overflow-hidden bg-muted">
                    {item.images[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.images[0]}
                        alt={item.itemName}
                        loading="lazy"
                        className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="text-muted-foreground flex size-full items-center justify-center">
                        <Pizza className="size-8" aria-hidden="true" />
                      </div>
                    )}

                    <Badge
                      variant="outline"
                      className="absolute top-3 left-3 bg-background/90 text-foreground backdrop-blur-sm"
                    >
                      {getCategoryLabel(item.category)}
                    </Badge>
                  </div>

                  {/* Body */}
                  <div className="flex flex-1 flex-col gap-2.5 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-heading line-clamp-1 text-base font-semibold">
                        {item.itemName}
                      </h3>
                      <span className="font-heading text-primary shrink-0 text-base font-bold">
                        ${Number(item.price ?? 0).toFixed(2)}
                      </span>
                    </div>

                    <p className="text-muted-foreground line-clamp-2 text-sm">
                      {item.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <MapPin className="size-3.5" aria-hidden="true" />
                        {item.location}
                      </span>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="px-4 pb-4">
                    <Link
                      href={`/browse-menu/${item._id}`}
                      className={cn(
                        buttonVariants({ size: "lg" }),
                        "h-10 w-full bg-(image:--gradient-primary) text-white hover:opacity-90",
                      )}
                    >
                      View Details
                      <ArrowRight aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex" />
        </Carousel>
      </motion.div>
    </section>
  );
};

export default FeaturedPizzas;
