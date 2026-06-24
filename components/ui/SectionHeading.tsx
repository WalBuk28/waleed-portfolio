import { Reveal } from "@/components/ui/Reveal";

export function SectionHeading({
  label,
  title,
  description,
  align = "left",
}: {
  label: string;
  title: React.ReactNode;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <Reveal>
        <span className="section-label">
          <span className="h-px w-6 bg-emerald-glow/60" />
          {label}
        </span>
      </Reveal>
      <Reveal delay={1}>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {title}
        </h2>
      </Reveal>
      {description && (
        <Reveal delay={2}>
          <p className="mt-4 text-pretty text-base leading-relaxed text-zinc-400">
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}
