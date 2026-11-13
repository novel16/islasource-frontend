import type { Metadata } from "next";
import { DemoProvider } from "@/components/demo-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { siteUrl } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Bantayan Seafoods | Good seafood. Straight from the island.",
    template: "%s | Bantayan Seafoods",
  },
  description:
    "Seafood sourced on request from Bantayan Island’s local fishermen and producers. Fresh, frozen, and dried favorites, delivered with care.",
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
