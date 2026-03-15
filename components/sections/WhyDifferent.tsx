"use client";

import { motion } from "framer-motion";
import { X, Check } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { landingContent } from "@/content/landingContent";

export function WhyDifferent() {
  const { title, usual, ours } = landingContent.whyDifferent;

  return (
    <Section id="why-different" className="bg-muted/20">
      <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight text-center mb-12 lg:mb-16">
        {title}
      </h2>
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="p-6 rounded-2xl border border-border bg-background"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
              <X className="h-4 w-4 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">
              {usual.title}
            </h3>
          </div>
          <ul className="space-y-2">
            {usual.items.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-muted-foreground"
              >
                <span className="mt-1.5 h-1 w-1 rounded-full bg-muted-foreground shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="p-6 rounded-2xl border-2 border-accent/30 bg-accent/5"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
              <Check className="h-4 w-4 text-accent" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">
              {ours.title}
            </h3>
          </div>
          <ul className="space-y-2">
            {ours.items.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-foreground"
              >
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </Section>
  );
}
