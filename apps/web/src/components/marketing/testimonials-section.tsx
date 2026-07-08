import { Star } from 'lucide-react'

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Patient, Delhi',
    avatar: 'PS',
    rating: 5,
    text: 'Found a great cardiologist in minutes. The video consultation was seamless and the prescription was delivered to my app instantly.',
  },
  {
    name: 'Dr. Arun Mehta',
    role: 'Cardiologist, Mumbai',
    avatar: 'AM',
    rating: 5,
    text: 'NirogiTanman has transformed my practice. Patient management, scheduling, and payments all handled in one place.',
  },
  {
    name: 'Sunita Patel',
    role: 'Patient, Ahmedabad',
    avatar: 'SP',
    rating: 5,
    text: 'Booked a home nurse after my surgery. The process was so simple and the nurse was professional. Highly recommend!',
  },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
          aria-hidden="true"
        />
      ))}
    </div>
  )
}

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What People Say</h2>
          <p className="text-muted-foreground text-lg">Real stories from our patients and partners.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((t) => (
            <div key={t.name} className="rounded-xl bg-card border p-6 flex flex-col gap-4">
              <StarRating rating={t.rating} />
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">"{t.text}"</p>
              <div className="flex items-center gap-3 pt-2 border-t">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
                  {t.avatar}
                </div>
                <div>
                  <div className="font-semibold text-sm">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
