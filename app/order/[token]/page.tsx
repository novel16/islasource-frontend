import type { Metadata } from "next";
import { Suspense } from "react";
import { OrderView } from "@/components/order-view";
import { privateMetadata } from "@/lib/seo";

const runtimeToken = "__runtime__";

export const metadata: Metadata = {
  ...privateMetadata,
  title: "Your seafood order & payment",
  referrer: "no-referrer",
};

export function generateStaticParams() {
  return [{ token: runtimeToken }];
}

export default function OrderPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  return (
    <div className="shell page-content journey-content">
      <Suspense
        fallback={<div className="loading-text">Opening your order…</div>}
      >
        <OrderDetails params={params} />
      </Suspense>
    </div>
  );
}

async function OrderDetails({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  return <OrderView token={(await params).token} />;
}
