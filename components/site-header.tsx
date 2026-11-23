"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MAX_BASKET_ITEMS } from "@/lib/basket";
import { Brand } from "./brand";
import { Icon } from "./ui/icon";
import { useBasket } from "./basket-provider";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/seafood", label: "Our seafood" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/about", label: "About us" },
];
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  const { items } = useBasket();
  return (
    <header className="site-header">
      <div className="header-inner shell">
        <Brand />
        <nav aria-label="Main navigation" className="desktop-nav">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={
                (item.href === "/" ? path === "/" : path.startsWith(item.href))
                  ? "active"
                  : ""
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <Link
            href="/request-quote"
            className="button button-mint header-quote"
          >
            <Icon name="bag" size={17} />
            Request a quote
            {items.length > 0 && (
              <span
                className={`basket-count${items.length >= MAX_BASKET_ITEMS ? " is-full" : ""}`}
                aria-label={`${items.length} of ${MAX_BASKET_ITEMS} items`}
              >
                {items.length}/{MAX_BASKET_ITEMS}
              </span>
            )}
          </Link>
          <button
            type="button"
            className="icon-button mobile-menu"
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen(!open)}
          >
            <Icon name={open ? "close" : "menu"} size={25} />
          </button>
        </div>
      </div>
      {open && (
        <nav
          id="mobile-navigation"
          className="mobile-navigation"
          aria-label="Mobile navigation"
        >
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
            >
              {item.label}
              <Icon name="arrow" size={18} />
            </Link>
          ))}
          <Link href="/request-quote" onClick={() => setOpen(false)}>
            <span className="mobile-quote-label">
              Request a quote
              {items.length > 0 && (
                <span
                  className={`basket-count${items.length >= MAX_BASKET_ITEMS ? " is-full" : ""}`}
                >
                  {items.length}/{MAX_BASKET_ITEMS}
                </span>
              )}
            </span>
            <Icon name="arrow" size={18} />
          </Link>
        </nav>
      )}
    </header>
  );
}
