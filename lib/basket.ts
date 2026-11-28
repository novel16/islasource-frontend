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
export const ISLAND_MIN_KG = 3;
export const CEBU_MIN_KG = 5;

export type DeliveryZone = "island" | "cebu";
export type IslandTown = "Bantayan" | "Santa Fe" | "Madridejos";
export type CebuChannel =
  | "Ceres Bus — Cebu North Bus Terminal"
  | "Jessamae / Island Trucking Hub";

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

export function deliveryLabel(centavos: number): string {
  return centavos <= 0 ? "Free" : money(centavos);
}

export function checkZoneMinimum(
  items: Pick<BasketItem, "quantity" | "unit">[],
  zone: DeliveryZone,
  mins?: { islandMinKg?: number; cebuMinKg?: number },
): {
  ok: boolean;
  totalKg: number;
  requiredKg: number;
  hasNonKg: boolean;
} {
  const islandMin =
    typeof mins?.islandMinKg === "number" && mins.islandMinKg > 0
      ? mins.islandMinKg
      : ISLAND_MIN_KG;
  const cebuMin =
    typeof mins?.cebuMinKg === "number" && mins.cebuMinKg > 0
      ? mins.cebuMinKg
      : CEBU_MIN_KG;
  const requiredKg = zone === "island" ? islandMin : cebuMin;
  let milliKg = 0;
  let hasNonKg = false;

  for (const item of items) {
    if (item.unit === "kg") {
      milliKg += Math.round(item.quantity * 1000);
    } else {
      hasNonKg = true;
    }
  }

  const totalKg = milliKg / 1000;
  const ok =
    items.length === 0 ? false : hasNonKg || milliKg >= requiredKg * 1000;

  return { ok, totalKg, requiredKg, hasNonKg };
}

export function formatDeliveryLocation(input: {
  zone: DeliveryZone;
  islandTown: IslandTown;
  detail: string;
  cebuChannel: CebuChannel;
}): string {
  const cleanDetail = input.detail.trim();
  if (input.zone === "island") {
    return cleanDetail
      ? `Bantayan Island (${input.islandTown}) — ${cleanDetail}`
      : "";
  }
  return cleanDetail
    ? `Mainland Cebu (${input.cebuChannel}) — ${cleanDetail}`
    : `Mainland Cebu (${input.cebuChannel})`;
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
