"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  defaultPublicSiteSettings,
  getPublicSiteSettings,
} from "@/lib/site-settings";
import { Brand } from "./brand";
import { Icon } from "./ui/icon";

export function SiteFooter() {
  const [info, setInfo] = useState({
    business_name: defaultPublicSiteSettings.business_name,
    business_address: defaultPublicSiteSettings.business_address,
    contact_email: defaultPublicSiteSettings.contact_email,
    contact_phone: defaultPublicSiteSettings.contact_phone,
  });

  useEffect(() => {
    const controller = new AbortController();
    void getPublicSiteSettings(controller.signal).then((cfg) => {
      setInfo({
        business_name: cfg.business_name,
        business_address: cfg.business_address,
        contact_email: cfg.contact_email,
        contact_phone: cfg.contact_phone,
      });
    });
    return () => controller.abort();
  }, []);

  return (
    <footer className="site-footer">
      <div className="shell">
        <div className="footer-top">
          <div className="footer-brand">
            <Brand light />
            <p>
              Sourced on request.
              <br />
              Quoted with care.
            </p>
            <span className="footer-location">
              <Icon name="pin" size={15} />
              {info.business_address}
            </span>
            {info.contact_phone && (
              <span className="footer-location" style={{ marginTop: 6 }}>
                <Icon name="mail" size={14} />
                {info.contact_phone} · {info.contact_email}
              </span>
            )}
          </div>
          <div>
            <h3>Explore</h3>
            <Link href="/">Home</Link>
            <Link href="/seafood">Our seafood</Link>
            <Link href="/about">About us</Link>
            <Link href="/how-it-works">How it works</Link>
          </div>
          <div>
            <h3>Let’s get started</h3>
            <Link href="/request-quote">Request a quote</Link>
            <Link href="/how-it-works#questions">Common questions</Link>
            <Link href="/terms">Terms &amp; privacy policy</Link>
          </div>
          <div className="footer-note">
            <p>
              A little closer
              <br />
              to the island.
            </p>
            <svg
              width="116"
              height="24"
              viewBox="0 0 116 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M1 12c10-14 18 14 28 0s18 14 28 0 18 14 28 0 18 14 28 0"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © 2026 {info.business_name}. Your connection to the source.
          </span>
          <span>Bantayan Island &amp; Cebu · Sourced on request</span>
          <Link href="/terms">Terms, Pickup &amp; Privacy</Link>
        </div>
      </div>
    </footer>
  );
}
