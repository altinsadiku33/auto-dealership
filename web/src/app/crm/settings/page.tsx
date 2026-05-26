'use client'

import { Button } from '@/components/ui/button'
import { Field, FieldGroup, Label } from '@/components/ui/fieldset'
import { Heading, Subheading } from '@/components/ui/heading'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Text } from '@/components/ui/text'
import { api } from '@/lib/api'
import type { DealerSettings } from '@/lib/api'
import { useAuthStore } from '@/store/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const dealerSchema = z.object({
  dealerName:        z.string().min(1),
  tagline:           z.string(),
  address:           z.string(),
  phone:             z.string(),
  email:             z.string().email(),
  mondayFridayHours: z.string(),
  saturdayHours:     z.string(),
  sundayHours:       z.string(),
  currency:          z.string(),
  distanceUnit:      z.enum(['km', 'mi']),
})

const pwSchema = z.object({
  current: z.string().min(1, 'Required'),
  newPw:   z.string().min(6, 'Min 6 characters'),
  confirm: z.string(),
}).refine((d) => d.newPw === d.confirm, { message: 'Passwords do not match', path: ['confirm'] })

type DealerForm = z.infer<typeof dealerSchema>
type PwForm = z.infer<typeof pwSchema>

export default function SettingsPage() {
  const qc = useQueryClient()
  const { user } = useAuthStore()

  const { data: settings } = useQuery<DealerSettings>({ queryKey: ['settings'], queryFn: api.getSettings })

  const { register, handleSubmit, reset, formState: { errors } } = useForm<DealerForm>({
    resolver: zodResolver(dealerSchema),
  })

  useEffect(() => {
    if (settings) {
      reset({
        dealerName:        settings.dealerName,
        tagline:           settings.tagline,
        address:           settings.address,
        phone:             settings.phone,
        email:             settings.email,
        mondayFridayHours: settings.mondayFridayHours,
        saturdayHours:     settings.saturdayHours,
        sundayHours:       settings.sundayHours,
        currency:          settings.currency ?? 'EUR',
        distanceUnit:      (settings.distanceUnit as 'km' | 'mi') ?? 'km',
      })
    }
  }, [settings, reset])

  const saveMutation = useMutation({
    mutationFn: (data: DealerForm) => api.updateSettings(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['settings'] }),
  })

  const { register: regPw, handleSubmit: handlePw, reset: resetPw, formState: { errors: pwErrors } } = useForm<PwForm>({
    resolver: zodResolver(pwSchema),
  })

  const changePwMutation = useMutation({
    mutationFn: (data: PwForm) => api.changePassword(data.current, data.newPw),
    onSuccess: () => resetPw(),
  })

  return (
    <>
      <Heading>CRM Settings</Heading>

      <div className="mt-8 grid lg:grid-cols-2 gap-6">
        {/* Dealership Details */}
        <div className="bg-[#1A1A1A] rounded-2xl shadow-sm ring-1 ring-[#2A2A2A] p-6">
          <Subheading>Dealership Details</Subheading>
          <form onSubmit={handleSubmit((d) => saveMutation.mutate(d))} className="mt-4">
            <FieldGroup>
              <Field>
                <Label>Name</Label>
                <Input {...register('dealerName')} />
                {errors.dealerName && <Text className="text-red-600 text-xs">{errors.dealerName.message}</Text>}
              </Field>
              <Field><Label>Tagline</Label><Input {...register('tagline')} /></Field>
              <Field><Label>Address</Label><Input {...register('address')} /></Field>
              <Field><Label>Phone</Label><Input {...register('phone')} /></Field>
              <Field>
                <Label>Email</Label>
                <Input type="email" {...register('email')} />
                {errors.email && <Text className="text-red-600 text-xs">{errors.email.message}</Text>}
              </Field>
            </FieldGroup>
            <Subheading className="mt-6 mb-2">Opening Hours</Subheading>
            <FieldGroup>
              <Field><Label>Monday – Friday</Label><Input {...register('mondayFridayHours')} placeholder="09:00 – 18:30" /></Field>
              <Field><Label>Saturday</Label><Input {...register('saturdayHours')} placeholder="10:00 – 17:00" /></Field>
              <Field><Label>Sunday</Label><Input {...register('sundayHours')} placeholder="By Appointment" /></Field>
            </FieldGroup>
            <Subheading className="mt-6 mb-2">Display Preferences</Subheading>
            <FieldGroup>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <Label>Currency</Label>
                  <Select {...register('currency')}>
                    <option value="EUR">EUR — Euro (€)</option>
                    <option value="GBP">GBP — British Pound (£)</option>
                    <option value="USD">USD — US Dollar ($)</option>
                    <option value="CHF">CHF — Swiss Franc</option>
                    <option value="AUD">AUD — Australian Dollar (A$)</option>
                    <option value="CAD">CAD — Canadian Dollar (C$)</option>
                  </Select>
                </Field>
                <Field>
                  <Label>Distance Unit</Label>
                  <Select {...register('distanceUnit')}>
                    <option value="km">Kilometres (km)</option>
                    <option value="mi">Miles (mi)</option>
                  </Select>
                </Field>
              </div>
            </FieldGroup>
            <div className="mt-4 flex items-center gap-3">
              <Button type="submit" disabled={saveMutation.isPending}>
                {saveMutation.isPending ? 'Saving…' : 'Save Details'}
              </Button>
              {saveMutation.isSuccess && <Text className="text-emerald-600 text-sm">Saved!</Text>}
              {saveMutation.isError && <Text className="text-red-600 text-sm">Failed to save.</Text>}
            </div>
          </form>
        </div>

        {/* Change Password */}
        <div className="bg-[#1A1A1A] rounded-2xl shadow-sm ring-1 ring-[#2A2A2A] p-6">
          <Subheading>Change Password</Subheading>
          <form onSubmit={handlePw((d) => changePwMutation.mutate(d))} className="mt-4">
            <FieldGroup>
              <Field><Label>Current Password</Label><Input type="password" {...regPw('current')} /></Field>
              <Field>
                <Label>New Password</Label>
                <Input type="password" {...regPw('newPw')} />
                {pwErrors.newPw && <Text className="text-red-600 text-xs">{pwErrors.newPw.message}</Text>}
              </Field>
              <Field>
                <Label>Confirm New Password</Label>
                <Input type="password" {...regPw('confirm')} />
                {pwErrors.confirm && <Text className="text-red-600 text-xs">{pwErrors.confirm.message}</Text>}
              </Field>
            </FieldGroup>
            <div className="mt-4 flex items-center gap-3">
              <Button type="submit" disabled={changePwMutation.isPending}>
                {changePwMutation.isPending ? 'Updating…' : 'Update Password'}
              </Button>
              {changePwMutation.isSuccess && <Text className="text-emerald-600 text-sm">Password updated.</Text>}
              {changePwMutation.isError && (
                <Text className="text-red-600 text-sm">
                  {changePwMutation.error instanceof Error ? changePwMutation.error.message : 'Failed to update password.'}
                </Text>
              )}
            </div>
          </form>
        </div>

        {/* Session */}
        <div className="bg-[#1A1A1A] rounded-2xl shadow-sm ring-1 ring-[#2A2A2A] p-6">
          <Subheading>Signed In As</Subheading>
          <div className="mt-4">
            <Text className="font-medium text-[#F0EDE8]">{user?.name}</Text>
            <Text className="text-[#9A9490]">{user?.email}</Text>
            <Text className="capitalize text-[#9A9490]">{user?.role}</Text>
          </div>
        </div>
      </div>
    </>
  )
}
