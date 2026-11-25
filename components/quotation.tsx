"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { money } from "@/lib/basket";
import { PublicApiError } from "@/lib/products";
import {
  acceptPublicQuotation,
  declinePublicQuotation,
  getPublicQuotation,
  isLiveQuoteToken,
  type PublicQuotation,
  type PublicQuotationStatus,
} from "@/lib/quotations";
import { Badge, ButtonLink } from "./ui/shared";
import { Icon } from "./ui/icon";
import { JourneySteps } from "./journey-shared";

export function Quotation({ reference }: { reference: string }) {
  if (!isLiveQuoteToken(reference)) {
    return (
      <div className="empty-state">
        <Icon name="search" size={36} />
        <h1>Quotation not found.</h1>
        <p>
          This quotation link is invalid or incomplete. Open the private link
          from your IslaSource Seafoods email or submit a new request.
        </p>
        <ButtonLink href="/request-quote" arrow>
          Request a new quote
        </ButtonLink>
      </div>
    );
  }
  return <LiveQuotation key={reference} token={reference} />;
}

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

function formatValidityHours(hours: number): string {
  if (hours >= 24 && hours % 24 === 0) {
    const days = hours / 24;
    return `${days} ${days === 1 ? "day" : "days"} (${hours} hours)`;
  }
  return `${hours} ${hours === 1 ? "hour" : "hours"}`;
}

function statusMeta(status: PublicQuotationStatus): {
  label: string;
  className: string;
  icon: "check" | "clock" | "close" | "mail";
} {
  switch (status) {
    case "Accepted":
      return { label: "Quotation accepted", className: "mint-badge", icon: "check" };
    case "Sent":
      return { label: "Ready for your review", className: "mint-badge", icon: "clock" };
    case "Declined":
      return { label: "Quotation declined", className: "status-badge-muted", icon: "close" };
    case "Expired":
      return { label: "Quotation expired", className: "status-badge-warn", icon: "clock" };
    case "Superseded":
      return { label: "Newer version sent", className: "status-badge-warn", icon: "mail" };
    case "Cancelled":
      return { label: "Quotation withdrawn", className: "status-badge-muted", icon: "close" };
  }
}

