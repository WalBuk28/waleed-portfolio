// =============================================================================
//  Portfolio content: extracted & distilled from Waleed's coursework,
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
  tagline: "I turn raw packets, malware and threat feeds into decisions a SOC can act on.",
  location: "Dubai, United Arab Emirates",
  email: "waleedbukhari2000@gmail.com",
  linkedin: "https://linkedin.com/in/muhammad-waleed-b43997202",
  github: "https://github.com/WalBuk28",
  site: "https://walsec.com",
  cv: "/Muhammad_Waleed_CV.pdf",
  availability: "Open to SOC Analyst and blue-team roles",
  summary:
    "BSc (Hons) Cyber Security, First Class Honours, from De Montfort University, studied at DMU Dubai. I work on threat intelligence, network forensics and SOC automation, and I write the software to back it up: an offline SIEM-Lite with a local LLM, an ML phishing detector and C++ security tooling. My industry experience is a cyber security internship at Receptive Tech Communications (Lahore, 2025), where I tuned SIEM correlation rules and alert thresholds, ran vulnerability scans and drafted playbooks. I've also completed virtual job simulations (Forage) with Telstra, Mastercard and Deloitte.",
  // About's statement in daylight: the part of the summary that Experience doesn't repeat.
  statement:
    "I work on threat intelligence, network forensics and SOC automation, and I write the software to back it up: an offline SIEM-Lite with a local LLM, an ML phishing detector and C++ security tooling.",
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
  { text: "[ok] loading threat-intel feeds ······ ThreatFox · URLhaus", tone: "ok" },
  { text: "[ok] mounting forensic engine ········ PyShark / TShark", tone: "ok" },
  { text: "[ok] grounding local LLM ············· Qwen · DeepSeek · RAG", tone: "ok" },
  { text: "[ok] MITRE ATT&CK mapping ············ Enterprise + ICS", tone: "ok" },
  { text: "operator ready: welcome to the WalSec bench", tone: "info" },
];

// ── Threat-feed ticker: every item comes from a case study (lab or scenario data) ──
export const threatFeed: { type: string; value: string; sev: "crit" | "warn" | "ok" }[] = [
  { type: "IPv4", value: "5.152.177.221 · scanner, ICS case study", sev: "crit" },
  { type: "MITRE", value: "T1566.001 · Spearphishing Attachment", sev: "warn" },
  { type: "URL", value: "hxxp://practicalmalwareanalysis[.]com/serve.html · lab IOC", sev: "crit" },
  { type: "CVE", value: "CVE-2014-3566 · POODLE", sev: "warn" },
  { type: "SVC", value: "IPRIP · “INA+” service DLL", sev: "crit" },
  { type: "MITRE", value: "T1543.003 · Windows Service", sev: "warn" },
  { type: "FEED", value: "URLhaus pull · every 30 to 60 min", sev: "ok" },
  { type: "CVE", value: "CVE-2016-0800 · DROWN", sev: "warn" },
  { type: "IPv4", value: "192.168.127.226 · GIT server pivot", sev: "crit" },
  { type: "MITRE", value: "T1021.001 · RDP lateral", sev: "warn" },
  { type: "FEED", value: "ThreatFox · 9,000+ IOCs stored", sev: "ok" },
];

// ── Skills: no self-ratings. Each group names the case studies that show it. ──
export type SkillGroup = { title: string; icon: string; skills: string[]; evidence: string[] };

