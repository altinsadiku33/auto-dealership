const CURRENCY_SYMBOLS: Record<string, string> = {
  EUR: '€',
  GBP: '£',
  USD: '$',
  CHF: 'CHF ',
  AUD: 'A$',
  CAD: 'C$',
}

export function formatPrice(price: number, currency = 'EUR'): string {
  const symbol = CURRENCY_SYMBOLS[currency] ?? `${currency} `
  return `${symbol}${price.toLocaleString('en-GB')}`
}

export function formatMileage(mileage: number, unit = 'km'): string {
  return `${mileage.toLocaleString()} ${unit}`
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function initials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

export function pipelineLabel(stage: string | null): string {
  const map: Record<string, string> = {
    new: 'New Lead',
    replied: 'Contacted',
    test_drive: 'Test Drive',
    negotiate: 'Negotiating',
    closed: 'Closed / Sold',
  }
  return stage ? (map[stage] ?? stage) : '—'
}

export function statusColor(status: string): 'teal' | 'green' | 'amber' | 'red' | 'zinc' {
  const map: Record<string, 'teal' | 'green' | 'amber' | 'red' | 'zinc'> = {
    new: 'teal',
    available: 'green',
    replied: 'green',
    reserved: 'amber',
    closed: 'zinc',
    sold: 'red',
    inactive: 'zinc',
  }
  return map[status] ?? 'zinc'
}
