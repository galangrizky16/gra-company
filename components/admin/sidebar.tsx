"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Home,
  Image,
  Users,
  Film,
  Layers,
  Info,
  FileImage,
  LogOut,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

// ─── Menu items ──────────────────────────────────────────────────────────────

const HOME_CHILDREN = [
  { label: "Hero Section", href: "/admin/hero", icon: Image },
  { label: "Clients", href: "/admin/clients", icon: Users },
  { label: "Why Us", href: "/admin/why-us", icon: Film },
  { label: "Services", href: "/admin/services", icon: Layers },
];

const ABOUT_CHILDREN = [
  { label: "Hero Tentang", href: "/admin/about-hero", icon: FileImage },
];

// ─── Nav link ────────────────────────────────────────────────────────────────

function NavLink({
  href,
  icon: Icon,
  label,
  active,
  onClick,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`group relative flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-150 ${
        active
          ? "text-[#6D28D9]"
          : "text-[#64748B] hover:bg-[#F8F7FF] hover:text-[#6D28D9]"
      }`}
    >
      {active && (
        <motion.div
          layoutId="sidebar-active"
          className="absolute inset-0 rounded-lg bg-[#F5F3FF] ring-1 ring-[#6D28D9]/5"
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
        />
      )}
      <Icon className="relative z-10 h-[18px] w-[18px] flex-shrink-0" />
      <span className="relative z-10 flex-1">{label}</span>
      {active && (
        <ChevronRight className="relative z-10 h-3.5 w-3.5 text-[#6D28D9]/50" />
      )}
    </Link>
  );
}

// ─── Sidebar content (shared between desktop & mobile) ──────────────────────

function SidebarContent({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  const router = useRouter();
  const [homeOpen, setHomeOpen] = useState(
    HOME_CHILDREN.some((c) => pathname === c.href)
  );
  const [aboutOpen, setAboutOpen] = useState(
    ABOUT_CHILDREN.some((c) => pathname === c.href)
  );

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <>
      {/* Logo */}
      <div className="flex h-16 items-center px-5">
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-2"
          onClick={onNavigate}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#6D28D9]">
            <span className="text-sm font-bold text-white">G</span>
          </div>
          <span className="text-sm font-bold text-[#0F172A]">GRA Admin</span>
        </Link>
      </div>

      <div className="mx-4 border-t border-[#F1F5F9]" />

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
        {/* Dashboard */}
        <NavLink
          href="/admin/dashboard"
          icon={LayoutDashboard}
          label="Dashboard"
          active={pathname === "/admin/dashboard"}
          onClick={onNavigate}
        />

        {/* Home (dropdown) */}
        <div>
          <button
            onClick={() => setHomeOpen((v) => !v)}
            className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-150 ${
              HOME_CHILDREN.some((c) => pathname === c.href)
                ? "text-[#6D28D9]"
                : "text-[#64748B] hover:bg-[#F8F7FF] hover:text-[#6D28D9]"
            }`}
          >
            <Home className="h-[18px] w-[18px] flex-shrink-0" />
            <span className="flex-1 text-left">Home</span>
            <ChevronDown
              className={`h-3.5 w-3.5 transition-transform duration-200 ${
                homeOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          <AnimatePresence initial={false}>
            {homeOpen && (
              <motion.ul
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="ml-4 mt-1 space-y-0.5 border-l border-[#F1F5F9] pl-3">
                  {HOME_CHILDREN.map((item) => {
                    const active = pathname === item.href;
                    const Icon = item.icon;
                    return (
                      <li key={item.href} className="list-none">
                        <Link
                          href={item.href}
                          onClick={onNavigate}
                          className={`flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[12px] font-medium transition-all duration-150 ${
                            active
                              ? "bg-[#F5F3FF] text-[#6D28D9]"
                              : "text-[#94A3B8] hover:bg-[#F8F7FF] hover:text-[#6D28D9]"
                          }`}
                        >
                          <Icon className="h-3.5 w-3.5 flex-shrink-0" />
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </div>
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
        {/* About (dropdown) */}
        <div>
          <button
            onClick={() => setAboutOpen((v) => !v)}
            className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-150 ${
              ABOUT_CHILDREN.some((c) => pathname === c.href)
                ? "text-[#6D28D9]"
                : "text-[#64748B] hover:bg-[#F8F7FF] hover:text-[#6D28D9]"
            }`}
          >
            <Info className="h-[18px] w-[18px] flex-shrink-0" />
            <span className="flex-1 text-left">Tentang</span>
            <ChevronDown
              className={`h-3.5 w-3.5 transition-transform duration-200 ${
                aboutOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          <AnimatePresence initial={false}>
            {aboutOpen && (
              <motion.ul
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="ml-4 mt-1 space-y-0.5 border-l border-[#F1F5F9] pl-3">
                  {ABOUT_CHILDREN.map((item) => {
                    const active = pathname === item.href;
                    const Icon = item.icon;
                    return (
                      <li key={item.href} className="list-none">
                        <Link
                          href={item.href}
                          onClick={onNavigate}
                          className={`flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[12px] font-medium transition-all duration-150 ${
                            active
                              ? "bg-[#F5F3FF] text-[#6D28D9]"
                              : "text-[#94A3B8] hover:bg-[#F8F7FF] hover:text-[#6D28D9]"
                          }`}
                        >
                          <Icon className="h-3.5 w-3.5 flex-shrink-0" />
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </div>
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Footer */}
      <div className="mx-4 border-t border-[#F1F5F9]" />
      <div className="px-3 py-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-[#94A3B8] transition-all duration-150 hover:bg-red-50 hover:text-red-500"
        >
          <LogOut className="h-[18px] w-[18px]" />
          Sign out
        </button>
      </div>
    </>
  );
}

// ─── Main export ─────────────────────────────────────────────────────────────

export default function AdminSidebar({
  mobileOpen,
  onClose,
}: {
  mobileOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden h-screen w-[260px] flex-col bg-white md:flex">
        <SidebarContent pathname={pathname} />
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col bg-white shadow-xl md:hidden"
            >
              <SidebarContent pathname={pathname} onNavigate={onClose} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
