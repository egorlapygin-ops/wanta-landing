"use client";

import { motion } from "framer-motion";
import {
  Sofa,
  Film,
  UtensilsCrossed,
  MapPin,
  Plane,
} from "lucide-react";
import { Section } from "@/components/layout/Section";
import { Badge } from "@/components/ui/Badge";
import { landingContent } from "@/content/landingContent";
import { cn } from "@/lib/utils";

const useCaseIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  interior: Sofa,
  movies: Film,
  recipes: UtensilsCrossed,
  places: MapPin,
  travel: Plane,
};

export function UseCases() {
  const { title, items } = landingContent.useCases;

  return (
    <Section id="use-cases">
      <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight text-center mb-12 lg:mb-16">
        {title}
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, i) => {
          const Icon = useCaseIcons[item.id] ?? Sofa;
          return (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={cn(
                "group flex flex-col p-6 rounded-2xl border border-border bg-background",
                "shadow-soft hover:shadow-soft-lg hover:border-accent/30 transition-all duration-300"
              )}
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-accent/15 flex items-center justify-center group-hover:bg-accent/25 transition-colors">
                  <Icon className="h-6 w-6 text-accent" />
                </div>
                <Badge variant="accent">Сценарий</Badge>
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed flex-1">
                {item.description}
              </p>
            </motion.article>
          );
        })}
      </div>
    </Section>
  );
}
