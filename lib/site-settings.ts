import { API_BASE_URL, apiEndpoints, publicApiRequest } from "./api";

export type TermsSection = {
  id: string;
  number: string;
  title: string;
  paragraphs: string[];
  bullets: string[];
};

export type HomepageSettings = {
  advisory_enabled: boolean;
  advisory_text: string;
  hero_eyebrow: string;
  hero_headline: string;
  hero_subtext: string;
  hero_image: string;
  hero_image_alt: string;
  hero_caption: string;
  story_heading: string;
  story_paragraphs: string[];
  story_image: string;
  story_image_alt: string;
};

export type PublicSiteSettings = {
  business_name: string;
  contact_email: string;
  contact_phone: string;
  business_address: string;
  island_min_kg: number;
  cebu_min_kg: number;
  homepage: HomepageSettings;
  terms_sections: TermsSection[];
};

const builtInSiteImages = [
  "/images/hero-seafood.jpg",
  "/images/island.jpg",
  "/images/squid.jpg",
  "/images/crab.jpg",
  "/images/scallops.jpg",
  "/images/dried-fish.jpg",
];

export function siteImageSrc(path: string): string {
  if (builtInSiteImages.includes(path)) return path;
  if (/^\/?storage\/products\/[a-zA-Z0-9_-]+\.(?:jpe?g|png|webp)$/i.test(path)) {
    const normalized = path.startsWith("/") ? path : `/${path}`;
    return new URL(normalized, new URL(API_BASE_URL).origin).toString();
  }
  return "/images/hero-seafood.jpg";
}

export const defaultPublicSiteSettings: PublicSiteSettings = {
  business_name: "IslaSource Seafoods",
  contact_email: "islasource.support@gmail.com",
  contact_phone: "",
  business_address: "Baod, Bantayan, Cebu, Philippines",
  island_min_kg: 3,
  cebu_min_kg: 5,
  homepage: {
    advisory_enabled: false,
    advisory_text: "",
    hero_eyebrow: "SEAFOOD SOURCING & RESALE",
    hero_headline: "Island seafood.\nSourced\nfor you.",
    hero_subtext:
      "Meet IslaSource Seafoods. We source directly from local fishermen and seafood suppliers after your quote request, then arrange your order and delivery. Island connections, with fair pricing in mind.",
    hero_image: "/images/hero-seafood.jpg",
    hero_image_alt: "Fresh whole fish displayed on a bed of ice",
    hero_caption: "The good things come from the sea.",
    story_heading: "Your connection\nto the source.",
    story_paragraphs: [
      "We’re a seafood sourcing and resale business based in Bantayan Island, Cebu. We work directly with local fishermen and suppliers to find seafood for home cooks, restaurants, and resellers.",
      "We don’t keep our own seafood inventory. After your quote request, we check supplier availability, product condition, and current pricing. You review the details before we procure your order.",
      "Buying to order and working directly with suppliers helps us aim for affordable, competitive quotes. Final prices and supply are confirmed for each request.",
    ],
    story_image: "/images/island.jpg",
    story_image_alt:
      "A wooden boardwalk through a green mangrove forest on Bantayan",
  },
  terms_sections: [
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
      bullets: [],
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
      bullets: [],
    },
    {
      id: "weather",
      number: "05",
      title: "Weather, sea conditions & ferry schedules",
      paragraphs: [
        "Island fishing and Bantayan–Cebu ferry crossings depend on Coast Guard clearances and weather conditions. If rough seas delay fishing or transit, we will notify you promptly via email or your Order page with the updated schedule.",
      ],
      bullets: [],
    },
    {
      id: "privacy",
      number: "06",
      title: "Guest privacy & payment security",
      paragraphs: [
        "No customer account is required. We collect only your name, email address, mobile number, Cebu/Bantayan pickup location, and order notes to prepare quotations, coordinate terminal pickup, and send transactional email updates.",
        "QR Ph payments are processed directly by PayMongo on their encrypted checkout page. IslaSource Seafoods never sees or stores your bank login, card, or e-wallet PIN credentials, and we never sell your contact details to third parties.",
      ],
      bullets: [],
    },
  ],
};

export async function getPublicSiteSettings(
  signal?: AbortSignal,
): Promise<PublicSiteSettings> {
  try {
    const result = await publicApiRequest<{ data: PublicSiteSettings }>(
      apiEndpoints.siteSettings,
      signal ? { signal } : {},
    );
    return result.data;
  } catch {
    return defaultPublicSiteSettings;
  }
}
