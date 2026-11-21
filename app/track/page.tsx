import { Breadcrumb, ButtonLink, Eyebrow } from "@/components/ui/shared";
import { privateMetadata } from "@/lib/seo";

export const metadata = { ...privateMetadata, title: "Request tracking" };

export default function TrackPage() {
  return (
    <div className="shell page-content">
      <Breadcrumb current="Request tracking" />
      <div className="page-heading">
        <Eyebrow>YOUR ISLAND CONNECTION</Eyebrow>
        <h1>
          We’re preparing
          <br />
          <em>request tracking.</em>
        </h1>
        <p>
          Guest quote requests are now saved for our team. Secure online status
          lookup isn’t available yet, so your reference is for your records only.
        </p>
        <div className="button-row centered">
          <ButtonLink href="/seafood" arrow>
            Explore seafood
          </ButtonLink>
          <ButtonLink href="/request-quote" variant="outline">
            Start a quote request
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
