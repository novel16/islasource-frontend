"use client";

import { useState, type FormEvent } from "react";
import type { Product } from "@/lib/products";
import { productItem, validQuantity } from "@/lib/demo";
import { useDemo } from "./demo-provider";
import { ButtonLink, Field } from "./ui/shared";
import { Icon } from "./ui/icon";

export function ProductRequest({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [added, setAdded] = useState(false);
  const { addItem } = useDemo();
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validQuantity(quantity)) return;
    const item = productItem(product.slug, quantity, notes);
    if (item) {
      addItem(item);
      setAdded(true);
    }
  }
  return (
    <form onSubmit={submit} className="product-request">
      <div className="product-request-fields">
        <Field
          id="product-quantity"
          label="How much do you need?"
          hint="Minimum request: 0.5 kg"
        >
          <div className="quantity-control">
            <button
              type="button"
              aria-label="Decrease quantity"
              disabled={quantity <= 0.5}
              onClick={() => {
                setQuantity(Math.max(0.5, quantity - 0.5));
                setAdded(false);
              }}
            >
              <Icon name="minus" size={16} />
            </button>
            <input
              id="product-quantity"
              type="number"
              min="0.5"
              max="1000"
              step="0.5"
              required
              value={quantity}
              onChange={(event) => {
                setQuantity(Number(event.target.value));
                setAdded(false);
              }}
            />
            <span>kg</span>
            <button
              type="button"
              aria-label="Increase quantity"
              disabled={quantity >= 1000}
              onClick={() => {
                setQuantity(quantity + 0.5);
                setAdded(false);
              }}
            >
              <Icon name="plus" size={16} />
            </button>
          </div>
        </Field>
        <Field
          id="product-notes"
          label="Size or preparation preferences"
          hint="Optional · we’ll confirm what’s available"
        >
          <input
            id="product-notes"
            value={notes}
            onChange={(event) => {
              setNotes(event.target.value);
              setAdded(false);
            }}
            placeholder="e.g. medium size, individually packed"
            maxLength={300}
          />
        </Field>
      </div>
      <button className="button button-primary full-width" type="submit">
        <Icon name={added ? "check" : "bag"} size={18} />
        {added ? "Added to your request" : "Add to quote request"}
        <Icon name="arrow" size={18} />
      </button>
      {added && (
        <div className="added-feedback" role="status">
          <span>Your island selection is saved.</span>
          <ButtonLink href="/request-quote" variant="text" arrow>
            Review request
          </ButtonLink>
        </div>
      )}
      <p className="small-note">
        <Icon name="shield" size={15} />
        No payment now. No commitment until you approve a quote.
      </p>
    </form>
  );
}
