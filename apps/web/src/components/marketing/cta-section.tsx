import Link from 'next/link'
import { ArrowRight, Users, Stethoscope } from 'lucide-react'

export function CtaSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* Client CTA */}
          <div className="rounded-2xl bg-primary p-8 text-primary-foreground flex flex-col">
            <Users className="h-10 w-10 mb-4 opacity-90" aria-hidden="true" />
            <h3 className="text-2xl font-bold mb-3">I Need Healthcare</h3>
            <p className="text-primary-foreground/80 mb-6 flex-1 leading-relaxed">
              Create a free account and access thousands of verified healthcare providers near you.
              Book appointments, manage records, and take control of your health.
            </p>
            <Link
              href="https://app.nirogitanman.com/signup"
              className="inline-flex items-center gap-2 self-start rounded-lg bg-white text-primary px-6 py-3 font-semibold text-sm hover:bg-white/90 transition-colors"
            >
              Get Started Free <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Partner CTA */}
          <div className="rounded-2xl bg-gray-900 p-8 text-white flex flex-col">
            <Stethoscope className="h-10 w-10 mb-4 opacity-90" aria-hidden="true" />
            <h3 className="text-2xl font-bold mb-3">I Provide Healthcare</h3>
            <p className="text-white/70 mb-6 flex-1 leading-relaxed">
              Join as a Doctor, Clinic, Lab, Pharmacy, or any health service provider. Manage
              appointments, grow your practice, and reach millions of patients.
            </p>
            <Link
              href="https://partner.nirogitanman.com/register"
              className="inline-flex items-center gap-2 self-start rounded-lg bg-primary px-6 py-3 font-semibold text-sm hover:bg-primary/90 transition-colors"
            >
              Register as Partner <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
