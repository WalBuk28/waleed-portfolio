import { indicators, type KillStage } from "@/lib/data";
import { ATTACK_NOTICE, ATTACK_RELEASED, ATTACK_VERSION, enterprise } from "@/lib/attack";
import { AttackMotion } from "./AttackMotion";

// The nine techniques the network-forensics report maps (docs/FACTS.md, with the corrected ICS
// IDs). A sub-technique lights its parent's tile and is named on it. `step` is the order the
// light's path visits them, following the report's four kill-chain stages.
type Mapped = { id: string; tile: string; name: string; tactic: string; step?: number };
const MAPPED: Mapped[] = [
  { id: "T1595", tile: "T1595", name: "Active Scanning", tactic: "Reconnaissance", step: 1 },
  { id: "T1592", tile: "T1592", name: "Gather Victim Host Information", tactic: "Reconnaissance" },
  { id: "T1190", tile: "T1190", name: "Exploit Public-Facing Application", tactic: "Initial Access", step: 2 },
  { id: "T1110.001", tile: "T1110", name: "Password Guessing", tactic: "Credential Access" },
  { id: "T1552.001", tile: "T1552", name: "Credentials In Files", tactic: "Credential Access" },
  { id: "T1046", tile: "T1046", name: "Network Service Discovery", tactic: "Discovery" },
  { id: "T1021.001", tile: "T1021", name: "Remote Desktop Protocol", tactic: "Lateral Movement", step: 3 },
];
const ICS: Mapped[] = [
  { id: "T0866", tile: "T0866", name: "Exploitation of Remote Services", tactic: "Initial Access, Lateral Movement (ICS)", step: 4 },
  { id: "T0832", tile: "T0832", name: "Manipulation of View", tactic: "Impact (ICS)", step: 5 },
];
const byTile = new Map([...MAPPED, ...ICS].map((m) => [m.tile, m]));
const note = (id: string) => indicators.find((i) => i.slug === "network-forensics" && i.value === id)?.note ?? "";

/** "T1110.001" as a main ID and its sub-technique part, so a narrow tile can stack them. */
function Id({ id }: { id: string }) {
  const [main, sub] = id.split(".");
  return (
    <>
      <span>{main}</span>
      {sub && <span className="attack__sub">.{sub}</span>}
    </>
  );
}

/**
 * The ATT&CK figure on the network-forensics page (DESIGN.md §11, from concept C): every
 * Enterprise technique of the current matrix as a closed cell under its tactic, the nine the
 * report maps lit and named, and an ICS appendix. The light's path steps through the four
 * kill-chain stages as the reader scrolls (AttackMotion). The drawing is decorative; the
 * stage list and the table carry the same facts as text.
 */
export function AttackFigure({ stages }: { stages: KillStage[] }) {
  return (
    <figure className="attack" aria-labelledby="attack-cap">
      <div className="attack__scene" data-attack>
        <div className="attack__matrix" aria-hidden="true">
          {enterprise.map((t) => (
            <div key={t.id} className="attack__col">
              <span className="attack__tactic">{t.name}</span>
              <ul className="attack__tiles">
                {t.techniques.map(([id]) => {
                  const m = byTile.get(id);
                  return m ? (
                    <li key={id} className="attack__tile is-lit" data-step={m.step}>
                      <Id id={m.id} />
                    </li>
                  ) : (
                    <li key={id} className="attack__tile" />
                  );
                })}
              </ul>
            </div>
          ))}
          <div className="attack__col attack__col--ics">
            <span className="attack__tactic">ICS</span>
            <ul className="attack__tiles">
              {ICS.map((m) => (
                <li key={m.id} className="attack__tile is-lit is-ics" data-step={m.step}>
                  <Id id={m.id} />
                </li>
              ))}
            </ul>
          </div>
          <svg className="attack__path" data-attack-path>
            <path />
          </svg>
        </div>
        <ol className="attack__stages">
          {stages.map((s, i) => (
            <li key={s.stage} className="attack__stage" data-stage={i}>
              <span className="attack__no mono">{s.stage}</span>
              <span className="attack__label">{s.label}</span>
              <span className="attack__detail">{s.detail}</span>
              <span className="attack__tech mono">{s.technique}</span>
            </li>
          ))}
        </ol>
      </div>
      <figcaption id="attack-cap" className="attack__cap">
        The nine techniques the report maps, lit on the MITRE ATT&amp;CK Enterprise matrix (v{ATTACK_VERSION},{" "}
        {ATTACK_RELEASED}: every technique a cell, in Navigator’s order under its tactic), with the two ICS
        techniques beside it. The light follows the attack through its four stages.
      </figcaption>
      <table className="attack__table">
        <caption className="sr-only">The nine mapped techniques</caption>
        <thead>
          <tr>
            <th scope="col">Technique</th>
            <th scope="col">Tactic</th>
            <th scope="col">In this case</th>
          </tr>
        </thead>
        <tbody>
          {[...MAPPED, ...ICS].map((m) => (
            <tr key={m.id}>
              <th scope="row">
                <span className="mono">{m.id}</span> {m.name}
              </th>
              <td>{m.tactic}</td>
              <td>{note(m.id)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="attack__notice">
        {ATTACK_NOTICE} MITRE ATT&amp;CK and ATT&amp;CK are registered trademarks of The MITRE Corporation.
      </p>
      <AttackMotion />
    </figure>
  );
}
