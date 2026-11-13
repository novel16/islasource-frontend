"use client";

import { useRouter } from "next/navigation";
import { money, quoteTotals } from "@/lib/demo";
import { useDemo } from "./demo-provider";
import { Badge, ButtonLink, DemoNotice } from "./ui/shared";
import { Icon } from "./ui/icon";
import { JourneySteps, LoadingRequest, MissingRequest } from "./journey-shared";

function NonpayableCode() {
  return (
    <div
      className="nonpayable-code"
      role="img"
      aria-label="Decorative nonpayable demo placeholder, not a scannable QR code"
    >
      <svg width="216" height="216" viewBox="0 0 216 216" aria-hidden="true">
        <defs>
          <pattern
            id="demo-dots"
            width="24"
            height="24"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M3 3h7v7H3zm12 12h7v7h-7zM15 1h7v7h-7zM1 16h6v6H1z"
              fill="#adc0b4"
            />
          </pattern>
        </defs>
        <rect width="216" height="216" rx="6" fill="url(#demo-dots)" />
        <path d="m4 4 208 208M212 4 4 212" stroke="#f9f8f4" strokeWidth="20" />
      </svg>
      <span>
        DEMO<small>NONPAYABLE</small>
      </span>
    </div>
  );
}
export function PaymentPreview({ reference }: { reference: string }) {
  const { getRequest, updateStatus, ready } = useDemo();
  const router = useRouter();
  if (!ready) return <LoadingRequest />;
  const request = getRequest(reference);
  if (!request) return <MissingRequest />;
  const totals = quoteTotals(request.items);
  const paid = ["paid", "sourcing", "delivered"].includes(request.status);
  return (
    <>
      <JourneySteps current={paid ? 3 : 2} />
      <DemoNotice>
        NONPAYABLE demo. No PayMongo account or payment API is connected. The
        decorative code cannot receive money; the button only updates this
        browser.
      </DemoNotice>
      <div className="narrow-page-heading">
        <span className="eyebrow">READY WHEN YOU ARE</span>
        <h1>
          A small deposit.
          <br />A fresh beginning.
        </h1>
        <p>{reference} · 50% of your sample quotation</p>
      </div>
      <div className="payment-layout">
        <section className="panel qr-panel">
          <div className="payment-provider">
            <span>QR Ph</span>
            <small>PAYMENT EXPERIENCE PREVIEW</small>
            <Badge>DEMO ONLY</Badge>
          </div>
          <h2>
            {paid
              ? "Your demo deposit is recorded."
              : "Scan? Not in this demo."}
          </h2>
          <p>
            In a live order, your QR Ph payment would be securely processed by
            PayMongo.
          </p>
          <NonpayableCode />
          <strong className="payment-amount">{money(totals.deposit)}</strong>
          <span className="payment-amount-caption">
            Sample deposit · Philippine peso
          </span>
          {paid ? (
            <ButtonLink
              href={`/order/${reference}`}
              className="full-width"
              arrow
            >
              View order progress
            </ButtonLink>
          ) : request.status === "accepted" ? (
            <button
              type="button"
              className="button button-primary full-width"
              onClick={() => {
                updateStatus(reference, "paid");
                router.push(`/order/${reference}`);
              }}
            >
              <Icon name="check" size={18} />
              Simulate deposit payment
            </button>
          ) : (
            <ButtonLink
              href={`/quote/${reference}`}
              className="full-width"
              arrow
            >
              Review and accept quotation first
            </ButtonLink>
          )}
          <p className="small-note centered">
            No money moves. This is a prototype interaction.
          </p>
        </section>
        <aside className="payment-explainer">
          <h2>
            From your yes,
            <br />
            to the day’s catch.
          </h2>
          <p>
            Your deposit lets us start arranging your seafood with our local
            fishing and producing partners.
          </p>
          <div className="payment-breakdown">
            <div>
              <span>Full sample quotation</span>
              <strong>{money(totals.total)}</strong>
            </div>
            <div>
              <span>50% deposit now</span>
              <strong>{money(totals.deposit)}</strong>
            </div>
            <div>
              <span>Remaining before dispatch</span>
              <strong>{money(totals.balance)}</strong>
            </div>
          </div>
          <div className="soft-note">
            <Icon name="shield" size={23} />
            <div>
              <strong>Clear from the start.</strong>
              <p>
                In a real request, we confirm specifications, sourcing, and your
                delivery schedule before asking for a deposit.
              </p>
            </div>
          </div>
          <ButtonLink href={`/quote/${reference}`} variant="text">
            ← Back to your quotation
          </ButtonLink>
        </aside>
      </div>
    </>
  );
}
