import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/quote/",
        "/order/",
        "/request-update/",
        "/request-quote",
        "/request-received",
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
