import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { Frame } from "@/components/frame/Frame";
import { Palette } from "@/components/frame/Palette";
import { Hero } from "@/components/hero/Hero";
import { CaseStudies } from "@/components/CaseStudies";
import { Skills } from "@/components/Skills";
import { Experience } from "@/components/Experience";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { posterTile } from "@/components/screen/poster";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/**
 * The home page is one screen (DESIGN.md §8): each section declares its chapter, and the
 * driver lights the WebGL screen behind them from the reading position. Without WebGL,
 * JavaScript or motion, the poster tile and each chapter's static light stand in.
 */
export default function Home() {
  return (
    <div className="screen-page" data-screen="home" style={{ "--poster-tile": posterTile() } as CSSProperties}>
      <Frame />
      <Palette />
      <main id="main" tabIndex={-1}>
        <Hero />
        <CaseStudies />
        <Skills />
        <Experience />
        <About />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
