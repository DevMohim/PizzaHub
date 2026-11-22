import { AlertCircle, Pizza } from "lucide-react";
import MenuBrowser from "@/components/browse/MenuBrowser";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getMenuItems } from "@/lib/api/menuItems";
import type { IMenuItem } from "@/types/menuItem.type";

const BrowseMenuPage = async () => {
  let initialItems: IMenuItem[] = [];
  let errorMessage: string | null = null;

  try {
    const data = await getMenuItems();
    initialItems = Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("[browse-menu] load failed:", error);
    errorMessage =
      "We couldn't load the menu right now. Please refresh and try again.";
  }

  const locations = Array.from(
    new Set(
      initialItems
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
          <MenuBrowser initialItems={initialItems} locations={locations} />
        )}
      </div>
    </div>
  );
};

export default BrowseMenuPage;
