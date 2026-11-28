/* eslint-disable @typescript-eslint/no-require-imports -- Standalone Node check using the existing TypeScript compiler, no test dependency. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");

require.extensions[".ts"] = (module, filename) => {
  const source = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText;
  module._compile(source, filename);
};

const {
  MAX_BASKET_ITEMS,
  ISLAND_MIN_KG,
  CEBU_MIN_KG,
  canAddBasketItem,
  checkZoneMinimum,
  deliveryLabel,
  formatDeliveryLocation,
  validQuantity,
  money,
  parseBasket,
} = require("../lib/basket.ts");
const { API_BASE_URL, API_V1_URL, apiEndpoints } = require("../lib/api.ts");
const {
  PUBLIC_CATALOG_PER_PAGE,
  buildProductCarouselSlides,
  sendGuestQuoteCode,
} = require("../lib/products.ts");
const {
  defaultPublicSiteSettings,
  siteImageSrc,
} = require("../lib/site-settings.ts");
const { isLiveQuoteToken } = require("../lib/quotations.ts");
const { isLiveOrderToken } = require("../lib/orders.ts");

assert.equal(validQuantity(0.5), true);
assert.equal(validQuantity(1000), true);
assert.equal(validQuantity(0), false);
assert.equal(validQuantity(NaN), false);
assert.equal(validQuantity(1001), false);
assert.match(money(125050), /1,250\.50/);

assert.deepEqual(parseBasket("malformed"), []);
assert.deepEqual(parseBasket("null"), []);

const validItem = {
  id: "product-1",
  name: "Binga shell",
  quantity: 2,
  unit: "kg",
  notes: "Fresh",
};
assert.equal(parseBasket(JSON.stringify([{ ...validItem, quantity: -1 }])).length, 0);
assert.equal(parseBasket(JSON.stringify([validItem])).length, 1);
assert.equal(parseBasket(JSON.stringify({ basket: [validItem] })).length, 1);

assert.equal(MAX_BASKET_ITEMS, 10);
const tenItems = Array.from({ length: 10 }, (_, i) => ({
  id: `item-${i + 1}`,
  name: `Item ${i + 1}`,
  quantity: 1,
  unit: "kg",
  notes: "",
}));
assert.equal(canAddBasketItem(tenItems.slice(0, 9), "item-10"), true);
assert.equal(canAddBasketItem(tenItems, "item-1"), true);
assert.equal(canAddBasketItem(tenItems, "item-11"), false);

assert.equal(API_BASE_URL.endsWith("/api/v1"), false);
assert.equal(API_V1_URL, `${API_BASE_URL}/api/v1`);
assert.equal(PUBLIC_CATALOG_PER_PAGE, 12);
assert.equal(
  apiEndpoints.quoteRequestSchedule("abc"),
  "/quote-requests/schedule/abc",
);
assert.equal(apiEndpoints.orderMessages("xyz"), "/orders/xyz/messages");
assert.equal(
  fs.existsSync(path.join(__dirname, "../app/track/page.tsx")),
  false,
);
assert.equal(
  fs
    .readFileSync(path.join(__dirname, "../components/site-footer.tsx"), "utf8")
    .includes("Request tracking is being prepared"),
  false,
);

const termsPagePath = path.join(__dirname, "../app/terms/page.tsx");
assert.equal(fs.existsSync(termsPagePath), true);
const termsSource = fs.readFileSync(termsPagePath, "utf8");
assert.equal(termsSource.includes("North Bus Terminal"), true);
assert.equal(termsSource.includes("Jessamae"), true);
assert.equal(termsSource.includes('"#payments-refunds"'), true);
assert.equal(termsSource.includes('"#privacy"'), true);

assert.equal(
  fs
    .readFileSync(path.join(__dirname, "../components/site-footer.tsx"), "utf8")
    .includes('href="/terms"'),
  true,
);
assert.equal(
  fs
    .readFileSync(path.join(__dirname, "../components/site-header.tsx"), "utf8")
    .includes('"/terms"'),
  false,
);
assert.equal(
  fs
    .readFileSync(
      path.join(__dirname, "../components/quote-request-form.tsx"),
      "utf8",
    )
    .includes('href="/terms"'),
  true,
);
assert.equal(
  fs
    .readFileSync(path.join(__dirname, "../components/order-view.tsx"), "utf8")
    .includes("agreedToPayTerms"),
  true,
);

assert.equal(ISLAND_MIN_KG, 3);
assert.equal(CEBU_MIN_KG, 5);
assert.equal(deliveryLabel(0), "Free");
assert.match(deliveryLabel(15000), /150\.00/);

assert.deepEqual(
  checkZoneMinimum([{ quantity: 2.5, unit: "kg" }], "island"),
  { ok: false, totalKg: 2.5, requiredKg: 3, hasNonKg: false },
);
assert.deepEqual(
  checkZoneMinimum(
    [
      { quantity: 1.2, unit: "kg" },
      { quantity: 1.8, unit: "kg" },
    ],
    "island",
  ),
  { ok: true, totalKg: 3, requiredKg: 3, hasNonKg: false },
);
assert.deepEqual(
  checkZoneMinimum([{ quantity: 4.5, unit: "kg" }], "cebu"),
  { ok: false, totalKg: 4.5, requiredKg: 5, hasNonKg: false },
);
assert.deepEqual(
  checkZoneMinimum([{ quantity: 5, unit: "kg" }], "cebu"),
  { ok: true, totalKg: 5, requiredKg: 5, hasNonKg: false },
);
assert.deepEqual(
  checkZoneMinimum([{ quantity: 2, unit: "pack" }], "cebu"),
  { ok: true, totalKg: 0, requiredKg: 5, hasNonKg: true },
);

assert.equal(
  formatDeliveryLocation({
    zone: "island",
    islandTown: "Madridejos",
    detail: "  Poblacion, near plaza  ",
    cebuChannel: "Ceres Bus — Cebu North Bus Terminal",
  }),
  "Bantayan Island (Madridejos) — Poblacion, near plaza",
);
assert.equal(
  formatDeliveryLocation({
    zone: "island",
    islandTown: "Bantayan",
    detail: "   ",
    cebuChannel: "Ceres Bus — Cebu North Bus Terminal",
  }),
  "",
);
assert.equal(
  formatDeliveryLocation({
    zone: "cebu",
    islandTown: "Bantayan",
    detail: "",
    cebuChannel: "Ceres Bus — Cebu North Bus Terminal",
  }),
  "Mainland Cebu (Ceres Bus — Cebu North Bus Terminal)",
);

assert.equal(isLiveQuoteToken("a".repeat(64)), true);
assert.equal(
  isLiveQuoteToken("A1b2C3d4E5f6G7h8I9j0K1l2M3n4O5p6Q7r8S9t0U1v2W3x4Y5z6A7b8C9d0E1f2"),
  true,
);
assert.equal(isLiveQuoteToken("RFQ-2026-001"), false);
assert.equal(isLiveQuoteToken("a".repeat(63)), false);
assert.equal(isLiveQuoteToken("a".repeat(65)), false);
assert.equal(isLiveQuoteToken(`${"a".repeat(63)}-`), false);
assert.equal(isLiveOrderToken("b".repeat(64)), true);
assert.equal(isLiveOrderToken("ORD-2026-001"), false);

assert.equal(apiEndpoints.quoteRequestSendCode, "/quote-requests/send-code");
assert.equal(typeof sendGuestQuoteCode, "function");
const quoteFormSource = fs.readFileSync(
  path.join(__dirname, "../components/quote-request-form.tsx"),
  "utf8",
);
assert.equal(quoteFormSource.includes('autoComplete="one-time-code"'), true);
assert.equal(quoteFormSource.includes('name="contact_fax_ext"'), true);
assert.equal(quoteFormSource.includes('name="website"'), false);
assert.equal(quoteFormSource.includes("mountedAtRef"), false);
assert.equal(quoteFormSource.includes("Change email"), true);

assert.equal(apiEndpoints.siteSettings, "/site-settings");
assert.equal(defaultPublicSiteSettings.island_min_kg, 3);
assert.equal(defaultPublicSiteSettings.cebu_min_kg, 5);
assert.equal(siteImageSrc("/images/hero-seafood.jpg"), "/images/hero-seafood.jpg");
assert.match(
  siteImageSrc("/storage/products/hero_1.jpg"),
  /\/storage\/products\/hero_1\.jpg$/,
);
assert.deepEqual(
  checkZoneMinimum([{ quantity: 3.5, unit: "kg" }], "island", {
    islandMinKg: 4,
    cebuMinKg: 6,
  }),
  { ok: false, totalKg: 3.5, requiredKg: 4, hasNonKg: false },
);

const singleSlides = buildProductCarouselSlides({
  name: "Gahot",
  image: "/images/dried-fish.jpg",
  image_alt: "Cover",
});
assert.equal(singleSlides.length, 1);

const multiSlides = buildProductCarouselSlides({
  name: "Gahot",
  image: "/images/dried-fish.jpg",
  image_alt: "Cover",
  gallery_images: Array.from({ length: 9 }, (_, idx) => ({
    image: `/storage/products/extra_${idx}.jpg`,
    image_alt: "",
  })),
});
assert.equal(multiSlides.length, 8);
assert.equal(multiSlides[0].src, "/images/dried-fish.jpg");
assert.equal(multiSlides[1].alt, "Gahot");

console.log(
  "Storefront checks passed: basket storage, quantity bounds, 10-item cap, live quote/order tokens.",
);
