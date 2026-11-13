/* eslint-disable @typescript-eslint/no-require-imports -- This standalone Node check loads the existing TypeScript fixtures through CommonJS. */
// Run: node scripts/check-demo.cjs. Uses the existing TypeScript compiler, no test dependency.
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
  sampleRequest,
  quoteTotals,
  validQuantity,
  parseDemo,
  emptyData,
  productItem,
} = require("../lib/demo.ts");
const sample = quoteTotals(sampleRequest.items);
assert.equal(sample.subtotal, 324000);
assert.equal(sample.delivery, 35000);
assert.equal(sample.total, 359000);
assert.equal(sample.deposit, 179500);
assert.equal(sample.balance, 179500);
const fractional = quoteTotals([{ ...sampleRequest.items[0], quantity: 3.5 }]);
assert.equal(fractional.total, 261800);
assert.equal(fractional.deposit + fractional.balance, fractional.total);
assert.equal(validQuantity(0.5), true);
assert.equal(validQuantity(1000), true);
assert.equal(validQuantity(0), false);
assert.equal(validQuantity(NaN), false);
assert.equal(validQuantity(1001), false);
assert.deepEqual(parseDemo("malformed"), emptyData);
assert.deepEqual(parseDemo("null"), emptyData);
assert.equal(
  parseDemo(
    JSON.stringify({
      basket: [{ ...sampleRequest.items[0], quantity: -1 }],
      requests: [],
    }),
  ).basket.length,
  0,
);
assert.equal(productItem("dried-squid", 5).name, "Dried squid");
assert.equal(productItem("not-a-product", 1), undefined);
assert.equal(
  parseDemo(
    JSON.stringify({ basket: sampleRequest.items, requests: [sampleRequest] }),
  ).requests[0].reference,
  "RFQ-2026-001",
);
console.log(
  "Demo checks passed: sample centavo totals, fractional quantities, storage validation, product lookup.",
);
