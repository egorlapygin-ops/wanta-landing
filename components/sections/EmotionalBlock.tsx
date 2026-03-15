"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/layout/Section";
import { landingContent } from "@/content/landingContent";

export function EmotionalBlock() {
  const { title, text } = landingContent.emotional;

  return (
    <Section className="bg-muted/30">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-2xl mx-auto text-center"
      >
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground tracking-tight leading-tight">
          {title}
        </h2>
        <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
          {text}
        </p>
      </motion.div>
    </Section>
  );
}
