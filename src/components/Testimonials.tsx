"use client";

import { motion } from "framer-motion";
import { ReviewMarquee } from "@/components/atoms/ReviewMarquee";
import { testimonials } from "@/constants/data";
import { Quote } from "lucide-react";

export function Testimonials() {
  return (
    <section className="relative py-24 md:py-32 bg-foreground/[0.02] border-y border-foreground/5 overflow-hidden">
      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <div className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
             <div className="mx-auto h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
               <Quote className="h-8 w-8 fill-current opacity-80" />
             </div>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl font-black tracking-tight text-foreground mb-6"
          >
            Trusted by Leaders &<br className="hidden md:block"/> Perfectionists
          </motion.h2>
          <motion.p 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.5, delay: 0.2 }}
             className="text-lg md:text-xl text-foreground/70 leading-relaxed"
          >
            Don't just take our word for it. Discover why discerning patients choose 
            us for their transformative dental journeys.
          </motion.p>
        </div>
      </div>

      {/* Infinite Scrolling Marquee */}
      <ReviewMarquee reviews={testimonials} speed={60} />
      
      {/* Reverse direction array for second marquee effect */}
      <div className="mt-8">
        <ReviewMarquee reviews={[...testimonials].reverse()} speed={80} />
      </div>
    </section>
  );
}
