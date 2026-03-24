"use client";

import { useEffect, useRef } from "react";

function formatCounter(value: number, decimals: number): string {
  return new Intl.NumberFormat("ru-RU", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

function getCounterTarget(node: HTMLElement): number {
  const target = Number(node.dataset.target ?? "0");
  return Number.isFinite(target) ? target : 0;
}

function getCounterDecimals(node: HTMLElement): number {
  const decimals = Number(node.dataset.decimals ?? "0");
  return Number.isFinite(decimals) && decimals >= 0 ? decimals : 0;
}

export function useClinicSectionEffects<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || typeof window === "undefined") return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealNodes = Array.from(root.querySelectorAll<HTMLElement>(".reveal"));
    const counterNodes = Array.from(root.querySelectorAll<HTMLElement>("[data-counter]"));
    const frameIds = new Set<number>();

    const setFinalCounterValue = (node: HTMLElement) => {
      node.textContent = formatCounter(getCounterTarget(node), getCounterDecimals(node));
    };

    const animateCounter = (node: HTMLElement) => {
      if (node.dataset.animated === "true") return;

      const target = getCounterTarget(node);
      const decimals = getCounterDecimals(node);
      const duration = Number(node.dataset.duration ?? "1200");
      const startedAt = performance.now();
      node.dataset.animated = "true";

      const tick = (now: number) => {
        const progress = Math.min((now - startedAt) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        node.textContent = formatCounter(target * eased, decimals);

        if (progress < 1) {
          const nextId = window.requestAnimationFrame(tick);
          frameIds.add(nextId);
          return;
        }

        node.textContent = formatCounter(target, decimals);
      };

      const frameId = window.requestAnimationFrame(tick);
      frameIds.add(frameId);
    };

    if (reduceMotion) {
      revealNodes.forEach((node) => node.classList.add("is-visible"));
      counterNodes.forEach(setFinalCounterValue);

      return () => {
        frameIds.forEach((id) => window.cancelAnimationFrame(id));
      };
    }

    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const target = entry.target as HTMLElement;
          target.classList.add("is-visible");

          if (target.dataset.animateCounters === "true") {
            target
              .querySelectorAll<HTMLElement>("[data-counter]")
              .forEach(animateCounter);
          }

          if (target.hasAttribute("data-counter")) {
            animateCounter(target);
          }

          currentObserver.unobserve(target);
        });
      },
      {
        threshold: 0.18,
        rootMargin: "0px 0px -8% 0px",
      }
    );

    revealNodes.forEach((node) => observer.observe(node));

    counterNodes.forEach((node) => {
      if (!node.closest("[data-animate-counters='true']")) {
        observer.observe(node);
      }
    });

    return () => {
      observer.disconnect();
      frameIds.forEach((id) => window.cancelAnimationFrame(id));
    };
  }, []);

  return ref;
}
