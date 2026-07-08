import { HeroSection } from '@/components/marketing/hero-section'
import { ServicesSection } from '@/components/marketing/services-section'
import { HowItWorksSection } from '@/components/marketing/how-it-works-section'
import { StatsSection } from '@/components/marketing/stats-section'
import { TestimonialsSection } from '@/components/marketing/testimonials-section'
import { CtaSection } from '@/components/marketing/cta-section'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <ServicesSection />
        <HowItWorksSection />
        <StatsSection />
        <TestimonialsSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  )
}
