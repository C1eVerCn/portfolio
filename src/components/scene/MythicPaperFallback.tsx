import { NornThreads } from "@/features/prelude/NornThreads";

export function MythicPaperFallback() {
  return (
    <svg
      className="mythic-paper-fallback"
      viewBox="0 0 1200 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="mythic-vellum-wash" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f7f5ef" stopOpacity=".78" />
          <stop offset=".56" stopColor="#f0eee7" stopOpacity=".52" />
          <stop offset="1" stopColor="#d9d8d1" stopOpacity=".12" />
        </linearGradient>
        <filter id="mythic-paper-relief" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="2.2" result="blur" />
          <feOffset in="blur" dx="-2" dy="-2" result="light" />
          <feOffset in="blur" dx="3" dy="3" result="shade" />
          <feComposite in="light" in2="shade" operator="xor" result="relief" />
          <feColorMatrix
            in="relief"
            type="matrix"
            values="0 0 0 0 0.15  0 0 0 0 0.24  0 0 0 0 0.38  0 0 0 .18 0"
          />
        </filter>
      </defs>

      <path
        className="fallback-sheet"
        d="M137 91 C330 53 619 103 1042 66 C1078 225 1056 404 1090 786 C785 824 442 764 116 816 C139 592 104 327 137 91 Z"
        fill="url(#mythic-vellum-wash)"
        filter="url(#mythic-paper-relief)"
      />

      <g
        className="fallback-world-tree"
        fill="none"
        stroke="#263e63"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity=".16"
      >
        <path d="M600 754 C586 651 620 584 597 494 C578 420 591 343 602 244" strokeWidth="12" />
        <path data-world-branch d="M601 456 C526 416 454 348 398 264" strokeWidth="7" />
        <path data-world-branch d="M598 418 C664 373 726 317 782 229" strokeWidth="7" />
        <path data-world-branch d="M600 366 C549 325 522 275 506 205" strokeWidth="6" />
        <path data-world-branch d="M600 330 C639 286 662 238 669 174" strokeWidth="6" />
        <path data-world-branch d="M602 292 C596 243 600 199 613 145" strokeWidth="5" />
        <path d="M600 748 C534 772 476 780 411 765 M600 748 C661 780 725 788 796 766 M598 706 C546 728 511 740 463 733 M602 700 C650 718 687 728 742 719" strokeWidth="6" />
      </g>

      <NornThreads decorative className="fallback-norn-threads" />
    </svg>
  );
}
