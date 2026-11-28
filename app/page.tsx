import { Fragment, Suspense } from "react";
import { connection } from "next/server";
import Image from "next/image";
import { getPublicProducts, type Product } from "@/lib/products";
import { pageMetadata } from "@/lib/seo";
import {
  defaultPublicSiteSettings,
  getPublicSiteSettings,
  siteImageSrc,
  type HomepageSettings,
} from "@/lib/site-settings";
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

function renderHeroHeadline(headline: string) {
  const lines = headline
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (!lines.length) return "Island seafood.";

  return lines.map((line, index) => {
    const isLast = index === lines.length - 1 && lines.length > 1;
    return (
      <Fragment key={`${line}-${index}`}>
        {index > 0 && <br />}
        {isLast ? <em>{line}</em> : line}
      </Fragment>
    );
  });
}

function renderMultilineHeading(heading: string) {
  const lines = heading
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  return lines.map((line, index) => (
    <Fragment key={`${line}-${index}`}>
      {index > 0 && <br />}
      {line}
    </Fragment>
  ));
}

function HomeSections({
  homepage,
  featuredSlot,
}: {
  homepage: HomepageSettings;
  featuredSlot: React.ReactNode;
}) {
  const heroSrc = siteImageSrc(homepage.hero_image);
  const storySrc = siteImageSrc(homepage.story_image);

  return (
    <>
      {homepage.advisory_enabled && homepage.advisory_text.trim() && (
        <div className="shell" style={{ paddingTop: 18 }}>
          <div className="island-advisory-banner" role="status">
            <Icon name="shield" size={16} />
            <span>{homepage.advisory_text.trim()}</span>
          </div>
        </div>
      )}
      <section className="hero shell">
        <div className="hero-copy">
          <Eyebrow>{homepage.hero_eyebrow}</Eyebrow>
          <h1>{renderHeroHeadline(homepage.hero_headline)}</h1>
          <p>{homepage.hero_subtext}</p>
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
              src={heroSrc}
              alt={homepage.hero_image_alt}
              fill
              priority
              unoptimized={/^https?:\/\//i.test(heroSrc)}
              sizes="(max-width: 760px) 90vw, 46vw"
            />
            {homepage.hero_caption && (
              <span className="photo-caption">{homepage.hero_caption}</span>
            )}
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
        <div className="product-grid">{featuredSlot}</div>
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
                text: "Review your personal quotation. Approve the details and complete full payment via QR Ph.",
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
            src={storySrc}
            alt={homepage.story_image_alt}
            fill
            unoptimized={/^https?:\/\//i.test(storySrc)}
            sizes="(max-width: 760px) 90vw, 46vw"
          />
          <span className="image-label">
            <Icon name="pin" size={15} />
            Bantayan Island, Cebu
          </span>
        </div>
        <div className="island-story-copy">
          <Eyebrow>ABOUT ISLASOURCE SEAFOODS</Eyebrow>
          <h2>{renderMultilineHeading(homepage.story_heading)}</h2>
          {homepage.story_paragraphs.map((paragraph, index) => (
            <p key={`story-p-${index}`}>{paragraph}</p>
          ))}
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

async function LiveHome() {
  await connection();
  const [settings, productsResult] = await Promise.all([
    getPublicSiteSettings(),
    getPublicProducts({ perPage: 4 }).catch(() => null),
  ]);

  const products: Product[] | null = productsResult
    ? productsResult.data
    : null;

  const featuredSlot =
    products === null ? (
      <p className="loading-text">
        The seafood catalog is temporarily unavailable.
      </p>
    ) : !products.length ? (
      <p className="loading-text">
        Published seafood will appear here when available.
      </p>
    ) : (
      products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))
    );

  return (
    <HomeSections homepage={settings.homepage} featuredSlot={featuredSlot} />
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <HomeSections
          homepage={defaultPublicSiteSettings.homepage}
          featuredSlot={<p className="loading-text">Loading published seafood…</p>}
        />
      }
    >
      <LiveHome />
    </Suspense>
  );
}
