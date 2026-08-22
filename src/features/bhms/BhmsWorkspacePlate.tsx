import { useId } from "react";

import type { Locale } from "@/content";

import { BhmsLifecyclePlate } from "./BhmsLifecyclePlate";

export const bhmsBatteryIds = [
  "CALCE-CS2-35",
  "NASA-B0005",
  "HUST-1-1",
] as const;

interface BhmsWorkspacePlateProps {
  locale: Locale;
  selectedBattery: (typeof bhmsBatteryIds)[number];
  headingLevel?: 2 | 3 | 4;
}

const batteryMetadata: Record<
  (typeof bhmsBatteryIds)[number],
  { source: string; cycles: number }
> = {
  "CALCE-CS2-35": { source: "CALCE", cycles: 684 },
  "NASA-B0005": { source: "NASA", cycles: 168 },
  "HUST-1-1": { source: "HUST", cycles: 416 },
};

export function BhmsWorkspacePlate({
  locale,
  selectedBattery,
  headingLevel = 3,
}: BhmsWorkspacePlateProps) {
  const BatteryHeading = headingLevel === 2 ? "h2" : headingLevel === 3 ? "h3" : "h4";
  const CapacityHeading = headingLevel === 2 ? "h3" : headingLevel === 3 ? "h4" : "h5";
  const workspaceTitleId = useId();
  const capacityHeadingId = useId();
  const isZh = locale === "zh";
  const metadata = batteryMetadata[selectedBattery];

  return (
    <section
      className="bhms-workspace-plate"
      aria-labelledby={workspaceTitleId}
    >
      <aside aria-label={isZh ? "电池列表" : "Battery list"}>
        <strong id={workspaceTitleId}>
          {isZh ? "电池工作台" : "Battery workspace"}
        </strong>
        <ul aria-label={isZh ? "电池列表" : "Battery list"}>
          {bhmsBatteryIds.map((batteryId) => {
            const isSelected = batteryId === selectedBattery;

            return (
              <li
                key={batteryId}
                aria-current={isSelected ? "true" : "false"}
                data-selected={isSelected ? "true" : "false"}
              >
                {batteryId}
              </li>
            );
          })}
        </ul>
      </aside>

      <div className="workspace-main">
        <header>
          <BatteryHeading>{selectedBattery}</BatteryHeading>
          <p>
            {metadata.source} · {metadata.cycles} {isZh ? "次循环" : "cycles"}
          </p>
        </header>
        <ul aria-label={isZh ? "工作台视图" : "Workspace views"}>
          <li>{isZh ? "概览" : "Overview"}</li>
          <li>{isZh ? "生命周期预测" : "Lifecycle prediction"}</li>
          <li>
            {isZh ? "GraphRAG 机理解释" : "GraphRAG mechanism"}
          </li>
        </ul>
        <section aria-labelledby={capacityHeadingId}>
          <CapacityHeading id={capacityHeadingId}>
            {isZh ? "容量退化趋势" : "Capacity degradation trend"}
          </CapacityHeading>
          <BhmsLifecyclePlate
            locale={locale}
            activeModel="hybrid"
            compact
          />
        </section>
      </div>
    </section>
  );
}
