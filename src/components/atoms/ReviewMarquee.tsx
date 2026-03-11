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

interface ReviewMarqueeProps {
  reviews: Review[];
  speed?: number;
}

const ReviewCard = ({ review }: { review: Review }) => {
  return (
    <div className="w-[350px] md:w-[450px] flex-shrink-0 rounded-[2rem] border border-foreground/10 bg-background/50 backdrop-blur-xl p-8 shadow-sm mr-6">
      <div className="flex text-amber-500 mb-6">
        {[...Array(review.rating)].map((_, i) => (
          <Star key={i} className="h-5 w-5 fill-current" />
        ))}
      </div>
      <blockquote className="text-foreground/80 text-lg leading-relaxed mb-6 font-medium">
        "{review.content}"
      </blockquote>
      <div className="flex items-center">
        <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-primary to-primary/50 text-white flex items-center justify-center font-bold text-lg shadow-inner">
          {review.name.charAt(0)}
        </div>
        <div className="ml-4">
          <h4 className="font-bold text-foreground">{review.name}</h4>
          <p className="text-sm text-foreground/50">{review.role}</p>
        </div>
      </div>
    </div>
  );
};

export function ReviewMarquee({ reviews, speed = 40 }: ReviewMarqueeProps) {
  // Duplicate array so it doesn't jerk when looping
  const duplicatedReviews = [...reviews, ...reviews, ...reviews];

  return (
    <div className="relative flex w-full overflow-hidden bg-transparent py-10">
      {/* Left and right fade gradients */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
      
      <motion.div
        className="flex shrink-0 will-change-transform"
        animate={{
          x: ["0%", "-33.333333%"],
        }}
        transition={{
          ease: "linear",
          duration: speed,
          repeat: Infinity,
        }}
      >
        {duplicatedReviews.map((review, index) => (
          <ReviewCard key={`${review.id}-${index}`} review={review} />
        ))}
      </motion.div>
    </div>
  );
}
