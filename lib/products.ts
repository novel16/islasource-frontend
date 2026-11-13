export type Category = "Fresh" | "Frozen" | "Dried";

export type Product = {
  slug: string;
  name: string;
  localName: string;
  category: Category;
  image: string;
  imageAlt: string;
  description: string;
  seoTitle: string;
  size: string;
  preparation: string;
  featured?: boolean;
};

export const products: Product[] = [
  {
    slug: "blue-swimming-crab",
    name: "Blue swimming crab",
    localName: "Alimasag",
    category: "Fresh",
    image: "/images/crab.jpg",
    imageAlt: "Blue swimming crabs, illustrating the fresh crab selection",
    description:
      "Sweet, delicate meat with a taste of the island. Ask for your preferred size and we’ll check the day’s catch with our fishing partners.",
    seoTitle: "Fresh Blue Swimming Crab from Bantayan",
    size: "Medium to large · specify your preference",
    preparation: "Whole, freshly caught; chilled for transport",
    featured: true,
  },
  {
    slug: "dried-squid",
    name: "Dried squid",
    localName: "Pusit",
    category: "Dried",
    image: "/images/squid.jpg",
    imageAlt: "A person holding up sun-dried squid at a seafood market",
    description:
      "A Bantayan breakfast favorite, naturally sun-dried for a rich, savory bite. Beautiful grilled, fried, or shared over a long island lunch.",
    seoTitle: "Bantayan Dried Squid · Request a Quote",
    size: "Small, medium, or large · supplier confirmed",
    preparation: "Cleaned, salted, and sun-dried",
    featured: true,
  },
  {
    slug: "scallops",
    name: "Half-shell scallops",
    localName: "Scallops",
    category: "Frozen",
    image: "/images/scallops.jpg",
    imageAlt: "Fresh scallops in their natural shells",
    description:
      "Tender and naturally sweet. A lovely choice for buttered scallops, a family gathering, or your restaurant’s next menu.",
    seoTitle: "Bantayan Half-shell Scallops",
    size: "Mixed natural sizes · quoted per kilogram",
    preparation: "Cleaned half-shell; frozen for transport",
    featured: true,
  },
  {
    slug: "dried-fish-danggit",
    name: "Dried danggit",
    localName: "Danggit",
    category: "Dried",
    image: "/images/dried-fish.jpg",
    imageAlt: "Sun-dried fish prepared by island producers",
    description:
      "Crisp, salty, and unmistakably Cebuano. Traditional island-dried rabbitfish, made for garlic rice and slow mornings.",
    seoTitle: "Bantayan Dried Danggit Fish",
    size: "Small to medium · split and cleaned",
    preparation: "Salted, split, and sun-dried",
    featured: true,
  },
  {
    slug: "binga",
    name: "Binga shells",
    localName: "Binga",
    category: "Fresh",
    image: "/images/scallops.jpg",
    imageAlt:
      "Island shellfish, representative of the fresh shellfish selection",
    description:
      "A local shellfish favorite for a simple broth or a shared seafood spread. Tell us your needs and we’ll ask our island partners.",
    seoTitle: "Fresh Binga Shellfish from Bantayan",
    size: "Mixed natural sizes · supplier confirmed",
    preparation: "Shell-on; cleaned and chilled",
  },
  {
    slug: "wasay-wasay",
    name: "Wasay-wasay",
    localName: "Local island selection",
    category: "Fresh",
    image: "/images/scallops.jpg",
    imageAlt:
      "Illustrative shellfish photo; exact wasay-wasay product confirmed on request",
    description:
      "Request this local island specialty by name. We’ll ask our partners to confirm the exact product, size, preparation, and availability before you decide.",
    seoTitle: "Wasay-wasay · Bantayan Seafood Request",
    size: "Exact local identification and size confirmed by supplier",
    preparation: "Preparation and handling confirmed in your quotation",
  },
  {
    slug: "baliad",
    name: "Baliad",
    localName: "Local island selection",
    category: "Fresh",
    image: "/images/scallops.jpg",
    imageAlt:
      "Illustrative shellfish photo; exact baliad product confirmed on request",
    description:
      "Tell us you’re looking for baliad and we’ll take your request to our local partners. Exact identification, preparation, and availability are confirmed in your quotation.",
    seoTitle: "Baliad · Bantayan Seafood Request",
    size: "Exact local identification and size confirmed by supplier",
    preparation: "Preparation and handling confirmed in your quotation",
  },
  {
    slug: "bonsod",
    name: "Bonsod",
    localName: "Local island selection",
    category: "Dried",
    image: "/images/dried-fish.jpg",
    imageAlt:
      "Illustrative dried fish photo; exact bonsod product confirmed on request",
    description:
      "Looking for bonsod? Add your preferred quantity and preparation to a request. Our partners will confirm the exact local product and what they can source.",
    seoTitle: "Bonsod · Bantayan Seafood Request",
    size: "Exact local identification and size confirmed by supplier",
    preparation: "Requested dried preparation; supplier confirmation required",
  },
];

export const getProduct = (slug: string) =>
  products.find((product) => product.slug === slug);
