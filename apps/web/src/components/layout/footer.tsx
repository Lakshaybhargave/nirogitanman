import Link from 'next/link'
import { Heart, Mail, Phone, MapPin } from 'lucide-react'

const footerLinks = {
  Platform: [
    { href: '/services', label: 'Services' },
    { href: '/find-providers', label: 'Find Providers' },
    { href: '/blog', label: 'Health Blog' },
    { href: '/pricing', label: 'Pricing' },
  ],
  For_Clients: [
    { href: 'https://app.nirogitanman.com/signup', label: 'Create Account' },
    { href: 'https://app.nirogitanman.com/login', label: 'Sign In' },
    { href: '/how-it-works', label: 'How It Works' },
    { href: '/faq', label: 'FAQ' },
  ],
  For_Partners: [
    { href: 'https://partner.nirogitanman.com/register', label: 'Join as Partner' },
    { href: 'https://partner.nirogitanman.com/login', label: 'Partner Login' },
    { href: '/partner-guide', label: 'Partner Guide' },
  ],
  Company: [
    { href: '/about', label: 'About Us' },
    { href: '/contact', label: 'Contact' },
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-white mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Heart className="h-5 w-5 text-white" aria-hidden="true" />
              </div>
              NirogiTanman
            </Link>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              India's most comprehensive healthcare ecosystem connecting patients with trusted
              healthcare providers across the country.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <span>support@nirogitanman.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <span>1800-XXX-XXXX (Toll Free)</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary shrink-0" />
                <span>New Delhi, India</span>
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h3 className="font-semibold text-white mb-4">
                {section.replace('_', ' ')}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} NirogiTanman. All rights reserved.
          </p>
          <p className="text-sm text-gray-500">
            Made with <Heart className="inline h-3 w-3 text-red-500" /> for a healthier India
          </p>
        </div>
      </div>
    </footer>
  )
}
