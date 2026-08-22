"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { MythicPaperScene } from "./MythicPaperScene";

export default function SceneCanvas() {
  return (
    <div className="scene-canvas" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 8.8], fov: 38 }}
        dpr={[1, 1.35]}
        gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
      >
        <Suspense fallback={null}>
          <MythicPaperScene />
        </Suspense>
      </Canvas>
    </div>
  );
}
