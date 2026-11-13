"use client";

import { money, quoteTotals } from "@/lib/demo";
import { useDemo } from "./demo-provider";
import { Badge, ButtonLink, DemoNotice } from "./ui/shared";
import { Icon } from "./ui/icon";
import { JourneySteps, LoadingRequest, MissingRequest } from "./journey-shared";

export function OrderTracker({ reference }: { reference: string }) {
  const { getRequest, ready, updateStatus } = useDemo();
  if (!ready) return <LoadingRequest />;
  const request = getRequest(reference);
  if (!request) return <MissingRequest />;
  const totals = quoteTotals(request.items);
  const paid = ["paid", "sourcing", "delivered"].includes(request.status);
  const current =
    request.status === "delivered"
      ? 3
      : request.status === "sourcing"
        ? 2
        : paid
          ? 1
          : 0;
  const steps = [
    {
      title: "Request & quotation",
      text: "Your seafood, specifications, and delivery terms come together.",
      icon: "bag" as const,
    },
    {
      title: "Deposit received",
      text: `${money(totals.deposit)} demo deposit recorded. We can begin arranging your catch.`,
      icon: "check" as const,
    },
    {
      title: "Sourcing from our partners",
      text: "Your seafood is being procured, checked, and carefully packed on the island.",
      icon: "fish" as const,
    },
    {
      title: "Delivered to your door",
      text: "From our island to your table. Thank you for being part of the journey.",
      icon: "truck" as const,
    },
  ];
  return (
    <>
      <JourneySteps current={paid ? 3 : 2} />
      <DemoNotice>
        Order progress and payment are simulated in this browser. No fishermen,
        delivery partner, or payment provider has received an order.
      </DemoNotice>
      <div className="journey-heading">
        <div>
          <span className="eyebrow">FROM OUR ISLAND TO YOUR TABLE</span>
          <h1>
            {current === 3
              ? "Island goodness, delivered."
              : paid
                ? "Your island journey."
                : "Your order is waiting."}
          </h1>
          <p>
            {reference} <span className="inline-divider">/</span>{" "}
            {request.guest.name}
          </p>
        </div>
        <Badge className="mint-badge">
          <Icon name={current === 3 ? "check" : "clock"} size={14} />
          {current === 3
            ? "Demo delivered"
            : current === 2
              ? "Demo sourcing"
              : paid
                ? "Demo deposit paid"
                : "Deposit pending"}
        </Badge>
      </div>
      <div className="quote-layout">
        <section className="panel timeline-panel">
          <h2>Every step, a little closer.</h2>
          <ol className="order-timeline">
            {steps.map((step, i) => (
              <li
                key={step.title}
                className={i <= current ? "reached" : ""}
                aria-current={i === current ? "step" : undefined}
              >
                <span className="timeline-icon">
                  <Icon name={step.icon} size={21} />
                </span>
                <div>
                  <span className="timeline-step">
                    STEP 0{i + 1} {i === current && "· CURRENT"}
                  </span>
                  <h3>{step.title}</h3>
                  <p>
                    {i === 1 && !paid
                      ? "Your deposit will be recorded here after you approve the quotation and complete payment."
                      : step.text}
                  </p>
                  {i === current && (
                    <Badge>{i === 3 ? "Demo complete" : "In progress"}</Badge>
                  )}
                </div>
              </li>
            ))}
          </ol>
          <div className="timeline-demo-controls">
            <span className="eyebrow">EXPLORE THE PROTOTYPE</span>
            {!paid ? (
              <ButtonLink href={`/payment/${reference}`} arrow>
                Continue to demo deposit
              </ButtonLink>
            ) : current === 1 ? (
              <button
                className="button button-outline"
                onClick={() => updateStatus(reference, "sourcing")}
              >
                Simulate procurement update
                <Icon name="arrow" size={17} />
              </button>
            ) : current === 2 ? (
              <button
                className="button button-outline"
                onClick={() => updateStatus(reference, "delivered")}
              >
                Simulate delivery complete
                <Icon name="check" size={17} />
              </button>
            ) : (
              <ButtonLink href="/seafood" arrow>
                Plan your next island meal
              </ButtonLink>
            )}
            <p>These controls update this demo only.</p>
          </div>
        </section>
        <aside>
          <section className="panel order-summary">
            <h2>Your order at a glance</h2>
            {request.items.map((item) => (
              <div className="order-item" key={item.id}>
                <span>{item.name}</span>
                <strong>{item.quantity} kg</strong>
              </div>
            ))}
            <div className="payment-breakdown">
              <div>
                <span>Total quotation</span>
                <strong>{money(totals.total)}</strong>
              </div>
              <div>
                <span>Demo deposit {paid ? "paid" : "due"}</span>
                <strong>{money(totals.deposit)}</strong>
              </div>
              <div>
                <span>Balance before dispatch</span>
                <strong>{money(totals.balance)}</strong>
              </div>
            </div>
            <div className="order-destination">
              <Icon name="pin" size={20} />
              <div>
                <strong>{request.guest.location}</strong>
                <p>
                  {request.guest.date
                    ? `Preferred date: ${request.guest.date}`
                    : "Delivery date to be arranged"}
                </p>
              </div>
            </div>
            <ButtonLink href={`/quote/${reference}`} variant="text" arrow>
              View quotation
            </ButtonLink>
          </section>
          <div className="order-help">
            <Icon name="mail" size={23} />
            <h3>Something on your mind?</h3>
            <p>
              Check how sourcing, deposits, and delivery work before your next
              request.
            </p>
            <ButtonLink href="/how-it-works#questions" variant="text" arrow>
              Read common questions
            </ButtonLink>
          </div>
        </aside>
      </div>
    </>
  );
}
