'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/cars', label: 'Our Cars' },
  { href: '/services', label: 'Services' },
  { href: '/contact', label: 'Contact' },
]

export function PublicNav() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 h-20 flex items-center px-12 transition-all duration-500 ${
          scrolled ? 'bg-[rgba(10,10,10,0.92)] backdrop-blur-xl shadow-[0_1px_0_#2A2A2A]' : ''
        }`}
      >
        <Link href="/" className="font-serif text-[28px] font-medium tracking-[0.12em] uppercase text-[#F0EDE8] flex-shrink-0">
          Auto<span className="text-gold">.</span>
        </Link>

        <div className="hidden md:flex items-center gap-10 ml-auto mr-10">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-[11px] font-medium tracking-[0.2em] uppercase text-[#9A9490] hover:text-[#F0EDE8] transition-colors duration-300"
            >
              {label}
            </Link>
          ))}
        </div>

        <Link
          href="/contact"
          className="hidden md:inline-flex items-center px-5 py-2.5 text-[10px] font-semibold tracking-[0.22em] uppercase bg-gold text-[#0A0A0A] hover:bg-gold-light transition-colors duration-300"
        >
          Enquire Now
        </Link>

        <button
          className="md:hidden ml-auto text-[#F0EDE8] p-2"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <span className="block w-5 h-px bg-current mb-1.5" />
          <span className="block w-5 h-px bg-current mb-1.5" />
          <span className="block w-5 h-px bg-current" />
        </button>
      </nav>

      {mobileOpen && (
        <div className="fixed inset-0 z-[60] bg-[#0A0A0A] flex flex-col items-center justify-center gap-8">
          <button
            className="absolute top-6 right-6 text-[#F0EDE8] text-2xl"
            onClick={() => setMobileOpen(false)}
          >
            ✕
          </button>
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className="font-serif text-3xl text-[#F0EDE8] tracking-widest"
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
