import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { translateFields } from "@/lib/translate";

// ─── GET: fetch hero content for both locales ────────────────────────────────

export async function GET() {
  try {
    const rows = await prisma.heroContent.findMany();
    const map: Record<string, typeof rows[0]> = {};
    for (const r of rows) map[r.locale] = r;
    return NextResponse.json(map);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch hero content" },
      { status: 500 }
    );
  }
}

// ─── PUT: upsert hero content + auto-translate other locale ──────────────────

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      locale,
      badge,
      headline,
      subheadline,
      ctaPrimary,
      ctaSecondary,
    } = body as {
      locale: string;
      badge: string;
      headline: string;
      subheadline: string;
      ctaPrimary: string;
      ctaSecondary: string;
    };

    // Validate
    if (!locale || !badge || !headline || !subheadline || !ctaPrimary || !ctaSecondary) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // 1. Upsert the submitted locale
    const saved = await prisma.heroContent.upsert({
      where: { locale },
      create: { locale, badge, headline, subheadline, ctaPrimary, ctaSecondary },
      update: { badge, headline, subheadline, ctaPrimary, ctaSecondary },
    });

    // 2. Auto-translate to the other locale (background, non-blocking to the response)
    const otherLocale = locale === "id" ? "en" : "id";
    const fields = { badge, headline, subheadline, ctaPrimary, ctaSecondary };

    translateFields(fields, locale, otherLocale)
      .then(async (translated) => {
        await prisma.heroContent.upsert({
          where: { locale: otherLocale },
          create: { locale: otherLocale, ...translated },
          update: translated,
        });
      })
      .catch((err) => {
        console.error("Auto-translate failed:", err);
      });

    return NextResponse.json({ success: true, data: saved });
  } catch {
    return NextResponse.json(
      { error: "Failed to save hero content" },
      { status: 500 }
    );
  }
}
