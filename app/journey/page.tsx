import type { Metadata } from "next";
import { JourneyGate } from "@/experience";
import { FlatSite } from "@/components/FlatSite";

export const metadata: Metadata = {
  title: "3D Journey",
  description:
    "A cinematic 3D descent through the WalSec portfolio — boot the terminal, ride the data stream, decrypt the case files.",
  robots: { index: false, follow: true },
};

/**
 * The opt-in cinematic mode. Same server-rendered content underneath; the
 * gate boots the WebGL journey on top (and falls back to the 2D site if
 * WebGL is unavailable).
 */
export default function JourneyPage() {
  return (
    <JourneyGate defaultMode="3d">
      <FlatSite />
    </JourneyGate>
  );
}
