"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { demoEmail, demoReference } from "@/lib/demo";
import { useDemo } from "./demo-provider";
import { Field } from "./ui/shared";
import { Icon } from "./ui/icon";

export function TrackForm() {
  const [reference, setReference] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const { getRequest, data } = useDemo();
  const router = useRouter();
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const ref = reference.trim().toUpperCase();
    const request = getRequest(ref);
    if (
      !request ||
      request.guest.email.toLowerCase() !== email.trim().toLowerCase()
    ) {
      setError(
        "We couldn’t match those details. Check the reference and email, or use the demo lookup below.",
      );
      return;
    }
    router.push(
      `${["paid", "sourcing", "delivered"].includes(request.status) ? "/order" : "/quote"}/${ref}`,
    );
  }
  function fillDemo() {
    const latest = data.latest ? getRequest(data.latest) : undefined;
    setReference(latest?.reference || demoReference);
    setEmail(latest?.guest.email || demoEmail);
    setError("");
  }
  return (
    <div className="panel tracking-panel">
      <form onSubmit={submit}>
        <Field
          label="Request reference"
          id="track-reference"
          hint="You’ll find this on your request confirmation."
        >
          <input
            id="track-reference"
            required
            value={reference}
            onChange={(event) => {
              setReference(event.target.value);
              setError("");
            }}
            placeholder="RFQ-2026-001"
            autoCapitalize="characters"
          />
        </Field>
        <Field label="Email address" id="track-email">
          <input
            id="track-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setError("");
            }}
            placeholder="The email used for your request"
          />
        </Field>
        {error && (
          <p role="alert" className="form-error">
            {error}
          </p>
        )}
        <button type="submit" className="button button-primary full-width">
          Find my request
          <Icon name="arrow" size={18} />
        </button>
      </form>
      <div className="demo-lookup">
        <span>JUST EXPLORING?</span>
        <button type="button" onClick={fillDemo}>
          Fill in a demo request <Icon name="arrow" size={15} />
        </button>
        <p>
          Demo lookup only. Try a sample or find a request saved in this
          browser. No real request has been sent.
        </p>
      </div>
    </div>
  );
}
