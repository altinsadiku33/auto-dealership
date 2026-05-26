'use client'

import { PublicFooter } from '@/components/layouts/PublicFooter'
import { PublicNav } from '@/components/layouts/PublicNav'
import { useSettings } from '@/hooks/useSettings'
import { api } from '@/lib/api'
import type { Car } from '@/lib/api'
import { formatMileage, formatPrice } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import Link from 'next/link'

const STATUS_LABEL: Record<string, string> = {
  available: 'Available',
  reserved: 'Reserved',
  sold: 'Sold',
}
const STATUS_COLOR: Record<string, string> = {
  available: 'text-emerald-400',
  reserved: 'text-amber-400',
  sold: 'text-red-400',
}

export default function CarDetailPage({ params }: { params: { id: string } }) {
  const { id } = params

  const { data: car, isLoading, isError } = useQuery<Car>({
    queryKey: ['car', id],
    queryFn: () => api.getCar(Number(id)),
  })
  const { currency, distanceUnit } = useSettings()

  const specs = car ? [
    { label: 'Year', value: String(car.year) },
    { label: 'Mileage', value: car.mileage !== undefined ? formatMileage(car.mileage, distanceUnit) : null },
    { label: 'Engine', value: car.engine },
    { label: 'Transmission', value: car.transmission },
    { label: '0–60 mph', value: car.acceleration },
    { label: 'Top Speed', value: car.topSpeed },
    { label: 'Weight', value: car.weight },
    { label: 'Colour', value: car.color },
  ].filter((s) => s.value) : []

  return (
    <div className="bg-[#0A0A0A] text-[#F0EDE8] min-h-screen">
      <PublicNav />

      {isLoading && (
        <div className="flex items-center justify-center min-h-screen">
          <div className="font-serif text-[28px] font-light italic text-[#5A5550]">Loading…</div>
        </div>
      )}

      {isError && (
        <div className="flex flex-col items-center justify-center min-h-screen gap-6">
          <div className="font-serif text-[28px] font-light italic text-[#5A5550]">Vehicle not found.</div>
          <Link href="/cars" className="text-[10px] font-semibold tracking-[0.22em] uppercase text-gold hover:text-gold-light transition-colors">
            ← Back to Collection
          </Link>
        </div>
      )}

      {car && (
        <>
          {/* Hero Image */}
          <div className="relative w-full overflow-hidden" style={{ aspectRatio: '16/7', marginTop: '0' }}>
            {car.image ? (
              <Image
                src={car.image}
                alt={`${car.make} ${car.model}`}
                fill
                priority
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-[#1A1A1A]" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-[rgba(10,10,10,0.3)]" />
            {car.badge && (
              <div className="absolute bottom-6 left-8 text-[9px] font-semibold tracking-[0.2em] uppercase px-3 py-1.5 bg-gold text-[#0A0A0A]">
                {car.badge}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="px-[8vw] py-14 max-w-[1100px]">
            {/* Back link */}
            <Link href="/cars" className="text-[10px] font-semibold tracking-[0.22em] uppercase text-[#5A5550] hover:text-gold transition-colors duration-300 flex items-center gap-2 mb-10">
              ← Back to Collection
            </Link>

            <div className="grid lg:grid-cols-[1fr_340px] gap-16 items-start">
              {/* Left: info */}
              <div>
                <div className="text-[11px] tracking-[0.24em] uppercase text-gold mb-2">{car.make}</div>
                <h1 className="font-serif font-light text-[#F0EDE8] leading-[1.05] mb-2" style={{ fontSize: 'clamp(36px, 5vw, 60px)' }}>
                  {car.model}
                </h1>
                <div className="text-[12px] text-[#5A5550] tracking-[0.1em] mb-8">
                  {car.year} · {car.category} · <span className={STATUS_COLOR[car.status] ?? 'text-zinc-400'}>{STATUS_LABEL[car.status] ?? car.status}</span>
                </div>

                {car.description && (
                  <p className="text-[14px] text-[#9A9490] leading-[1.85] mb-10 max-w-[600px]">{car.description}</p>
                )}

                {/* Spec grid */}
                {specs.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 mb-10" style={{ gap: '1px', background: '#2A2A2A' }}>
                    {specs.map((s) => (
                      <div key={s.label} className="bg-[#1A1A1A] px-5 py-4">
                        <div className="text-[9px] tracking-[0.2em] uppercase text-[#5A5550] mb-1">{s.label}</div>
                        <div className="font-serif text-[18px] font-normal text-[#F0EDE8]">{s.value}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right: price + CTA */}
              <div className="bg-[#111111] p-8 self-start sticky top-28">
                <div className="text-[9px] tracking-[0.22em] uppercase text-[#5A5550] mb-2">Asking Price</div>
                <div className="font-serif text-[36px] font-light text-gold mb-1">{formatPrice(car.price, currency)}</div>
                <div className="text-[11px] text-[#5A5550] mb-8">Excludes registration & delivery</div>

                <Link
                  href={`/contact?vehicle=${encodeURIComponent(`${car.make} ${car.model}`)}`}
                  className="block w-full text-center py-4 text-[10px] font-semibold tracking-[0.22em] uppercase bg-gold text-[#0A0A0A] hover:bg-gold-light transition-colors duration-300 mb-3"
                >
                  Enquire About This Car →
                </Link>
                <Link
                  href="/contact"
                  className="block w-full text-center py-4 text-[10px] font-semibold tracking-[0.22em] uppercase border border-[rgba(240,237,232,0.2)] text-[#F0EDE8] hover:border-[rgba(240,237,232,0.5)] transition-colors duration-300"
                >
                  Book a Test Drive
                </Link>

                {car.color && (
                  <div className="mt-6 pt-6 border-t border-[#2A2A2A]">
                    <div className="text-[9px] tracking-[0.22em] uppercase text-[#5A5550] mb-1">Colour</div>
                    <div className="text-[13px] text-[#F0EDE8]">{car.color}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      <PublicFooter />
    </div>
  )
}
