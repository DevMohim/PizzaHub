import { AlertCircle, Pizza } from "lucide-react";
import MenuBrowser from "@/components/browse/MenuBrowser";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MENU_CATEGORIES } from "@/config/menuCategories";
import { getMenuItems } from "@/lib/api/menuItems";
import type { IMenuItem } from "@/types/menuItem.type";

type SearchParams = Promise<{
  category?: string;
}>;

/**
 * Returns the category slug from the URL when it matches a known menu
 * category, otherwise "all" so invalid query values fall back gracefully.
 */
const resolveCategory = (value?: string): string => {
  if (!value) return "all";
  return MENU_CATEGORIES.some((category) => category.value === value)
    ? value
    : "all";
};

const BrowseMenuPage = async ({ searchParams }: { searchParams: SearchParams }) => {
  const params = await searchParams;
  const initialCategory = resolveCategory(params.category);

  let allItems: IMenuItem[] = [];
  let errorMessage: string | null = null;

  try {
    const data = await getMenuItems();
    allItems = Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("[browse-menu] load failed:", error);
    errorMessage =
      "We couldn't load the menu right now. Please refresh and try again.";
  }

  // First paint shows only the requested category (no flash of all items);
  // MenuBrowser refetches from the server on mount to confirm.
  const initialItems =
    initialCategory === "all"
      ? allItems
      : allItems.filter((item) => item.category === initialCategory);

  const locations = Array.from(
    new Set(
      allItems
        .map((item) => item.location?.trim())
        .filter((location): location is string => Boolean(location)),
    ),
  ).sort();

  return (
    <div className="w-full">
      <section className="bg-(image:--gradient-warm) border-border border-b">
        <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
          <span className="bg-accent text-primary inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase">
            <Pizza className="size-3.5" aria-hidden="true" />
            Fresh from the oven
          </span>
          <h1 className="font-heading mt-4 text-3xl font-bold sm:text-4xl">
            Browse Our Menu
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl text-sm sm:text-base">
            Explore approved pizzas and sides from local pizzerias. Search by
            name, filter by category or location, and find your next favorite.
          </p>
        </div>
      </section>

      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
        {errorMessage ? (
          <Alert variant="destructive">
            <AlertCircle />
            <AlertTitle>Couldn&apos;t load the menu</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        ) : (
          <MenuBrowser
            initialItems={initialItems}
            locations={locations}
            initialCategory={initialCategory}
          />
        )}
      </div>
    </div>
  );
};

export default BrowseMenuPage;
