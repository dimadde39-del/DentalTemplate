"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

interface Review {
  id: number;
  name: string;
  role: string;
  content: string;
  rating: number;
}

export function ReviewMarquee({ reviews }: { reviews: Review[] }) {
  // Duplicate array for seamless infinite scroll
  const items = [...reviews, ...reviews];

  return (
    <div className="relative flex overflow-hidden w-full py-10 group bg-zinc-50 dark:bg-zinc-950">
      <div className="absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-zinc-50 dark:from-zinc-950 to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-zinc-50 dark:from-zinc-950 to-transparent z-10" />
      
      <motion.div
        animate={{
          x: ["0%", "-50%"],
        }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 30,
        }}
        className="flex gap-6 px-3"
      >
        {items.map((review, i) => (
          <div
            key={`${review.id}-${i}`}
            className="w-[350px] shrink-0 p-8 rounded-3xl bg-white dark:bg-black border border-zinc-100 dark:border-zinc-800 shadow-sm"
          >
            <div className="flex gap-1 mb-4">
              {[...Array(review.rating)].map((_, idx) => (
                <Star
                  key={idx}
                  className="w-5 h-5 fill-amber-400 text-amber-400"
                />
              ))}
            </div>
            <p className="text-zinc-700 dark:text-zinc-300 mb-6 italic">
              "{review.content}"
            </p>
            <div>
              <p className="font-bold text-zinc-900 dark:text-white">
                {review.name}
              </p>
              <p className="text-sm text-zinc-500">{review.role}</p>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
