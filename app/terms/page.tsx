import { Breadcrumb, ButtonLink, Eyebrow } from "@/components/ui/shared";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Terms, pickup rules & privacy policy",
  "Terms and conditions, Bantayan Island and Cebu terminal pickup rules (Ceres North Bus Terminal and island trucking), 100% QR Ph payment and perishable refund policy, and guest privacy policy.",
  "/terms",
);

const sections = [
  {
    id: "delivery-pickup",
    number: "01",
    title: "Service coverage, free island delivery & Cebu terminal pickup",
    paragraphs: [
      "IslaSource Seafoods is based in Baod, Bantayan, Cebu and currently serves mainland Bantayan Island and mainland Cebu only. Offshore islets requiring boat transfer (such as Kinatarcan or Hilantagaan) and provinces outside Cebu are not covered by standard online requests.",
      "Minimum order quantities and fulfillment channels depend on your location:",
    ],
    bullets: [
      "Within Mainland Bantayan Island (Bantayan, Santa Fe & Madridejos — Free Direct Delivery, 3 kg minimum): Orders of at least 3 kg are delivered directly to your barangay or landmark at no delivery charge (Free) from our base in Baod, Bantayan.",
      "Mainland Cebu via Ceres Bus Cargo (Cebu North Bus Terminal pickup — 5 kg minimum, Recommended for Fresh & Frozen Seafood): Fastest transit from Bantayan Island to Cebu City. Fresh and frozen seafood packed on ice are sent via Ceres Bus for customer pickup directly at Cebu North Bus Terminal.",
      "Mainland Cebu via Island Trucking such as Jessamae Trucking (Hub pickup — 5 kg minimum, Recommended for Dried Seafood): Transit typically takes around 1 day, making trucking ideal for dried fish (buwad). Customers claim their parcel directly at the designated Cebu trucking hub.",
      "Timely pickup responsibility: Once dispatched, we share bus/waybill details and estimated arrival via your Order Messages and email. Customers are responsible for receiving or claiming cargo promptly—IslaSource Seafoods is not liable for spoilage caused by delayed customer pickup.",
    ],
  },
  {
    id: "sourcing-quotes",
    number: "02",
    title: "On-demand sourcing & quotation validity",
    paragraphs: [
      "We do not hold pre-stocked seafood inventory. Catalog listings represent island seafood we source directly from Bantayan Island fishermen and local producers after receiving your guest quote request.",
      "Prices, catch sizes, and availability vary daily with sea conditions. Confirmed pricing and availability apply only to your personal quotation and remain valid until the stated expiration timestamp.",
    ],
  },
  {
    id: "payments-refunds",
    number: "03",
    title: "100% upfront payment (PayMongo QR Ph) & refund policy",
    paragraphs: [
      "Submitting a quote request is free and carries no obligation. Once you accept a quotation, 100% full upfront payment via PayMongo QR Ph Hosted Checkout is required before we purchase your seafood from island suppliers. Cash on delivery (COD) and partial deposits are not offered.",
    ],
    bullets: [
      "Before supplier purchase: You may decline a quotation or cancel an unpaid order at no cost. If you have already paid via QR Ph and sudden rough seas or supply shortages prevent us from buying your catch, you may choose either a rescheduled catch date or a full refund.",
      "After supplier purchase & packing: Because fresh and frozen seafood are perishable and bought specifically for your confirmed order, paid orders that have already been procured from suppliers or packed on Bantayan Island are strictly non-cancellable and non-refundable.",
    ],
  },
  {
    id: "inspection",
    number: "04",
    title: "Inspection upon terminal pickup (2-hour window)",
    paragraphs: [
      "Please check your package as soon as you claim it at Cebu North Bus Terminal, the trucking hub, or your agreed Bantayan Island pickup point.",
      "If an item is missing or arrives with a verifiable packing issue, message us on your private Order page (with clear photos or video of the unopened/opened styrofoam pack and waybill) within 2 hours of pickup so we can review and assist fairly.",
    ],
  },
  {
    id: "weather",
    number: "05",
    title: "Weather, sea conditions & ferry schedules",
    paragraphs: [
      "Island fishing and Bantayan–Cebu ferry crossings depend on Coast Guard clearances and weather conditions. If rough seas delay fishing or transit, we will notify you promptly via email or your Order page with the updated schedule.",
    ],
  },
  {
    id: "privacy",
    number: "06",
    title: "Guest privacy & payment security",
    paragraphs: [
      "No customer account is required. We collect only your name, email address, mobile number, Cebu/Bantayan pickup location, and order notes to prepare quotations, coordinate terminal pickup, and send transactional email updates.",
      "QR Ph payments are processed directly by PayMongo on their encrypted checkout page. IslaSource Seafoods never sees or stores your bank login, card, or e-wallet PIN credentials, and we never sell your contact details to third parties.",
    ],
  },
];

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
          Terminal &amp; trucking pickup, perishable refunds, and guest privacy
          work at IslaSource Seafoods.
        </p>
        <nav className="policy-nav" aria-label="Policy sections">
          <a href="#delivery-pickup">Cebu &amp; Terminal Pickup</a>
          <a href="#payments-refunds">QR Ph Payment &amp; Refunds</a>
          <a href="#inspection">2-Hour Inspection</a>
          <a href="#privacy">Privacy Policy</a>
        </nav>
      </div>

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
              {section.paragraphs.map((text) => (
                <p key={text}>{text}</p>
              ))}
              {section.bullets && (
                <ul>
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        ))}
      </div>

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
