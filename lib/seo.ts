import type { Metadata } from "next";

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
).replace(/\/$/, "");

export function pageMetadata(
  title: string,
  description: string,
  path: string,
  image = "/images/hero-seafood.jpg",
): Metadata {
  return {
    title,
    description,
    alternates: { canonical: `${siteUrl}${path}` },
    openGraph: {
      title: `${title} | IslaSource Seafoods`,
      description,
      url: `${siteUrl}${path}`,
      siteName: "IslaSource Seafoods",
      type: "website",
      locale: "en_PH",
      images: [{ url: image, width: 1200, height: 800 }],
    },
  };
}

export const privateMetadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Your request",
};
