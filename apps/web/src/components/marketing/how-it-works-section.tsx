const steps = [
  {
    step: '01',
    title: 'Create Your Account',
    desc: 'Sign up in seconds. No credit card required. Start exploring healthcare providers immediately.',
  },
  {
    step: '02',
    title: 'Find a Provider',
    desc: 'Search by speciality, location, or service. Filter by rating, availability, and price.',
  },
  {
    step: '03',
    title: 'Book & Confirm',
    desc: 'Choose a time slot, pay securely, and receive instant confirmation on your phone.',
  },
  {
    step: '04',
    title: 'Get Cared For',
    desc: 'Visit in-person, join a video call, or receive care at home. Access records anytime.',
  },
]

export function HowItWorksSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How NirogiTanman Works</h2>
          <p className="text-muted-foreground text-lg">Getting healthcare has never been simpler.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connector line (desktop) */}
          <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-0.5 bg-primary/20" aria-hidden="true" />

          {steps.map(({ step, title, desc }) => (
            <div key={step} className="relative flex flex-col items-center text-center">
              <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 border-4 border-background shadow-sm mb-5">
                <span className="text-2xl font-bold text-primary">{step}</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
