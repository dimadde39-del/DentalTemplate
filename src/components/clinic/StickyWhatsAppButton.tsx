"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { MessageCircle } from "lucide-react";

interface StickyWhatsAppButtonProps {
  readonly phone: string;
  readonly heroId?: string;
}

const SESSION_KEY = "clinic-whatsapp-clicked";

function wasClickedThisSession(): boolean {
  if (typeof window === "undefined") return false;
  return window.sessionStorage.getItem(SESSION_KEY) === "1";
}

function toWhatsAppHref(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits}`;
}

export function StickyWhatsAppButton({
  phone,
  heroId = "clinic-hero",
}: StickyWhatsAppButtonProps) {
  const prefersReducedMotion = useReducedMotion();
  const href = useMemo(() => toWhatsAppHref(phone), [phone]);

  const [heroExited, setHeroExited] = useState(false);
  const [clickedThisSession, setClickedThisSession] = useState(wasClickedThisSession);
  const [hasShownOnce, setHasShownOnce] = useState(wasClickedThisSession);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const hero = document.getElementById(heroId);
    if (!hero) {
      const frameId = window.requestAnimationFrame(() => {
        setHeroExited(true);
        setHasShownOnce(true);
      });

      return () => window.cancelAnimationFrame(frameId);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const nextHeroExited = !entry.isIntersecting;
        setHeroExited(nextHeroExited);

        if (nextHeroExited) {
          setHasShownOnce(true);
        }
      },
      {
        threshold: 0.15,
      }
    );

    observer.observe(hero);

    return () => observer.disconnect();
  }, [heroId]);

  const isVisible = heroExited || clickedThisSession;

  const handleClick = () => {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(SESSION_KEY, "1");
    }

    setClickedThisSession(true);
    setHasShownOnce(true);
  };

  return (
    <AnimatePresence>
      {isVisible ? (
        <motion.a
          href={href}
          target="_blank"
          rel="noreferrer"
          aria-label="Open WhatsApp chat"
          onClick={handleClick}
          initial={prefersReducedMotion || hasShownOnce ? false : { opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 16 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="fixed bottom-[calc(24px+env(safe-area-inset-bottom))] right-4 z-50 inline-flex min-h-12 items-center gap-2 rounded-2xl border border-white/10 bg-[var(--color-primary)] px-4 py-3 text-sm font-semibold text-white shadow-[0_16px_40px_color-mix(in_oklab,var(--color-primary)_28%,transparent)] backdrop-blur md:bottom-[60px] md:right-[60px]"
        >
          <MessageCircle className="h-4 w-4 shrink-0" />
          <span>WhatsApp</span>
        </motion.a>
      ) : null}
    </AnimatePresence>
  );
}
