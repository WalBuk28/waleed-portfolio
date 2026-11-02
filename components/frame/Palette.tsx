"use client";

import { useState } from "react";
import { CommandPalette } from "@/components/CommandPalette";
import type { PaletteItem } from "@/lib/palette";

/** ⌘K / Ctrl+K on the home page; the footer names the shortcut. */
export function Palette({ items }: { items: PaletteItem[] }) {
  const [open, setOpen] = useState(false);
  return <CommandPalette open={open} setOpen={setOpen} items={items} />;
}
