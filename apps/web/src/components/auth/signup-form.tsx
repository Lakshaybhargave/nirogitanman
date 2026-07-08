'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { getSupabaseBrowserClient } from '@nirogitanman/supabase'

const signupSchema = z
  .object({
    full_name: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z.string().email('Enter a valid email address'),
    phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number').optional().or(z.literal('')),
    role: z.enum(['client', 'partner'] as const),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirm_password: z.string(),
  })
  .refine((d) => d.password === d.confirm_password, {
    message: "Passwords don't match",
    path: ['confirm_password'],
  })

type SignupFormData = z.infer<typeof signupSchema>

export function SignupForm() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: { role: 'client' },
  })

  const selectedRole = watch('role')

  const onSubmit = async (data: SignupFormData) => {
    setLoading(true)
    setError(null)

    try {
      const supabase = getSupabaseBrowserClient()

      const { error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.full_name,
            phone: data.phone || null,
            role: data.role,
          },
        },
      })

      if (signUpError) {
        setError(signUpError.message)
        return
      }

      setSuccess(true)
    } catch {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center py-4">
        <div className="text-4xl mb-4">✉️</div>
        <h2 className="font-semibold text-lg mb-2">Check your email</h2>
        <p className="text-sm text-muted-foreground">
          We sent a confirmation link to your email. Click it to activate your account.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {error && (
        <div role="alert" className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Role toggle */}
      <div>
        <label className="block text-sm font-medium mb-2">I am a</label>
        <div className="grid grid-cols-2 gap-2">
          {(['client', 'partner'] as const).map((r) => (
            <label
              key={r}
              className={`flex items-center justify-center gap-2 rounded-lg border p-3 cursor-pointer transition-colors ${
                selectedRole === r
                  ? 'border-primary bg-primary/10 text-primary font-semibold'
                  : 'border-input hover:bg-muted/50'
              }`}
            >
              <input type="radio" value={r} className="sr-only" {...register('role')} />
              {r === 'client' ? '👤 Patient / Client' : '🏥 Healthcare Provider'}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="full_name" className="block text-sm font-medium mb-1.5">Full Name</label>
        <input
          id="full_name"
          type="text"
          autoComplete="name"
          className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          {...register('full_name')}
        />
        {errors.full_name && <p className="mt-1 text-xs text-destructive">{errors.full_name.message}</p>}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1.5">Email address</label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          {...register('email')}
        />
        {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium mb-1.5">
          Mobile Number <span className="text-muted-foreground font-normal">(optional)</span>
        </label>
        <input
          id="phone"
          type="tel"
          autoComplete="tel"
          placeholder="10-digit mobile number"
          className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          {...register('phone')}
        />
        {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone.message}</p>}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-1.5">Password</label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          {...register('password')}
        />
        {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>}
      </div>

      <div>
        <label htmlFor="confirm_password" className="block text-sm font-medium mb-1.5">Confirm Password</label>
        <input
          id="confirm_password"
          type="password"
          autoComplete="new-password"
          className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          {...register('confirm_password')}
        />
        {errors.confirm_password && <p className="mt-1 text-xs text-destructive">{errors.confirm_password.message}</p>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full h-10 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
      >
        {loading && (
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {loading ? 'Creating account…' : 'Create Account'}
      </button>

      <p className="text-xs text-muted-foreground text-center">
        By signing up, you agree to our{' '}
        <a href="/terms" className="underline">Terms</a> and{' '}
        <a href="/privacy" className="underline">Privacy Policy</a>.
      </p>
    </form>
  )
}
