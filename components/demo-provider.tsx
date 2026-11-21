"use client";

import {
  createContext,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  parseDemo,
  sampleRequest,
  type BasketItem,
  type DemoData,
  type Guest,
  type Request,
} from "@/lib/demo";

const storageKey = "bantayan-customer-demo-v1";
const changeEvent = "bantayan-demo-change";
function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(changeEvent, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(changeEvent, callback);
  };
}
let storageAvailable = true;
let memoryRaw = "{}";
function snapshot() {
  if (!storageAvailable) return memoryRaw;
  try {
    return localStorage.getItem(storageKey) || "{}";
  } catch {
    storageAvailable = false;
    return memoryRaw;
  }
}
function write(data: DemoData) {
  memoryRaw = JSON.stringify(data);
  try {
    localStorage.setItem(storageKey, memoryRaw);
  } catch {
    storageAvailable = false;
  }
  window.dispatchEvent(new Event(changeEvent));
}
type DemoContextValue = {
  data: DemoData;
  ready: boolean;
  addItem: (item: BasketItem) => void;
  updateItem: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearBasket: () => void;
  submitRequest: (guest: Guest) => string;
  getRequest: (reference: string) => Request | undefined;
  updateStatus: (reference: string, status: Request["status"]) => void;
};
const DemoContext = createContext<DemoContextValue | null>(null);

export function DemoProvider({ children }: { children: ReactNode }) {
  const raw = useSyncExternalStore(subscribe, snapshot, () => "");
  const data = useMemo(() => parseDemo(raw), [raw]);
  function addItem(item: BasketItem) {
    const existing = data.basket.find((entry) => entry.id === item.id);
    write({
      ...data,
      basket: existing
        ? data.basket.map((entry) =>
            entry.id === item.id
              ? {
                  ...entry,
                  quantity: Math.min(1000, entry.quantity + item.quantity),
                  notes: item.notes || entry.notes,
                }
              : entry,
          )
        : [...data.basket, item],
    });
  }
  function submitRequest(guest: Guest) {
    const sequence = data.requests.length + 1;
    const reference = `RFQ-2026-${String(sequence).padStart(3, "0")}`;
    const request: Request = {
      reference,
      items: data.basket,
      guest,
      status: "requested",
    };
    write({
      ...data,
      basket: [],
      requests: [...data.requests, request],
      latest: reference,
    });
    return reference;
  }
  function getRequest(reference: string) {
    return (
      data.requests.find((request) => request.reference === reference) ||
      (reference === sampleRequest.reference ? sampleRequest : undefined)
    );
  }
  function updateStatus(reference: string, status: Request["status"]) {
    const request = getRequest(reference);
    if (!request) return;
    const exists = data.requests.some((entry) => entry.reference === reference);
    write({
      ...data,
      requests: exists
        ? data.requests.map((entry) =>
            entry.reference === reference ? { ...entry, status } : entry,
          )
        : [...data.requests, { ...request, status }],
    });
  }
  return (
    <DemoContext.Provider
      value={{
        data,
        ready: raw !== "",
        addItem,
        updateItem: (id, quantity) =>
          write({
            ...data,
            basket: data.basket.map((item) =>
              item.id === id ? { ...item, quantity } : item,
            ),
          }),
        removeItem: (id) =>
          write({
            ...data,
            basket: data.basket.filter((item) => item.id !== id),
          }),
        clearBasket: () => write({ ...data, basket: [] }),
        submitRequest,
        getRequest,
        updateStatus,
      }}
    >
      {children}
    </DemoContext.Provider>
  );
}
export function useDemo() {
  const context = useContext(DemoContext);
  if (!context) throw new Error("DemoProvider is required.");
  return context;
}
