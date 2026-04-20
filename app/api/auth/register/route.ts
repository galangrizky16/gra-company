import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { registerSchema } from "@/lib/auth/schema";
import { AUTH_COOKIE, AUTH_TOKEN_VALUE } from "@/lib/auth/config";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    // Block registration if any admin already exists (first-run only)
    const existingCount = await prisma.adminUser.count();
    if (existingCount > 0) {
      return NextResponse.json(
        { error: "Registration is disabled. An admin already exists." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const result = registerSchema.safeParse(body);
    if (!result.success) {
      const firstError = result.error.issues[0]?.message ?? "Invalid input";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { name, email, password } = result.data;
    const hashed = await bcrypt.hash(password, 12);

    await prisma.adminUser.create({
      data: { name, email, password: hashed },
    });

    // Auto-login by setting the auth cookie
    const cookieStore = await cookies();
    cookieStore.set(AUTH_COOKIE, AUTH_TOKEN_VALUE, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
