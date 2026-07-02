import { Reveal } from "./Reveal";

export function SectionHeading({
  eyebrow,
  title,
  intro,
  id,
}: {
  eyebrow: string;
  title: React.ReactNode;
  intro?: string;
  id?: string;
}) {
  return (
    <div className="max-w-2xl">
      <Reveal>
        <span className="eyebrow">
          <span className="h-1 w-1 rounded-full bg-emerald-accent" />
          {eyebrow}
        </span>
      </Reveal>
      <Reveal delay={0.05}>
        <h2
          id={id}
          className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl"
        >
          {title}
        </h2>
      </Reveal>
      {intro && (
        <Reveal delay={0.1}>
          <p className="mt-4 text-base leading-relaxed text-ink-secondary">
            {intro}
          </p>
        </Reveal>
      )}
    </div>
  );
}
