"use client";

import {
  createContext,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  canAddBasketItem,
  parseBasket,
  type BasketItem,
} from "@/lib/basket";

const storageKey = "islasource-basket-v1";
const legacyStorageKey = "bantayan-customer-demo-v1";
const changeEvent = "islasource-basket-change";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(changeEvent, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(changeEvent, callback);
  };
}

let storageAvailable = true;
let memoryRaw = "[]";

function snapshot(): string {
  if (!storageAvailable) return memoryRaw;
  try {
    return (
      localStorage.getItem(storageKey) ??
      localStorage.getItem(legacyStorageKey) ??
      "[]"
    );
  } catch {
    storageAvailable = false;
    return memoryRaw;
  }
}

function write(items: BasketItem[]) {
  memoryRaw = JSON.stringify(items);
  try {
    localStorage.setItem(storageKey, memoryRaw);
    localStorage.removeItem(legacyStorageKey);
  } catch {
    storageAvailable = false;
  }
  window.dispatchEvent(new Event(changeEvent));
}

type BasketContextValue = {
  items: BasketItem[];
  ready: boolean;
  addItem: (item: BasketItem) => boolean;
  updateItem: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearBasket: () => void;
};

const BasketContext = createContext<BasketContextValue | null>(null);

export function BasketProvider({ children }: { children: ReactNode }) {
  const raw = useSyncExternalStore(subscribe, snapshot, () => "");
  const items = useMemo(() => parseBasket(raw), [raw]);

  function addItem(item: BasketItem): boolean {
    if (!canAddBasketItem(items, item.id)) return false;
    const existing = items.find((entry) => entry.id === item.id);
    write(
      existing
        ? items.map((entry) =>
            entry.id === item.id
              ? {
                  ...entry,
                  quantity: Math.min(1000, entry.quantity + item.quantity),
                  notes: item.notes || entry.notes,
                }
              : entry,
          )
        : [...items, item],
    );
    return true;
  }

  return (
    <BasketContext.Provider
      value={{
        items,
        ready: raw !== "",
        addItem,
        updateItem: (id, quantity) =>
          write(
            items.map((item) =>
              item.id === id ? { ...item, quantity } : item,
            ),
          ),
        removeItem: (id) => write(items.filter((item) => item.id !== id)),
        clearBasket: () => write([]),
      }}
    >
      {children}
    </BasketContext.Provider>
  );
}

export function useBasket() {
  const context = useContext(BasketContext);
  if (!context) throw new Error("BasketProvider is required.");
  return context;
}
