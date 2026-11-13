import Image from "next/image";
import { Breadcrumb, ButtonLink, Eyebrow } from "@/components/ui/shared";
import { Icon } from "@/components/ui/icon";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Our island",
  "Meet the island connection behind Bantayan Seafoods: local fishermen, traditional seafood producers, and seafood sourced only when you request it.",
  "/our-island",
  "/images/island.jpg",
);
export default function OurIslandPage() {
  return (
    <div className="shell page-content">
      <Breadcrumb current="Our island" />
      <section className="editorial-hero">
        <div>
          <Eyebrow>BANTAYAN ISLAND, CEBU</Eyebrow>
          <h1>
            Small island.
            <br />
            <em>So much to share.</em>
          </h1>
          <p>
            Some places stay with you. In the sea breeze, in a familiar
            breakfast, in the kind of meal that brings everyone around the
            table. For us, that place is Bantayan.
          </p>
          <ButtonLink href="/seafood" variant="text" arrow>
            A taste of the island
          </ButtonLink>
        </div>
        <div className="editorial-image">
          <Image
            src="/images/island.jpg"
            alt="A peaceful wooden boardwalk through Bantayan’s mangrove forest"
            fill
            priority
            sizes="(max-width: 760px) 90vw, 46vw"
          />
        </div>
      </section>
      <section className="island-values">
        <article>
          <Icon name="fish" size={30} />
          <h2>
            Local hands.
            <br />A real connection.
          </h2>
          <p>
            Our model begins with the people who know the island’s seafood. We
            connect customer requests with local fishermen and producers, then
            confirm the details together.
          </p>
        </article>
        <article>
          <Icon name="sun" size={30} />
          <h2>
            A little tradition
            <br />
            on every table.
          </h2>
          <p>
            Fresh crab for a gathering. Scallops for a shared meal. Dried squid
            and danggit for breakfast. Our selection brings together familiar
            island favorites and local specialties.
          </p>
        </article>
        <article>
          <Icon name="leaf" size={30} />
          <h2>
            Only what
            <br />
            you ask for.
          </h2>
          <p>
            We source in response to your request. Catch and availability can
            vary, so a thoughtful quotation comes first. You know what’s
            available and what it will cost before you decide.
          </p>
        </article>
      </section>
      <section className="story-wide-image">
        <Image
          src="/images/hero-seafood.jpg"
          alt="Whole fish arranged on ice at a seafood market"
          fill
          sizes="90vw"
        />
        <span className="image-label">
          Good seafood starts with good connections.
        </span>
      </section>
      <section className="story-callout">
        <Eyebrow>FROM BANTAYAN, WITH CARE</Eyebrow>
        <h2>
          Bring a little island
          <br />
          to your table.
        </h2>
        <p>
          Tell us what you have in mind. We’ll start with a conversation and a
          quote.
        </p>
        <ButtonLink href="/request-quote" arrow>
          Let’s make your request
        </ButtonLink>
      </section>
    </div>
  );
}
