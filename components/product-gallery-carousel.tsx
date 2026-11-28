"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { CarouselSlide } from "@/lib/products";
import { Badge } from "./ui/shared";

export function ProductGalleryCarousel({
  slides,
  categoryBadge,
}: {
  slides: CarouselSlide[];
  categoryBadge: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const safeIndex = activeIndex < slides.length ? activeIndex : 0;
  const current = slides[safeIndex] ?? slides[0];
  const hasMultiple = slides.length > 1;

  function step(delta: -1 | 1) {
    if (!hasMultiple) return;
    setActiveIndex((prev) => (prev + delta + slides.length) % slides.length);
  }

  return (
    <div
      className="product-gallery-column"
      tabIndex={hasMultiple ? 0 : undefined}
      aria-label={hasMultiple ? "Seafood photo gallery" : undefined}
      onKeyDown={(event) => {
        if (!hasMultiple) return;
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          step(-1);
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          step(1);
        }
      }}
    >
      <div
        className="product-detail-image"
        onTouchStart={(event) => {
          touchStartX.current = event.touches[0]?.clientX ?? null;
        }}
        onTouchEnd={(event) => {
          if (!hasMultiple || touchStartX.current === null) return;
          const endX = event.changedTouches[0]?.clientX ?? touchStartX.current;
          const deltaX = endX - touchStartX.current;
          touchStartX.current = null;
          if (deltaX <= -40) step(1);
          else if (deltaX >= 40) step(-1);
        }}
      >
        <Image
          key={`${current.src}-${safeIndex}`}
          src={current.src}
          alt={current.alt}
          fill
          priority={safeIndex === 0}
          unoptimized={/^https?:\/\//i.test(current.src)}
          sizes="(max-width: 760px) 90vw, 47vw"
        />
        <Badge>{categoryBadge}</Badge>

        {hasMultiple && (
          <>
            <span className="carousel-counter" aria-live="polite">
              {safeIndex + 1} / {slides.length}
            </span>
            <button
              type="button"
              className="carousel-arrow prev"
              aria-label="Previous photo"
              onClick={() => step(-1)}
            >
              ‹
            </button>
            <button
              type="button"
              className="carousel-arrow next"
              aria-label="Next photo"
              onClick={() => step(1)}
            >
              ›
            </button>
          </>
        )}

        <span className="detail-image-note">
          {hasMultiple
            ? "Representative photos · exact catch confirmed in your quote"
            : "Representative image · exact catch confirmed in your quote"}
        </span>
      </div>

      {hasMultiple && (
        <div
          className="product-carousel-thumbs"
          role="tablist"
          aria-label="Choose product photo"
        >
          {slides.map((slide, index) => (
            <button
              key={`${slide.src}-thumb-${index}`}
              type="button"
              role="tab"
              aria-selected={index === safeIndex}
              aria-label={`View photo ${index + 1} of ${slides.length}`}
              className={index === safeIndex ? "active" : ""}
              onClick={() => setActiveIndex(index)}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                width={76}
                height={66}
                unoptimized={/^https?:\/\//i.test(slide.src)}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
