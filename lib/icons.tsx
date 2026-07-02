import {
  Radar,
  Bug,
  Network,
  Code2,
  Cloud,
  KeyRound,
  ShieldCheck,
  BrainCircuit,
  Truck,
  type LucideIcon,
} from "lucide-react";

const map: Record<string, LucideIcon> = {
  Radar,
  Bug,
  Network,
  Code2,
  Cloud,
  KeyRound,
  ShieldCheck,
  BrainCircuit,
  Truck,
};

export function Icon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Cmp = map[name] ?? ShieldCheck;
  return <Cmp className={className} aria-hidden />;
}
