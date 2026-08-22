"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Locale, PortfolioContent } from "@/content";
import { gsap, useGSAP } from "@/lib/gsap/client";
import { mythicMotionState } from "@/components/scene/scene-state";
import { MusicGlyph } from "@/components/ui/MusicGlyph";
import { MythicBookPrelude } from "@/features/prelude/MythicBookPrelude";
import { usePreludeReplay } from "@/features/prelude/PreludeReplayContext";
import {
  markPreludePlayed,
  shouldAutoPlayPrelude,
} from "@/features/prelude/prelude-session";
import { CapabilityAtlas } from "./CapabilityAtlas";
import { SelectedWork } from "./SelectedWork";
import { SceneLayer } from "@/components/scene/SceneLayer";
import { SloganPrelude } from "./SloganPrelude";
import { ThreeThreadsSection } from "./ThreeThreadsSection";

export const HOME_TIMELINE_LABELS = [
  "prelude",
  "threads",
  "exposition",
  "hermes",
  "interlude",
  "bhms",
  "recapitulation",
  "coda",
] as const;

export const HOME_SCROLL_REVEAL_TARGETS = {
  interlude: ".movements-heading",
} as const;

export const HOME_REVEAL_SELECTOR = "[data-reveal]";

export function getSectionRevealConfig() {
  return {
    once: true,
    start: "top 82%",
  } as const;
}

export type VisualPreludeFrame = "cover" | "opening" | "complete";

export function resolveVisualPreludeFrame(
  search: string,
  enabled: boolean,
): VisualPreludeFrame | null {
  if (!enabled) return null;
  const frame = new URLSearchParams(search).get("preludeFrame");
  return frame === "cover" || frame === "opening" || frame === "complete"
    ? frame
    : null;
}

export function getVisualPreludeComposition(
  frame: Exclude<VisualPreludeFrame, "complete">,
  desktop: boolean,
) {
  const opening = frame === "opening";
  return {
    coverRotationX: opening && !desktop ? -132 : 0,
    coverRotationY: opening && desktop ? -132 : 0,
    leafOpacity: opening ? 1 : 0,
    leafRotation: 0,
    open: opening ? 0.72 : 0,
    pageTurn: opening ? 0.48 : 0,
  } as const;
}

export function getPreludeLayerDepth() {
  return {
    cover: 12,
    leaves: 40,
    pages: -4,
  } as const;
}

export function getPreludeBookAxis(desktop: boolean) {
  return desktop
    ? { rotationX: 0, rotationY: -168 }
    : { rotationX: -168, rotationY: 0 };
}

export function getPreludeStageEntrance() {
  return { opacity: 0 } as const;
}

export function resolvePreludeIntroTargets(documentRoot: Document) {
  const sloganCharacters = Array.from(
    documentRoot.querySelectorAll<HTMLElement>(".slogan-character"),
  );
  const secondary = Array.from(
    documentRoot.querySelectorAll<HTMLElement>(".prelude-secondary"),
  );
  const leafInscriptions = Array.from(
    documentRoot.querySelectorAll<HTMLElement>(".book-leaf-inscription"),
  );

  return {
    book: documentRoot.querySelector<HTMLElement>(".mythic-book"),
    cover: documentRoot.querySelector<HTMLElement>(".book-cover"),
    coverThreads: Array.from(
      documentRoot.querySelectorAll<SVGPathElement>(
        ".book-cover [data-norn-thread]",
      ),
    ),
    inscriptions: [...sloganCharacters, ...secondary, ...leafInscriptions],
    leafInscriptions,
    leaves: Array.from(
      documentRoot.querySelectorAll<HTMLElement>(".book-leaf"),
    ),
    pages: Array.from(
      documentRoot.querySelectorAll<HTMLElement>(".book-pages"),
    ),
    overlay: documentRoot.querySelector<HTMLElement>(
      ".mythic-book-prelude",
    ),
    secondary,
    sloganCharacters,
    stage: documentRoot.querySelector<HTMLElement>(".mythic-book-stage"),
  };
}

