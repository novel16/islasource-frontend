import { RequestReceived } from "@/components/request-received";
import { privateMetadata } from "@/lib/seo";
export const metadata = { ...privateMetadata, title: "Request received" };
export default function RequestReceivedPage() {
  return (
    <div className="shell page-content">
      <RequestReceived />
    </div>
  );
}
