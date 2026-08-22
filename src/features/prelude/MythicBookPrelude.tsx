"use client";

import { useEffect, useId, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import type { Locale } from "@/content";
import { NornThreads } from "./NornThreads";
import type { VisualPreludeFrame } from "@/components/home/HomeExperience";

export interface MythicBookPreludeProps {
  locale: Locale;
  active: boolean;
  frame?: VisualPreludeFrame;
  onSkip(): void;
}

const subscribeToClient = () => () => {};

export function MythicBookPrelude({
  locale,
  active,
  frame,
  onSkip,
}: MythicBookPreludeProps) {
  const titleId = useId();
  const skipRef = useRef<HTMLButtonElement>(null);
  const isClient = useSyncExternalStore(
    subscribeToClient,
    () => true,
    () => false,
  );
  const portalTarget = isClient && active ? document.body : null;

  useEffect(() => {
    if (!active || !portalTarget) return;

    const previouslyFocused = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    const snapshots = Array.from(
      document.querySelectorAll<HTMLElement>(
        ".skip-link, .score-header, .mythic-book-site, .score-footer",
      ),
    ).map((element) => ({
      ariaHidden: element.getAttribute("aria-hidden"),
      element,
      inert: element.inert,
      inertAttribute: element.hasAttribute("inert"),
    }));

    for (const snapshot of snapshots) {
      snapshot.element.inert = true;
      snapshot.element.setAttribute("inert", "");
      snapshot.element.setAttribute("aria-hidden", "true");
    }
    skipRef.current?.focus();

    return () => {
      for (const snapshot of snapshots) {
        snapshot.element.inert = snapshot.inert;
        if (snapshot.inertAttribute) snapshot.element.setAttribute("inert", "");
        else snapshot.element.removeAttribute("inert");
        if (snapshot.ariaHidden === null) snapshot.element.removeAttribute("aria-hidden");
        else snapshot.element.setAttribute("aria-hidden", snapshot.ariaHidden);
      }
      previouslyFocused?.focus();
    };
  }, [active, portalTarget]);

  if (!active || !portalTarget) return null;

  const skip = locale === "zh" ? "跳过序章" : "Skip Prelude";

  return createPortal(
    <div
      className="mythic-book-prelude"
      data-prelude-active="true"
      data-prelude-frame={frame}
      data-prelude-state="idle"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <span className="sr-only" id={titleId}>智绘万物</span>
      <div className="mythic-book-stage" aria-hidden="true">
        <div className="mythic-book">
          <div className="book-pages book-pages-left" />
          <div className="book-pages book-pages-right" />
          <div className="book-cover">
            <svg className="cover-world-tree" viewBox="0 0 320 420">
              <path d="M160 340 C154 270 164 210 160 82" />
              <path d="M160 162 C112 126 82 106 48 84" />
              <path d="M160 196 C212 156 240 122 278 98" />
              <path d="M160 338 C116 362 86 378 54 404" />
              <path d="M160 338 C204 364 238 380 270 402" />
            </svg>
            <NornThreads decorative className="cover-norn-threads" />
            <div className="book-cover-copy">
              <p className="book-cover-title">智绘万物</p>
              <p>INTELLIGENCE SHAPES EVERYTHING</p>
              <span>OPUS I</span>
            </div>
          </div>
          <div className="book-leaf book-leaf-left">
            <div className="book-leaf-inscription book-leaf-norns">
              <p>THE THREE NORN THREADS</p>
              <svg viewBox="0 0 260 190" aria-hidden="true">
                <path d="M34 154 C74 125 91 71 119 31" data-leaf-thread="past" />
                <path d="M130 160 C127 113 131 77 132 24" data-leaf-thread="present" />
                <path d="M226 154 C184 121 173 73 148 31" data-leaf-thread="future" />
                <circle cx="130" cy="160" r="3" />
              </svg>
              <strong>URÐR · VERÐANDI · SKULD</strong>
              <span>PAST · PRESENT · FUTURE</span>
            </div>
          </div>
          <div className="book-leaf book-leaf-right">
            <div className="book-leaf-inscription book-leaf-slogan">
              <span>OPUS I · SOFTWARE ENGINEERING</span>
              <strong>智绘万物</strong>
              <em>Intelligence Shapes Everything</em>
              <i aria-hidden="true" />
              <p>Designing intelligence into systems that can be understood, executed and verified.</p>
            </div>
          </div>
          <div className="book-spine" />
        </div>
      </div>
      <button ref={skipRef} className="prelude-skip" type="button" onClick={onSkip}>
        {skip}
      </button>
    </div>,
    portalTarget,
  );
}
