"use client";
// Next.js App Router adapter. Render <Engine /> once, as the LAST child of <body> in the root
// layout: React runs child effects first, so page components register before the engine boots.
// Internal links (plain <a> or next/link) run the page transition: the curtain closes from the
// click, the old page is reverted, the route is pushed, and enter() opens the new page. Back and
// forward re-init the page without the curtain and keep their scroll. Opt a link out with
// data-no-transition; new tabs, downloads, mailto, external and same-page links are left alone.
import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { abort, boot, cleanup, enter, leave, onPage, popped, type PageFn, type Point } from "./index";

let go: ((href: string, at?: Point) => void) | null = null;
/** Navigate through the page transition (the command palette uses this). */
export function navigate(href: string, at?: Point) {
  if (go) go(href, at);
  else location.href = href;
}

export function Engine() {
  const router = useRouter();
  const pathname = usePathname();
  const first = useRef(true);
  const mode = useRef<"idle" | "push" | "pop">("idle");

  useEffect(() => {
    boot();
    // Revert the old page before React swaps it (and stop recording its position); a hash-only
    // step stays on the page and changes nothing.
    const onPop = () => {
      if (popped()) mode.current = "pop";
    };
    addEventListener("popstate", onPop);
    return () => removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    let timer = 0;
    go = async (href, at = { x: innerWidth / 2, y: innerHeight / 2 }) => {
      if (mode.current !== "idle") return; // one transition at a time
      mode.current = "push";
      router.prefetch(href);
      await leave(at);
      cleanup();
      router.push(href, { scroll: false });
      // A push that never lands (an error, the same route): don't leave the page covered.
      timer = window.setTimeout(() => {
        if (mode.current !== "push") return;
        mode.current = "idle";
        enter({ scrollTop: false });
        abort();
      }, 6000);
    };
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a || !a.href || (a.target && a.target !== "_self") || a.hasAttribute("download") || a.hasAttribute("data-no-transition")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname === location.pathname) return; // external, mailto, hash or same page
      e.preventDefault(); // next/link sees defaultPrevented and stands down
      // A keyboard "click" has no position: close from the link itself.
      const r = a.getBoundingClientRect();
      const at = e.detail === 0 || (e.clientX === 0 && e.clientY === 0) ? { x: r.left + Math.min(r.width, 200) / 2, y: r.top + r.height / 2 } : { x: e.clientX, y: e.clientY };
      go?.(url.pathname + url.search + url.hash, at);
    };
    document.addEventListener("click", onClick, true);
    return () => {
      go = null;
      clearTimeout(timer);
      document.removeEventListener("click", onClick, true);
    };
  }, [router]);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const was = mode.current;
    mode.current = "idle";
    enter({ scrollTop: was !== "pop", transition: was === "push" });
  }, [pathname]);

  return null;
}

/** Component-level page code: runs once the page is ready, reverted when it's left. */
export function usePage(fn: PageFn) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => onPage(fn), []);
}
