import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { translateFields } from "@/lib/translate";

export const dynamic = "force-dynamic";

// ─── GET: fetch section text for both locales ────────────────────────────────

export async function GET() {
  try {
    const rows = await prisma.clientsSectionContent.findMany();
    const map: Record<string, (typeof rows)[0]> = {};
    for (const r of rows) map[r.locale] = r;
    return NextResponse.json(map);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch" },
      { status: 500 }
    );
  }
}

// ─── PUT: upsert section text + auto-translate ───────────────────────────────

export async function PUT(request: NextRequest) {
  try {
    const { locale, badge, heading } = (await request.json()) as {
      locale: string;
      badge: string;
      heading: string;
    };

    if (!locale || !badge || !heading) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const saved = await prisma.clientsSectionContent.upsert({
      where: { locale },
      create: { locale, badge, heading },
      update: { badge, heading },
    });

    // Auto-translate other locale (non-blocking)
    const other = locale === "id" ? "en" : "id";
    translateFields({ badge, heading }, locale, other)
      .then(async (translated) => {
        await prisma.clientsSectionContent.upsert({
          where: { locale: other },
          create: { locale: other, ...translated },
          update: translated,
        });
      })
      .catch((e) => console.error("Auto-translate clients section:", e));

    return NextResponse.json({ success: true, data: saved });
  } catch {
    return NextResponse.json(
      { error: "Failed to save" },
      { status: 500 }
    );
  }
}
