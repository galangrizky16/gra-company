import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const count = await prisma.adminUser.count();
    return NextResponse.json({ exists: count > 0 });
  } catch {
    // Fail safe: assume admin exists so register is hidden
    return NextResponse.json({ exists: true });
  }
}
