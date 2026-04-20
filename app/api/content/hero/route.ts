import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { translateFields } from "@/lib/translate";

export async function GET(request: NextRequest) {
  const locale = request.nextUrl.searchParams.get("locale") ?? "id";

  try {
    // 1. Try to find content for the requested locale
    let hero = await prisma.heroContent.findUnique({ where: { locale } });

    const noCache = {
      "Cache-Control": "no-store, no-cache, must-revalidate",
    };

    if (hero) {
      return NextResponse.json(
        {
          badge: hero.badge,
          headline: hero.headline,
          subheadline: hero.subheadline,
          ctaPrimary: hero.ctaPrimary,
          ctaSecondary: hero.ctaSecondary,
        },
        { headers: noCache }
      );
    }

    // 2. No content for this locale — try the other locale as source
    const sourceLocale = locale === "en" ? "id" : "en";
    const source = await prisma.heroContent.findUnique({
      where: { locale: sourceLocale },
    });

    // 3. No content at all → return null (hero section will be empty)
    if (!source) {
      return NextResponse.json(null, { headers: noCache });
    }

    // 4. Auto-translate using LibreTranslate & cache in DB
    try {
      const translated = await translateFields(
        {
          badge: source.badge,
          headline: source.headline,
          subheadline: source.subheadline,
          ctaPrimary: source.ctaPrimary,
          ctaSecondary: source.ctaSecondary,
        },
        sourceLocale,
        locale
      );

      // Cache the translation in the database
      hero = await prisma.heroContent.create({
        data: { locale, ...translated },
      });

      return NextResponse.json(translated, { headers: noCache });
    } catch {
      // Translation API failed — fallback to source content
      return NextResponse.json(
        {
          badge: source.badge,
          headline: source.headline,
          subheadline: source.subheadline,
          ctaPrimary: source.ctaPrimary,
          ctaSecondary: source.ctaSecondary,
        },
        { headers: noCache }
      );
    }
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch hero content" },
      { status: 500 }
    );
  }
}
