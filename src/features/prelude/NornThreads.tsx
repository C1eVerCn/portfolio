export interface NornThreadsProps {
  decorative?: boolean;
  className?: string;
}

export function NornThreads({
  decorative = false,
  className = "",
}: NornThreadsProps) {
  return (
    <svg
      className={`norn-threads ${className}`.trim()}
      viewBox="0 0 1200 720"
      preserveAspectRatio="none"
      aria-hidden={decorative ? "true" : undefined}
      role={decorative ? undefined : "img"}
      aria-label={
        decorative
          ? undefined
          : "Past, present and future engineering threads"
      }
    >
      <path
        pathLength={1}
        data-norn-thread="past"
        d="M-40 508 C210 466 380 526 598 438 C780 364 952 402 1240 328"
      />
      <path
        pathLength={1}
        data-norn-thread="present"
        d="M-40 378 C226 382 384 324 600 360 C816 396 954 302 1240 290"
      />
      <path
        pathLength={1}
        data-norn-thread="future"
        d="M-40 248 C210 312 392 214 604 276 C822 340 1004 208 1240 188"
      />
    </svg>
  );
}
