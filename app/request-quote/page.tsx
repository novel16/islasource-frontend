import { QuoteRequestForm } from "@/components/quote-request-form";
import { Breadcrumb, Eyebrow } from "@/components/ui/shared";
import { pageMetadata } from "@/lib/seo";

export const metadata = {
  ...pageMetadata(
    "Request a seafood quote",
    "Build your seafood request, tell us your delivery location, and receive a personal quotation from Bantayan Seafoods. No account or upfront payment needed.",
    "/request-quote",
  ),
  robots: { index: false, follow: false },
};
export default function RequestQuotePage() {
  return (
    <div className="shell page-content">
      <Breadcrumb current="Request a quote" />
      <div className="page-heading">
        <Eyebrow>FROM YOUR WISH LIST TO THE ISLAND</Eyebrow>
        <h1>
          Let’s start with
          <br />
          <em>something good.</em>
        </h1>
        <p>
          Your selection is a request, with no commitment yet.
          <br />
          We’ll check the island and come back with the details.
        </p>
      </div>
      <QuoteRequestForm />
    </div>
  );
}
