// =============================================================================
//  Portfolio content — extracted & distilled from Waleed's coursework,
//  final-year project (WalSec A-TIOC Hub viva deck), internship CV,
//  ConstructOS/ConTrust blueprint and technical reports.
//  Edit any string here to update the live site. One source of truth.
// =============================================================================

export const profile = {
  name: "Waleed Bukhari",
  fullName: "Syed Muhammad Waleed Bukhari",
  cvName: "Muhammad Waleed",
  role: "SOC Analyst",
  handle: "WalBuk28",
  // Rotating words for the hero headline
  rotatingRoles: [
    "Threat Intelligence",
    "Network Forensics",
    "SOC Automation",
    "Secure Software",
    "Applied AI Defence",
  ],
  tagline:
    "I build the bridge between deep network forensics and intelligent automation — turning raw packets, malware and threat feeds into decisions a SOC can act on.",
  location: "Dubai, United Arab Emirates",
  email: "waleedbukhari2000@gmail.com",
  phone: "+971 50 690 8284",
  linkedin: "https://linkedin.com/in/muhammad-waleed-b43997202",
  github: "https://github.com/WalBuk28",
  site: "https://walsec.com",
  cv: "/Muhammad_Waleed_CV.pdf",
  availability: "Open to SOC Analyst and blue-team roles",
  summary:
    "BSc (Hons) Cyber Security, First Class Honours, from De Montfort University, studied at DMU Dubai. I work on threat intelligence, network forensics and SOC automation, and I write the software to back it up: an offline SIEM-Lite with a local LLM, an ML phishing detector and C++ security tooling. My industry experience is a cyber security internship at Receptive Tech Communications (Lahore, 2025), where I tuned SIEM correlation rules and alert thresholds, ran vulnerability scans and drafted playbooks. I've also completed virtual job simulations (Forage) with Telstra, Mastercard and Deloitte.",
  // Each label says what the value is and how it was counted.
  stats: [
    { value: "First Class", label: "Honours · BSc Cyber Security, DMU, 2026" },
    { value: 10, label: "Case studies · 8 with public repos" },
    { value: 9000, suffix: "+", label: "IOCs ingested from ThreatFox · stored count, Oct 2026" },
    { value: "Offline", label: "AI analysis · local models via Ollama" },
  ] as { value: number | string; suffix?: string; label: string }[],
};

// ── Hero boot sequence (typed terminal) ───────────────────────────────────
export const bootSequence: { text: string; tone?: "ok" | "warn" | "info" }[] = [
  { text: "$ walsec --init --profile operator", tone: "info" },
  { text: "[ok] loading threat-intel feeds ······ ThreatFox · URLhaus · Abuse.ch", tone: "ok" },
  { text: "[ok] mounting forensic engine ········ PyShark / TShark", tone: "ok" },
  { text: "[ok] grounding local LLM ············· Llama 3.2 · RAG · BGE-M3", tone: "ok" },
  { text: "[ok] MITRE ATT&CK mapping ············ 30+ techniques armed", tone: "ok" },
  { text: "operator ready — welcome to the WalSec bench", tone: "info" },
];

// ── Live threat-feed ticker (illustrative IOC stream, cyber flavour) ───────
export const threatFeed: { type: string; value: string; sev: "crit" | "warn" | "ok" }[] = [
  { type: "IPv4", value: "185.220.101.42", sev: "crit" },
  { type: "MITRE", value: "T1566.001 · Spearphishing", sev: "warn" },
  { type: "URL", value: "hxxp://serve[.]html/payload", sev: "crit" },
  { type: "CVE", value: "CVE-2014-3566 · POODLE", sev: "warn" },
  { type: "HASH", value: "a3f9…svchost.dll", sev: "crit" },
  { type: "MITRE", value: "T1543.003 · Windows Service", sev: "warn" },
  { type: "FEED", value: "URLhaus sync · 30m", sev: "ok" },
  { type: "CVE", value: "CVE-2016-0800 · DROWN", sev: "warn" },
  { type: "IPv4", value: "192.168.121.151 · pivot", sev: "crit" },
  { type: "MITRE", value: "T1021.001 · RDP lateral", sev: "warn" },
  { type: "FEED", value: "ThreatFox ingest · OK", sev: "ok" },
];

// ── Skills: no self-ratings. Each group names the case studies that show it. ──
export type SkillGroup = { title: string; icon: string; skills: string[]; evidence: string[] };

export const skillGroups: SkillGroup[] = [
  {
    title: "Threat intel & SOC",
    icon: "Radar",
    evidence: ["walsec-atioc-hub", "incident-response-maturity", "network-forensics"],
    skills: [
      "MITRE ATT&CK (Enterprise + ICS)",
      "SIEM rule tuning",
      "Splunk",
      "Wazuh / EDR",
      "Log analysis",
      "Incident response (NIST SP 800-61)",
      "Threat feeds — ThreatFox · URLhaus",
    ],
  },
  {
    title: "Offensive & forensics",
    icon: "Bug",
    evidence: ["pentest-malware", "network-forensics"],
    skills: [
      "Penetration Testing (black-box)",
      "Nessus / Nmap / Metasploit",
      "Burp Suite",
      "Malware Analysis (static + dynamic)",
      "Reverse Engineering — IDA · GDB · REMnux",
      "Wireshark / TShark / PyShark",
      "testssl.sh / OpenSSL",
    ],
  },
  {
    title: "Networking & ICS",
    icon: "Network",
    evidence: ["network-forensics"],
    skills: [
      "Packet Analysis & DPI",
      "VLAN / NAT / Static Routing",
      "Firewall Rules & Segmentation",
      "Cisco Packet Tracer",
      "SCADA / OT Security",
      "CARVER Risk Assessment",
    ],
  },
  {
    title: "Software & AI",
    icon: "Code2",
    evidence: ["walsec-atioc-hub", "ai-phishing-detection", "secure-password-manager", "contrust-os"],
    skills: [
      "Python — Flask · PyShark · scikit-learn",
      "C++",
      "React / Next.js",
      "Local LLMs — Ollama · Qwen · DeepSeek",
      "RAG + BGE-M3 embeddings",
      "ML — XGBoost · Random Forest · MLP",
      "SQL / SQLite",
    ],
  },
  {
    title: "Secure development",
    icon: "ShieldCheck",
    evidence: ["secure-scripting", "secure-password-manager", "software-development"],
    skills: [
      "OWASP Top 10 self-testing",
      "RBAC · CSRF tokens · CSP",
      "JWT · bcrypt · PBKDF2",
      "Parameterised SQL",
      "Unit tests — unittest · CTest",
      "UK GDPR analysis",
    ],
  },
  {
    title: "Cryptography",
    icon: "KeyRound",
    evidence: ["cryptography", "secure-password-manager", "pentest-malware"],
    skills: [
      "AES-256-GCM · HMAC-SHA256",
      "RSA and cryptanalysis",
      "Key-exchange protocols",
      "Symmetric and public-key crypto",
      "TLS / SSL configuration analysis",
    ],
  },
];

