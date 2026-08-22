"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Locale, ProjectAccent } from "@/content";
import { MusicGlyph } from "@/components/ui/MusicGlyph";
import { mythicMotionState } from "@/components/scene/scene-state";
import { SceneLayer } from "@/components/scene/SceneLayer";
import { gsap, useGSAP } from "@/lib/gsap/client";

interface CaseShellProps {
  locale: Locale;
  accent?: ProjectAccent;
  eyebrow: string;
  title: string;
  thesis: string;
  chapters: { id: string; label: string }[];
  heroVisual: React.ReactNode;
  children: React.ReactNode;
}

export function CaseShell({ locale, accent = "cyan", eyebrow, title, thesis, chapters, heroVisual, children }: CaseShellProps) {
  const root = useRef<HTMLElement>(null);
  const focusToggle = useRef<HTMLButtonElement>(null);
  const focusExit = useRef<HTMLButtonElement>(null);
  const wasFocused = useRef(false);
  const [focused, setFocused] = useState(false);
  const caseMovement = accent === "cyan" ? "hermes" : "bhms";

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const sections = gsap.utils.toArray<HTMLElement>(".case-body .case-section", root.current);
      const items = gsap.utils.toArray<HTMLElement>(".case-body [data-case-reveal]", root.current);
      gsap.set(items, { opacity: 0, y: 32 });
      const timeline = gsap.timeline({
        defaults: { ease: "power2.out" },
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 0.7 },
      });
      timeline.set(mythicMotionState, { movement: caseMovement, dynamic: "mf" });
      sections.forEach((section, sectionIndex) => {
        const label = section.id || `section-${sectionIndex + 1}`;
        const position = sectionIndex;
        const sectionItems = gsap.utils.toArray<HTMLElement>("[data-case-reveal]", section);
        const paths = gsap.utils.toArray<SVGPathElement>("svg path", section);

        timeline
          .addLabel(label, position)
          .to(mythicMotionState, {
            progress: sections.length > 1 ? sectionIndex / (sections.length - 1) : 1,
            lightX: caseMovement === "hermes" ? .35 + sectionIndex * .16 : -.3 - sectionIndex * .15,
            lightY: -.25,
            emboss: caseMovement === "hermes" ? .42 : .34,
            fold: caseMovement === "hermes" ? .48 : .76,
            duration: .72,
          }, label)
          .to(mythicMotionState.threads, {
            tension: Math.min(1, .28 + sectionIndex * .11),
            duration: .72,
          }, label)
          .to(paths, { opacity: 1, duration: .48, stagger: .025 }, label)
          .to(sectionItems, { opacity: 1, y: 0, duration: .44, stagger: .06 }, label);
      });
    });
    return () => mm.revert();
  }, { scope: root, dependencies: [caseMovement], revertOnUpdate: true });

  const toggleFocus = () => setFocused((value) => !value);

  useEffect(() => {
    mythicMotionState.focus = focused;
    mythicMotionState.threads.focus = focused;
    document.body.classList.toggle("fermata-focus", focused);

    if (focused) focusExit.current?.focus();
    else if (wasFocused.current) focusToggle.current?.focus();

    wasFocused.current = focused;
  }, [focused]);

  useEffect(() => {
    if (!focused) return;

    const exitOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setFocused(false);
    };

    document.addEventListener("keydown", exitOnEscape);
    return () => document.removeEventListener("keydown", exitOnEscape);
  }, [focused]);

  useEffect(() => () => {
    document.body.classList.remove("fermata-focus");
    mythicMotionState.focus = false;
    mythicMotionState.threads.focus = false;
  }, []);

  const focusLabel = focused
    ? (locale === "zh" ? "退出 fermata 专注阅读" : "Exit fermata focus view")
    : (locale === "zh" ? "进入 fermata 专注阅读" : "Enter fermata focus view");

  return (
    <main ref={root} className={`case-page ${focused ? "is-focused" : ""}`}>
      <SceneLayer />
      <aside
        className="measure-index"
        aria-label={locale === "zh" ? "案例小节" : "Case measures"}
        aria-hidden={focused ? true : undefined}
        inert={focused ? true : undefined}
      >
        <Link href={`/${locale}`} className="measure-back">
          <MusicGlyph name="repeat" />
          <span>{locale === "zh" ? "返回首页" : "Return home"}</span>
        </Link>
        <ol>
          {chapters.map((chapter, index) => (
            <li key={chapter.id}>
              <a href={`#${chapter.id}`}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <i aria-hidden="true" />
                <b>{chapter.label}</b>
              </a>
            </li>
          ))}
        </ol>
        <button ref={focusToggle} type="button" aria-label={focusLabel} onClick={toggleFocus}>
          <MusicGlyph name="fermata" />
          <span>{focused ? (locale === "zh" ? "退出专注" : "Exit focus") : (locale === "zh" ? "专注阅读" : "Focus view")}</span>
        </button>
      </aside>
      {focused ? (
        <button ref={focusExit} className="fermata-exit" type="button" aria-label={focusLabel} onClick={toggleFocus}>
          <MusicGlyph name="fermata" />
          <span>{locale === "zh" ? "退出专注" : "Exit focus"}</span>
        </button>
      ) : null}
      <header className="case-hero section-shell">
        <div className="case-hero-copy">
          <div className="case-folio" data-case-reveal>
            <span>{eyebrow}</span>
            <MusicGlyph name="piano" />
          </div>
          <h1 data-case-reveal>{title}</h1>
          <p className="case-thesis" data-case-reveal>{thesis}</p>
          <div className="case-scroll" data-case-reveal>
            <MusicGlyph name="breath" />
            {locale === "zh" ? "进入第一小节" : "Enter the first measure"}
          </div>
        </div>
        <div className="case-hero-visual" data-case-reveal>
          {heroVisual}
        </div>
      </header>
      <div className="case-body">{children}</div>
    </main>
  );
}

export function CaseSection({ id, index, label, title, intro, children }: {
  id: string; index: string; label: string; title: string; intro: string; children: React.ReactNode;
}) {
  return (
    <section id={id} className="case-section score-case-section section-shell">
      <header className="case-section-head" data-case-reveal>
        <div className="case-measure"><span>{index}</span><MusicGlyph name="breath" /></div>
        <div><p className="section-kicker">{label}</p><h2>{title}</h2></div>
        <p>{intro}</p>
      </header>
      {children}
    </section>
  );
}
