'use client'

import { PublicFooter } from '@/components/layouts/PublicFooter'
import { PublicNav } from '@/components/layouts/PublicNav'
import { useSettings } from '@/hooks/useSettings'
import { api } from '@/lib/api'
import type { Car, Service } from '@/lib/api'
import { formatPrice } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import Link from 'next/link'

// ── Hero ───────────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section className="relative h-screen min-h-[640px] overflow-hidden flex items-center">
      <div
        className="absolute inset-0 animate-hero-zoom"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1920&q=75')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(110deg, rgba(10,10,10,0.82) 0%, rgba(10,10,10,0.45) 55%, rgba(10,10,10,0.2) 100%)' }}
      />

      <div className="relative z-10 px-[8vw] max-w-[780px]">
        <p className="animate-fade-up-1 text-[10px] font-semibold tracking-[0.32em] uppercase text-gold mb-6">
          German Performance · Exclusive Selection
        </p>
        <h1 className="animate-fade-up-2 font-serif font-light leading-none tracking-[0.01em] text-white" style={{ fontSize: 'clamp(52px, 7.5vw, 110px)' }}>
          Drive the
          <em className="block" style={{ fontStyle: 'italic', color: '#E8D5A3' }}>Extraordinary.</em>
        </h1>
        <p className="animate-fade-up-3 text-[14px] font-light tracking-[0.1em] text-[rgba(240,237,232,0.7)] mt-6 max-w-[420px] leading-[1.8]">
          The world&apos;s finest German performance machines, curated for those who demand nothing less than perfection.
        </p>
        <div className="animate-fade-up-4 flex items-center gap-5 mt-10 flex-wrap">
          <Link
            href="/cars"
            className="inline-flex items-center px-7 py-3.5 text-[10px] font-semibold tracking-[0.22em] uppercase bg-gold text-[#0A0A0A] hover:bg-gold-light transition-colors duration-300"
          >
            Explore Collection →
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center px-7 py-3.5 text-[10px] font-semibold tracking-[0.22em] uppercase border border-[rgba(240,237,232,0.3)] text-[#F0EDE8] hover:border-[#F0EDE8] transition-colors duration-300"
          >
            Book a Consultation
          </Link>
        </div>
      </div>

      <div className="animate-fade-up-5 absolute bottom-12 right-[8vw] z-10 text-right hidden" />

      <div className="animate-fade-up-6 absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
        <span className="text-[9px] tracking-[0.3em] uppercase text-[rgba(240,237,232,0.45)]">Scroll</span>
        <div
          className="animate-scroll-line w-px h-12"
          style={{ background: 'linear-gradient(to bottom, #C9A84C, transparent)' }}
        />
      </div>
    </section>
  )
}

// ── Stats Bar ──────────────────────────────────────────────────────────────

function StatsBar({ carCount, brandCount }: { carCount: number; brandCount: number }) {
  const stats = [
    { num: String(carCount), label: 'Vehicles in Stock' },
    { num: String(brandCount), label: 'Premium Brands' },
    { num: '15+', label: 'Years of Excellence' },
    { num: '500+', label: 'Satisfied Clients' },
  ]

  return (
    <div className="bg-[#111111] border-b border-[#2A2A2A] px-[8vw] py-7 flex items-stretch flex-wrap">
      {stats.map((s, i) => (
        <div
          key={s.label}
          className={`flex-1 text-center px-5 py-2 min-w-[140px] ${i < stats.length - 1 ? 'border-r border-[#2A2A2A]' : ''}`}
        >
          <div className="font-serif text-[36px] font-normal text-gold leading-none tracking-[0.02em]">{s.num}</div>
          <div className="text-[10px] tracking-[0.2em] uppercase text-[#5A5550] mt-1">{s.label}</div>
        </div>
      ))}
    </div>
  )
}

// ── Featured Cars ──────────────────────────────────────────────────────────

