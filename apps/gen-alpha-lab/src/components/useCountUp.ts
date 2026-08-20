"use client";

import { useEffect, useRef, useState } from "react";

type UseCountUpOptions = {
  end: number;
  duration?: number;
  decimals?: number;
  startOnView?: boolean;
};

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  if (typeof window.matchMedia !== "function") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useCountUp({
  end,
  duration = 1800,
  decimals = 0,
  startOnView = true,
}: UseCountUpOptions) {
  const [value, setValue] = useState(prefersReducedMotion() ? end : 0);
  const [hasStarted, setHasStarted] = useState(!startOnView || prefersReducedMotion());
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setValue(end);
      setHasStarted(true);
      return;
    }

    if (!startOnView) {
      setHasStarted(true);
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      setHasStarted(true);
      return;
    }

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setHasStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [end, startOnView]);

  useEffect(() => {
    if (!hasStarted || prefersReducedMotion()) {
      setValue(end);
      return;
    }

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      const next = eased * end;
      setValue(Number(next.toFixed(decimals)));

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [hasStarted, end, duration, decimals]);

  return { value, ref, hasStarted };
}
