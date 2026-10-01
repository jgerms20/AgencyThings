"use client";


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
  const visible = display ?? value.toLocaleString("en-US");

  return (
    <p
      className={`demographic-population-count ${className}`.trim()}
      data-testid={testId}
      aria-label={ariaLabel ?? `${value.toLocaleString("en-US")} people`}
    >
      <strong aria-hidden="true">{visible}</strong>
    </p>
  );
}
