import Link from "next/link";
import { Background } from "@/components/Background";
import { Icon } from "@/components/ui/Icon";

export default function NotFound() {
  return (
    <>
      <Background />
      <main className="container-x flex min-h-screen flex-col items-center justify-center text-center">
        <p className="font-mono text-sm uppercase tracking-[0.3em] text-emerald-glow">
          Error 404
        </p>
        <h1 className="mt-4 text-5xl font-bold text-white sm:text-7xl">
          Access denied<span className="text-emerald-glow">_</span>
        </h1>
        <p className="mt-4 max-w-md text-zinc-400">
          This route doesn&apos;t exist — or it&apos;s been quarantined. Let&apos;s
          get you back to safety.
        </p>
        <Link href="/" className="btn-primary mt-8">
          <Icon name="ArrowRight" className="h-4 w-4 rotate-180" />
          Back to home
        </Link>
      </main>
    </>
  );
}
