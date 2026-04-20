import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { translateFields } from "@/lib/translate";

type Feature = { icon: string; title: string; description: string };

// ─── GET: fetch both locales ─────────────────────────────────────────────────

export async function GET() {
  try {
    const rows = await prisma.whyChooseContent.findMany();
    const map: Record<string, (typeof rows)[0]> = {};
    for (const r of rows) map[r.locale] = r;
    return NextResponse.json(map);
  } catch (e) {
    console.error("GET /api/admin/why-choose error:", e);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

// ─── PUT: upsert + auto-translate ────────────────────────────────────────────

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { locale, badge, heading, subtitle, features } = body as {
      locale: string;
      badge: string;
      heading: string;
      subtitle: string;
      features: Feature[];
    };

    if (!locale || !badge || !heading || !features?.length) {
      return NextResponse.json(
        { error: "badge, heading, and at least one feature are required" },
        { status: 400 }
      );
    }

    const saved = await prisma.whyChooseContent.upsert({
      where: { locale },
      create: { locale, badge, heading, subtitle: subtitle ?? "", features },
      update: { badge, heading, subtitle: subtitle ?? "", features },
    });

    // Auto-translate
    const other = locale === "id" ? "en" : "id";
    const fields: Record<string, string> = {
      badge,
      heading,
      subtitle: subtitle ?? "",
    };
    features.forEach((f, i) => {
      fields[`ft_${i}`] = f.title;
      fields[`fd_${i}`] = f.description;
    });

    translateFields(fields, locale, other)
      .then(async (translated) => {
        const translatedFeatures = features.map((f, i) => ({
          icon: f.icon,
          title: translated[`ft_${i}`] ?? f.title,
          description: translated[`fd_${i}`] ?? f.description,
        }));

        await prisma.whyChooseContent.upsert({
          where: { locale: other },
          create: {
            locale: other,
            badge: translated.badge,
            heading: translated.heading,
            subtitle: translated.subtitle,
            features: translatedFeatures,
          },
          update: {
            badge: translated.badge,
            heading: translated.heading,
            subtitle: translated.subtitle,
            features: translatedFeatures,
          },
        });
      })
      .catch((e) => console.error("Auto-translate why-choose:", e));

    return NextResponse.json({ success: true, data: saved });
  } catch (e) {
    console.error("PUT /api/admin/why-choose error:", e);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
