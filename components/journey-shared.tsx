import { Icon } from "./ui/icon";

export function JourneySteps({ current }: { current: number }) {
  return (
    <ol className="journey-steps" aria-label="Request progress">
      {["Request", "Quotation", "Payment", "Island to door"].map((step, i) => (
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
