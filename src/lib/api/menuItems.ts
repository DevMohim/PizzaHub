const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface MenuItemsQuery {
  search?: string;
  category?: string;
  location?: string;
  sort?: string;
  status?: string;
  active?: string;
  email?: string;
}

const getBaseUrl = () => {
  if (!BASE_URL) {
    throw new Error(
      "NEXT_PUBLIC_API_URL is not set. Check your .env.local file.",
    );
  }
  return BASE_URL;
};

/** Skips empty values and "all", which means "no filter". */
const buildQueryString = (query: MenuItemsQuery) => {
  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value && value !== "all") {
      params.set(key, value);
    }
  });

  return params.toString();
};

const fetchJson = async (url: string ) => {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status} ${res.statusText} (${url})`);
  }

  return res.json();
};

export const getMenuItems = async (query: MenuItemsQuery = {} ) => {
  const queryString = buildQueryString(query);
  const url = `${getBaseUrl()}/menuItems${queryString ? `?${queryString}` : ""}`;

  try {
    return await fetchJson(url );
  } catch (error) {
    console.error("Get menu items failed:", error);
    throw error;
  }
};

export const getMenuItemsByEmail = async (email: string ) => {
  if (!email) {
    throw new Error("User email is required.");
  }
  return getMenuItems({ email});
};

export const getMenuItemsById = async (id: string) => {
  if (!id) {
    throw new Error("Menu item id is required.");
  }

  try {
    return await fetchJson(`${getBaseUrl()}/menuItems/${id}`);
  } catch (error) {
    console.error("Get menu item failed:", error);
    throw error;
  }
};

export const getMenuItemsByStatus = async () => {
  return getMenuItems({ status: "pending" });
};