// ── Case studies ──────────────────────────────────────────────────────────
export type Metric = { label: string; value: string; sub?: string };
export type DetailSection = { heading: string; body: string; bullets?: string[] };
export type FlowNode = { id: string; label: string; kind?: "in" | "core" | "ai" | "out" };
export type KillStage = { stage: string; label: string; detail: string; technique: string };

export type CaseStudy = {
  slug: string;
  title: string;
  tagline: string;
  category: string;
  year: string;
  accent: "emerald" | "electric";
  icon: string;
  featured?: boolean;
  summary: string;
  context: string;
  problem: string;
  approach: string;
  stack: string[];
  metrics: Metric[];
  sections: DetailSection[];
  outcome: string;
  tools: string[];
  tags: string[];
  repo?: string;
  repoNote?: string; // shown when there is no public repo
  demo?: string;
  // optional visualisations
  architecture?: { title: string; nodes: FlowNode[] };
  killChain?: KillStage[];
};

export const caseStudies: CaseStudy[] = [
  // ---------------------------------------------------------------------------
  {
    slug: "walsec-atioc-hub",
    title: "WalSec A-TIOC Hub",
    tagline: "A privacy-first SIEM-Lite that fuses network forensics with local LLMs",
    category: "Final-year project (CTEC3451D) · SOC platform",
    year: "2025–26",
    accent: "emerald",
    icon: "ShieldCheck",
    featured: true,
    repoNote: "Private repository · demo on request",
    summary:
      "An air-gapped SIEM-Lite for small organisations: it automates deep packet inspection, pulls live threat intelligence, and grounds a local LLM in that evidence, so no telemetry leaves the building.",
    context:
      "WalSec A-TIOC Hub was my BSc final-year development project (CTEC3451D). It was faculty-commended and formally recommended for publication. It is a self-hosted “SIEM-Lite” that joins automated network forensics to locally hosted language models, so a small Security Operations Centre can triage threats with AI that never leaves its own perimeter.",
    problem:
      "Analysts face thousands of alerts a day, most of them noise. Enterprise SIEMs cost more than small organisations can pay, and sending packet captures to a cloud AI service (OpenAI, for example) can expose personal data and break GDPR and data-sovereignty rules. The challenge: grounded, automated threat analysis that runs entirely on-premise.",
    approach:
      "I built a decoupled architecture: a React 18 + Vite single-page app over a Flask 3.0 API on Eventlet, with CPU-heavy PyShark dissection moved into Python multiprocessing pools. A RAG pipeline (BGE-M3 embeddings, local Qwen and DeepSeek models served by Ollama) grounds every answer in evidence from a SQLite store in WAL mode, and the AI analyst maps that evidence to MITRE ATT&CK techniques through prompts backed by technique and mapping tables in the same database.",
    stack: [
      "React 18 + Vite",
      "Flask 3.0 (Eventlet)",
      "Python multiprocessing",
      "PyShark / TShark",
      "Ollama · Qwen · DeepSeek",
      "RAG · BGE-M3",
      "SQLite (WAL)",
      "WebSockets",
      "Leaflet",
      "JWT + bcrypt RBAC",
      "Docker Compose",
    ],
    metrics: [
      { value: "9,000+", label: "IOCs ingested", sub: "from the ThreatFox API · stored count, Oct 2026" },
      { value: "50 MB", label: "PCAP upload cap", sub: "enforced in code with file.seek, tested" },
      { value: "Refused", label: "Out-of-evidence query", sub: "test TC-AI-02: non-existent domain → “Not Found”" },
      { value: "Offline", label: "AI inference", sub: "Qwen · DeepSeek via Ollama, no cloud API" },
    ],
    architecture: {
      title: "Decoupled, fully-local pipeline",
      nodes: [
        { id: "osint", label: "OSINT Feeds\nThreatFox · URLhaus", kind: "in" },
        { id: "pcap", label: "PCAP Upload\n≤ 50MB DPI", kind: "in" },
        { id: "flask", label: "Flask 3.0 API\nEventlet + multiprocessing", kind: "core" },
        { id: "db", label: "SQLite (WAL)\nACID evidence store", kind: "core" },
        { id: "rag", label: "RAG · BGE-M3\nQwen · DeepSeek (Ollama)", kind: "ai" },
        { id: "ui", label: "React SPA\nWebSocket telemetry", kind: "out" },
      ],
    },
    sections: [
      {
        heading: "Automated forensic ingestion",
        body: "The system replaces manual TShark triage. Asynchronous deep packet inspection parses uploaded PCAPs (capped at 50 MB by checking the file size with file.seek before parsing, to protect the event loop), while APScheduler workers pull fresh indicators from ThreatFox and URLhaus every 30–60 minutes. The local store held over 9,000 ThreatFox IOCs in October 2026.",
        bullets: [
          "Normalisation pipeline strips port metadata for uniform IP vectors",
          "Database-level deduplication via composite (Type + Value) keys",
          "Scheduled pulls from the abuse.ch ThreatFox and URLhaus APIs",
        ],
      },
      {
        heading: "Grounded AI, not generative guesswork",
        body: "A language model with no evidence will invent threat intelligence. Strict prompt boundaries make the answer depend on what the SQL lookups return: with no local evidence, the model replies “Insufficient local evidence” (or “Not Found”) instead of making something up. The test matrix records this case: TC-AI-02 asked about a domain that doesn't exist, and the model refused to extrapolate. That is one recorded test, not a measured rate.",
      },
      {
        heading: "Dynamic threat scoring",
        body: "Each indicator gets a score out of 100 so analysts see the most critical first: Score = min(100, Base + Recency + MalwareBoost + TagsBoost). Recency adds 20 points for indicators up to a day old, falling to 5 at 30 days; a known malware family adds 15.",
      },
      {
        heading: "Engineered for robustness",
        body: "Under Eventlet's cooperative multitasking, heavy PyShark work blocked the scheduler: APScheduler logged the ThreatFox ingestion job missing its slot by 14 minutes 30 seconds. I moved the dissection engine into separate multiprocessing pools so the event loop keeps running. Exception handling keeps ingestion alive when an external feed is unreachable (the logs record a URLhaus outage that the app survived).",
      },
      {
        heading: "Limitations",
        body: "The out-of-evidence behaviour is shown by one recorded test, not a measured rate. No latency figure is given: the earlier one was measured on Llama 3.2 on unrecorded hardware, and the platform now runs Qwen and DeepSeek. Setup is not zero-configuration: it needs a Linux host with Docker and Ollama, the models pulled in advance, and dependencies installed offline.",
      },
    ],
    outcome:
      "A working SIEM-Lite for small, resource-constrained teams that runs entirely on local hardware, from raw TShark packet inspection to ATT&CK-mapped reports written by a local model. Faculty-commended and recommended for publication. Roadmap: Redis-backed rate limiting, agentic RAG (AI-instructed re-scans of historical PCAPs) and scaling inference across more hardware.",
    tools: ["React", "Flask", "PyShark", "Ollama", "SQLite", "Docker", "Leaflet"],
    tags: ["SOC Automation", "LLM / RAG", "Network Forensics", "Full-Stack"],
  },

  // ---------------------------------------------------------------------------
  {
    slug: "pentest-malware",
    title: "Penetration Testing & Malware Investigations",
    tagline: "Black-box pentest + multi-sample malware reverse engineering",
    category: "Offensive Security · Reverse Engineering",
    year: "2025–26",
    accent: "electric",
    icon: "Bug",
    featured: true,
    summary:
      "A full black-box penetration test of a legacy banking application (96 findings) paired with an advanced forensic investigation of a weaponised-PDF → service-DLL → downloader malware cluster, mapped end-to-end to MITRE ATT&CK.",
    context:
      "Two complementary engagements: a black-box penetration test against a simulated legacy banking host (“Besure Bank”, 192.168.50.130), and an advanced forensic investigation reverse-engineering four malicious artefacts plus a stack-overflow binary.",
    problem:
      "Legacy, end-of-life infrastructure quietly accumulates exploitable risk. The brief: enumerate and validate every weakness on an externally-facing host with no prior knowledge, then — separately — triage a high-confidence malware cluster, prove its persistence and capabilities, and produce actionable detection engineering.",
    approach:
      "For the pentest I ran a staged, throttled methodology — Nmap recon, Nessus Essentials vuln scanning, testssl.sh/OpenSSL crypto analysis, and Metasploit exploitation attempts — validating tool output manually. For the malware work I combined static analysis (PDFiD, peepdf, PDFStreamDumper, PE tooling, IDA Pro) with dynamic detonation (ProcMon, Process Explorer, ApateDNS) and debugger-led reverse engineering (GDB/REMnux).",
    stack: [
      "Kali Linux",
      "Nmap",
      "Nessus Essentials",
      "Metasploit",
      "testssl.sh / OpenSSL",
      "IDA Pro",
      "GDB / REMnux",
      "ProcMon / Process Explorer",
      "PDFiD / peepdf",
    ],
    metrics: [
      { value: "96", label: "Vulnerabilities found", sub: "2 critical · 15 high · 26 medium" },
      { value: "4", label: "Malware samples analysed", sub: "PDF · DLL · EXE · C binary" },
      { value: "5+", label: "MITRE ATT&CK techniques", sub: "mapped from evidence" },
      { value: "5", label: "Notable CVEs referenced", sub: "POODLE, DROWN, RCE" },
    ],
    sections: [
      {
        heading: "Penetration test — Besure Bank",
        body: "Nmap revealed an outdated stack: OpenSSH 3.1p1 (SSHv1 enabled), Apache 2.0.40 and PHP 4.2.2 — all end-of-life. Nessus surfaced 96 findings across the host.",
        bullets: [
          "Critical: SSLv2/SSLv3 enabled → POODLE (CVE-2014-3566) & DROWN (CVE-2016-0800)",
          "Critical: PHP 4.2.2 — numerous public RCE / memory-corruption exploits",
          "Weak ciphers (RC4, EXPORT, 3DES/SWEET32), TLS 1.0, expired self-signed cert (2007)",
          "HTTP TRACE enabled (XST), exposed phpinfo.php, inconsistent login errors → enumeration",
          "Delivered tactical + strategic remediation and a patch-management lifecycle",
        ],
      },
      {
        heading: "Malware — weaponised PDF (sus-file1)",
        body: "PDFiD flagged embedded /JS, /AA additional-actions and an /EmbeddedFile. PDFStreamDumper exposed obfuscated XFA JavaScript using slice/concat evasion, with a deceptively-named nested document — a classic phishing initial-access vector. VirusTotal consensus aligned with the Exploit.PDF-JS / pdfka family.",
      },
      {
        heading: "Malware — persistence service DLL (sus-file3)",
        body: "A PE32 service DLL exporting Install/ServiceMain/UninstallService. Imports (OpenSCManagerA, CreateServiceA) and strings revealed svchost/netsvcs persistence, masquerading as “Intranet Network Awareness (INA+)” under service name IPRIP. Dynamic analysis confirmed the DLL loading inside svchost.exe; C2 strings pointed at practicalmalwareanalysis.com/serve.html.",
      },
      {
        heading: "Downloader + stack overflow (sus-file4 / sus-file6)",
        body: "IDA disassembly of the downloader showed the canonical URLDownloadToFileA → WinExec → ExitProcess pattern, with an XOR-0xFF string-decode loop. The advanced task verified a stack-based buffer overflow in check_authentication() — a watchpoint on the auth flag flipped 0 → non-zero after an unbounded strcpy into a 16-byte buffer, proving control-flow influence in GDB.",
      },
      {
        heading: "MITRE ATT&CK & detection engineering",
        body: "Evidence mapped to T1566.001 (Spearphishing Attachment), T1204 (User Execution), T1218.011 (Rundll32), T1543.003 (Windows Service) and T1112 (Modify Registry). I delivered low-noise/high-signal detections: alert on CreateServiceA where ServiceDll points to a user-writable path, and on rundll32 executing DLLs from user directories.",
      },
    ],
    outcome:
      "Two production-grade reports with full IOC tables (file hashes, host- and network-based indicators), prioritised remediation and implementable detection logic — demonstrating the offensive-to-defensive loop end to end.",
    tools: ["Kali", "Nessus", "Metasploit", "IDA Pro", "GDB", "REMnux", "Wireshark"],
    tags: ["Penetration Testing", "Malware Analysis", "Reverse Engineering", "MITRE ATT&CK"],
    repo: "https://github.com/WalBuk28/penetration-testing-malware-analysis",
  },

  // ---------------------------------------------------------------------------
  {
    slug: "network-forensics",
    title: "Network Forensics & ICS Security",
    tagline: "Reconstructing a multi-stage SCADA attack from packets",
    category: "Digital Forensics · OT/ICS",
    year: "2025",
    accent: "emerald",
    icon: "Network",
    featured: true,
    summary:
      "A Wireshark-driven forensic reconstruction of a four-stage attack that pivoted from a public web server into a water-treatment OT network, scored with a CARVER matrix and mapped to MITRE ATT&CK for Enterprise and ICS — backed by hands-on Cisco Packet Tracer network design.",
    context:
      "A Cyber-Physical Systems Security investigation into a multi-stage intrusion at “CTI Utilities”, a water-treatment operator, combined with enterprise network-design work in Cisco Packet Tracer (VLAN/NAT/static routing) that demonstrates the segmentation the victim lacked.",
    problem:
      "An external attacker defaced a safety-critical HMI by stepping-stone from a low-value public asset into a secure OT network. The investigation had to answer the brief’s forensic questions from packet evidence alone, quantify asset risk, and recommend controls that would have broken the kill chain.",
    approach:
      "I scored 17 assets with a CARVER matrix to prioritise defence, modelled three attack pathways as an attack tree (selecting the direct VPN route as optimal), then reconstructed the actual intrusion packet-by-packet in Wireshark — correlating timestamps, IPs, ports and HTTP streams into interim forensic memos and a final incident report.",
    stack: [
      "Wireshark",
      "CARVER Matrix",
      "MITRE ATT&CK (Enterprise + ICS)",
      "ATT&CK Navigator",
      "Cisco Packet Tracer",
      "Attack-Tree Modelling",
    ],
    metrics: [
      { value: "4", label: "Kill-chain stages reconstructed", sub: "IT → pivot → OT → ICS" },
      { value: "17", label: "Assets CARVER-scored", sub: "VPN server highest at 52" },
      { value: "9", label: "ATT&CK techniques mapped", sub: "Enterprise + ICS matrices" },
      { value: "3", label: "Coordinated attacker IPs", sub: "distributed port scan" },
    ],
    killChain: [
      {
        stage: "01",
        label: "Reconnaissance",
        detail: "Distributed scan from 3 IPs against the Web Server (192.168.121.151) — ports 22 / 80 / 443.",
        technique: "T1595 · Active Scanning",
      },
      {
        stage: "02",
        label: "Initial Access",
        detail: "Brute force on /wp-login.php → WordPress admin compromise on the public web server.",
        technique: "T1190 · Exploit Public-Facing App",
      },
      {
        stage: "03",
        label: "Pivot / Lateral",
        detail: "Web Server → GIT Server (dual IT/OT firewall access) → RDP (3389) into the Operations WS.",
        technique: "T1021.001 · Remote Desktop",
      },
      {
        stage: "04",
        label: "ICS Impact",
        detail: "Stolen JSESSIONID cookie → malicious upload (anonymous.gif) defacing the ScadaBR HMI.",
        technique: "T0880 · Manipulation of View",
      },
    ],
    sections: [
      {
        heading: "Risk-based prioritisation (CARVER)",
        body: "The CARVER matrix ranked the VPN Server (52) and the LIMS lab (49) as the most attractive targets — both running end-of-life Ubuntu — surfacing the systemic problem of unsupported software across critical assets.",
      },
      {
        heading: "Findings & recommendations",
        body: "Three root-cause findings drove a prioritised remediation plan.",
        bullets: [
          "Insufficient network segmentation (CRITICAL) — strict IT/OT firewall rules",
          "Weak access control — enforce MFA on all remote / RDP access",
          "Legacy / EOL systems — emergency patch-management programme",
          "Hard HMI session timeouts to neutralise stolen-cookie hijacking",
        ],
      },
      {
        heading: "MITRE ATT&CK mapping",
        body: "Behaviours were mapped across both matrices: Enterprise (T1595 Active Scanning, T1190 Exploit Public-Facing App, T1110.001 Brute Force, T1021.001 RDP, T1552.001 Credentials in Files) and ICS (T0862 Exploitation of Remote Services, T0880 Manipulation of View) and visualised in ATT&CK Navigator.",
      },
      {
        heading: "Secure-by-design networking",
        body: "Complementary Cisco Packet Tracer work built high-availability corporate topologies using VLAN segmentation, NAT and static routing — the exact controls whose absence enabled the CTI Utilities breach, and passing 100% of simulation tests.",
      },
    ],
    outcome:
      "A complete incident report aligned to NIST SP 800-82 / 800-61, with forensic memos, an attack tree, CARVER scoring and dual-matrix ATT&CK mapping — translating raw packets into board-level business risk and concrete controls.",
    tools: ["Wireshark", "Cisco Packet Tracer", "ATT&CK Navigator"],
    tags: ["Network Forensics", "ICS / SCADA", "Incident Response", "MITRE ATT&CK"],
    repo: "https://github.com/WalBuk28/network-forensics-ics",
  },

  // ---------------------------------------------------------------------------
  {
    slug: "incident-response-maturity",
    title: "Incident Response Maturity & Threat Intel",
    tagline: "A SIM3 maturity assessment and STIX threat-intel structuring for a logistics SME",
    category: "Incident Response · Threat Intelligence",
    year: "2025–26",
    accent: "electric",
    icon: "ShieldAlert",
    summary:
      "A SIM3 v2 incident-response maturity assessment of a mid-sized logistics company — 45 controls scored across four domains and benchmarked against ENISA Basic — paired with STIX 2.1 structuring of a live warehouse intrusion and a NIST SP 800-61 lifecycle response.",
    context:
      "An Incident Response & Cyber Threat Intelligence engagement (CSEC2002D) for “Winderby Logistics Group”, a realistic “digitally sideways” SME running a mixed IT/OT estate with a part-time analyst and an office-hours-only MSSP. The brief: measure how ready they actually are to handle an incident, and turn a live intrusion into shareable intelligence.",
    problem:
      "Incident-response capability that grows ad hoc is invisible until it fails. WLG had no formal IR mandate, no service description and almost no repeatable process — but no way to see or prioritise that. The work had to quantify maturity against a recognised baseline and convert a messy intrusion into structured, actionable threat intelligence.",
    approach:
      "I scored all 45 SIM3 v2 parameters (Organisation, Human, Tools, Process) on maturity of existence, documentation and enforcement, benchmarked each against the ENISA Basic target, and built a prioritised remediation roadmap. Separately I structured a warehouse-automation intrusion into STIX 2.1 objects and ran it through the NIST SP 800-61 lifecycle.",
    stack: [
      "SIM3 v2 (Open CSIRT Foundation)",
      "ENISA Basic Maturity",
      "STIX 2.1",
      "MITRE ATT&CK (Enterprise + ICS)",
      "NIST SP 800-61",
      "TAXII / threat-intel sharing",
    ],
    metrics: [
      { value: "45", label: "SIM3 controls assessed", sub: "Org · Human · Tools · Process" },
      { value: "8/45", label: "At or above ENISA Basic", sub: "37 gaps identified" },
      { value: "16/17", label: "Process controls below target", sub: "weakest domain" },
      { value: "STIX 2.1", label: "Intrusion structured", sub: "shareable IOCs" },
    ],
    sections: [
      {
        heading: "SIM3 maturity assessment",
        body: "Each parameter was scored 0 (non-existent) to 4 (optimising) and compared to ENISA Basic, so every result reads as a gap to a recognised standard rather than an abstract number.",
        bullets: [
          "Organisation: no formal IR mandate (O-1), authority “devolves to whoever is available” (O-3), only an informal service description (O-5)",
          "Process is the weakest domain — 16 of 17 parameters below ENISA Basic",
          "Tools are the relative bright spot (resilient comms/internet already exist for logistics)",
        ],
      },
      {
        heading: "Root cause & prioritised roadmap",
        body: "The organisation-layer gaps are the systemic cause: without a mandate, authority or service description, investment in people, tools and process leaks away. The roadmap sequences the lowest-cost, highest-impact fixes first — a board-approved IR charter, service/SLA definitions, then core detection and resolution playbooks.",
      },
      {
        heading: "Threat intelligence — STIX 2.1 + NIST 800-61",
        body: "A warehouse-automation intrusion (rogue scheduled task by a look-alike service account, C2 to Eastern-European infrastructure, USB exfiltration, telematics brute force) was mapped to STIX 2.1 objects and MITRE ATT&CK for Enterprise and ICS, then walked through the NIST SP 800-61 lifecycle — showing that preparation and detection, not heroics during containment, decide the outcome.",
      },
    ],
    outcome:
      "A defensible, standards-based picture of an SME’s incident-response readiness with a costed roadmap to ENISA Basic, plus a worked example of turning a live intrusion into structured, shareable threat intelligence aligned to NIST SP 800-61.",
    tools: ["SIM3", "ENISA", "STIX 2.1", "MITRE ATT&CK", "NIST SP 800-61"],
    tags: ["Incident Response", "Threat Intelligence", "SIM3 / ENISA", "STIX"],
    repo: "https://github.com/WalBuk28/incident-response-maturity-wlg",
  },

  // ---------------------------------------------------------------------------
  {
    slug: "ai-phishing-detection",
    title: "AI-Driven Phishing Detection",
    tagline: "Adversarially-tested ML over 235k URLs for SOC automation",
    category: "Machine Learning · SOC Automation",
    year: "2025",
    accent: "electric",
    icon: "BrainCircuit",
    summary:
      "A machine-learning pipeline that classifies phishing URLs at up to 99.97% accuracy across the 235k-sample PhiUSIIL dataset — then stress-tests that accuracy against obfuscation and data-poisoning to expose the gap between lab metrics and real-world defence.",
    context:
      "An AI-for-Cybersecurity project building and critically evaluating supervised models for phishing-URL classification on the PhiUSIIL Phishing URL dataset — with a deliberate focus on adversarial robustness rather than headline accuracy.",
    problem:
      "Phishing remains a dominant initial-access vector (MITRE T1566.002). Signature lists can’t keep pace, and models that score 99%+ on clean test data can collapse under obfuscation. The question: which model families generalise, and how brittle are they when attackers fight back?",
    approach:
      "I engineered lexical and host-based URL features, then trained and compared bagging (Random Forest), boosting (XGBoost, LightGBM, CatBoost) and a neural network (MLP). Crucially, I designed experiments to measure how feature obfuscation and poisoned training samples shift the decision boundary — moving the analysis beyond simple classification accuracy.",
    stack: [
      "Python",
      "scikit-learn",
      "XGBoost / LightGBM / CatBoost",
      "MLP Neural Network",
      "pandas / NumPy",
      "Matplotlib",
    ],
    metrics: [
      { value: "99.97%", label: "Peak accuracy", sub: "MLP on clean data" },
      { value: ">0.99", label: "Macro F1 (all models)", sub: "on untouched data" },
      { value: "235,795", label: "URLs in dataset", sub: "PhiUSIIL (43% phishing)" },
      { value: "5", label: "Model families compared", sub: "bagging · boosting · NN" },
    ],
    sections: [
      {
        heading: "Feature engineering",
        body: "Strong discriminators emerged from URL structure: legitimate business URLs trend short (SEO-driven), while phishing URLs show high length variance, random tokens and disposable-infrastructure signals such as IsHTTPS=0.",
      },
      {
        heading: "Model comparison",
        body: "All five families exceeded a macro-F1 of 0.99 on clean data, with the MLP reaching 99.97% accuracy. Tree ensembles offered the best stability / efficiency trade-off for real-time deployment.",
      },
      {
        heading: "Adversarial reality check",
        body: "Obfuscation techniques pushed macro-F1 below the headline figures — demonstrating that clean-data accuracy is deceptive for deployed defences, and that a production threshold must account for class imbalance (phishing is <1% of real traffic) and false-positive cost.",
      },
    ],
    outcome:
      "A rigorous, deployment-aware evaluation that treats ML as a security control — not a leaderboard — and ties detection back to the MITRE ATT&CK phishing technique and a CIA-triad impact analysis.",
    tools: ["Python", "scikit-learn", "XGBoost", "Jupyter"],
    tags: ["Machine Learning", "SOC Automation", "Phishing", "Adversarial ML"],
    repo: "https://github.com/WalBuk28/ai-phishing-detection",
  },

  // ---------------------------------------------------------------------------
  {
    slug: "cryptography",
    title: "Cryptography & Encryption",
    tagline: "Cipher design, RSA cryptanalysis and protocol attack simulation",
    category: "Applied Cryptography",
    year: "2025",
    accent: "emerald",
    icon: "KeyRound",
    summary:
      "Industrial-cryptography work spanning a custom modified-Affine cipher, a ciphertext-only RSA common-modulus attack, and replay / impersonation attacks against Needham-Schroeder and Diffie-Hellman variants — each with a mathematical justification and concrete mitigations.",
    context:
      "A combined Industrial Cryptography coursework covering both construction and cryptanalysis — designing a working cipher, then breaking real protocol weaknesses with the underlying number theory.",
    problem:
      "Cryptographic security depends on more than strong primitives — parameter choices, key management and protocol freshness decide whether a system actually holds. The brief required demonstrating both how schemes work and exactly how they fail.",
    approach:
      "I implemented a modified Affine cipher over a 30-character domain, then mounted a ciphertext-only common-modulus RSA attack using the Extended Euclidean Algorithm, and finally simulated replay and impersonation attacks step-by-step against symmetric key-exchange protocols.",
    stack: [
      "Modular Arithmetic",
      "Extended Euclidean Algorithm",
      "RSA",
      "Needham-Schroeder",
      "Diffie-Hellman",
      "AES",
    ],
    metrics: [
      { value: "30", label: "Char cipher domain", sub: "A–Z + symbols, k₀=7" },
      { value: "4", label: "Schemes analysed", sub: "Affine · RSA · NS · DH" },
      { value: "0", label: "Keys needed for RSA break", sub: "ciphertext-only attack" },
    ],
    sections: [
      {
        heading: "Modified Affine cipher",
        body: "A 30-symbol alphabet (A–Z plus +, −, *, /) with f(x) = (7x + 4) mod 30. k₀ = 7 is coprime to 30 (gcd = 1) ensuring bijectivity; the modular inverse 13 (7·13 ≡ 1 mod 30) drives decryption — a clean illustration of modular arithmetic expanding the keyspace.",
      },
      {
        heading: "RSA common-modulus attack",
        body: "When two users share a modulus N with coprime public exponents, an interceptor can recover plaintext with no private key: solve s·eA + t·eB = 1 via the Extended Euclidean Algorithm, then compute m = CA^s · CB^t mod N. A potent reminder that key generation and parameter separation matter as much as the maths.",
      },
      {
        heading: "Protocol attacks & mitigations",
        body: "I demonstrated a Needham-Schroeder replay (an exposed old session key Kab accepted as fresh because B never verifies freshness) and a Diffie-Hellman-variant impersonation under key compromise.",
        bullets: [
          "Needham-Schroeder: add timestamps / B-originated nonce challenges",
          "DH variant: enforce mutual authentication, key rotation and ephemeral DH for forward secrecy",
        ],
      },
    ],
    outcome:
      "A coursework demonstrating end-to-end cryptographic literacy — from hand-built ciphers to protocol cryptanalysis — with each weakness paired to a defensible mitigation grounded in academic sources.",
    tools: ["Python", "Number Theory", "OpenSSL"],
    tags: ["Cryptography", "Cryptanalysis", "RSA", "Protocols"],
    repo: "https://github.com/WalBuk28/industrial-cryptography",
  },

  // ---------------------------------------------------------------------------
  {
    slug: "secure-scripting",
    title: "FreightDesk — Secure Business Application",
    tagline: "A hardened Flask logistics portal with live FX, RBAC and a full security self-assessment",
    category: "Secure Software · Web App",
    year: "2025–26",
    accent: "emerald",
    icon: "Boxes",
    summary:
      "A database-backed logistics management web app built the way a security engineer would: parameterised SQL, role-based access control, per-session CSRF tokens, hardened headers, and a live remote FX web service — shipped with 17 automated tests and an OWASP-mapped self-penetration-test.",
    context:
      "Built for the Secure Scripting & Business Applications brief (CSEC2001D). Staff sign in against role-based permissions, manage freight shipments in a normalised SQLite database, and see each shipment’s declared value converted to a base currency using exchange rates pulled live over HTTPS from a remote web service.",
    problem:
      "The brief’s real test isn’t “can you build a CRUD app” — it’s “can you build one that withstands the common business-application attacks”: SQL injection, broken access control, CSRF, session hijacking and unsafe outbound requests. The emphasis is as much on how it’s secured as on what it does.",
    approach:
      "A Flask application factory wires configuration, the database, a remote FX client, authentication, central CSRF enforcement and security headers. Every query is parameterised; passwords are PBKDF2-hashed; access control is enforced server-side with role decorators; and the outbound FX call is HTTPS-only with a timeout, defensive parsing and an offline fallback.",
    stack: [
      "Python · Flask 3",
      "SQLite (parameterised SQL)",
      "Werkzeug PBKDF2 auth",
      "Role-Based Access Control",
      "CSRF tokens · CSP · security headers",
      "Remote FX web service (requests)",
      "unittest (17 tests)",
    ],
    metrics: [
      { value: "17", label: "Automated tests", sub: "auth · RBAC · CSRF · SQLi · FX" },
      { value: "10/10", label: "OWASP Top 10 addressed", sub: "each with a mitigation" },
      { value: "3", label: "RBAC roles", sub: "viewer · clerk · admin" },
      { value: "0", label: "String-built SQL", sub: "fully parameterised" },
    ],
    architecture: {
      title: "Secure request pipeline",
      nodes: [
        { id: "user", label: "Browser\nsession + CSRF", kind: "in" },
        { id: "flask", label: "Flask app\nRBAC · validation", kind: "core" },
        { id: "db", label: "SQLite\nparameterised SQL", kind: "core" },
        { id: "fx", label: "Remote FX API\nHTTPS · cached · fallback", kind: "ai" },
        { id: "audit", label: "Audit log\nappend-only", kind: "out" },
      ],
    },
    sections: [
      {
        heading: "Security-by-design controls",
        body: "Each control is deliberately hand-rolled so the mechanism is visible and auditable, and each is backed by a test.",
        bullets: [
          "Injection: parameterised queries everywhere; allow-list input validation",
          "Access control: server-side role decorators (viewer < clerk < admin), never UI-only",
          "CSRF: per-session token enforced centrally for every state-changing request",
          "Session: PBKDF2 hashes, HttpOnly + SameSite cookies, session rotation on login",
          "Headers: strict CSP, X-Frame-Options DENY, nosniff, Referrer-Policy",
        ],
      },
      {
        heading: "Remote web service integration",
        body: "Shipment values in mixed currencies are converted using live rates from a public FX API — fetched over HTTPS with a short timeout, parsed defensively, cached with a TTL, and gracefully degraded to bundled fallback rates if the service is unreachable. The endpoint is fixed in config, not user-controlled, to resist SSRF.",
      },
      {
        heading: "Self-penetration test (OWASP)",
        body: "I attacked my own app and documented it: SQL-injection auth-bypass and table-drop payloads (blocked by parameterisation), forced-browsing privilege escalation (403 server-side), CSRF replay (400), reflected-XSS (Jinja autoescape + CSP) and clickjacking (frame-ancestors none) — every finding mapped to the OWASP Top 10 with the mitigation and a test.",
      },
    ],
    outcome:
      "A production-shaped business application that treats security as a first-class requirement — with a written OWASP self-assessment, a data-protection (UK GDPR) analysis and a green test suite — demonstrating secure development end to end, not just a working feature set.",
    tools: ["Python", "Flask", "SQLite", "requests"],
    tags: ["Secure Coding", "Web App", "OWASP", "RBAC"],
    repo: "https://github.com/WalBuk28/freightdesk",
  },

  // ---------------------------------------------------------------------------
  {
    slug: "secure-password-manager",
    title: "Secure Password Manager (C++)",
    tagline: "An AES-256-GCM credential vault in modern C++ built on real OpenSSL crypto",
    category: "Secure Coding · Systems C++",
    year: "2025–26",
    accent: "electric",
    icon: "Lock",
    summary:
      "A command-line password manager in modern C++17 that stores credentials in a single vault file encrypted and authenticated with AES-256-GCM, unlocked by a master password that is never written to disk — using audited OpenSSL crypto, not a hand-rolled cipher.",
    context:
      "The Secure Coding module (CSEC1003D) asks for correct, object-oriented, security-minded systems programming. Rather than a toy, I built a real vault: a crypto layer over OpenSSL’s EVP API, a vault/serialisation layer, and a thin CLI — with a CMake build and a CTest suite.",
    problem:
      "A password manager is only as trustworthy as its weakest cryptographic decision. The goal was to get every one right: authenticated encryption so tampering is detected, slow salted key derivation so the master password resists brute force, and unique nonces so identical vaults never leak equality.",
    approach:
      "AES-256-GCM provides confidentiality and integrity in one primitive; PBKDF2-HMAC-SHA256 (200k iterations, random per-vault salt) derives the key; a fresh random 96-bit IV is generated on every save. RAII wraps the OpenSSL contexts, sensitive buffers are cleansed, and the master password is read with terminal echo disabled.",
    stack: [
      "C++17",
      "OpenSSL EVP (libcrypto)",
      "AES-256-GCM",
      "PBKDF2-HMAC-SHA256",
      "CMake + CTest",
      "RAII / OOP",
    ],
    metrics: [
      { value: "AES-256", label: "GCM authenticated encryption", sub: "tampering detected" },
      { value: "200k", label: "PBKDF2 iterations", sub: "random per-vault salt" },
      { value: "0", label: "Plaintext at rest", sub: "master key never stored" },
      { value: "C++17", label: "OpenSSL EVP", sub: "CMake · CTest · -Wall" },
    ],
    sections: [
      {
        heading: "Cryptographic design",
        body: "Every choice is deliberate and documented.",
        bullets: [
          "AES-256-GCM: a modified vault fails the auth tag instead of decrypting to junk",
          "PBKDF2-HMAC-SHA256 with a random salt: expensive brute-force, no rainbow tables",
          "Fresh random 96-bit IV per save: GCM nonces never repeat under one key",
          "Master password derived to a key and never stored — only salt + iterations persist",
        ],
      },
      {
        heading: "Proven, not just claimed",
        body: "The test suite demonstrates the security properties: a wrong master password and a single flipped byte in the vault both fail with an authentication error, and grepping the vault file for a stored secret returns nothing — it is encrypted at rest.",
      },
      {
        heading: "Engineering discipline",
        body: "Clean separation (crypto knows nothing about vaults; the CLI is thin), RAII around OpenSSL contexts so a context is freed exactly once even on error, OPENSSL_cleanse on key material, and a warnings-as-signal build (-Wall -Wextra -Wpedantic, zero warnings).",
      },
    ],
    outcome:
      "A genuinely secure, tested systems-C++ project that backs the ‘I can build the code I defend’ claim — real authenticated encryption, sound key management, and a threat model that is honest about what it does and does not protect.",
    tools: ["C++", "OpenSSL", "CMake"],
    tags: ["C++", "Cryptography", "Secure Coding", "AES-256"],
    repo: "https://github.com/WalBuk28/secure-password-manager-cpp",
  },

  // ---------------------------------------------------------------------------
  {
    slug: "contrust-os",
    title: "ConTrust OS",
    tagline: "Data-first construction ERP — logistics, procurement & finance",
    category: "Full-Stack · SaaS Platform",
    year: "2024–25",
    accent: "electric",
    icon: "Truck",
    featured: true,
    summary:
      "A “data-first” construction ERP that ingests a firm’s messy spreadsheets and instantly generates a professional management environment — project tracking, a procurement workflow, inventory alerts and automated retention-based billing — on a zero-cost Supabase + Vercel stack.",
    context:
      "ConTrust OS (built as ConstructOS) is a full-stack SaaS platform for mid-to-large construction firms. Rather than selling software, it sells automated control: a user uploads existing Excel/CSV files and the platform maps them into a live PostgreSQL-backed operations environment with RBAC.",
    problem:
      "Construction logistics run on disconnected spreadsheets and manual updates, leaving managers without a timely, accurate view of fleet status, inventory, procurement approvals and billing — driving material waste, idle assets, missed approvals and slow (30-day) billing cycles.",
    approach:
      "I designed a Next.js 14 (App Router) front end over Supabase (PostgreSQL, Auth + RBAC, Storage). A PapaParse importer turns 14 source CSVs into normalised rows across an 11-table relational schema; procurement follows a Material Request → RFQ → PO → GRN flow with an approval matrix, and a billing ledger applies retention logic automatically.",
    stack: [
      "Next.js 14 (App Router)",
      "Supabase · PostgreSQL",
      "Auth + Role-Based Access Control",
      "PapaParse (CSV ingestion)",
      "Recharts / frappe-gantt",
      "Tailwind + shadcn/ui",
      "Vercel",
    ],
    metrics: [
      { value: "11", label: "Relational tables", sub: "projects → procurement → billing" },
      { value: "14", label: "CSV sources ingested", sub: "one-drop importer" },
      { value: "4", label: "Stage procurement flow", sub: "MR → RFQ → PO → GRN" },
      { value: "~$0", label: "Infra cost", sub: "Supabase + Vercel free tier" },
    ],
    architecture: {
      title: "Data-first ERP flow",
      nodes: [
        { id: "csv", label: "14 CSV / Excel\nsource files", kind: "in" },
        { id: "import", label: "PapaParse\nimporter", kind: "core" },
        { id: "pg", label: "Supabase Postgres\n11-table schema + RBAC", kind: "core" },
        { id: "proc", label: "Procurement\nMR → RFQ → PO → GRN", kind: "core" },
        { id: "bill", label: "Billing ledger\nretention logic", kind: "ai" },
        { id: "dash", label: "Next.js dashboard\nGantt + charts", kind: "out" },
      ],
    },
    sections: [
      {
        heading: "One-drop data onboarding",
        body: "Instead of manual data entry, a manager drops their existing 14 spreadsheets into the importer. PapaParse parses them client-side and maps the rows onto a foreign-key-linked PostgreSQL schema — projects to customers, material requests to the approval matrix — so the system “exists” from day one.",
      },
      {
        heading: "Supply chain & automated approvals",
        body: "An inventory master flags low stock against each item’s reorder level, and the procurement workflow (Material Request → RFQ → PO → GRN) checks an approval matrix so a new purchase order is automatically flagged “Pending” for the correct manager.",
      },
      {
        heading: "Project & finance intelligence",
        body: "A Gantt view renders project start/end dates, while the billing module applies retention automatically — Net Payable = Gross − (Gross × Retention %) — tracked in a dedicated retention ledger to compress the billing cycle.",
      },
    ],
    outcome:
      "A production-shaped ERP that turns spreadsheet chaos into a single source of truth on professional-grade infrastructure for near-zero cost — demonstrating full-stack product thinking from schema design to a polished operator dashboard.",
    tools: ["Next.js", "Supabase", "PostgreSQL", "Recharts", "Vercel"],
    tags: ["Full-Stack", "SaaS", "PostgreSQL", "Product"],
  },

  // ---------------------------------------------------------------------------
  {
    slug: "software-development",
    title: "Secure Coding Fundamentals",
    tagline: "Two small Python builds that show security thinking, not just working code",
    category: "Software Development · Secure Coding",
    year: "2025–26",
    accent: "emerald",
    icon: "Code2",
    summary:
      "Two focused Python projects that demonstrate secure-by-design engineering: a calculator that evaluates expressions without ever calling eval, and an object-oriented card game with a tamper-evident, HMAC-signed results log — each fully unit-tested.",
    context:
      "Good security engineers can build the code they defend. These two Secure Coding (CSEC1003D) projects apply that mindset to everyday programs: assume input is hostile, and protect integrity even where nobody thinks to.",
    problem:
      "The naive version of each is a security hole. A quick calculator reaches for eval() — a remote-code-execution hole. A game writes a plain-text score file anyone can edit. The exercise was to build the correct version of each, and prove it with tests.",
    approach:
      "The calculator is a hand-written tokeniser + shunting-yard parser + fixed-operation evaluator, structurally incapable of running arbitrary code. The card game (War) uses clean OOP (Card / Deck / Player / engine) and signs every recorded result with HMAC-SHA256, so any edit to the score log is detected.",
    stack: [
      "Python 3",
      "Shunting-yard parsing",
      "OOP & data structures",
      "HMAC-SHA256 integrity",
      "unittest (29 tests)",
    ],
    metrics: [
      { value: "0", label: "Uses of eval()", sub: "no code-execution path" },
      { value: "29", label: "Unit tests passing", sub: "incl. security suites" },
      { value: "HMAC", label: "Tamper-evident scores", sub: "SHA-256 signed log" },
      { value: "2", label: "Focused builds", sub: "calculator · card game" },
    ],
    sections: [
      {
        heading: "Safe expression calculator",
        body: "The common “quick calculator” — eval(user_input) — is a remote-code-execution hole. This one classifies every character explicitly and only ever performs a closed set of maths operations, so hostile input is rejected before any computation.",
        bullets: [
          "Three stages: tokeniser → shunting-yard parser → RPN evaluator (no eval anywhere)",
          "Rejects code injection and illegal characters at the lexer",
          "Guards division-by-zero, domain errors and exponent-based DoS",
        ],
      },
      {
        heading: "Object-oriented War, with integrity",
        body: "A clean OOP implementation (immutable cards, seedable deck, players, rules engine) — plus a security twist: every game result is appended to an HMAC-SHA256-signed log, and verification uses a constant-time comparison, so tampering with the score file is detected.",
      },
      {
        heading: "Tested and honest",
        body: "29 unit tests across the two projects, including dedicated security suites (code-injection rejection, input-length and exponent guards, tamper detection, wrong-key verification). Both are on GitHub as secure-calculator and card-war.",
      },
    ],
    outcome:
      "Two small but genuinely secure, tested projects — the developer literacy that strengthens day-to-day security engineering, built and verified rather than claimed.",
    tools: ["Python", "Git"],
    tags: ["Python", "Secure Coding", "Testing"],
    repo: "https://github.com/WalBuk28/secure-calculator",
  },
];

