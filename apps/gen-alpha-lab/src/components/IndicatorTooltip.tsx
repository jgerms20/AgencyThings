"use client";

import { Info } from "lucide-react";
import { useId, useState } from "react";
import { cultureShaperRubric, type IndicatorAssessment } from "@/lib/content/culture-shapers";

type IndicatorTooltipProps = {
  assessment: IndicatorAssessment;
};

export default function IndicatorTooltip({ assessment }: IndicatorTooltipProps) {
  const tooltipId = useId();
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const visible = focused || hovered;
  const rubric = cultureShaperRubric[assessment.indicator];

  return (
    <span className="indicator-tooltip">
      <button
        type="button"
        aria-describedby={tooltipId}
        aria-label={`Explain ${assessment.label} indicator`}
        onBlur={() => setFocused(false)}
        onFocus={() => setFocused(true)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Info aria-hidden="true" size={15} />
      </button>
      <span id={tooltipId} role="tooltip" hidden={!visible}>
        <strong>{rubric.generalDefinition}</strong>
        <span>Tier {assessment.tier}: {assessment.definition}</span>
        <span>{assessment.rationale}</span>
      </span>
    </span>
  );
}
