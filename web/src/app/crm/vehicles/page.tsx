'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Combobox } from '@/components/ui/combobox'
import { Dialog, DialogActions, DialogBody, DialogTitle } from '@/components/ui/dialog'
import { Field, FieldGroup, Label } from '@/components/ui/fieldset'
import { Heading } from '@/components/ui/heading'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Text } from '@/components/ui/text'
import { Textarea } from '@/components/ui/textarea'
import { useSettings } from '@/hooks/useSettings'
import type { Car, CarImage } from '@/lib/api'
import { api } from '@/lib/api'
import { CAR_BADGES, CAR_CATEGORIES, CAR_COLORS, CAR_MAKES, TRANSMISSION_OPTIONS } from '@/lib/carConstants'
import { formatMileage, formatPrice } from '@/lib/utils'
import { useAuthStore } from '@/store/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { PlusIcon, XMarkIcon } from '@heroicons/react/16/solid'
import { MagnifyingGlassIcon, PencilSquareIcon, PhotoIcon, TrashIcon } from '@heroicons/react/20/solid'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Image from 'next/image'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

const carSchema = z.object({
  make: z.string().min(1, 'Required'),
  model: z.string().min(1, 'Required'),
  year: z.coerce.number().int().min(1900).max(2030),
  price: z.coerce.number().min(0),
  mileage: z.coerce.number().int().min(0).default(0),
  category: z.string().min(1),
  status: z.enum(['available', 'sold', 'reserved']),
  color: z.string().optional(),
  engine: z.string().optional(),
  transmission: z.string().optional().transform((v) => v || undefined),
  acceleration: z.string().optional(),
  topSpeed: z.string().optional(),
  weight: z.string().optional(),
  badge: z.string().optional().transform((v) => v || undefined),
  description: z.string().optional(),
})
type CarForm = z.infer<typeof carSchema>

const STATUS_COLOR: Record<string, 'green' | 'red' | 'amber' | 'zinc'> = {
  available: 'green',
  sold: 'red',
  reserved: 'amber',
}