// ── Experience (dates aligned to CV; the internship is the only employment) ──
export type Experience = {
  company: string;
  role: string;
  period: string;
  location: string;
  kind: string;
  points: string[];
};

export const experience: Experience[] = [
  {
    company: "Receptive Tech Communications",
    role: "Cyber Security Intern",
    period: "Jun 2025 – Sep 2025",
    location: "Lahore, Pakistan",
    kind: "Internship",
    points: [
      "Tuned SIEM correlation rules and alert thresholds to cut false positives during triage.",
      "Ran recurring vulnerability scans, verified patches and flagged misconfigurations.",
      "Rewrote escalation matrices and drafted incident-response playbooks.",
    ],
  },
  {
    company: "Telstra · Mastercard · Deloitte Australia",
    role: "Virtual job simulations (Forage)",
    period: "2025",
    location: "Online",
    kind: "Simulation, not employment",
    points: [
      "Telstra (cyber security): responded to a simulated malware incident, then wrote a post-incident analysis with hardening recommendations.",
      "Mastercard (security awareness): identified the phishing in the exercise and proposed training for high-risk teams.",
      "Deloitte Australia (cyber): analysed web-activity logs in a simulated breach.",
    ],
  },
];

export type Certification = { name: string; issuer: string; date?: string; detail?: string };

