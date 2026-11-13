import Link from "next/link";

export function WaveMark({ size = 42 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M8 20c7 0 8-8 16-8s9 8 16 8M8 28c7 0 8-8 16-8s9 8 16 8M8 36c7 0 8-8 16-8s9 8 16 8"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <circle cx="24" cy="6" r="2.4" fill="currentColor" />
    </svg>
  );
}
export function Brand({ light = false }: { light?: boolean }) {
  return (
    <Link
      href="/"
      className={`brand${light ? " brand-light" : ""}`}
      aria-label="Bantayan Seafoods home"
    >
      <WaveMark />
      <span>
        Bantayan<span className="brand-small">SEAFOODS</span>
      </span>
    </Link>
  );
}
