"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Globe,
  Users,
  Eye,
  ArrowUpRight,
  Image,
  TrendingUp,
  Clock,
} from "lucide-react";

// ─── Stats ───────────────────────────────────────────────────────────────────

const STATS = [
  {
    label: "Total Visitors",
    value: "1,234",
    icon: Eye,
    change: "+12%",
    positive: true,
  },
  {
    label: "Active Clients",
    value: "24",
    icon: Users,
    change: "+3 this month",
    positive: true,
  },
  {
    label: "Languages",
    value: "2",
    icon: Globe,
    change: "ID / EN",
    positive: true,
  },
];

const QUICK_LINKS = [
  {
    label: "Edit Hero Section",
    description: "Update headline, CTA & background",
    href: "/admin/hero",
    icon: Image,
  },
  {
    label: "Manage Clients",
    description: "Add or reorder client logos",
    href: "/admin/clients",
    icon: Users,
  },
];

// ─── Animation ───────────────────────────────────────────────────────────────

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" as const },
  },
};

// ─── Page ────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  return (
    <motion.div variants={container} initial="hidden" animate="show">
      {/* Welcome banner */}
      <motion.div
        variants={fadeUp}
        className="mb-8 rounded-2xl bg-gradient-to-br from-[#6D28D9] to-[#4C1D95] p-6 text-white sm:p-8"
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-white/70">
              Welcome back 👋
            </p>
            <h1 className="mt-1 text-xl font-bold sm:text-2xl">
              GRA Admin Panel
            </h1>
            <p className="mt-2 max-w-md text-sm text-white/60">
              Manage your website content, clients, and services from here.
            </p>
          </div>
          <div className="hidden rounded-xl bg-white/10 p-3 sm:block">
            <TrendingUp className="h-6 w-6 text-white/80" />
          </div>
        </div>
      </motion.div>

      {/* Stats grid */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              className="group rounded-xl border border-[#F1F5F9] bg-white p-5 transition-shadow hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F5F3FF]">
                  <Icon className="h-4 w-4 text-[#6D28D9]" />
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                    stat.positive
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-[#F1F5F9] text-[#64748B]"
                  }`}
                >
                  {stat.change}
                </span>
              </div>
              <p className="mt-4 text-2xl font-bold tracking-tight text-[#0F172A]">
                {stat.value}
              </p>
              <p className="mt-0.5 text-xs text-[#94A3B8]">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Quick actions + recent */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Quick actions */}
        <motion.div variants={fadeUp} className="lg:col-span-3">
          <h2 className="mb-4 text-sm font-semibold text-[#0F172A]">
            Quick Actions
          </h2>
          <div className="space-y-2">
            {QUICK_LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group flex items-center gap-4 rounded-xl border border-[#F1F5F9] bg-white p-4 transition-all hover:border-[#6D28D9]/20 hover:shadow-sm"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F5F3FF] transition-colors group-hover:bg-[#6D28D9] group-hover:text-white">
                    <Icon className="h-4 w-4 text-[#6D28D9] group-hover:text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#0F172A]">
                      {link.label}
                    </p>
                    <p className="text-xs text-[#94A3B8]">
                      {link.description}
                    </p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-[#94A3B8] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#6D28D9]" />
                </Link>
              );
            })}
          </div>
        </motion.div>

        {/* Recent activity */}
        <motion.div variants={fadeUp} className="lg:col-span-2">
          <h2 className="mb-4 text-sm font-semibold text-[#0F172A]">
            Recent Activity
          </h2>
          <div className="rounded-xl border border-[#F1F5F9] bg-white p-5">
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#F1F5F9]">
                <Clock className="h-4 w-4 text-[#94A3B8]" />
              </div>
              <p className="text-sm font-medium text-[#64748B]">
                No recent activity
              </p>
              <p className="mt-1 text-xs text-[#94A3B8]">
                Actions you take will appear here
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
