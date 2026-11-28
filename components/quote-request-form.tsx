"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import {
  CEBU_MIN_KG,
  ISLAND_MIN_KG,
  MAX_BASKET_ITEMS,
  checkZoneMinimum,
  formatDeliveryLocation,
  validQuantity,
  type CebuChannel,
  type DeliveryZone,
  type IslandTown,
} from "@/lib/basket";
import {
  PublicApiError,
  sendGuestQuoteCode,
  submitGuestQuote,
} from "@/lib/products";
import { getPublicSiteSettings } from "@/lib/site-settings";
import { useBasket } from "./basket-provider";
import { ButtonLink, Field } from "./ui/shared";
import { Icon } from "./ui/icon";

const islandTowns: IslandTown[] = ["Bantayan", "Santa Fe", "Madridejos"];
const cebuChannels: { value: CebuChannel; label: string }[] = [
  {
    value: "Ceres Bus — Cebu North Bus Terminal",
    label: "Ceres Bus — Cebu North Bus Terminal (Best for fresh & frozen)",
  },
  {
    value: "Jessamae / Island Trucking Hub",
    label: "Jessamae / Island Trucking Hub (~1 day, best for dried)",
  },
];

export function QuoteRequestForm() {
  const { items, ready, addItem, updateItem, removeItem, clearBasket } =
    useBasket();
  const router = useRouter();
  const [customName, setCustomName] = useState("");
  const [customQuantity, setCustomQuantity] = useState(1);
  const [customNotes, setCustomNotes] = useState("");
  const [customSuccess, setCustomSuccess] = useState("");
  const [customError, setCustomError] = useState("");

  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [zone, setZone] = useState<DeliveryZone>("island");
  const [islandTown, setIslandTown] = useState<IslandTown>("Bantayan");
  const [cebuChannel, setCebuChannel] = useState<CebuChannel>(
    "Ceres Bus — Cebu North Bus Terminal",
  );
  const [locationDetail, setLocationDetail] = useState("");
  const [guestDate, setGuestDate] = useState("");
  const [guestNotes, setGuestNotes] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [honeypot, setHoneypot] = useState("");

  const [step, setStep] = useState<"details" | "verify">("details");
  const [verificationCode, setVerificationCode] = useState("");
  const [codeSentForEmail, setCodeSentForEmail] = useState("");
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [sendingCode, setSendingCode] = useState(false);
  const [otpNotice, setOtpNotice] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [islandMinKg, setIslandMinKg] = useState(ISLAND_MIN_KG);
  const [cebuMinKg, setCebuMinKg] = useState(CEBU_MIN_KG);
  const [advisoryText, setAdvisoryText] = useState("");

  const basketOverLimit = items.length > MAX_BASKET_ITEMS;
  const basketFull = items.length >= MAX_BASKET_ITEMS;
  const minCheck = checkZoneMinimum(items, zone, {
    islandMinKg,
    cebuMinKg,
  });

  useEffect(() => {
    const controller = new AbortController();
    void getPublicSiteSettings(controller.signal).then((cfg) => {
      if (cfg.island_min_kg > 0) setIslandMinKg(cfg.island_min_kg);
      if (cfg.cebu_min_kg > 0) setCebuMinKg(cfg.cebu_min_kg);
      if (cfg.homepage.advisory_enabled && cfg.homepage.advisory_text.trim()) {
        setAdvisoryText(cfg.homepage.advisory_text.trim());
      }
    });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (cooldownSeconds <= 0) return;
    const timer = window.setTimeout(() => {
      setCooldownSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [cooldownSeconds]);

  function addCustom(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!customName.trim() || !validQuantity(customQuantity)) return;
    const trimmedName = customName.trim();
    const ok = addItem({
      id: `custom-${trimmedName.toLowerCase().replace(/\s+/g, "-")}`,
      name: trimmedName,
      quantity: customQuantity,
      unit: "kg",
      notes: customNotes.trim(),
    });
    if (!ok) {
      setCustomSuccess("");
      setCustomError(
        `Your quote request already has the maximum of ${MAX_BASKET_ITEMS} items. Remove an item above to add another.`,
      );
      return;
    }
    setCustomError("");
    setCustomSuccess(`${trimmedName} added to your request.`);
    setCustomName("");
    setCustomNotes("");
  }

  function extractError(error: unknown, fallback: string): string {
    return error instanceof PublicApiError
      ? Object.values(error.errors).flat()[0] || error.message
      : fallback;
  }

  async function requestCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (
      !items.length ||
      basketOverLimit ||
      !minCheck.ok ||
      sendingCode ||
      submitting
    ) {
      return;
    }

    const formattedLocation = formatDeliveryLocation({
      zone,
      islandTown,
      detail: locationDetail,
      cebuChannel,
    });
    const normalizedEmail = guestEmail.trim().toLowerCase();
    if (
      !guestName.trim() ||
      !normalizedEmail ||
      !guestPhone.trim() ||
      !formattedLocation ||
      !termsAccepted
    ) {
      return;
    }

    if (normalizedEmail === codeSentForEmail && cooldownSeconds > 0) {
      setSubmitError("");
      setStep("verify");
      return;
    }

    setSendingCode(true);
    setSubmitError("");
    setOtpNotice("");
    try {
      const result = await sendGuestQuoteCode({
        customer_name: guestName.trim(),
        email: normalizedEmail,
        website: honeypot,
        elapsed_ms: Math.max(0, Math.round(performance.now())),
      });
      setCodeSentForEmail(normalizedEmail);
      setCooldownSeconds(result.cooldown_seconds || 60);
      setVerificationCode("");
      setStep("verify");
    } catch (error) {
      setSubmitError(
        extractError(
          error,
          "We couldn’t send a verification code right now. Please try again.",
        ),
      );
    } finally {
      setSendingCode(false);
    }
  }

  async function resendCode() {
    if (cooldownSeconds > 0 || sendingCode || submitting) return;
    const normalizedEmail = guestEmail.trim().toLowerCase();
    if (!guestName.trim() || !normalizedEmail) return;

    setSendingCode(true);
    setSubmitError("");
    setOtpNotice("");
    try {
      const result = await sendGuestQuoteCode({
        customer_name: guestName.trim(),
        email: normalizedEmail,
        website: honeypot,
        elapsed_ms: Math.max(0, Math.round(performance.now())),
      });
      setCodeSentForEmail(normalizedEmail);
      setCooldownSeconds(result.cooldown_seconds || 60);
      setVerificationCode("");
      setOtpNotice(`Sent a fresh 6-digit code to ${normalizedEmail}.`);
    } catch (error) {
      setSubmitError(
        extractError(
          error,
          "We couldn’t resend your verification code right now.",
        ),
      );
    } finally {
      setSendingCode(false);
    }
  }

  async function confirmAndSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (
      !items.length ||
      basketOverLimit ||
      !minCheck.ok ||
      verificationCode.length !== 6 ||
      submitting
    ) {
      return;
    }

    const formattedLocation = formatDeliveryLocation({
      zone,
      islandTown,
      detail: locationDetail,
      cebuChannel,
    });
    const normalizedEmail = guestEmail.trim().toLowerCase();
    if (
      !guestName.trim() ||
      !normalizedEmail ||
      !guestPhone.trim() ||
      !formattedLocation
    ) {
      setStep("details");
      return;
    }

    setSubmitting(true);
    setSubmitError("");
    setOtpNotice("");
    try {
      const result = await submitGuestQuote({
        customer_name: guestName.trim(),
        email: normalizedEmail,
        phone: guestPhone.trim(),
        location: formattedLocation,
        requested_delivery_date: guestDate || null,
        notes: guestNotes.trim(),
        terms_accepted: true,
        verification_code: verificationCode,
        website: honeypot,
        items: items.map((item) => ({
          product_id: item.productId ?? null,
          name: item.name,
          quantity: item.quantity,
          unit: item.unit,
          notes: item.notes,
        })),
      });
      clearBasket();
      router.push(
        `/request-received?reference=${encodeURIComponent(result.reference)}`,
      );
    } catch (error) {
      setSubmitError(
        extractError(
          error,
          "We couldn’t verify your code or send your request. Please try again.",
        ),
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {advisoryText && (
        <div className="island-advisory-banner" role="status" style={{ marginBottom: 22 }}>
          <Icon name="shield" size={16} />
          <span>{advisoryText}</span>
        </div>
      )}
      <div className="request-layout">
        <div>
          <div className="panel basket-panel">
            <div className="panel-heading">
              <h2>Your island selection</h2>
              <span>
                {items.length} / {MAX_BASKET_ITEMS} items
              </span>
            </div>
            {basketOverLimit && (
              <p className="form-error basket-limit-alert" role="alert">
                You can request up to {MAX_BASKET_ITEMS} items per quote
                request. Please remove {items.length - MAX_BASKET_ITEMS}{" "}
                {items.length - MAX_BASKET_ITEMS === 1 ? "item" : "items"}{" "}
                before submitting.
              </p>
            )}
            {!ready ? (
              <p className="loading-text">Loading your selection…</p>
            ) : items.length ? (
              <div className="basket-items">
                {items.map((item) => (
                  <article className="basket-item" key={item.id}>
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={92}
                        height={100}
                        unoptimized={/^https?:\/\//i.test(item.image)}
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
                            min={item.minimumQuantity || 0.5}
                            max={1000}
                            step={item.unit === "kg" ? 0.5 : 1}
                            value={item.quantity}
                            onChange={(event) => {
                              const next = Number(event.target.value);
                              if (
                                validQuantity(next, item.minimumQuantity || 0.5)
                              ) {
                                updateItem(item.id, next);
                              }
                            }}
                          />
                          <span>{item.unit}</span>
                        </label>
                        <button
                          type="button"
                          className="text-button remove-button"
                          onClick={() => removeItem(item.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="empty-state compact">
                <Icon name="bag" size={32} />
                <h3>Your quote request is empty</h3>
                <p>
                  Choose seafood from our catalog, or add a custom request
                  below.
                </p>
                <ButtonLink href="/seafood" arrow>
                  Explore seafood
                </ButtonLink>
              </div>
            )}
            <p className="basket-reassurance">
              <Icon name="shield" size={16} />
              <span>
                Bantayan Island direct delivery is <strong>Free</strong> (
                {islandMinKg} kg min) · Mainland Cebu terminal pickup starts
                at {cebuMinKg} kg min.
              </span>
            </p>
          </div>
          <div className="panel custom-item-panel" id="custom-item">
            <h3>Looking for something else?</h3>
            <p>
              Tell us what island seafood you need and we’ll check with local
              fishermen and suppliers.
            </p>
            <form className="custom-item-form" onSubmit={addCustom}>
              <Field id="custom-name" label="Seafood or product name">
                <input
                  id="custom-name"
                  value={customName}
                  maxLength={80}
                  disabled={basketFull}
                  onChange={(event) => setCustomName(event.target.value)}
                  placeholder="e.g. Live lambay, dried pusit…"
                  required
                />
              </Field>
              <Field id="custom-qty" label="Qty (kg)">
                <input
                  id="custom-qty"
                  type="number"
                  min={0.5}
                  max={1000}
                  step={0.5}
                  disabled={basketFull}
                  value={customQuantity}
                  onChange={(event) =>
                    setCustomQuantity(Number(event.target.value))
                  }
                  required
                />
              </Field>
              <Field
                id="custom-notes"
                label="Preferred size or preparation"
                className="span-full"
              >
                <input
                  id="custom-notes"
                  value={customNotes}
                  maxLength={160}
                  disabled={basketFull}
                  onChange={(event) => setCustomNotes(event.target.value)}
                  placeholder="Optional · size, fresh or dried, packing…"
                />
              </Field>
              <button
                type="submit"
                disabled={basketFull}
                className="button button-outline span-full"
              >
                <Icon name="plus" size={17} />
                Add custom item
              </button>
            </form>
            {basketFull && !customError && (
              <p className="small-note">
                Maximum of {MAX_BASKET_ITEMS} items reached. Adding an existing
                item updates its quantity.
              </p>
            )}
            {customError && (
              <p className="form-error" role="alert">
                {customError}
              </p>
            )}
            {customSuccess && (
              <p className="success-text" role="status">
                <Icon name="check" size={16} />
                {customSuccess}
              </p>
            )}
          </div>
          <ButtonLink href="/seafood" variant="text">
            ← Keep exploring seafood
          </ButtonLink>
        </div>

        {step === "details" ? (
          <form className="panel guest-form" onSubmit={requestCode}>
            <span className="eyebrow">NO ACCOUNT NEEDED</span>
            <h2>
              A few details,
              <br />
              then we’ll take it from here.
            </h2>
            <p>Tell us where your island catch is headed.</p>

            <div className="honeypot-field" aria-hidden="true">
              <label htmlFor="contact-fax-ext">Fax ext</label>
              <input
                id="contact-fax-ext"
                name="contact_fax_ext"
                type="text"
                tabIndex={-1}
                autoComplete="new-password"
                data-lpignore="true"
                data-1p-ignore="true"
                value={honeypot}
                onChange={(event) => setHoneypot(event.target.value)}
              />
            </div>

            <Field label="Full name *" id="guest-name">
              <input
                id="guest-name"
                name="name"
                autoComplete="name"
                required
                maxLength={100}
                value={guestName}
                onChange={(event) => setGuestName(event.target.value)}
                placeholder="Your full name"
              />
            </Field>
            <Field
              label="Email address *"
              id="guest-email"
              hint="We’ll send a quick 6-digit verification code and your finalized quotation to this email."
            >
              <input
                id="guest-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                maxLength={150}
                value={guestEmail}
                onChange={(event) => setGuestEmail(event.target.value)}
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
                value={guestPhone}
                onChange={(event) => setGuestPhone(event.target.value)}
                placeholder="09XX XXX XXXX"
              />
            </Field>

            <div className="field">
              <label>Delivery / pickup area *</label>
              <div
                className="zone-toggle"
                role="group"
                aria-label="Delivery area"
              >
                <button
                  type="button"
                  aria-pressed={zone === "island"}
                  className={zone === "island" ? "selected" : ""}
                  onClick={() => {
                    setZone("island");
                    setSubmitError("");
                  }}
                >
                  <strong>Within Bantayan Island</strong>
                  <small>Free direct delivery · {islandMinKg} kg min</small>
                </button>
                <button
                  type="button"
                  aria-pressed={zone === "cebu"}
                  className={zone === "cebu" ? "selected" : ""}
                  onClick={() => {
                    setZone("cebu");
                    setSubmitError("");
                  }}
                >
                  <strong>Mainland Cebu</strong>
                  <small>Terminal / hub pickup · {cebuMinKg} kg min</small>
                </button>
              </div>
            </div>

            {zone === "island" ? (
              <>
                <Field
                  label="Municipality (Mainland Bantayan Island) *"
                  id="island-town"
                  hint="Delivered free from Baod, Bantayan across Bantayan, Santa Fe & Madridejos."
                >
                  <select
                    id="island-town"
                    value={islandTown}
                    onChange={(event) =>
                      setIslandTown(event.target.value as IslandTown)
                    }
                  >
                    {islandTowns.map((town) => (
                      <option key={town} value={town}>
                        {town}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field
                  label="Barangay & landmark *"
                  id="guest-location"
                  hint="Mainland island only (offshore islets are outside online coverage)."
                >
                  <input
                    id="guest-location"
                    required
                    maxLength={160}
                    value={locationDetail}
                    onChange={(event) => setLocationDetail(event.target.value)}
                    placeholder="e.g. Poblacion, near municipal plaza"
                  />
                </Field>
              </>
            ) : (
              <>
                <Field
                  label="Cebu cargo pickup point *"
                  id="cebu-channel"
                  hint="Ceres Bus is recommended for fresh/frozen; trucking (~1 day) is best for dried."
                >
                  <select
                    id="cebu-channel"
                    value={cebuChannel}
                    onChange={(event) =>
                      setCebuChannel(event.target.value as CebuChannel)
                    }
                  >
                    {cebuChannels.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field
                  label="Receiver city or pickup note (optional)"
                  id="guest-location"
                >
                  <input
                    id="guest-location"
                    maxLength={140}
                    value={locationDetail}
                    onChange={(event) => setLocationDetail(event.target.value)}
                    placeholder="e.g. Cebu City · morning Ceres trip preferred"
                  />
                </Field>
              </>
            )}

            <Field
              label="Preferred delivery / pickup date"
              id="guest-date"
              hint="Optional · schedule is confirmed in your quotation."
            >
              <input
                id="guest-date"
                name="date"
                type="date"
                value={guestDate}
                onChange={(event) => setGuestDate(event.target.value)}
              />
            </Field>
            <Field label="Anything else we should know?" id="guest-notes">
              <textarea
                id="guest-notes"
                name="notes"
                rows={3}
                maxLength={1000}
                value={guestNotes}
                onChange={(event) => setGuestNotes(event.target.value)}
                placeholder="Packaging, delivery instructions, or special requests…"
              />
            </Field>

            {items.length > 0 && !minCheck.ok && (
              <p className="form-error" role="alert" style={{ marginTop: 18 }}>
                Minimum order for{" "}
                {zone === "island"
                  ? `Bantayan Island free delivery is ${islandMinKg} kg`
                  : `Mainland Cebu terminal pickup is ${cebuMinKg} kg`}{" "}
                (currently {minCheck.totalKg} kg in your selection). Increase
                quantities on the left to continue.
              </p>
            )}

            <label className="checkbox-label">
              <input
                type="checkbox"
                name="terms_accepted"
                value="1"
                checked={termsAccepted}
                onChange={(event) => setTermsAccepted(event.target.checked)}
                required
              />
              <span>
                I understand prices and availability are confirmed per request,
                and I agree to the{" "}
                <Link
                  href="/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-policy-link"
                >
                  Terms, Delivery / Pickup Rules &amp; Privacy Policy
                </Link>
                .
              </span>
            </label>
            {submitError && (
              <p className="form-error" role="alert">
                {submitError}
              </p>
            )}
            <button
              type="submit"
              className="button button-primary full-width"
              disabled={
                !ready ||
                !items.length ||
                basketOverLimit ||
                !minCheck.ok ||
                sendingCode
              }
            >
              {sendingCode ? "Sending verification code…" : "Send quote request"}
              {!sendingCode && <Icon name="arrow" size={18} />}
            </button>
            <p className="small-note centered">
              <Icon name="shield" size={15} />
              No payment required to request a quote.
            </p>
          </form>
        ) : (
          <form className="panel guest-form" onSubmit={confirmAndSubmit}>
            <span className="eyebrow">VERIFY YOUR EMAIL</span>
            <h2>
              Enter your
              <br />
              6-digit code.
            </h2>
            <p>
              We sent a verification code to{" "}
              <strong>{guestEmail.trim().toLowerCase()}</strong> (valid for 10
              minutes) so we’re sure your quotation reaches you.
            </p>

            <Field
              label="6-digit verification code *"
              id="verification-code"
              hint="Check your inbox or spam folder. Paste or type all 6 digits."
            >
              <input
                id="verification-code"
                className="otp-code-input"
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="[0-9]{6}"
                maxLength={6}
                placeholder="000000"
                value={verificationCode}
                onChange={(event) => {
                  setVerificationCode(
                    event.target.value.replace(/\D/g, "").slice(0, 6),
                  );
                  setSubmitError("");
                }}
                autoFocus
                required
              />
            </Field>

            {items.length > 0 && !minCheck.ok && (
              <p className="form-error" role="alert" style={{ marginTop: 18 }}>
                Minimum order for{" "}
                {zone === "island"
                  ? `Bantayan Island free delivery is ${islandMinKg} kg`
                  : `Mainland Cebu terminal pickup is ${cebuMinKg} kg`}{" "}
                (currently {minCheck.totalKg} kg in your selection). Increase
                quantities on the left to continue.
              </p>
            )}

            {otpNotice && (
              <p className="success-text" role="status" style={{ marginTop: 14 }}>
                <Icon name="check" size={16} />
                {otpNotice}
              </p>
            )}
            {submitError && (
              <p className="form-error" role="alert" style={{ marginTop: 14 }}>
                {submitError}
              </p>
            )}

            <button
              type="submit"
              className="button button-primary full-width"
              style={{ marginTop: 22 }}
              disabled={
                !ready ||
                !items.length ||
                basketOverLimit ||
                !minCheck.ok ||
                verificationCode.length !== 6 ||
                submitting
              }
            >
              {submitting ? "Sending request…" : "Confirm & send quote request"}
              {!submitting && <Icon name="arrow" size={18} />}
            </button>

            <div className="otp-actions">
              <button
                type="button"
                className="text-button"
                disabled={cooldownSeconds > 0 || sendingCode || submitting}
                onClick={resendCode}
              >
                {sendingCode
                  ? "Sending…"
                  : cooldownSeconds > 0
                    ? `Resend code in ${cooldownSeconds}s`
                    : "Resend code"}
              </button>
              <span aria-hidden="true">·</span>
              <button
                type="button"
                className="text-button"
                disabled={submitting}
                onClick={() => {
                  setStep("details");
                  setSubmitError("");
                  setOtpNotice("");
                }}
              >
                Change email / edit details
              </button>
            </div>

            <p className="small-note centered">
              <Icon name="shield" size={15} />
              One-time email check · no account created.
            </p>
          </form>
        )}
      </div>
    </>
  );
}
