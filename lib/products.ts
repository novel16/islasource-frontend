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

export type ProductGalleryItem = {
  image: string;
  image_alt: string;
};

export type CarouselSlide = {
  src: string;
  alt: string;
};

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
  gallery_images?: ProductGalleryItem[];
  og_image: string;
  canonical_url: string;
  indexable: boolean;
  min_order_quantity: string | number;
  availability_note: string;
  updated_at: string;
};

export const PUBLIC_CATALOG_PER_PAGE = 12;

export type ProductPage = {
  data: Product[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    category_counts?: Partial<Record<ProductCategory, number>>;
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
  verification_code: string;
  website?: string;
  items: {
    product_id: number | null;
    name: string;
    quantity: number;
    unit: ProductUnit;
    notes: string;
  }[];
};

export type GuestQuoteCodePayload = {
  customer_name: string;
  email: string;
  website: string;
  elapsed_ms: number;
};

export type GuestQuoteCodeResponse = {
  cooldown_seconds: number;
  expires_in_seconds: number;
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

export function buildProductCarouselSlides(
  product: Pick<Product, "name" | "image" | "image_alt" | "gallery_images">,
): CarouselSlide[] {
  const cover: CarouselSlide = {
    src: productImageSrc(product.image),
    alt: product.image_alt?.trim() || product.name,
  };
  const extras = (product.gallery_images ?? []).slice(0, 7).map((entry) => ({
    src: productImageSrc(entry.image),
    alt: entry.image_alt?.trim() || product.name,
  }));

  return [cover, ...extras];
}

export async function getPublicProducts(
  options: {
    page?: number;
    perPage?: number;
    search?: string;
    category?: ProductCategory;
    signal?: AbortSignal;
  } = {},
): Promise<ProductPage> {
  const query = new URLSearchParams({
    page: String(Math.max(1, Math.trunc(options.page ?? 1))),
    per_page: String(
      Math.min(100, Math.max(1, options.perPage ?? PUBLIC_CATALOG_PER_PAGE)),
    ),
  });
  if (options.search?.trim()) query.set("search", options.search.trim());
  if (options.category) query.set("category", options.category);
  return publicApiRequest<ProductPage>(
    `${apiEndpoints.seafood}?${query.toString()}`,
    options.signal ? { signal: options.signal } : {},
  );
}

export async function getPublicProduct(slug: string): Promise<Product> {
  const result = await publicApiRequest<{ data: Product }>(
    apiEndpoints.seafoodDetail(slug),
  );
  return result.data;
}

export async function sendGuestQuoteCode(
  payload: GuestQuoteCodePayload,
): Promise<GuestQuoteCodeResponse> {
  const result = await publicApiRequest<{ data: GuestQuoteCodeResponse }>(
    apiEndpoints.quoteRequestSendCode,
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
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
