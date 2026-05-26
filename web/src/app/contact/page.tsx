'use client'

import { PublicNav } from '@/components/layouts/PublicNav'
import { api } from '@/lib/api'
import type { Car, DealerSettings } from '@/lib/api'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const contactSchema = z.object({
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(1, 'Required'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  subject: z.string().min(1, 'Please select an enquiry type'),
  vehicle: z.string().optional(),
  message: z.string().min(10, 'Please enter a message (min 10 characters)'),
  newsletter: z.boolean().optional(),
})
type ContactForm = z.infer<typeof contactSchema>

const ENQUIRY_TYPES = [
  'Vehicle Purchase',
  'Test Drive Request',
  'Service Booking',
  'Finance Enquiry',
  'Track Day Booking',
  'Bespoke Configuration',
  'General Enquiry',
]

function inputClass(hasError: boolean) {
  return `w-full bg-[#1A1A1A] border px-4 py-3 font-sans text-[13px] text-[#F0EDE8] outline-none transition-colors duration-300 placeholder:text-[#5A5550] ${
    hasError ? 'border-[#cc4444] focus:border-[#cc4444]' : 'border-[#3A3A3A] focus:border-gold'
  }`
}

function ContactContent() {
  const searchParams = useSearchParams()
  const preselectedVehicle = searchParams.get('vehicle') ?? ''
  const [success, setSuccess] = useState(false)

  const { data: cars = [] } = useQuery({ queryKey: ['cars'], queryFn: () => api.getCars() })
  const { data: settings } = useQuery<DealerSettings>({ queryKey: ['settings'], queryFn: api.getSettings })

  const { register, handleSubmit, formState: { errors } } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: { vehicle: preselectedVehicle },
  })

  const createInquiryMutation = useMutation({
    mutationFn: (data: ContactForm) =>
      api.createInquiry({
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        phone: data.phone || null,
        subject: data.subject,
        vehicle: data.vehicle || null,
        message: data.message,
      }),
    onSuccess: () => setSuccess(true),
  })

  function onSubmit(data: ContactForm) {
    createInquiryMutation.mutate(data)
  }

  return (
    <div className="bg-[#0A0A0A] text-[#F0EDE8] min-h-screen">
      <PublicNav />

      <div className="grid grid-cols-1 md:grid-cols-2 pt-20 min-h-screen">
        {/* Left: Image + Info */}
        <div className="relative overflow-hidden" style={{ minHeight: '480px' }}>
          <div
            className="absolute inset-0 animate-hero-zoom"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1548549557-dbe9a817a8ad?w=1200&q=75')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to bottom, rgba(10,10,10,0.6) 0%, rgba(10,10,10,0.85) 100%)' }}
          />
          <div className="relative z-10 h-full flex flex-col justify-between px-14 py-20">
            <div>
              <p className="text-[10px] tracking-[0.28em] uppercase text-gold mb-4">Get in Touch</p>
              <h1 className="font-serif font-light text-white leading-[1.08]" style={{ fontSize: 'clamp(40px, 4.5vw, 64px)' }}>
                Let&apos;s Find<br />Your <em style={{ fontStyle: 'italic', color: '#E8D5A3' }}>Perfect Machine.</em>
              </h1>
              <p className="text-[13px] text-[rgba(240,237,232,0.6)] leading-[1.8] mt-5 max-w-[380px]">
                Whether you&apos;re ready to purchase, need expert advice, or wish to arrange a private viewing — our consultants are here to guide you.
              </p>
              <div className="mt-12 flex flex-col gap-6">
                {settings?.address && (
                  <div className="flex gap-4 items-start">
                    <div className="w-9 h-9 flex-shrink-0 border border-[rgba(201,168,76,0.4)] flex items-center justify-center text-[14px] text-gold">◎</div>
                    <div>
                      <div className="text-[9px] tracking-[0.22em] uppercase text-[rgba(240,237,232,0.4)] mb-0.5">Showroom</div>
                      <div className="text-[13px] text-[rgba(240,237,232,0.85)] tracking-[0.04em]">{settings.address}</div>
                    </div>
                  </div>
                )}
                {settings?.phone && (
                  <div className="flex gap-4 items-start">
                    <div className="w-9 h-9 flex-shrink-0 border border-[rgba(201,168,76,0.4)] flex items-center justify-center text-[14px] text-gold">◇</div>
                    <div>
                      <div className="text-[9px] tracking-[0.22em] uppercase text-[rgba(240,237,232,0.4)] mb-0.5">Telephone</div>
                      <div className="text-[13px] text-[rgba(240,237,232,0.85)] tracking-[0.04em]">{settings.phone}</div>
                    </div>
                  </div>
                )}
                {settings?.email && (
                  <div className="flex gap-4 items-start">
                    <div className="w-9 h-9 flex-shrink-0 border border-[rgba(201,168,76,0.4)] flex items-center justify-center text-[14px] text-gold">✦</div>
                    <div>
                      <div className="text-[9px] tracking-[0.22em] uppercase text-[rgba(240,237,232,0.4)] mb-0.5">Email</div>
                      <div className="text-[13px] text-[rgba(240,237,232,0.85)] tracking-[0.04em]">{settings.email}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {settings && (settings.mondayFridayHours || settings.saturdayHours || settings.sundayHours) && (
              <div className="border-t border-[rgba(240,237,232,0.12)] pt-7">
                <div className="text-[9px] tracking-[0.22em] uppercase text-gold mb-3">Opening Hours</div>
                {[
                  { day: 'Monday – Friday', time: settings.mondayFridayHours },
                  { day: 'Saturday', time: settings.saturdayHours },
                  { day: 'Sunday', time: settings.sundayHours },
                ].filter((h) => h.time).map(({ day, time }) => (
                  <div key={day} className="flex justify-between text-[12px] text-[rgba(240,237,232,0.55)] py-1.5 border-b border-[rgba(240,237,232,0.06)] last:border-0">
                    <span>{day}</span>
                    <span>{time}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Form */}
        <div className="bg-[#111111] px-14 py-20 overflow-y-auto">
          {success ? (
            <div className="text-center py-12">
              <div className="text-[40px] text-gold mb-5">✦</div>
              <div className="font-serif text-[32px] font-light text-[#F0EDE8] mb-3">Thank You.</div>
              <p className="text-[14px] text-[#9A9490] leading-[1.8] mb-8">
                Your enquiry has been received. A dedicated consultant will be in touch within 24 hours.
              </p>
              <Link href="/" className="text-[11px] font-semibold tracking-[0.2em] uppercase text-gold hover:text-gold-light transition-colors">
                ← Return Home
              </Link>
            </div>
          ) : (
            <>
              <div className="text-[10px] tracking-[0.28em] uppercase text-gold mb-3">Enquiry Form</div>
              <h2 className="font-serif font-light text-[#F0EDE8] mb-2" style={{ fontSize: 'clamp(28px, 3.5vw, 42px)' }}>
                How Can We<br />Help You?
              </h2>
              <p className="text-[13px] text-[#9A9490] mb-10 leading-[1.7]">
                Complete the form below and a dedicated consultant will respond within 24 hours.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-[9px] font-semibold tracking-[0.2em] uppercase text-[#5A5550] mb-1.5">First Name *</label>
                    <input {...register('firstName')} placeholder="James" className={inputClass(!!errors.firstName)} />
                    {errors.firstName && <p className="text-[11px] text-[#cc4444] mt-1">{errors.firstName.message}</p>}
                  </div>
                  <div>
                    <label className="block text-[9px] font-semibold tracking-[0.2em] uppercase text-[#5A5550] mb-1.5">Last Name *</label>
                    <input {...register('lastName')} placeholder="Thornton" className={inputClass(!!errors.lastName)} />
                    {errors.lastName && <p className="text-[11px] text-[#cc4444] mt-1">{errors.lastName.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-[9px] font-semibold tracking-[0.2em] uppercase text-[#5A5550] mb-1.5">Email Address *</label>
                    <input {...register('email')} type="email" placeholder="james@example.com" className={inputClass(!!errors.email)} />
                    {errors.email && <p className="text-[11px] text-[#cc4444] mt-1">{errors.email.message}</p>}
                  </div>
                  <div>
                    <label className="block text-[9px] font-semibold tracking-[0.2em] uppercase text-[#5A5550] mb-1.5">Phone Number</label>
                    <input {...register('phone')} type="tel" placeholder="+44 7000 000000" className={inputClass(false)} />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-[9px] font-semibold tracking-[0.2em] uppercase text-[#5A5550] mb-1.5">Enquiry Type *</label>
                  <select {...register('subject')} className={`${inputClass(!!errors.subject)} appearance-none`}>
                    <option value="">Select enquiry type…</option>
                    {ENQUIRY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                  {errors.subject && <p className="text-[11px] text-[#cc4444] mt-1">{errors.subject.message}</p>}
                </div>

                <div className="mb-4">
                  <label className="block text-[9px] font-semibold tracking-[0.2em] uppercase text-[#5A5550] mb-1.5">Vehicle of Interest</label>
                  <select {...register('vehicle')} className={`${inputClass(false)} appearance-none`}>
                    <option value="">Select a vehicle (optional)…</option>
                    {(cars as Car[]).filter((c) => c.status === 'available').map((c) => (
                      <option key={c.id} value={`${c.make} ${c.model}`}>{c.year} {c.make} {c.model}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-[9px] font-semibold tracking-[0.2em] uppercase text-[#5A5550] mb-1.5">Your Message *</label>
                  <textarea
                    {...register('message')}
                    rows={4}
                    placeholder="Please tell us how we can help…"
                    className={`${inputClass(!!errors.message)} resize-y min-h-[100px]`}
                  />
                  {errors.message && <p className="text-[11px] text-[#cc4444] mt-1">{errors.message.message}</p>}
                </div>

                <div className="flex items-start gap-2.5 mb-7">
                  <input type="checkbox" {...register('newsletter')} id="newsletter-opt" className="mt-0.5 accent-gold" />
                  <label htmlFor="newsletter-opt" className="text-[12px] text-[#9A9490] leading-[1.6] cursor-pointer">
                    I&apos;d like to receive exclusive updates on new arrivals, events and offers from AUTO.
                  </label>
                </div>

                {createInquiryMutation.isError && (
                  <p className="text-[12px] text-[#cc4444] mb-4">Something went wrong. Please try again.</p>
                )}

                <button
                  type="submit"
                  disabled={createInquiryMutation.isPending}
                  className="w-full py-4 text-[11px] font-semibold tracking-[0.22em] uppercase bg-gold text-[#0A0A0A] hover:bg-gold-light transition-colors duration-300 disabled:opacity-60"
                >
                  {createInquiryMutation.isPending ? 'Sending…' : 'Submit Enquiry →'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ContactPage() {
  return (
    <Suspense>
      <ContactContent />
    </Suspense>
  )
}
