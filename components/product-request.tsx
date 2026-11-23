"use client";

import { useState, type FormEvent } from "react";
import { productImageSrc, type Product } from "@/lib/products";
import { MAX_BASKET_ITEMS, validQuantity } from "@/lib/basket";
import { useBasket } from "./basket-provider";
import { ButtonLink, Field } from "./ui/shared";
import { Icon } from "./ui/icon";

export function ProductRequest({ product }: { product: Product }) {
  const minimum = Number(product.min_order_quantity) || 1;
  const step = product.unit === "kg" ? 0.5 : 1;
  const [quantity, setQuantity] = useState(minimum);
  const [notes, setNotes] = useState("");
  const [added, setAdded] = useState(false);
  const [limitError, setLimitError] = useState("");
  const { addItem } = useBasket();
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validQuantity(quantity, minimum)) return;
    const ok = addItem({
      id: `product-${product.id}`,
      productId: product.id,
      slug: product.slug,
      name: product.name,
      quantity,
      unit: product.unit,
      minimumQuantity: minimum,
      notes,
      image: productImageSrc(product.image),
    });
    if (!ok) {
      setAdded(false);
      setLimitError(
        `Your quote request already has the maximum of ${MAX_BASKET_ITEMS} items. Remove an item in your request to add another.`,
      );
      return;
    }
    setLimitError("");
    setAdded(true);
  }
  return (
    <form onSubmit={submit} className="product-request">
      <div className="product-request-fields">
        <Field
          id="product-quantity"
          label="How much do you need?"
          hint={`Minimum request: ${minimum} ${product.unit}`}
        >
          <div className="quantity-control">
            <button
              type="button"
              aria-label="Decrease quantity"
              disabled={quantity <= minimum}
              onClick={() => {
                setQuantity(Math.max(minimum, Number((quantity - step).toFixed(3))));
                setAdded(false);
              }}
            >
              <Icon name="minus" size={16} />
            </button>
            <input
              id="product-quantity"
              type="number"
              min={minimum}
              max="1000"
              step={product.unit === "kg" ? "0.001" : "1"}
              required
              value={quantity}
              onChange={(event) => {
                setQuantity(Number(event.target.value));
                setAdded(false);
              }}
            />
            <span>{product.unit}</span>
            <button
              type="button"
              aria-label="Increase quantity"
              disabled={quantity >= 1000}
              onClick={() => {
                setQuantity(Math.min(1000, Number((quantity + step).toFixed(3))));
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
      {limitError && (
        <p className="form-error" role="alert">
          {limitError}
        </p>
      )}
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