export const skillGroups: SkillGroup[] = [
  {
    title: "Threat intel and SOC",
    icon: "Radar",
    evidence: ["walsec-atioc-hub", "incident-response-maturity", "network-forensics"],
    skills: [
      "MITRE ATT&CK (Enterprise and ICS)",
      "SIEM rule tuning",
      "Splunk",
      "Wazuh, EDR",
      "Log analysis",
      "Incident response (NIST SP 800-61)",
      "Threat feeds: ThreatFox, URLhaus",
    ],
  },
  {
    title: "Offensive and forensics",
    icon: "Bug",
    evidence: ["pentest-malware", "network-forensics"],
    skills: [
      "Penetration testing (black-box)",
      "Nessus, Nmap, Metasploit",
      "Burp Suite",
      "Malware analysis (static and dynamic)",
      "Reverse engineering: IDA, GDB, REMnux",
      "Wireshark, TShark, PyShark",
      "testssl.sh, OpenSSL",
    ],
  },
  {
    title: "Networking and ICS",
    icon: "Network",
    evidence: ["network-forensics"],
    skills: [
      "Packet analysis and DPI",
      "VLAN, NAT, static routing",
      "Firewall rules and segmentation",
      "Cisco Packet Tracer",
      "SCADA and OT security",
      "CARVER risk assessment",
    ],
  },
  {
    title: "Software and AI",
    icon: "Code2",
    evidence: ["walsec-atioc-hub", "ai-phishing-detection", "secure-password-manager", "contrust-os"],
    skills: [
      "Python: Flask, PyShark, scikit-learn",
      "C++",
      "React, Next.js",
      "Local LLMs: Ollama, Qwen, DeepSeek",
      "RAG with BGE-M3 embeddings",
      "ML: XGBoost, Random Forest, MLP",
      "SQL, SQLite",
    ],
  },
  {
    title: "Secure development",
    icon: "ShieldCheck",
    evidence: ["secure-scripting", "secure-password-manager", "software-development"],
    skills: [
      "OWASP Top 10 self-testing",
      "RBAC, CSRF tokens, CSP",
      "JWT, bcrypt, PBKDF2",
      "Parameterised SQL",
      "Unit tests: unittest, CTest",
      "UK GDPR analysis",
    ],
  },
  {
    title: "Cryptography",
    icon: "KeyRound",
    evidence: ["cryptography", "secure-password-manager", "pentest-malware"],
    skills: [
      "AES-256-GCM, HMAC-SHA256",
      "RSA and cryptanalysis",
      "Key-exchange protocols",
      "Symmetric and public-key crypto",
      "TLS and SSL configuration analysis",
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
  year?: string;
  accent: "emerald" | "electric";
  icon: string;
  featured?: boolean;
  summary: string;
  description: string; // meta, OG and Twitter: at most 160 characters
  context: string;
  problem: string;
  approach: string;
  stack: string[];
  metrics: Metric[];
  sections: DetailSection[];
  outcome: string;
  tools: string[];
  tags: string[];
  repos?: string[];
  repoNote?: string; // shown when there is no public repo
  evidenceNote?: string; // opens the Evidence section: what can't be shown, and how to see it
  demo?: string;
  updated?: string; // ISO date of the last content change (sitemap); defaults to siteUpdated
  // optional visualisations
  architecture?: { title: string; nodes: FlowNode[] };
  killChain?: KillStage[];
};

// Last content change, for the sitemap. Bump it (or a study's `updated`) when the copy changes.
export const siteUpdated = "2026-10-19";

export const caseStudies: CaseStudy[] = [
  // ---------------------------------------------------------------------------
  {
    slug: "walsec-atioc-hub",
    title: "WalSec A-TIOC Hub",
    tagline: "A privacy-first SIEM-Lite that fuses network forensics with local LLMs",
    description:
      "An air-gapped SIEM-Lite for small organisations: deep packet inspection and live threat intel, grounded in a local LLM so no telemetry leaves the building.",
    category: "Final-year project (CTEC3451D) · SOC platform",
    year: "2025/26",
    accent: "emerald",
    icon: "ShieldCheck",
    featured: true,
    repoNote: "Private repository · demo on request",
    // Waleed, 2 Nov 2026: the platform's screens stay private, so the page shows no captures.
    evidenceNote: "The platform is private; a live demo is available on request.",
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
      title: "Decoupled, fully local pipeline",
      nodes: [
        { id: "osint", label: "OSINT feeds\nThreatFox · URLhaus", kind: "in" },
        { id: "pcap", label: "PCAP upload\n≤ 50 MB, deep packet inspection", kind: "in" },
        { id: "flask", label: "Flask 3.0 API\nEventlet + multiprocessing", kind: "core" },
        { id: "db", label: "SQLite (WAL)\nACID evidence store", kind: "core" },
        { id: "rag", label: "RAG · BGE-M3\nQwen · DeepSeek (Ollama)", kind: "ai" },
        { id: "ui", label: "React SPA\nWebSocket telemetry", kind: "out" },
      ],
    },
    sections: [
      {
        heading: "Automated forensic ingestion",
        body: "The system replaces manual TShark triage. Asynchronous deep packet inspection parses uploaded PCAPs (capped at 50 MB by checking the file size with file.seek before parsing, to protect the event loop), while APScheduler workers pull fresh indicators from ThreatFox and URLhaus every 30 to 60 minutes. The local store held over 9,000 ThreatFox IOCs in October 2026.",
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
        body: "The out-of-evidence behaviour is shown by one recorded test, not a measured rate. No latency figure is given: the hardware wasn’t recorded, and the models have changed since testing. Setup is not zero-configuration: it needs a Linux host with Docker and Ollama, the models pulled in advance, and dependencies installed offline.",
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
    title: "Penetration testing and malware investigations",
    tagline: "Black-box pentest + multi-sample malware reverse engineering",
    description:
      "A black-box pentest of a legacy lab host (96 Nessus findings) and reverse engineering of three malware samples, mapped to MITRE ATT&CK with detections.",
    category: "Coursework (CSEC2003D) · Offensive security",
    year: "2025/26",
    accent: "electric",
    icon: "Bug",
    featured: true,
    summary:
      "A black-box penetration test of a legacy lab host (96 Nessus findings) paired with reverse engineering of a weaponised PDF, a service DLL and a downloader, mapped to MITRE ATT&CK with detections.",
    context:
      "Coursework (CSEC2003D) in an isolated lab with provided targets and samples. Two parts: a black-box penetration test of a simulated legacy banking host (“Besure Bank”, 192.168.50.130), and a malware investigation of four artefacts: three malware samples (a PDF, a service DLL and a downloader) and one vulnerable C program. The service DLL is Practical Malware Analysis Lab 3-2, a standard training sample.",
    problem:
      "Legacy, end-of-life infrastructure quietly accumulates exploitable risk. The brief: enumerate and validate every weakness on an externally-facing host with no prior knowledge, then, separately, triage a high-confidence malware cluster, prove its persistence and capabilities, and produce actionable detection engineering.",
    approach:
      "For the pentest I ran a staged, throttled methodology (Nmap recon, Nessus Essentials vuln scanning, testssl.sh/OpenSSL crypto analysis, and Metasploit exploitation attempts), validating tool output manually. For the malware work I combined static analysis (PDFiD, peepdf, PDFStreamDumper, PE tooling, IDA Pro) with dynamic detonation (ProcMon, Process Explorer, ApateDNS) and debugger-led reverse engineering (GDB/REMnux).",
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
      { value: "96", label: "Nessus findings", sub: "2 critical · 15 high · 26 medium · 8 low · 45 info" },
      { value: "4", label: "Artefacts analysed", sub: "3 malware samples (PDF · DLL · EXE) + 1 vulnerable C program" },
      { value: "5", label: "ATT&CK techniques mapped", sub: "listed under “MITRE ATT&CK & detection engineering”" },
      { value: "5", label: "CVEs referenced", sub: "listed under “Penetration test”" },
    ],
    sections: [
      {
        heading: "Penetration test: Besure Bank",
        body: "Nmap revealed an end-of-life stack: OpenSSH 3.1p1 (SSHv1 enabled), Apache 2.0.40 and PHP 4.2.2. Nessus Essentials reported 96 findings: 2 critical, 15 high, 26 medium, 8 low and 45 informational. The report references five CVEs: CVE-2014-3566 (POODLE), CVE-2016-0800 (DROWN), CVE-2003-0253 (Apache 2.0 buffer overflow), CVE-2007-1001 (PHP code injection) and CVE-2008-0599 (PHP variable handling).",
        bullets: [
          "Critical: SSLv2/SSLv3 enabled → POODLE (CVE-2014-3566) and DROWN (CVE-2016-0800)",
          "Critical: PHP 4.2.2, end of life, with public exploits (CVE-2007-1001, CVE-2008-0599); Metasploit modules attempted",
          "Weak ciphers (RC4, EXPORT, 3DES/SWEET32), TLS 1.0, expired self-signed cert (2007)",
          "HTTP TRACE enabled (XST), exposed phpinfo.php, inconsistent login errors → enumeration",
          "Delivered tactical + strategic remediation and a patch-management lifecycle",
        ],
      },
      {
        heading: "Malware: weaponised PDF (sus-file1)",
        body: "PDFiD flagged embedded /JS, /AA additional-actions and an /EmbeddedFile. PDFStreamDumper exposed obfuscated XFA JavaScript using slice/concat evasion, with a deceptively-named nested document: a classic phishing initial-access vector. VirusTotal consensus aligned with the Exploit.PDF-JS / pdfka family.",
      },
      {
        heading: "Malware: persistence service DLL (sus-file3)",
        body: "A PE32 service DLL exporting Install/ServiceMain/UninstallService. Imports (OpenSCManagerA, CreateServiceA) and strings revealed svchost/netsvcs persistence, masquerading as “Intranet Network Awareness (INA+)” under service name IPRIP. Dynamic analysis confirmed the DLL loading inside svchost.exe. Its C2 strings point to hxxp://practicalmalwareanalysis[.]com/serve.html, a lab IOC: this is the Practical Malware Analysis Lab 3-2 sample, not a live threat.",
      },
      {
        heading: "Downloader + stack overflow (sus-file4 / sus-file6)",
        body: "IDA disassembly of the downloader showed the canonical URLDownloadToFileA → WinExec → ExitProcess pattern, with an XOR-0xFF string-decode loop. The advanced task verified a stack-based buffer overflow in check_authentication(): a watchpoint on the auth flag flipped 0 → non-zero after an unbounded strcpy into a 16-byte buffer, proving control-flow influence in GDB.",
      },
      {
        heading: "MITRE ATT&CK & detection engineering",
        body: "Evidence mapped to T1566.001 (Spearphishing Attachment), T1204 (User Execution), T1218.011 (Rundll32), T1543.003 (Windows Service) and T1112 (Modify Registry). I delivered low-noise/high-signal detections: alert on CreateServiceA where ServiceDll points to a user-writable path, and on rundll32 executing DLLs from user directories.",
      },
    ],
    outcome:
      "Two reports with IOC tables (host- and network-based indicators), prioritised remediation and detection logic you could implement, covering the loop from finding a weakness to detecting its use. The IOCs and detections are in the public repo.",
    tools: ["Kali", "Nessus", "Metasploit", "IDA Pro", "GDB", "REMnux", "Wireshark"],
    tags: ["Penetration Testing", "Malware Analysis", "Reverse Engineering", "MITRE ATT&CK"],
    repos: ["https://github.com/WalBuk28/penetration-testing-malware-analysis"],
  },

  // ---------------------------------------------------------------------------
  {
    slug: "network-forensics",
    title: "Network forensics and ICS security",
    tagline: "Reconstructing a multi-stage SCADA attack from packets",
    description:
      "A four-stage attack reconstructed from packet captures, from a public web server into a water-treatment OT network, mapped to ATT&CK Enterprise and ICS.",
    category: "Coursework (CSEC3002) · Digital forensics · OT/ICS",
    year: "2025",
    accent: "emerald",
    icon: "Network",
    featured: true,
    summary:
      "A Wireshark reconstruction of a four-stage attack that pivoted from a public web server into a water-treatment OT network, scored with a CARVER matrix and mapped to MITRE ATT&CK for Enterprise and ICS.",
    context:
      "Coursework for Cyber Physical Systems Security (CSEC3002), submitted November 2025: an investigation into a multi-stage intrusion at “CTI Utilities”, a fictional water-treatment operator, using synthetic teaching captures. Alongside it, network-design work in Cisco Packet Tracer (VLANs, NAT, static routing) shows the segmentation the victim lacked.",
    problem:
      "An external attacker defaced a safety-critical HMI by stepping from a low-value public asset into a secure OT network. The investigation had to answer the brief’s forensic questions from packet evidence alone, quantify asset risk, and recommend controls that would have broken the kill chain.",
    approach:
      "Before touching the captures, I scored 17 assets with a CARVER matrix and modelled three attack pathways as an attack tree. The tree rated the direct route through the VPN server as the attacker’s best option: fewest dependencies, on end-of-life Ubuntu 18.04. The web-server route ranked lower because it is noisier and leaves more logs. I then reconstructed the actual intrusion packet by packet in Wireshark, correlating timestamps, IPs, ports and HTTP streams into interim forensic memos and a final incident report. The packets showed the attacker took the noisier web-server route, which the tree had ranked second.",
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
      { value: "9", label: "ATT&CK techniques mapped", sub: "7 Enterprise + 2 ICS, listed below" },
      { value: "3", label: "Scanning source IPs", sub: "distributed port scan, from the captures" },
    ],
    killChain: [
      {
        stage: "01",
        label: "Reconnaissance",
        detail: "Distributed scan from 3 IPs against the Web Server (192.168.121.151) on ports 22, 80 and 443.",
        technique: "T1595 · Active Scanning",
      },
      {
        stage: "02",
        label: "Initial Access",
        detail: "A brute force on /wp-login.php was detected but failed; a different attack on the public web server gave the attacker access.",
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
        technique: "T0832 · Manipulation of View",
      },
    ],
    sections: [
      {
        heading: "Risk-based prioritisation (CARVER)",
        body: "The CARVER matrix ranked the VPN Server (52) and the LIMS lab (49) as the most attractive targets (both running end-of-life Ubuntu), surfacing the systemic problem of unsupported software across critical assets.",
      },
      {
        heading: "Findings & recommendations",
        body: "Three root-cause findings, plus a fix for the stolen-cookie hijack, drove a prioritised remediation plan.",
        bullets: [
          "Insufficient network segmentation (critical): strict IT/OT firewall rules",
          "Weak access control: enforce MFA on all remote and RDP access",
          "Legacy and EOL systems: an emergency patch-management programme",
          "Hard HMI session timeouts to neutralise stolen-cookie hijacking",
        ],
      },
      {
        heading: "MITRE ATT&CK mapping",
        body: "Nine techniques, each tied to a forensic memo, mapped across both matrices and visualised in ATT&CK Navigator.",
        bullets: [
          "Enterprise: T1595 Active Scanning · T1592 Gather Victim Host Information · T1190 Exploit Public-Facing Application · T1110.001 Password Guessing (the failed brute force) · T1021.001 Remote Desktop Protocol · T1552.001 Credentials In Files (the stolen session cookie) · T1046 Network Service Discovery",
          "ICS: T0866 Exploitation of Remote Services (the malicious POST to the HMI web service) · T0832 Manipulation of View (the defaced HMI)",
          "Correction: the submitted report gives the two ICS techniques as T0862 and T0880. Those IDs are Supply Chain Compromise and Loss of Safety, so the IDs above are the corrected ones.",
        ],
      },
      {
        heading: "Secure-by-design networking",
        body: "Separate Cisco Packet Tracer work built corporate topologies with VLAN segmentation, NAT and static routing: the controls whose absence let the CTI Utilities attacker cross from IT into OT.",
      },
    ],
    outcome:
      "An incident report aligned to NIST SP 800-82 and 800-61, with forensic memos, an attack tree, CARVER scoring and ATT&CK mapping across both matrices, turning raw packets into business risk and concrete controls.",
    tools: ["Wireshark", "Cisco Packet Tracer", "ATT&CK Navigator"],
    tags: ["Network Forensics", "ICS / SCADA", "Incident Response", "MITRE ATT&CK"],
    repos: ["https://github.com/WalBuk28/network-forensics-ics"],
  },

  // ---------------------------------------------------------------------------
  {
    slug: "incident-response-maturity",
    title: "Incident response maturity and threat intel",
    tagline: "A SIM3 maturity assessment and STIX threat-intel structuring for a logistics SME",
    description:
      "A SIM3 v2 incident-response maturity assessment of a case-study logistics company, benchmarked against ENISA Basic, with the intrusion structured in STIX 2.1.",
    category: "Coursework (CSEC2002D) · Incident response · Threat intelligence",
    year: "2025/26",
    accent: "electric",
    icon: "ShieldAlert",
    summary:
      "A SIM3 v2 incident-response maturity assessment of a case-study logistics company (45 parameters across four domains, benchmarked against ENISA Basic), paired with STIX 2.1 structuring of a scenario intrusion and a NIST SP 800-61 lifecycle response.",
    context:
      "Incident Response & Cyber Threat Intelligence coursework (CSEC2002D). “Winderby Logistics Group” is a case-study organisation from the brief, not a client: a “digitally sideways” SME with a mixed IT/OT estate, a part-time analyst and an office-hours-only MSSP. The brief: measure how ready it is to handle an incident, and turn a scenario intrusion into shareable intelligence.",
    problem:
      "Incident-response capability that grows ad hoc is invisible until it fails. WLG had no formal IR mandate, no service description and almost no repeatable process, but no way to see or prioritise that. The work had to quantify maturity against a recognised baseline and convert a messy intrusion into structured, actionable threat intelligence.",
    approach:
      "I scored all 45 SIM3 v2 parameters (Organisation, Human, Tools, Process) on maturity of existence, documentation and enforcement, benchmarked each against the ENISA Basic target, and built a prioritised remediation roadmap. Separately I structured a warehouse-automation intrusion into STIX 2.1 objects and ran it through the NIST SP 800-61 lifecycle.",
    stack: [
      "SIM3 v2 (Open CSIRT Foundation)",
      "ENISA Basic Maturity",
      "STIX 2.1",
      "MITRE ATT&CK (Enterprise + ICS)",
      "NIST SP 800-61",
    ],
    metrics: [
      { value: "45", label: "SIM3 parameters assessed", sub: "Org 11 · Human 7 · Tools 10 · Process 17" },
      { value: "8/45", label: "At or above ENISA Basic", sub: "37 gaps identified" },
      { value: "16/17", label: "Process parameters below target", sub: "weakest domain" },
      { value: "STIX 2.1", label: "Intrusion structured", sub: "shareable IOCs" },
    ],
    sections: [
      {
        heading: "SIM3 maturity assessment",
        body: "Each parameter was scored 0 (non-existent) to 4 (optimising) and compared to ENISA Basic, so every result reads as a gap to a recognised standard rather than an abstract number.",
        bullets: [
          "Organisation: no formal IR mandate (O-1), authority “devolves to whoever is available” (O-3), only an informal service description (O-5)",
          "Process is the weakest domain: 16 of 17 parameters below ENISA Basic",
          "Tools are the relative bright spot (resilient comms/internet already exist for logistics)",
        ],
      },
      {
        heading: "Root cause & prioritised roadmap",
        body: "The organisation-layer gaps are the systemic cause: without a mandate, authority or service description, investment in people, tools and process leaks away. The roadmap sequences the lowest-cost, highest-impact fixes first: a board-approved IR charter, service/SLA definitions, then core detection and resolution playbooks.",
      },
      {
        heading: "Threat intelligence: STIX 2.1 and NIST 800-61",
        body: "The brief’s warehouse-automation intrusion scenario (rogue scheduled task by a look-alike service account, C2 to Eastern-European infrastructure, USB exfiltration, telematics brute force) was mapped to STIX 2.1 objects and MITRE ATT&CK for Enterprise and ICS, then walked through the NIST SP 800-61 lifecycle, showing that preparation and detection, not heroics during containment, decide the outcome.",
      },
    ],
    outcome:
      "A standards-based picture of a case-study SME’s incident-response readiness with a prioritised roadmap to ENISA Basic, plus a worked example of turning a scenario intrusion into structured, shareable threat intelligence aligned to NIST SP 800-61.",
    tools: ["SIM3", "ENISA", "STIX 2.1", "MITRE ATT&CK", "NIST SP 800-61"],
    tags: ["Incident Response", "Threat Intelligence", "SIM3 / ENISA", "STIX"],
    repos: ["https://github.com/WalBuk28/incident-response-maturity-wlg"],
  },

  // ---------------------------------------------------------------------------
  {
    slug: "ai-phishing-detection",
    title: "AI-driven phishing detection",
    tagline: "Phishing detection on 235,795 URLs, with a leakage fix, a SOC cost model and a poisoning test",
    description:
      "Six models classifying phishing on 235,795 URLs (PhiUSIIL): two leaky features removed, a threshold from a SOC cost model, and a label-poisoning test.",
    category: "Coursework (CSEC3004) · Machine learning",
    year: "2025",
    accent: "electric",
    icon: "BrainCircuit",
    summary:
      "Six supervised models classifying phishing on the PhiUSIIL dataset (235,795 URLs, using URL and page features). I found and removed two leaky features, picked a decision threshold from a SOC cost model, and tested how the models hold up when training labels are poisoned.",
    context:
      "AI for Cyber Security coursework (CSEC3004): building and critically evaluating phishing classifiers on the public PhiUSIIL Phishing URL dataset. The whole analysis is in a Jupyter notebook in the public repo, with its outputs saved.",
    problem:
      "Phishing is a leading initial-access vector (MITRE T1566.002). On a public benchmark it is easy to report near-perfect accuracy that means little. The questions: is the accuracy real, what threshold makes sense for a SOC that pays for both false alarms and missed phish, and how brittle are the models when an attacker corrupts the training data?",
    approach:
      "I engineered URL and page features (the dataset includes page-content signals such as HasSocialNet and HasCopyrightInfo, not just the URL). A first run gave a suspicious 1.0 accuracy, which I traced to two leaky “oracle” features, URLSimilarityIndex and LineOfCode, and dropped. I then tuned and compared six models on a stratified 80/20 split: Logistic Regression, Random Forest, XGBoost, LightGBM, CatBoost and an MLP.",
    stack: [
      "Python",
      "scikit-learn",
      "XGBoost / LightGBM / CatBoost",
      "MLP neural network",
      "pandas / NumPy",
      "Matplotlib",
    ],
    metrics: [
      { value: "0.9999", label: "Best test accuracy", sub: "XGBoost and LightGBM · stratified 20% test split" },
      { value: "0.61", label: "Cost-optimal threshold", sub: "$15 per false alarm vs $5,000 per missed phish" },
      { value: "235,795", label: "URLs in dataset", sub: "PhiUSIIL (43% phishing)" },
      { value: "6", label: "Models compared", sub: "linear · bagging · boosting ×3 · MLP" },
    ],
    sections: [
      {
        heading: "Catching the leak",
        body: "The first models scored a perfect 1.0, which is a warning sign rather than a result. Correlation analysis showed URLSimilarityIndex (correlation 0.86 with the label) and LineOfCode acting as oracles for the answer. I dropped both, and split the data before scaling so nothing from the test set leaked into training.",
      },
      {
        heading: "Model comparison (clean test set)",
        body: "Accuracy / false-positive rate / false-negative rate on the 20% held-out split, from the notebook’s results table:",
        bullets: [
          "Logistic Regression 0.9991 / 0.0011 / 0.0007",
          "Random Forest 0.9996 / 0.0005 / 0.0003",
          "XGBoost 0.9999 / 0.0002 / 0.0001",
          "LightGBM 0.9999 / 0.0002 / 0.0000",
          "CatBoost 0.9998 / 0.0004 / 0.0001",
          "MLP 0.9997 / 0.0003 / 0.0002",
        ],
      },
      {
        heading: "SOC cost model",
        body: "I modelled a SOC that sees 1,000,000 URLs a day, 0.5% of them phishing, where a false positive costs $15 of analyst triage and a missed phish costs $5,000. Sweeping the threshold gave an optimum of 0.61 and a minimum expected cost of about $4,072 a day.",
      },
      {
        heading: "Poisoning test",
        body: "I flipped 1, 5, 10, 15 and 20% of the training labels and re-measured accuracy on clean test data (Random Forest and XGBoost). From the notebook’s plot: Random Forest stayed at about 0.9995 at every rate, while XGBoost fell steadily, to about 0.997 at 20%. Bagging averages out the noise; boosting keeps fitting it.",
      },
      {
        heading: "Limitations",
        body: "Every model scored a ROC-AUC of 1.0000, even after the leakage fix: PhiUSIIL is close to separable, so these scores overstate real-world performance. The 0.5% phishing rate and the dollar costs are modelling assumptions, not measured figures. The poisoning numbers are read from a plot, and the poisoning test covered two models only.",
      },
    ],
    outcome:
      "An evaluation that treats ML as a security control rather than a leaderboard: it rejects a too-good result, chooses a threshold from what errors cost a SOC, and shows which model family survives poisoned training data.",
    tools: ["Python", "scikit-learn", "XGBoost", "Jupyter"],
    tags: ["Machine Learning", "SOC Automation", "Phishing", "Adversarial ML"],
    repos: ["https://github.com/WalBuk28/ai-phishing-detection"],
  },

  // ---------------------------------------------------------------------------
  {
    slug: "secure-scripting",
    title: "FreightDesk, a secure business application",
    tagline: "A hardened Flask logistics portal with live FX, RBAC and a full security self-assessment",
    description:
      "FreightDesk: a Flask logistics app built security-first, with parameterised SQL, RBAC, CSRF tokens, hardened headers, live FX and 17 automated tests.",
    category: "Coursework (CSEC2001D) · Secure web app",
    year: "2025/26",
    accent: "emerald",
    icon: "Boxes",
    summary:
      "A database-backed logistics web app built security-first: parameterised SQL, role-based access control, per-session CSRF tokens, hardened headers and a live FX web service, with 17 automated tests and an OWASP Top 10 self-assessment.",
    context:
      "Built for the Secure Scripting & Business Applications brief (CSEC2001D). Staff sign in against role-based permissions, manage freight shipments in a normalised SQLite database, and see each shipment’s declared value converted to a base currency using exchange rates pulled live over HTTPS from a remote web service.",
    problem:
      "The brief’s real test isn’t “can you build a CRUD app” but “can you build one that withstands the common business-application attacks”: SQL injection, broken access control, CSRF, session hijacking and unsafe outbound requests. The emphasis is as much on how it’s secured as on what it does.",
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
      { value: "7 of 10", label: "OWASP Top 10 (2021) categories with a test", sub: "A07 and A09 shown in code, A06 by pinned deps · SECURITY.md" },
      { value: "3", label: "RBAC roles", sub: "viewer · clerk · admin" },
      { value: "0", label: "String-built SQL", sub: "parameterised queries only · SQLi tests in the repo" },
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
        body: "Shipment values in mixed currencies are converted using live rates from open.er-api.com, a public FX API that needs no key. Rates are fetched over HTTPS with a 4-second timeout, parsed defensively, cached for an hour, and replaced by bundled fallback rates if the service is unreachable. The endpoint is fixed in config, not user-controlled, to resist SSRF.",
      },
      {
        heading: "Self-penetration test (OWASP)",
        body: "I attacked my own app and documented it: SQL-injection auth-bypass and table-drop payloads (blocked by parameterisation), forced-browsing privilege escalation (403 server-side), CSRF replay (400), reflected XSS (Jinja autoescape + CSP) and clickjacking (frame-ancestors none). SECURITY.md maps each OWASP Top 10 (2021) category to its threat, control and evidence: 7 categories have a named test, A07 (authentication) and A09 (logging) point to the code that implements them, and A06 (vulnerable components) relies on a minimal pinned dependency set.",
      },
      {
        heading: "Limitations",
        body: "There is no rate limiting or lockout on /login yet, so credential stuffing (A07) is only slowed by the password hash. The audit log is append-only by convention, not tamper-evident.",
      },
    ],
    outcome:
      "A business application that treats security as a first-class requirement, with a written OWASP self-assessment, a UK GDPR data-protection analysis and a passing test suite: secure development end to end, not just a working feature set.",
    tools: ["Python", "Flask", "SQLite", "requests"],
    tags: ["Secure Coding", "Web App", "OWASP", "RBAC"],
    repos: ["https://github.com/WalBuk28/freightdesk"],
  },

  // ---------------------------------------------------------------------------
  {
    slug: "secure-password-manager",
    title: "Secure password manager in C++",
    tagline: "An AES-256-GCM credential vault in modern C++ built on real OpenSSL crypto",
    description:
      "A command-line password manager in C++17: one vault file sealed with AES-256-GCM via OpenSSL’s EVP API, unlocked by a master password never written to disk.",
    category: "Coursework (CSEC1003D) · Secure C++",
    year: "2025/26",
    accent: "electric",
    icon: "Lock",
    summary:
      "A command-line password manager in modern C++17 that stores credentials in a single vault file encrypted and authenticated with AES-256-GCM, unlocked by a master password that is never written to disk, using OpenSSL’s EVP API rather than a hand-rolled cipher.",
    context:
      "The Secure Coding module (CSEC1003D) asks for correct, object-oriented, security-minded systems programming. Rather than a toy, I built a real vault: a crypto layer over OpenSSL’s EVP API, a vault/serialisation layer, and a thin CLI, with a CMake build and a CTest suite.",
    problem:
      "A password manager is only as trustworthy as its weakest cryptographic decision. The goal was to get every one right: authenticated encryption so tampering is detected, slow salted key derivation so the master password resists brute force, and a fresh random nonce on every save so the same contents never encrypt the same way twice.",
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
      { value: "200k", label: "PBKDF2 iterations", sub: "below OWASP’s 600k; see limitations" },
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
          "Fresh random 96-bit IV per save: a repeated nonce under one key is negligibly unlikely at this volume",
          "Master password derived to a key and never stored: only the salt and iteration count persist",
        ],
      },
      {
        heading: "Proven, not just claimed",
        body: "The CTest suite checks the security properties: a wrong key or master password and a single flipped bit both fail with an authentication error. The README repeats this by hand and adds a grep of the vault file that finds no trace of a stored secret, because it is encrypted at rest.",
      },
      {
        heading: "Engineering discipline",
        body: "Clean separation (crypto knows nothing about vaults; the CLI is thin), RAII around OpenSSL contexts so a context is freed exactly once even on error, OPENSSL_cleanse on key material, and a build with -Wall -Wextra -Wpedantic so warnings surface as signal.",
      },
      {
        heading: "Limitations",
        body: "200,000 PBKDF2-HMAC-SHA256 iterations is below the 600,000 that OWASP’s Password Storage Cheat Sheet now recommends, and PBKDF2 is not memory-hard (Argon2id would resist GPU cracking better). The iteration count is stored in the vault header, so it can be raised without breaking existing vaults.",
      },
    ],
    outcome:
      "A tested systems-C++ project that backs the ‘I can build the code I defend’ claim: real authenticated encryption, sound key management, and a threat model that is honest about what it does and does not protect.",
    tools: ["C++", "OpenSSL", "CMake"],
    tags: ["C++", "Cryptography", "Secure Coding", "AES-256"],
    repos: ["https://github.com/WalBuk28/secure-password-manager-cpp"],
  },

  // ---------------------------------------------------------------------------
  {
    slug: "cryptography",
    title: "Cryptography and encryption",
    tagline: "Cipher design, RSA cryptanalysis and protocol attack simulation",
    description:
      "A modified affine cipher, a ciphertext-only RSA common-modulus attack, and replay and impersonation attacks on Needham-Schroeder and Diffie-Hellman.",
    category: "Coursework · Applied cryptography",
    year: "2025",
    accent: "emerald",
    icon: "KeyRound",
    summary:
      "Industrial-cryptography work spanning a custom modified-Affine cipher, a ciphertext-only RSA common-modulus attack, and replay / impersonation attacks against Needham-Schroeder and Diffie-Hellman variants, each with a mathematical justification and concrete mitigations.",
    context:
      "A combined Industrial Cryptography coursework covering both construction and cryptanalysis: designing a working cipher, then breaking real protocol weaknesses with the underlying number theory.",
    problem:
      "Cryptographic security depends on more than strong primitives: parameter choices, key management and protocol freshness decide whether a system actually holds. The brief required demonstrating both how schemes work and exactly how they fail.",
    approach:
      "I implemented a modified Affine cipher over a 30-character domain, then mounted a ciphertext-only common-modulus RSA attack using the Extended Euclidean Algorithm, and finally simulated replay and impersonation attacks step-by-step against symmetric key-exchange protocols.",
    stack: [
      "Modular Arithmetic",
      "Extended Euclidean Algorithm",
      "RSA",
      "Needham-Schroeder",
      "Diffie-Hellman",
    ],
    metrics: [
      { value: "30", label: "Symbol cipher alphabet", sub: "A to Z plus four symbols, k₀ = 7" },
      { value: "4", label: "Schemes analysed", sub: "Affine · RSA · NS · DH" },
      { value: "0", label: "Private keys needed for the RSA break", sub: "if one message goes to two users sharing a modulus" },
      { value: "10", label: "Unit tests", sub: "in the public repo" },
    ],
    sections: [
      {
        heading: "Modified Affine cipher",
        body: "A 30-symbol alphabet (A to Z plus +, −, *, /) with f(x) = (7x + 4) mod 30. k₀ = 7 is coprime to 30 (gcd = 1), so the map is a bijection; the modular inverse 13 (7·13 ≡ 1 mod 30) drives decryption. The tests check that the map is collision-free across the whole alphabet. Like any affine cipher it has a tiny keyspace and falls to frequency analysis: it illustrates modular arithmetic, not a secure design.",
      },
      {
        heading: "RSA common-modulus attack",
        body: "The precondition: the same message is encrypted to two users who share a modulus N and have coprime public exponents. An interceptor holding both ciphertexts can then recover the plaintext with no private key: solve s·eA + t·eB = 1 with the Extended Euclidean Algorithm, then compute m = CA^s · CB^t mod N. Key generation and parameter separation matter as much as the maths.",
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
      "A coursework demonstrating end-to-end cryptographic literacy, from hand-built ciphers to protocol cryptanalysis, with each weakness paired to a defensible mitigation grounded in academic sources.",
    tools: ["Python", "Number theory"],
    tags: ["Cryptography", "Cryptanalysis", "RSA", "Protocols"],
    repos: ["https://github.com/WalBuk28/industrial-cryptography"],
  },

  // ---------------------------------------------------------------------------
  {
    slug: "software-development",
    title: "Secure coding fundamentals",
    tagline: "Two small Python builds that show security thinking, not just working code",
    description:
      "Two Python builds with security designed in: a calculator that never calls eval, and a card game whose results log is HMAC-signed. Both unit-tested.",
    category: "Coursework (CSEC1003D) · Secure coding",
    year: "2025/26",
    accent: "emerald",
    icon: "Code2",
    summary:
      "Two focused Python projects that demonstrate secure-by-design engineering: a calculator that evaluates expressions without ever calling eval, and an object-oriented card game with a tamper-evident, HMAC-signed results log, each fully unit-tested.",
    context:
      "Good security engineers can build the code they defend. These two Secure Coding (CSEC1003D) projects apply that mindset to everyday programs: assume input is hostile, and protect integrity even where nobody thinks to.",
    problem:
      "The naive version of each is a security hole. A quick calculator reaches for eval(), a remote-code-execution hole. A game writes a plain-text score file anyone can edit. The exercise was to build the correct version of each, and prove it with tests.",
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
      { value: "0", label: "Uses of eval()", sub: "checked by searching the repo source" },
      { value: "29", label: "Unit tests", sub: "14 calculator + 15 card game · unittest, in the repos" },
      { value: "HMAC", label: "Tamper-evident scores", sub: "SHA-256 signed log" },
      { value: "2", label: "Focused builds", sub: "calculator · card game" },
    ],
    sections: [
      {
        heading: "Safe expression calculator",
        body: "The common “quick calculator”, eval(user_input), is a remote-code-execution hole. This one classifies every character explicitly and only ever performs a closed set of maths operations, so hostile input is rejected before any computation.",
        bullets: [
          "Three stages: tokeniser → shunting-yard parser → RPN evaluator (no eval anywhere)",
          "Rejects code injection and illegal characters at the lexer",
          "Guards division-by-zero, domain errors and exponent-based DoS",
        ],
      },
      {
        heading: "Object-oriented War, with integrity",
        body: "A clean OOP implementation (immutable cards, seedable deck, players, rules engine), plus a security twist: every game result is appended to an HMAC-SHA256-signed log, and verification uses a constant-time comparison, so tampering with the score file is detected.",
      },
      {
        heading: "Tested and honest",
        body: "29 unit tests across the two projects, including dedicated security suites (code-injection rejection, input-length and exponent guards, tamper detection, wrong-key verification). Both are on GitHub as secure-calculator and card-war.",
      },
    ],
    outcome:
      "Two small, tested projects that show secure-by-default habits in everyday code, with the tests in the public repos.",
    tools: ["Python", "Git"],
    tags: ["Python", "Secure Coding", "Testing"],
    repos: ["https://github.com/WalBuk28/secure-calculator", "https://github.com/WalBuk28/card-war"],
  },
  // ---------------------------------------------------------------------------
  {
    slug: "contrust-os",
    title: "Construct OS",
    tagline: "Truck and cargo tracking for a friend's transport business",
    description:
      "A web app I built for a friend’s transport business: it tracks the trucks and what is inside them, and relays that to management in a simple way.",
    category: "Personal build · Web app",
    accent: "electric",
    icon: "Truck",
    summary:
      "A web app I built to help a friend run their transportation business: it tracks the trucks and what is inside them, and relays that information to management in a simple way.",
    context:
      "A personal build for a friend’s business, not coursework. Built with Next.js on Supabase.",
    problem:
      "The business needed management to see its trucks and what each one is carrying, in a simple form.",
    approach:
      "I built a Next.js web app backed by Supabase that keeps the trucks and their loads in one place and presents them to management in a simple view.",
    stack: ["Next.js", "Supabase"],
    metrics: [],
    sections: [],
    outcome:
      "A full-stack app built for a real user and a real business need.",
    tools: ["Next.js", "Supabase"],
    tags: ["Full-stack", "Personal build"],
  },
];

