import { TrackForm } from "@/components/track-form";
import { Breadcrumb, Eyebrow } from "@/components/ui/shared";
import { Icon } from "@/components/ui/icon";
import { privateMetadata } from "@/lib/seo";
export const metadata = { ...privateMetadata, title: "Track your request" };
export default function TrackPage() {
  return (
    <div className="shell page-content">
      <Breadcrumb current="Track request" />
      <div className="track-layout">
        <div className="track-copy">
          <Eyebrow>YOUR ISLAND CONNECTION</Eyebrow>
          <h1>
            A little closer
            <br />
            <em>with every step.</em>
          </h1>
          <p>
            Find your quotation, check your deposit, and follow your seafood
            from island sourcing to delivery.
          </p>
          <div className="track-reassurance">
            <Icon name="shield" size={24} />
            <div>
              <strong>No account. Just your details.</strong>
              <p>Have your request reference and email handy.</p>
            </div>
          </div>
          <div className="track-illustration" aria-hidden="true">
            <svg width="295" height="130" viewBox="0 0 295 130" fill="none">
              <path
                d="M15 105c35-16 50 16 85 0s50 16 85 0 50 16 85 0M15 117c35-16 50 16 85 0s50 16 85 0 50 16 85 0"
                stroke="#a6bab0"
                strokeWidth="2"
              />
              <path
                d="m85 80 15 17h65l19-17H85ZM131 78V20l-31 47h31Zm7-58v47h34l-34-47Z"
                stroke="#153f38"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <circle
                cx="222"
                cy="30"
                r="18"
                stroke="#e48a68"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>
        <TrackForm />
      </div>
    </div>
  );
}
