import { getProduct } from "./products";

export type BasketItem = {
  id: string;
  name: string;
  quantity: number;
  unit: "kg";
  notes: string;
  image?: string;
};
export type Guest = {
  name: string;
  email: string;
  phone: string;
  location: string;
  date: string;
  notes: string;
};
export type Request = {
  reference: string;
  items: BasketItem[];
  guest: Guest;
  status: "requested" | "accepted" | "paid" | "sourcing" | "delivered";
};
export type DemoData = {
  basket: BasketItem[];
  requests: Request[];
  latest?: string;
};
export const emptyData: DemoData = { basket: [], requests: [] };
export const demoReference = "RFQ-2026-001";
export const demoEmail = "maia.reyes@example.com";
export const sampleRequest: Request = {
  reference: demoReference,
  items: [
    {
      id: "dried-squid",
      name: "Dried squid",
      quantity: 5,
      unit: "kg",
      notes: "Medium size",
      image: "/images/squid.jpg",
    },
  ],
  guest: {
    name: "Maia Reyes",
    email: demoEmail,
    phone: "0917 000 0000",
    location: "Cebu City, Cebu",
    date: "",
    notes: "Please pack for home delivery.",
  },
  status: "requested",
};

export function validQuantity(value: number) {
  return Number.isFinite(value) && value >= 0.5 && value <= 1000;
}
export function money(centavos: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  }).format(centavos / 100);
}

// ponytail: illustrative rates only; replace with supplier-approved quotation lines when an API exists.
export function quoteTotals(items: BasketItem[]) {
  const lines = items.map((item) => ({
    ...item,
    rate:
      item.id === "dried-squid"
        ? 64800
        : item.id === "blue-swimming-crab"
          ? 58000
          : item.id === "scallops"
            ? 28000
            : 42000,
  }));
  const subtotal = lines.reduce(
    (total, line) => total + Math.round(line.quantity * line.rate),
    0,
  );
  const delivery = 35000;
  const total = subtotal + delivery;
  const deposit = Math.round(total / 2);
  return {
    lines,
    subtotal,
    delivery,
    total,
    deposit,
    balance: total - deposit,
  };
}

export function parseDemo(raw: string): DemoData {
  try {
    const data = JSON.parse(raw) as Partial<DemoData>;
    if (!Array.isArray(data.basket) || !Array.isArray(data.requests))
      return emptyData;
    const itemValid = (item: BasketItem) =>
      item &&
      typeof item.id === "string" &&
      typeof item.name === "string" &&
      validQuantity(item.quantity) &&
      item.unit === "kg" &&
      typeof item.notes === "string";
    return {
      basket: data.basket.filter(itemValid),
      requests: data.requests.filter(
        (request) =>
          request &&
          typeof request.reference === "string" &&
          /^RFQ-\d{4}-\d{3,}$/.test(request.reference) &&
          Array.isArray(request.items) &&
          request.items.every(itemValid) &&
          request.guest &&
          typeof request.guest.name === "string" &&
          typeof request.guest.email === "string" &&
          typeof request.guest.location === "string" &&
          ["requested", "accepted", "paid", "sourcing", "delivered"].includes(
            request.status,
          ),
      ),
      latest: typeof data.latest === "string" ? data.latest : undefined,
    };
  } catch {
    return emptyData;
  }
}

export function productItem(
  slug: string,
  quantity: number,
  notes = "",
): BasketItem | undefined {
  const product = getProduct(slug);
  return product
    ? {
        id: product.slug,
        name: product.name,
        quantity,
        unit: "kg",
        notes,
        image: product.image,
      }
    : undefined;
}
