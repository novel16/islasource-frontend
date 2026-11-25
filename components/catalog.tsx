"use client";

import { useEffect, useRef, useState } from "react";
import {
  getPublicProducts,
  PUBLIC_CATALOG_PER_PAGE,
  type ProductCategory,
  type ProductPage,
} from "@/lib/products";
import { ProductCard } from "./product-card";
import { Icon } from "./ui/icon";
import { ButtonLink } from "./ui/shared";

const CATEGORY_ORDER: ProductCategory[] = [
  "Dried seafood",
  "Fresh seafood",
  "Frozen seafood",
];

export function Catalog({ initialCatalog }: { initialCatalog: ProductPage }) {
  const [catalogPage, setCatalogPage] = useState<ProductPage>(initialCatalog);
  const [category, setCategory] = useState<ProductCategory | "All">("All");
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const toolbarRef = useRef<HTMLDivElement | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      abortRef.current?.abort();
    };
  }, []);

  const rawCounts =
    catalogPage.meta.category_counts ?? initialCatalog.meta.category_counts;
  const fallbackCounts = initialCatalog.data.reduce<
    Partial<Record<ProductCategory, number>>
  >((acc, item) => {
    acc[item.category] = (acc[item.category] ?? 0) + 1;
    return acc;
  }, {});
  const categoryCounts = rawCounts ?? fallbackCounts;
  const categories = CATEGORY_ORDER.filter(
    (cat) => (categoryCounts[cat] ?? 0) > 0,
  );
  const publishedTotal = rawCounts
    ? Object.values(rawCounts).reduce((sum, count) => sum + (count ?? 0), 0)
    : initialCatalog.meta.total;

  async function fetchCatalog(
    nextPage: number,
    nextCategory: ProductCategory | "All",
    nextQuery: string,
  ) {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setIsLoading(true);
    setLoadError(null);

    try {
      const nextCatalog = await getPublicProducts({
        page: nextPage,
        perPage: PUBLIC_CATALOG_PER_PAGE,
        category: nextCategory === "All" ? undefined : nextCategory,
        search: nextQuery.trim() || undefined,
        signal: controller.signal,
      });
      setCatalogPage(nextCatalog);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setLoadError(
        error instanceof Error
          ? error.message
          : "We couldn’t load this page right now. Please try again.",
      );
    } finally {
      if (abortRef.current === controller) {
        setIsLoading(false);
      }
    }
  }

  function handleCategoryChange(nextCategory: ProductCategory | "All") {
    if (nextCategory === category && catalogPage.meta.current_page === 1) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setCategory(nextCategory);
    void fetchCatalog(1, nextCategory, query);
  }

  function handleQueryChange(nextQuery: string) {
    setQuery(nextQuery);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      void fetchCatalog(1, category, nextQuery);
    }, 250);
  }

  function handleClearSearch() {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setQuery("");
    void fetchCatalog(1, category, "");
  }

  function handleResetFilters() {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setQuery("");
    setCategory("All");
    void fetchCatalog(1, "All", "");
  }

  function handlePageChange(nextPage: number) {
    if (nextPage === catalogPage.meta.current_page) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    toolbarRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    void fetchCatalog(nextPage, category, query);
  }

  const totalMatches = catalogPage.meta.total;
  const totalPages = catalogPage.meta.last_page;
  const currentPage = catalogPage.meta.current_page;

  return (
    <>
      <div ref={toolbarRef} className="catalog-toolbar">
        <div className="filter-tabs" role="group" aria-label="Seafood category">
          {(["All", ...categories] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => handleCategoryChange(item)}
              aria-pressed={category === item}
              className={category === item ? "selected" : ""}
            >
              {item === "All" ? "All seafood" : item.replace(" seafood", "")}
              <span>
                {item === "All" ? publishedTotal : (categoryCounts[item] ?? 0)}
              </span>
            </button>
          ))}
        </div>
        <label className="search-field">
          <Icon name="search" size={18} />
          <span className="sr-only">Search seafood</span>
          <input
            value={query}
            onChange={(event) => handleQueryChange(event.target.value)}
            placeholder="Find your seafood…"
          />
          {query && (
            <button
              type="button"
              onClick={handleClearSearch}
              aria-label="Clear search"
            >
              <Icon name="close" size={16} />
            </button>
          )}
        </label>
      </div>
      <p className="result-count" aria-live="polite">
        {totalMatches}{" "}
        {totalMatches === 1 ? "seafood option" : "seafood options"} to explore ·
        Availability confirmed with every request
      </p>
      {loadError ? (
        <div className="empty-state">
          <h2>Couldn’t load seafood page</h2>
          <p>{loadError}</p>
          <button
            type="button"
            className="button button-outline"
            onClick={() => void fetchCatalog(currentPage, category, query)}
          >
            Try again
          </button>
        </div>
      ) : catalogPage.data.length ? (
        <>
          <div
            className={`product-grid catalog-grid${isLoading ? " is-loading" : ""}`}
            aria-busy={isLoading}
          >
            {catalogPage.data.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
          {totalPages > 1 && (
            <nav
              className="catalog-pagination"
              aria-label="Seafood catalog pages"
            >
              {Array.from({ length: totalPages }, (_, index) => {
                const pageNumber = index + 1;
                const isActive = pageNumber === currentPage;
                return (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => handlePageChange(pageNumber)}
                    disabled={isLoading}
                    aria-label={`Page ${pageNumber}`}
                    aria-current={isActive ? "page" : undefined}
                    className={`catalog-page-dot${isActive ? " is-active" : ""}`}
                  >
                    <span aria-hidden="true" />
                  </button>
                );
              })}
            </nav>
          )}
        </>
      ) : (
        <div className="empty-state">
          <Icon name="search" size={32} />
          <h2>No seafood found</h2>
          <p>Try another name, or tell us what you’re looking for.</p>
          <button
            type="button"
            className="button button-outline"
            onClick={handleResetFilters}
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
