"use client";

import { type RefObject } from "react";
import { useCountUp } from "./useCountUp";

type PopulationCountProps = {
  value: number;
  display?: string;
  className?: string;
  "data-testid"?: string;
  ariaLabel?: string;
};

export default function PopulationCount({
  value,
  display,
  className = "",
  "data-testid": testId,
  ariaLabel,
}: PopulationCountProps) {
  const { value: current, ref } = useCountUp({ end: value, duration: 2200 });

  const formatted = current.toLocaleString("en-US");
  const isComplete = Math.round(current) >= value;
  const visible = isComplete && display ? display : formatted;

  return (
    <p
      ref={ref as RefObject<HTMLParagraphElement>}
      className={`demographic-population-count ${className}`.trim()}
      data-testid={testId}
      aria-label={ariaLabel ?? `${value.toLocaleString("en-US")} people`}
    >
      <strong aria-hidden="true">{visible}</strong>
    </p>
  );
}
