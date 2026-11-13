import Image from "next/image";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { products, getProduct } from "@/lib/products";
import { pageMetadata } from "@/lib/seo";
import { Badge, Breadcrumb, Eyebrow } from "@/components/ui/shared";
import { ProductRequest } from "@/components/product-request";
import { ProductCard } from "@/components/product-card";
import { Icon } from "@/components/ui/icon";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const product = getProduct((await params).slug);
  if (!product) return {};
  return pageMetadata(
    product.seoTitle,
    product.description,
    `/seafood/${product.slug}`,
    product.image,
  );
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
  const product = getProduct((await params).slug);
  if (!product) notFound();
  return (
    <div className="shell page-content">
      <Breadcrumb
        current={product.name}
        parent={{ href: "/seafood", label: "Our seafood" }}
      />
      <div className="product-detail">
        <div className="product-detail-image">
          <Image
            src={product.image}
            alt={product.imageAlt}
            fill
            priority
            sizes="(max-width: 760px) 90vw, 47vw"
          />
          <Badge>{product.category} · Bantayan Island</Badge>
          <span className="detail-image-note">
            Representative image · exact catch confirmed in your quote
          </span>
        </div>
        <div className="product-detail-copy">
          <Eyebrow>{product.localName.toUpperCase()} · ISLAND FAVORITE</Eyebrow>
          <h1>{product.name}</h1>
          <p className="product-description">{product.description}</p>
          <div className="product-price-note">
            <strong>Price on request</strong>
            <span>
              <span className="status-dot" />
              Availability confirmed by our partners
            </span>
          </div>
          <dl className="product-specs">
            <div>
              <dt>Size & grade</dt>
              <dd>{product.size}</dd>
            </div>
            <div>
              <dt>Preparation</dt>
              <dd>{product.preparation}</dd>
            </div>
            <div>
              <dt>Origin</dt>
              <dd>Bantayan Island, Cebu, Philippines</dd>
            </div>
            <div>
              <dt>Sourcing</dt>
              <dd>On request · no ready stock guaranteed</dd>
            </div>
          </dl>
          <ProductRequest product={product} />
          <p className="product-delivery-note">
            <Icon name="truck" size={19} />
            Delivery fee and schedule included in your personal quotation.
          </p>
        </div>
      </div>
      <section className="related-products">
        <div className="section-heading">
          <div>
            <Eyebrow>MAKE IT AN ISLAND SPREAD</Eyebrow>
            <h2>A few more good things.</h2>
          </div>
        </div>
        <div className="product-grid">
          {products
            .filter((item) => item.slug !== product.slug)
            .slice(0, 4)
            .map((item) => (
              <ProductCard key={item.slug} product={item} />
            ))}
        </div>
      </section>
    </div>
  );
}
