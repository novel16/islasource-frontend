import { Quotation } from "@/components/quotation";
import { Suspense } from "react";
import { LoadingRequest } from "@/components/journey-shared";
import { privateMetadata } from "@/lib/seo";
import { demoReference } from "@/lib/demo";
export const metadata = { ...privateMetadata, title: "Your seafood quotation" };
export function generateStaticParams() {
  return [{ reference: demoReference }];
}
export default function QuotePage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  return (
    <div className="shell page-content journey-content">
      <Suspense fallback={<LoadingRequest />}>
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
