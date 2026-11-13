import Image from "next/image";
import { products } from "@/lib/products";
import { pageMetadata } from "@/lib/seo";
import { ProductCard } from "@/components/product-card";
import { ButtonLink, Eyebrow } from "@/components/ui/shared";
import { Icon } from "@/components/ui/icon";
import { WaveMark } from "@/components/brand";

export const metadata = pageMetadata(
  "Good seafood. Straight from the island.",
  "Fresh, frozen, and dried seafood sourced to your request from Bantayan Island’s local fishermen and producers. No account needed. Start with a quote.",
  "/",
);

export default function Home() {
  return (
    <>
      <section className="hero shell">
        <div className="hero-copy">
          <Eyebrow>DIRECT FROM BANTAYAN ISLAND</Eyebrow>
          <h1>
            Good seafood.
            <br />
            Straight from
            <br />
            <em>the island.</em>
          </h1>
          <p>
            A taste of Bantayan, without the boat ride. We connect you with the
            island’s fishermen and producers, sourcing good seafood only when
            you need it.
          </p>
          <div className="button-row">
            <ButtonLink href="/seafood" arrow>
              Explore our seafood
            </ButtonLink>
            <ButtonLink href="/how-it-works" variant="text">
              How it works <span className="play-icon">↗</span>
            </ButtonLink>
          </div>
          <div className="hero-footnote">
            <span className="tiny-wave">≈</span>
            <span>
              Fresh. Frozen. Dried.{" "}
              <strong>Always thoughtfully sourced.</strong>
            </span>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-image">
            <Image
              src="/images/hero-seafood.jpg"
              alt="Fresh whole fish displayed on a bed of ice"
              fill
              priority
              sizes="(max-width: 760px) 90vw, 46vw"
            />
            <span className="photo-caption">
              The good things come from the sea.
            </span>
          </div>
          <div className="island-stamp">
            <WaveMark size={36} />
            <span>ISLAND SOURCED</span>
            <small>BANTAYAN, CEBU</small>
          </div>
          <div className="hero-coordinate">
            <Icon name="pin" size={13} />
            <span>11.1686° N, 123.7219° E</span>
            <span className="coordinate-line" />
          </div>
        </div>
      </section>
      <div className="service-strip shell">
        <div>
          <Icon name="fish" size={29} />
          <span>
            <strong>Sourced, not stocked.</strong>
            <small>From local partners, for your request.</small>
          </span>
        </div>
        <div>
          <Icon name="shield" size={28} />
          <span>
            <strong>A clear quote. No surprises.</strong>
            <small>Know the details before you commit.</small>
          </span>
        </div>
        <div>
          <Icon name="truck" size={30} />
          <span>
            <strong>Island to your doorstep.</strong>
            <small>Delivery arranged with care.</small>
          </span>
        </div>
      </div>
      <section className="section shell home-selection">
        <div className="section-heading">
          <div>
            <Eyebrow>A LITTLE TASTE OF THE ISLAND</Eyebrow>
            <h2>Meet your next good meal.</h2>
          </div>
          <ButtonLink href="/seafood" variant="text" arrow>
            View all seafood
          </ButtonLink>
        </div>
        <div className="product-grid">
          {products
            .filter((product) => product.featured)
            .map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
        </div>
        <p className="catalog-disclaimer">
          <span />
          Every catch has its season. Prices and availability are confirmed
          after your request.
        </p>
      </section>
      <section className="how-section">
        <div className="shell">
          <div className="section-heading">
            <div>
              <Eyebrow>GOOD SEAFOOD. SIMPLE STEPS.</Eyebrow>
              <h2>
                From your wish list
                <br />
                to your dinner table.
              </h2>
            </div>
            <p>
              You bring the appetite.
              <br />
              We’ll take care of the island connections.
            </p>
          </div>
          <div className="process-grid">
            {[
              {
                n: "01",
                icon: "bag" as const,
                title: "Make your selection",
                text: "Browse our seafood or tell us what you have in mind. Add quantities to your quote request.",
              },
              {
                n: "02",
                icon: "fish" as const,
                title: "We ask the island",
                text: "Our local partners check the catch. We confirm specifications, current prices, and availability.",
              },
              {
                n: "03",
                icon: "check" as const,
                title: "You give the go-ahead",
                text: "Review your personal quotation. Approve the details and arrange your deposit.",
              },
              {
                n: "04",
                icon: "truck" as const,
                title: "The island comes to you",
                text: "We arrange procurement, packing, and delivery. Follow your request every step of the way.",
              },
            ].map((step) => (
              <article key={step.n}>
                <div className="process-top">
                  <span>{step.n}</span>
                  <Icon name={step.icon} size={27} />
                </div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
          <ButtonLink href="/how-it-works" variant="text" arrow>
            A closer look at how it works
          </ButtonLink>
        </div>
      </section>
      <section className="island-section shell">
        <div className="island-story-image">
          <Image
            src="/images/island.jpg"
            alt="A wooden boardwalk through a green mangrove forest on Bantayan"
            fill
            sizes="(max-width: 760px) 90vw, 46vw"
          />
          <span className="image-label">
            <Icon name="pin" size={15} />
            Bantayan Island, Cebu
          </span>
        </div>
        <div className="island-story-copy">
          <Eyebrow>SMALL ISLAND. DEEP ROOTS.</Eyebrow>
          <h2>
            There’s a place
            <br />
            behind every plate.
          </h2>
          <p>
            On Bantayan, the sea is part of everyday life. It shapes the
            mornings, the meals, and the work of the people who call this island
            home.
          </p>
          <p>
            We’re here to share that connection. Working with local fishermen
            and seafood producers, we bring the island a little closer—one
            thoughtful request at a time.
          </p>
          <ButtonLink href="/our-island" variant="text" arrow>
            Get to know our island
          </ButtonLink>
          <span className="story-signature">From Bantayan, with care.</span>
        </div>
      </section>
      <section className="home-cta">
        <div className="shell">
          <WaveMark size={48} />
          <Eyebrow>LET’S BRING THE ISLAND TO YOUR TABLE</Eyebrow>
          <h2>
            Something good
            <br />
            is on the horizon.
          </h2>
          <p>
            Family feast, restaurant kitchen, or a taste of home.
            <br />
            Tell us what you need. We’ll start with a quote.
          </p>
          <ButtonLink href="/request-quote" arrow>
            Request your seafood quote
          </ButtonLink>
          <small>No account needed. No payment to get started.</small>
        </div>
      </section>
    </>
  );
}
