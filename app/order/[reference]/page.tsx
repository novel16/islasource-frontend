import { OrderTracker } from "@/components/order-tracker";
import { Suspense } from "react";
import { LoadingRequest } from "@/components/journey-shared";
import { privateMetadata } from "@/lib/seo";
import { demoReference } from "@/lib/demo";
export const metadata = { ...privateMetadata, title: "Your order progress" };
export function generateStaticParams() {
  return [{ reference: demoReference }];
}
export default function OrderPage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  return (
    <div className="shell page-content journey-content">
      <Suspense fallback={<LoadingRequest />}>
        <OrderDetails params={params} />
      </Suspense>
    </div>
  );
}
async function OrderDetails({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  return <OrderTracker reference={(await params).reference} />;
}
