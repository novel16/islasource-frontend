"use client";

import { useState } from "react";
import type { Product, ProductCategory } from "@/lib/products";
import { ProductCard } from "./product-card";
import { Icon } from "./ui/icon";
import { ButtonLink } from "./ui/shared";

export function Catalog({ products }: { products: Product[] }) {
  const [category, setCategory] = useState<ProductCategory | "All">("All");
  const [query, setQuery] = useState("");
  const categories = [...new Set(products.map((product) => product.category))];
  const matches = products.filter(
    (product) =>
      (category === "All" || product.category === category) &&
      `${product.name} ${product.category} ${product.specs}`
        .toLowerCase()
        .includes(query.toLowerCase().trim()),
  );
  return (
    <>
      <div className="catalog-toolbar">
        <div className="filter-tabs" role="group" aria-label="Seafood category">
          {(["All", ...categories] as const).map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              aria-pressed={category === item}
              className={category === item ? "selected" : ""}
            >
              {item === "All" ? "All seafood" : item.replace(" seafood", "")}
              <span>
                {item === "All"
                  ? products.length
                  : products.filter((product) => product.category === item).length}
              </span>
            </button>
          ))}
        </div>
        <label className="search-field">
          <Icon name="search" size={18} />
          <span className="sr-only">Search seafood</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Find your seafood…"
          />
          {query && (
            <button onClick={() => setQuery("")} aria-label="Clear search">
              <Icon name="close" size={16} />
            </button>
          )}
        </label>
      </div>
      <p className="result-count" aria-live="polite">
        {matches.length}{" "}
        {matches.length === 1 ? "seafood option" : "seafood options"} to
        explore · Availability confirmed with every request
      </p>
      {matches.length ? (
        <div className="product-grid catalog-grid">
          {matches.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Icon name="search" size={32} />
          <h2>No seafood found</h2>
          <p>Try another name, or tell us what you’re looking for.</p>
          <button
            className="button button-outline"
            onClick={() => {
              setQuery("");
              setCategory("All");
            }}
          >
            Reset filters
          </button>
        </div>
      )}
      <div className="custom-request-banner">
        <div>
          <span className="eyebrow">SOMETHING ELSE IN MIND?</span>
          <h2>If it’s from the sea, let’s ask the island.</h2>
          <p>
            Add a custom item to your request. We’ll check what our partners can
            source.
          </p>
        </div>
        <ButtonLink href="/request-quote#custom-item" variant="outline" arrow>
          Make a custom request
        </ButtonLink>
      </div>
    </>
  );
}
