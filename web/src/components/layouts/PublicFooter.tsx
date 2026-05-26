'use client'

import { api } from '@/lib/api'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const newsletterSchema = z.object({
  email: z.string().email('Please enter a valid email'),
})
type NewsletterForm = z.infer<typeof newsletterSchema>

export function PublicFooter() {
  const [submitted, setSubmitted] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<NewsletterForm>({
    resolver: zodResolver(newsletterSchema),
  })

  const subscribeMutation = useMutation({
    mutationFn: (data: NewsletterForm) => api.subscribe(data.email),
    onSuccess: () => { setSubmitted(true); reset() },
  })

  return (
    <footer className="bg-[#0A0A0A] border-t border-[#2A2A2A]">
      <div className="px-[8vw] py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <div className="font-serif text-[28px] font-medium tracking-[0.12em] uppercase text-[#F0EDE8]">
            Auto<span className="text-gold">.</span>
          </div>
          <div className="text-[10px] tracking-[0.2em] uppercase text-[#5A5550] mt-1 mb-4">Drive the Extraordinary</div>
          <p className="text-[12px] text-[#9A9490] leading-[1.7]">
            Europe&apos;s premier destination for the finest German performance automobiles. Curated excellence, delivered with discretion.
          </p>
        </div>

        <div>
          <div className="text-[10px] font-semibold tracking-[0.22em] uppercase text-[#F0EDE8] mb-4">Explore</div>
          <ul className="space-y-3">
            {[
              { href: '/cars', label: 'Our Cars' },
              { href: '/services', label: 'Services' },
              { href: '/contact', label: 'Contact' },
            ].map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className="text-[13px] text-[#9A9490] hover:text-[#F0EDE8] transition-colors duration-300">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="text-[10px] font-semibold tracking-[0.22em] uppercase text-[#F0EDE8] mb-4">Brands</div>
          <ul className="space-y-3">
            {[
              { href: '/cars?brand=Porsche', label: 'Porsche' },
              { href: '/cars?brand=Mercedes-AMG', label: 'Mercedes-AMG' },
              { href: '/cars?brand=BMW', label: 'BMW M' },
              { href: '/cars?brand=Audi', label: 'Audi Sport' },
            ].map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className="text-[13px] text-[#9A9490] hover:text-[#F0EDE8] transition-colors duration-300">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="text-[10px] font-semibold tracking-[0.22em] uppercase text-[#F0EDE8] mb-4">Newsletter</div>
          <p className="text-[12px] text-[#9A9490] leading-[1.7] mb-3">
            First access to new arrivals and exclusive events.
          </p>
          {submitted ? (
            <p className="text-[12px] text-gold">Thank you for subscribing.</p>
          ) : (
            <form onSubmit={handleSubmit((d) => subscribeMutation.mutate(d))}>
              <div className="flex">
                <input
                  {...register('email')}
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 min-w-0 px-3 py-2 text-[12px] bg-[#111111] border border-[#2A2A2A] text-[#F0EDE8] placeholder:text-[#5A5550] focus:outline-none focus:border-gold"
                />
                <button
                  type="submit"
                  disabled={subscribeMutation.isPending}
                  className="px-4 py-2 text-[10px] font-semibold tracking-[0.2em] uppercase bg-gold text-[#0A0A0A] hover:bg-gold-light transition-colors duration-300 disabled:opacity-60 flex-shrink-0"
                >
                  Join
                </button>
              </div>
              {errors.email && <p className="text-[11px] text-red-400 mt-1">{errors.email.message}</p>}
              {subscribeMutation.isError && <p className="text-[11px] text-red-400 mt-1">Already subscribed or an error occurred.</p>}
            </form>
          )}
        </div>
      </div>

      <div className="px-[8vw] py-5 border-t border-[#2A2A2A] flex items-center justify-between flex-wrap gap-4">
        <span className="text-[11px] text-[#5A5550]">© 2025 AUTO. All rights reserved.</span>
        <div className="flex items-center gap-4">
          {['in', 'tw', 'yt'].map((s) => (
            <a
              key={s}
              href="#"
              className="text-[11px] font-medium tracking-widest text-[#5A5550] hover:text-gold transition-colors duration-300 uppercase"
            >
              {s}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
