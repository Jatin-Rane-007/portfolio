"use client";

import { personal, projects } from "@/data/portfolio";

type Project = (typeof projects)[number];

interface ScrollStackCardProps {
  project: Project;
  index: number;
}

export default function ScrollStackCard({ project }: ScrollStackCardProps) {
  const mailto = `mailto:${personal.email}?subject=${encodeURIComponent(
    `About ${project.name} — ${project.subtitle}`,
  )}`;

  return (
    <article
      className="scroll-stack-card relative w-full overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)",
        border: "1px solid rgba(255,255,255,0.1)",
      }}
      aria-labelledby={`${project.id}-title`}
    >
      {/* Top accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ background: project.color }}
        aria-hidden="true"
      />

      <div className="p-6 md:p-12 lg:p-16 flex flex-col gap-8 md:gap-10">
        {/* Header row */}
        <header className="flex items-start justify-between gap-6">
          <div className="flex flex-col gap-2">
            <span className="eyebrow text-faint-on-dark">{project.client}</span>
            <div className="flex items-center gap-3 md:gap-4">
              <span
                className="font-display font-black tracking-tight tabular"
                style={{
                  fontSize: "clamp(1.75rem, 6vw, 4.5rem)",
                  lineHeight: 0.9,
                  color: project.accentColor,
                }}
                aria-hidden="true"
              >
                {project.index}
              </span>
              <div>
                <h3
                  id={`${project.id}-title`}
                  className="font-display font-bold text-white tracking-tight leading-tight"
                  style={{
                    fontSize: "clamp(1.5rem, 5.5vw, 2.5rem)",
                  }}
                >
                  {project.name}
                </h3>
                <p className="font-sans text-muted-on-dark text-sm mt-1">
                  {project.subtitle}
                </p>
              </div>
            </div>
          </div>

          <span className="eyebrow text-faint-on-dark tabular whitespace-nowrap">
            {project.year}
          </span>
        </header>

        {/* Description */}
        <p className="font-sans text-muted-on-dark leading-relaxed max-w-2xl text-[0.9375rem] md:text-base">
          {project.description}
        </p>

        {/* Tech stack */}
        <ul className="flex flex-wrap gap-2 list-none">
          {project.stack.map((tech) => (
            <li
              key={tech}
              className="font-sans text-[0.6875rem] font-bold uppercase tracking-[0.14em] px-3 py-1.5 text-muted-on-dark"
              style={{ border: "1px solid rgba(255,255,255,0.16)" }}
            >
              {tech}
            </li>
          ))}
        </ul>

        {/* The problem it had to solve */}
        <div className="flex flex-col gap-2">
          <h4 className="eyebrow text-faint-on-dark">The hard part</h4>
          <p className="font-sans text-muted-on-dark leading-relaxed text-[0.9375rem] max-w-2xl">
            {project.challenge}
          </p>
        </div>

        {/* Key deliveries */}
        <div className="border-t border-white/10 pt-6">
          <h4 className="eyebrow text-faint-on-dark mb-4">What I shipped</h4>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 list-none">
            {project.keyDeliveries.map((delivery) => (
              <li key={delivery} className="flex items-start gap-3">
                <span
                  className="mt-2 w-1 h-1 rounded-full flex-shrink-0"
                  style={{ background: project.color }}
                  aria-hidden="true"
                />
                <p className="font-sans text-muted-on-dark leading-snug text-sm">
                  {delivery}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer row */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span
              className="inline-block w-2 h-2 rounded-full"
              style={{ background: project.color }}
              aria-hidden="true"
            />
            <span className="eyebrow text-faint-on-dark">{project.stack[0]}</span>
          </div>

          <a
            href={mailto}
            className="tap group inline-flex items-center gap-2 text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-muted-on-dark hover:text-white transition-colors duration-300"
            aria-label={`Email Jatin about ${project.name}`}
          >
            Start a conversation
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            >
              <path d="M1 6h10M6 1l5 5-5 5" />
            </svg>
          </a>
        </div>
      </div>
    </article>
  );
}
