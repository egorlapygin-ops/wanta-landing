"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionProps {
  id?: string;
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  as?: "section" | "div";
  animate?: boolean;
}

const defaultContainer = "mx-auto max-w-6xl px-4 sm:px-6 lg:px-8";

export function Section({
  id,
  children,
  className,
  containerClassName,
  as: Component = "section",
  animate = true,
}: SectionProps) {
  const content = (
    <div className={cn(defaultContainer, containerClassName)}>{children}</div>
  );

  if (animate) {
    return (
      <Component
        id={id}
        className={cn("py-16 sm:py-20 lg:py-24", className)}
        aria-label={id ? undefined : undefined}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4 }}
        >
          {content}
        </motion.div>
      </Component>
    );
  }

  return (
    <Component
      id={id}
      className={cn("py-16 sm:py-20 lg:py-24", className)}
    >
      {content}
    </Component>
  );
}
