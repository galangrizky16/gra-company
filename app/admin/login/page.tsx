import LoginForm from "@/components/admin/login-form";

export const metadata = {
  title: "Login — GRA Admin",
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4">
      <LoginForm />
    </div>
  );
}
