import type { Metadata } from "next";
import { Suspense } from "react";
import { Quotation } from "@/components/quotation";
import { privateMetadata } from "@/lib/seo";

const runtimeReference = "__runtime__";

export const metadata: Metadata = {
  ...privateMetadata,
  title: "Your seafood quotation",
  referrer: "no-referrer",
};

export function generateStaticParams() {
  return [{ reference: runtimeReference }];
}

export default function QuotePage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  return (
    <div className="shell page-content journey-content">
      <Suspense
        fallback={<div className="loading-text">Opening your quotation…</div>}
      >
        <QuoteDetails params={params} />
      </Suspense>
    </div>
  );
}

async function QuoteDetails({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  return <Quotation reference={(await params).reference} />;
}
