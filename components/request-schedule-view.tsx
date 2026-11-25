"use client";

import { useEffect, useState } from "react";
import { PublicApiError } from "@/lib/products";
import {
  getPublicRfqSchedule,
  isLiveQuoteToken,
  respondToPublicRfqSchedule,
  type PublicRfqSchedule,
} from "@/lib/quotations";
import { Icon } from "./ui/icon";
import { Badge, ButtonLink } from "./ui/shared";

function formatQty(value: string): string {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed.toString() : value;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "Flexible";
  const parsed = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return dateStr;
  return new Intl.DateTimeFormat("en-PH", { dateStyle: "medium" }).format(
    parsed,
  );
}

export function RequestScheduleView({ token }: { token: string }) {
  if (!isLiveQuoteToken(token)) {
    return (
      <div className="empty-state">
        <Icon name="search" size={36} />
        <h1>Schedule link not found.</h1>
        <p>
          This update link is invalid or incomplete. Open the private link from
          your IslaSource Seafoods email or start a new request.
        </p>
        <ButtonLink href="/request-quote" arrow>
          Start a new request
        </ButtonLink>
      </div>
    );
  }
  return <LiveRequestScheduleView key={token} token={token} />;
}

function LiveRequestScheduleView({ token }: { token: string }) {
  const [loading, setLoading] = useState(true);
  const [schedule, setSchedule] = useState<PublicRfqSchedule | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  const [note, setNote] = useState("");
  const [busy, setBusy] = useState<"accept" | "cancel" | null>(null);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    getPublicRfqSchedule(token, controller.signal)
      .then((loaded) => {
        setSchedule(loaded);
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
              : "We couldn’t load this schedule update right now.",
          );
        }
        setLoading(false);
      });
    return () => controller.abort();
  }, [token, attempt]);

  async function handleRespond(decision: "accept" | "cancel") {
    if (!schedule || busy) return;
    setBusy(decision);
    setActionError("");
    try {
      const updated = await respondToPublicRfqSchedule(token, decision, note);
      setSchedule(updated);
    } catch (err) {
      setActionError(
        err instanceof PublicApiError
          ? Object.values(err.errors).flat()[0] || err.message
          : "We couldn’t save your response. Please try again.",
      );
      if (err instanceof PublicApiError && err.status === 409) {
        try {
          setSchedule(await getPublicRfqSchedule(token));
        } catch {
          // Keep error displayed
        }
      }
    } finally {
      setBusy(null);
    }
  }

  if (loading) {
    return <div className="loading-text">Loading your schedule update…</div>;
  }

  if (notFound) {
    return (
      <div className="empty-state">
        <Icon name="search" size={36} />
        <h1>Schedule update not found.</h1>
        <p>
          This link is no longer active. Check your latest email from IslaSource
          Seafoods or submit a new quote request.
        </p>
        <ButtonLink href="/request-quote" arrow>
          Request a new quote
        </ButtonLink>
      </div>
    );
  }

  if (error || !schedule) {
    return (
      <div className="empty-state">
        <Icon name="clock" size={36} />
        <h1>We couldn’t open this update.</h1>
        <p>{error || "Please try again shortly."}</p>
        <button
          type="button"
          className="button button-primary"
          onClick={() => {
            setLoading(true);
            setAttempt((n) => n + 1);
          }}
        >
          Try again
        </button>
      </div>
    );
  }

  const isOpen =
    schedule.schedule_status === "Proposed" && schedule.status !== "Closed";

  return (
    <>
      <div className="journey-heading">
        <div>
          <span className="eyebrow">ISLASOURCE SEAFOODS · SUPPLY UPDATE</span>
          <h1>Updated catch &amp; delivery schedule.</h1>
          <p>
            Request {schedule.reference}{" "}
            <span className="inline-divider">/</span> Prepared for{" "}
            {schedule.customer_name} <span className="inline-divider">/</span>{" "}
            {schedule.delivery_location}
          </p>
        </div>
        <Badge
          className={
            schedule.schedule_status === "Accepted"
              ? "mint-badge"
              : schedule.schedule_status === "Proposed"
                ? "status-badge-warn"
                : "status-badge-muted"
          }
        >
          <Icon
            name={schedule.schedule_status === "Accepted" ? "check" : "clock"}
            size={14}
          />
          {schedule.schedule_status === "Accepted"
            ? "Waiting for catch"
            : schedule.schedule_status === "Declined"
              ? "Request cancelled"
              : "Awaiting your reply"}
        </Badge>
      </div>

      <div className="quote-layout">
        <div>
          <section className="panel quote-details">
            <h2>Message from Bantayan Island.</h2>
            {schedule.schedule_notice && (
              <p className="schedule-notice-copy">{schedule.schedule_notice}</p>
            )}
            <div className="schedule-dates-card">
              <div>
                <span>Original requested date</span>
                <strong>{formatDate(schedule.requested_delivery_date)}</strong>
              </div>
              <div>
                <span>Estimated catch available</span>
                <strong>{formatDate(schedule.proposed_available_date)}</strong>
              </div>
              <div>
                <span>Proposed delivery date</span>
                <strong>{formatDate(schedule.proposed_delivery_date)}</strong>
              </div>
            </div>
          </section>

          <section
            className="panel quotation-lines"
            style={{ marginTop: 23 }}
          >
            <div className="panel-heading">
              <h2>Your requested seafood</h2>
              <span>{schedule.items.length} items</span>
            </div>
            <div className="quote-table-wrap">
              <table className="quote-table">
                <thead>
                  <tr>
                    <th>Seafood</th>
                    <th>Requested quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {schedule.items.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <strong>{item.name}</strong>
                        {item.notes && <small>{item.notes}</small>}
                      </td>
                      <td>
                        {formatQty(item.quantity)} {item.unit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <aside className="panel deposit-summary">
          {isOpen && (
            <>
              <span className="eyebrow">YOUR DECISION</span>
              <h2>Would you like to wait?</h2>
              <p>
                No payment is required now. If the updated schedule works for
                you, we’ll email your personal quotation as soon as our local
                fishermen confirm the catch.
              </p>
              <div className="quote-action-stack">
                <div className="field">
                  <label htmlFor="schedule-note">
                    Optional note for our team
                  </label>
                  <textarea
                    id="schedule-note"
                    rows={3}
                    maxLength={500}
                    disabled={busy !== null}
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    placeholder="e.g. Morning delivery preferred, or open to substitutes…"
                  />
                </div>
                {actionError && (
                  <p className="form-error" role="alert">
                    {actionError}
                  </p>
                )}
                <button
                  type="button"
                  className="button button-primary full-width"
                  disabled={busy !== null}
                  onClick={() => void handleRespond("accept")}
                >
                  {busy === "accept"
                    ? "Confirming…"
                    : "Yes, wait for new schedule"}
                  {busy !== "accept" && <Icon name="arrow" size={18} />}
                </button>
                <button
                  type="button"
                  className="button button-outline full-width"
                  disabled={busy !== null}
                  onClick={() => void handleRespond("cancel")}
                >
                  {busy === "cancel" ? "Cancelling…" : "Cancel my request"}
                </button>
              </div>
            </>
          )}

          {schedule.schedule_status === "Accepted" && (
            <>
              <span className="eyebrow">CONFIRMED</span>
              <h2>We’ll keep watch on the catch.</h2>
              <p>
                Thank you! Your request stays on our sourcing list for{" "}
                <strong>{formatDate(schedule.proposed_available_date)}</strong>{" "}
                (delivery{" "}
                <strong>{formatDate(schedule.proposed_delivery_date)}</strong>).
                We’ll email your quotation once confirmed.
              </p>
              {schedule.schedule_customer_note && (
                <p className="small-note">
                  Your note: “{schedule.schedule_customer_note}”
                </p>
              )}
              <div className="quote-action-stack">
                <ButtonLink
                  href="/seafood"
                  variant="outline"
                  className="full-width"
                >
                  Explore more seafood
                </ButtonLink>
              </div>
            </>
          )}

          {(schedule.schedule_status === "Declined" ||
            schedule.status === "Closed") &&
            schedule.schedule_status !== "Accepted" && (
              <>
                <span className="eyebrow">REQUEST CLOSED</span>
                <h2>Request cancelled.</h2>
                <p>
                  No obligation has been made. Whenever you need island seafood
                  for another occasion, we’ll be glad to check the catch for
                  you.
                </p>
                <div className="quote-action-stack">
                  <ButtonLink
                    href="/request-quote"
                    arrow
                    className="full-width"
                  >
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
