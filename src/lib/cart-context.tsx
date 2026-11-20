"use client";

import {
  createContext,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

/** One line in the shopping bag. */
export interface CartItem {
  id: string;
  itemName: string;
  price: number;
  imageUrl: string;
  location: string;
  quantity: number;
}

/** Payload accepted when adding an item (quantity defaults to 1). */
export type CartItemInput = Omit<CartItem, "quantity">;

interface CartContextValue {
  items: CartItem[];
  /** Total number of units in the bag (sum of quantities). */
  count: number;
  /** Sum of price × quantity — format with `toFixed(2)` for display. */
  total: number;
  addItem: (item: CartItemInput, quantity?: number) => void;
  removeItem: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

const STORAGE_KEY = "pizzahub-cart-v1";
const MAX_QUANTITY = 20;

/* ------------------------------------------------------------------ */
/* Tiny external store: localStorage-backed, SSR-safe and shared by   */
/* every consumer (navbar badge, drawer, item details button).        */
/* ------------------------------------------------------------------ */

/** Stable empty array returned during SSR / hydration. */
const EMPTY: CartItem[] = [];

let cached: CartItem[] | null = null;
const listeners = new Set<() => void>();

const isValidCartItem = (value: unknown): value is CartItem => {
  if (!value || typeof value !== "object") return false;
  const entry = value as Partial<CartItem>;
  return (
    typeof entry.id === "string" &&
    typeof entry.itemName === "string" &&
    typeof entry.quantity === "number"
  );
};

/** Reads the bag from localStorage (client only, parsed once). */
const load = (): CartItem[] => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isValidCartItem) : [];
  } catch {
    /* Corrupt or unavailable storage — start with an empty bag. */
    return [];
  }
};

const persist = (items: CartItem[]) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* Storage full/blocked — the bag still works in memory. */
  }
};

const getSnapshot = (): CartItem[] => {
  if (cached === null) cached = load();
  return cached;
};

const getServerSnapshot = (): CartItem[] => EMPTY;

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

/** Applies an update, persists it and notifies every subscriber. */
const update = (updater: (items: CartItem[]) => CartItem[]) => {
  const next = updater(getSnapshot());
  if (next === cached) return;
  cached = next;
  persist(next);
  listeners.forEach((listener) => listener());
};

/* ------------------------------------------------------------------ */

const CartContext = createContext<CartContextValue | null>(null);

/**
 * Shopping bag provider, shared between the item details "Add to bag"
 * button and the navbar bag drawer. The bag lives in localStorage — it
 * never touches the server, because orders are still placed per item from
 * the item details page.
 */
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const actions = useMemo(
    () => ({
      addItem: (item: CartItemInput, quantity = 1) => {
        update((current) => {
          const amount = Math.min(MAX_QUANTITY, Math.max(1, quantity));
          const existing = current.find((entry) => entry.id === item.id);

          if (existing) {
            if (existing.quantity >= MAX_QUANTITY) return current;
            return current.map((entry) =>
              entry.id === item.id
                ? {
                    ...entry,
                    quantity: Math.min(MAX_QUANTITY, entry.quantity + amount),
                  }
                : entry,
            );
          }

          return [...current, { ...item, quantity: amount }];
        });
      },
      removeItem: (id: string) => {
        update((current) => current.filter((entry) => entry.id !== id));
      },
      setQuantity: (id: string, quantity: number) => {
        update((current) =>
          current
            .map((entry) =>
              entry.id === id
                ? {
                    ...entry,
                    quantity: Math.min(MAX_QUANTITY, Math.max(1, quantity)),
                  }
                : entry,
            )
            .filter((entry) => entry.quantity > 0),
        );
      },
      clearCart: () => update(() => []),
    }),
    [],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count: items.reduce((sum, entry) => sum + entry.quantity, 0),
      total: items.reduce(
        (sum, entry) => sum + Number(entry.price ?? 0) * entry.quantity,
        0,
      ),
      ...actions,
    }),
    [items, actions],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

/** Access the shopping bag. Must be used under `CartProvider`. */
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
