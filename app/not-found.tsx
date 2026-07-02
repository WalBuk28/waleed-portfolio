import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Background } from "@/components/Background";

export default function NotFound() {
  return (
    <>
      <Background />
      <main className="grid min-h-screen place-items-center px-6 text-center">
        <div>
          <p className="font-mono text-sm text-threat-crit">
            [404] segment not found
          </p>
          <h1 className="mt-4 font-display text-6xl font-bold sm:text-8xl">
            <span className="grad-text">Access denied</span>
          </h1>
          <p className="mx-auto mt-4 max-w-md text-ink-secondary">
            This route isn’t in the routing table. Let’s get you back to safe
            ground.
          </p>
          <Link href="/" className="btn-primary mt-8">
            <ArrowLeft className="h-4 w-4" />
            Return home
          </Link>
        </div>
      </main>
    </>
  );
}
