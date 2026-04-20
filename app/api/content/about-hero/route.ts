import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { translateFields } from "@/lib/translate";

const noCache = { "Cache-Control": "no-store, no-cache, must-revalidate" };

export async function GET(request: NextRequest) {
  const locale = request.nextUrl.searchParams.get("locale") ?? "id";

  try {
    let section = await prisma.aboutHeroContent.findUnique({
      where: { locale },
    });

    if (!section) {
      const other = locale === "en" ? "id" : "en";
      const src = await prisma.aboutHeroContent.findUnique({
        where: { locale: other },
      });

      if (!src) return NextResponse.json(null, { headers: noCache });

      try {
        const translated = await translateFields(
          {
            badge: src.badge,
            headline: src.headline,
            headlineAccent: src.headlineAccent,
            description: src.description,
            cta: src.cta,
            ctaSecondary: src.ctaSecondary,
          },
          other,
          locale
        );

        section = await prisma.aboutHeroContent.create({
          data: {
            locale,
            ...translated,
            imageUrl: src.imageUrl,
          },
        });
      } catch {
        section = src;
      }
    }

    return NextResponse.json(
      {
        badge: section.badge,
        headline: section.headline,
        headlineAccent: section.headlineAccent,
        description: section.description,
        cta: section.cta,
        ctaSecondary: section.ctaSecondary,
        imageUrl: section.imageUrl,
      },
      { headers: noCache }
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch about-hero content" },
      { status: 500 }
    );
  }
}
