import { ButtonLink } from "@/components/ui/shared";
import { WaveMark } from "@/components/brand";
export default function NotFound() {
  return (
    <div className="shell empty-state not-found">
      <WaveMark size={60} />
      <span className="eyebrow">A LITTLE OFF COURSE</span>
      <h1>This one drifted out to sea.</h1>
      <p>Let’s get you back to something good.</p>
      <ButtonLink href="/seafood" arrow>
        Explore our seafood
      </ButtonLink>
    </div>
  );
}
