"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { productItem, validQuantity, type Guest } from "@/lib/demo";
import { useDemo } from "./demo-provider";
import { ButtonLink, DemoNotice, Field } from "./ui/shared";
import { Icon } from "./ui/icon";

export function QuoteRequestForm() {
  const { data, ready, addItem, updateItem, removeItem, submitRequest } =
    useDemo();
  const router = useRouter();
  const [customName, setCustomName] = useState("");
  const [customQuantity, setCustomQuantity] = useState(1);
  const [customNotes, setCustomNotes] = useState("");
  const [feedback, setFeedback] = useState("");
  function addCustom(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!customName.trim() || !validQuantity(customQuantity)) return;
    addItem({
      id: `custom-${customName.trim().toLowerCase().replace(/\s+/g, "-")}`,
      name: customName.trim(),
      quantity: customQuantity,
      unit: "kg",
      notes: customNotes.trim(),
    });
    setFeedback(`${customName.trim()} added to your request.`);
    setCustomName("");
    setCustomNotes("");
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!data.basket.length) return;
    const form = new FormData(event.currentTarget);
    const guest: Guest = {
      name: String(form.get("name")).trim(),
      email: String(form.get("email")).trim().toLowerCase(),
      phone: String(form.get("phone")).trim(),
      location: String(form.get("location")).trim(),
      date: String(form.get("date") || ""),
      notes: String(form.get("notes") || "").trim(),
    };
    if (!guest.name || !guest.email || !guest.phone || !guest.location) return;
    submitRequest(guest);
    router.push("/request-received");
  }
  return (
    <>
      <DemoNotice />
      <div className="request-layout">
        <div>
          <div className="panel basket-panel">
            <div className="panel-heading">
              <h2>Your island selection</h2>
              <span>
                {data.basket.length}{" "}
                {data.basket.length === 1 ? "item" : "items"}
              </span>
            </div>
            {!ready ? (
              <p className="loading-text">Loading your selection…</p>
            ) : data.basket.length ? (
              <div className="basket-items">
                {data.basket.map((item) => (
                  <article className="basket-item" key={item.id}>
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={92}
                        height={100}
                        className="basket-image"
                      />
                    ) : (
                      <div className="basket-image custom-image">
                        <Icon name="fish" size={28} />
                      </div>
                    )}
                    <div className="basket-item-info">
                      <h3>{item.name}</h3>
                      <span>Price on request</span>
                      {item.notes && <p>{item.notes}</p>}
                      <div className="basket-item-actions">
                        <label className="basket-quantity">
                          <span className="sr-only">
                            Quantity for {item.name}
                          </span>
                          <input
                            type="number"
                            min="0.5"
                            max="1000"
                            step="0.5"
                            value={item.quantity}
                            onChange={(event) => {
                              const value = Number(event.target.value);
                              if (validQuantity(value))
                                updateItem(item.id, value);
                            }}
                          />
                          <span>kg</span>
                        </label>
                        <button
                          type="button"
                          className="text-button remove-button"
                          aria-label={`Remove ${item.name}`}
                          onClick={() => removeItem(item.id)}
                        >
                          <Icon name="trash" size={15} />
                          Remove
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="empty-state compact">
                <Icon name="bag" size={35} />
                <h3>A good meal starts here.</h3>
                <p>
                  Add your favorites from the catalog, or make a custom request
                  below.
                </p>
                <ButtonLink href="/seafood" arrow>
                  Explore seafood
                </ButtonLink>
                <button
                  type="button"
                  className="text-button sample-selection"
                  onClick={() => {
                    const item = productItem("dried-squid", 5, "Medium size");
                    if (item) addItem(item);
                  }}
                >
                  Try the demo with 5 kg dried squid
                </button>
              </div>
            )}
            <div className="basket-reassurance">
              <Icon name="leaf" size={18} />
              <p>
                We source after you request. Final prices and availability are
                confirmed with our island partners.
              </p>
            </div>
          </div>
          <div className="panel custom-item-panel" id="custom-item">
            <h3>Looking for something else?</h3>
            <p>Add an item we can ask our partners about.</p>
            <form onSubmit={addCustom} className="custom-item-form">
              <Field id="custom-name" label="Seafood or product name">
                <input
                  id="custom-name"
                  required
                  maxLength={80}
                  value={customName}
                  onChange={(event) => setCustomName(event.target.value)}
                  placeholder="e.g. fresh tiger prawns"
                />
              </Field>
              <Field id="custom-quantity" label="Quantity (kg)">
                <input
                  id="custom-quantity"
                  type="number"
                  min="0.5"
                  max="1000"
                  step="0.5"
                  required
                  value={customQuantity}
                  onChange={(event) =>
                    setCustomQuantity(Number(event.target.value))
                  }
                />
              </Field>
              <div className="span-full">
                <Field id="custom-notes" label="Preferences (optional)">
                  <input
                    id="custom-notes"
                    maxLength={300}
                    value={customNotes}
                    onChange={(event) => setCustomNotes(event.target.value)}
                    placeholder="Size, preparation, or anything we should know"
                  />
                </Field>
              </div>
              <button type="submit" className="button button-outline span-full">
                <Icon name="plus" size={17} />
                Add custom item
              </button>
            </form>
            {feedback && (
              <p className="success-text" role="status">
                <Icon name="check" size={16} />
                {feedback}
              </p>
            )}
          </div>
          <ButtonLink href="/seafood" variant="text">
            ← Keep exploring seafood
          </ButtonLink>
        </div>
        <form className="panel guest-form" onSubmit={submit}>
          <span className="eyebrow">NO ACCOUNT NEEDED</span>
          <h2>
            A few details,
            <br />
            then we’ll take it from here.
          </h2>
          <p>Tell us where your island catch is headed.</p>
          <Field label="Full name *" id="guest-name">
            <input
              id="guest-name"
              name="name"
              autoComplete="name"
              required
              maxLength={100}
              placeholder="Your full name"
            />
          </Field>
          <Field
            label="Email address *"
            id="guest-email"
            hint="Use this email with your reference to find your demo request."
          >
            <input
              id="guest-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength={150}
              placeholder="you@example.com"
            />
          </Field>
          <Field label="Mobile number *" id="guest-phone">
            <input
              id="guest-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              pattern="[+0-9() .-]{7,25}"
              required
              placeholder="09XX XXX XXXX"
            />
          </Field>
          <Field
            label="Delivery location *"
            id="guest-location"
            hint="City / municipality and province are enough for a first quote."
          >
            <input
              id="guest-location"
              name="location"
              autoComplete="address-level2"
              required
              maxLength={200}
              placeholder="e.g. Cebu City, Cebu"
            />
          </Field>
          <Field
            label="Preferred delivery date"
            id="guest-date"
            hint="Optional · schedule is confirmed in your quotation."
          >
            <input id="guest-date" name="date" type="date" />
          </Field>
          <Field label="Anything else we should know?" id="guest-notes">
            <textarea
              id="guest-notes"
              name="notes"
              rows={3}
              maxLength={1000}
              placeholder="Packaging, delivery instructions, or special requests…"
            />
          </Field>
          <label className="checkbox-label">
            <input type="checkbox" required />
            <span>
              I understand prices and availability will be confirmed before I
              make any commitment.
            </span>
          </label>
          <button
            type="submit"
            className="button button-primary full-width"
            disabled={!ready || !data.basket.length}
          >
            Send quote request
            <Icon name="arrow" size={18} />
          </button>
          <p className="small-note centered">
            <Icon name="shield" size={15} />
            No payment required to request a quote.
          </p>
        </form>
      </div>
    </>
  );
}
