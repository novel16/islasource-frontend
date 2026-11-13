import { ButtonLink } from "./ui/shared";
import { Icon } from "./ui/icon";

export function JourneySteps({ current }: { current: number }) {
  return (
    <ol className="journey-steps" aria-label="Request progress">
      {["Request", "Quotation", "Deposit", "Island to door"].map((step, i) => (
        <li
          key={step}
          className={i < current ? "complete" : i === current ? "current" : ""}
          aria-current={i === current ? "step" : undefined}
        >
          <span>
            {i < current ? <Icon name="check" size={13} /> : `0${i + 1}`}
          </span>
          {step}
        </li>
      ))}
    </ol>
  );
}
export function MissingRequest() {
  return (
    <div className="empty-state">
      <Icon name="search" size={36} />
      <h1>Let’s find your request.</h1>
      <p>This reference isn’t available in this browser’s demo records.</p>
      <ButtonLink href="/track" arrow>
        Go to demo lookup
      </ButtonLink>
    </div>
  );
}
export function LoadingRequest() {
  return (
    <div className="loading-text">Opening your browser-local demo request…</div>
  );
}
