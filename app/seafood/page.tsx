import { Catalog } from "@/components/catalog";
import { Breadcrumb, Eyebrow } from "@/components/ui/shared";
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
      <Catalog />
    </div>
  );
}
