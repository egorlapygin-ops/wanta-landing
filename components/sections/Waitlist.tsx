"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Section } from "@/components/layout/Section";
import { landingContent } from "@/content/landingContent";
import { cn } from "@/lib/utils";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type SubmitStatus = "idle" | "loading" | "success" | "error";

export function Waitlist() {
  const { title, subtitle, emailPlaceholder, submitLabel, categoryLabel, categories, successMessage, errorMessage } =
    landingContent.waitlist;

  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("");
  const [emailError, setEmailError] = useState("");
  const [status, setStatus] = useState<SubmitStatus>("idle");

  const validate = useCallback(() => {
    let valid = true;
    if (!email.trim()) {
      setEmailError("Введите email");
      valid = false;
    } else if (!EMAIL_REGEX.test(email)) {
      setEmailError("Некорректный формат email");
      valid = false;
    } else {
      setEmailError("");
    }
    return valid;
  }, [email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), category: category || undefined }),
      });

      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      setEmail("");
      setCategory("");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <Section id="waitlist" className="bg-muted/20">
        <div className="max-w-xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 rounded-2xl bg-background border border-border shadow-soft"
          >
            <p className="text-lg font-medium text-foreground">
              {successMessage}
            </p>
          </motion.div>
        </div>
      </Section>
    );
  }

  return (
    <Section id="waitlist" className="bg-muted/20">
      <div className="max-w-xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight text-center">
          {title}
        </h2>
        <p className="mt-4 text-center text-muted-foreground">{subtitle}</p>

        <motion.form
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onSubmit={handleSubmit}
          className="mt-10 space-y-6"
        >
          <div>
            <label htmlFor="waitlist-email" className="sr-only">
              {emailPlaceholder}
            </label>
            <Input
              id="waitlist-email"
              type="email"
              placeholder={emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => email && validate()}
              error={!!emailError}
              disabled={status === "loading"}
              autoComplete="email"
              required
            />
            {emailError && (
              <p className="mt-1.5 text-sm text-red-500">{emailError}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {categoryLabel}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {categories.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setCategory(opt)}
                  className={cn(
                    "px-3 py-2.5 rounded-xl text-sm text-left transition-colors border",
                    category === opt
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-background text-foreground hover:border-foreground/50"
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {status === "error" && (
            <p className="text-sm text-red-500">{errorMessage}</p>
          )}

          <Button
            type="submit"
            size="lg"
            variant="primary"
            className="w-full"
            isLoading={status === "loading"}
            disabled={status === "loading"}
          >
            {submitLabel}
          </Button>
        </motion.form>
      </div>
    </Section>
  );
}
