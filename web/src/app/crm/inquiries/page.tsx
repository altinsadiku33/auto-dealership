'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogActions, DialogBody, DialogTitle } from '@/components/ui/dialog'
import { Field, FieldGroup, Label } from '@/components/ui/fieldset'
import { Heading } from '@/components/ui/heading'
import { Select } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Text } from '@/components/ui/text'
import type { Inquiry, User } from '@/lib/api'
import { api } from '@/lib/api'
import { formatDate, pipelineLabel } from '@/lib/utils'
import { useAuthStore } from '@/store/auth'
import { MagnifyingGlassIcon, TrashIcon } from '@heroicons/react/20/solid'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

const STATUS_COLOR: Record<string, 'teal' | 'green' | 'zinc'> = {
  new: 'teal',
  replied: 'green',
  closed: 'zinc',
}

export default function InquiriesPage() {
  const qc = useQueryClient()
  const { user: me } = useAuthStore()
  const isAdmin = me?.role === 'admin' || me?.role === 'manager'

  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [selected, setSelected] = useState<Inquiry | null>(null)
  const [pipelineStage, setPipelineStage] = useState('')
  const [status, setStatus] = useState('')
  const [assignedToId, setAssignedToId] = useState<string>('')

  const { data: inquiries = [], isLoading } = useQuery({ queryKey: ['inquiries'], queryFn: api.getInquiries })
  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: api.getUsers,
    enabled: isAdmin,
  })

  const updateMutation = useMutation({
    mutationFn: (data: Partial<Inquiry> & { assignedToId?: number | null }) =>
      api.updateInquiry(selected!.id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['inquiries'] }); setSelected(null) },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.deleteInquiry(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['inquiries'] }); setSelected(null) },
  })

  const filtered = (inquiries as Inquiry[]).filter((i) => {
    const q = search.toLowerCase()
    const matchQ = !search || `${i.name} ${i.email} ${i.subject}`.toLowerCase().includes(q)
    const matchStatus = !filterStatus || i.status === filterStatus
    return matchQ && matchStatus
  })

  function openInquiry(inq: Inquiry) {
    setSelected(inq)
    setPipelineStage(inq.pipelineStage ?? '')
    setStatus(inq.status)
    setAssignedToId(inq.assignedToId !== null && inq.assignedToId !== undefined ? String(inq.assignedToId) : '')
  }

  function handleSave() {
    updateMutation.mutate({
      status: status as Inquiry['status'],
      pipelineStage: pipelineStage || null,
      assignedToId: assignedToId ? Number(assignedToId) : null,
    })
  }

  return (
    <>
      <div className="flex items-end justify-between">
        <Heading>Client Inquiries</Heading>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#5A5550] pointer-events-none" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, subject…"
            className="pl-9 pr-4 py-2 text-sm border border-[#2A2A2A] rounded-lg bg-[#1A1A1A] text-[#F0EDE8] placeholder:text-[#5A5550] focus:outline-none focus:ring-2 focus:ring-gold/30 w-72"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="text-sm border border-[#2A2A2A] rounded-lg px-3 py-2 bg-[#1A1A1A] text-[#F0EDE8] focus:outline-none focus:ring-2 focus:ring-gold/30"
        >
          <option value="">All Statuses</option>
          <option value="new">New</option>
          <option value="replied">Replied</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      <Table className="mt-6 [--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)]">
        <TableHead>
          <TableRow>
            <TableHeader>Date</TableHeader>
            <TableHeader>Client</TableHeader>
            <TableHeader>Subject</TableHeader>
            <TableHeader>Vehicle</TableHeader>
            <TableHeader>Assigned To</TableHeader>
            <TableHeader>Pipeline</TableHeader>
            <TableHeader>Status</TableHeader>
            <TableHeader></TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading && (
            <TableRow><TableCell colSpan={8}><Text className="text-center py-8">Loading…</Text></TableCell></TableRow>
          )}
          {!isLoading && filtered.length === 0 && (
            <TableRow><TableCell colSpan={8}><Text className="text-center py-8">No inquiries found.</Text></TableCell></TableRow>
          )}
          {(filtered as Inquiry[]).map((inq) => (
            <TableRow key={inq.id} onClick={() => openInquiry(inq)} className="cursor-pointer">
              <TableCell className="text-[#9A9490]">{formatDate(inq.createdAt)}</TableCell>
              <TableCell>
                <div className="font-medium text-[#F0EDE8]">{inq.name}</div>
                <div className="text-xs text-[#9A9490]">{inq.email}</div>
              </TableCell>
              <TableCell>{inq.subject}</TableCell>
              <TableCell className="text-[#9A9490]">{inq.vehicle ?? '—'}</TableCell>
              <TableCell className="text-[#9A9490]">
                {inq.assignedTo ? (
                  <Badge color="zinc">{inq.assignedTo.name}</Badge>
                ) : (
                  <span className="text-[#5A5550] text-xs italic">Unassigned</span>
                )}
              </TableCell>
              <TableCell>
                {inq.pipelineStage ? (
                  <Badge color="amber">{pipelineLabel(inq.pipelineStage)}</Badge>
                ) : '—'}
              </TableCell>
              <TableCell>
                <Badge color={STATUS_COLOR[inq.status] ?? 'zinc'}>{inq.status}</Badge>
              </TableCell>
              <TableCell>
                {isAdmin && (
                  <Button plain onClick={(e: React.MouseEvent) => { e.stopPropagation(); deleteMutation.mutate(inq.id) }}>
                    <TrashIcon className="size-4 text-red-500" />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Inquiry Detail Modal */}
      <Dialog open={selected !== null} onClose={() => setSelected(null)} size="lg">
        {selected && (
          <>
            <DialogTitle>Inquiry — {selected.name}</DialogTitle>
            <DialogBody>
              <div className="space-y-4">
                <div className="rounded-xl bg-[#111111] ring-1 ring-[#2A2A2A] p-4">
                  <div className="text-xs font-semibold uppercase tracking-widest text-[#5A5550] mb-1">From</div>
                  <div className="font-medium text-[#F0EDE8]">{selected.name}</div>
                  <div className="text-sm text-[#9A9490]">{selected.email}{selected.phone ? ` · ${selected.phone}` : ''}</div>
                </div>
                <div className="rounded-xl bg-[#111111] ring-1 ring-[#2A2A2A] p-4">
                  <div className="text-xs font-semibold uppercase tracking-widest text-[#5A5550] mb-1">Subject</div>
                  <div className="text-[#F0EDE8]">{selected.subject}</div>
                </div>
                {selected.vehicle && (
                  <div className="rounded-xl bg-[#111111] ring-1 ring-[#2A2A2A] p-4">
                    <div className="text-xs font-semibold uppercase tracking-widest text-[#5A5550] mb-1">Vehicle of Interest</div>
                    <div className="text-brand-600 font-medium">{selected.vehicle}</div>
                  </div>
                )}
                <div className="rounded-xl bg-[#111111] ring-1 ring-[#2A2A2A] p-4">
                  <div className="text-xs font-semibold uppercase tracking-widest text-[#5A5550] mb-2">Message</div>
                  <div className="text-sm text-[#9A9490] leading-relaxed">{selected.message}</div>
                </div>
                <div className="text-xs text-[#5A5550]">Received {formatDate(selected.createdAt)}</div>

                <FieldGroup>
                  <div className="grid grid-cols-2 gap-4">
                    <Field>
                      <Label>Pipeline Stage</Label>
                      <Select value={pipelineStage} onChange={(e) => setPipelineStage(e.target.value)}>
                        <option value="">— No Stage —</option>
                        <option value="new">New Lead</option>
                        <option value="replied">Contacted</option>
                        <option value="test_drive">Test Drive</option>
                        <option value="negotiate">Negotiating</option>
                        <option value="closed">Closed / Sold</option>
                      </Select>
                    </Field>
                    <Field>
                      <Label>Status</Label>
                      <Select value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option value="new">New</option>
                        <option value="replied">Replied</option>
                        <option value="closed">Closed</option>
                      </Select>
                    </Field>
                    {isAdmin && (
                      <Field className="col-span-2">
                        <Label>Assign To</Label>
                        <Select value={assignedToId} onChange={(e) => setAssignedToId(e.target.value)}>
                          <option value="">— Unassigned —</option>
                          {(users as User[]).filter((u) => u.active).map((u) => (
                            <option key={u.id} value={String(u.id)}>{u.name} ({u.role})</option>
                          ))}
                        </Select>
                      </Field>
                    )}
                  </div>
                </FieldGroup>
              </div>
            </DialogBody>
            <DialogActions>
              {isAdmin && (
                <Button color="red" onClick={() => deleteMutation.mutate(selected.id)} disabled={deleteMutation.isPending}>
                  Delete
                </Button>
              )}
              <Button plain onClick={() => setSelected(null)}>Cancel</Button>
              <Button onClick={handleSave} disabled={updateMutation.isPending}>
                {updateMutation.isPending ? 'Saving…' : 'Save Changes'}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  )
}
