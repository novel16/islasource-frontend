import { PaymentPreview } from "@/components/payment-preview";
import { Suspense } from "react";
import { LoadingRequest } from "@/components/journey-shared";
import { privateMetadata } from "@/lib/seo";
import { demoReference } from "@/lib/demo";
export const metadata = { ...privateMetadata, title: "Demo deposit payment" };
export function generateStaticParams() {
  return [{ reference: demoReference }];
}
export default function PaymentPage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  return (
    <div className="shell page-content journey-content">
      <Suspense fallback={<LoadingRequest />}>
        <PaymentDetails params={params} />
      </Suspense>
    </div>
  );
}
async function PaymentDetails({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  return <PaymentPreview reference={(await params).reference} />;
}
