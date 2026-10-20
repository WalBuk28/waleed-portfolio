"use client";
// Next.js App Router adapter. Render <Engine /> once, as the LAST child of <body> in the root
// layout: React runs child effects first, so page components register before the engine boots.
// Route changes re-init the page; back and forward keep their scroll position.
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { boot, enter, onPage, type PageFn } from "./index";

export function Engine() {
  const pathname = usePathname();
  const first = useRef(true);
  const pop = useRef(false);

  useEffect(() => {
    boot();
    const onPop = () => (pop.current = true);
    addEventListener("popstate", onPop);
    return () => removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    enter({ scrollTop: !pop.current });
    pop.current = false;
  }, [pathname]);

  return null;
}

/** Component-level page code: runs once the page is ready, reverted when it's left. */
export function usePage(fn: PageFn) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => onPage(fn), []);
}
