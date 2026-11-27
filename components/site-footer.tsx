import Link from "next/link";
import { Brand } from "./brand";
import { Icon } from "./ui/icon";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell">
        <div className="footer-top">
          <div className="footer-brand">
            <Brand light />
            <p>
              Sourced on request.
              <br />
              Quoted with care.
            </p>
            <span className="footer-location">
              <Icon name="pin" size={15} />
              Bantayan Island, Cebu, Philippines
            </span>
          </div>
          <div>
            <h3>Explore</h3>
            <Link href="/">Home</Link>
            <Link href="/seafood">Our seafood</Link>
            <Link href="/about">About us</Link>
            <Link href="/how-it-works">How it works</Link>
          </div>
          <div>
            <h3>Let’s get started</h3>
            <Link href="/request-quote">Request a quote</Link>
            <Link href="/how-it-works#questions">Common questions</Link>
          </div>
          <div className="footer-note">
            <p>
              A little closer
              <br />
              to the island.
            </p>
            <svg
              width="116"
              height="24"
              viewBox="0 0 116 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M1 12c10-14 18 14 28 0s18 14 28 0 18 14 28 0 18 14 28 0"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © 2026 IslaSource Seafoods. Your connection to the source.
          </span>
          <span>Sourced on request · Quoted before commitment</span>
          <span>Guest quote requests</span>
        </div>
      </div>
    </footer>
  );
}
