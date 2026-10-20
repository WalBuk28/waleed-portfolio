"use client";

import { useState } from "react";
import { CommandPalette } from "@/components/CommandPalette";

/** ⌘K / Ctrl+K on the home page. No visible trigger until the palette is restyled. */
export function Palette() {
  const [open, setOpen] = useState(false);
  return <CommandPalette open={open} setOpen={setOpen} />;
}
