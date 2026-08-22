"use client";

import { useState } from "react";
import type { Locale } from "@/content";
import { hermesArchitectureLayers } from "./portfolio-data";

type HermesLayerId = (typeof hermesArchitectureLayers)[number]["id"];

interface HermesSystemCutawayProps {
  locale: Locale;
  compact?: boolean;
  headingLevel?: 3 | 4;
}

const englishDetails: Record<HermesLayerId, string> = {
  websocket: "Push delivery without a public callback endpoint.",
  "dedup-queue": "Immediate callback acknowledgement, deduplicated serial consumption.",
  routing: "Layer 0 / 0.5 / 0.6 route deterministic and semantic work.",
  "agent-mcp": "Per-user agents propagate context and schedule tools.",
  acl: "Five explicit roles and two layers of tool defence.",
  ocl: "Format, content, length and card output controls.",
  commit: "Dry-run, adjacent confirmation and parameter verification before write.",
};

export function HermesSystemCutaway({
  locale,
  compact = false,
  headingLevel = 3,
}: HermesSystemCutawayProps) {
  const DetailHeading = headingLevel === 3 ? "h3" : "h4";
  const [selectedId, setSelectedId] = useState<HermesLayerId>("websocket");
  const selectedLayer = hermesArchitectureLayers.find((layer) => layer.id === selectedId)
    ?? hermesArchitectureLayers[0];
  const detailFor = (id: HermesLayerId, zhDetail: string) =>
    locale === "zh" ? zhDetail : englishDetails[id];

  return (
    <section className="hermes-system-cutaway" aria-label={locale === "zh" ? "Hermes 系统剖面" : "Hermes system cutaway"}>
      <div className="hermes-layer-list">
        {hermesArchitectureLayers.map((layer) => (
          <button
            key={layer.id}
            type="button"
            data-hermes-layer={layer.id}
            aria-pressed={selectedId === layer.id}
            onClick={() => setSelectedId(layer.id)}
          >
            <strong>{layer.label}</strong>
            {!compact ? <span>{detailFor(layer.id, layer.detail)}</span> : null}
          </button>
        ))}
      </div>

      <aside className="hermes-layer-detail" aria-live="polite">
        <DetailHeading>{selectedLayer.label}</DetailHeading>
        <p>{detailFor(selectedLayer.id, selectedLayer.detail)}</p>
      </aside>
    </section>
  );
}
