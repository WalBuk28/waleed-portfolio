import { ImageResponse } from "next/og";

// Link-preview cards (LinkedIn, X, Slack…), rendered at build time with next/og's bundled font.
// Plain on purpose: the site's colours, text already on the site, no new claims. Restyled in Phase 3.

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

export function ogCard({
  kicker,
  title,
  sub,
  foot,
}: {
  kicker: string;
  title: string;
  sub: string;
  foot: string;
}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#0a0f24",
          color: "#ebeef8",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 28, color: "#a0aacb" }}>
          <div style={{ width: 14, height: 14, background: "#2ee6b8" }} />
          {kicker}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: title.length > 40 ? 64 : 80, lineHeight: 1.05, letterSpacing: -1 }}>
            {title}
          </div>
          <div style={{ fontSize: 34, lineHeight: 1.3, color: "#a0aacb", maxWidth: 1000, textWrap: "balance" }}>{sub}</div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(160,170,203,0.25)",
            paddingTop: 28,
            fontSize: 26,
            color: "#a0aacb",
          }}
        >
          <div>{foot}</div>
          <div style={{ color: "#2ee6b8" }}>walsec.com</div>
        </div>
      </div>
    ),
    ogSize
  );
}
