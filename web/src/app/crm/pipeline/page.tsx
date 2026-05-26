'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'
import type { Inquiry } from '@/lib/api'
import { api } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import { ArrowRightIcon } from '@heroicons/react/16/solid'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'

const STAGES = [
  { key: 'new', label: 'New Leads', color: 'teal', headerCls: 'border-b-teal-400 text-teal-400 bg-teal-950/30' },
  { key: 'replied', label: 'Contacted', color: 'blue', headerCls: 'border-b-blue-400 text-blue-400 bg-blue-950/30' },
  { key: 'test_drive', label: 'Test Drive', color: 'violet', headerCls: 'border-b-violet-400 text-violet-400 bg-violet-950/30' },
  { key: 'negotiate', label: 'Negotiating', color: 'amber', headerCls: 'border-b-amber-400 text-amber-400 bg-amber-950/30' },
  { key: 'closed', label: 'Closed / Sold', color: 'green', headerCls: 'border-b-green-400 text-green-400 bg-green-950/30' },
] as const

const NEXT_STAGE: Record<string, { key: string; label: string } | null> = {
  new: { key: 'replied', label: 'Contacted' },
  replied: { key: 'test_drive', label: 'Test Drive' },
  test_drive: { key: 'negotiate', label: 'Negotiating' },
  negotiate: { key: 'closed', label: 'Closed / Sold' },
  closed: null,
}

type StageKey = typeof STAGES[number]['key']

export default function PipelinePage() {
  const qc = useQueryClient()
  const { data: inquiries = [], isLoading } = useQuery({ queryKey: ['inquiries'], queryFn: api.getInquiries })

  const advanceMutation = useMutation({
    mutationFn: ({ id, stage }: { id: number; stage: string }) =>
      api.updateInquiry(id, {
        pipelineStage: stage,
        status: stage === 'closed' ? 'closed' : stage !== 'new' ? 'replied' : 'new',
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['inquiries'] }),
  })

  function getStageItems(stageKey: StageKey): Inquiry[] {
    return inquiries.filter((i: Inquiry) => {
      if (stageKey === 'new') return i.status === 'new' && !i.pipelineStage
      return i.pipelineStage === stageKey
    })
  }

  return (
    <>
      <Heading>Lead Pipeline</Heading>
      <Text className="mt-2">Track prospects through your sales stages.</Text>

      {isLoading ? (
        <Text className="mt-8 text-center">Loading…</Text>
      ) : (
        <div className="mt-8 grid grid-cols-5 gap-4 min-h-[60vh]">
          {STAGES.map((stage) => {
            const items = getStageItems(stage.key)
            const next = NEXT_STAGE[stage.key]
            return (
              <div key={stage.key} className="flex flex-col min-w-0">
                <div className={`flex items-center justify-between px-3 py-2.5 rounded-t-xl border-b-2 text-xs font-bold uppercase tracking-wider ${stage.headerCls}`}>
                  <span>{stage.label}</span>
                  <span className="text-base font-bold">{items.length}</span>
                </div>
                <div className="flex-1 bg-[#1A1A1A] rounded-b-xl p-2 space-y-2">
                  {items.length === 0 && (
                    <div className="text-center text-xs text-[#5A5550] py-6 italic">Empty</div>
                  )}
                  {items.map((inq) => (
                    <div key={inq.id} className="bg-[#111111] rounded-lg p-3 ring-1 ring-[#2A2A2A] hover:ring-gold/30 transition">
                      <Link href={`/crm/inquiries?id=${inq.id}`} className="block mb-2">
                        <div className="text-sm font-semibold text-[#F0EDE8] leading-snug">{inq.name}</div>
                        <div className="text-xs text-[#9A9490] mt-0.5 truncate">{inq.subject}</div>
                        {inq.vehicle && (
                          <div className="text-xs text-gold mt-1 truncate">{inq.vehicle}</div>
                        )}
                        {inq.assignedTo && (
                          <div className="text-xs text-[#5A5550] mt-1">→ {inq.assignedTo.name}</div>
                        )}
                        <div className="text-xs text-[#5A5550] mt-1">{formatDate(inq.createdAt)}</div>
                      </Link>
                      {next ? (
                        <Button
                          plain
                          className="w-full text-xs justify-center !py-1"
                          onClick={() => advanceMutation.mutate({ id: inq.id, stage: next.key })}
                          disabled={advanceMutation.isPending}
                        >
                          <ArrowRightIcon className="size-3" />
                          {next.label}
                        </Button>
                      ) : (
                        <Badge color="green" className="w-full justify-center text-xs">Sold</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}
