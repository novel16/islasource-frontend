import Image from "next/image";
import Link from "next/link";
import { productImageSrc, type Product } from "@/lib/products";
import { Badge } from "./ui/shared";
import { Icon } from "./ui/icon";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="product-card">
      <Link
        href={`/seafood/${product.slug}`}
        className="product-image-link"
        aria-label={`View ${product.name}`}
      >
        <Image
          src={productImageSrc(product.image)}
          alt={product.image_alt}
          fill
          unoptimized={product.image.startsWith("/storage/")}
          sizes="(max-width: 600px) 90vw, (max-width: 1000px) 45vw, 25vw"
        />
        <Badge>
          {product.category === "Dried seafood" ? (
            <Icon name="sun" size={12} />
          ) : product.category === "Frozen seafood" ? (
            <Icon name="snow" size={12} />
          ) : (
            <Icon name="fish" size={13} />
          )}
          {product.category}
        </Badge>
        <span className="image-arrow">
          <Icon name="arrow" size={20} />
        </span>
      </Link>
      <div className="product-card-body">
        <span className="product-local">{product.category}</span>
        <h3>
          <Link href={`/seafood/${product.slug}`}>{product.name}</Link>
        </h3>
        <div className="product-card-bottom">
          <span>Price on request</span>
          <Link
            href={`/seafood/${product.slug}`}
            aria-label={`Request ${product.name}`}
          >
            <Icon name="plus" size={19} />
          </Link>
        </div>
      </div>
    </article>
  );
}