export default function VehiclesPage() {
  const qc = useQueryClient()
  const { user: me } = useAuthStore()
  const canEdit = me?.role === 'admin' || me?.role === 'manager'
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [editing, setEditing] = useState<Car | null | undefined>(undefined)
  const [deleting, setDeleting] = useState<Car | null>(null)
  const [pendingFiles, setPendingFiles] = useState<File[]>([])
  const [uploadingImages, setUploadingImages] = useState(false)

  const { data: cars = [], isLoading } = useQuery({ queryKey: ['cars'], queryFn: () => api.getCars() })
  const { currency, distanceUnit } = useSettings()

  const deleteImageMutation = useMutation({
    mutationFn: ({ carId, imageId }: { carId: number; imageId: number }) =>
      api.deleteCarImage(carId, imageId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cars'] }),
  })

  const saveMutation = useMutation({
    mutationFn: (data: CarForm) =>
      editing?.id ? api.updateCar(editing.id, data) : api.createCar(data),
    onSuccess: async (car) => {
      if (pendingFiles.length > 0) {
        setUploadingImages(true)
        try { await api.uploadCarImages(car.id, pendingFiles) } finally { setUploadingImages(false) }
      }
      qc.invalidateQueries({ queryKey: ['cars'] })
      setEditing(undefined)
      setPendingFiles([])
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.deleteCar(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['cars'] }); setDeleting(null) },
  })

  const filtered = cars.filter((c: Car) => {
    const matchQ = !search || `${c.make} ${c.model}`.toLowerCase().includes(search.toLowerCase())
    const matchCat = !filterCat || c.category === filterCat
    const matchStatus = !filterStatus || c.status === filterStatus
    return matchQ && matchCat && matchStatus
  })

  const { register, handleSubmit, reset, control, formState: { errors, isSubmitting } } = useForm<CarForm>({
    resolver: zodResolver(carSchema),
  })

  function openAdd() {
    reset({ year: new Date().getFullYear(), mileage: 0, category: 'Sports', status: 'available' })
    setPendingFiles([])
    setEditing(null)
  }

  function openEdit(car: Car) {
    reset({
      make: car.make, model: car.model, year: car.year, price: car.price, mileage: car.mileage,
      category: car.category, status: car.status,
      color: car.color ?? '', engine: car.engine ?? '', transmission: car.transmission ?? '',
      acceleration: car.acceleration ?? '', topSpeed: car.topSpeed ?? '', weight: car.weight ?? '',
      badge: car.badge ?? '', description: car.description ?? '',
    })
    setPendingFiles([])
    setEditing(car)
  }

  return (
    <>
      <div className="flex items-end justify-between">
        <Heading>Vehicle Inventory</Heading>
        {canEdit && (
          <Button onClick={openAdd}>
            <PlusIcon />
            Add Vehicle
          </Button>
        )}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#5A5550] pointer-events-none" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search inventory…"
            className="pl-9 pr-4 py-2 text-sm border border-[#2A2A2A] rounded-lg bg-[#1A1A1A] text-[#F0EDE8] placeholder:text-[#5A5550] focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold w-56"
          />
        </div>
        <select
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
          className="text-sm border border-[#2A2A2A] rounded-lg px-3 py-2 bg-[#1A1A1A] text-[#F0EDE8] focus:outline-none focus:ring-2 focus:ring-gold/30"
        >
          <option value="">All Categories</option>
          {CAR_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="text-sm border border-[#2A2A2A] rounded-lg px-3 py-2 bg-[#1A1A1A] text-[#F0EDE8] focus:outline-none focus:ring-2 focus:ring-gold/30"
        >
          <option value="">All Statuses</option>
          <option value="available">Available</option>
          <option value="sold">Sold</option>
          <option value="reserved">Reserved</option>
        </select>
      </div>

      <Table className="mt-6 [--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)]">
        <TableHead>
          <TableRow>
            <TableHeader>Vehicle</TableHeader>
            <TableHeader>Year</TableHeader>
            <TableHeader>Category</TableHeader>
            <TableHeader>Price</TableHeader>
            <TableHeader>Mileage</TableHeader>
            <TableHeader>Status</TableHeader>
            <TableHeader>Actions</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading && (
            <TableRow><TableCell colSpan={7}><Text className="text-center py-8">Loading…</Text></TableCell></TableRow>
          )}
          {!isLoading && filtered.length === 0 && (
            <TableRow><TableCell colSpan={7}><Text className="text-center py-8">No vehicles found.</Text></TableCell></TableRow>
          )}
          {filtered.map((car: Car) => (
            <TableRow key={car.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  {(() => {
                    const thumb = car.images?.[0]?.url
                      ? `http://localhost:3001${car.images[0].url}`
                      : car.image
                    return thumb ? (
                      <div className="relative size-12 rounded overflow-hidden shrink-0 bg-[#2A2A2A]">
                        <Image src={thumb} alt={`${car.make} ${car.model}`} fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="size-12 rounded bg-[#2A2A2A] shrink-0" />
                    )
                  })()}
                  <div>
                    <div className="font-medium text-[#F0EDE8]">{car.make} {car.model}</div>
                    {car.badge && <div className="text-xs text-brand-600">{car.badge}</div>}
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-[#9A9490]">{car.year}</TableCell>
              <TableCell><Badge color="zinc">{car.category}</Badge></TableCell>
              <TableCell className="font-semibold text-brand-600">{formatPrice(car.price, currency)}</TableCell>
              <TableCell className="text-[#9A9490]">{formatMileage(car.mileage, distanceUnit)}</TableCell>
              <TableCell><Badge color={STATUS_COLOR[car.status] ?? 'zinc'}>{car.status}</Badge></TableCell>
              <TableCell>
                {canEdit && (
                  <div className="flex gap-2">
                    <Button plain onClick={() => openEdit(car)} title="Edit">
                      <PencilSquareIcon className="size-4" />
                    </Button>
                    <Button plain onClick={() => setDeleting(car)} title="Delete">
                      <TrashIcon className="size-4 text-red-500" />
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Add / Edit Modal */}
      <Dialog open={editing !== undefined} onClose={() => setEditing(undefined)} size="3xl">
        <DialogTitle>{editing?.id ? 'Edit Vehicle' : 'Add Vehicle'}</DialogTitle>
        <form onSubmit={handleSubmit((data) => saveMutation.mutate(data))}>
          <DialogBody>
            <FieldGroup>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <Label>Make *</Label>
                  <Controller
                    name="make"
                    control={control}
                    render={({ field }) => (
                      <Combobox
                        options={CAR_MAKES}
                        value={field.value ?? ''}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        placeholder="e.g. Porsche"
                      />
                    )}
                  />
                  {errors.make && <Text className="text-red-600 text-xs">{errors.make.message}</Text>}
                </Field>
                <Field>
                  <Label>Model *</Label>
                  <Input {...register('model')} placeholder="911 GT3 RS" />
                  {errors.model && <Text className="text-red-600 text-xs">{errors.model.message}</Text>}
                </Field>
                <Field>
                  <Label>Year</Label>
                  <Input type="number" {...register('year')} />
                </Field>
                <Field>
                  <Label>Price (£)</Label>
                  <Input type="number" {...register('price')} />
                </Field>
                <Field>
                  <Label>Mileage</Label>
                  <Input type="number" {...register('mileage')} />
                </Field>
                <Field>
                  <Label>Category</Label>
                  <Select {...register('category')}>
                    {CAR_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </Select>
                </Field>
                <Field>
                  <Label>Status</Label>
                  <Select {...register('status')}>
                    <option value="available">Available</option>
                    <option value="sold">Sold</option>
                    <option value="reserved">Reserved</option>
                  </Select>
                </Field>
                <Field>
                  <Label>Colour</Label>
                  <Controller
                    name="color"
                    control={control}
                    render={({ field }) => (
                      <Combobox
                        options={CAR_COLORS}
                        value={field.value ?? ''}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        placeholder="e.g. Guards Red"
                      />
                    )}
                  />
                </Field>
                <Field>
                  <Label>Engine</Label>
                  <Input {...register('engine')} placeholder="4.0L Flat-Six 525hp" />
                </Field>
                <Field>
                  <Label>Transmission</Label>
                  <Select {...register('transmission')}>
                    <option value="">— Select —</option>
                    {TRANSMISSION_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
                  </Select>
                </Field>
                <Field>
                  <Label>0–60 mph</Label>
                  <Input {...register('acceleration')} placeholder="3.2s" />
                </Field>
                <Field>
                  <Label>Top Speed</Label>
                  <Input {...register('topSpeed')} placeholder="184 mph" />
                </Field>
                <Field>
                  <Label>Weight</Label>
                  <Input {...register('weight')} placeholder="1,430 kg" />
                </Field>
                <Field>
                  <Label>Badge</Label>
                  <Select {...register('badge')}>
                    <option value="">— None —</option>
                    {CAR_BADGES.map((b) => <option key={b} value={b}>{b}</option>)}
                  </Select>
                </Field>
                {/* Images */}
                <div className="col-span-2 space-y-3">
                  <p className="text-sm font-medium text-[#F0EDE8]">Images</p>

                  {/* Existing images (edit mode) */}
                  {editing?.id && editing.images.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {editing.images.map((img: CarImage) => (
                        <div key={img.id} className="relative group size-20 rounded overflow-hidden bg-[#2A2A2A]">
                          <img src={`http://localhost:3001${img.url}`} alt="" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => deleteImageMutation.mutate({ carId: editing.id, imageId: img.id })}
                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                          >
                            <XMarkIcon className="size-5 text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Pending files preview */}
                  {pendingFiles.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {pendingFiles.map((f, i) => (
                        <div key={i} className="relative group size-20 rounded overflow-hidden bg-[#2A2A2A]">
                          <img src={URL.createObjectURL(f)} alt="" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setPendingFiles((prev) => prev.filter((_, j) => j !== i))}
                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                          >
                            <XMarkIcon className="size-5 text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Upload button */}
                  <label className="flex items-center gap-2 cursor-pointer w-fit px-3 py-2 rounded border border-[#3A3A3A] bg-[#1A1A1A] text-[#9A9490] hover:border-gold/40 hover:text-[#F0EDE8] transition-colors text-sm">
                    <PhotoIcon className="size-4" />
                    Add Photos
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        const files = Array.from(e.target.files ?? [])
                        setPendingFiles((prev) => [...prev, ...files])
                        e.target.value = ''
                      }}
                    />
                  </label>
                </div>

                <Field className="col-span-2">
                  <Label>Description</Label>
                  <Textarea {...register('description')} rows={3} />
                </Field>
              </div>
            </FieldGroup>
          </DialogBody>
          <DialogActions>
            <Button plain onClick={() => setEditing(undefined)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting || saveMutation.isPending || uploadingImages}>
              {uploadingImages ? 'Uploading…' : saveMutation.isPending ? 'Saving…' : 'Save Vehicle'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={deleting !== null} onClose={() => setDeleting(null)} size="sm">
        <DialogTitle>Delete Vehicle</DialogTitle>
        <DialogBody>
          <Text>Remove <strong>{deleting?.make} {deleting?.model}</strong> from inventory? This cannot be undone.</Text>
        </DialogBody>
        <DialogActions>
          <Button plain onClick={() => setDeleting(null)}>Cancel</Button>
          <Button color="red" onClick={() => deleting && deleteMutation.mutate(deleting.id)} disabled={deleteMutation.isPending}>
            {deleteMutation.isPending ? 'Deleting…' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
