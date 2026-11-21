export type ProductCategory =
  | "Dried seafood"
  | "Fresh seafood"
  | "Frozen seafood";
export type ProductUnit = "kg" | "pack" | "piece";

export type Product = {
  id: number;
  name: string;
  category: ProductCategory;
  unit: ProductUnit;
  description: string;
  specs: string;
  slug: string;
  meta_title: string;
  meta_description: string;
  og_title: string;
  og_description: string;
  image: string;
  image_alt: string;
  og_image: string;
  canonical_url: string;
  indexable: boolean;
  min_order_quantity: string | number;
  availability_note: string;
  updated_at: string;
};

export type ProductPage = {
  data: Product[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
};

export type GuestQuotePayload = {
  customer_name: string;
  email: string;
  phone: string;
  location: string;
  requested_delivery_date: string | null;
  notes: string;
  terms_accepted: true;
  items: {
    product_id: number | null;
    name: string;
    quantity: number;
    unit: ProductUnit;
    notes: string;
  }[];
};

export type GuestQuoteResponse = { reference: string };

export class PublicApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly errors: Record<string, string[]> = {},
  ) {
    super(message);
    this.name = "PublicApiError";
  }
}

const apiBase = (
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1"
).replace(/\/+$/, "");
const localProductImages = [
  "/images/squid.jpg",
  "/images/crab.jpg",
  "/images/scallops.jpg",
  "/images/dried-fish.jpg",
];

export function productImageSrc(path: string): string {
  if (localProductImages.includes(path)) return path;
  if (/^\/?storage\/products\/[a-zA-Z0-9_-]+\.(?:jpe?g|png|webp)$/i.test(path)) {
    const normalized = path.startsWith("/") ? path : `/${path}`;
    return new URL(normalized, new URL(apiBase).origin).toString();
  }
  return "/images/squid.jpg";
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${apiBase}${path}`, {
      ...init,
      credentials: "omit",
      cache: "no-store",
      redirect: "error",
      headers: {
        Accept: "application/json",
        ...(init.body ? { "Content-Type": "application/json" } : {}),
        ...init.headers,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") throw error;
    throw new PublicApiError(
      0,
      "We couldn’t connect to the seafood catalog. Please try again shortly.",
    );
  }

  const body: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const record =
      typeof body === "object" && body !== null
        ? (body as Record<string, unknown>)
        : {};
    const rawErrors = record.errors;
    const errors: Record<string, string[]> = {};
    if (typeof rawErrors === "object" && rawErrors !== null) {
      for (const [key, value] of Object.entries(rawErrors)) {
        if (Array.isArray(value) && value.every((item) => typeof item === "string")) {
          errors[key] = value;
        }
      }
    }
    throw new PublicApiError(
      response.status,
      typeof record.message === "string"
        ? record.message
        : "We couldn’t complete that request. Please try again.",
      errors,
    );
  }
  if (body === null) {
    throw new PublicApiError(502, "We couldn’t read the response. Please try again.");
  }
  return body as T;
}

export async function getPublicProducts(options: {
  perPage?: number;
  search?: string;
  category?: ProductCategory;
} = {}): Promise<ProductPage> {
  const query = new URLSearchParams({
    page: "1",
    per_page: String(Math.min(100, Math.max(1, options.perPage ?? 100))),
  });
  if (options.search?.trim()) query.set("search", options.search.trim());
  if (options.category) query.set("category", options.category);
  return request<ProductPage>(`/seafood?${query.toString()}`);
}

export async function getPublicProduct(slug: string): Promise<Product> {
  const result = await request<{ data: Product }>(
    `/seafood/${encodeURIComponent(slug)}`,
  );
  return result.data;
}

export async function submitGuestQuote(
  payload: GuestQuotePayload,
): Promise<GuestQuoteResponse> {
  const result = await request<{ data: GuestQuoteResponse }>("/quote-requests", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return result.data;
}
