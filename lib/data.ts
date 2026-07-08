// =============================================================================
//  Portfolio content — extracted & distilled from Waleed's coursework,
//  final-year project (WalSec A-TIOC Hub viva deck), internship CV,
//  ConstructOS/ConTrust blueprint and technical reports.
//  Edit any string here to update the live site. One source of truth.
// =============================================================================

export const profile = {
  name: "Waleed Bukhari",
  fullName: "Syed Muhammad Waleed Bukhari",
  role: "Cybersecurity Engineer & Developer",
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
  availability: "Open to Security Engineering & SOC roles — 2026",
  summary:
    "BSc (Hons) Cybersecurity from De Montfort University, Dubai, and a hands-on builder. I specialise in threat intelligence, network forensics and SOC automation — and I ship the software to back it up, from a fully-local, LLM-powered SIEM-Lite platform to ML phishing detectors and C++ security tooling. Industry experience across Telstra, Mastercard, Deloitte and Receptive Tech, where I cut response time, hardened endpoints and contained simulated attacks.",
  stats: [
    { value: 7, suffix: "+", label: "Technical projects shipped" },
    { value: 4, suffix: "", label: "Industry programs" },
    { value: 30, suffix: "+", label: "MITRE ATT&CK techniques mapped" },
    { value: 100, suffix: "%", label: "Local, air-gapped AI analysis" },
  ],
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

// ── Skills radar (self-assessed proficiency across core domains) ───────────
export const skillRadar: { axis: string; short: string; value: number }[] = [
  { axis: "Threat Intel & SOC", short: "Threat Intel", value: 92 },
  { axis: "Network Forensics", short: "Forensics", value: 90 },
  { axis: "Offensive Security", short: "Offensive", value: 82 },
  { axis: "Secure Software Dev", short: "Software", value: 85 },
  { axis: "Applied AI / ML", short: "AI / ML", value: 84 },
  { axis: "Cryptography", short: "Crypto", value: 78 },
  { axis: "Cloud & DevSecOps", short: "Cloud", value: 76 },
];

export type SkillGroup = { title: string; icon: string; skills: string[] };

export const skillGroups: SkillGroup[] = [
  {
    title: "Threat Intel & SOC",
    icon: "Radar",
    skills: [
      "MITRE ATT&CK (Enterprise + ICS)",
      "SIEM / SOC Operations",
      "Splunk",
      "Wazuh / EDR",
      "Threat Hunting",
      "Incident Response (NIST SP 800-61)",
      "OSINT — ThreatFox · URLhaus · Abuse.ch",
    ],
  },
  {
    title: "Offensive & Forensics",
    icon: "Bug",
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
    skills: [
      "Python — Flask · PyShark · scikit-learn",
      "C++",
      "React 18 / Next.js",
      "Local LLMs — Ollama · Llama 3.2",
      "RAG + BGE-M3 embeddings",
      "ML — XGBoost · Random Forest · MLP",
      "SQL / SQLite (WAL)",
    ],
  },
  {
    title: "Cloud & DevSecOps",
    icon: "Cloud",
    skills: [
      "Microsoft Azure (Security focus)",
      "Docker / Docker Compose",
      "CI/CD (GitHub Actions)",
      "SAST / DAST",
      "JWT · bcrypt · RBAC",
      "ISO 27001 / GDPR",
    ],
  },
  {
    title: "Cryptography",
    icon: "KeyRound",
    skills: [
      "AES-256 / SHA-256",
      "RSA & Cryptanalysis",
      "Key-Exchange Protocols",
      "Symmetric & Public-Key Crypto",
      "TLS / SSL Hardening",
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
    category: "Final-Year Project · SOC Platform",
    year: "2025–26",
    accent: "emerald",
    icon: "ShieldCheck",
    featured: true,
    demo: "https://walsec.com",
    summary:
      "An air-gapped SIEM-Lite that automates deep packet inspection and grounds a local LLM in live threat intelligence — giving SMEs enterprise-grade threat hunting without the cloud, the cost, or the GDPR risk.",
    context:
      "WalSec A-TIOC Hub was my BSc final-year development project (CTEC3451D). It is a fully self-hosted “SIEM-Lite” that bridges automated network forensics with locally-hosted Large Language Models, so a resource-constrained Security Operations Centre can triage threats with AI that never leaves its own perimeter.",
    problem:
      "Modern SOCs drown in noise — an estimated 67% of security alerts are ignored due to volume and cognitive overload. Enterprise SIEMs are prohibitively expensive for SMEs, and pushing sensitive telemetry to cloud AI (e.g. OpenAI) creates serious GDPR and data-sovereignty exposure. The challenge: deliver grounded, automated threat analysis entirely on-premise.",
    approach:
      "I built a decoupled architecture: a cyberpunk-styled React 18 + Vite SPA over a Flask 3.0 API on Eventlet, offloading CPU-heavy PyShark dissection to Python multiprocessing pools. A RAG pipeline (BGE-M3 multi-vector embeddings + Ollama-hosted Llama 3.2 / Qwen2.5) grounds every inference in evidence pulled from a WAL-optimised SQLite store, so the model correlates findings to MITRE ATT&CK instead of hallucinating them.",
    stack: [
      "React 18 + Vite",
      "Flask 3.0 (Eventlet)",
      "Python Multiprocessing",
      "PyShark / TShark",
      "Ollama · Llama 3.2 / Qwen2.5",
      "RAG · BGE-M3",
      "SQLite (WAL)",
      "WebSockets",
      "Leaflet",
      "JWT + bcrypt RBAC",
      "Docker Compose",
    ],
    metrics: [
      { value: "100%", label: "Hallucination prevention", sub: "Evidentiary-vacuum tested" },
      { value: "1.8–2.4s", label: "AI time-to-first-token", sub: "Async SOC triage" },
      { value: "3,200+", label: "Concurrent threat writes", sub: "SQLite WAL, no locking" },
      { value: "30+", label: "MITRE ATT&CK techniques", sub: "via 15 custom signatures" },
    ],
    architecture: {
      title: "Decoupled, fully-local pipeline",
      nodes: [
        { id: "osint", label: "OSINT Feeds\nThreatFox · URLhaus", kind: "in" },
        { id: "pcap", label: "PCAP Upload\n≤ 50MB DPI", kind: "in" },
        { id: "flask", label: "Flask 3.0 API\nEventlet + multiprocessing", kind: "core" },
        { id: "db", label: "SQLite (WAL)\nACID evidence store", kind: "core" },
        { id: "rag", label: "RAG · BGE-M3\nLlama 3.2 (Ollama)", kind: "ai" },
        { id: "ui", label: "React SPA\nWebSocket telemetry", kind: "out" },
      ],
    },
    sections: [
      {
        heading: "Automated forensic ingestion",
        body: "The system eliminates manual TShark triage. Asynchronous Deep Packet Inspection parses uploaded PCAPs (hard-capped at 50MB via byte-pointer logic to protect the event loop), while APScheduler workers pull fresh OSINT from ThreatFox and URLhaus every 30–60 minutes.",
        bullets: [
          "Normalisation pipeline strips port metadata for uniform IP vectors",
          "Database-level deduplication via composite (Type + Value) keys",
          "Controlled, scheduled enrichment from Abuse.ch and ip-api.com",
        ],
      },
      {
        heading: "Grounded AI, not generative guesswork",
        body: "Unbounded LLMs hallucinate threat intel in a vacuum. I subjected the system to “Evidentiary Vacuum” testing — querying non-existent IPs and domains — and achieved a 100% hallucination-prevention rate. Strict prompt boundaries force SQL joins to override model generation; with no local evidence the model returns “Insufficient local evidence” rather than fabricating.",
      },
      {
        heading: "Dynamic threat scoring",
        body: "A 100-point scalar function ranks indicators so analysts hit the most critical threats first, combining base confidence, a recency modifier, a malware-family boost and tag-severity weighting.",
      },
      {
        heading: "Engineered for robustness",
        body: "Cooperative multitasking under Eventlet initially caused cron jobs to miss triggers by up to 14 minutes under heavy PyShark load; I solved it by isolating the dissection engine into detached multiprocessing pools. Comprehensive try/except wrappers keep core threading stable through catastrophic external-API outages, and byte-pointer logic (file.seek) physically halts memory buffering beyond 50MB.",
      },
    ],
    outcome:
      "Delivered a viable, zero-configuration SIEM-Lite for resource-constrained environments with 100% local execution — bridging raw TShark packet inspection and strategic, C-level MITRE reporting via generative AI. Roadmap: Redis-backed rate limiting, agentic RAG (AI-instructed historical PCAP re-scans), and Kubernetes scaling for concurrent inference.",
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
    title: "Software Engineering",
    tagline: "Systems-level C++ and Python — from a secure vault to games",
    category: "Software Development",
    year: "2023–25",
    accent: "emerald",
    icon: "Code2",
    summary:
      "A breadth of software engineering across C++ and Python — including a CLI password manager built on AES-256 and SHA-256, plus Python applications such as calculators and card games — showing security-minded systems programming alongside clean application development.",
    context:
      "Beyond security research I build software. This case study collects the engineering work that backs my defensive skill set — from low-level, security-focused C++ to approachable Python applications.",
    problem:
      "Good security engineers can read and write the code they defend. The goal across these projects was to apply sound engineering — correct cryptographic usage, clear structure and usable interfaces — rather than treat code as a black box.",
    approach:
      "I built a CLI-based Secure Password Manager in C++ that applies AES-256 encryption with SHA-256 hashing to store secrets safely, following secure-storage principles. Alongside it, Python projects (calculators, card games and utilities) sharpened application logic, state handling and clean interface design.",
    stack: ["C++", "AES-256", "SHA-256", "Python", "OOP & Data Structures", "CLI / GUI"],
    metrics: [
      { value: "C++", label: "Secure password manager", sub: "AES-256 + SHA-256" },
      { value: "Python", label: "Apps & games", sub: "calculators, card games" },
      { value: "2", label: "Core languages", sub: "systems + scripting" },
    ],
    sections: [
      {
        heading: "Secure Password Manager (C++)",
        body: "A command-line credential vault using AES-256 for confidentiality and SHA-256 for integrity / hashing — a focused exercise in applying cryptographic primitives correctly and implementing secure secret-storage principles in a systems language.",
      },
      {
        heading: "Python applications",
        body: "A set of Python projects — calculators, a multiplayer card game using OOP and logic modules, and utilities — used to build fluency in program logic, state management, input handling and clean, maintainable structure.",
      },
      {
        heading: "Engineering practice",
        body: "Across both languages the emphasis is on readable, well-structured code and an understanding of the trade-offs — exactly the developer literacy that strengthens day-to-day security engineering.",
      },
    ],
    outcome:
      "A developer’s foundation that complements the security work — the ability to build, not just assess — spanning systems-level C++ and pragmatic Python.",
    tools: ["C++", "Python", "Git"],
    tags: ["C++", "Python", "Secure Coding"],
  },
];

// ── Experience (dates aligned to CV) ───────────────────────────────────────
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
      "Improved threat-detection accuracy by 20% by refining SIEM rules and tuning alert thresholds, reducing false positives during triage.",
      "Contributed to a 25% drop in endpoint vulnerabilities via scans, patch verification and flagging misconfigurations across assets.",
      "Cut incident-response time 15–20% by updating escalation matrices and drafting playbooks.",
    ],
  },
  {
    company: "Telstra Cybersecurity",
    role: "Cyber Security Analyst",
    period: "2025",
    location: "Virtual Experience",
    kind: "Job Simulation",
    points: [
      "Responded to a simulated malware attack, reducing threat impact by 80% through timely containment and mitigation.",
      "Performed post-incident analysis, identifying 3 key vulnerabilities and recommending 5 targeted hardening improvements.",
    ],
  },
  {
    company: "Mastercard Cybersecurity",
    role: "Security Awareness Analyst",
    period: "2025",
    location: "Virtual Experience",
    kind: "Job Simulation",
    points: [
      "Served as an analyst on Mastercard’s Security Awareness Team, identifying and reporting phishing threats.",
      "Assessed gaps in employee security awareness and helped implement targeted training across high-risk business units.",
    ],
  },
  {
    company: "Deloitte Australia Cybersecurity",
    role: "Cyber Security Analyst",
    period: "2025",
    location: "Virtual Experience",
    kind: "Job Simulation",
    points: [
      "Analysed web-activity logs for cybersecurity incidents and investigated suspicious user activity.",
      "Supported a client through a cyber-security breach, answering investigative questions to identify the source.",
    ],
  },
];

export type Certification = { name: string; issuer: string; date: string; detail?: string };

export const certifications: Certification[] = [
  {
    name: "Cybersecurity Professional Certificate",
    issuer: "Google",
    date: "May 2025",
    detail: "8-course program — detection & response, Python automation, Linux, SQL, threat analysis",
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
];

export const education = {
  degree: "BSc (Hons) Cyber Security",
  school: "De Montfort University, Dubai",
  result: "EQF Level 6 · Final-year / recent graduate",
  period: "2023 – 2026",
};

export const navLinks = [
  { label: "Work", href: "#work" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];
