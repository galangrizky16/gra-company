import HeroSection from "@/components/hero-section";
import ClientsCarousel from "@/components/clients-carousel";
import WhyUsSection from "@/components/why-us-section";
import ServicesSection from "@/components/services-section";
import WhyChooseSection from "@/components/why-choose-section";
import HowWeWorkSection from "@/components/how-we-work-section";
import TestimonialsSection from "@/components/testimonials-section";
import CtaBannerSection from "@/components/cta-banner-section";
import BlogSection from "@/components/blog-section";
import {
  fetchHero,
  fetchClients,
  fetchWhyUs,
  fetchServices,
  fetchWhyChoose,
} from "@/lib/fetchers";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [heroId, heroEn, clientsId, clientsEn, whyUsId, whyUsEn, servicesId, servicesEn, whyChooseId, whyChooseEn] =
    await Promise.all([
      fetchHero("id"),
      fetchHero("en"),
      fetchClients("id"),
      fetchClients("en"),
      fetchWhyUs("id"),
      fetchWhyUs("en"),
      fetchServices("id"),
      fetchServices("en"),
      fetchWhyChoose("id"),
      fetchWhyChoose("en"),
    ]);

  return (
    <main>
      <HeroSection data={{ id: heroId, en: heroEn }} />
      <ClientsCarousel data={{ id: clientsId, en: clientsEn }} />
      <WhyUsSection data={{ id: whyUsId, en: whyUsEn }} />
      <ServicesSection data={{ id: servicesId, en: servicesEn }} />
      <WhyChooseSection data={{ id: whyChooseId, en: whyChooseEn }} />
      <HowWeWorkSection />
      <TestimonialsSection clientLogos={clientsId?.clients ?? []} />
      <CtaBannerSection data={{ id: whyUsId, en: whyUsEn }} />
      <BlogSection />
    </main>
  );
}
