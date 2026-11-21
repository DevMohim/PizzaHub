const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/** Optional filters accepted by the `GET /menuItems` endpoint. */
export interface MenuItemsQuery {
  /** Free-text search across item name, description, category and location. */
  search?: string;
  /** Category value, e.g. "classic-pizzas". Use "all" to skip. */
  category?: string;
  /** Location name. Use "all" to skip. */
  location?: string;
  /** "default" | "price-asc" | "price-desc". */
  sort?: string;
  /** Review status, e.g. "approved" or "pending". */
  status?: string;
  /** "true" to only get published items. */
  active?: string;
  /** Vendor email — used by the vendor dashboard. */
  email?: string;
}

/** Turns the query object into a URL query string, skipping empty values. */
const buildQueryString = (query: MenuItemsQuery) => {
  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value) {
      params.set(key, value);
    }
  });

  return params.toString();
};

export const getMenuItems = async (query: MenuItemsQuery = {}) => {
  const queryString = buildQueryString(query);
  const url = queryString
    ? `${BASE_URL}/menuItems?${queryString}`
    : `${BASE_URL}/menuItems`;

  try {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(
        `Failed to get menu items. Server returned ${res.status} ${res.statusText}.`,
      );
    }

    return await res.json();
  } catch (error) {
    console.error("Get menu item failed:", error);

    throw new Error("Could not get menu item.", { cause: error });
  }
};

export const getMenuItemsByEmail = async (email: string) => {
  if (!email) {
    throw new Error("User email is required.");
  }

  return getMenuItems({ email });
};

export const getMenuItemsById = async (id: string) => {
  if (!id) {
    throw new Error("Menu item id is required.");
  }

  try {
    const res = await fetch(`${BASE_URL}/menuItems/${id}`);

    if (!res.ok) {
      throw new Error(
        `Failed to get menu items. Server returned ${res.status} ${res.statusText}.`,
      );
    }

    return await res.json();
  } catch (error) {
    console.error("Get menu item failed:", error);

    throw new Error("Could not get menu item.", { cause: error });
  }
};

export const getMenuItemsByStatus = async () => {
  return getMenuItems({ status: "pending" });
};