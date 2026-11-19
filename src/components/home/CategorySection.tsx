import Link from "next/link";
import { ArrowRight, LayoutGrid } from "lucide-react";

import { MENU_CATEGORIES } from "@/config/menuCategories";
import { getMenuItems } from "@/lib/api/menuItems";
import { IMenuItem } from "@/types/menuItem.type";

/** Formats the card index as "01", "02", … like the section numbering. */
const formatIndex = (index: number) => String(index + 1).padStart(2, "0");

/**
 * Homepage "Explore by category" section. Server component — renders the
 * six required menu categories as numbered cards (1 col mobile → 2 cols
 * tablet → 3 cols desktop). Every card links to the Browse Menu page, and
 * the available approved+active item count is shown per category when the
 * menu data loads.
 */
const CategorySection = async () => {
  /* Approved + active item count per category — non-critical, so a failed
     fetch only hides the counts, never the section itself. */
  const counts: Record<string, number> = {};

  try {
    const data: IMenuItem[] = await getMenuItems();
    if (Array.isArray(data)) {
      for (const item of data) {
        if (
          item.status === "approved" &&
          item.active === true &&
          item.category
        ) {
          counts[item.category] = (counts[item.category] ?? 0) + 1;
        }
      }
    }
  } catch (error) {
    console.error("Category counts could not be loaded:", error);
  }

  return (
    <section
      aria-labelledby="category-section-heading"
      className="w-full bg-background py-14 sm:py-16"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
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

        {/* Category grid — numbered cards, every card links to Browse Menu */}
        <div className="mt-10 grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
          {MENU_CATEGORIES.map((category, index) => {
           

            return (
              <Link
                key={category.value}
                href="/browse-menu"
                className="group border-border bg-card relative flex min-h-42.5 flex-col justify-between overflow-hidden rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg sm:p-6"
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

                {/* Name + meta + arrow */}
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
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
