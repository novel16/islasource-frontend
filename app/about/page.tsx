import Image from "next/image";
import { Breadcrumb, ButtonLink, Eyebrow } from "@/components/ui/shared";
import { Icon } from "@/components/ui/icon";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "About us · Your seafood sourcing partner",
  "Meet IslaSource Seafoods, a seafood sourcing and resale business in Bantayan Island, Cebu. We source directly from suppliers after your quote request, with no own stocked inventory and availability confirmed per order.",
  "/about",
  "/images/island.jpg",
);

const questions = [
  {
    question: "Do you keep your own seafood stocks?",
    answer:
      "No. We don’t keep our own seafood inventory. We begin checking suppliers when you send a quote request, then procure the confirmed order after you approve the quotation and complete full payment via QR Ph.",
  },
  {
    question: "Are you the fishermen or producers?",
    answer:
      "We are your seafood sourcing and resale partner. Local fishermen and seafood suppliers provide the products; IslaSource coordinates your quotation, procurement, packing, and delivery arrangements.",
  },
  {
    question: "Is every product in the catalog available?",
    answer:
      "Availability is not guaranteed. The day’s catch, sizes, grades, quantities, and supplier prices can change. A catalog listing shows what you can ask us to source. We confirm supply before issuing your final quotation.",
  },
  {
    question: "How do you aim to keep prices affordable?",
    answer:
      "We source directly from suppliers and buy to order, with fair, competitive pricing in mind. Your quote reflects the seafood, quantity, preparation, packing, and delivery you need. You see the final amount before you decide.",
  },
  {
    question: "How do freshness and product condition work?",
    answer:
      "Our catalog includes fresh, frozen, and dried seafood. We check the requested condition, grade, preparation, and suitable delivery arrangements with the supplier. The quotation sets out those details before procurement; sourcing to order supports our focus on freshness and appropriate handling.",
  },
];

export default function AboutPage() {
  return (
    <div className="shell page-content">
      <Breadcrumb current="About us" />
      <section className="editorial-hero">
        <div>
          <Eyebrow>MEET ISLASOURCE SEAFOODS</Eyebrow>
          <h1>
            Good seafood.
            <br />
            <em>Better connections.</em>
          </h1>
          <p>
            Your seafood sourcing and resale partner, based in Bantayan Island,
            Cebu. We connect your request with local fishermen and seafood
            suppliers, then arrange your order with care.
          </p>
          <ButtonLink href="/request-quote" arrow>
            Tell us what you need
          </ButtonLink>
        </div>
        <div className="editorial-image">
          <Image
            src="/images/island.jpg"
            alt="A wooden boardwalk through a green mangrove forest on Bantayan Island"
            fill
            priority
            sizes="(max-width: 760px) 90vw, 46vw"
          />
        </div>
      </section>
      <section className="island-values" aria-label="Our sourcing approach">
        <article>
          <Icon name="fish" size={30} />
          <h2>
            Direct supplier
            <br />
            connections.
          </h2>
          <p>
            We source directly from local fishermen and seafood suppliers.
            Buying to order helps us work toward affordable, competitive quotes
            for households, restaurant kitchens, and resellers.
          </p>
        </article>
        <article>
          <Icon name="bag" size={30} />
          <h2>
            No own
            <br />
            stocked inventory.
          </h2>
          <p>
            We don’t keep our own stocks of seafood. Your quote request starts
            the supplier search. After you approve the confirmed details and
            complete full QR Ph payment, we arrange procurement for your order.
          </p>
        </article>
        <article>
          <Icon name="shield" size={30} />
          <h2>
            Availability
            <br />
            confirmed first.
          </h2>
          <p>
            Supply depends on the catch and our suppliers. We check what can be
            sourced, its condition, quantity, current price, and delivery
            options before asking you to approve a quotation.
          </p>
        </article>
      </section>
      <section className="story-wide-image">
        <Image
          src="/images/hero-seafood.jpg"
          alt="Whole fish displayed on a bed of ice at a seafood market"
          fill
          sizes="90vw"
        />
        <span className="image-label">
          Sourced on request. Quoted with care.
        </span>
      </section>
      <section className="questions-section" id="our-approach">
        <div>
          <Eyebrow>CLEAR FROM THE START</Eyebrow>
          <h2>
            Know your source.
            <br />
            Know your order.
          </h2>
        </div>
        <div className="faq-list">
          {questions.map(({ question, answer }) => (
            <details key={question}>
              <summary>{question}</summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>
      <section className="story-callout">
        <Eyebrow>YOUR SOURCE. YOUR SEAFOOD.</Eyebrow>
        <h2>
          From your request,
          <br />
          to the right supplier.
        </h2>
        <p>
          Fresh, frozen, or dried: tell us the seafood and quantity you need.
          We’ll check availability and put together your personal quotation.
        </p>
        <ButtonLink href="/request-quote" arrow>
          Request an IslaSource quote
        </ButtonLink>
        <ButtonLink href="/how-it-works" variant="text" arrow>
          See how sourcing works
        </ButtonLink>
      </section>
    </div>
  );
}