// ── SIM3 v2 scores for the incident-response case (MATURITY-ASSESSMENT.md in its public repo).
// Scale 0 to 4 (non-existent to optimising); `target` is the ENISA Basic level. 8 of 45 meet it.
export type Sim3Param = { id: string; name: string; score: number; target: number };
export const sim3: { name: string; params: Sim3Param[] }[] = [
  {
    name: "Organisation",
    params: [
      { id: "O-1", name: "Mandate", score: 1, target: 3 },
      { id: "O-2", name: "Constituency", score: 2, target: 3 },
      { id: "O-3", name: "Authority", score: 1, target: 3 },
      { id: "O-4", name: "Responsibility", score: 1, target: 3 },
      { id: "O-5", name: "Service Description", score: 0, target: 3 },
      { id: "O-6", name: "Public/Media Policy", score: 1, target: 2 },
      { id: "O-7", name: "Service Level Description", score: 0, target: 3 },
      { id: "O-8", name: "Incident Classification", score: 1, target: 2 },
      { id: "O-9", name: "Participation in CSIRT Systems", score: 0, target: 3 },
      { id: "O-10", name: "Organisational Framework", score: 1, target: 3 },
      { id: "O-11", name: "Security Policy", score: 2, target: 2 },
    ],
  },
  {
    name: "Human",
    params: [
      { id: "H-1", name: "Code of Conduct / Ethics", score: 1, target: 2 },
      { id: "H-2", name: "Staff Resilience", score: 1, target: 2 },
      { id: "H-3", name: "Skillset Description", score: 0, target: 2 },
      { id: "H-4", name: "Staff Development", score: 1, target: 2 },
      { id: "H-5", name: "Technical Training", score: 1, target: 1 },
      { id: "H-6", name: "Soft-Skills Training", score: 0, target: 1 },
      { id: "H-7", name: "External Networking", score: 2, target: 2 },
    ],
  },
  {
    name: "Tools",
    params: [
      { id: "T-1", name: "IT Assets & Configurations", score: 1, target: 1 },
      { id: "T-2", name: "Information Sources List", score: 1, target: 2 },
      { id: "T-3", name: "Consolidated Messaging System(s)", score: 2, target: 1 },
      { id: "T-4", name: "Incident Tracking System", score: 1, target: 2 },
      { id: "T-5", name: "Resilient Voice Calls", score: 2, target: 2 },
      { id: "T-6", name: "Resilient Messaging", score: 1, target: 2 },
      { id: "T-7", name: "Resilient Internet Access", score: 2, target: 2 },
      { id: "T-8", name: "Incident Prevention Toolset", score: 1, target: 2 },
      { id: "T-9", name: "Incident Detection Toolset", score: 1, target: 2 },
      { id: "T-10", name: "Incident Resolution Toolset", score: 1, target: 2 },
    ],
  },
  {
    name: "Process",
    params: [
      { id: "P-1", name: "Escalation to Governance Level", score: 1, target: 3 },
      { id: "P-2", name: "Escalation to Press Function", score: 1, target: 2 },
      { id: "P-3", name: "Escalation to Legal Function", score: 0, target: 2 },
      { id: "P-4", name: "Incident Prevention Process", score: 1, target: 2 },
      { id: "P-5", name: "Incident Detection Process", score: 1, target: 2 },
      { id: "P-6", name: "Incident Resolution Process", score: 1, target: 2 },
      { id: "P-7", name: "Specific Incident Processes", score: 0, target: 2 },
      { id: "P-8", name: "Audit & Feedback Process", score: 1, target: 3 },
      { id: "P-9", name: "Emergency Reachability Process", score: 1, target: 2 },
      { id: "P-10", name: "Best-Practice Internet Presence", score: 2, target: 2 },
      { id: "P-11", name: "Secure Information Handling", score: 1, target: 2 },
      { id: "P-12", name: "Information Sources Process", score: 1, target: 2 },
      { id: "P-13", name: "Outreach Process", score: 0, target: 2 },
      { id: "P-14", name: "Governance Reporting Process", score: 1, target: 3 },
      { id: "P-15", name: "Constituency Reporting Process", score: 1, target: 2 },
      { id: "P-16", name: "Meeting Process", score: 1, target: 2 },
      { id: "P-17", name: "Peer Collaboration Process", score: 0, target: 2 },
    ],
  },
];

