'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogActions, DialogBody, DialogTitle } from '@/components/ui/dialog'
import { Field, FieldGroup, Label } from '@/components/ui/fieldset'
import { Heading } from '@/components/ui/heading'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Text } from '@/components/ui/text'
import { Textarea } from '@/components/ui/textarea'
import type { Service } from '@/lib/api'
import { api } from '@/lib/api'
import { useAuthStore } from '@/store/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { PlusIcon } from '@heroicons/react/16/solid'
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/20/solid'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'


const svcSchema = z.object({
  icon: z.string().default('◈'),
  name: z.string().min(1, 'Required'),
  description: z.string().min(1, 'Required'),
  price: z.string().min(1, 'Required'),
})
type SvcForm = z.infer<typeof svcSchema>

export default function ServicesPage() {
  const qc = useQueryClient()
  const { user: me } = useAuthStore()
  const canEdit = me?.role === 'admin' || me?.role === 'manager'
  const [editing, setEditing] = useState<Service | null | undefined>(undefined)
  const [deleting, setDeleting] = useState<Service | null>(null)

  const { data: services = [], isLoading } = useQuery({ queryKey: ['services'], queryFn: api.getServices })

  const saveMutation = useMutation({
    mutationFn: (data: SvcForm) =>
      editing?.id ? api.updateService(editing.id, data) : api.createService(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['services'] }); setEditing(undefined) },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.deleteService(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['services'] }); setDeleting(null) },
  })

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<SvcForm>({
    resolver: zodResolver(svcSchema),
  })

  function openAdd() {
    reset({ icon: '◈', name: '', description: '', price: '' })
    setEditing(null)
  }
  function openEdit(s: Service) {
    reset({ icon: s.icon, name: s.name, description: s.description, price: s.price })
    setEditing(s)
  }

  return (
    <>
      <div className="flex items-end justify-between">
        <Heading>Services Management</Heading>
        {canEdit && <Button onClick={openAdd}><PlusIcon /> Add Service</Button>}
      </div>

      <Table className="mt-6 [--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)]">
        <TableHead>
          <TableRow>
            <TableHeader>Icon</TableHeader>
            <TableHeader>Service</TableHeader>
            <TableHeader>Description</TableHeader>
            <TableHeader>Price</TableHeader>
            <TableHeader>Actions</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading && <TableRow><TableCell colSpan={5}><Text className="text-center py-8">Loading…</Text></TableCell></TableRow>}
          {!isLoading && services.length === 0 && <TableRow><TableCell colSpan={5}><Text className="text-center py-8">No services yet.</Text></TableCell></TableRow>}
          {services.map((s: Service) => (
            <TableRow key={s.id}>
              <TableCell><span className="text-2xl">{s.icon}</span></TableCell>
              <TableCell className="font-medium text-[#F0EDE8]">{s.name}</TableCell>
              <TableCell className="text-[#9A9490] max-w-xs truncate">{s.description}</TableCell>
              <TableCell className="font-semibold text-brand-600">{s.price}</TableCell>
              <TableCell>
                {canEdit && (
                  <div className="flex gap-2">
                    <Button plain onClick={() => openEdit(s)}><PencilSquareIcon className="size-4" /></Button>
                    <Button plain onClick={() => setDeleting(s)}><TrashIcon className="size-4 text-red-500" /></Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={editing !== undefined} onClose={() => setEditing(undefined)}>
        <DialogTitle>{editing?.id ? 'Edit Service' : 'Add Service'}</DialogTitle>
        <form onSubmit={handleSubmit((d) => saveMutation.mutate(d))}>
          <DialogBody>
            <FieldGroup>
              <Field><Label>Name *</Label><Input {...register('name')} />{errors.name && <Text className="text-red-600 text-xs">{errors.name.message}</Text>}</Field>
              <Field><Label>Price</Label><Input {...register('price')} placeholder="From £895" /></Field>
              <Field><Label>Description *</Label><Textarea {...register('description')} rows={3} />{errors.description && <Text className="text-red-600 text-xs">{errors.description.message}</Text>}</Field>
            </FieldGroup>
          </DialogBody>
          <DialogActions>
            <Button plain onClick={() => setEditing(undefined)}>Cancel</Button>
            <Button type="submit" disabled={saveMutation.isPending}>Save</Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog open={deleting !== null} onClose={() => setDeleting(null)} size="sm">
        <DialogTitle>Delete Service</DialogTitle>
        <DialogBody><Text>Delete <strong>{deleting?.name}</strong>? This cannot be undone.</Text></DialogBody>
        <DialogActions>
          <Button plain onClick={() => setDeleting(null)}>Cancel</Button>
          <Button color="red" onClick={() => deleting && deleteMutation.mutate(deleting.id)} disabled={deleteMutation.isPending}>Delete</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
