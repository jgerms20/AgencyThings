"use client";

import { type CSSProperties, type RefObject } from "react";
import type { DemographicShare } from "@/lib/demographics";
import { useCountUp } from "./useCountUp";

type AnimatedShareBarsProps = {
  items: readonly DemographicShare[];
  color?: "acid" | "cyan" | "coral" | "violet";
  highlightLabel?: string;
  showCounts?: boolean;
  variant?: "default" | "global";
};

function AnimatedPercent({ value, active }: { value: number; active: boolean }) {
  const { value: current } = useCountUp({
    end: value,
    duration: 1400,
    decimals: value % 1 === 0 ? 0 : 1,
    startOnView: active,
  });

  return <>{active ? current.toFixed(value % 1 === 0 ? 0 : 1) : "0"}%</>;
}

export default function AnimatedShareBars({
  items,
  color = "acid",
  highlightLabel,
  showCounts = false,
  variant = "default",
}: AnimatedShareBarsProps) {
  const { ref, hasStarted } = useCountUp({ end: 1, duration: 1, startOnView: true });

  return (
    <div
      ref={ref as RefObject<HTMLDivElement>}
  className={`demographic-bars demographic-bars-${color} demographic-bars-animated${variant === "global" ? " demographic-bars-global" : ""}${items.length <= 2 ? " demographic-bars-fill" : ""}`}
    >
      {items.map((item) => {
        const isHighlight = highlightLabel === item.label;
        const decimals = item.value % 1 === 0 ? 0 : 1;

        return (
          <div
            className={`demographic-bar-row${isHighlight ? " demographic-bar-row-highlight" : ""}`}
            key={item.label}
            data-label={item.label}
            data-percent={`${item.value.toFixed(decimals)}%`}
            data-count={item.count ?? ""}
          >
            <div className="demographic-bar-label">
              <span>{item.label}</span>
              <div className="demographic-bar-metrics">
                {showCounts && item.count ? <em>{item.count}</em> : null}
                <strong>
                  <AnimatedPercent value={item.value} active={hasStarted} />
                </strong>
              </div>
            </div>
            <div className="demographic-bar-track" aria-hidden="true">
              <span
                className={hasStarted ? "demographic-bar-fill demographic-bar-fill-visible" : "demographic-bar-fill"}
                style={{ "--bar-width": `${item.value}%` } as CSSProperties}
              />
            </div>
            <div className="demographic-bar-hover" aria-hidden="true">
              <span>{item.label}</span>
              <strong>
                {item.count ? `${item.count} / ` : ""}
                {item.value.toFixed(decimals)}%
              </strong>
            </div>
            {item.detail ? <p>{item.detail}</p> : null}
          </div>
        );
      })}
    </div>
  );
}
