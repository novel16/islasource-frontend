"use client";

import { useState } from "react";
import { useDemo } from "./demo-provider";
import { demoReference } from "@/lib/demo";
import { Badge, ButtonLink, DemoNotice } from "./ui/shared";
import { Icon } from "./ui/icon";

export function RequestReceived() {
  const { data, getRequest, ready } = useDemo();
  const [copied, setCopied] = useState(false);
  const reference = data.latest || demoReference;
  const request = getRequest(reference);
  if (!ready) return <p className="loading-text">Opening your request…</p>;
  return (
    <div className="confirmation-wrap">
      <div className="confirmation-icon">
        <Icon name="check" size={35} />
      </div>
      <Badge>REQUEST RECEIVED · DEMO</Badge>
      <h1>
        A little island goodness
        <br />
        is on its way.
      </h1>
      <p className="confirmation-lead">
        Thank you{request ? `, ${request.guest.name.split(" ")[0]}` : ""}. Your
        request is saved in this browser.
        <br />
        Here’s what happens next.
      </p>
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
        <small>
          {copied
            ? "Reference copied."
            : "Keep this and your email handy for tracking."}
        </small>
      </div>
      <div className="confirmation-steps">
        <div>
          <span>01</span>
          <h3>We ask the island</h3>
          <p>
            Our partners confirm the catch, specifications, and current prices.
          </p>
        </div>
        <div>
          <span>02</span>
          <h3>You receive a quote</h3>
          <p>Review your seafood, delivery fee, schedule, and deposit terms.</p>
        </div>
        <div>
          <span>03</span>
          <h3>You decide</h3>
          <p>
            Approve the quotation, then arrange the deposit to begin sourcing.
          </p>
        </div>
      </div>
      <DemoNotice>
        No email has been sent. You can preview the sample quotation now to
        continue this interactive journey.
      </DemoNotice>
      <div className="button-row centered">
        <ButtonLink href={`/quote/${reference}`} arrow>
          Preview demo quotation
        </ButtonLink>
        <ButtonLink href="/track" variant="outline">
          Track my request
        </ButtonLink>
      </div>
      <ButtonLink href="/seafood" variant="text">
        Back to the island selection <Icon name="arrow" size={16} />
      </ButtonLink>
    </div>
  );
}