export const certifications: Certification[] = [
  {
    name: "Certified in Cybersecurity (CC)",
    issuer: "ISC2",
    date: "May 2026",
  },
  {
    name: "Cybersecurity Professional Certificate",
    issuer: "Google",
    date: "May 2025",
    detail: "Detection and response, Python automation, Linux, SQL, threat analysis",
  },
  {
    name: "Generative AI Engineering Professional",
    issuer: "IBM",
    date: "Aug 2025",
    detail: "Generative AI applications & prompt engineering",
  },
  {
    name: "Certified Foundations Associate (AI & Cloud)",
    issuer: "Oracle",
    date: "Jul 2025",
    detail: "AI Foundations + OCI Foundations Associate",
  },
  {
    name: "AI Fluency · Claude 101",
    issuer: "Anthropic",
  },
  {
    name: "Security, Compliance, and Identity Fundamentals (SC-900)",
    issuer: "Microsoft",
    date: "In progress",
    detail: "Studying for the exam; not yet held",
  },
];

export const education = {
  degree: "BSc (Hons) Cyber Security",
  school: "De Montfort University (studied at DMU Dubai)",
  result: "First Class Honours · awarded 16 July 2026",
  period: "Oct 2023 – Jul 2026",
};

export const navLinks = [
  { label: "Work", href: "#work" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];
