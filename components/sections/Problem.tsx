"use client";

import { motion } from "framer-motion";
import {
  MessageCircle,
  Search,
  RotateCcw,
  Lightbulb,
  FileQuestion,
} from "lucide-react";
import { Section } from "@/components/layout/Section";
import { landingContent } from "@/content/landingContent";

const icons = [
  MessageCircle,
  Search,
  RotateCcw,
  Lightbulb,
  FileQuestion,
];

export function Problem() {
  const { title, pains } = landingContent.problem;

  return (
    <Section id="problem" className="bg-muted/20">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
            {title}
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {pains.map((pain, i) => {
            const Icon = icons[i % icons.length];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex gap-3 p-4 rounded-xl bg-background border border-border shadow-soft hover:shadow-soft-lg transition-shadow"
              >
                <div className="shrink-0 w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-sm text-foreground leading-snug">{pain}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
