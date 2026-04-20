import { redirect } from "next/navigation";
import RegisterForm from "@/components/admin/register-form";
import { prisma } from "@/lib/db";

export const metadata = {
  title: "Register — GRA Admin",
};

export default async function AdminRegisterPage() {
  // If admin already exists, redirect to login
  try {
    const count = await prisma.adminUser.count();
    if (count > 0) redirect("/admin/login");
  } catch {
    // DB error — let the page render; API will handle guards
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4">
      <RegisterForm />
    </div>
  );
}
