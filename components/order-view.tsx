"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { money } from "@/lib/basket";
import {
  getPublicOrder,
  isLiveOrderToken,
  sendPublicOrderMessage,
  startOrderQrPhCheckout,
  verifyOrderPayment,
  type PublicOrder,
  type PublicOrderMessage,
  type PublicOrderStatus,
} from "@/lib/orders";
import { PublicApiError } from "@/lib/products";
import { JourneySteps } from "./journey-shared";
import { Icon } from "./ui/icon";
import { Badge, ButtonLink } from "./ui/shared";

function formatQuantity(value: string): string {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed.toString() : value;
}

function formatDateTime(iso: string | null): string {
  if (!iso) return "";
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return iso;
  return new Intl.DateTimeFormat("en-PH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(parsed);
}

function statusBadge(status: PublicOrderStatus): {
  label: string;
  className: string;
  icon: "check" | "clock" | "truck" | "close";
} {
  switch (status) {
    case "Awaiting Payment":
      return {
        label: "Awaiting QR Ph payment",
        className: "status-badge-warn",
        icon: "clock",
      };
    case "Processing":
      return {
        label: "Paid · Sourcing seafood",
        className: "mint-badge",
        icon: "check",
      };
    case "Packed":
      return {
        label: "Packed on Bantayan Island",
        className: "mint-badge",
        icon: "check",
      };
    case "Dispatched":
      return {
        label: "Out for delivery",
        className: "mint-badge",
        icon: "truck",
      };
    case "Completed":
      return {
        label: "Delivered & completed",
        className: "mint-badge",
        icon: "check",
      };
    case "Cancelled":
      return {
        label: "Order cancelled",
        className: "status-badge-muted",
        icon: "close",
      };
  }
}

export function OrderView({ token }: { token: string }) {
  if (!isLiveOrderToken(token)) {
    return (
      <div className="empty-state">
        <Icon name="search" size={36} />
        <h1>Order not found.</h1>
        <p>
          This order link is invalid or incomplete. Open the private link from
          your IslaSource Seafoods email or submit a new quote request.
        </p>
        <ButtonLink href="/request-quote" arrow>
          Request a new quote
        </ButtonLink>
      </div>
    );
  }
  return <LiveOrderView key={token} token={token} />;
}

function LiveOrderView({ token }: { token: string }) {
  const searchParams = useSearchParams();
  const paymentParam = searchParams.get("payment");

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<PublicOrder | null>(null);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [attempt, setAttempt] = useState(0);

  const [redirecting, setRedirecting] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [actionError, setActionError] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [messageError, setMessageError] = useState("");
  const [messageSentNotice, setMessageSentNotice] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const shouldVerify = paymentParam === "success";

    const load = shouldVerify
      ? verifyOrderPayment(token).catch(() =>
          getPublicOrder(token, controller.signal),
        )
      : getPublicOrder(token, controller.signal);

    load
      .then((loaded) => {
        if (controller.signal.aborted) return;
        setOrder(loaded);
        setError("");
        setNotFound(false);
        setLoading(false);
      })
      .catch((err) => {
        if (err instanceof Error && err.name === "AbortError") return;
        if (err instanceof PublicApiError && err.status === 404) {
          setNotFound(true);
          setError("");
        } else {
          setNotFound(false);
          setError(
            err instanceof PublicApiError
              ? err.message
              : "We couldn’t load your order right now. Please try again.",
          );
        }
        setLoading(false);
      });

    return () => controller.abort();
  }, [token, attempt, paymentParam]);

  function retry() {
    setLoading(true);
    setError("");
    setNotFound(false);
    setAttempt((n) => n + 1);
  }

  async function handlePayNow() {
    if (!order || redirecting || verifying) return;
    setRedirecting(true);
    setActionError("");
    try {
      const { checkout_url } = await startOrderQrPhCheckout(token);
      if (!checkout_url.startsWith("https://")) {
        throw new Error("Unexpected checkout redirect URL.");
      }
      window.location.assign(checkout_url);
    } catch (err) {
      setRedirecting(false);
      setActionError(
        err instanceof PublicApiError
          ? err.message
          : "We couldn’t open PayMongo QR Ph checkout right now. Please try again.",
      );
    }
  }

  async function handleCheckPayment() {
    if (!order || verifying || redirecting) return;
    setVerifying(true);
    setActionError("");
    try {
      const updated = await verifyOrderPayment(token);
      setOrder(updated);
      if (updated.payment_status !== "Paid") {
        setActionError(
          "Payment hasn’t confirmed yet. If you just completed QR Ph payment, wait a few seconds and check again.",
        );
      }
    } catch (err) {
      setActionError(
        err instanceof PublicApiError
          ? err.message
          : "We couldn’t check payment status right now. Please try again.",
      );
    } finally {
      setVerifying(false);
    }
  }

  async function handleSendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!order || sendingMessage || !messageBody.trim()) return;
    setSendingMessage(true);
    setMessageError("");
    setMessageSentNotice(false);
    try {
      const created: PublicOrderMessage = await sendPublicOrderMessage(
        token,
        messageBody,
      );
      setOrder({
        ...order,
        messages: [...(order.messages ?? []), created],
      });
      setMessageBody("");
      setMessageSentNotice(true);
    } catch (err) {
      setMessageError(
        err instanceof PublicApiError
          ? Object.values(err.errors).flat()[0] || err.message
          : "We couldn’t send your message right now. Please try again.",
      );
    } finally {
      setSendingMessage(false);
    }
  }

  if (loading) {
    return (
      <div className="loading-text">
        {paymentParam === "success"
          ? "Confirming your PayMongo QR Ph payment…"
          : "Loading your order…"}
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="empty-state">
        <Icon name="search" size={36} />
        <h1>Order not found.</h1>
        <p>
          This order link is invalid or no longer available. Check your email
          from IslaSource Seafoods or start a new request.
        </p>
        <ButtonLink href="/request-quote" arrow>
          Request a new quote
        </ButtonLink>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="empty-state">
        <Icon name="clock" size={36} />
        <h1>We couldn’t open this order.</h1>
        <p>{error || "Please try again in a moment."}</p>
        <button type="button" className="button button-primary" onClick={retry}>
          Try again
        </button>
      </div>
    );
  }

  const badge = statusBadge(order.status);
  const isPaid = order.payment_status === "Paid";
  const messages = order.messages ?? [];
  const messagingOpen =
    order.status !== "Completed" && order.status !== "Cancelled";
  const displayDeliveryDate =
    order.confirmed_delivery_date || order.requested_delivery_date;

  return (
    <>
      <JourneySteps current={isPaid ? 3 : 2} />
      <div className="journey-heading">
        <div>
          <span className="eyebrow">ISLASOURCE SEAFOODS · ORDER</span>
          <h1>
            {isPaid ? "Your island order is underway." : "Complete full payment."}
          </h1>
          <p>
            {order.reference} <span className="inline-divider">/</span> Quote{" "}
            {order.quotation_reference} <span className="inline-divider">/</span>{" "}
            {order.customer_name}
          </p>
        </div>
        <Badge className={badge.className}>
          <Icon name={badge.icon} size={14} />
          {badge.label}
        </Badge>
      </div>

      <div className="quote-layout">
        <div>
          {isPaid && (
            <section className="panel timeline-panel">
              <h2>Order progress</h2>
              <ol className="order-timeline">
                <li className="complete">
                  <span>
                    <Icon name="check" size={14} />
                  </span>
                  <div>
                    <h3>Full payment verified via QR Ph</h3>
                    <p>
                      {order.paid_at
                        ? `Confirmed on ${formatDateTime(order.paid_at)}.`
                        : "Payment confirmed."}
                    </p>
                  </div>
                </li>
                <li
                  className={
                    order.packed_at ? "complete" : "current"
                  }
                >
                  <span>
                    {order.packed_at ? <Icon name="check" size={14} /> : "02"}
                  </span>
                  <div>
                    <h3>Sourcing &amp; preparing on Bantayan Island</h3>
                    <p>
                      {order.packed_at
                        ? `Packed on ${formatDateTime(order.packed_at)}.`
                        : "Our team is sourcing and preparing your fresh seafood order."}
                    </p>
                  </div>
                </li>
                <li
                  className={
                    order.dispatched_at
                      ? "complete"
                      : order.packed_at
                        ? "current"
                        : ""
                  }
                >
                  <span>
                    {order.dispatched_at ? (
                      <Icon name="check" size={14} />
                    ) : (
                      "03"
                    )}
                  </span>
                  <div>
                    <h3>Dispatched for delivery</h3>
                    <p>
                      {order.dispatched_at
                        ? `Dispatched on ${formatDateTime(order.dispatched_at)} to ${order.delivery_location}.`
                        : `Destination: ${order.delivery_location}.`}
                    </p>
                  </div>
                </li>
                <li
                  className={
                    order.completed_at
                      ? "complete"
                      : order.dispatched_at
                        ? "current"
                        : ""
                  }
                >
                  <span>
                    {order.completed_at ? (
                      <Icon name="check" size={14} />
                    ) : (
                      "04"
                    )}
                  </span>
                  <div>
                    <h3>Delivered</h3>
                    <p>
                      {order.completed_at
                        ? `Completed on ${formatDateTime(order.completed_at)}.`
                        : "We’ll notify you by email when your order arrives."}
                    </p>
                  </div>
                </li>
              </ol>
            </section>
          )}

          <section
            className="panel quotation-lines"
            style={isPaid ? { marginTop: 23 } : undefined}
          >
            <div className="panel-heading">
              <h2>Your seafood order</h2>
              <span>Confirmed prices · PHP</span>
            </div>
            <div className="quote-table-wrap">
              <table className="quote-table">
                <thead>
                  <tr>
                    <th>Seafood &amp; specifications</th>
                    <th>Quantity</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((line) => (
                    <tr key={line.id}>
                      <td>
                        <strong>{line.product_name}</strong>
                        {line.specs && <small>{line.specs}</small>}
                      </td>
                      <td>
                        {formatQuantity(line.quantity)} {line.unit}
                      </td>
                      <td>{money(line.line_selling_centavos)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="quote-totals">
              <div>
                <span>Seafood subtotal</span>
                <span>{money(order.subtotal_centavos)}</span>
              </div>
              <div>
                <span>Delivery to {order.delivery_location}</span>
                <span>{money(order.delivery_centavos)}</span>
              </div>
              <div className="grand-total">
                <strong>{isPaid ? "Total paid (QR Ph)" : "Total amount due"}</strong>
                <strong>{money(order.total_centavos)}</strong>
              </div>
            </div>
          </section>

          <section
            id="messages"
            className="panel order-messages-panel"
            style={{ marginTop: 23 }}
          >
            <div className="panel-heading">
              <h2>Messages &amp; follow-up</h2>
              <span>
                {messagingOpen
                  ? "Email notifications enabled"
                  : "Conversation closed"}
              </span>
            </div>
            <div className="order-messages-body">
              {messages.length > 0 ? (
                <div className="order-message-list">
                  {messages.map((msg) => (
                    <article
                      key={msg.id}
                      className={`order-message-card${msg.sender_type === "admin" ? " is-admin" : " is-customer"}`}
                    >
                      <header>
                        <strong>
                          {msg.sender_type === "admin"
                            ? "IslaSource Seafoods"
                            : `${msg.sender_name} (You)`}
                        </strong>
                        <time dateTime={msg.created_at}>
                          {formatDateTime(msg.created_at)}
                        </time>
                      </header>
                      <p>{msg.body}</p>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="order-messages-empty">
                  Have a delivery instruction, bus/port landmark, or follow-up
                  question? Send us a message here — our team gets notified by
                  email right away, and any reply will also be emailed to you.
                </p>
              )}

              {messagingOpen ? (
                <form
                  className="order-message-form"
                  onSubmit={(event) => void handleSendMessage(event)}
                >
                  <div className="field">
                    <label htmlFor="guest-order-message">
                      Send a message about {order.reference}
                    </label>
                    <textarea
                      id="guest-order-message"
                      rows={3}
                      maxLength={2000}
                      required
                      disabled={sendingMessage}
                      value={messageBody}
                      onChange={(event) => {
                        setMessageBody(event.target.value);
                        if (messageError) setMessageError("");
                        if (messageSentNotice) setMessageSentNotice(false);
                      }}
                      placeholder="Write a follow-up question, packing note, or delivery landmark…"
                    />
                  </div>
                  {messageError && (
                    <p className="form-error" role="alert">
                      {messageError}
                    </p>
                  )}
                  {messageSentNotice && (
                    <p className="success-text" role="status">
                      <Icon name="check" size={15} />
                      Message sent. We’ll email you a link here as soon as we
                      reply.
                    </p>
                  )}
                  <button
                    type="submit"
                    className="button button-outline"
                    disabled={sendingMessage || !messageBody.trim()}
                  >
                    {sendingMessage ? "Sending…" : "Send message"}
                    {!sendingMessage && <Icon name="arrow" size={16} />}
                  </button>
                </form>
              ) : (
                <p className="small-note">
                  Messaging is closed because this order is{" "}
                  {order.status.toLowerCase()}.
                </p>
              )}
            </div>
          </section>

          <p className="private-note">
            Keep this private link to check your payment receipt and live order
            progress anytime.
          </p>
        </div>

        <aside className="panel deposit-summary">
          {order.status === "Awaiting Payment" && !isPaid && (
            <>
              <span className="eyebrow">PAY VIA QR PH</span>
              <h2>Full payment starts sourcing.</h2>
              <p>
                Pay the full amount via PayMongo QR Ph (compatible with GCash,
                Maya, BPI, BDO, UnionBank, and other QR Ph apps). Sourcing
                begins as soon as payment is confirmed.
              </p>
              <div className="deposit-amount">
                <span>Full payment due</span>
                <strong>{money(order.total_centavos)}</strong>
                <small>Payment method: QR Ph (PayMongo Checkout)</small>
              </div>
              <div className="quote-action-stack">
                {paymentParam === "cancelled" && (
                  <p className="small-note" role="status">
                    QR Ph checkout was cancelled. You can retry payment anytime
                    below.
                  </p>
                )}
                {actionError && (
                  <p className="form-error" role="alert">
                    {actionError}
                  </p>
                )}
                <button
                  type="button"
                  className="button button-primary full-width"
                  disabled={redirecting || verifying}
                  onClick={() => void handlePayNow()}
                >
                  {redirecting
                    ? "Redirecting to PayMongo…"
                    : `Pay ${money(order.total_centavos)} via QR Ph`}
                  {!redirecting && <Icon name="arrow" size={18} />}
                </button>
                <button
                  type="button"
                  className="button button-outline full-width"
                  disabled={redirecting || verifying}
                  onClick={() => void handleCheckPayment()}
                >
                  {verifying ? "Checking payment…" : "I already paid — refresh status"}
                </button>
                <p className="small-note centered">
                  <Icon name="shield" size={15} />
                  Secured by PayMongo QR Ph Hosted Checkout
                </p>
              </div>
            </>
          )}

          {isPaid && (
            <>
              <span className="eyebrow">PAYMENT CONFIRMED</span>
              <h2>Thank you!</h2>
              <p>
                Your full QR Ph payment has been verified and a receipt has been
                sent to your email. We’ll email you as your order moves from
                sourcing to delivery.
              </p>
              <div className="deposit-amount">
                <span>Paid in full via QR Ph</span>
                <strong>{money(order.paid_centavos)}</strong>
                <small>
                  {order.paid_at
                    ? `Paid on ${formatDateTime(order.paid_at)}`
                    : "Verified by PayMongo"}
                </small>
              </div>
              <div className="quote-action-stack">
                <div className="soft-note" role="status">
                  <Icon name="check" size={18} />
                  <div>
                    <strong>Current status: {order.status}</strong>
                    <p>
                      Delivering to {order.delivery_location}
                      {displayDeliveryDate
                        ? ` · Target date ${displayDeliveryDate}`
                        : ""}
                      .
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {order.status === "Cancelled" && (
            <>
              <span className="eyebrow">ORDER CANCELLED</span>
              <h2>This order was cancelled.</h2>
              <p>
                Payment is no longer open for this order. Start a new quote
                request whenever you’d like fresh seafood from Bantayan Island.
              </p>
              <div className="quote-action-stack">
                <ButtonLink href="/request-quote" arrow className="full-width">
                  Start a new request
                </ButtonLink>
              </div>
            </>
          )}
        </aside>
      </div>
    </>
  );
}
