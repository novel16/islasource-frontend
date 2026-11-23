"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Badge, ButtonLink } from "./ui/shared";
import { Icon } from "./ui/icon";

export function RequestReceived() {
  const params = useSearchParams();
  const [copied, setCopied] = useState(false);
  const reference = params.get("reference") || "";
  const validReference = /^RFQ-\d{4}-[A-Z0-9]{8}$/.test(reference);

  return (
    <div className="confirmation-wrap">
      <div className="confirmation-icon">
        <Icon name={validReference ? "check" : "bag"} size={35} />
      </div>
      <Badge>{validReference ? "REQUEST RECEIVED" : "REQUEST REFERENCE"}</Badge>
      <h1>
        {validReference ? (
          <>
            Thanks for getting
            <br />
            in touch.
          </>
        ) : (
          <>Your request details</>
        )}
      </h1>
      <p className="confirmation-lead">
        {validReference
          ? "Your quote request has been saved and your reference number has been sent to your email. We’ll check supplier availability and send your quotation once ready."
          : "Submit a quote request first to receive its reference number."}
      </p>
      {validReference && (
        <div className="reference-card">
          <span>Your request reference</span>
          <div>
            <strong>{reference}</strong>
            <button
              className="icon-button"
              aria-label="Copy request reference"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(reference);
                  setCopied(true);
                } catch {
                  setCopied(false);
                }
              }}
            >
              <Icon name={copied ? "check" : "copy"} size={19} />
            </button>
          </div>
          <small>{copied ? "Reference copied." : "Keep this reference for your records."}</small>
        </div>
      )}
      <div className="confirmation-steps">
        <div>
          <span>01</span>
          <h3>We check with suppliers</h3>
          <p>Product details and availability are confirmed for your request.</p>
        </div>
        <div>
          <span>02</span>
          <h3>We prepare a quote</h3>
          <p>We’ll confirm the price and delivery arrangements with you.</p>
        </div>
        <div>
          <span>03</span>
          <h3>You decide</h3>
          <p>No order or payment is due until you review and accept a quote.</p>
        </div>
      </div>
      <div className="button-row centered">
        <ButtonLink href="/seafood" arrow>
          Explore more seafood
        </ButtonLink>
        <ButtonLink href="/" variant="outline">
          Back to home
        </ButtonLink>
      </div>
    </div>
  );
}
