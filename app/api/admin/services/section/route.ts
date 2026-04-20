import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { translateFields } from "@/lib/translate";

export const dynamic = "force-dynamic";

// ─── GET: fetch both locales ─────────────────────────────────────────────────

export async function GET() {
  try {
    const rows = await prisma.servicesSectionContent.findMany();
    const map: Record<string, (typeof rows)[0]> = {};
    for (const r of rows) map[r.locale] = r;
    return NextResponse.json(map);
  } catch (e) {
    console.error("GET /api/admin/services/section error:", e);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

// ─── PUT: upsert + auto-translate ────────────────────────────────────────────

export async function PUT(request: NextRequest) {
  try {
    const { locale, badge, heading, subheading } = await request.json();

    if (!locale || !badge || !heading || !subheading) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const saved = await prisma.servicesSectionContent.upsert({
      where: { locale },
      create: { locale, badge, heading, subheading },
      update: { badge, heading, subheading },
    });

    // Auto-translate
    const other = locale === "id" ? "en" : "id";
    translateFields({ badge, heading, subheading }, locale, other)
      .then(async (translated) => {
        await prisma.servicesSectionContent.upsert({
          where: { locale: other },
          create: { locale: other, ...translated },
          update: translated,
        });
      })
      .catch((e) => console.error("Auto-translate services section:", e));

    return NextResponse.json({ success: true, data: saved });
  } catch (e) {
    console.error("PUT /api/admin/services/section error:", e);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
