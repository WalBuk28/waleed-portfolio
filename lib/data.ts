// =============================================================================
//  Portfolio content — extracted & distilled from Waleed's coursework,
//  final-year project, internship CV and technical reports.
//  Edit any string here to update the live site.
// =============================================================================

export const profile = {
  name: "Waleed Bukhari",
  fullName: "Syed Muhammad Waleed Bukhari",
  role: "Cybersecurity Engineer & Developer",
  // Rotating words for the hero headline
  rotatingRoles: [
    "Threat Intelligence",
    "Network Forensics",
    "SOC Automation",
    "Secure Software",
  ],
  tagline:
    "I build the bridge between deep network forensics and intelligent automation — turning raw packets, malware and threat feeds into decisions a SOC can act on.",
  location: "Dubai, United Arab Emirates",
  email: "muhammadwaleed2280@gmail.com",
  phone: "+971 50 690 8284",
  linkedin: "https://linkedin.com/in/muhammad-waleed-b43997202",
  github: "https://github.com/WalBuk28",
  availability: "Open to Security Engineering & SOC roles — 2026",
  summary:
    "First-Class BSc Cybersecurity graduate (De Montfort University, Dubai) and hands-on builder. I specialise in threat intelligence, network forensics and SOC automation, and I ship the software to back it up — from a localised, LLM-powered SIEM-Lite platform to ML phishing detectors and C++ security tooling. Internships across Telstra, Mastercard, Deloitte and Receptive Tech, where I cut MTTR, hardened endpoints and contained simulated attacks.",
  stats: [
    { value: "7+", label: "Technical projects shipped" },
    { value: "4", label: "Industry internships" },
    { value: "73%", label: "GPA — First Class Honours" },
    { value: "6+", label: "Professional certifications" },
  ],
};

