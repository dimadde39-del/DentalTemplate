"use client";

import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { toWhatsAppHref } from "./utils";

interface StickyWhatsAppButtonProps {
  readonly phone: string;
  readonly heroId?: string;
}

const SESSION_KEY = "clinic-whatsapp-clicked";

export function StickyWhatsAppButton({
  phone,
  heroId = "clinic-hero",
}: StickyWhatsAppButtonProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const clickedBefore = window.sessionStorage.getItem(SESSION_KEY) === "1";
    if (clickedBefore) {
      setIsVisible(true);
    }

    const hero = document.getElementById(heroId);
    if (!hero) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(!entry.isIntersecting || clickedBefore);
      },
      {
        threshold: 0.15,
      }
    );

    observer.observe(hero);

    return () => {
      observer.disconnect();
    };
  }, [heroId]);

  const handleClick = () => {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(SESSION_KEY, "1");
    }

    setIsVisible(true);
  };

  return (
    <a
      href={toWhatsAppHref(phone)}
      target="_blank"
      rel="noreferrer"
      aria-label="Open WhatsApp chat"
      onClick={handleClick}
      className={`fixed bottom-[calc(24px+env(safe-area-inset-bottom))] right-4 z-50 inline-flex min-h-12 items-center gap-2 rounded-2xl border border-[rgba(0,161,214,0.4)] bg-[linear-gradient(180deg,rgba(0,161,214,0.24),rgba(0,161,214,0.14)),rgba(255,255,255,0.03)] px-4 py-3 text-sm font-semibold text-[#eaf8fd] shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_18px_38px_rgba(0,161,214,0.1)] backdrop-blur transition-all duration-300 ease-[var(--ease)] motion-reduce:transition-none md:bottom-[60px] md:right-[60px] ${
        isVisible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <MessageCircle className="h-4 w-4 shrink-0" />
      <span>WhatsApp</span>
    </a>
  );
}
