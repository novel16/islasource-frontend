import type { Metadata } from "next";
import { DemoProvider } from "@/components/demo-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { siteUrl } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "IslaSource Seafoods | Seafood Sourcing & Resale",
    template: "%s | IslaSource Seafoods",
  },
  description:
    "IslaSource Seafoods sources fresh, frozen, and dried seafood directly from local suppliers upon your quote request. No own stocked inventory; prices and availability are confirmed per request.",
  icons: { icon: "/icon.svg" },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <DemoProvider>
          <a className="skip-link" href="#main-content">
            Skip to content
          </a>
          <SiteHeader />
          <main id="main-content">{children}</main>
          <SiteFooter />
        </DemoProvider>
      </body>
    </html>
  );
}
