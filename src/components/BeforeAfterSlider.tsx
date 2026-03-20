"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { MoveHorizontal } from "lucide-react";

interface SliderProps {
  readonly beforeSrc: string;
  readonly afterSrc: string;
}

export function BeforeAfterSlider({ beforeSrc, afterSrc }: SliderProps) {
  const [hasInteracted, setHasInteracted] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("slider-hint") === "seen";
  });
  const afterImageRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const rafRef = useRef<number | null>(null);

  const updateDOM = (value: string | number) => {
    if (afterImageRef.current) {
      afterImageRef.current.style.clipPath = `polygon(0 0, ${value}% 0, ${value}% 100%, 0 100%)`;
    }
    if (handleRef.current) {
      handleRef.current.style.left = `${value}%`;
    }
  };

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      updateDOM(value);
    });
  };

  const handlePointerDown = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      if (typeof window !== "undefined") {
        localStorage.setItem("slider-hint", "seen");
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLInputElement>) => {
    const value = parseFloat(e.currentTarget.value);
    if (value > 45 && value < 55) {
      if (inputRef.current) inputRef.current.value = "50";
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        updateDOM(50);
      });
    }
  };

  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl touch-none select-none max-w-4xl mx-auto my-12 group bg-zinc-100 dark:bg-zinc-800">
      <Image
        src={beforeSrc}
        alt="Before"
        fill
        className="object-cover pointer-events-none"
        sizes="(max-width: 768px) 100vw, 50vw"
        priority={true}
      />

      <div
        ref={afterImageRef}
        className="absolute inset-0 z-10 will-change-transform"
        style={{ clipPath: "polygon(0 0, 50% 0, 50% 100%, 0 100%)" }}
      >
        <Image
          src={afterSrc}
          alt="After"
          fill
          className="object-cover pointer-events-none"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority={true}
        />
      </div>

      <div
        ref={handleRef}
        className="absolute top-0 bottom-0 z-20 w-1 bg-white cursor-ew-resize will-change-transform shadow-[0_0_10px_rgba(0,0,0,0.5)] flex items-center justify-center pointer-events-none"
        style={{ left: "50%", transform: "translateX(-50%)" }}
      >
        <div className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center ring-4 ring-black/5 text-[var(--color-primary)]">
          <MoveHorizontal className="w-6 h-6" />
        </div>
      </div>

      <input
        ref={inputRef}
        type="range"
        min="0"
        max="100"
        step="0.1"
        defaultValue="50"
        onInput={handleInput}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        className="absolute inset-0 z-30 opacity-0 cursor-ew-resize w-full h-full m-0"
        aria-label="Before and after comparison slider"
      />

      {!hasInteracted && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 bg-black/60 backdrop-blur text-white px-4 py-2 rounded-full text-sm font-medium animate-pulse pointer-events-none shadow-lg border border-white/10">
          Drag to compare
        </div>
      )}
    </div>
  );
}
