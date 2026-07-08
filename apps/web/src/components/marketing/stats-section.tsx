const stats = [
  { value: '50,000+', label: 'Verified Healthcare Partners', desc: 'Across 15+ service types' },
  { value: '2 Million+', label: 'Patients Served', desc: 'And growing every day' },
  { value: '500+', label: 'Cities & Towns', desc: 'Across India' },
  { value: '4.8 / 5', label: 'Average Rating', desc: 'Based on 500K+ reviews' },
]

export function StatsSection() {
  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Trusted by Millions</h2>
          <p className="text-primary-foreground/80 text-lg">
            NirogiTanman is India's fastest-growing healthcare platform.
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">{s.value}</div>
              <div className="font-semibold text-sm mb-1">{s.label}</div>
              <div className="text-xs text-primary-foreground/70">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
