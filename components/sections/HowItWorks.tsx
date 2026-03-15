"use client";

import { motion } from "framer-motion";
import { Download, Scan, LayoutGrid, Zap } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { landingContent } from "@/content/landingContent";

const stepIcons = [Download, Scan, LayoutGrid, Zap];

export function HowItWorks() {
  const { title, steps } = landingContent.howItWorks;

  return (
    <Section id="how-it-works" className="bg-muted/20">
      <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight text-center mb-12 lg:mb-16">
        {title}
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step, i) => {
          const Icon = stepIcons[i];
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative flex flex-col p-6 rounded-2xl bg-background border border-border shadow-soft hover:shadow-soft-lg hover:border-border/80 transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-accent" />
                </div>
                <span className="text-xs font-medium text-muted-foreground">
                  Шаг {i + 1}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-0.5 bg-border" />
              )}
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}
