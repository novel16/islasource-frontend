/* eslint-disable @typescript-eslint/no-require-imports -- Standalone Node check using the existing TypeScript compiler, no test dependency. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
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
  canAddBasketItem,
  validQuantity,
  money,
  parseBasket,
} = require("../lib/basket.ts");
const { API_BASE_URL, API_V1_URL } = require("../lib/api.ts");
const { PUBLIC_CATALOG_PER_PAGE } = require("../lib/products.ts");
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

console.log(
  "Storefront checks passed: basket storage, quantity bounds, 10-item cap, live quote/order tokens.",
);
