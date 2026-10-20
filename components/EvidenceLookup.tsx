"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import type { Indicator } from "@/lib/data";

// Compare indicators the way an analyst types them: any case, defanged or not, with or without
// a scheme, a leading slash or a trailing path, and ATT&CK parent IDs.
const norm = (v: string) =>
  v
    .trim()
    .toLowerCase()
    .replace(/\[\.\]/g, ".")
    .replace(/^h(?:tt|xx)ps?:\/\//, "")
    .replace(/^\/+|\/+$/g, "");

function find(indicators: Indicator[], query: string) {
  const q = norm(query);
  return indicators.filter((ind) =>
    [ind.value, ...(ind.aliases ?? [])].some((v) => {
      const n = norm(v);
      return n === q || q.startsWith(`${n}/`) || (/^t\d{4}$/.test(q) && n.startsWith(`${q}.`));
    }),
  );
}

/**
 * Check an indicator (ported from upgrade/v4, Waleed's call): look one up in the evidence
 * published on this site. Like the A-TIOC Hub, it answers from local evidence or says there
 * is none. Every indicator is also listed as a link to its case study, so the list works
 * without JavaScript; with it, a click runs the lookup instead.
 */
export function EvidenceLookup({ indicators, titles }: { indicators: Indicator[]; titles: Record<string, string> }) {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<{ query: string; hits: Indicator[] } | null>(null);
  const lookUp = (q: string) => q.trim() && setResult({ query: q.trim(), hits: find(indicators, q) });
  const lit = new Set(result?.hits.map((h) => h.value));
  // An answer changes the page's height: re-measure triggers and the screen's quiet text.
  useEffect(() => {
    if (result) ScrollTrigger.refresh();
  }, [result]);

  return (
    <div className="lookup" id="check">
      <div className="lookup__ask">
        <h3 className="lookup__h3" data-quiet>
          Check an indicator
        </h3>
        <p className="lookup__lede" data-quiet>
          Type an IP address, domain, CVE, ATT&amp;CK ID, file or service name. It searches only the{" "}
          {indicators.length} indicators published in these case studies, and says so when it has nothing.
          It’s a search of this site, not the A-TIOC Hub.
        </p>
        <form
          className="lookup__form"
          onSubmit={(e) => {
            e.preventDefault();
            lookUp(query);
          }}
        >
          <label htmlFor="indicator" className="sr-only">
            Indicator
          </label>
          <input
            id="indicator"
            type="search"
            className="lookup__input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="192.168.121.151 or T1190"
            autoComplete="off"
            spellCheck={false}
          />
          <button type="submit" className="btn btn--ghost">
            <span className="btn__shape" aria-hidden="true" />
            Look up
          </button>
        </form>
      </div>

      <div className="lookup__out">
        <div aria-live="polite" data-quiet="box">
          {result &&
            (result.hits.length ? (
              <ul className="lookup__hits">
                {result.hits.map((hit) => (
                  <li key={hit.value} className="lookup__hit">
                    <p className="lookup__type">{hit.type}</p>
                    <p className="lookup__value">
                      <code>{hit.value}</code>
                    </p>
                    <p className="lookup__note">{hit.note}</p>
                    <Link href={`/work/${hit.slug}`} className="ilink lookup__case">
                      {titles[hit.slug] ?? hit.slug}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="lookup__hit lookup__hit--none">
                <p className="lookup__value">
                  <code>{result.query}</code>
                </p>
                <p className="lookup__verdict">Insufficient local evidence.</p>
                <p className="lookup__note">This indicator doesn’t appear in any case study on this site.</p>
              </div>
            ))}
        </div>

        <p className="lookup__all">All {indicators.length} indicators on this site</p>
        <ul className="lookup__list" data-quiet="box">
          {indicators.map((ind) => (
            <li key={ind.value}>
              <a
                href={`/work/${ind.slug}`}
                className={`lookup__chip${lit.has(ind.value) ? " is-lit" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  setQuery(ind.value);
                  lookUp(ind.value);
                }}
              >
                <code>{ind.value}</code>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
