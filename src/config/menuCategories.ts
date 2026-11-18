/** Menu categories required by the assignment. Shared across vendor pages. */
export const MENU_CATEGORIES = [
  { value: "classic-pizzas", label: "Classic Pizzas" },
  { value: "vegetarian-pizzas", label: "Vegetarian Pizzas" },
  { value: "meat-lovers", label: "Meat Lovers" },
  { value: "specialty-gourmet-pizzas", label: "Specialty / Gourmet Pizzas" },
  { value: "sides-appetizers", label: "Sides & Appetizers" },
  { value: "beverages-desserts", label: "Beverages & Desserts" },
] as const;

/**
 * Resolves a stored category value (e.g. "classic-pizzas") to its display
 * label. Falls back to a prettified version of the raw value so unknown or
 * legacy categories still render nicely.
 */
export const getCategoryLabel = (value?: string | null): string => {
  if (!value) return "Uncategorized";

  const match = MENU_CATEGORIES.find((category) => category.value === value);
  if (match) return match.label;

  return value
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};
