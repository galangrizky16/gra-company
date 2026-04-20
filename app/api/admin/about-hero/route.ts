import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { translateFields } from "@/lib/translate";

// ─── GET: fetch about hero content for both locales ─────────────────────────

export async function GET() {
  try {
    const rows = await prisma.aboutHeroContent.findMany();
    const map: Record<string, (typeof rows)[0]> = {};
    for (const r of rows) map[r.locale] = r;
    return NextResponse.json(map);
  } catch (e) {
    console.error("GET /api/admin/about-hero error:", e);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

// ─── PUT: upsert about hero content + auto-translate ────────────────────────

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      locale,
      badge,
      headline,
      headlineAccent,
      description,
      cta,
      ctaSecondary,
      imageUrl,
    } = body as {
      locale: string;
      badge: string;
      headline: string;
      headlineAccent: string;
      description: string;
      cta: string;
      ctaSecondary: string;
      imageUrl?: string | null;
    };

    if (!locale || !badge || !headline || !headlineAccent || !description || !cta || !ctaSecondary) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const existing = await prisma.aboutHeroContent.findUnique({
      where: { locale },
    });

    const saved = await prisma.aboutHeroContent.upsert({
      where: { locale },
      create: {
        locale,
        badge,
        headline,
        headlineAccent,
        description,
        cta,
        ctaSecondary,
        imageUrl: imageUrl ?? existing?.imageUrl ?? null,
      },
      update: {
        badge,
        headline,
        headlineAccent,
        description,
        cta,
        ctaSecondary,
        ...(imageUrl !== undefined ? { imageUrl } : {}),
      },
    });

    // Auto-translate to other locale (non-blocking)
    const other = locale === "id" ? "en" : "id";
    const fields = { badge, headline, headlineAccent, description, cta, ctaSecondary };

    translateFields(fields, locale, other)
      .then(async (translated) => {
        await prisma.aboutHeroContent.upsert({
          where: { locale: other },
          create: {
            locale: other,
            ...translated,
            imageUrl: saved.imageUrl,
          },
          update: {
            ...translated,
            imageUrl: saved.imageUrl,
          },
        });
      })
      .catch((e) => console.error("Auto-translate about-hero:", e));

    return NextResponse.json({ success: true, data: saved });
  } catch (e) {
    console.error("PUT /api/admin/about-hero error:", e);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
