import { Suspense } from "react";
import { connection } from "next/server";
import { notFound, permanentRedirect } from "next/navigation";
import type { Metadata } from "next";
import {
  buildProductCarouselSlides,
  getPublicProduct,
  getPublicProducts,
  productImageSrc,
  PublicApiError,
  type Product,
} from "@/lib/products";
import { pageMetadata, siteUrl } from "@/lib/seo";
import { Breadcrumb, ButtonLink, Eyebrow } from "@/components/ui/shared";
import { ProductGalleryCarousel } from "@/components/product-gallery-carousel";
import { ProductRequest } from "@/components/product-request";
import { ProductCard } from "@/components/product-card";
import { Icon } from "@/components/ui/icon";

const runtimeSlug = "__runtime__";

export function generateStaticParams() {
  return [{ slug: runtimeSlug }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (slug === runtimeSlug) return {};

  try {
    const product = await getPublicProduct(slug);
    const title = product.meta_title || product.name;
    const description = product.meta_description || product.description;
    const canonical =
      product.canonical_url || `${siteUrl}/seafood/${product.slug}`;
    const image = productImageSrc(product.og_image || product.image);
    const base = pageMetadata(
      title,
      description,
      `/seafood/${product.slug}`,
      image,
    );

    return {
      ...base,
      title,
      description,
      alternates: { canonical },
      robots: product.indexable ? undefined : { index: false, follow: false },
      openGraph: {
        ...base.openGraph,
        title: product.og_title || title,
        description: product.og_description || description,
        url: canonical,
        images: [{ url: image, alt: product.image_alt }],
      },
    };
  } catch {
    return { title: "Seafood listing unavailable", robots: { index: false } };
  }
}

export default function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="shell page-content">
          <p className="loading-text">Opening seafood details…</p>
        </div>
      }
    >
      <ProductDetails params={params} />
    </Suspense>
  );
}

async function ProductDetails({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await connection();
  const { slug } = await params;
  let product: Product;
  try {
    product = await getPublicProduct(slug);
  } catch (error) {
    if (error instanceof PublicApiError && error.status === 404) notFound();
    return (
      <div className="shell page-content empty-state">
        <h1>Seafood details are temporarily unavailable</h1>
        <p>Please try again in a little while.</p>
        <ButtonLink href={`/seafood/${slug}`} variant="outline">Try again</ButtonLink>
      </div>
    );
  }

  if (product.slug !== slug) {
    permanentRedirect(`/seafood/${product.slug}`);
  }

  let related: Product[] = [];
  try {
    related = (await getPublicProducts({ perPage: 5 })).data
      .filter((item) => item.id !== product.id)
      .slice(0, 4);
  } catch {
    related = [];
  }

  const slides = buildProductCarouselSlides(product);
  return (
    <div className="shell page-content">
      <Breadcrumb
        current={product.name}
        parent={{ href: "/seafood", label: "Our seafood" }}
      />
      <div className="product-detail">
        <ProductGalleryCarousel
          slides={slides}
          categoryBadge={`${product.category} · Bantayan Island`}
        />
        <div className="product-detail-copy">
          <Eyebrow>{product.category.toUpperCase()} · ISLAND SELECTION</Eyebrow>
          <h1>{product.name}</h1>
          <p className="product-description">{product.description}</p>
          <div className="product-price-note">
            <strong>Price on request</strong>
            <span>
              <span className="status-dot" />
              {product.availability_note || "Availability confirmed by our partners"}
            </span>
          </div>
          <dl className="product-specs">
            <div>
              <dt>Specifications &amp; packing</dt>
              <dd>{product.specs || "Confirmed with the supplier for each request."}</dd>
            </div>
            <div>
              <dt>Minimum request</dt>
              <dd>{Number(product.min_order_quantity)} {product.unit}</dd>
            </div>
            <div>
              <dt>Origin</dt>
              <dd>Bantayan Island, Cebu, Philippines</dd>
            </div>
            <div>
              <dt>Sourcing</dt>
              <dd>On request · supply is not guaranteed</dd>
            </div>
          </dl>
          <ProductRequest product={product} />
          <p className="product-delivery-note">
            <Icon name="truck" size={19} />
            Delivery fee and schedule included in your personal quotation.
          </p>
        </div>
      </div>
      {related.length > 0 && (
        <section className="related-products">
          <div className="section-heading">
            <div>
              <Eyebrow>MAKE IT AN ISLAND SPREAD</Eyebrow>
              <h2>A few more good things.</h2>
            </div>
          </div>
          <div className="product-grid">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
