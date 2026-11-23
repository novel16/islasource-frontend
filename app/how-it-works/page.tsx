import Image from "next/image";
import { Breadcrumb, ButtonLink, Eyebrow } from "@/components/ui/shared";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "How it works",
  "From a guest quote request to supplier sourcing, quotation approval, deposit, and delivery. Understand how IslaSource Seafoods sources on demand without keeping its own stocks.",
  "/how-it-works",
);
const steps = [
  {
    title: "Tell us what sounds good.",
    description:
      "Browse fresh, frozen, and dried favorites. Add the quantities and preparation you prefer, or make a custom request. Share your contact details and delivery location—no account needed.",
  },
  {
    title: "We check with the island.",
    description:
      "We don’t keep our own seafood stock. Once you request, we check with local fishing and producing partners for the catch, specifications, and current pricing. Availability depends on what our partners can source.",
  },
  {
    title: "A quote. A clear yes.",
    description:
      "You receive a personal quotation with the seafood specifications, quantities, current prices, delivery fee, validity period, and deposit terms. Review everything before you decide. No commitment until you approve.",
  },
  {
    title: "We take it from there.",
    description:
      "After you approve the quotation and arrange the agreed deposit, we begin procurement. Your request reference keeps you connected through sourcing, packing, and delivery. Any balance is settled according to your quotation.",
  },
];
const questions = [
  {
    q: "Who is IslaSource Seafoods?",
    a: "We’re a seafood sourcing and resale business based in Bantayan Island, Cebu. We source directly from local fishermen and seafood suppliers in response to customer quote requests. We don’t keep our own seafood inventory.",
  },
  {
    q: "Is every seafood product always available?",
    a: "No. We check supplier availability after you request a quote. Catch, size, grade, and quantities can vary, so a catalog listing is a sourcing option rather than a promise of ready stock.",
  },
  {
    q: "How do you aim to keep prices affordable?",
    a: "We work directly with suppliers and buy to order, aiming for fair, competitive pricing. Your final quotation depends on the seafood, quantity, preparation, packing, and delivery arrangements.",
  },
  {
    q: "Why aren’t prices listed in the catalog?",
    a: "Our seafood is sourced on request. Catch, size, preparation, and supplier prices can change, so we confirm current availability and prepare a quotation for your specific request. A catalog listing does not guarantee stock.",
  },
  {
    q: "Do I need an account to request seafood?",
    a: "No. Browse, build your selection (up to 10 items per request), and send a guest request with your name, email, mobile number, and delivery location. Once we check supply, we email your personal quotation link directly to you.",
  },
  {
    q: "Can I request something that isn’t in the catalog?",
    a: "Yes. Add a custom item on the quote request page, including the quantity and any preferred size or preparation. We’ll ask our partners and confirm whether it can be sourced.",
  },
  {
    q: "Where do you deliver?",
    a: "Tell us your city or municipality and province when you request. Delivery coverage, the fee, and a suitable schedule are confirmed in your personal quotation before you approve or pay a deposit.",
  },
  {
    q: "When do I pay?",
    a: "There’s no payment to request a quote. After we source your items and send your quotation, you review the prices, delivery fee, validity window, and deposit terms before deciding. Deposit payment is arranged only after you accept the quotation.",
  },
  {
    q: "How long is my quotation valid?",
    a: "Quotations are normally valid for 2 days (48 hours) from issue unless stated otherwise on your quote, since fresh catch availability and supplier rates can change daily.",
  },
];
export default function HowItWorksPage() {
  return (
    <div className="shell page-content">
      <Breadcrumb current="How it works" />
      <section className="editorial-hero">
        <div>
          <Eyebrow>GOOD SEAFOOD. SIMPLE STEPS.</Eyebrow>
          <h1>
            Island connections.
            <br />
            <em>Made simple.</em>
          </h1>
          <p>
            We believe good seafood should start with a good conversation. Tell
            us what you need, and we’ll connect the dots between the island and
            your table.
          </p>
          <ButtonLink href="/seafood" arrow>
            Find your island favorites
          </ButtonLink>
        </div>
        <div className="editorial-image">
          <Image
            src="/images/hero-seafood.jpg"
            alt="A generous spread of seafood, ready to inspire your next meal"
            fill
            priority
            sizes="(max-width: 760px) 90vw, 46vw"
          />
        </div>
      </section>
      <div className="steps-list">
        {steps.map((step, i) => (
          <article className="step-card" key={step.title}>
            <span>0{i + 1}</span>
            <div>
              <h2>{step.title}</h2>
              <p>{step.description}</p>
            </div>
          </article>
        ))}
      </div>
      <section className="questions-section" id="questions">
        <div>
          <Eyebrow>A FEW THINGS TO KNOW</Eyebrow>
          <h2>
            Good questions.
            <br />
            Honest answers.
          </h2>
        </div>
        <div className="faq-list">
          {questions.map((question) => (
            <details key={question.q}>
              <summary>{question.q}</summary>
              <p>{question.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