// ── Evidence weaves: each case's own count drawn as lit cells of the lattice (home page work
// list). `rows` holds each cell's light, 0 (shut) to 1 (brightest). Every count is on the case
// page; the caption says what one cell is. `layout: "path"` steps the cells along the lattice
// at about 30°; `random` redraws the pattern each time it opens (the vault's IV is random).
// `flow` draws a case's pipeline figure instead (A-TIOC: its screens stay private, so its cover
// is the architecture its case page shows, part by part).
export type Weave = {
  rows: number[][];
  caption: string;
  layout?: "grid" | "path";
  random?: boolean;
  flow?: FlowNode[];
};

/** Runs of cells at one light level each, wrapped into rows of `cols`. */
const runs = (cols: number, parts: [n: number, level: number][]) => {
  const flat = parts.flatMap(([n, level]) => Array<number>(n).fill(level));
  return Array.from({ length: Math.ceil(flat.length / cols) }, (_, i) => flat.slice(i * cols, i * cols + cols));
};
/** `n` cells with `lit` of them lit, spread evenly (a golden-ratio sequence, so no clumps). */
const spread = (cols: number, n: number, lit: number, on = 1, off = 0.14) => {
  const order = Array.from({ length: n }, (_, i) => [((i * 0.6180339887) % 1), i] as const)
    .sort((a, b) => a[0] - b[0])
    .map(([, i]) => i);
  const levels = Array<number>(n).fill(off);
  order.slice(0, lit).forEach((i) => (levels[i] = on));
  return Array.from({ length: Math.ceil(n / cols) }, (_, i) => levels.slice(i * cols, i * cols + cols));
};
// f(x) = (7x + 4) mod 30 on the cipher's 30-symbol alphabet: each cell's light is where x goes.
const affine = Array.from({ length: 30 }, (_, x) => 0.18 + (0.82 * ((7 * x + 4) % 30)) / 29);

