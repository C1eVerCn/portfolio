"use client";

import { useState } from "react";

import type { Locale } from "@/content";

import { BhmsEvidenceGraph } from "./BhmsEvidenceGraph";
import {
  BhmsLifecyclePlate,
  type BhmsLifecycleModel,
} from "./BhmsLifecyclePlate";
import { BhmsWorkspacePlate } from "./BhmsWorkspacePlate";

export function BhmsDemo({ locale }: { locale: Locale }) {
  const [activeModel, setActiveModel] =
    useState<BhmsLifecycleModel>("hybrid");

  return (
    <div className="bhms-immersive-demo bhms-demo" data-case-reveal>
      <BhmsWorkspacePlate
        locale={locale}
        selectedBattery="CALCE-CS2-35"
      />
      <BhmsLifecyclePlate
        locale={locale}
        activeModel={activeModel}
        onModelChange={setActiveModel}
      />
      <BhmsEvidenceGraph locale={locale} />
    </div>
  );
}
