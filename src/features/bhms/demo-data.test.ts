import { describe, expect, it } from "vitest";
import { batterySeries, evidenceEdges, evidenceNodes, lifecycleMarkers } from "./demo-data";

describe("BHMS curated demo data", () => {
  it("keeps uncertainty bounds ordered", () => {
    for (const point of batterySeries.filter((item) => item.predicted !== undefined)) {
      expect(point.lower).toBeLessThanOrEqual(point.predicted!);
      expect(point.upper).toBeGreaterThanOrEqual(point.predicted!);
    }
  });

  it("places the knee before end of life", () => {
    const knee = lifecycleMarkers.find((item) => item.kind === "knee")!;
    const eol = lifecycleMarkers.find((item) => item.kind === "eol")!;
    expect(knee.cycle).toBeLessThan(eol.cycle);
  });

  it("references valid nodes from every evidence edge", () => {
    const ids = new Set(evidenceNodes.map((node) => node.id));
    for (const edge of evidenceEdges) {
      expect(ids.has(edge.source)).toBe(true);
      expect(ids.has(edge.target)).toBe(true);
    }
  });
});
