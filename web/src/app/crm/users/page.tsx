'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogActions, DialogBody, DialogTitle } from '@/components/ui/dialog'
import { Field, FieldGroup, Label } from '@/components/ui/fieldset'
import { Heading } from '@/components/ui/heading'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Text } from '@/components/ui/text'
import type { User } from '@/lib/api'
import { api } from '@/lib/api'
import { formatDate, initials } from '@/lib/utils'
import { useAuthStore } from '@/store/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { PlusIcon } from '@heroicons/react/16/solid'
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/20/solid'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const userSchema = z.object({
  name: z.string().min(1, 'Required'),
  email: z.string().email('Invalid email'),
  password: z.string().optional(),
  role: z.enum(['admin', 'manager', 'sales']),
  active: z.boolean(),
})
type UserForm = z.infer<typeof userSchema>

const ROLE_COLOR: Record<string, 'teal' | 'blue' | 'zinc'> = { admin: 'teal', manager: 'blue', sales: 'zinc' }

export default function UsersPage() {
  const qc = useQueryClient()
  const { user: me } = useAuthStore()
  const [editing, setEditing] = useState<User | null | undefined>(undefined)
  const [deleting, setDeleting] = useState<User | null>(null)

  const { data: users = [], isLoading } = useQuery({ queryKey: ['users'], queryFn: api.getUsers })

  const saveMutation = useMutation({
    mutationFn: (data: UserForm) => {
      const payload: Record<string, unknown> = { name: data.name, email: data.email, role: data.role, active: data.active }
      if (data.password) payload.password = data.password
      return editing?.id ? api.updateUser(editing.id, payload as Partial<User>) : api.createUser({ ...payload, password: data.password! } as Parameters<typeof api.createUser>[0])
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['users'] }); setEditing(undefined) },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.deleteUser(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['users'] }); setDeleting(null) },
  })

  const { register, handleSubmit, reset, formState: { errors } } = useForm<UserForm>({
    resolver: zodResolver(userSchema),
  })

  function openAdd() {
    reset({ name: '', email: '', password: '', role: 'sales', active: true })
    setEditing(null)
  }
  function openEdit(u: User) {
    reset({ name: u.name, email: u.email, password: '', role: u.role, active: u.active })
    setEditing(u)
  }

  return (
    <>
      <div className="flex items-end justify-between">
        <Heading>Staff & Users</Heading>
        <Button onClick={openAdd}><PlusIcon /> Add Member</Button>
      </div>

      <Table className="mt-6 [--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)]">
        <TableHead>
          <TableRow>
            <TableHeader>Name</TableHeader>
            <TableHeader>Email</TableHeader>
            <TableHeader>Role</TableHeader>
            <TableHeader>Status</TableHeader>
            <TableHeader>Joined</TableHeader>
            <TableHeader>Actions</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading && <TableRow><TableCell colSpan={6}><Text className="text-center py-8">Loading…</Text></TableCell></TableRow>}
          {users.map((u: User) => (
            <TableRow key={u.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs font-semibold shrink-0">
                    {initials(u.name)}
                  </div>
                  <div>
                    <div className="font-medium text-[#F0EDE8]">{u.name}{u.id === me?.id && <span className="ml-2 text-xs text-[#5A5550]">(you)</span>}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-[#9A9490]">{u.email}</TableCell>
              <TableCell><Badge color={ROLE_COLOR[u.role] ?? 'zinc'}>{u.role}</Badge></TableCell>
              <TableCell><Badge color={u.active ? 'green' : 'zinc'}>{u.active ? 'Active' : 'Inactive'}</Badge></TableCell>
              <TableCell className="text-[#9A9490]">{formatDate(u.createdAt)}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button plain onClick={() => openEdit(u)}><PencilSquareIcon className="size-4" /></Button>
                  {u.id !== 1 && u.id !== me?.id && (
                    <Button plain onClick={() => setDeleting(u)}><TrashIcon className="size-4 text-red-500" /></Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={editing !== undefined} onClose={() => setEditing(undefined)}>
        <DialogTitle>{editing?.id ? 'Edit Staff Member' : 'Add Staff Member'}</DialogTitle>
        <form onSubmit={handleSubmit((d) => saveMutation.mutate(d))}>
          <DialogBody>
            <FieldGroup>
              <Field><Label>Full Name *</Label><Input {...register('name')} />{errors.name && <Text className="text-red-600 text-xs">{errors.name.message}</Text>}</Field>
              <Field><Label>Email *</Label><Input type="email" {...register('email')} />{errors.email && <Text className="text-red-600 text-xs">{errors.email.message}</Text>}</Field>
              <Field><Label>{editing?.id ? 'New Password (leave blank to keep)' : 'Password *'}</Label><Input type="password" {...register('password')} /></Field>
              <div className="grid grid-cols-2 gap-4">
                <Field><Label>Role</Label><Select {...register('role')}><option value="sales">Sales</option><option value="manager">Manager</option><option value="admin">Admin</option></Select></Field>
                <Field><Label>Status</Label><Select {...register('active', { setValueAs: (v) => v === 'true' })}><option value="true">Active</option><option value="false">Inactive</option></Select></Field>
              </div>
            </FieldGroup>
          </DialogBody>
          <DialogActions>
            <Button plain onClick={() => setEditing(undefined)}>Cancel</Button>
            <Button type="submit" disabled={saveMutation.isPending}>Save</Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog open={deleting !== null} onClose={() => setDeleting(null)} size="sm">
        <DialogTitle>Remove Staff Member</DialogTitle>
        <DialogBody><Text>Remove <strong>{deleting?.name}</strong> from the system?</Text></DialogBody>
        <DialogActions>
          <Button plain onClick={() => setDeleting(null)}>Cancel</Button>
          <Button color="red" onClick={() => deleting && deleteMutation.mutate(deleting.id)} disabled={deleteMutation.isPending}>Remove</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