export function HomeExperience({ content, locale }: { content: PortfolioContent; locale: Locale }) {
  const root = useRef<HTMLElement>(null);
  const preferenceResolved = useRef(false);
  const pendingReplayToken = useRef(0);
  const handledReplayToken = useRef(0);
  const [preludeActive, setPreludeActive] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [visualPreludeFrame] = useState<VisualPreludeFrame | null>(() =>
    typeof window === "undefined"
      ? null
      : resolveVisualPreludeFrame(
          window.location.search,
          process.env.NEXT_PUBLIC_VISUAL_TEST_MODE === "1",
        ),
  );
  const { replayToken } = usePreludeReplay();

  useEffect(() => {
    let prefersReducedMotion = false;
    let motionPreferenceQuery: MediaQueryList | null = null;
    let storage: Storage | null = null;

    try {
      motionPreferenceQuery = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      );
      prefersReducedMotion = motionPreferenceQuery.matches;
    } catch {
      motionPreferenceQuery = null;
      prefersReducedMotion = false;
    }

    try {
      storage = window.sessionStorage;
    } catch {
      storage = null;
    }

    let shouldPlay = false;
    try {
      shouldPlay = shouldAutoPlayPrelude(storage, prefersReducedMotion);
    } catch {
      shouldPlay = false;
    }
    const requestedVisualFrame = visualPreludeFrame;

    const handleMotionPreferenceChange = (event: MediaQueryListEvent) => {
      const currentPrefersReducedMotion = event.matches;
      setReducedMotion(currentPrefersReducedMotion);

      if (currentPrefersReducedMotion) {
        shouldPlay = false;
        pendingReplayToken.current = 0;
        setPreludeActive(false);
      }
    };
    const usesModernListener =
      typeof motionPreferenceQuery?.addEventListener === "function";

    if (usesModernListener) {
      motionPreferenceQuery?.addEventListener(
        "change",
        handleMotionPreferenceChange,
      );
    } else {
      motionPreferenceQuery?.addListener(handleMotionPreferenceChange);
    }

    const frame = window.requestAnimationFrame(() => {
      const currentPrefersReducedMotion =
        motionPreferenceQuery?.matches ?? prefersReducedMotion;
      const hasPendingReplay = pendingReplayToken.current > 0;

      preferenceResolved.current = true;
      pendingReplayToken.current = 0;
      setReducedMotion(currentPrefersReducedMotion);

      if (
        currentPrefersReducedMotion ||
        requestedVisualFrame === "complete"
      ) {
        setPreludeActive(false);
      } else if (
        requestedVisualFrame === "cover" ||
        requestedVisualFrame === "opening"
      ) {
        setPreludeActive(true);
      } else if (hasPendingReplay) {
        Object.assign(mythicMotionState.book, {
          open: 0,
          pageTurn: 0,
          depth: 0,
        });
        setPreludeActive(true);
      } else {
        setPreludeActive(shouldPlay);
      }
    });

    return () => {
      window.cancelAnimationFrame(frame);
      if (usesModernListener) {
        motionPreferenceQuery?.removeEventListener(
          "change",
          handleMotionPreferenceChange,
        );
      } else {
        motionPreferenceQuery?.removeListener(handleMotionPreferenceChange);
      }
    };
  }, [visualPreludeFrame]);

  const completePrelude = useCallback(() => {
    try {
      markPreludePlayed(window.sessionStorage);
    } catch {
      // Storage can be unavailable in privacy-restricted browser contexts.
    }
    setPreludeActive(false);
  }, []);

  const skipPrelude = useCallback(() => {
    try {
      markPreludePlayed(window.sessionStorage);
    } catch {
      // Storage can be unavailable in privacy-restricted browser contexts.
    }
    setPreludeActive(false);
  }, []);

  useEffect(() => {
    if (
      replayToken === 0 ||
      replayToken === handledReplayToken.current
    ) {
      return;
    }

    handledReplayToken.current = replayToken;

    if (!preferenceResolved.current) {
      pendingReplayToken.current = replayToken;
      return;
    }

    if (reducedMotion) return;

    Object.assign(mythicMotionState.book, {
      open: 0,
      pageTurn: 0,
      depth: 0,
    });
    const frame = window.requestAnimationFrame(() => {
      setPreludeActive(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [reducedMotion, replayToken]);

  useGSAP(
    (_context, contextSafe) => {
      if (!preludeActive || reducedMotion || !contextSafe) return;

      const desktop = window.matchMedia("(min-width: 769px)").matches;
      const fixedFrame =
        visualPreludeFrame === "cover" || visualPreludeFrame === "opening"
          ? visualPreludeFrame
          : null;
      const onComplete = fixedFrame ? undefined : contextSafe(completePrelude);
      const stageStart = getPreludeStageEntrance();
      const stageEnd = { duration: 0.56, opacity: 1 };
      const layerDepth = getPreludeLayerDepth();
      const targets = resolvePreludeIntroTargets(document);

      if (!targets.overlay || !targets.stage || !targets.cover || !targets.book) {
        return;
      }

      gsap.set(mythicMotionState.book, {
        open: 0,
        pageTurn: 0,
        depth: 0,
      });

      if (fixedFrame) {
        const composition = getVisualPreludeComposition(fixedFrame, desktop);
        gsap.set(targets.overlay, { opacity: 1 });
        gsap.set(targets.stage, { opacity: 1 });
        gsap.set(targets.book, { clearProps: "transform" });
        gsap.set(targets.coverThreads, {
          strokeDasharray: 1,
          strokeDashoffset: fixedFrame === "cover" ? 0.12 : 0,
        });
        gsap.set(targets.cover, {
          rotationX: composition.coverRotationX,
          rotationY: composition.coverRotationY,
          z: layerDepth.cover,
          transformOrigin: desktop ? "left center" : "center bottom",
        });
        gsap.set(targets.leaves, {
          opacity: composition.leafOpacity,
          z: layerDepth.leaves,
          ...(desktop
            ? {
                rotationY: (index: number) =>
                  index === 0
                    ? -composition.leafRotation
                    : composition.leafRotation,
              }
            : {
                rotationX: (index: number) =>
                  index === 0
                    ? composition.leafRotation
                    : -composition.leafRotation,
              }),
        });
        gsap.set(targets.pages, { z: layerDepth.pages });
        gsap.set(targets.leafInscriptions, {
          opacity: composition.leafOpacity,
          y: 0,
        });
        gsap.set(mythicMotionState.book, {
          depth: fixedFrame === "opening" ? 0.62 : 0.18,
          open: composition.open,
          pageTurn: composition.pageTurn,
        });
        targets.overlay.dataset.preludeState = fixedFrame;
        return;
      }

      const intro = gsap.timeline({
        defaults: { duration: 0.64, ease: "power3.inOut" },
        onComplete,
        paused: Boolean(fixedFrame),
      });

      intro
        .addLabel("summon", 0)
        .addLabel("awaken", 0.22)
        .addLabel("open", 0.72)
        .addLabel("inscribe", 1.2)
        .addLabel("enter", 1.72)
        .set(targets.overlay, { opacity: 1 }, "summon")
        .set(targets.stage, stageStart, "summon")
        .set(targets.coverThreads, {
          strokeDasharray: 1,
          strokeDashoffset: 1,
        }, "summon")
        .set(targets.cover, {
          rotationX: 0,
          rotationY: 0,
          z: layerDepth.cover,
          transformOrigin: desktop ? "left center" : "center bottom",
        }, "summon")
        .set(targets.leaves, {
          opacity: 0,
          rotationX: 0,
          rotationY: 0,
          z: layerDepth.leaves,
        }, "summon")
        .set(targets.pages, { z: layerDepth.pages }, "summon")
        .set(targets.inscriptions, { opacity: 0, y: 28 }, "summon")
        .to(targets.stage, stageEnd, "awaken")
        .to(targets.coverThreads, {
          duration: 0.82,
          stagger: 0.1,
          strokeDashoffset: 0,
        }, "awaken")
        .to(targets.cover, {
          duration: 1.02,
          ...getPreludeBookAxis(desktop),
        }, "open")
        .to(targets.leaves, {
          duration: 0.86,
          opacity: 1,
          rotationX: 0,
          rotationY: 0,
          stagger: 0.08,
        }, "open+=0.12")
        .to(targets.leafInscriptions, {
          duration: 0.58,
          opacity: 1,
          stagger: 0.08,
          y: 0,
        }, "open+=0.38")
        .to(mythicMotionState.book, {
          depth: 0.62,
          duration: 0.96,
          open: 1,
          pageTurn: 1,
        }, "open")
        .to(targets.sloganCharacters, {
          duration: 0.58,
          opacity: 1,
          stagger: 0.055,
          y: 0,
        }, "inscribe")
        .to(targets.secondary, {
          duration: 0.5,
          opacity: 1,
          y: 0,
        }, "inscribe+=0.18")
        .to(targets.book, {
          duration: 0.86,
          scale: 2.6,
          z: 280,
        }, "enter")
        .to(mythicMotionState.book, {
          depth: 1,
          duration: 0.86,
        }, "enter")
        .to(targets.overlay, {
          duration: 0.72,
          opacity: 0,
        }, "enter+=0.3");

    },
    {
      dependencies: [
        completePrelude,
        preludeActive,
        reducedMotion,
        replayToken,
        visualPreludeFrame,
      ],
      revertOnUpdate: true,
    },
  );

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set("[data-reveal]", { clearProps: "all" });
      gsap.set(mythicMotionState, {
        dynamic: "p",
        emboss: 0.1,
        fold: 0,
        lightX: -0.4,
        lightY: 0.8,
        movement: "coda",
        progress: 1,
      });
      gsap.set(mythicMotionState.threads, {
        focus: false,
        future: 1,
        past: 1,
        present: 1,
        tension: 0,
      });
      gsap.set(mythicMotionState.book, {
        depth: 1,
        open: 1,
        pageTurn: 1,
      });
    });

    mm.add(
      "(prefers-reduced-motion: no-preference)",
      () => {
        const desktop = window.matchMedia("(min-width: 769px)").matches;
        const revealConfig = getSectionRevealConfig();
        const sections = gsap.utils.toArray<HTMLElement>(
          "[data-chapter]",
          root.current,
        );

        for (const section of sections) {
          const targets = Array.from(
            section.querySelectorAll<HTMLElement>(HOME_REVEAL_SELECTOR),
          );
          if (targets.length === 0) continue;

          gsap.fromTo(
            targets,
            { autoAlpha: 0, yPercent: 12 },
            {
              autoAlpha: 1,
              clearProps: "opacity,transform,visibility",
              duration: 0.78,
              ease: "power3.out",
              immediateRender: false,
              stagger: 0.06,
              scrollTrigger: {
                trigger: section,
                ...revealConfig,
              },
              yPercent: 0,
            },
          );
        }

        const timeline = gsap.timeline({
          defaults: { ease: "power2.out" },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom bottom",
            scrub: desktop ? 1.25 : 0.45,
          },
        });

        timeline
          .addLabel("prelude")
          .set(mythicMotionState, { movement: "prelude", dynamic: "p" })
          .to(mythicMotionState, { lightX: -0.6, lightY: 0.65, emboss: 0.22, progress: 0.12, duration: 1.1 })
          .addLabel("threads")
          .set(mythicMotionState, { movement: "exposition", dynamic: "mf" })
          .to(mythicMotionState.threads, { past: 1, present: 0.76, future: 0.46, tension: 0.48, duration: 1 }, "threads")
          .to(mythicMotionState, { lightX: 0.15, lightY: 0.4, emboss: 0.3, fold: 0.08, progress: 0.28, duration: 1 }, "threads")
          .addLabel("exposition")
          .set(mythicMotionState, { movement: "exposition", dynamic: "mf" })
          .to(mythicMotionState.threads, { past: 1, present: 1, future: 0.72, tension: 0.36, duration: 1 }, "exposition")
          .to(mythicMotionState, { lightX: 0.85, emboss: 0.34, fold: 0.12, progress: 0.4, duration: 1 }, "exposition")
          .addLabel("hermes")
          .set(mythicMotionState, { movement: "hermes", dynamic: "f" })
          .to(mythicMotionState.threads, { tension: 0.72, duration: 1 }, "hermes")
          .to(mythicMotionState, { lightX: 1.5, lightY: -0.3, emboss: 0.48, fold: 0.62, progress: 0.58, duration: 1 }, "hermes")
          .addLabel("interlude")
          .to(mythicMotionState.threads, { tension: 0.16, duration: 0.74 }, "interlude")
          .to(mythicMotionState, { dynamic: "p", lightX: 0.1, lightY: 0.05, emboss: 0.28, fold: 0.36, progress: 0.68, duration: 0.74 }, "interlude")
          .addLabel("bhms")
          .set(mythicMotionState, { movement: "bhms", dynamic: "mf" })
          .to(mythicMotionState.threads, { future: 1, tension: 0.52, duration: 1 }, "bhms")
          .to(mythicMotionState, { lightX: -1.15, lightY: -0.7, emboss: 0.38, fold: 0.88, progress: 0.78, duration: 1 }, "bhms")
          .addLabel("recapitulation")
          .set(mythicMotionState, { movement: "recapitulation", dynamic: "p" })
          .to(mythicMotionState.threads, { tension: 0.2, duration: 1 }, "recapitulation")
          .to(mythicMotionState, { lightX: 0.2, lightY: 0.4, emboss: 0.18, fold: 0.24, progress: 0.9, duration: 1 }, "recapitulation")
          .addLabel("coda")
          .set(mythicMotionState, { movement: "coda", dynamic: "p" })
          .to(mythicMotionState.threads, { past: 1, present: 1, future: 1, tension: 0, duration: 1 }, "coda")
          .to(mythicMotionState, { lightX: -0.4, lightY: 0.8, emboss: 0.1, fold: 0, progress: 1, duration: 1 }, "coda");

        const xTo = gsap.quickTo(mythicMotionState, "lightX", { duration: 1.4, ease: "power2.out" });
        const yTo = gsap.quickTo(mythicMotionState, "lightY", { duration: 1.4, ease: "power2.out" });
        const onPointer = (event: PointerEvent) => {
          xTo((event.clientX / window.innerWidth - 0.5) * 2.2);
          yTo((0.5 - event.clientY / window.innerHeight) * 1.2);
        };
        window.addEventListener("pointermove", onPointer, { passive: true });
        return () => window.removeEventListener("pointermove", onPointer);
      },
    );
    return () => mm.revert();
  }, { scope: root });

  return (
    <main ref={root} className="mythic-book-site">
      <SceneLayer />
      <MythicBookPrelude
        key={replayToken}
        active={preludeActive}
        locale={locale}
        onSkip={skipPrelude}
        frame={visualPreludeFrame ?? undefined}
      />
      <SloganPrelude content={content} />
      <ThreeThreadsSection content={content} />
      <CapabilityAtlas content={content} />
      <SelectedWork content={content} locale={locale} />

      <section className="recapitulation score-section section-shell" id="principles" data-chapter="recapitulation">
        <header className="score-section-heading" data-reveal>
          <div className="movement-mark"><MusicGlyph name="fermata" /><span>V</span></div>
          <div><p className="section-kicker">Recapitulation · {content.principleIntro.label}</p><h2>{content.principleIntro.title}</h2></div>
        </header>
        <ol className="margin-principles">
          {content.principles.map((principle, index) => (
            <li key={principle.index} data-reveal>
              <span>{principle.index}</span>
              <MusicGlyph name={index === 0 ? "fermata" : index === 1 ? "caesura" : "coda"} />
              <div><h3>{principle.title}</h3><p>{principle.body}</p></div>
            </li>
          ))}
        </ol>
      </section>

      <section className="coda section-shell" id="about" data-chapter="coda">
        <div className="coda-symbol" data-reveal><MusicGlyph name="coda" /></div>
        <div className="coda-copy" data-reveal>
          <p className="section-kicker">Coda · {content.about.label}</p>
          <h2>{content.about.title}</h2>
          <p>{content.about.body}</p>
        </div>
        <div className="coda-contact" data-reveal>
          <a href={`mailto:${content.profile.email}`}><span>{content.about.email}</span><b>{content.profile.email}</b></a>
          <a href={content.profile.github} target="_blank" rel="noreferrer"><span>{content.about.github}</span><b>C1eVerCn ↗</b></a>
        </div>
      </section>
    </main>
  );
}
