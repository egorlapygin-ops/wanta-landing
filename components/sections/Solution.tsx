"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { landingContent } from "@/content/landingContent";

export function Solution() {
  const { title, chain, points } = landingContent.solution;

  return (
    <Section id="solution">
      <div className="max-w-3xl">
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
          {title}
        </h2>
        <div className="mt-8 flex flex-wrap items-center gap-2 sm:gap-3 text-sm">
          {chain.map((step, i) => (
            <span key={i} className="flex items-center gap-2">
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="px-3 py-1.5 rounded-lg bg-accent/15 text-accent font-medium"
              >
                {step}
              </motion.span>
              {i < chain.length - 1 && (
                <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
              )}
            </span>
          ))}
        </div>
        <ul className="mt-10 space-y-3">
          {points.map((point, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + i * 0.05 }}
              className="flex items-start gap-3 text-muted-foreground"
            >
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
              <span>{point}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