function FeaturedCars({ cars, currency }: { cars: Car[]; currency: string }) {
  const featured = cars.filter((c) => c.status === 'available').slice(0, 3)

  return (
    <section className="px-[8vw] py-[100px]">
      <div className="flex items-end justify-between mb-14 flex-wrap gap-5">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.26em] uppercase text-[#5A5550] mb-3">Current Inventory</p>
          <h2 className="font-serif font-light leading-none text-[#F0EDE8]" style={{ fontSize: 'clamp(32px, 4vw, 52px)' }}>
            Featured <em style={{ fontStyle: 'italic', color: '#E8D5A3' }}>Machines</em>
          </h2>
        </div>
        <Link
          href="/cars"
          className="inline-flex items-center px-6 py-3 text-[10px] font-semibold tracking-[0.22em] uppercase border border-[rgba(240,237,232,0.3)] text-[#F0EDE8] hover:border-[#F0EDE8] transition-colors duration-300"
        >
          View All Vehicles
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0.5">
        {featured.map((car) => (
          <Link key={car.id} href={`/cars/${car.id}`} className="group relative overflow-hidden bg-[#1A1A1A] block">
            <div className="relative overflow-hidden" style={{ aspectRatio: '4/3' }}>
              {car.image ? (
                <Image
                  src={car.image}
                  alt={`${car.make} ${car.model}`}
                  fill
                  className="object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.06]"
                />
              ) : (
                <div className="absolute inset-0 bg-[#1A1A1A]" />
              )}
            </div>
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.9) 0%, transparent 55%)' }}
            />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              {car.badge && (
                <div className="inline-block text-[9px] font-semibold tracking-[0.2em] uppercase px-2.5 py-1 bg-gold text-[#0A0A0A] mb-2">
                  {car.badge}
                </div>
              )}
              <div className="text-[10px] tracking-[0.2em] uppercase text-[#9A9490] mb-0.5">{car.make}</div>
              <div className="font-serif text-[22px] font-normal text-white">{car.model}</div>
              <div className="text-[13px] text-gold-light tracking-[0.06em] mt-1">{formatPrice(car.price, currency)}</div>
              <div className="text-[10px] font-semibold tracking-[0.18em] uppercase text-gold mt-3.5 opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                View Details →
              </div>
            </div>
          </Link>
        ))}
        {featured.length === 0 && (
          <div className="col-span-3 text-center py-20 text-[#5A5550] text-[13px] tracking-widest uppercase">
            No vehicles currently available
          </div>
        )}
      </div>
    </section>
  )
}

// ── Experience ─────────────────────────────────────────────────────────────

