import { JourneyGate } from "@/experience";
import { FlatSite } from "@/components/FlatSite";
import { WallBackdrop } from "@/components/brand/WallBackdrop";

/**
 * The 2D site stays server-rendered inside the gate (SEO, no-JS, a11y);
 * capable browsers get the cinematic 3D journey layered over it.
 *
 * The scroll-driven WalSec backdrop is homepage-only — /journey renders the
 * same FlatSite without it.
 */
export default function Home() {
  return (
    <JourneyGate>
      <WallBackdrop />
      <FlatSite />
    </JourneyGate>
  );
}
