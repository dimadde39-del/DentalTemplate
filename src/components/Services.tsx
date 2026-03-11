"use client";

import { motion } from "framer-motion";
import { siteConfig } from "@/config/site";
import { ServiceCard } from "@/components/atoms/ServiceCard";
import { Sparkles } from "lucide-react";

export function Services() {
  return (
    <section id="services" className="relative py-24 md:py-32 bg-background overflow-hidden">
      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <div className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto mb-16 md:mb-24">
           <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary mb-6"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Comprehensive Dental Care
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-foreground mb-6"
          >
            Elevate Your <span className="text-primary italic font-serif">Smile</span>
          </motion.h2>
          <motion.p 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.5, delay: 0.2 }}
             className="text-lg md:text-xl text-foreground/70 leading-relaxed"
          >
            We offer a full spectrum of advanced dental services at {siteConfig.clinicName}, 
            designed to provide lasting results in an environment of absolute comfort.
          </motion.p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[minmax(300px,_auto)]">
          {siteConfig.defaultServices.map((service, index) => (
            <ServiceCard key={service} title={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
