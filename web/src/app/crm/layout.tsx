'use client'

import { useAuthStore } from '@/store/auth'
import {
  ArrowLeftEndOnRectangleIcon,
  ArrowTopRightOnSquareIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  EnvelopeIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  RectangleStackIcon,
  TruckIcon,
  UserGroupIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/20/solid'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

function initials(name: string) {
  return name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
}

type Role = 'admin' | 'manager' | 'sales'

const NAV_SECTIONS = [
  {
    label: null,
    items: [{ href: '/crm', label: 'Dashboard', icon: HomeIcon, exact: true, roles: [] as Role[] }],
  },
  {
    label: 'Inventory',
    items: [
      { href: '/crm/vehicles', label: 'Vehicles', icon: TruckIcon, exact: false, roles: [] as Role[] },
      { href: '/crm/services', label: 'Services', icon: WrenchScrewdriverIcon, exact: false, roles: [] as Role[] },
    ],
  },
  {
    label: 'Sales',
    items: [
      { href: '/crm/pipeline', label: 'Lead Pipeline', icon: RectangleStackIcon, exact: false, roles: [] as Role[] },
      { href: '/crm/inquiries', label: 'Inquiries', icon: EnvelopeIcon, exact: false, roles: [] as Role[] },
    ],
  },
  {
    label: 'Marketing',
    items: [
      { href: '/crm/newsletter', label: 'Newsletter', icon: MagnifyingGlassIcon, exact: false, roles: ['admin', 'manager'] as Role[] },
    ],
  },
  {
    label: 'Administration',
    items: [
      { href: '/crm/analytics', label: 'Analytics', icon: ChartBarIcon, exact: false, roles: ['admin', 'manager'] as Role[] },
      { href: '/crm/users', label: 'Staff & Users', icon: UserGroupIcon, exact: false, roles: ['admin'] as Role[] },
      { href: '/crm/settings', label: 'Settings', icon: Cog6ToothIcon, exact: false, roles: ['admin', 'manager'] as Role[] },
    ],
  },
]

// Pages that require specific roles — empty array means all roles allowed
const ROUTE_ROLES: { prefix: string; roles: Role[] }[] = [
  { prefix: '/crm/analytics', roles: ['admin', 'manager'] },
  { prefix: '/crm/newsletter', roles: ['admin', 'manager'] },
  { prefix: '/crm/settings', roles: ['admin', 'manager'] },
  { prefix: '/crm/users', roles: ['admin'] },
]

export default function CRMLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, token, clearAuth } = useAuthStore()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    if (!token) { router.replace('/staff-portal'); return }
    if (!user) return
    const blocked = ROUTE_ROLES.find(
      (r) => pathname.startsWith(r.prefix) && !r.roles.includes(user.role as Role)
    )
    if (blocked) router.replace('/crm')
  }, [token, user, pathname, router])

  if (!token || !user) return null

  const userRole = user.role as Role

  function handleSignOut() {
    clearAuth()
    router.push('/staff-portal')
  }

  function isActive(href: string, exact: boolean) {
    return exact ? pathname === href : pathname.startsWith(href)
  }

  const sidebar = (
    <aside className="flex flex-col h-full bg-[#0A0A0A] border-r border-[#2A2A2A]">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-[#2A2A2A]">
        <div className="font-serif text-[22px] font-medium tracking-[0.12em] uppercase text-[#F0EDE8]">
          Auto<span className="text-gold">.</span>
        </div>
        <div className="text-[9px] tracking-[0.26em] uppercase text-[#5A5550] mt-0.5">CRM Dashboard</div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {NAV_SECTIONS.map((section) => {
          const items = section.items.filter(
            (item) => item.roles.length === 0 || item.roles.includes(userRole)
          )
          if (items.length === 0) return null
          return (
            <div key={section.label ?? 'main'}>
              {section.label && (
                <div className="px-3 mb-1 text-[9px] font-semibold tracking-[0.22em] uppercase text-[#5A5550]">
                  {section.label}
                </div>
              )}
              <div className="space-y-0.5">
                {items.map((item) => {
                  const active = isActive(item.href, item.exact)
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 text-[12px] font-medium tracking-[0.04em] transition-colors duration-200 ${
                        active
                          ? 'text-gold bg-[rgba(201,168,76,0.1)] border-l-2 border-gold'
                          : 'text-[#9A9490] hover:text-[#F0EDE8] hover:bg-[rgba(240,237,232,0.04)] border-l-2 border-transparent'
                      }`}
                    >
                      <item.icon className="size-4 shrink-0" />
                      {item.label}
                    </Link>
                  )
                })}
              </div>
            </div>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-[#2A2A2A] px-4 py-4 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 px-3 py-2 text-[11px] text-[#5A5550] hover:text-[#9A9490] transition-colors"
        >
          <ArrowTopRightOnSquareIcon className="size-3.5" />
          View Public Site
        </Link>
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="size-8 rounded-full bg-gold flex items-center justify-center text-[#0A0A0A] text-xs font-bold flex-shrink-0">
            {initials(user.name)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[12px] font-medium text-[#F0EDE8] truncate">{user.name}</div>
            <div className="text-[10px] text-[#5A5550] capitalize">{user.role}</div>
          </div>
          <button
            onClick={handleSignOut}
            title="Sign out"
            className="text-[#5A5550] hover:text-gold transition-colors flex-shrink-0"
          >
            <ArrowLeftEndOnRectangleIcon className="size-4" />
          </button>
        </div>
      </div>
    </aside>
  )

  return (
    <div className="dark flex h-screen bg-[#111111] overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-60 shrink-0">
        {sidebar}
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-60 z-10">
            {sidebar}
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile topbar */}
        <div className="lg:hidden flex items-center gap-4 px-4 py-3 bg-[#0A0A0A] border-b border-[#2A2A2A]">
          <button onClick={() => setMobileOpen(true)} className="text-[#9A9490]">
            <span className="block w-5 h-px bg-current mb-1.5" />
            <span className="block w-5 h-px bg-current mb-1.5" />
            <span className="block w-5 h-px bg-current" />
          </button>
          <div className="font-serif text-lg font-medium tracking-widest uppercase text-[#F0EDE8]">
            Auto<span className="text-gold">.</span>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="px-6 py-8 lg:px-10 lg:py-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