function ExperienceSection() {
  const items = [
    {
      num: '01',
      title: 'Curated Inventory',
      desc: 'Every vehicle is personally selected, verified, and prepared to the highest standard before entering our showroom.',
    },
    {
      num: '02',
      title: 'Dedicated Consultants',
      desc: 'Your personal consultant guides you from first inquiry through to collection day and beyond.',
    },
    {
      num: '03',
      title: 'Aftercare Excellence',
      desc: "From servicing to track days, your relationship with AUTO doesn't end at the point of sale.",
    },
  ]

  return (
    <section className="grid grid-cols-1 md:grid-cols-2" style={{ minHeight: '560px' }}>
      <div className="relative overflow-hidden group" style={{ minHeight: '320px' }}>
        <Image
          src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=900&q=75"
          alt="Audi R8 detail"
          fill
          className="object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.04]"
        />
      </div>
      <div className="bg-[#111111] px-[7vw] py-20 flex flex-col justify-center">
        <p className="text-[10px] font-semibold tracking-[0.26em] uppercase text-[#5A5550] mb-3">The AUTO Experience</p>
        <h2 className="font-serif font-light leading-none text-[#F0EDE8]" style={{ fontSize: 'clamp(32px, 4vw, 52px)' }}>
          Beyond the<em style={{ fontStyle: 'italic', color: '#E8D5A3' }}> Ordinary</em>
        </h2>
        <div className="mt-8 flex flex-col gap-5">
          {items.map((item, i) => (
            <div
              key={item.num}
              className={`flex gap-4 items-start pb-5 ${i < items.length - 1 ? 'border-b border-[#2A2A2A]' : ''}`}
            >
              <div className="font-serif text-[32px] font-light text-gold leading-none flex-shrink-0 w-10">{item.num}</div>
              <div>
                <div className="text-[12px] font-semibold tracking-[0.14em] uppercase text-[#F0EDE8] mb-1">{item.title}</div>
                <div className="text-[13px] text-[#9A9490] leading-[1.7]">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Services Strip ─────────────────────────────────────────────────────────

function ServicesStrip({ services, isLoading }: { services: Service[]; isLoading: boolean }) {
  const shown = services.slice(0, 6)

  return (
    <section className="px-[8vw] py-[100px] bg-[#0A0A0A]">
      <div className="text-center mb-16">
        <div className="w-px h-10 bg-gold mx-auto mb-5" />
        <p className="text-[10px] font-semibold tracking-[0.26em] uppercase text-[#5A5550] mb-3">What We Offer</p>
        <h2 className="font-serif font-light leading-none text-[#F0EDE8]" style={{ fontSize: 'clamp(32px, 4vw, 52px)' }}>
          Our <em style={{ fontStyle: 'italic', color: '#E8D5A3' }}>Services</em>
        </h2>
      </div>

      {isLoading && (
        <div className="text-center text-[#5A5550] text-[13px] tracking-widest uppercase py-12">Loading services…</div>
      )}
      {!isLoading && shown.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: '1px', background: '#2A2A2A' }}>
          {shown.map((s) => (
            <div key={s.id} className="bg-[#111111] px-9 py-12 hover:bg-[#1A1A1A] transition-colors duration-300">
              <span className="block text-[22px] text-gold mb-4">{s.icon}</span>
              <div className="font-serif text-[22px] font-normal text-[#F0EDE8] mb-2.5">{s.name}</div>
              <div className="text-[13px] text-[#9A9490] leading-[1.8]">{s.description}</div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

// ── Brands Strip ───────────────────────────────────────────────────────────

function BrandsStrip() {
  return (
    <section className="px-[8vw] py-16 border-t border-b border-[#2A2A2A]">
      <p className="text-[10px] tracking-[0.26em] uppercase text-[#5A5550] text-center mb-9">Authorised Brands</p>
      <div className="flex items-center justify-center gap-14 flex-wrap">
        {['Porsche', 'Mercedes-AMG', 'BMW M', 'Audi Sport'].map((brand) => (
          <span
            key={brand}
            className="font-serif text-[18px] font-medium tracking-[0.12em] uppercase text-[#5A5550] hover:text-gold transition-colors duration-300 cursor-default"
          >
            {brand}
          </span>
        ))}
      </div>
    </section>
  )
}

// ── CTA Banner ─────────────────────────────────────────────────────────────

function CTABanner() {
  return (
    <section className="relative px-[8vw] py-[100px] overflow-hidden text-center">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=1400&q=70')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0 bg-[rgba(10,10,10,0.85)]" />
      <div className="relative z-10">
        <div className="w-px h-10 bg-gold mx-auto mb-8" />
        <h2 className="font-serif font-light text-white mb-4" style={{ fontSize: 'clamp(36px, 5vw, 64px)' }}>
          Ready to Drive{' '}
          <em style={{ fontStyle: 'italic', color: '#E8D5A3' }}>Your Legend?</em>
        </h2>
        <p className="text-[13px] text-[rgba(240,237,232,0.6)] tracking-[0.08em] mb-10 max-w-[480px] mx-auto leading-[1.7]">
          Our consultants are available for private viewings, test drives and bespoke factory orders.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/contact"
            className="inline-flex items-center px-7 py-3.5 text-[10px] font-semibold tracking-[0.22em] uppercase bg-gold text-[#0A0A0A] hover:bg-gold-light transition-colors duration-300"
          >
            Contact Our Team →
          </Link>
          <Link
            href="/cars"
            className="inline-flex items-center px-7 py-3.5 text-[10px] font-semibold tracking-[0.22em] uppercase border border-[rgba(240,237,232,0.3)] text-[#F0EDE8] hover:border-[#F0EDE8] transition-colors duration-300"
          >
            Browse Inventory
          </Link>
        </div>
      </div>
    </section>
  )
}


// ── Page ───────────────────────────────────────────────────────────────────

export default function HomePage() {
  const { data: cars = [] } = useQuery({ queryKey: ['cars'], queryFn: () => api.getCars() })
  const { data: services = [], isLoading: servicesLoading } = useQuery({ queryKey: ['services'], queryFn: api.getServices })
  const { currency } = useSettings()

  const availableCount = (cars as Car[]).filter((c) => c.status === 'available').length
  const brandCount = new Set((cars as Car[]).map((c) => c.make)).size

  return (
    <div className="bg-[#0A0A0A] text-[#F0EDE8] overflow-x-hidden">
      <PublicNav />
      <HeroSection />
      <StatsBar carCount={availableCount} brandCount={brandCount} />
      <FeaturedCars cars={cars as Car[]} currency={currency} />
      <ExperienceSection />
      <ServicesStrip services={services as Service[]} isLoading={servicesLoading} />
      <BrandsStrip />
      <CTABanner />
      <PublicFooter />
    </div>
  )
}
