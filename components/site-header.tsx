"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Brand } from "./brand";
import { Icon } from "./ui/icon";
import { useDemo } from "./demo-provider";

const navigation = [
  { href: "/seafood", label: "Our seafood" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/our-island", label: "Our island" },
];
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  const { data } = useDemo();
  return (
    <header className="site-header">
      <div className="header-inner shell">
        <Brand />
        <nav aria-label="Main navigation" className="desktop-nav">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={path.startsWith(item.href) ? "active" : ""}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <Link href="/track" className="track-link">
            <Icon name="pin" size={16} />
            Track request
          </Link>
          <Link
            href="/request-quote"
            className="button button-mint header-quote"
          >
            <Icon name="bag" size={17} />
            Request a quote
            {data.basket.length > 0 && (
              <span className="basket-count">{data.basket.length}</span>
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
          {[
            ...navigation,
            { href: "/track", label: "Track request" },
            { href: "/request-quote", label: "Request a quote" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
            >
              {item.label}
              <Icon name="arrow" size={18} />
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
