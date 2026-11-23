export type BasketItem = {
  id: string;
  name: string;
  quantity: number;
  unit: "kg" | "pack" | "piece";
  notes: string;
  image?: string;
  productId?: number;
  slug?: string;
  minimumQuantity?: number;
};

export type Guest = {
  name: string;
  email: string;
  phone: string;
  location: string;
  date: string;
  notes: string;
};

export const MAX_BASKET_ITEMS = 10;

export function canAddBasketItem(basket: BasketItem[], id: string): boolean {
  return (
    basket.some((entry) => entry.id === id) || basket.length < MAX_BASKET_ITEMS
  );
}

export function validQuantity(value: number, minimum = 0.5): boolean {
  return (
    Number.isFinite(value) &&
    value >= minimum &&
    value <= 1000 &&
    Number.isInteger(value * 1000)
  );
}

export function money(centavos: number): string {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  }).format(centavos / 100);
}

export function parseBasket(raw: string): BasketItem[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    const entries = Array.isArray(parsed)
      ? parsed
      : typeof parsed === "object" &&
          parsed !== null &&
          Array.isArray((parsed as { basket?: unknown }).basket)
        ? (parsed as { basket: unknown[] }).basket
        : null;
    if (!entries) return [];

    return entries.filter((entry): entry is BasketItem => {
      if (typeof entry !== "object" || entry === null) return false;
      const item = entry as Partial<BasketItem>;
      return (
        typeof item.id === "string" &&
        typeof item.name === "string" &&
        typeof item.quantity === "number" &&
        validQuantity(item.quantity) &&
        (item.unit === "kg" || item.unit === "pack" || item.unit === "piece") &&
        (item.productId === undefined || Number.isInteger(item.productId)) &&
        (item.minimumQuantity === undefined ||
          (Number.isFinite(item.minimumQuantity) && item.minimumQuantity > 0)) &&
        typeof item.notes === "string"
      );
    });
  } catch {
    return [];
  }
}
