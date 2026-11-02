import { navLinks, profile } from "@/lib/data";

/**
 * The small print, shared by the home page and the case pages: the name, the credits, the
 * ways around the site and the 3D version. Utility links change colour only.
 */
export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="foot">
      <div className="foot__who" data-quiet="box">
        <p className="foot__name">
          © {year} {profile.fullName}
        </p>
        {/* Waleed approved this line (1 Nov 2026, docs/FACTS.md). */}
        <p className="foot__colophon">
          This screen is cut from the WalSec mark. Like a mashrabiya in Dubai or a jali in Lahore, it
          keeps eyes out and lets light in.
        </p>
        <p className="foot__credits">
          Set in Archivo and Martian Mono (SIL Open Font License). Motion by GSAP and Lenis, the
          screen in WebGL with OGL, built on Next.js.
        </p>
      </div>
      <nav className="foot__nav" aria-label="Footer" data-quiet="box">
        <ul>
          {navLinks.map((l) => (
            <li key={l.href}>
              <a className="foot__link" href={`/${l.href}`}>
                {l.label}
              </a>
            </li>
          ))}
          <li>
            {/* A full page load: the 3D journey runs its own renderer and native scroll. */}
            <a className="foot__link" href="/journey" data-no-transition>
              3D version
            </a>
          </li>
        </ul>
        <p className="foot__hint mono">Press ⌘K or Ctrl K to jump anywhere</p>
      </nav>
    </footer>
  );
}
