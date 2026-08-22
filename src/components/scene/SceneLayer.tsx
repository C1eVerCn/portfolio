"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { MythicPaperFallback } from "./MythicPaperFallback";

const SceneCanvas = dynamic(() => import("./SceneCanvas"), { ssr: false });

export function SceneLayer() {
  const [canRenderWebGL, setCanRenderWebGL] = useState(false);

  useEffect(() => {
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame: number | null = null;
    let disposed = false;

    const scheduleState = (canRender: boolean) => {
      if (frame !== null) window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        frame = null;
        if (!disposed) setCanRenderWebGL(canRender);
      });
    };

    const probeWebGL = () => {
      if (motionPreference.matches || !window.WebGLRenderingContext) {
        scheduleState(false);
        return;
      }

      let context: WebGLRenderingContext | WebGL2RenderingContext | null = null;
      try {
        const canvas = document.createElement("canvas");
        context = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
      } catch {
        context = null;
      }
      const hasContext = Boolean(context);
      context?.getExtension("WEBGL_lose_context")?.loseContext();
      scheduleState(hasContext);
    };

    const handleMotionPreference = () => probeWebGL();
    const modernListener = typeof motionPreference.addEventListener === "function";
    if (modernListener) motionPreference.addEventListener("change", handleMotionPreference);
    else motionPreference.addListener(handleMotionPreference);
    probeWebGL();

    return () => {
      disposed = true;
      if (frame !== null) window.cancelAnimationFrame(frame);
      if (modernListener) motionPreference.removeEventListener("change", handleMotionPreference);
      else motionPreference.removeListener(handleMotionPreference);
    };
  }, []);

  return (
    <div className="paper-scene-layer" data-webgl={canRenderWebGL ? "active" : "fallback"}>
      <MythicPaperFallback />
      {canRenderWebGL ? <SceneCanvas /> : null}
    </div>
  );
}
