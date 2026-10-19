import { profile } from "@/lib/data";
import { ogCard, ogContentType, ogSize } from "@/lib/og";

export const alt = `${profile.name} (${profile.cvName}) — ${profile.role}, Dubai`;
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogCard({
    kicker: "Signal through the noise",
    title: profile.name,
    sub: `${profile.role} · BSc (Hons) Cyber Security, First Class Honours`,
    foot: profile.location,
  });
}
