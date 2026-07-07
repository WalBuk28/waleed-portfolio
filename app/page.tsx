import { JourneyGate } from "@/experience";
import { FlatSite } from "@/components/FlatSite";

/**
 * The 2D site stays server-rendered inside the gate (SEO, no-JS, a11y);
 * capable browsers get the cinematic 3D journey layered over it.
 */
export default function Home() {
  return (
    <JourneyGate>
      <FlatSite />
    </JourneyGate>
  );
}
