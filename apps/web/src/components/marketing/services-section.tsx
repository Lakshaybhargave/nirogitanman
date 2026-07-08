import Link from 'next/link'

const services = [
  { icon: '🩺', title: 'Doctors', desc: 'Consult specialist & general physicians', href: '/find-providers?type=doctor' },
  { icon: '🏥', title: 'Hospitals', desc: 'Find top hospitals near you', href: '/find-providers?type=hospital' },
  { icon: '🔬', title: 'Labs & Diagnostics', desc: 'Book tests, get reports online', href: '/find-providers?type=laboratory' },
  { icon: '💊', title: 'Pharmacy', desc: 'Order medicines to your door', href: '/find-providers?type=pharmacy' },
  { icon: '🧠', title: 'Mental Health', desc: 'Psychologists & counsellors', href: '/find-providers?type=psychologist' },
  { icon: '🥗', title: 'Nutrition', desc: 'Dietitians & nutritionists', href: '/find-providers?type=dietitian' },
  { icon: '🧘', title: 'Wellness', desc: 'Yoga, fitness & holistic care', href: '/find-providers?type=yoga-trainer' },
  { icon: '🏠', title: 'Home Care', desc: 'Nursing & physiotherapy at home', href: '/find-providers?type=home-care' },
  { icon: '💻', title: 'Telemedicine', desc: 'Video consults from anywhere', href: '/telemedicine' },
  { icon: '🚑', title: 'Emergency', desc: 'Ambulance & emergency services', href: '/find-providers?type=ambulance' },
  { icon: '🩸', title: 'Blood Bank', desc: 'Find & donate blood', href: '/find-providers?type=blood-bank' },
  { icon: '📋', title: 'Insurance', desc: 'Health insurance partners', href: '/find-providers?type=insurance' },
]

export function ServicesSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything Healthcare, One Platform</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From routine check-ups to specialized care — find every type of healthcare service on NirogiTanman.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {services.map((s) => (
            <Link
              key={s.title}
              href={s.href}
              className="group flex flex-col items-center gap-3 rounded-xl bg-card border p-4 text-center hover:border-primary hover:shadow-md transition-all"
            >
              <span className="text-3xl" role="img" aria-label={s.title}>{s.icon}</span>
              <div>
                <div className="font-semibold text-sm group-hover:text-primary transition-colors">{s.title}</div>
                <div className="text-xs text-muted-foreground mt-0.5 hidden sm:block leading-snug">{s.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
