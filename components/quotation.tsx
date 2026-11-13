"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { money, quoteTotals } from "@/lib/demo";
import { useDemo } from "./demo-provider";
import { Badge, ButtonLink, DemoNotice } from "./ui/shared";
import { Icon } from "./ui/icon";
import { JourneySteps, LoadingRequest, MissingRequest } from "./journey-shared";

export function Quotation({ reference }: { reference: string }) {
  const { getRequest, updateStatus, ready } = useDemo();
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);
  if (!ready) return <LoadingRequest />;
  const request = getRequest(reference);
  if (!request) return <MissingRequest />;
  const totals = quoteTotals(request.items);
  const paid = ["paid", "sourcing", "delivered"].includes(request.status);
  return (
    <>
      <JourneySteps
        current={paid ? 3 : request.status === "accepted" ? 2 : 1}
      />
      <DemoNotice>
        This is a sample quotation for demo lookup. All prices, availability,
        and delivery terms below are illustrative, not a real supplier offer.
      </DemoNotice>
      <div className="journey-heading">
        <div>
          <span className="eyebrow">A LITTLE CLOSER TO THE ISLAND</span>
          <h1>Your seafood quotation.</h1>
          <p>
            {reference} <span className="inline-divider">/</span> Prepared for{" "}
            {request.guest.name}
          </p>
        </div>
        <Badge className="mint-badge">
          <Icon name="check" size={14} />
          {paid
            ? "Demo deposit received"
            : request.status === "accepted"
              ? "Quotation accepted"
              : "Sample quote ready"}
        </Badge>
      </div>
      <div className="quote-layout">
        <div>
          <section className="panel quotation-lines">
            <div className="panel-heading">
              <h2>Your island selection</h2>
              <span>Sample prices · PHP</span>
            </div>
            <div className="quote-table-wrap">
              <table className="quote-table">
                <thead>
                  <tr>
                    <th>Seafood & specifications</th>
                    <th>Quantity</th>
                    <th>Unit price</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {totals.lines.map((line) => (
                    <tr key={line.id}>
                      <td>
                        <strong>{line.name}</strong>
                        <small>
                          {line.notes ||
                            "Standard preparation · demo specification"}
                        </small>
                      </td>
                      <td>{line.quantity} kg</td>
                      <td>{money(line.rate)}</td>
                      <td>{money(Math.round(line.rate * line.quantity))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="quote-totals">
              <div>
                <span>Seafood subtotal</span>
                <span>{money(totals.subtotal)}</span>
              </div>
              <div>
                <span>Delivery to {request.guest.location}</span>
                <span>{money(totals.delivery)}</span>
              </div>
              <div className="grand-total">
                <strong>Total quotation</strong>
                <strong>{money(totals.total)}</strong>
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
                  48 hours from issue in this demo. A real quote will carry a
                  specific expiry date.
                </p>
              </div>
              <div>
                <Icon name="truck" size={20} />
                <h3>Delivery arrangements</h3>
                <p>
                  {request.guest.date
                    ? `Preferred date: ${request.guest.date}. `
                    : "Your delivery date is flexible. "}
                  The final schedule is confirmed before deposit.
                </p>
              </div>
              <div>
                <Icon name="shield" size={20} />
                <h3>Deposit & balance</h3>
                <p>
                  50% deposit begins procurement. The remaining 50% is due
                  before dispatch.
                </p>
              </div>
              <div>
                <Icon name="fish" size={20} />
                <h3>Sourced for you</h3>
                <p>
                  Our team checks the supplier’s catch and specifications before
                  issuing a real quotation.
                </p>
              </div>
            </div>
          </section>
          <p className="private-note">
            Demo preview only. No real order or payment is created.
          </p>
        </div>
        <aside className="panel deposit-summary">
          <span className="eyebrow">YOUR NEXT STEP</span>
          <h2>{paid ? "You’re on island time." : "Good things start here."}</h2>
          <p>
            {paid
              ? "Your demo deposit is recorded. Follow your seafood from sourcing to delivery."
              : "Approve your quotation, then arrange the deposit so we can begin sourcing."}
          </p>
          <div className="deposit-amount">
            <span>50% deposit</span>
            <strong>{money(totals.deposit)}</strong>
            <small>Balance after deposit: {money(totals.balance)}</small>
          </div>
          {paid ? (
            <ButtonLink
              href={`/order/${reference}`}
              arrow
              className="full-width"
            >
              Track your order
            </ButtonLink>
          ) : request.status === "accepted" ? (
            <ButtonLink
              href={`/payment/${reference}`}
              arrow
              className="full-width"
            >
              Continue to demo payment
            </ButtonLink>
          ) : (
            <>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(event) => setAgreed(event.target.checked)}
                />
                <span>
                  I’ve reviewed the quantities, delivery fee, and 50% deposit
                  terms.
                </span>
              </label>
              <button
                type="button"
                className="button button-primary full-width"
                disabled={!agreed}
                onClick={() => {
                  updateStatus(reference, "accepted");
                  router.push(`/payment/${reference}`);
                }}
              >
                Accept quotation
                <Icon name="arrow" size={18} />
              </button>
            </>
          )}
          <p className="small-note centered">
            <Icon name="shield" size={15} />
            Demo only · no real commitment or charge
          </p>
          <ButtonLink href="/request-quote" variant="text">
            Need a change? Start a new request
          </ButtonLink>
        </aside>
      </div>
    </>
  );
}
