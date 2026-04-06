import { Header } from '@/components/Header';
import { Hero } from '@/components/sections/Hero';
import { PressStrip } from '@/components/sections/PressStrip';
import { ProductShowcase } from '@/components/sections/ProductShowcase';
import { ReviewCarousel } from '@/components/sections/ReviewCarousel';
import { HowItWorksExplainer } from '@/components/sections/HowItWorksExplainer';
import { ImcCalculator } from '@/components/sections/ImcCalculator';
import { ResultsGallery } from '@/components/sections/ResultsGallery';
import { AnimatedStats } from '@/components/sections/AnimatedStats';
import { MetabolismSection } from '@/components/sections/MetabolismSection';
import { JourneySteps } from '@/components/sections/JourneySteps';
import { SupportCallout } from '@/components/sections/SupportCallout';
import { ExtendedTestimonials } from '@/components/sections/ExtendedTestimonials';
import { Faq } from '@/components/sections/Faq';
import { Guarantee } from '@/components/sections/Guarantee';
import { DoctorProfiles } from '@/components/sections/DoctorProfiles';
import { GoalSelector } from '@/components/sections/GoalSelector';
import { TrustBadges } from '@/components/sections/TrustBadges';
import { Footer } from '@/components/sections/Footer';
import { IntakeWizard } from '@/components/intake/IntakeWizard';

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <PressStrip />
        <ProductShowcase />
        <ReviewCarousel />
        <HowItWorksExplainer />
        <ImcCalculator />
        <ResultsGallery />
        <AnimatedStats />
        <MetabolismSection />
        <JourneySteps />
        <SupportCallout />
        <ExtendedTestimonials />
        <Faq />
        <Guarantee />
        <DoctorProfiles />
        <GoalSelector />
        <section id="qualificacao" className="bg-forest-50 section-y">
          <div className="container">
            <IntakeWizard />
          </div>
        </section>
        <TrustBadges />
        <Footer />
      </main>
    </>
  );
}
