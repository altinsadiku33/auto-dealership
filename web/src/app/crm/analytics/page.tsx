'use client'

import { Heading, Subheading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'
import type { Car, Inquiry } from '@/lib/api'
import { api } from '@/lib/api'
import { formatPrice } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'

export default function AnalyticsPage() {
  const { data: cars = [] } = useQuery({ queryKey: ['cars'], queryFn: () => api.getCars() })
  const { data: inquiries = [] } = useQuery({ queryKey: ['inquiries'], queryFn: api.getInquiries })
  const { data: subscribers = [] } = useQuery({ queryKey: ['subscribers'], queryFn: api.getSubscribers })

  const totalVal = cars.reduce((s: number, c: Car) => s + c.price, 0)
  const avgVal = cars.length ? Math.round(totalVal / cars.length) : 0
  const soldVal = cars.filter((c: Car) => c.status === 'sold').reduce((s: number, c: Car) => s + c.price, 0)

  // Category breakdown
  const catVal: Record<string, number> = {}
  cars.forEach((c: Car) => { catVal[c.category] = (catVal[c.category] ?? 0) + c.price })
  const maxCat = Math.max(...Object.values(catVal), 1)

  // Inquiry subjects
  const subjects: Record<string, number> = {}
  inquiries.forEach((i: Inquiry) => { const k = i.subject || 'Other'; subjects[k] = (subjects[k] ?? 0) + 1 })
  const maxSubj = Math.max(...Object.values(subjects), 1)

  // Pipeline funnel
  const pipeline = [
    { label: 'New Leads', count: inquiries.filter((i: Inquiry) => i.status === 'new' && !i.pipelineStage).length, color: 'bg-brand-600' },
    { label: 'Contacted', count: inquiries.filter((i: Inquiry) => i.pipelineStage === 'replied').length, color: 'bg-blue-500' },
    { label: 'Test Drive', count: inquiries.filter((i: Inquiry) => i.pipelineStage === 'test_drive').length, color: 'bg-violet-500' },
    { label: 'Negotiating', count: inquiries.filter((i: Inquiry) => i.pipelineStage === 'negotiate').length, color: 'bg-amber-500' },
    { label: 'Closed / Sold', count: inquiries.filter((i: Inquiry) => i.pipelineStage === 'closed').length, color: 'bg-emerald-500' },
  ]

  return (
    <>
      <Heading>Business Analytics</Heading>

      <div className="mt-8 grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Total Inventory Value', value: formatPrice(totalVal) },
          { label: 'Average Car Value', value: formatPrice(avgVal) },
          { label: 'Estimated Revenue (Sold)', value: formatPrice(soldVal) },
          { label: 'Newsletter Subscribers', value: String(subscribers.length) },
        ].map(({ label, value }) => (
          <div key={label}>
            <div className="border-t border-[#2A2A2A]" />
            <div className="mt-6 text-sm/6 font-medium text-[#9A9490]">{label}</div>
            <div className="mt-3 text-3xl/8 font-semibold text-[#F0EDE8]">{value}</div>
          </div>
        ))}
      </div>

      <div className="mt-14 grid lg:grid-cols-2 gap-8">
        {/* Inventory by Category */}
        <div className="bg-[#1A1A1A] rounded-2xl ring-1 ring-[#2A2A2A] p-6">
          <Subheading>Inventory Value by Category</Subheading>
          <div className="mt-6 flex items-end gap-3 h-36">
            {Object.entries(catVal).map(([cat, val]) => (
              <div key={cat} className="flex flex-col items-center gap-2 flex-1">
                <div
                  className="w-full bg-brand-600/15 border-t-2 border-brand-600 rounded-sm transition-all"
                  style={{ height: `${Math.round((val / maxCat) * 100)}px` }}
                />
                <span className="text-xs text-[#9A9490] text-center leading-tight">{cat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Inquiry Sources */}
        <div className="bg-[#1A1A1A] rounded-2xl ring-1 ring-[#2A2A2A] p-6">
          <Subheading>Inquiry Sources</Subheading>
          <div className="mt-6 space-y-3">
            {Object.entries(subjects).map(([subj, count]) => (
              <div key={subj} className="flex items-center gap-3">
                <div className="text-xs text-[#F0EDE8] w-40 shrink-0 truncate" title={subj}>{subj}</div>
                <div className="flex-1 h-2 bg-[#2A2A2A] rounded-full overflow-hidden">
                  <div className="h-full bg-brand-600 rounded-full" style={{ width: `${Math.round((count / maxSubj) * 100)}%` }} />
                </div>
                <span className="text-sm font-semibold text-brand-600 w-6 text-right">{count}</span>
              </div>
            ))}
            {Object.keys(subjects).length === 0 && <Text>No inquiries yet.</Text>}
          </div>
        </div>

        {/* Pipeline Funnel */}
        <div className="bg-[#1A1A1A] rounded-2xl ring-1 ring-[#2A2A2A] p-6">
          <Subheading>Sales Pipeline Funnel</Subheading>
          <div className="mt-6 space-y-3">
            {pipeline.map(({ label, count, color }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="text-xs text-[#F0EDE8] w-28 shrink-0">{label}</div>
                <div className="flex-1 h-5 bg-[#2A2A2A] rounded overflow-hidden">
                  <div
                    className={`h-full ${color} transition-all`}
                    style={{ width: `${Math.round((count / Math.max(inquiries.length, 1)) * 100)}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-[#F0EDE8] w-6 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Inventory Status */}
        <div className="bg-[#1A1A1A] rounded-2xl ring-1 ring-[#2A2A2A] p-6">
          <Subheading>Inventory Status</Subheading>
          <div className="mt-6 space-y-3">
            {[
              { label: 'Available', count: cars.filter((c: Car) => c.status === 'available').length, color: 'bg-emerald-500' },
              { label: 'Reserved', count: cars.filter((c: Car) => c.status === 'reserved').length, color: 'bg-amber-500' },
              { label: 'Sold', count: cars.filter((c: Car) => c.status === 'sold').length, color: 'bg-red-500' },
            ].map(({ label, count, color }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="text-xs text-[#F0EDE8] w-20 shrink-0">{label}</div>
                <div className="flex-1 h-5 bg-[#2A2A2A] rounded overflow-hidden">
                  <div
                    className={`h-full ${color} transition-all`}
                    style={{ width: `${Math.round((count / Math.max(cars.length, 1)) * 100)}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-[#F0EDE8] w-6 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
