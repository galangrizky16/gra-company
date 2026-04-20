import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { translateFields } from "@/lib/translate";

const noCache = { "Cache-Control": "no-store, no-cache, must-revalidate" };

export async function GET(request: NextRequest) {
  const locale = request.nextUrl.searchParams.get("locale") ?? "id";

  try {
    // ── Section text ────────────────────────────────────────────────
    let section = await prisma.clientsSectionContent.findUnique({
      where: { locale },
    });

    // Auto-translate fallback
    if (!section) {
      const other = locale === "en" ? "id" : "en";
      const src = await prisma.clientsSectionContent.findUnique({
        where: { locale: other },
      });

      if (src) {
        try {
          const translated = await translateFields(
            { badge: src.badge, heading: src.heading },
            other,
            locale
          );
          section = await prisma.clientsSectionContent.create({
            data: { locale, ...translated },
          });
        } catch {
          // fallback to source
          section = src;
        }
      }
    }

    // ── Client logos ────────────────────────────────────────────────
    const clients = await prisma.client.findMany({
      where: { visible: true },
      orderBy: { order: "asc" },
      select: { id: true, name: true, logoUrl: true, website: true },
    });

    // No section text AND no clients → return null (empty section)
    if (!section && clients.length === 0) {
      return NextResponse.json(null, { headers: noCache });
    }

    return NextResponse.json(
      {
        badge: section?.badge ?? "",
        heading: section?.heading ?? "",
        clients,
      },
      { headers: noCache }
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch clients" },
      { status: 500 }
    );
  }
}