export const weaves: Record<string, Weave> = {
  "walsec-atioc-hub": {
    rows: [],
    flow: caseStudies.find((c) => c.slug === "walsec-atioc-hub")?.architecture?.nodes,
    caption: "The platform’s pipeline: one lit cell per part, brighter as data moves from the threat feeds and PCAP uploads to the analyst’s screen.",
  },
  "pentest-malware": {
    rows: runs(12, [[2, 1], [15, 0.8], [26, 0.58], [8, 0.4], [45, 0.24]]),
    caption: "96 Nessus findings on the lab host, one cell each. Brighter is more severe: 2 critical, 15 high, 26 medium, 8 low and 45 informational.",
  },
  "network-forensics": {
    rows: [[0.55, 0.55, 0.55, 0.55, 0.55, 0.55, 0.55, 1, 1]],
    layout: "path",
    caption: "The 9 ATT&CK techniques mapped, one cell each, stepping along the lattice in the report’s order: 7 Enterprise, then the 2 ICS techniques, brightest.",
  },
  "incident-response-maturity": {
    rows: sim3.map((d) => d.params.map((p) => (p.score >= p.target ? 1 : 0.16))),
    caption: "The 45 SIM3 parameters assessed, one row per domain: organisation, human, tools, process. Lit: the 8 at or above ENISA Basic.",
  },
  "ai-phishing-detection": {
    rows: spread(20, 236, 101),
    caption: "PhiUSIIL’s 235,795 URLs at one cell per 1,000. Lit: the 43% that are phishing.",
  },
  "secure-scripting": {
    rows: [[1, 1, 1, 1, 1, 0.3, 0.3, 1, 0.3, 1]],
    caption: "The OWASP Top 10 (2021), A01 to A10, one cell each. Lit: the 7 with an automated test. Dim: A06, covered by pinned dependencies, and A07 and A09, shown in code.",
  },
  "secure-password-manager": {
    rows: spread(12, 96, 48),
    random: true,
    caption: "A fresh random 96-bit IV on every save, one cell per bit. The pattern here is drawn at random each time, as the IV is.",
  },
  cryptography: {
    rows: [affine.slice(0, 10), affine.slice(10, 20), affine.slice(20, 30)],
    caption: "The cipher’s 30-symbol alphabet, one cell each. Brightness shows where f(x) = (7x + 4) mod 30 sends the symbol.",
  },
  "software-development": {
    rows: [Array<number>(14).fill(0.78), Array<number>(15).fill(1)],
    caption: "29 unit tests in the two public repos, one cell each: 14 for the calculator, 15 for the card game.",
  },
  "contrust-os": {
    rows: [],
    caption: "No public evidence to show: a personal build for a friend.",
  },
};

