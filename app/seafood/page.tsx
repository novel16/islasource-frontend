import { Suspense } from "react";
import { connection } from "next/server";
import { Catalog } from "@/components/catalog";
import { Breadcrumb, ButtonLink, Eyebrow } from "@/components/ui/shared";
import { getPublicProducts, type Product } from "@/lib/products";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Our seafood",
  "Explore fresh, frozen, and dried seafood from Bantayan Island. Choose your favorites and request a supplier-confirmed quote, with no fixed public prices.",
  "/seafood",
);
export default function SeafoodPage() {
  return (
    <div className="shell page-content">
      <Breadcrumb current="Our seafood" />
      <div className="catalog-heading">
        <div>
          <Eyebrow>FRESH. FROZEN. DRIED.</Eyebrow>
          <h1>
            Good things
            <br />
            <em>from the sea.</em>
          </h1>
        </div>
        <p>
          Island favorites, sourced especially for you.
          <br />
          Pick what you love, tell us how much, and we’ll ask our local partners
          for a quote.
        </p>
      </div>
      <Suspense fallback={<p className="loading-text">Loading published seafood…</p>}>
        <PublishedCatalog />
      </Suspense>
    </div>
  );
}

async function PublishedCatalog() {
  await connection();
  let products: Product[] | null = null;
  try {
    products = (await getPublicProducts({ perPage: 100 })).data;
  } catch {
    products = null;
  }
  if (products === null) {
    return (
      <div className="empty-state">
        <h2>The seafood catalog is temporarily unavailable</h2>
        <p>Please try again in a little while.</p>
        <ButtonLink href="/seafood" variant="outline">Try again</ButtonLink>
      </div>
    );
  }
  if (!products.length) {
    return (
      <div className="empty-state">
        <h2>No seafood listings are published yet</h2>
        <p>Send us a custom request and we’ll check what our suppliers can source.</p>
        <ButtonLink href="/request-quote#custom-item">Make a custom request</ButtonLink>
      </div>
    );
  }
  return <Catalog products={products} />;
}
