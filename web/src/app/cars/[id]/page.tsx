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
import { useState } from 'react'

const STATUS_LABEL: Record<string, string> = {
  available: 'Available',
  reserved: 'Reserved',
  sold: 'Sold',
}
const STATUS_COLOR: Record<string, string> = {
  available: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  reserved: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  sold: 'bg-red-500/15 text-red-400 border-red-500/30',
}

export default function CarDetailPage({ params }: { params: { id: string } }) {
  const { id } = params

  const { data: car, isLoading, isError } = useQuery<Car>({
    queryKey: ['car', id],
    queryFn: () => api.getCar(Number(id)),
  })
  const { currency, distanceUnit } = useSettings()

  const allImages: string[] = car
    ? [
        ...(car.images?.map((img) => `http://localhost:3001${img.url}`) ?? []),
        ...(car.image && !car.images?.length ? [car.image] : []),
      ]
    : []
  const [activeImg, setActiveImg] = useState(0)

  const accelLabel = distanceUnit === 'km' ? '0–100 km/h' : '0–60 mph'
  const speedUnit = distanceUnit === 'km' ? 'km/h' : 'mph'

  const specs = car ? [
    { label: 'Year', value: String(car.year) },
    { label: 'Mileage', value: car.mileage !== undefined ? formatMileage(car.mileage, distanceUnit) : null },
    { label: 'Engine', value: car.engine },
    { label: 'Transmission', value: car.transmission },
    {
      label: accelLabel,
      value: car.acceleration
        ? car.acceleration.toLowerCase().endsWith('s') ? car.acceleration : `${car.acceleration}s`
        : null,
    },
    {
      label: `Top Speed`,
      value: car.topSpeed
        ? (car.topSpeed.includes('km') || car.topSpeed.includes('mph') ? car.topSpeed : `${car.topSpeed} ${speedUnit}`)
        : null,
    },
    {
      label: 'Weight',
      value: car.weight
        ? (car.weight.includes('kg') || car.weight.includes('lb') ? car.weight : `${car.weight} kg`)
        : null,
    },
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
          {/* Gallery */}
          {allImages.length > 0 ? (
            <div className="w-full">
              {/* Main image */}
              <div className="relative w-full overflow-hidden" style={{ aspectRatio: '16/7' }}>
                <Image
                  key={allImages[activeImg]}
                  src={allImages[activeImg]!}
                  alt={`${car.make} ${car.model}`}
                  fill
                  priority
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
              </div>

              {/* Thumbnails */}
              {allImages.length > 1 && (
                <div className="flex gap-2 px-[8vw] pt-3 overflow-x-auto pb-1">
                  {allImages.map((src, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      className={`relative shrink-0 w-24 h-16 overflow-hidden rounded transition-all ${
                        i === activeImg ? 'ring-2 ring-gold opacity-100' : 'opacity-40 hover:opacity-70'
                      }`}
                    >
                      <Image src={src} alt="" fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="relative w-full overflow-hidden" style={{ aspectRatio: '16/7' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A1A] via-[#141414] to-[#0A0A0A] flex items-center justify-center">
                <div className="text-center select-none">
                  <div className="text-[11px] tracking-[0.3em] uppercase text-gold/40 mb-3">{car.make}</div>
                  <div className="font-serif font-light text-[#2A2A2A]" style={{ fontSize: 'clamp(40px, 8vw, 100px)' }}>
                    {car.model}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="px-[8vw] pt-10 pb-20 w-full">
            <Link
              href="/cars"
              className="text-[10px] font-semibold tracking-[0.22em] uppercase text-[#5A5550] hover:text-gold transition-colors duration-300 flex items-center gap-2 mb-10"
            >
              ← Back to Collection
            </Link>

            <div className="grid lg:grid-cols-[3fr_1fr] gap-10 items-stretch">
              {/* Left */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-[11px] tracking-[0.24em] uppercase text-gold">{car.make}</div>
                  {car.badge && !car.image && (
                    <span className="text-[9px] font-semibold tracking-[0.18em] uppercase px-2.5 py-1 bg-gold text-[#0A0A0A]">
                      {car.badge}
                    </span>
                  )}
                </div>

                <h1 className="font-serif font-light text-[#F0EDE8] leading-[1.05] mb-4" style={{ fontSize: 'clamp(32px, 5vw, 56px)' }}>
                  {car.model}
                </h1>

                <div className="flex items-center gap-3 mb-10">
                  <span className="text-[12px] text-[#5A5550] tracking-[0.1em]">{car.year}</span>
                  <span className="w-px h-3 bg-[#3A3A3A]" />
                  <span className="text-[12px] text-[#5A5550] tracking-[0.1em]">{car.category}</span>
                  <span className="w-px h-3 bg-[#3A3A3A]" />
                  <span className={`text-[10px] font-semibold tracking-[0.14em] uppercase px-2.5 py-1 border rounded-sm ${STATUS_COLOR[car.status] ?? 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}>
                    {STATUS_LABEL[car.status] ?? car.status}
                  </span>
                </div>

                {car.description && (
                  <p className="text-[14px] text-[#9A9490] leading-[1.9] mb-10 max-w-[580px]">
                    {car.description}
                  </p>
                )}

                {/* Spec grid — always 2 cols so rows stay even */}
                {specs.length > 0 && (
                  <>
                    <div className="text-[9px] tracking-[0.22em] uppercase text-[#5A5550] mb-4">Specifications</div>
                    <div className="grid grid-cols-2 mb-2" style={{ gap: '1px', background: '#2A2A2A' }}>
                      {specs.map((s) => (
                        <div key={s.label} className="bg-[#111111] px-5 py-4">
                          <div className="text-[9px] tracking-[0.18em] uppercase text-[#5A5550] mb-1.5">{s.label}</div>
                          <div className="font-serif text-[17px] font-normal text-[#F0EDE8] leading-snug">{s.value}</div>
                        </div>
                      ))}
                      {/* Fill last row if odd count */}
                      {specs.length % 2 !== 0 && (
                        <div className="bg-[#111111]" />
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Right: sticky price card */}
              <div className="flex flex-col">
                <div className="bg-[#111111] border border-[#2A2A2A] flex flex-col h-full">
                  {/* Gold accent line */}
                  <div className="h-px bg-gold w-full" />

                  <div className="p-7">
                    <div className="text-[9px] tracking-[0.22em] uppercase text-[#5A5550] mb-1">Asking Price</div>
                    <div className="font-serif text-[38px] font-light text-gold leading-none mb-1">
                      {formatPrice(car.price, currency)}
                    </div>
                    <div className="text-[11px] text-[#5A5550] mb-7">Excludes registration &amp; delivery</div>

                    <Link
                      href={`/contact?vehicle=${encodeURIComponent(`${car.make} ${car.model}`)}`}
                      className="block w-full text-center py-3.5 text-[10px] font-semibold tracking-[0.22em] uppercase bg-gold text-[#0A0A0A] hover:bg-gold-light transition-colors duration-300 mb-2.5"
                    >
                      Enquire About This Car →
                    </Link>
                    <Link
                      href="/contact"
                      className="block w-full text-center py-3.5 text-[10px] font-semibold tracking-[0.22em] uppercase border border-[rgba(240,237,232,0.15)] text-[#9A9490] hover:border-[rgba(240,237,232,0.4)] hover:text-[#F0EDE8] transition-colors duration-300"
                    >
                      Book a Test Drive
                    </Link>
                  </div>

                  {/* Footer details */}
                  <div className="border-t border-[#2A2A2A] px-7 py-5 grid grid-cols-2 gap-4">
                    {car.color && (
                      <div>
                        <div className="text-[9px] tracking-[0.2em] uppercase text-[#5A5550] mb-1">Colour</div>
                        <div className="text-[12px] text-[#C0BDB8]">{car.color}</div>
                      </div>
                    )}
                    <div>
                      <div className="text-[9px] tracking-[0.2em] uppercase text-[#5A5550] mb-1">Category</div>
                      <div className="text-[12px] text-[#C0BDB8]">{car.category}</div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </>
      )}

      <PublicFooter />
    </div>
  )
}
