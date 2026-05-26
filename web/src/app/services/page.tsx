'use client'

import { PublicFooter } from '@/components/layouts/PublicFooter'
import { PublicNav } from '@/components/layouts/PublicNav'
import { api } from '@/lib/api'
import type { Service } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'

const PROCESS_STEPS = [
  { num: '01', title: 'Initial Consultation', desc: 'A dedicated consultant contacts you to understand your requirements, preferences and timeline.' },
  { num: '02', title: 'Vehicle Selection', desc: 'We present curated options from our inventory and, where needed, source vehicles to your specification.' },
  { num: '03', title: 'Private Viewing', desc: 'Arrange a private viewing at our Mayfair showroom or request a vehicle to be presented at your location.' },
  { num: '04', title: 'Delivery', desc: 'White-glove collection or delivery with full handover documentation and aftercare support.' },
]

export default function ServicesPage() {
  const { data: services = [], isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: api.getServices,
  })

  return (
    <div className="bg-[#0A0A0A] text-[#F0EDE8] min-h-screen">
      <PublicNav />

      {/* Page Hero */}
      <section className="relative flex items-end pb-16 overflow-hidden" style={{ height: '52vh', minHeight: '360px' }}>
        <div
          className="absolute inset-0 animate-hero-zoom"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1600&q=70')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.45) 100%)' }}
        />
        <div className="relative z-10 px-[8vw]">
          <p className="text-[10px] font-semibold tracking-[0.28em] uppercase text-gold mb-3">What We Offer</p>
          <h1 className="font-serif font-light text-white leading-[1.05]" style={{ fontSize: 'clamp(40px, 6vw, 80px)' }}>
            Our <em style={{ fontStyle: 'italic', color: '#E8D5A3' }}>Services</em>
          </h1>
        </div>
      </section>

      {/* Intro */}
      <div className="px-[8vw] py-24 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
        <div>
          <p className="font-serif text-[22px] font-light italic text-[#F0EDE8] leading-[1.6] mb-6">
            "Every client relationship begins with listening — understanding not just what you want to drive, but why."
          </p>
          <p className="text-[13px] text-[#9A9490] leading-[1.9] mb-8">
            From the moment you first enquire to long after collection day, AUTO provides a seamless, personalised experience. Our services are designed for those who expect nothing less than perfection — from bespoke vehicle sourcing to performance preparation and exclusive track experiences.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center px-7 py-3.5 text-[10px] font-semibold tracking-[0.22em] uppercase bg-gold text-[#0A0A0A] hover:bg-gold-light transition-colors duration-300"
          >
            Speak to a Consultant →
          </Link>
        </div>
        <div
          className="relative aspect-[4/3] overflow-hidden"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=75')", backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
      </div>

      {/* Services Grid */}
      <div className="px-[8vw] pb-24">
        <div className="mb-14">
          <p className="text-[10px] font-semibold tracking-[0.26em] uppercase text-[#5A5550] mb-3">Full Offering</p>
          <h2 className="font-serif font-light text-[#F0EDE8]" style={{ fontSize: 'clamp(28px, 4vw, 48px)' }}>
            Specialist <em style={{ fontStyle: 'italic', color: '#E8D5A3' }}>Services</em>
          </h2>
        </div>

        {isLoading && (
          <div className="text-center py-16 font-serif text-[24px] font-light italic text-[#5A5550]">Loading services…</div>
        )}

        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '2px', background: '#2A2A2A' }}>
            {(services as Service[]).map((s) => (
              <div
                key={s.id}
                className="bg-[#111111] hover:bg-[#1A1A1A] transition-colors duration-300 p-12 grid gap-7"
                style={{ gridTemplateColumns: '60px 1fr', alignItems: 'start' }}
              >
                <div className="w-[60px] h-[60px] border border-[#3A3A3A] flex items-center justify-center text-[22px] text-gold hover:border-gold hover:bg-[rgba(201,168,76,0.1)] transition-all duration-300 flex-shrink-0">
                  {s.icon}
                </div>
                <div>
                  <div className="font-serif text-[24px] font-normal text-[#F0EDE8] mb-2.5">{s.name}</div>
                  <div className="text-[13px] text-[#9A9490] leading-[1.8] mb-3.5">{s.description}</div>
                  {s.price && (
                    <div className="text-[11px] tracking-[0.16em] uppercase text-gold font-semibold">{s.price}</div>
                  )}
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-1.5 mt-4 text-[10px] font-semibold tracking-[0.18em] uppercase text-[#9A9490] hover:text-gold transition-colors duration-300"
                  >
                    Enquire →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Process Strip */}
      <div className="bg-[#111111] border-t border-b border-[#2A2A2A] px-[8vw] py-20">
        <div className="text-center mb-16">
          <div className="w-px h-10 bg-gold mx-auto mb-5" />
          <p className="text-[10px] font-semibold tracking-[0.26em] uppercase text-[#5A5550] mb-3">How It Works</p>
          <h2 className="font-serif font-light text-[#F0EDE8]" style={{ fontSize: 'clamp(28px, 4vw, 48px)' }}>
            The AUTO <em style={{ fontStyle: 'italic', color: '#E8D5A3' }}>Process</em>
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" style={{ gap: '1px', background: '#2A2A2A' }}>
          {PROCESS_STEPS.map((step) => (
            <div key={step.num} className="bg-[#111111] hover:bg-[#1A1A1A] transition-colors duration-300 px-8 py-10 text-center">
              <div className="font-serif text-[48px] font-light text-gold leading-none mb-4 opacity-30">{step.num}</div>
              <div className="font-serif text-[18px] font-normal text-[#F0EDE8] mb-2">{step.title}</div>
              <div className="text-[12px] text-[#9A9490] leading-[1.8]">{step.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="px-[8vw] py-20 text-center">
        <h2 className="font-serif font-light text-[#F0EDE8] mb-4" style={{ fontSize: 'clamp(28px, 4vw, 48px)' }}>
          Ready to Get <em style={{ fontStyle: 'italic', color: '#E8D5A3' }}>Started?</em>
        </h2>
        <p className="text-[13px] text-[#9A9490] leading-[1.8] mb-10 max-w-[460px] mx-auto">
          Contact our team today to arrange a consultation at our Mayfair showroom.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center px-7 py-3.5 text-[10px] font-semibold tracking-[0.22em] uppercase bg-gold text-[#0A0A0A] hover:bg-gold-light transition-colors duration-300"
        >
          Contact Our Team →
        </Link>
      </div>

      <PublicFooter />
    </div>
  )
}
