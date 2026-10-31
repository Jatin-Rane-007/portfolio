"use client";

import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { openSource, personal } from "@/data/portfolio";
import { useSectionScroll } from "@/lib/scroll";

type RepoMeta = {
  language: string | null;
  stargazers_count: number;
  pushed_at: string | null;
  homepage: string | null;
};

/** GitHub's public repos endpoint, unauthenticated — 60 req/hour per IP. */
async function fetchRepos(): Promise<Record<string, RepoMeta>> {
  const res = await fetch(
    `https://api.github.com/users/${personal.githubHandle}/repos?per_page=100&sort=updated`,
    { headers: { Accept: "application/vnd.github+json" } },
  );
  if (!res.ok) throw new Error(`GitHub responded ${res.status}`);
  const json: Array<{
    name: string;
    language?: string | null;
    stargazers_count?: number;
    pushed_at?: string | null;
    homepage?: string | null;
  }> = await res.json();

  return json.reduce<Record<string, RepoMeta>>((acc, repo) => {
    acc[repo.name] = {
      language: repo.language ?? null,
      stargazers_count: repo.stargazers_count ?? 0,
      pushed_at: repo.pushed_at ?? null,
      homepage: repo.homepage ?? null,
    };
    return acc;
  }, {});
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#b8860b",
  Java: "#b07219",
  HTML: "#e34c26",
  CSS: "#563d7c",
  SCSS: "#c6538c",
};

function relativeDate(iso: string | null, fallback: string) {
  if (!iso) return fallback;
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return fallback;
  const days = Math.round((Date.now() - then) / 86_400_000);
  if (days <= 0) return "updated today";
  if (days === 1) return "updated yesterday";
  if (days < 30) return `updated ${days} days ago`;
  const months = Math.round(days / 30);
  if (months < 12) return `updated ${months} months ago`;
  return `updated ${Math.round(months / 12)} year${months >= 18 ? "s" : ""} ago`;
}

export default function OpenSource() {
  const scrollToSection = useSectionScroll();

  const { data, isError, isPending } = useQuery({
    queryKey: ["github-repos", personal.githubHandle],
    queryFn: fetchRepos,
    staleTime: 1000 * 60 * 30,
  });

  const syncNote = isPending
    ? "Checking GitHub…"
    : isError
      ? "Showing the shipped snapshot — GitHub is unreachable."
      : null;

  return (
    <section
      id="source"
      className="bg-black text-white py-24 md:py-32"
      aria-labelledby="source-heading"
    >
      <div className="shell">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-12"
        >
          <h2
            id="source-heading"
            className="font-display font-extrabold uppercase tracking-[-0.03em] leading-[0.9]"
            style={{ fontSize: "clamp(2.25rem, 8vw, 5rem)" }}
          >
            Open Source
          </h2>
          <p className="text-sm leading-relaxed text-muted-on-dark max-w-md md:text-right">
            Apps I design, build and maintain on my own time — typed data layers,
            role-gated product flows, and AI capture that asks before it saves.
          </p>
        </motion.div>

        <p className="eyebrow text-faint-on-dark mt-10 md:mt-14">
          Three repos worth opening
        </p>

        {/* Shelf */}
        <ul className="list-none mt-4">
          {openSource.map((project) => {
            const meta = data?.[project.repo];
            const language = meta?.language ?? project.language;
            const dot = LANGUAGE_COLORS[language ?? ""] ?? "#6366f1";

            return (
              <li key={project.repo}>
                <div className="repo-row">
                  {/* Name + tagline */}
                  <div className="relative z-[1] flex flex-col gap-2">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ background: dot }}
                        aria-hidden="true"
                      />
                      <h3
                        className="font-display font-bold tracking-tight text-white"
                        style={{ fontSize: "clamp(1.5rem, 5vw, 2.25rem)" }}
                      >
                        {project.name}
                      </h3>
                    </div>
                    <p className="text-sm leading-snug text-muted-on-dark">
                      {project.tagline}
                    </p>
                    <p className="text-xs text-faint-on-dark">
                      {language ? `${language} · ` : ""}
                      {relativeDate(meta?.pushed_at ?? null, `Updated ${project.updated}`)}
                      {meta?.stargazers_count
                        ? ` · ${meta.stargazers_count} stars`
                        : ""}
                    </p>
                  </div>

                  {/* Summary + stack */}
                  <div className="relative z-[1] flex flex-col gap-4">
                    <p className="text-sm leading-relaxed text-muted-on-dark max-w-xl">
                      {project.summary}
                    </p>
                    <ul className="flex flex-wrap gap-1.5 list-none">
                      {project.stack.map((tech) => (
                        <li
                          key={tech}
                          className="text-[0.6875rem] font-bold uppercase tracking-[0.12em] px-2.5 py-1 text-faint-on-dark border border-white/15"
                        >
                          {tech}
                        </li>
                      ))}
                    </ul>
                    <p className="text-sm leading-relaxed text-muted-on-dark max-w-xl">
                      {project.highlights[0]}
                    </p>
                  </div>

                  {/* Action */}
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative z-[1] tap group inline-flex items-center justify-between gap-4 md:justify-end border border-white/20 px-4 py-3 text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-white hover:bg-white hover:text-black transition-colors duration-300"
                    aria-label={`View ${project.name} source on GitHub`}
                  >
                    View repo
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="flex-shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    >
                      <path d="M3 9L9 3M9 3H4M9 3v5" />
                    </svg>
                  </a>

                  {/* Detail — collapsible, keeps the row scannable on phones */}
                  <details className="relative z-[1] md:col-span-3 group">
                    <summary className="tap inline-flex items-center gap-2 cursor-pointer text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-faint-on-dark hover:text-white transition-colors duration-300 list-none">
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 10 10"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className="transition-transform duration-300 group-open:rotate-90"
                        aria-hidden="true"
                      >
                        <path d="M3 1l4 4-4 4" />
                      </svg>
                      What I built
                    </summary>
                    <ul className="mt-4 flex flex-col gap-2.5 pl-1">
                      {project.highlights.map((line) => (
                        <li
                          key={line}
                          className="flex items-start gap-3 text-sm leading-relaxed text-muted-on-dark"
                        >
                          <span
                            className="mt-2 w-1 h-1 rounded-full flex-shrink-0 bg-accent"
                            aria-hidden="true"
                          />
                          {line}
                        </li>
                      ))}
                    </ul>
                  </details>
                </div>
              </li>
            );
          })}
        </ul>

        {/* Footer row */}
        <div className="mt-12 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <a
            href={personal.github}
            target="_blank"
            rel="noopener noreferrer"
            className="tap group inline-flex items-center gap-2 text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-faint-on-dark hover:text-white transition-colors duration-300"
          >
            Everything else on GitHub
            <span
              className="h-px w-6 bg-white/25 group-hover:w-10 transition-[width] duration-300"
              aria-hidden="true"
            />
          </a>

          <button
            type="button"
            onClick={() => scrollToSection("#contact")}
            className="tap group inline-flex items-center gap-2 text-left text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-white hover:text-accent transition-colors duration-300"
          >
            Ask me about these
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
          </button>
        </div>

        {syncNote && (
          <p className="mt-6 text-xs text-faint-on-dark" role="status">
            {syncNote}
          </p>
        )}
      </div>
    </section>
  );
}
