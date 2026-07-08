import Link from 'next/link'
import { Search, ArrowRight, Star, Shield, Clock } from 'lucide-react'

const trustBadges = [
  { icon: Shield, label: '100% Verified Partners' },
  { icon: Star, label: '4.8★ Average Rating' },
  { icon: Clock, label: '24/7 Support' },
]

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-background">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl translate-x-1/3 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-blue-500/5 blur-3xl -translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-8">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            India's #1 Healthcare Ecosystem
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-6">
            Your Health,{' '}
            <span className="text-primary">Our Priority</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Connect with verified doctors, clinics, labs, pharmacies, and wellness experts.
            Book appointments, access records, and manage your health — all in one place.
          </p>

          {/* Search bar */}
          <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto mb-10">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search doctors, clinics, labs..."
                className="w-full h-12 pl-12 pr-4 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Search healthcare providers"
              />
            </div>
            <Link
              href="/find-providers"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shrink-0"
            >
              Find Provider
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-6">
            {trustBadges.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icon className="h-4 w-4 text-primary" />
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {[
            { value: '50,000+', label: 'Verified Providers' },
            { value: '2M+', label: 'Happy Patients' },
            { value: '500+', label: 'Cities Covered' },
            { value: '15+', label: 'Service Types' },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-4 rounded-xl bg-card border">
              <div className="text-2xl font-bold text-primary mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
