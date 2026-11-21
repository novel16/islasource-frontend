import { Suspense } from "react";
import { RequestReceived } from "@/components/request-received";
import { privateMetadata } from "@/lib/seo";
export const metadata = { ...privateMetadata, title: "Request received" };
export default function RequestReceivedPage() {
  return (
    <div className="shell page-content">
      <Suspense fallback={<p className="loading-text">Opening your request…</p>}>
        <RequestReceived />
      </Suspense>
    </div>
  );
}
