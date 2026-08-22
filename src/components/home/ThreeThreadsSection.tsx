import type { PortfolioContent } from "@/content";

export function ThreeThreadsSection({ content }: { content: PortfolioContent }) {
  return (
    <section
      className="thread-exposition section-shell"
      data-chapter="threads"
      id="threads"
      aria-labelledby="threads-title"
    >
      <h2 id="threads-title" className="section-kicker">
        The Norns · Three engineering times
      </h2>
      <ol>
        {content.threads.map((thread) => (
          <li
            key={thread.id}
            data-thread-explanation={thread.id}
            data-reveal
          >
            <span>{thread.norseName}</span>
            <h3>{thread.label}</h3>
            <p>{thread.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
