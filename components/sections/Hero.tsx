"use client";

import { motion } from "framer-motion";
import { ArrowRight, LayoutGrid, Film, Utensils, MapPin, Plane } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { scrollToSection } from "@/lib/utils";
import { landingContent } from "@/content/landingContent";

const mockupCategories = [
  { label: "Интерьер", icon: LayoutGrid },
  { label: "Фильмы", icon: Film },
  { label: "Рецепты", icon: Utensils },
  { label: "Рестораны", icon: MapPin },
  { label: "Travel", icon: Plane },
];

export function Hero() {
  const { title, subtitle, primaryCta, secondaryCta, trustLine } =
    landingContent.hero;

  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-24 pb-16 lg:pt-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1]"
            >
              {title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-xl leading-relaxed"
            >
              {subtitle}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-8 flex flex-col sm:flex-row gap-4"
            >
              <Button
                size="lg"
                variant="primary"
                onClick={() => scrollToSection("#waitlist")}
              >
                {primaryCta}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => scrollToSection("#how-it-works")}
              >
                {secondaryCta}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-10 text-sm text-muted-foreground font-medium"
            >
              {trustLine}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative lg:block mt-8 lg:mt-0"
            aria-hidden
          >
            <div className="rounded-2xl border border-border bg-card shadow-soft-lg p-6 space-y-4">
              <div className="flex gap-2 flex-wrap">
                {["Рилс с диваном", "Пост про фильм", "Рецепт пасты", "Отель в Грузии"].map(
                  (label, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-lg bg-muted/60 text-muted-foreground text-xs"
                    >
                      {label}
                    </span>
                  )
                )}
              </div>
              <div className="text-xs text-muted-foreground mb-2">
                ↓ Структурировано в
              </div>
              <div className="grid grid-cols-2 gap-3">
                {mockupCategories.map((cat, i) => (
                  <div
                    key={cat.label}
                    className="flex items-center gap-2 p-3 rounded-xl bg-muted/40 border border-border/50"
                  >
                    <cat.icon className="h-5 w-5 text-accent shrink-0" />
                    <span className="text-sm font-medium text-foreground">
                      {cat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
