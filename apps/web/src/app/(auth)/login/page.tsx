import Link from 'next/link'
import { LoginForm } from '@/components/auth/login-form'
import { Heart } from 'lucide-react'

export const metadata = { title: 'Sign In' }

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-xl text-primary mb-6">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white">
              <Heart className="h-5 w-5" />
            </div>
            NirogiTanman
          </Link>
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-muted-foreground mt-1">Sign in to your account</p>
        </div>

        <div className="bg-card rounded-xl border shadow-sm p-6">
          <LoginForm />
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-primary font-medium hover:underline">
            Create one
          </Link>
        </p>
        <p className="text-center text-sm text-muted-foreground mt-2">
          Are you a healthcare provider?{' '}
          <Link href="https://partner.nirogitanman.com/login" className="text-primary font-medium hover:underline">
            Partner login
          </Link>
        </p>
      </div>
    </div>
  )
}
