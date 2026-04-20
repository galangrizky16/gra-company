import { notFound } from "next/navigation";
import { I18nProvider } from "@/lib/i18n/context";
import LayoutShell from "@/components/layout-shell";
import type { Locale } from "@/lib/i18n/translations";

const locales: Locale[] = ["id", "en"];

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  if (!locales.includes(lang as Locale)) {
    notFound();
  }

  return (
    <I18nProvider initialLocale={lang as Locale}>
      <LayoutShell>{children}</LayoutShell>
    </I18nProvider>
  );
}
