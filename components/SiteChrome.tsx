"use client";

import { useState } from "react";
import { Nav } from "./Nav";
import { CommandPalette } from "./CommandPalette";
import type { PaletteItem } from "@/lib/palette";

/** Shares command-palette open state between the nav trigger and the palette. */
export function SiteChrome({ items }: { items: PaletteItem[] }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Nav onOpenPalette={() => setOpen(true)} />
      <CommandPalette open={open} setOpen={setOpen} items={items} />
    </>
  );
}
