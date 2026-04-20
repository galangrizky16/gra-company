import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { translateFields } from "@/lib/translate";

const noCache = { "Cache-Control": "no-store, no-cache, must-revalidate" };

export async function GET(request: NextRequest) {
  const locale = request.nextUrl.searchParams.get("locale") ?? "id";

  try {
    // Section header
    let section = await prisma.servicesSectionContent.findUnique({
      where: { locale },
    });

    // Auto-translate fallback for section text
    if (!section) {
      const other = locale === "en" ? "id" : "en";
      const src = await prisma.servicesSectionContent.findUnique({
        where: { locale: other },
      });

      if (src) {
        try {
          const translated = await translateFields(
            { badge: src.badge, heading: src.heading, subheading: src.subheading },
            other,
            locale
          );
          section = await prisma.servicesSectionContent.create({
            data: { locale, ...translated },
          });
        } catch {
          section = src;
        }
      }
    }

    // Services
    let services = await prisma.service.findMany({
      where: { locale, visible: true },
      orderBy: { order: "asc" },
    });

    // Auto-translate fallback for services
    if (services.length === 0) {
      const other = locale === "en" ? "id" : "en";
      const srcServices = await prisma.service.findMany({
        where: { locale: other, visible: true },
        orderBy: { order: "asc" },
      });

      if (srcServices.length > 0) {
        try {
          const fields: Record<string, string> = {};
          srcServices.forEach((s, i) => {
            fields[`label_${i}`] = s.label;
            fields[`desc_${i}`] = s.description;
          });

          const translated = await translateFields(fields, other, locale);

          for (let i = 0; i < srcServices.length; i++) {
            const s = srcServices[i];
            await prisma.service.create({
              data: {
                locale,
                slug: s.slug,
                icon: s.icon,
                colorTheme: s.colorTheme,
                label: translated[`label_${i}`] ?? s.label,
                description: translated[`desc_${i}`] ?? s.description,
                order: s.order,
                visible: s.visible,
              },
            });
          }

          services = await prisma.service.findMany({
            where: { locale, visible: true },
            orderBy: { order: "asc" },
          });
        } catch {
          services = srcServices;
        }
      }
    }

    if (!section && services.length === 0) {
      return NextResponse.json(null, { headers: noCache });
    }

    return NextResponse.json(
      {
        badge: section?.badge ?? "",
        heading: section?.heading ?? "",
        subheading: section?.subheading ?? "",
        services: services.map((s) => ({
          id: s.id,
          slug: s.slug,
          icon: s.icon,
          colorTheme: s.colorTheme,
          label: s.label,
          description: s.description,
        })),
      },
      { headers: noCache }
    );
  } catch (e) {
    console.error("GET /api/content/services error:", e);
    return NextResponse.json(
      { error: "Failed to fetch services" },
      { status: 500 }
    );
  }
}
