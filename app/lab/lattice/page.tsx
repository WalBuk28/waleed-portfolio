import type { Metadata } from "next";
import { LatticeLab } from "@/components/lab/LatticeLab";

// Stage 2 gate (temporary): the lattice shader alone, measured before anything is built on it.
// Not linked, not in the sitemap, deleted at the end of stage 2.
export const metadata: Metadata = {
  title: "Lattice lab",
  robots: { index: false, follow: false },
};

export default function LatticeLabPage() {
  return <LatticeLab />;
}
