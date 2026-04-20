import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "clients");

// ─── GET: list all clients ───────────────────────────────────────────────────

export async function GET() {
  try {
    const clients = await prisma.client.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(clients);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch clients" },
      { status: 500 }
    );
  }
}

// ─── POST: create client with logo upload ────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const website = (formData.get("website") as string) || null;
    const orderStr = formData.get("order") as string;
    const file = formData.get("logo") as File | null;

    if (!name || !file) {
      return NextResponse.json(
        { error: "Name and logo are required" },
        { status: 400 }
      );
    }

    await mkdir(UPLOAD_DIR, { recursive: true });

    const ext = file.name.split(".").pop() ?? "webp";
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const filePath = path.join(UPLOAD_DIR, filename);

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    const logoUrl = `/uploads/clients/${filename}`;

    const client = await prisma.client.create({
      data: {
        name,
        logoUrl,
        website,
        order: orderStr ? parseInt(orderStr, 10) : 0,
        visible: true,
      },
    });

    return NextResponse.json(client, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create client" },
      { status: 500 }
    );
  }
}

// ─── DELETE: remove client + file ────────────────────────────────────────────

export async function DELETE(request: NextRequest) {
  try {
    const { id } = (await request.json()) as { id: string };

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const client = await prisma.client.findUnique({ where: { id } });
    if (!client) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Delete file from disk
    if (client.logoUrl.startsWith("/uploads/")) {
      const filePath = path.join(process.cwd(), "public", client.logoUrl);
      await unlink(filePath).catch(() => {});
    }

    await prisma.client.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete client" },
      { status: 500 }
    );
  }
}
