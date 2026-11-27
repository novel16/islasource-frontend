import type { MetadataRoute } from "next";
import { getPublicProducts } from "@/lib/products";
import { siteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [
    "",
    "/seafood",
    "/how-it-works",
    "/about",
    "/terms",
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.8,
  }));

  try {
    const { data } = await getPublicProducts({ perPage: 100 });
    for (const product of data) {
      if (!product.indexable) continue;
      const canonical = product.canonical_url || `${siteUrl}/seafood/${product.slug}`;
      if (new URL(canonical).origin !== new URL(siteUrl).origin) continue;
      entries.push({
        url: canonical,
        lastModified: product.updated_at,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  } catch {
    // Keep the public pages in the sitemap if the catalog API is unavailable.
  }

  return entries;
}
