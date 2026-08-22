import type { BatteryPoint, EvidenceEdge, EvidenceNode, LifecycleMarker } from "./types";

export const batterySeries: BatteryPoint[] = [
  { cycle: 0, observed: 1 },
  { cycle: 120, observed: 0.975 },
  { cycle: 240, observed: 0.94 },
  { cycle: 360, observed: 0.895 },
  { cycle: 480, observed: 0.84, predicted: 0.842, lower: 0.818, upper: 0.866 },
  { cycle: 560, predicted: 0.798, lower: 0.764, upper: 0.832 },
  { cycle: 640, predicted: 0.744, lower: 0.698, upper: 0.79 },
  { cycle: 720, predicted: 0.681, lower: 0.622, upper: 0.74 },
];

export const lifecycleMarkers: LifecycleMarker[] = [
  { kind: "knee", cycle: 538, confidence: 0.81 },
  { kind: "eol", cycle: 642, confidence: 0.76 },
];

export const evidenceNodes: EvidenceNode[] = [
  { id: "anomaly-voltage", type: "anomaly", label: "Voltage deviation", score: 0.86 },
  { id: "knee-window", type: "lifecycle", label: "Knee window", score: 0.81 },
  { id: "fusion", type: "model", label: "Fusion agreement", score: 0.78 },
  { id: "inspect", type: "action", label: "Prioritise inspection", score: 0.82 },
];

export const evidenceEdges: EvidenceEdge[] = [
  { source: "anomaly-voltage", target: "knee-window", relation: "overlaps" },
  { source: "fusion", target: "knee-window", relation: "supports" },
  { source: "knee-window", target: "inspect", relation: "informs" },
];
