'use client'

import { Badge } from '@/components/ui/badge'
import { Heading, Subheading } from '@/components/ui/heading'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Text } from '@/components/ui/text'
import type { Car, Inquiry } from '@/lib/api'
import { api } from '@/lib/api'
import { formatDate, formatPrice } from '@/lib/utils'
import { useAuthStore } from '@/store/auth'
import { useQuery } from '@tanstack/react-query'

function StatCard({ label, value, sub, subColor }: { label: string; value: string; sub?: string; subColor?: string }) {
  return (
    <div>
      <div className="border-t border-[#2A2A2A]" />
      <div className="mt-6 text-sm/6 font-medium text-[#9A9490]">{label}</div>
      <div className="mt-3 text-3xl/8 font-semibold text-[#F0EDE8]">{value}</div>
      {sub && <div className={`mt-3 text-xs/6 ${subColor ?? 'text-[#9A9490]'}`}>{sub}</div>}
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useAuthStore()
  const { data: cars = [] } = useQuery({ queryKey: ['cars'], queryFn: () => api.getCars() })
  const { data: inquiries = [] } = useQuery({ queryKey: ['inquiries'], queryFn: api.getInquiries })
  const { data: subscribers = [] } = useQuery({ queryKey: ['subscribers'], queryFn: api.getSubscribers })

  const available = cars.filter((c: Car) => c.status === 'available').length
  const sold = cars.filter((c: Car) => c.status === 'sold').length
  const totalVal = cars.filter((c: Car) => c.status === 'available').reduce((s: number, c: Car) => s + c.price, 0)
  const soldVal = cars.filter((c: Car) => c.status === 'sold').reduce((s: number, c: Car) => s + c.price, 0)
  const newInqs = inquiries.filter((i: Inquiry) => i.status === 'new').length

  const now = new Date()
  const stale = inquiries.filter((i: Inquiry) => {
    if (i.status !== 'new') return false
    const dt = new Date(i.createdAt)
    return now.getTime() - dt.getTime() > 3 * 24 * 60 * 60 * 1000
  }).length

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <>
      <Heading>{greeting}{user ? `, ${user.name.split(' ')[0]}` : ''}</Heading>

      <div className="mt-8 flex items-end justify-between">
        <Subheading>Overview</Subheading>
      </div>

      <div className="mt-4 grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Available Vehicles" value={String(available)} sub={`${cars.length} total in system`} />
        <StatCard label="Units Sold" value={String(sold)} sub={`${formatPrice(soldVal)} est. revenue`} subColor="text-emerald-600" />
        <StatCard
          label="New Inquiries"
          value={String(newInqs)}
          sub={stale > 0 ? `⚠ ${stale} waiting over 3 days` : `${inquiries.length} total received`}
          subColor={stale > 0 ? 'text-amber-600 font-medium' : 'text-[#9A9490]'}
        />
        <StatCard label="Stock Value" value={`${formatPrice(totalVal)}`} sub="Available inventory" subColor="text-emerald-600" />
      </div>

      <Subheading className="mt-14">Recent Inquiries</Subheading>
      <Table className="mt-4 [--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)]">
        <TableHead>
          <TableRow>
            <TableHeader>Date</TableHeader>
            <TableHeader>Client</TableHeader>
            <TableHeader>Subject</TableHeader>
            <TableHeader>Vehicle</TableHeader>
            <TableHeader>Status</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {inquiries.slice(0, 6).map((inq: Inquiry) => (
            <TableRow key={inq.id} href={`/crm/inquiries?id=${inq.id}`}>
              <TableCell className="text-[#9A9490]">{formatDate(inq.createdAt)}</TableCell>
              <TableCell>
                <div className="font-medium text-[#F0EDE8]">{inq.name}</div>
                <div className="text-xs text-[#9A9490]">{inq.email}</div>
              </TableCell>
              <TableCell>{inq.subject}</TableCell>
              <TableCell className="text-[#9A9490]">{inq.vehicle ?? '—'}</TableCell>
              <TableCell>
                <Badge color={inq.status === 'new' ? 'teal' : inq.status === 'replied' ? 'green' : 'zinc'}>
                  {inq.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
          {inquiries.length === 0 && (
            <TableRow>
              <TableCell colSpan={5}>
                <Text className="text-center py-8">No inquiries yet.</Text>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="mt-14 grid sm:grid-cols-3 gap-8">
        <div>
          <Subheading>Inventory by Category</Subheading>
          <div className="mt-4 space-y-2">
            {Object.entries(
              cars.reduce((acc: Record<string, number>, c: Car) => ({ ...acc, [c.category]: (acc[c.category] ?? 0) + 1 }), {})
            ).map(([cat, count]) => (
              <div key={cat} className="flex items-center justify-between py-2 border-b border-[#2A2A2A]">
                <Text>{cat}</Text>
                <span className="text-brand-600 font-semibold text-lg">{count as number}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <Subheading>Newsletter</Subheading>
          <div className="mt-4">
            <div className="text-4xl font-semibold text-[#F0EDE8]">{subscribers.length}</div>
            <Text className="mt-1">active subscribers</Text>
          </div>
        </div>
        <div>
          <Subheading>Pipeline Summary</Subheading>
          <div className="mt-4 space-y-2">
            {[
              { label: 'New Leads', count: inquiries.filter((i: Inquiry) => i.status === 'new' && !i.pipelineStage).length, color: 'text-brand-600' },
              { label: 'In Progress', count: inquiries.filter((i: Inquiry) => i.pipelineStage && i.pipelineStage !== 'closed').length, color: 'text-amber-600' },
              { label: 'Closed / Sold', count: inquiries.filter((i: Inquiry) => i.pipelineStage === 'closed').length, color: 'text-emerald-600' },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between py-2 border-b border-[#2A2A2A]">
                <Text>{row.label}</Text>
                <span className={`font-semibold text-lg ${row.color}`}>{row.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
