import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { translateFields } from "@/lib/translate";

type Stat = { value: string; label: string };

// ─── GET: fetch both locales ─────────────────────────────────────────────────

export async function GET() {
  try {
    const rows = await prisma.whyUsSectionContent.findMany();
    const map: Record<string, (typeof rows)[0]> = {};
    for (const r of rows) map[r.locale] = r;
    return NextResponse.json(map);
  } catch (e) {
    console.error("GET /api/admin/why-us error:", e);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

// ─── PUT: upsert text + auto-translate ───────────────────────────────────────

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { locale, badge, heading, ctaText, stats, videoUrl } = body as {
      locale: string;
      badge: string;
      heading: string;
      ctaText: string;
      stats: Stat[];
      videoUrl?: string | null;
    };

    if (!locale || !badge || !heading || !ctaText || !stats?.length) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Get existing record to preserve videoUrl if not provided
    const existing = await prisma.whyUsSectionContent.findUnique({
      where: { locale },
    });

    const saved = await prisma.whyUsSectionContent.upsert({
      where: { locale },
      create: {
        locale,
        badge,
        heading,
        ctaText,
        stats,
        videoUrl: videoUrl ?? existing?.videoUrl ?? null,
      },
      update: {
        badge,
        heading,
        ctaText,
        stats,
        ...(videoUrl !== undefined ? { videoUrl } : {}),
      },
    });

    // Auto-translate to other locale (non-blocking)
    const other = locale === "id" ? "en" : "id";
    const fieldsToTranslate: Record<string, string> = {
      badge,
      heading,
      ctaText,
    };
    stats.forEach((s, i) => {
      fieldsToTranslate[`stat_label_${i}`] = s.label;
    });

    translateFields(fieldsToTranslate, locale, other)
      .then(async (translated) => {
        const translatedStats = stats.map((s, i) => ({
          value: s.value,
          label: translated[`stat_label_${i}`] ?? s.label,
        }));

        await prisma.whyUsSectionContent.upsert({
          where: { locale: other },
          create: {
            locale: other,
            badge: translated.badge,
            heading: translated.heading,
            ctaText: translated.ctaText,
            stats: translatedStats,
            videoUrl: saved.videoUrl,
          },
          update: {
            badge: translated.badge,
            heading: translated.heading,
            ctaText: translated.ctaText,
            stats: translatedStats,
            videoUrl: saved.videoUrl,
          },
        });
      })
      .catch((e) => console.error("Auto-translate why-us:", e));

    return NextResponse.json({ success: true, data: saved });
  } catch (e) {
    console.error("PUT /api/admin/why-us error:", e);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
