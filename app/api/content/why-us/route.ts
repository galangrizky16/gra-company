import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { translateFields } from "@/lib/translate";

const noCache = { "Cache-Control": "no-store, no-cache, must-revalidate" };

type Stat = { value: string; label: string };

export async function GET(request: NextRequest) {
  const locale = request.nextUrl.searchParams.get("locale") ?? "id";

  try {
    let section = await prisma.whyUsSectionContent.findUnique({
      where: { locale },
    });

    // Auto-translate fallback
    if (!section) {
      const other = locale === "en" ? "id" : "en";
      const src = await prisma.whyUsSectionContent.findUnique({
        where: { locale: other },
      });

      if (!src) return NextResponse.json(null, { headers: noCache });

      try {
        const srcStats = (src.stats ?? []) as Stat[];
        const fieldsToTranslate: Record<string, string> = {
          badge: src.badge,
          heading: src.heading,
          ctaText: src.ctaText,
        };
        srcStats.forEach((s, i) => {
          fieldsToTranslate[`stat_label_${i}`] = s.label;
        });

        const translated = await translateFields(
          fieldsToTranslate,
          other,
          locale
        );

        const translatedStats = srcStats.map((s, i) => ({
          value: s.value,
          label: translated[`stat_label_${i}`] ?? s.label,
        }));

        section = await prisma.whyUsSectionContent.create({
          data: {
            locale,
            badge: translated.badge,
            heading: translated.heading,
            ctaText: translated.ctaText,
            stats: translatedStats,
            videoUrl: src.videoUrl,
          },
        });
      } catch {
        section = src;
      }
    }

    const stats = (section.stats ?? []) as Stat[];

    return NextResponse.json(
      {
        badge: section.badge,
        heading: section.heading,
        ctaText: section.ctaText,
        stats,
        videoUrl: section.videoUrl,
      },
      { headers: noCache }
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch why-us content" },
      { status: 500 }
    );
  }
}
