'use client'

import * as Headless from '@headlessui/react'
import { ChevronUpDownIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx'
import { useState } from 'react'

interface ComboboxProps {
  options: readonly string[]
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  placeholder?: string
}

export function Combobox({ options, value, onChange, onBlur, placeholder }: ComboboxProps) {
  const [query, setQuery] = useState('')

  const filtered = query.trim() === ''
    ? options
    : options.filter((o) => o.toLowerCase().includes(query.toLowerCase()))

  return (
    <Headless.Combobox
      value={value}
      onChange={(val: string | null) => {
        if (val !== null) onChange(val)
        setQuery('')
      }}
      onClose={() => setQuery('')}
    >
      <div className="relative" data-slot="control">
        <Headless.ComboboxInput
          className={clsx(
            'w-full appearance-none rounded-lg pr-8',
            'px-[calc(theme(spacing[3.5])-1px)] py-[calc(theme(spacing[2.5])-1px)]',
            'sm:px-[calc(theme(spacing[3])-1px)] sm:py-[calc(theme(spacing[1.5])-1px)]',
            'text-base/6 text-white placeholder:text-zinc-500 sm:text-sm/6',
            'border border-white/10 hover:border-white/20',
            'bg-white/5',
            'focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500',
          )}
          displayValue={(v: string) => v}
          onChange={(e) => {
            setQuery(e.target.value)
            onChange(e.target.value)
          }}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete="off"
        />
        <Headless.ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2.5">
          <ChevronUpDownIcon className="size-4 text-zinc-400" aria-hidden="true" />
        </Headless.ComboboxButton>
      </div>

      <Headless.ComboboxOptions
        anchor="bottom start"
        className={clsx(
          '[--anchor-gap:4px]',
          'z-[200] w-[var(--input-width)] rounded-xl p-1',
          'bg-[#1A1A1A] shadow-xl ring-1 ring-[#3A3A3A]',
          'max-h-56 overflow-y-auto scroll-py-1',
          'focus:outline-none',
          'transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0',
        )}
      >
        {filtered.length === 0 ? (
          <div className="px-3 py-2 text-xs text-zinc-500 italic">
            No matches — typed value will be saved.
          </div>
        ) : (
          filtered.map((opt) => (
            <Headless.ComboboxOption
              key={opt}
              value={opt}
              className={clsx(
                'cursor-default select-none rounded-lg px-3 py-2',
                'text-sm text-[#C0BDB8]',
                'data-[focus]:bg-[#2A2A2A] data-[focus]:text-[#F0EDE8]',
                'data-[selected]:text-gold',
              )}
            >
              {opt}
            </Headless.ComboboxOption>
          ))
        )}
      </Headless.ComboboxOptions>
    </Headless.Combobox>
  )
}
