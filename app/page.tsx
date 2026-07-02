import { Background } from "@/components/Background";
import { SiteChrome } from "@/components/SiteChrome";
import { Hero } from "@/components/Hero";
import { CaseStudies } from "@/components/CaseStudies";
import { Skills } from "@/components/Skills";
import { Experience } from "@/components/Experience";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Background />
      <SiteChrome />
      <main id="main">
        <Hero />
        <CaseStudies />
        <Skills />
        <Experience />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
