// Adapts lib/data.ts (the single source of truth) into the shapes the 3D
// journey consumes. No copy lives here — edit lib/data.ts to update the site.

import {
  bootSequence,
  caseStudies,
  certifications,
  education,
  experience,
  profile,
  skillGroups,
  skillRadar,
  threatFeed,
} from "@/lib/data";

export { bootSequence, certifications, education, experience, profile };

const bySlug = (slug: string) => {
  const cs = caseStudies.find((c) => c.slug === slug);
  if (!cs) throw new Error(`case study missing: ${slug}`);
  return cs;
};

export const ART = {
  atioc: bySlug("walsec-atioc-hub"),
  pentest: bySlug("pentest-malware"),
  forensics: bySlug("network-forensics"),
};

export const allCases = caseStudies.map((c) => ({
  slug: c.slug,
  title: c.title,
  category: c.category,
}));

// ── Skills vortex nodes — skillGroups fused with radar proficiency ──────────
const radarFor = (title: string) => {
  const map: Record<string, string> = {
    "Threat Intel & SOC": "Threat Intel & SOC",
    "Offensive & Forensics": "Offensive Security",
    "Networking & ICS": "Network Forensics",
    "Software & AI": "Secure Software Dev",
    "Cloud & DevSecOps": "Cloud & DevSecOps",
    Cryptography: "Cryptography",
  };
  return skillRadar.find((r) => r.axis === map[title])?.value ?? 80;
};

export const vortexNodes = skillGroups.map((g, i) => ({
  title: g.title,
  skills: g.skills,
  value: radarFor(g.title),
  hot: i % 2 === 0, // emerald vs electric
}));

// ── Terminal screen script — boot lines then a looping SOC feed ─────────────
export const terminalScript: { text: string; tone: "ok" | "warn" | "crit" | "info" | "dim" }[] = [
  ...bootSequence.map((l) => ({ text: l.text, tone: (l.tone ?? "info") as "ok" | "info" })),
  { text: "$ tshark -i eth0 -Y 'tls.handshake' --color", tone: "dim" },
  { text: "[dpi ] tcp.stream 42 → 185.220.101.42:443 · JA3 mismatch", tone: "warn" },
  { text: "[ioc ] a3f9…svchost.dll tagged · family: pdfka", tone: "crit" },
  { text: "[map ] T1543.003 → persistence/new-service (conf 0.91)", tone: "warn" },
  { text: "[rag ] retrieved 8 chunks · bge-m3 · grounding OK", tone: "info" },
  { text: "[llm ] llama3.2 verdict: MALICIOUS · ttft 2.1s", tone: "ok" },
  { text: "[db  ] evidence committed · sqlite wal · 3,214 w/s", tone: "ok" },
  { text: "[alrt] CRIT rdp lateral 192.168.121.151 → ops-ws", tone: "crit" },
  { text: "[scan] nessus 96 findings · 2 crit · besure-bank", tone: "warn" },
  { text: "[feed] threatfox sync complete · Δ 312 indicators", tone: "info" },
  { text: "[hunt] score(ioc) = conf + recency·0.25 + family", tone: "dim" },
];

// ── Holographic code lines that float off the screen ────────────────────────
export const holoCode = [
  "cap = pyshark.FileCapture('evidence.pcap', display_filter='http')",
  "for pkt in cap: iocs.extend(extract_iocs(pkt))",
  "score = base_conf + recency*0.25 + family_boost",
  "ctx = rag.retrieve(query, k=8, embedder='bge-m3')",
  "resp = ollama.chat('llama3.2', ground(ctx, evidence_only=True))",
  "if not ctx: return 'Insufficient local evidence'",
  "alert(rule='T1543.003', svc='IPRIP', path=user_writable)",
  "df['entropy'] = df.url.map(shannon)",
  "xgb.fit(X_train, y_train)  # macro-F1 0.99",
  "const verdict = useThreatScore(indicator)",
  "socket.emit('telemetry', mitre_map(findings))",
  "nmap -sV --script vuln 192.168.50.130",
];

// ── IOC tags that orbit the cracked cipher lock ──────────────────────────────
export const lockIocs = threatFeed
  .filter((t) => t.sev === "crit")
  .slice(0, 5)
  .map((t) => `${t.type} ${t.value}`);

// ── Forensics constellation (kill chain from the case study) ─────────────────
export const killChain = ART.forensics.killChain!;
export const forensicsNodes = [
  { id: "web", label: "WEB", pos: [-1.1, -0.35, 0.15] as const, hot: false },
  { id: "git", label: "GIT", pos: [-0.25, 0.4, -0.25] as const, hot: false },
  { id: "ops", label: "OPS-WS", pos: [0.65, -0.15, 0.1] as const, hot: false },
  { id: "hmi", label: "HMI", pos: [1.35, 0.55, -0.15] as const, hot: true },
  { id: "vpn", label: "VPN", pos: [0.1, -0.85, -0.3] as const, hot: false },
];
export const forensicsEdges: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [4, 0],
  [4, 1],
];
export const attackPath = [0, 1, 2, 3]; // web → git → ops → hmi
