import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'

export function useSettings() {
  const { data } = useQuery({ queryKey: ['settings'], queryFn: api.getSettings })
  return {
    currency: data?.currency ?? 'EUR',
    distanceUnit: data?.distanceUnit ?? 'km',
  }
}
