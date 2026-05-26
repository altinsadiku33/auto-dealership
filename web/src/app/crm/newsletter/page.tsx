'use client'

import { Button } from '@/components/ui/button'
import { Divider } from '@/components/ui/divider'
import { Heading, Subheading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'
import type { Inquiry, NewsletterSubscriber } from '@/lib/api'
import { api } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import { ClipboardDocumentIcon, TrashIcon } from '@heroicons/react/20/solid'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

export default function NewsletterPage() {
  const qc = useQueryClient()
  const [copied, setCopied] = useState(false)

  const { data: subscribers = [], isLoading } = useQuery({ queryKey: ['subscribers'], queryFn: api.getSubscribers })
  const { data: inquiries = [] } = useQuery({ queryKey: ['inquiries'], queryFn: api.getInquiries })

  const removeMutation = useMutation({
    mutationFn: (email: string) => api.unsubscribe(email),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['subscribers'] }),
  })

  function handleCopyEmails() {
    const emails = (subscribers as NewsletterSubscriber[]).map((s) => s.email).join(', ')
    navigator.clipboard.writeText(emails).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <>
      <Heading>Newsletter Subscribers</Heading>

      <div className="mt-8 grid grid-cols-2 xl:grid-cols-4 gap-8">
        {[
          { label: 'Active Subscribers', value: (subscribers as NewsletterSubscriber[]).length },
          { label: 'Total Inquiries', value: (inquiries as Inquiry[]).length },
        ].map(({ label, value }) => (
          <div key={label}>
            <Divider />
            <div className="mt-6 text-sm/6 font-medium text-[#9A9490]">{label}</div>
            <div className="mt-3 text-3xl/8 font-semibold text-[#F0EDE8]">{value}</div>
          </div>
        ))}
      </div>

      <div className="mt-14">
        <div className="bg-[#1A1A1A] rounded-2xl shadow-sm ring-1 ring-[#2A2A2A] p-6">
          <div className="flex items-center justify-between mb-4">
            <Subheading>Subscribers ({(subscribers as NewsletterSubscriber[]).length})</Subheading>
            {(subscribers as NewsletterSubscriber[]).length > 0 && (
              <Button plain onClick={handleCopyEmails}>
                <ClipboardDocumentIcon className="size-4" />
                {copied ? 'Copied!' : 'Copy All Emails'}
              </Button>
            )}
          </div>
          {isLoading && <Text>Loading…</Text>}
          {!isLoading && (subscribers as NewsletterSubscriber[]).length === 0 && (
            <Text className="text-center py-8 italic">No subscribers yet.</Text>
          )}
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {(subscribers as NewsletterSubscriber[]).map((s) => (
              <div key={s.id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-[#111111] ring-1 ring-[#2A2A2A]">
                <div>
                  <div className="text-sm font-medium text-[#F0EDE8]">{s.email}</div>
                  <div className="text-xs text-[#5A5550]">{formatDate(s.createdAt)}</div>
                </div>
                <Button plain onClick={() => removeMutation.mutate(s.email)} disabled={removeMutation.isPending}>
                  <TrashIcon className="size-4 text-red-400" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
