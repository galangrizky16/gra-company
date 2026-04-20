"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { usePathname } from "next/navigation";

// ─── Component ──────────────────────────────────────────────────────────────

export default function RouteProgress() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const prevPath = useRef(pathname);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cleanup = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (hideTimer.current) clearTimeout(hideTimer.current);
  }, []);

  // Intercept clicks on <a> / Next <Link> to start the bar immediately
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("http") || href.startsWith("mailto:")) return;
      if (anchor.target === "_blank") return;
      if (href === pathname) return;

      // Start progress
      cleanup();
      setProgress(0);
      setVisible(true);

      // Simulate fast progress that slows down
      let current = 0;
      timerRef.current = setInterval(() => {
        current += Math.max(1, Math.floor((90 - current) * 0.08));
        if (current >= 90) current = 90;
        setProgress(current);
      }, 50);
    }

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [pathname, cleanup]);

  // Complete the bar when pathname changes
  useEffect(() => {
    if (prevPath.current !== pathname) {
      prevPath.current = pathname;
      cleanup();

      // Snap to 100
      setProgress(100);

      // Hide after transition
      hideTimer.current = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 300);
    }

    return cleanup;
  }, [pathname, cleanup]);

  if (!visible && progress === 0) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[9999] h-[3px]"
      role="progressbar"
      aria-valuenow={progress}
    >
      <div
        className="h-full bg-[#6D28D9] transition-all duration-200 ease-out"
        style={{
          width: `${progress}%`,
          opacity: visible || progress > 0 ? 1 : 0,
        }}
      />
    </div>
  );
}
