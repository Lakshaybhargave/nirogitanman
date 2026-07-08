import Link from 'next/link'
import { SignupForm } from '@/components/auth/signup-form'
import { Heart } from 'lucide-react'

export const metadata = { title: 'Create Account' }

export default function SignupPage() {
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
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-muted-foreground mt-1">Join millions managing their health</p>
        </div>

        <div className="bg-card rounded-xl border shadow-sm p-6">
          <SignupForm />
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-primary font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
