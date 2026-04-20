import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { translateFields } from "@/lib/translate";

export const dynamic = "force-dynamic";

// ─── GET: fetch all services for both locales ────────────────────────────────

export async function GET() {
  try {
    const rows = await prisma.service.findMany({ orderBy: { order: "asc" } });
    const map: Record<string, typeof rows> = {};
    for (const r of rows) {
      if (!map[r.locale]) map[r.locale] = [];
      map[r.locale].push(r);
    }
    return NextResponse.json(map);
  } catch (e) {
    console.error("GET /api/admin/services error:", e);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

// ─── POST: create service + auto-translate ───────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { locale, slug, icon, colorTheme, label, description, order } =
      body as {
        locale: string;
        slug: string;
        icon: string;
        colorTheme: string;
        label: string;
        description: string;
        order?: number;
      };

    if (!locale || !slug || !label || !description) {
      return NextResponse.json(
        { error: "slug, label, description are required" },
        { status: 400 }
      );
    }

    const count = await prisma.service.count({ where: { locale } });

    const saved = await prisma.service.create({
      data: {
        locale,
        slug,
        icon: icon || "Globe",
        colorTheme: colorTheme || "violet",
        label,
        description,
        order: order ?? count,
      },
    });

    // Auto-translate to other locale
    const other = locale === "id" ? "en" : "id";
    translateFields({ label, description }, locale, other)
      .then(async (translated) => {
        // Check if slug already exists in other locale
        const existing = await prisma.service.findUnique({
          where: { locale_slug: { locale: other, slug } },
        });
        if (!existing) {
          await prisma.service.create({
            data: {
              locale: other,
              slug,
              icon: icon || "Globe",
              colorTheme: colorTheme || "violet",
              label: translated.label,
              description: translated.description,
              order: order ?? count,
            },
          });
        }
      })
      .catch((e) => console.error("Auto-translate service:", e));

    return NextResponse.json({ success: true, data: saved });
  } catch (e) {
    console.error("POST /api/admin/services error:", e);
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}

// ─── PUT: update a service + auto-translate ──────────────────────────────────

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, icon, colorTheme, label, description, order, visible } =
      body as {
        id: string;
        icon?: string;
        colorTheme?: string;
        label?: string;
        description?: string;
        order?: number;
        visible?: boolean;
      };

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const current = await prisma.service.findUnique({ where: { id } });
    if (!current) {
      return NextResponse.json(
        { error: "Service not found" },
        { status: 404 }
      );
    }

    const saved = await prisma.service.update({
      where: { id },
      data: {
        ...(icon !== undefined ? { icon } : {}),
        ...(colorTheme !== undefined ? { colorTheme } : {}),
        ...(label !== undefined ? { label } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(order !== undefined ? { order } : {}),
        ...(visible !== undefined ? { visible } : {}),
      },
    });

    // Auto-translate label + description if changed
    if (label || description) {
      const other = current.locale === "id" ? "en" : "id";
      const fieldsToTranslate: Record<string, string> = {};
      if (label) fieldsToTranslate.label = label;
      if (description) fieldsToTranslate.description = description;

      translateFields(fieldsToTranslate, current.locale, other)
        .then(async (translated) => {
          const otherRecord = await prisma.service.findUnique({
            where: { locale_slug: { locale: other, slug: current.slug } },
          });
          if (otherRecord) {
            await prisma.service.update({
              where: { id: otherRecord.id },
              data: {
                ...translated,
                ...(icon !== undefined ? { icon } : {}),
                ...(colorTheme !== undefined ? { colorTheme } : {}),
                ...(order !== undefined ? { order } : {}),
                ...(visible !== undefined ? { visible } : {}),
              },
            });
          }
        })
        .catch((e) => console.error("Auto-translate service update:", e));
    }

    return NextResponse.json({ success: true, data: saved });
  } catch (e) {
    console.error("PUT /api/admin/services error:", e);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

// ─── DELETE: delete a service (both locales) ─────────────────────────────────

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const current = await prisma.service.findUnique({ where: { id } });
    if (!current) {
      return NextResponse.json(
        { error: "Service not found" },
        { status: 404 }
      );
    }

    // Delete both locale versions
    await prisma.service.deleteMany({ where: { slug: current.slug } });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("DELETE /api/admin/services error:", e);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