function LiveQuotation({ token }: { token: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [quote, setQuote] = useState<PublicQuotation | null>(null);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [attempt, setAttempt] = useState(0);

  const [agreed, setAgreed] = useState(false);
  const [showDecline, setShowDecline] = useState(false);
  const [declineReason, setDeclineReason] = useState("");
  const [busy, setBusy] = useState<"accept" | "decline" | null>(null);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    getPublicQuotation(token, controller.signal)
      .then((loaded) => {
        setQuote(loaded);
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
              : "We couldn’t load your quotation right now. Please try again.",
          );
        }
        setLoading(false);
      });
    return () => controller.abort();
  }, [token, attempt]);

  function retry() {
    setLoading(true);
    setError("");
    setNotFound(false);
    setAttempt((n) => n + 1);
  }

  async function refreshAfterConflict() {
    try {
      const fresh = await getPublicQuotation(token);
      setQuote(fresh);
    } catch {
      // Keep the server conflict message displayed even if refresh fails.
    }
  }

  async function handleAccept() {
    if (!quote || !agreed || busy) return;
    setBusy("accept");
    setActionError("");
    try {
      const updated = await acceptPublicQuotation(token);
      setQuote(updated);
      setShowDecline(false);
      if (updated.order_token) {
        router.push(`/order/${updated.order_token}`);
      }
    } catch (err) {
      const message =
        err instanceof PublicApiError
          ? Object.values(err.errors).flat()[0] || err.message
          : "We couldn’t confirm your acceptance. Please try again.";
      setActionError(message);
      if (err instanceof PublicApiError && err.status === 409) {
        await refreshAfterConflict();
      }
    } finally {
      setBusy(null);
    }
  }

  async function handleDecline() {
    if (!quote || busy) return;
    setBusy("decline");
    setActionError("");
    try {
      const updated = await declinePublicQuotation(token, declineReason);
      setQuote(updated);
      setShowDecline(false);
    } catch (err) {
      const message =
        err instanceof PublicApiError
          ? Object.values(err.errors).flat()[0] || err.message
          : "We couldn’t record your response. Please try again.";
      setActionError(message);
      if (err instanceof PublicApiError && err.status === 409) {
        await refreshAfterConflict();
      }
    } finally {
      setBusy(null);
    }
  }

  if (loading) {
    return <div className="loading-text">Loading your seafood quotation…</div>;
  }

  if (notFound) {
    return (
      <div className="empty-state">
        <Icon name="search" size={36} />
        <h1>Quotation not found.</h1>
        <p>
          This quotation link is invalid or no longer available. Check your
          latest email from IslaSource Seafoods or start a new request.
        </p>
        <ButtonLink href="/request-quote" arrow>
          Request a new quote
        </ButtonLink>
      </div>
    );
  }

  if (error || !quote) {
    return (
      <div className="empty-state">
        <Icon name="clock" size={36} />
        <h1>We couldn’t open this quotation.</h1>
        <p>{error || "Please try again in a moment."}</p>
        <button type="button" className="button button-primary" onClick={retry}>
          Try again
        </button>
      </div>
    );
  }

  const availableItems = quote.items.filter((item) => item.is_available);
  const unavailableItems = quote.items.filter((item) => !item.is_available);
  const badge = statusMeta(quote.status);
  const validUntilText = formatDateTime(quote.valid_until);

  return (
    <>
      <JourneySteps current={quote.status === "Accepted" ? 2 : 1} />
      <div className="journey-heading">
        <div>
          <span className="eyebrow">ISLASOURCE SEAFOODS</span>
          <h1>Your seafood quotation.</h1>
          <p>
            {quote.reference}
            {quote.version > 1 ? ` · v${quote.version}` : ""}{" "}
            <span className="inline-divider">/</span> Request{" "}
            {quote.rfq_reference} <span className="inline-divider">/</span>{" "}
            Prepared for {quote.customer_name}
          </p>
        </div>
        <Badge className={badge.className}>
          <Icon name={badge.icon} size={14} />
          {badge.label}
        </Badge>
      </div>
      <div className="quote-layout">
        <div>
          <section className="panel quotation-lines">
            <div className="panel-heading">
              <h2>Your island selection</h2>
              <span>Confirmed prices · PHP</span>
            </div>
            <div className="quote-table-wrap">
              <table className="quote-table">
                <thead>
                  <tr>
                    <th>Seafood & specifications</th>
                    <th>Quantity</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {availableItems.map((line) => (
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
            {unavailableItems.length > 0 && (
              <div className="unavailable-items" role="note">
                <h3>Currently unavailable (excluded from total)</h3>
                <ul>
                  {unavailableItems.map((line) => (
                    <li key={line.id}>
                      <strong>{line.product_name}</strong> —{" "}
                      {formatQuantity(line.quantity)} {line.unit}
                      {line.specs ? ` (${line.specs})` : ""}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="quote-totals">
              <div>
                <span>Seafood subtotal</span>
                <span>{money(quote.subtotal_centavos)}</span>
              </div>
              <div>
                <span>Delivery to {quote.delivery_location}</span>
                <span>{money(quote.delivery_centavos)}</span>
              </div>
              <div className="grand-total">
                <strong>Total quotation</strong>
                <strong>{money(quote.total_centavos)}</strong>
              </div>
            </div>
          </section>
          <section className="panel quote-details">
            <h2>A few details, clearly.</h2>
            <div className="details-grid">
              <div>
                <Icon name="clock" size={20} />
                <h3>Quotation validity</h3>
                <p>
                  {validUntilText
                    ? `Valid until ${validUntilText} (${formatValidityHours(quote.validity_hours)} from issue).`
                    : `Valid for ${formatValidityHours(quote.validity_hours)} from issue.`}
                </p>
              </div>
              <div>
                <Icon name="truck" size={20} />
                <h3>Delivery arrangements</h3>
                <p>
                  Destination: {quote.delivery_location}.{" "}
                  {quote.confirmed_delivery_date
                    ? `Confirmed delivery date: ${quote.confirmed_delivery_date}. `
                    : quote.requested_delivery_date
                      ? `Preferred date: ${quote.requested_delivery_date}. `
                      : ""}
                  Final dispatch timing is confirmed once full payment is received.
                </p>
              </div>
              <div>
                <Icon name="shield" size={20} />
                <h3>Full payment via QR Ph</h3>
                <p>
                  Full payment of {money(quote.total_centavos)} via PayMongo QR
                  Ph confirms your order and begins sourcing on Bantayan Island.
                </p>
              </div>
              <div>
                <Icon name="fish" size={20} />
                <h3>Quotation terms</h3>
                <p className="quote-terms-text">
                  {quote.terms ||
                    "Sourced fresh to order from Bantayan Island after your full QR Ph payment is confirmed."}
                </p>
              </div>
            </div>
          </section>
          <p className="private-note">
            This quotation link is private to your request. Keep it for your
            records.
          </p>
        </div>
        <aside className="panel deposit-summary">
          {quote.status === "Sent" && (
            <>
              <span className="eyebrow">YOUR NEXT STEP</span>
              <h2>Review and confirm.</h2>
              <p>
                Accept this quotation before{" "}
                {validUntilText || "it expires"} to proceed directly to PayMongo
                QR Ph checkout for full payment.
              </p>
            </>
          )}
          {quote.status === "Accepted" && (
            <>
              <span className="eyebrow">QUOTATION ACCEPTED</span>
              <h2>Thank you for confirming.</h2>
              <p>
                Your acceptance was recorded
                {quote.accepted_at
                  ? ` on ${formatDateTime(quote.accepted_at)}`
                  : ""}
                . Continue to your order page to complete full payment via
                PayMongo QR Ph or check order progress.
              </p>
            </>
          )}
          {quote.status === "Declined" && (
            <>
              <span className="eyebrow">QUOTATION DECLINED</span>
              <h2>Quotation declined.</h2>
              <p>
                No commitment has been made.
                {quote.decline_reason
                  ? ` Your note: “${quote.decline_reason}”`
                  : " Feel free to start a new request whenever you’re ready."}
              </p>
            </>
          )}
          {quote.status === "Expired" && (
            <>
              <span className="eyebrow">QUOTATION EXPIRED</span>
              <h2>This quotation has expired.</h2>
              <p>
                This offer expired
                {validUntilText ? ` on ${validUntilText}` : ""}. Because island
                catch availability and prices move daily, please request a fresh
                quote.
              </p>
            </>
          )}
          {quote.status === "Superseded" && (
            <>
              <span className="eyebrow">UPDATED QUOTATION</span>
              <h2>A newer version was sent.</h2>
              <p>
                Version {quote.version} has been replaced by a revised
                quotation. Please check your email for the latest IslaSource
                Seafoods link.
              </p>
            </>
          )}
          {quote.status === "Cancelled" && (
            <>
              <span className="eyebrow">QUOTATION WITHDRAWN</span>
              <h2>This quotation was withdrawn.</h2>
              <p>
                IslaSource Seafoods withdrew this quotation before confirmation.
                If you still need seafood sourced, please submit a new request.
              </p>
            </>
          )}

          <div className="deposit-amount">
            <span>Total due (100% Full Payment)</span>
            <strong>{money(quote.total_centavos)}</strong>
            <small>Paid via PayMongo QR Ph after acceptance</small>
          </div>

          {quote.status === "Sent" && (
            <div className="quote-action-stack">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(event) => {
                    setAgreed(event.target.checked);
                    setActionError("");
                  }}
                />
                <span>
                  I’ve reviewed the items, delivery fee, validity, and full QR
                  Ph payment terms.
                </span>
              </label>
              {actionError && (
                <p className="form-error" role="alert">
                  {actionError}
                </p>
              )}
              <button
                type="button"
                className="button button-primary full-width"
                disabled={!agreed || busy !== null}
                onClick={handleAccept}
              >
                {busy === "accept" ? "Confirming…" : "Accept quotation"}
                {busy !== "accept" && <Icon name="arrow" size={18} />}
              </button>
              {!showDecline ? (
                <button
                  type="button"
                  className="button button-outline full-width"
                  disabled={busy !== null}
                  onClick={() => {
                    setShowDecline(true);
                    setActionError("");
                  }}
                >
                  Decline quotation
                </button>
              ) : (
                <div className="decline-panel">
                  <label htmlFor="decline-reason">
                    Reason for declining (optional)
                  </label>
                  <textarea
                    id="decline-reason"
                    rows={3}
                    maxLength={500}
                    value={declineReason}
                    onChange={(event) => setDeclineReason(event.target.value)}
                    placeholder="e.g. Different date, budget, or items needed…"
                  />
                  <div className="decline-actions">
                    <button
                      type="button"
                      className="button button-outline"
                      disabled={busy !== null}
                      onClick={handleDecline}
                    >
                      {busy === "decline" ? "Sending…" : "Confirm decline"}
                    </button>
                    <button
                      type="button"
                      className="text-button"
                      disabled={busy !== null}
                      onClick={() => setShowDecline(false)}
                    >
                      Keep reviewing
                    </button>
                  </div>
                </div>
              )}
              <p className="small-note centered">
                <Icon name="shield" size={15} />
                No payment is charged on this page.
              </p>
            </div>
          )}

          {quote.status === "Accepted" && (
            <div className="quote-action-stack">
              {quote.order_token ? (
                <ButtonLink
                  href={`/order/${quote.order_token}`}
                  arrow
                  className="full-width"
                >
                  Continue to QR Ph Payment &amp; Order
                </ButtonLink>
              ) : (
                <div className="soft-note" role="status">
                  <Icon name="check" size={18} />
                  <div>
                    <strong>Next: Full payment via QR Ph</strong>
                    <p>
                      Total due: {money(quote.total_centavos)}. Sourcing begins
                      as soon as payment is verified.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {(quote.status === "Declined" ||
            quote.status === "Expired" ||
            quote.status === "Cancelled") && (
            <div className="quote-action-stack">
              <ButtonLink href="/request-quote" arrow className="full-width">
                Start a new request
              </ButtonLink>
            </div>
          )}

          {quote.status === "Sent" && (
            <ButtonLink href="/request-quote" variant="text">
              Need different items? Start a new request
            </ButtonLink>
          )}
        </aside>
      </div>
    </>
  );
}
