const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

export type ApiResponse<T> = { success: true; data: T } | { success: false; error: string; details?: unknown }

function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('auto_token')
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken()
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(init.headers ?? {}),
  }

  const res = await fetch(`${API_URL}${path}`, { ...init, headers })
  const body = (await res.json()) as ApiResponse<T>

  if (!res.ok || !body.success) {
    throw new Error((body as { error?: string }).error ?? `HTTP ${res.status}`)
  }

  return (body as { success: true; data: T }).data
}

export const api = {
  // Auth
  login: (email: string, password: string) =>
    request<{ token: string; user: User }>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  me: () => request<User>('/api/v1/auth/me'),
  logout: () => request<void>('/api/v1/auth/logout', { method: 'POST' }),

  // Cars
  getCars: (params?: { search?: string; category?: string; status?: string }) => {
    const q = new URLSearchParams()
    if (params?.search) q.set('search', params.search)
    if (params?.category) q.set('category', params.category)
    if (params?.status) q.set('status', params.status)
    const qs = q.toString()
    return request<Car[]>(`/api/v1/cars${qs ? `?${qs}` : ''}`)
  },
  getCar: (id: number) => request<Car>(`/api/v1/cars/${id}`),
  createCar: (data: Partial<Car>) => request<Car>('/api/v1/cars', { method: 'POST', body: JSON.stringify(data) }),
  updateCar: (id: number, data: Partial<Car>) =>
    request<Car>(`/api/v1/cars/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCar: (id: number) => request<void>(`/api/v1/cars/${id}`, { method: 'DELETE' }),
  uploadCarImages: (id: number, files: File[]) => {
    const body = new FormData()
    files.forEach((f) => body.append('files', f))
    const token = typeof window !== 'undefined' ? localStorage.getItem('auto_token') : null
    return fetch(`${API_URL}/api/v1/cars/${id}/images`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body,
    }).then(async (res) => {
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.error ?? `HTTP ${res.status}`)
      return data.data as import('./api').CarImage[]
    })
  },
  deleteCarImage: (carId: number, imageId: number) =>
    request<void>(`/api/v1/cars/${carId}/images/${imageId}`, { method: 'DELETE' }),

  // Services
  getServices: () => request<Service[]>('/api/v1/services'),
  createService: (data: Partial<Service>) =>
    request<Service>('/api/v1/services', { method: 'POST', body: JSON.stringify(data) }),
  updateService: (id: number, data: Partial<Service>) =>
    request<Service>(`/api/v1/services/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteService: (id: number) => request<void>(`/api/v1/services/${id}`, { method: 'DELETE' }),

  // Inquiries
  getInquiries: () => request<Inquiry[]>('/api/v1/inquiries'),
  getInquiry: (id: number) => request<Inquiry>(`/api/v1/inquiries/${id}`),
  createInquiry: (data: Partial<Inquiry>) =>
    request<Inquiry>('/api/v1/inquiries', { method: 'POST', body: JSON.stringify(data) }),
  updateInquiry: (id: number, data: Partial<Inquiry> & { assignedToId?: number | null }) =>
    request<Inquiry>(`/api/v1/inquiries/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteInquiry: (id: number) => request<void>(`/api/v1/inquiries/${id}`, { method: 'DELETE' }),

  // Newsletter
  getSubscribers: () => request<NewsletterSubscriber[]>('/api/v1/newsletter/subscribers'),
  subscribe: (email: string) =>
    request<NewsletterSubscriber>('/api/v1/newsletter/subscribe', { method: 'POST', body: JSON.stringify({ email }) }),
  unsubscribe: (email: string) => request<void>(`/api/v1/newsletter/${encodeURIComponent(email)}`, { method: 'DELETE' }),

  // Users
  getUsers: () => request<User[]>('/api/v1/users'),
  createUser: (data: Partial<User> & { password: string }) =>
    request<User>('/api/v1/users', { method: 'POST', body: JSON.stringify(data) }),
  updateUser: (id: number, data: Partial<User>) =>
    request<User>(`/api/v1/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteUser: (id: number) => request<void>(`/api/v1/users/${id}`, { method: 'DELETE' }),

  // Auth extras
  changePassword: (currentPassword: string, newPassword: string) =>
    request<void>('/api/v1/auth/change-password', { method: 'POST', body: JSON.stringify({ currentPassword, newPassword }) }),

  // Settings
  getSettings: () => request<DealerSettings>('/api/v1/settings'),
  updateSettings: (data: Partial<DealerSettings>) =>
    request<DealerSettings>('/api/v1/settings', { method: 'PUT', body: JSON.stringify(data) }),

}

// ── Types ──────────────────────────────────────────────────────────────────

export interface CarImage {
  id: number
  carId: number
  url: string
  order: number
  createdAt: string
}

export interface Car {
  id: number
  make: string
  model: string
  year: number
  price: number
  mileage: number
  category: string
  status: 'available' | 'sold' | 'reserved'
  color: string | null
  engine: string | null
  transmission: string | null
  acceleration: string | null
  topSpeed: string | null
  weight: string | null
  badge: string | null
  image: string | null
  description: string | null
  images: CarImage[]
  createdAt: string
  updatedAt: string
}

export interface Service {
  id: number
  icon: string
  name: string
  description: string
  price: string
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface Inquiry {
  id: number
  name: string
  email: string
  phone: string | null
  subject: string
  vehicle: string | null
  message: string
  status: 'new' | 'replied' | 'closed'
  pipelineStage: string | null
  assignedToId: number | null
  assignedTo: { id: number; name: string } | null
  createdAt: string
  updatedAt: string
}

export interface NewsletterSubscriber {
  id: number
  email: string
  createdAt: string
}

export interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'manager' | 'sales'
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface DealerSettings {
  id: number
  dealerName: string
  tagline: string
  address: string
  phone: string
  email: string
  mondayFridayHours: string
  saturdayHours: string
  sundayHours: string
  currency: string
  distanceUnit: string
  updatedAt: string
}