// ── Evidence lookup: indicators already published on the case-study pages ──
// Nothing here is new: each value and note repeats what its case study shows. The lookup only
// searches this list. (The incident-response scenario's STIX indicators return when its case
// page shows the STIX graph.)
export type Indicator = { value: string; type: string; slug: string; note: string; aliases?: string[] };

export const indicators: Indicator[] = [
  // pentest-malware
  { value: "192.168.50.130", type: "IPv4", slug: "pentest-malware", note: "The lab host (“Besure Bank”) in the black-box penetration test." },
  { value: "practicalmalwareanalysis[.]com", type: "Domain", slug: "pentest-malware", note: "C2 in the service DLL’s strings (hxxp://practicalmalwareanalysis[.]com/serve.html): the Practical Malware Analysis Lab 3-2 lab IOC, not a live threat." },
  { value: "IPRIP", type: "Service name", slug: "pentest-malware", note: "The persistence service registered by the DLL, masquerading as “Intranet Network Awareness (INA+)”.", aliases: ["INA+", "Intranet Network Awareness", "Intranet Network Awareness (INA+)"] },
  { value: "svchost.exe", type: "Process", slug: "pentest-malware", note: "The malicious DLL is loaded inside svchost.exe (netsvcs group).", aliases: ["netsvcs"] },
  { value: "rundll32.exe", type: "Process", slug: "pentest-malware", note: "Detection: alert when rundll32 executes DLLs from user directories (T1218.011).", aliases: ["rundll32"] },
  { value: "phpinfo.php", type: "File", slug: "pentest-malware", note: "Exposed on the lab web server, found in the penetration test." },
  { value: "CVE-2014-3566", type: "CVE", slug: "pentest-malware", note: "POODLE: SSLv3 enabled on the lab host." },
  { value: "CVE-2016-0800", type: "CVE", slug: "pentest-malware", note: "DROWN: SSLv2 enabled on the lab host." },
  { value: "CVE-2003-0253", type: "CVE", slug: "pentest-malware", note: "Apache 2.0 buffer overflow, referenced in the penetration-test report." },
  { value: "CVE-2007-1001", type: "CVE", slug: "pentest-malware", note: "PHP code injection: the lab host runs PHP 4.2.2, end of life." },
  { value: "CVE-2008-0599", type: "CVE", slug: "pentest-malware", note: "PHP variable handling: the lab host runs PHP 4.2.2, end of life." },
  { value: "T1566.001", type: "ATT&CK", slug: "pentest-malware", note: "Spearphishing Attachment, mapped from the weaponised PDF." },
  { value: "T1204", type: "ATT&CK", slug: "pentest-malware", note: "User Execution, mapped from the malware evidence." },
  { value: "T1218.011", type: "ATT&CK", slug: "pentest-malware", note: "Rundll32, mapped from the malware evidence." },
  { value: "T1543.003", type: "ATT&CK", slug: "pentest-malware", note: "Windows Service: the IPRIP persistence service." },
  { value: "T1112", type: "ATT&CK", slug: "pentest-malware", note: "Modify Registry, mapped from the malware evidence." },
  // network-forensics (synthetic teaching captures)
  { value: "192.168.121.151", type: "IPv4", slug: "network-forensics", note: "The public web server: scanned from three IPs on ports 22, 80 and 443, then the way in (scenario capture)." },
  { value: "wp-login.php", type: "URL path", slug: "network-forensics", note: "Target of the brute force, which was detected but failed." },
  { value: "JSESSIONID", type: "Cookie", slug: "network-forensics", note: "The stolen session cookie, reused to upload anonymous.gif to the ScadaBR HMI." },
  { value: "anonymous.gif", type: "File", slug: "network-forensics", note: "The malicious upload that defaced the ScadaBR HMI." },
  { value: "T1595", type: "ATT&CK", slug: "network-forensics", note: "Active Scanning: the distributed scan from three IPs." },
  { value: "T1592", type: "ATT&CK", slug: "network-forensics", note: "Gather Victim Host Information." },
  { value: "T1046", type: "ATT&CK", slug: "network-forensics", note: "Network Service Discovery." },
  { value: "T1190", type: "ATT&CK", slug: "network-forensics", note: "Exploit Public-Facing Application: initial access through the public web server." },
  { value: "T1110.001", type: "ATT&CK", slug: "network-forensics", note: "Password Guessing: the failed brute force." },
  { value: "T1021.001", type: "ATT&CK", slug: "network-forensics", note: "Remote Desktop Protocol: the pivot into the operations workstation." },
  { value: "T1552.001", type: "ATT&CK", slug: "network-forensics", note: "Credentials In Files: the stolen session cookie." },
  // The submitted report gave these two as T0862 and T0880 by mistake: a lookup of the old ID finds
  // the corrected one, and the old IDs aren't listed as indicators of their own.
  { value: "T0866", type: "ATT&CK for ICS", slug: "network-forensics", note: "Exploitation of Remote Services: the malicious POST to the HMI web service. The submitted report gave it as T0862 (Supply Chain Compromise) by mistake.", aliases: ["T0862"] },
  { value: "T0832", type: "ATT&CK for ICS", slug: "network-forensics", note: "Manipulation of View: the defaced HMI. The submitted report gave it as T0880 (Loss of Safety) by mistake.", aliases: ["T0880"] },
  // ai-phishing-detection
  { value: "T1566.002", type: "ATT&CK", slug: "ai-phishing-detection", note: "Phishing, named as the initial-access vector the detector addresses." },
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
    period: "Jun to Sep 2025",
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
  period: "Oct 2023 to Jul 2026",
};

export const navLinks = [
  { label: "Work", href: "#work" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];
