import { prisma } from "@/lib/db";
import { translateFields } from "@/lib/translate";

// ─── Types ───────────────────────────────────────────────────────────────────

export type HeroData = {
  badge: string;
  headline: string;
  subheadline: string;
  ctaPrimary: string;
  ctaSecondary: string;
};

export type ClientLogo = {
  id: string;
  name: string;
  logoUrl: string;
  website: string | null;
};

export type ClientsData = {
  badge: string;
  heading: string;
  clients: ClientLogo[];
};

export type WhyUsStat = { value: string; label: string };

export type WhyUsData = {
  badge: string;
  heading: string;
  ctaText: string;
  stats: WhyUsStat[];
  videoUrl: string | null;
};

export type AboutHeroData = {
  badge: string;
  headline: string;
  headlineAccent: string;
  description: string;
  cta: string;
  ctaSecondary: string;
  imageUrl: string | null;
};

export type ServiceItem = {
  id: string;
  slug: string;
  icon: string;
  colorTheme: string;
  label: string;
  description: string;
};

export type ServicesData = {
  badge: string;
  heading: string;
  subheading: string;
  services: ServiceItem[];
};

// ─── Fetchers ────────────────────────────────────────────────────────────────

export async function fetchHero(locale: string): Promise<HeroData | null> {
  try {
    let hero = await prisma.heroContent.findUnique({ where: { locale } });

    if (hero) {
      return {
        badge: hero.badge,
        headline: hero.headline,
        subheadline: hero.subheadline,
        ctaPrimary: hero.ctaPrimary,
        ctaSecondary: hero.ctaSecondary,
      };
    }

    const sourceLocale = locale === "en" ? "id" : "en";
    const source = await prisma.heroContent.findUnique({
      where: { locale: sourceLocale },
    });
    if (!source) return null;

    try {
      const translated = await translateFields(
        {
          badge: source.badge,
          headline: source.headline,
          subheadline: source.subheadline,
          ctaPrimary: source.ctaPrimary,
          ctaSecondary: source.ctaSecondary,
        },
        sourceLocale,
        locale
      );
      await prisma.heroContent.create({ data: { locale, ...translated } });
      return translated as HeroData;
    } catch {
      return {
        badge: source.badge,
        headline: source.headline,
        subheadline: source.subheadline,
        ctaPrimary: source.ctaPrimary,
        ctaSecondary: source.ctaSecondary,
      };
    }
  } catch {
    return null;
  }
}

export async function fetchClients(locale: string): Promise<ClientsData | null> {
  try {
    let section = await prisma.clientsSectionContent.findUnique({
      where: { locale },
    });

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
          section = src;
        }
      }
    }

    const clients = await prisma.client.findMany({
      where: { visible: true },
      orderBy: { order: "asc" },
      select: { id: true, name: true, logoUrl: true, website: true },
    });

    if (!section && clients.length === 0) return null;

    return {
      badge: section?.badge ?? "",
      heading: section?.heading ?? "",
      clients,
    };
  } catch {
    return null;
  }
}

export async function fetchWhyUs(locale: string): Promise<WhyUsData | null> {
  try {
    let section = await prisma.whyUsSectionContent.findUnique({
      where: { locale },
    });

    if (!section) {
      const other = locale === "en" ? "id" : "en";
      const src = await prisma.whyUsSectionContent.findUnique({
        where: { locale: other },
      });
      if (!src) return null;

      try {
        const srcStats = (src.stats ?? []) as WhyUsStat[];
        const fieldsToTranslate: Record<string, string> = {
          badge: src.badge,
          heading: src.heading,
          ctaText: src.ctaText,
        };
        srcStats.forEach((s, i) => {
          fieldsToTranslate[`stat_label_${i}`] = s.label;
        });

        const translated = await translateFields(fieldsToTranslate, other, locale);

        const translatedStats = srcStats.map((s, i) => ({
          value: s.value,
          label: translated[`stat_label_${i}`] ?? s.label,
        }));

        section = await prisma.whyUsSectionContent.create({
          data: {
            locale,
            badge: translated.badge,
            heading: translated.heading,
            ctaText: translated.ctaText,
            stats: translatedStats,
            videoUrl: src.videoUrl,
          },
        });
      } catch {
        section = src;
      }
    }

    const stats = (section.stats ?? []) as WhyUsStat[];

    return {
      badge: section.badge,
      heading: section.heading,
      ctaText: section.ctaText,
      stats,
      videoUrl: section.videoUrl,
    };
  } catch {
    return null;
  }
}

export async function fetchAboutHero(locale: string): Promise<AboutHeroData | null> {
  try {
    let section = await prisma.aboutHeroContent.findUnique({
      where: { locale },
    });

    if (!section) {
      const other = locale === "en" ? "id" : "en";
      const src = await prisma.aboutHeroContent.findUnique({
        where: { locale: other },
      });
      if (!src) return null;

      try {
        const translated = await translateFields(
          {
            badge: src.badge,
            headline: src.headline,
            headlineAccent: src.headlineAccent,
            description: src.description,
            cta: src.cta,
            ctaSecondary: src.ctaSecondary,
          },
          other,
          locale
        );
        section = await prisma.aboutHeroContent.create({
          data: {
            locale,
            ...translated,
            imageUrl: src.imageUrl,
          },
        });
      } catch {
        section = src;
      }
    }

    return {
      badge: section.badge,
      headline: section.headline,
      headlineAccent: section.headlineAccent,
      description: section.description,
      cta: section.cta,
      ctaSecondary: section.ctaSecondary,
      imageUrl: section.imageUrl,
    };
  } catch {
    return null;
  }
}

export async function fetchServices(locale: string): Promise<ServicesData | null> {
  try {
    let section = await prisma.servicesSectionContent.findUnique({
      where: { locale },
    });

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

    let services = await prisma.service.findMany({
      where: { locale, visible: true },
      orderBy: { order: "asc" },
    });

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

    if (!section && services.length === 0) return null;

    return {
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
    };
  } catch {
    return null;
  }
}
