import { Suspense } from "react";
import { connection } from "next/server";
import { Breadcrumb, ButtonLink, Eyebrow } from "@/components/ui/shared";
import { pageMetadata } from "@/lib/seo";
import {
  defaultPublicSiteSettings,
  getPublicSiteSettings,
  type TermsSection,
} from "@/lib/site-settings";

export const metadata = pageMetadata(
  "Terms, pickup rules & privacy policy",
  "Terms and conditions, Bantayan Island and Cebu terminal pickup rules (Ceres North Bus Terminal and Jessamae island trucking), 100% QR Ph payment and perishable refund policy, and guest privacy policy.",
  "/terms",
);

function PolicyCards({ sections }: { sections: TermsSection[] }) {
  return (
    <div className="policy-sections">
      {sections.map((section) => (
        <section
          key={section.id}
          id={section.id}
          className="panel policy-card"
        >
          <span className="policy-number">{section.number}</span>
          <div>
            <h2>{section.title}</h2>
            {section.paragraphs.map((text, index) => (
              <p key={`${section.id}-p-${index}`}>{text}</p>
            ))}
            {section.bullets.length > 0 && (
              <ul>
                {section.bullets.map((bullet, index) => (
                  <li key={`${section.id}-b-${index}`}>{bullet}</li>
                ))}
              </ul>
            )}
          </div>
        </section>
      ))}
    </div>
  );
}

async function DynamicPolicySections() {
  await connection();
  const settings = await getPublicSiteSettings();
  return <PolicyCards sections={settings.terms_sections} />;
}

export default function TermsPage() {
  return (
    <div className="shell page-content">
      <Breadcrumb current="Terms & privacy" />
      <div className="page-heading">
        <Eyebrow>TERMS, PICKUP RULES &amp; PRIVACY</Eyebrow>
        <h1>
          Clear expectations,
          <br />
          <em>from island to terminal.</em>
        </h1>
        <p>
          How on-demand seafood sourcing, 100% QR Ph payment, Cebu North Bus
          Terminal &amp; Jessamae trucking pickup, perishable refunds, and guest
          privacy work at IslaSource Seafoods.
        </p>
        <nav className="policy-nav" aria-label="Policy sections">
          <a href="#delivery-pickup">Cebu &amp; Terminal Pickup</a>
          <a href="#payments-refunds">QR Ph Payment &amp; Refunds</a>
          <a href="#inspection">2-Hour Inspection</a>
          <a href="#privacy">Privacy Policy</a>
        </nav>
      </div>

      <Suspense
        fallback={
          <PolicyCards sections={defaultPublicSiteSettings.terms_sections} />
        }
      >
        <DynamicPolicySections />
      </Suspense>

      <div className="custom-request-banner">
        <div>
          <span className="eyebrow">READY TO REQUEST ISLAND SEAFOOD?</span>
          <h2>Start with a free quote—no payment until you approve.</h2>
          <p>
            Serving Bantayan Island &amp; Cebu via Ceres Bus (North Bus
            Terminal) and island trucking.
          </p>
        </div>
        <ButtonLink href="/seafood" arrow>
          Explore our seafood
        </ButtonLink>
      </div>
    </div>
  );
}
