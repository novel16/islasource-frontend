import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "./icon";

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className = "",
  arrow = false,
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "light" | "outline" | "text";
  className?: string;
  arrow?: boolean;
}) {
  return (
    <Link href={href} className={`button button-${variant} ${className}`}>
      {children}
      {arrow && <Icon name="arrow" size={18} />}
    </Link>
  );
}
export function Badge({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <span className={`badge ${className}`}>{children}</span>;
}
export function Eyebrow({
  children,
  light = false,
}: {
  children: ReactNode;
  light?: boolean;
}) {
  return (
    <p className={`eyebrow${light ? " eyebrow-light" : ""}`}>
      <span />
      {children}
    </p>
  );
}
export function Breadcrumb({
  current,
  parent,
}: {
  current: string;
  parent?: { href: string; label: string };
}) {
  return (
    <nav aria-label="Breadcrumb" className="breadcrumb">
      <Link href="/">Home</Link>
      <Icon name="chevron" size={13} />
      {parent && (
        <>
          <Link href={parent.href}>{parent.label}</Link>
          <Icon name="chevron" size={13} />
        </>
      )}
      <span aria-current="page">{current}</span>
    </nav>
  );
}
export function Field({
  label,
  id,
  children,
  hint,
}: {
  label: string;
  id: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {children}
      {hint && <span className="field-hint">{hint}</span>}
    </div>
  );
}
