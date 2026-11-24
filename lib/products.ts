import {
  API_BASE_URL,
  apiEndpoints,
  PublicApiError,
  publicApiRequest,
} from "./api";

export { PublicApiError };

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
    return new URL(normalized, new URL(API_BASE_URL).origin).toString();
  }
  return "/images/squid.jpg";
}

export async function getPublicProducts(
  options: {
    perPage?: number;
    search?: string;
    category?: ProductCategory;
  } = {},
): Promise<ProductPage> {
  const query = new URLSearchParams({
    page: "1",
    per_page: String(Math.min(100, Math.max(1, options.perPage ?? 100))),
  });
  if (options.search?.trim()) query.set("search", options.search.trim());
  if (options.category) query.set("category", options.category);
  return publicApiRequest<ProductPage>(
    `${apiEndpoints.seafood}?${query.toString()}`,
  );
}

export async function getPublicProduct(slug: string): Promise<Product> {
  const result = await publicApiRequest<{ data: Product }>(
    apiEndpoints.seafoodDetail(slug),
  );
  return result.data;
}

export async function submitGuestQuote(
  payload: GuestQuotePayload,
): Promise<GuestQuoteResponse> {
  const result = await publicApiRequest<{ data: GuestQuoteResponse }>(
    apiEndpoints.quoteRequests,
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
  return result.data;
}
