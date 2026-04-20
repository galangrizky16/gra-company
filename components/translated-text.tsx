"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTranslate } from "@/lib/i18n/use-translate";

type Props = {
  children: string;
  as?: React.ElementType;
  className?: string;
  loadingClassName?: string;
};

/**
 * Renders translated text with a smooth crossfade animation.
 * Falls back to original text on error.
 *
 * Usage:
 *   <T>Jasa Website & WhatsApp Bot</T>
 *   <T as="h1" className="text-3xl">Selamat Datang</T>
 */
export function T({
  children,
  as: Tag = "span",
  className,
  loadingClassName,
}: Props) {
  const { text, isLoading } = useTranslate(children);

  return (
    <Tag className={`relative inline-block ${className ?? ""}`}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={text}
          initial={{ opacity: 0, y: 2 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -2 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="inline-block"
        >
          {text}
        </motion.span>
      </AnimatePresence>
      {isLoading && (
        <span
          className={`pointer-events-none absolute inset-0 animate-pulse rounded bg-[#E5E7EB]/40 ${loadingClassName ?? ""}`}
        />
      )}
    </Tag>
  );
}
