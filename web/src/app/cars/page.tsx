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
import { useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'

const CATEGORIES = ['All', 'Sports', 'Supercar', 'Hypercar', 'GT', 'Electric']
const STATUSES = [
  { value: '', label: 'All' },
  { value: 'available', label: 'Available' },
  { value: 'reserved', label: 'Reserved' },
  { value: 'sold', label: 'Sold' },
]

function CarsContent() {
  const searchParams = useSearchParams()
  const [category, setCategory] = useState('All')
  const [status, setStatus] = useState('')
  const [search, setSearch] = useState(searchParams.get('brand') ?? '')

  const { data: cars = [], isLoading } = useQuery({
    queryKey: ['cars'],
    queryFn: () => api.getCars(),
  })
  const { currency, distanceUnit } = useSettings()

  const filtered = (cars as Car[]).filter((c) => {
    const matchCat = category === 'All' || c.category === category
    const matchStatus = !status || c.status === status
    const matchSearch = !search || `${c.make} ${c.model}`.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchStatus && matchSearch
  })

  return (
    <div className="bg-[#0A0A0A] text-[#F0EDE8] min-h-screen">
      <PublicNav />

      {/* Page Hero */}
      <section className="relative flex items-end pb-16 overflow-hidden" style={{ height: '52vh', minHeight: '360px' }}>
        <div
          className="absolute inset-0 animate-hero-zoom"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600&q=70')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.4) 100%)' }}
        />
        <div className="relative z-10 px-[8vw]">
          <p className="text-[10px] font-semibold tracking-[0.28em] uppercase text-gold mb-3">Current Inventory</p>
          <h1 className="font-serif font-light text-white leading-[1.05]" style={{ fontSize: 'clamp(40px, 6vw, 80px)' }}>
            Our <em style={{ fontStyle: 'italic', color: '#E8D5A3' }}>Collection</em>
          </h1>
        </div>
      </section>

      {/* Filter Bar */}
      <div className="sticky top-20 z-40 bg-[#111111] border-b border-[#2A2A2A] px-[8vw] py-5 flex items-center gap-3 flex-wrap">
        <span className="text-[10px] tracking-[0.22em] uppercase text-[#5A5550] mr-2 whitespace-nowrap">Category</span>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`text-[10px] font-medium tracking-[0.16em] uppercase px-4 py-2 border transition-all duration-200 whitespace-nowrap ${
              category === cat
                ? 'border-gold text-gold bg-[rgba(201,168,76,0.15)]'
                : 'border-[#3A3A3A] text-[#9A9490] hover:border-gold hover:text-gold'
            }`}
          >
            {cat}
          </button>
        ))}

        <div className="w-px h-7 bg-[#2A2A2A] mx-1 flex-shrink-0 hidden sm:block" />

        {STATUSES.map((s) => (
          <button
            key={s.value}
            onClick={() => setStatus(s.value)}
            className={`text-[10px] font-medium tracking-[0.16em] uppercase px-4 py-2 border transition-all duration-200 ${
              status === s.value
                ? 'border-gold text-gold bg-[rgba(201,168,76,0.15)]'
                : 'border-[#3A3A3A] text-[#9A9490] hover:border-gold hover:text-gold'
            }`}
          >
            {s.label}
          </button>
        ))}

        <div className="flex items-center gap-2 border border-[#3A3A3A] px-3 py-2 ml-auto">
          <span className="text-[#5A5550] text-sm">⌕</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search make or model…"
            className="bg-transparent border-none outline-none text-[12px] text-[#F0EDE8] placeholder:text-[#5A5550] w-40"
          />
        </div>
      </div>

      {/* Inventory */}
      <div className="px-[8vw] py-16 pb-24">
        <p className="text-[11px] tracking-[0.16em] uppercase text-[#5A5550] mb-9">
          Showing <strong className="text-gold">{filtered.length}</strong> vehicle{filtered.length !== 1 ? 's' : ''}
        </p>

        {isLoading && (
          <div className="text-center py-24 font-serif text-[28px] font-light italic text-[#5A5550]">Loading…</div>
        )}

        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-24 font-serif text-[28px] font-light italic text-[#5A5550]">
            No vehicles match your selection.
          </div>
        )}

        <div className="grid gap-0.5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))' }}>
          {filtered.map((car) => (
            <Link
              key={car.id}
              href={`/cars/${car.id}`}
              className="group bg-[#111111] overflow-hidden flex flex-col hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.45)] transition-all duration-400"
            >
              <div className="overflow-hidden" style={{ aspectRatio: '16/9' }}>
                {car.image ? (
                  <Image
                    src={car.image}
                    alt={`${car.make} ${car.model}`}
                    width={720}
                    height={405}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                  />
                ) : (
                  <div className="w-full h-full bg-[#1A1A1A]" />
                )}
              </div>
              <div className="p-6 pb-7 flex flex-col flex-1">
                {car.badge && (
                  <div className="inline-block self-start text-[9px] font-semibold tracking-[0.18em] uppercase px-2.5 py-1 bg-gold text-[#0A0A0A] mb-3">
                    {car.badge}
                  </div>
                )}
                <div className="text-[10px] tracking-[0.22em] uppercase text-[#5A5550] mb-1">{car.make}</div>
                <div className="font-serif text-[26px] font-normal text-[#F0EDE8] leading-[1.15] mb-2">{car.model}</div>
                <div className="flex gap-4 flex-wrap mb-4">
                  {car.year && (
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[9px] tracking-[0.18em] uppercase text-[#5A5550]">Year</span>
                      <span className="text-[12px] text-[#9A9490]">{car.year}</span>
                    </div>
                  )}
                  {car.mileage !== undefined && (
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[9px] tracking-[0.18em] uppercase text-[#5A5550]">Mileage</span>
                      <span className="text-[12px] text-[#9A9490]">{formatMileage(car.mileage, distanceUnit)}</span>
                    </div>
                  )}
                  {car.engine && (
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[9px] tracking-[0.18em] uppercase text-[#5A5550]">Engine</span>
                      <span className="text-[12px] text-[#9A9490]">{car.engine}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#2A2A2A]">
                  <div className="font-serif text-[22px] font-normal text-gold">{formatPrice(car.price, currency)}</div>
                  <span className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[#9A9490] group-hover:text-gold transition-colors duration-300">
                    View Details →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <PublicFooter />
    </div>
  )
}

export default function CarsPage() {
  return (
    <Suspense>
      <CarsContent />
    </Suspense>
  )
}
