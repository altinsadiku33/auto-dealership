'use client'

import { api } from '@/lib/api'
import { useAuthStore } from '@/store/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password required'),
})
type LoginForm = z.infer<typeof loginSchema>

function inputCls(hasError: boolean) {
  return `w-full bg-[#0A0A0A] border px-4 py-3 text-[13px] text-[#F0EDE8] outline-none transition-colors duration-300 placeholder:text-[#5A5550] ${
    hasError
      ? 'border-red-600/60 focus:border-red-500'
      : 'border-[#3A3A3A] focus:border-gold'
  }`
}

export default function StaffPortalPage() {
  const router = useRouter()
  const { setAuth, token } = useAuthStore()

  useEffect(() => {
    if (token) router.replace('/crm')
  }, [token, router])

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) })

  async function onSubmit(values: LoginForm) {
    try {
      const { token, user } = await api.login(values.email, values.password)
      setAuth(token, user)
      router.push('/crm')
    } catch {
      setError('root', { message: 'Invalid email or password.' })
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] grid grid-cols-1 lg:grid-cols-[1fr_480px]">

      {/* ── Left: brand image panel ─────────────────────────────────────── */}
      <div className="relative hidden lg:block">
        <div
          className="absolute inset-0 animate-hero-zoom"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1400&q=80')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(110deg, rgba(10,10,10,0.75) 0%, rgba(10,10,10,0.35) 55%, rgba(17,17,17,0.95) 100%)',
          }}
        />

        <div className="relative z-10 h-full flex flex-col justify-between px-14 py-16">
          <Link href="/" className="font-serif text-[28px] font-medium tracking-[0.14em] uppercase text-[#F0EDE8]">
            Auto<span className="text-gold">.</span>
          </Link>

          <div className="max-w-[440px]">
            <div className="w-px h-12 bg-gold mb-8" />
            <p className="font-serif text-[22px] font-light italic text-[#F0EDE8] leading-[1.65]">
              &ldquo;Precision-built for those who demand performance without compromise.&rdquo;
            </p>
            <div className="mt-8 text-[9px] tracking-[0.3em] uppercase text-[#5A5550]">
              Staff Access Portal
            </div>
          </div>

          <div className="text-[9px] tracking-[0.22em] uppercase text-[#3A3A3A]">
            &copy; {new Date().getFullYear()} Auto. All rights reserved.
          </div>
        </div>
      </div>

      {/* ── Right: form panel ───────────────────────────────────────────── */}
      <div className="bg-[#111111] flex flex-col justify-center px-10 py-16 lg:px-14 min-h-screen lg:min-h-0">

        {/* Mobile-only logo */}
        <div className="lg:hidden mb-12 text-center">
          <span className="font-serif text-[28px] font-medium tracking-[0.14em] uppercase text-[#F0EDE8]">
            Auto<span className="text-gold">.</span>
          </span>
        </div>

        <div className="w-full max-w-[360px] mx-auto">
          <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-gold mb-4">
            Staff Portal
          </p>
          <h1
            className="font-serif font-light text-[#F0EDE8] leading-[1.1] mb-2"
            style={{ fontSize: 'clamp(32px, 4vw, 42px)' }}
          >
            Sign in to<br />
            <em style={{ fontStyle: 'italic', color: '#E8D5A3' }}>your account.</em>
          </h1>
          <p className="text-[13px] text-[#5A5550] mb-10 leading-[1.7]">
            Authorised personnel only.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            <div>
              <label className="block text-[9px] font-semibold tracking-[0.22em] uppercase text-[#5A5550] mb-2">
                Email Address
              </label>
              <input
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                {...register('email')}
                className={inputCls(!!errors.email)}
              />
              {errors.email && (
                <p className="text-[11px] text-red-400 mt-1.5">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-[9px] font-semibold tracking-[0.22em] uppercase text-[#5A5550] mb-2">
                Password
              </label>
              <input
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                {...register('password')}
                className={inputCls(!!errors.password)}
              />
              {errors.password && (
                <p className="text-[11px] text-red-400 mt-1.5">{errors.password.message}</p>
              )}
            </div>

            {errors.root && (
              <div className="border border-red-600/30 bg-red-950/20 px-4 py-3 text-[12px] text-red-400">
                {errors.root.message}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 text-[11px] font-semibold tracking-[0.22em] uppercase bg-gold text-[#0A0A0A] hover:bg-gold-light transition-colors duration-300 disabled:opacity-50 mt-2"
            >
              {isSubmitting ? 'Signing in…' : 'Sign In →'}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-[#2A2A2A]">
            <Link
              href="/"
              className="text-[10px] tracking-[0.2em] uppercase text-[#5A5550] hover:text-gold transition-colors duration-300"
            >
              &larr; Return to Public Site
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