export type SkillGroup = {
  title: string;
  icon: string;
  skills: string[];
};

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
      "OSINT (ThreatFox, URLhaus, Abuse.ch)",
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
      "Reverse Engineering (IDA, GDB, REMnux)",
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
      "Python (Flask, PyShark, scikit-learn)",
      "C++",
      "React 18 / Next.js",
      "Local LLMs (Ollama, Llama 3.2)",
      "RAG + BGE-M3 embeddings",
      "ML (XGBoost, Random Forest, MLP)",
      "SQL / SQLite (WAL)",
    ],
  },
  {
    title: "Cloud & DevSecOps",
    icon: "Cloud",
    skills: [
      "Microsoft Azure (Security focus)",
      "AWS (EC2 / ECS / EKS)",
      "Docker / Docker Compose",
      "CI/CD (GitHub Actions)",
      "SAST / DAST",
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

export type Metric = { label: string; value: string; sub?: string };
export type DetailSection = { heading: string; body: string; bullets?: string[] };

export type CaseStudy = {
  slug: string;
  title: string;
  tagline: string;
  category: string;
  year: string;
  accent: "emerald" | "electric";
  icon: string; // lucide icon name
  featured?: boolean;
  summary: string; // short — used on the card
  context: string; // overview paragraph on detail page
  problem: string;
  approach: string;
  stack: string[];
  metrics: Metric[];
  sections: DetailSection[];
  outcome: string;
  tools: string[];
  tags: string[];
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
    summary:
      "An air-gapped SIEM-Lite that automates deep packet inspection and grounds a local LLM in live threat intelligence — giving SMEs enterprise-grade threat hunting without the cloud, the cost, or the GDPR risk.",
    context:
      "WalSec A-TIOC Hub was my BSc final-year development project (CTEC3451D), supervised by Prof. Dunja Majstorovic. It is a fully self-hosted “SIEM-Lite” that bridges automated network forensics with locally-hosted Large Language Models, so a resource-constrained Security Operations Centre can triage threats with AI that never leaves its own perimeter.",
    problem:
      "Modern SOCs drown in noise — an estimated 67% of security alerts are ignored due to volume and cognitive overload. Enterprise SIEMs are prohibitively expensive for SMEs, and pushing sensitive telemetry to cloud AI (e.g. OpenAI) creates serious GDPR and data-sovereignty exposure. The challenge: deliver grounded, automated threat analysis entirely on-premise.",
    approach:
      "I built a decoupled microservices architecture: a cyberpunk-styled React 18 + Vite SPA over a Flask 3.0 API on Eventlet, offloading CPU-heavy PyShark dissection to Python multiprocessing pools. A RAG pipeline (BGE-M3 multi-vector embeddings + Ollama-hosted Llama 3.2 / Qwen2.5) grounds every inference in evidence pulled from a WAL-optimised SQLite store, so the model correlates findings to MITRE ATT&CK instead of hallucinating them.",
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
        body: "Cooperative multitasking under Eventlet initially caused cron jobs to miss triggers by up to 14 minutes under heavy PyShark load; I solved it by isolating the dissection engine into detached multiprocessing pools. Comprehensive try/except wrappers keep core threading stable through catastrophic external-API outages.",
      },
    ],
    outcome:
      "Delivered a viable, zero-configuration SIEM-Lite for resource-constrained environments with 100% local execution. The project was highly commended by faculty and officially recommended for publication. Roadmap: Redis-backed rate limiting, agentic RAG (AI-instructed historical PCAP re-scans), and Kubernetes scaling for concurrent inference.",
    tools: ["React", "Flask", "PyShark", "Ollama", "SQLite", "Docker", "Leaflet"],
    tags: ["SOC Automation", "LLM / RAG", "Network Forensics", "Full-Stack"],
  },

  // ---------------------------------------------------------------------------
  {
    slug: "pentest-malware",
    title: "Penetration Testing & Malware Investigations",
    tagline: "Black-box pentest of a banking app + multi-sample malware reverse engineering",
    category: "Offensive Security · Reverse Engineering",
    year: "2025–26",
    accent: "electric",
    icon: "Bug",
    featured: true,
    summary:
      "A full black-box penetration test of a legacy banking application (96 findings) paired with an advanced forensic investigation of a weaponised-PDF → service-DLL → downloader malware cluster, mapped end-to-end to MITRE ATT&CK.",
    context:
      "Two complementary engagements: a black-box penetration test against a simulated legacy banking host (“Besure Bank”, 192.168.50.130), and a CSEC3001 advanced forensic investigation reverse-engineering four malicious artefacts plus a stack-overflow binary.",
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
    tagline: "Reconstructing a multi-stage SCADA attack from packets — plus secure network design",
    category: "Digital Forensics · OT/ICS",
    year: "2025",
    accent: "emerald",
    icon: "Network",
    featured: true,
    summary:
      "A Wireshark-driven forensic reconstruction of a four-stage attack that pivoted from a public web server into a water-treatment OT network, scored with a CARVER matrix and mapped to MITRE ATT&CK for Enterprise and ICS — backed by hands-on Cisco Packet Tracer network design.",
    context:
      "A CSEC3002 Cyber-Physical Systems Security investigation into a real multi-stage intrusion at “CTI Utilities”, a water-treatment operator, combined with enterprise network-design work in Cisco Packet Tracer (VLAN/NAT/static routing) that demonstrates the segmentation the victim lacked.",
    problem:
      "On 15 May 2024 an external attacker defaced a safety-critical HMI by stepping-stone from a low-value public asset into a secure OT network. The investigation had to answer the brief’s forensic questions from packet evidence alone, quantify asset risk, and recommend controls that would have broken the kill chain.",
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
    sections: [
      {
        heading: "The kill chain, from the wire",
        body: "Packet evidence traced a textbook stepping-stone intrusion across four stages, each confirmed by timestamped flows.",
        bullets: [
          "Recon: distributed scan from 3 IPs against the Web Server (192.168.121.151) — ports 22/80/443",
          "Initial access: brute force on /wp-login.php → WordPress admin compromise",
          "Pivot: Web Server → GIT Server (dual IT/OT firewall access) → RDP (3389) to Operations WS",
          "ICS impact: stolen JSESSIONID cookie → malicious upload (anonymous.gif) defacing the ScadaBR HMI",
        ],
      },
      {
        heading: "Risk-based prioritisation (CARVER)",
        body: "The CARVER matrix ranked the VPN Server (52) and the LIMS lab (49) as the most attractive targets — both running end-of-life Ubuntu — surfacing the systemic problem of unsupported software across critical assets.",
      },
      {
        heading: "Findings & recommendations",
        body: "Three root-cause findings drove a prioritised remediation plan.",
        bullets: [
          "Insufficient network segmentation (CRITICAL) — strict IT/OT firewall rules",
          "Weak access control — enforce MFA on all remote/RDP access",
          "Legacy/EOL systems — emergency patch-management programme",
          "Hard HMI session timeouts to neutralise stolen-cookie hijacking",
        ],
      },
      {
        heading: "MITRE ATT&CK mapping",
        body: "Behaviours were mapped across both matrices: Enterprise (T1595 Active Scanning, T1190 Exploit Public-Facing App, T1110.001 Brute Force, T1021.001 RDP, T1552.001 Credentials in Files) and ICS (T0862 Exploitation of Remote Services, T0880 Manipulation of View) and visualised in ATT&CK Navigator.",
      },
      {
        heading: "Secure-by-design networking",
        body: "Complementary Cisco Packet Tracer work built high-availability corporate topologies using VLAN segmentation, NAT and static routing — the exact controls whose absence enabled the CTI Utilities breach.",
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
      "An AI-for-Cybersecurity coursework project building and critically evaluating supervised models for phishing-URL classification on the PhiUSIIL Phishing URL dataset — with a deliberate focus on adversarial robustness rather than headline accuracy.",
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
        body: "Strong discriminators emerged from URL structure: legitimate business URLs trend short (SEO-driven), while phishing URLs show high length variance, random tokens and disposable infrastructure signals such as IsHTTPS=0.",
      },
      {
        heading: "Model comparison",
        body: "All five families exceeded a macro-F1 of 0.99 on clean data, with the MLP reaching 99.97% accuracy. Tree ensembles offered the best stability/efficiency trade-off for real-time deployment.",
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
    tagline: "Cipher design, RSA cryptanalysis and protocol-level attack simulation",
    category: "Applied Cryptography",
    year: "2025",
    accent: "emerald",
    icon: "KeyRound",
    summary:
      "Industrial-cryptography work spanning a custom modified-Affine cipher, a ciphertext-only RSA common-modulus attack, and replay/impersonation attacks against Needham-Schroeder and Diffie-Hellman variants — each with a mathematical justification and concrete mitigations.",
    context:
      "A combined Industrial Cryptography coursework (CSEC2004) covering both construction and cryptanalysis — designing a working cipher, then breaking real protocol weaknesses with the underlying number theory.",
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
        body: "When two users share a modulus N with coprime public exponents, an interceptor can recover plaintext with no private key: solve s·eA + t·eB = 1 via the Extended Euclidean Algorithm, then compute m = CA^s · CB^t mod N. A potent reminder (per Boneh’s RSA survey) that key generation and parameter separation matter as much as the maths.",
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
    tagline: "Real-time logistics & fleet operations platform for construction",
    category: "Full-Stack · Data Visualisation",
    year: "2024–25",
    accent: "electric",
    icon: "Truck",
    summary:
      "A management platform that gives construction firms a real-time operational picture of their vehicle fleet — turning scattered spreadsheets into interactive dashboards, automated sheets and live tracking that managers can act on instantly.",
    context:
      "ConTrust OS is a full-stack operations platform built to help construction companies track and manage vehicle logistics — consolidating fragmented, manual record-keeping into a single source of truth for managers.",
    problem:
      "Construction logistics typically run on disconnected spreadsheets and manual updates, leaving managers without a timely, accurate view of fleet status, utilisation and movement — which drives delays, idle assets and costly miscommunication.",
    approach:
      "I designed an operations dashboard around real-time data accessibility: interactive graphs and automated sheets surface key metrics at a glance, while structured data capture replaces ad-hoc spreadsheets so decisions are made on current, trustworthy numbers.",
    stack: [
      "Data Visualisation",
      "Interactive Dashboards",
      "Automated Reporting",
      "Relational Data Modelling",
      "Web Application",
    ],
    metrics: [
      { value: "1", label: "Source of truth", sub: "replacing scattered sheets" },
      { value: "Real-time", label: "Operational visibility", sub: "for fleet managers" },
      { value: "Auto", label: "Generated reports", sub: "from live data" },
    ],
    sections: [
      {
        heading: "Operational visibility",
        body: "Managers get a live, at-a-glance picture of vehicle logistics — status, assignment and movement — instead of waiting on manually-compiled reports.",
      },
      {
        heading: "Data visualisation & automation",
        body: "Interactive graphs and automated sheets convert raw operational data into actionable insight, reducing the manual effort of keeping records current and consistent.",
      },
    ],
    outcome:
      "A practical demonstration of applying software engineering and data-visualisation to a real industry workflow — making real-time operational data readily accessible to the people who make the decisions.",
    tools: ["Web App", "Dashboards", "Data Viz"],
    tags: ["Full-Stack", "Data Visualisation", "Product"],
  },

  // ---------------------------------------------------------------------------
  {
    slug: "software-development",
    title: "Software Engineering",
    tagline: "Systems-level C++ and Python — from a secure password manager to games",
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
    stack: [
      "C++",
      "AES-256",
      "SHA-256",
      "Python",
      "OOP & Data Structures",
      "CLI / GUI",
    ],
    metrics: [
      { value: "C++", label: "Secure password manager", sub: "AES-256 + SHA-256" },
      { value: "Python", label: "Apps & games", sub: "calculators, card games" },
      { value: "2", label: "Core languages", sub: "systems + scripting" },
    ],
    sections: [
      {
        heading: "Secure Password Manager (C++)",
        body: "A command-line credential vault using AES-256 for confidentiality and SHA-256 for integrity/hashing — a focused exercise in applying cryptographic primitives correctly and implementing secure secret-storage principles in a systems language.",
      },
      {
        heading: "Python applications",
        body: "A set of Python projects — calculators, card games and utilities — used to build fluency in program logic, state management, input handling and clean, maintainable structure.",
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

export type Experience = {
  company: string;
  role: string;
  period: string;
  location: string;
  points: string[];
};

export const experience: Experience[] = [
  {
    company: "Telstra Cybersecurity",
    role: "Cybersecurity Intern",
    period: "Jul 2025 – Sep 2025",
    location: "Remote",
    points: [
      "Responded to a simulated malware attack, reducing threat impact by 80% through timely isolation and containment.",
      "Performed post-incident analysis, identifying 3 key vulnerabilities and recommending 5 hardening improvements.",
    ],
  },
  {
    company: "Mastercard",
    role: "Cybersecurity Analyst Intern",
    period: "Aug 2025 – Sep 2025",
    location: "Remote",
    points: [
      "Served on Mastercard’s Security Awareness Team, identifying and reporting phishing threats.",
      "Assessed gaps in employee cybersecurity awareness and helped implement targeted training programmes.",
    ],
  },
  {
    company: "Deloitte Australia",
    role: "Cybersecurity Intern",
    period: "2025",
    location: "Remote",
    points: [
      "Analysed web-activity logs for cybersecurity incidents and investigated suspicious user activity.",
    ],
  },
  {
    company: "Receptive Tech Communications",
    role: "Cyber Security Intern",
    period: "Sep 2023 – 2025",
    location: "Lahore, Pakistan (Hybrid)",
    points: [
      "Improved threat-detection accuracy by 20% by refining SIEM rules and tuning alert thresholds.",
      "Contributed to a 25% drop in endpoint vulnerabilities via scans and patch verification.",
      "Cut incident-response time 15–20% by updating escalation matrices.",
    ],
  },
];

export type Certification = { name: string; issuer: string; date: string };

export const certifications: Certification[] = [
  { name: "Certified in Cybersecurity (CC)", issuer: "ISC²", date: "Mar 2026" },
  { name: "Azure Security Engineer Associate", issuer: "Microsoft", date: "In Progress" },
  { name: "Security, Compliance & Identity Fundamentals", issuer: "Microsoft", date: "In Progress" },
  { name: "Generative AI Engineering Professional", issuer: "IBM", date: "Aug 2025" },
  { name: "Certified Foundations Associate (AI & Cloud)", issuer: "Oracle", date: "Jul 2025" },
  { name: "Cybersecurity Professional Certificate", issuer: "Google", date: "May 2025" },
];

export const education = {
  degree: "BSc (Hons) Cyber Security",
  school: "De Montfort University, Dubai",
  result: "First Class Honours · GPA 73%",
  period: "2023 – 2026",
};

export const navLinks = [
  { label: "Work", href: "#work" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];
