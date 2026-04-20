import AboutHeroSection from "@/components/about-hero-section";
import AboutUsSection from "@/components/about-us-section";
import VisionMissionSection from "@/components/vision-mission-section";
import AboutJourneySection from "@/components/about-journey-section";
import AboutTechStackSection from "@/components/about-techstack-section";
import AboutPaymentSection from "@/components/about-payment-section";
import AboutCtaSection from "@/components/about-cta-section";
import { fetchWhyUs, fetchAboutHero } from "@/lib/fetchers";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const [whyUsId, whyUsEn, aboutHeroId, aboutHeroEn] = await Promise.all([
    fetchWhyUs("id"),
    fetchWhyUs("en"),
    fetchAboutHero("id"),
    fetchAboutHero("en"),
  ]);

  return (
    <main>
      <AboutHeroSection
        whyUsData={{ id: whyUsId, en: whyUsEn }}
        aboutHeroData={{ id: aboutHeroId, en: aboutHeroEn }}
      />
      <AboutUsSection />
      <VisionMissionSection />
      <AboutJourneySection />
      <AboutTechStackSection />
      <AboutPaymentSection />
      <AboutCtaSection />
    </main>
  );
}
