export interface BatteryPoint {
  cycle: number;
  observed?: number;
  predicted?: number;
  lower?: number;
  upper?: number;
}

export interface LifecycleMarker {
  kind: "knee" | "eol";
  cycle: number;
  confidence: number;
}

export interface EvidenceNode {
  id: string;
  type: "anomaly" | "lifecycle" | "model" | "action";
  label: string;
  score: number;
}

export interface EvidenceEdge {
  source: string;
  target: string;
  relation: string;
}
