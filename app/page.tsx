import Image from "next/image";
import { products } from "@/lib/products";
import { pageMetadata } from "@/lib/seo";
import { ProductCard } from "@/components/product-card";
import { ButtonLink, Eyebrow } from "@/components/ui/shared";
import { Icon } from "@/components/ui/icon";
import { WaveMark } from "@/components/brand";

export const metadata = {
  ...pageMetadata(
    "Island seafood, sourced for you",
    "IslaSource Seafoods is your seafood sourcing and resale partner in Bantayan Island, Cebu. Direct supplier sourcing, competitive quotes, and availability confirmed for your request.",
    "/",
  ),
  title: { absolute: "IslaSource Seafoods | Seafood Sourcing & Resale" },
};

export default function Home() {
  return (
    <>
      <section className="hero shell">
        <div className="hero-copy">
          <Eyebrow>SEAFOOD SOURCING & RESALE</Eyebrow>
          <h1>
            Island seafood.
            <br />
            Sourced
            <br />
            <em>for you.</em>
          </h1>
          <p>
            Meet IslaSource Seafoods. We source directly from local fishermen
            and seafood suppliers after your quote request, then arrange your
            order and delivery. Island connections, with fair pricing in mind.
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
              <strong>Sourced on request. Quoted with care.</strong>
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
            <strong>No own seafood stocks.</strong>
            <small>We start sourcing after your request.</small>
          </span>
        </div>
        <div>
          <Icon name="shield" size={28} />
          <span>
            <strong>Direct supplier connections.</strong>
            <small>Competitive quotes for your needs.</small>
          </span>
        </div>
        <div>
          <Icon name="truck" size={30} />
          <span>
            <strong>Availability confirmed first.</strong>
            <small>Catch and supply can vary each day.</small>
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
          <Eyebrow>ABOUT ISLASOURCE SEAFOODS</Eyebrow>
          <h2>
            Your connection
            <br />
            to the source.
          </h2>
          <p>
            We’re a seafood sourcing and resale business based in Bantayan
            Island, Cebu. We work directly with local fishermen and suppliers to
            find seafood for home cooks, restaurants, and resellers.
          </p>
          <p>
            We don’t keep our own seafood inventory. After your quote request,
            we check supplier availability, product condition, and current
            pricing. You review the details before we procure your order.
          </p>
          <p>
            Buying to order and working directly with suppliers helps us aim for
            affordable, competitive quotes. Final prices and supply are
            confirmed for each request.
          </p>
          <ButtonLink href="/about" variant="text" arrow>
            Get to know IslaSource
          </ButtonLink>
          <span className="story-signature">
            Sourced on request. Quoted with care.
          </span>
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
