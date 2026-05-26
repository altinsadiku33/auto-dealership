'use client'

import type { User } from '@/lib/api'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  token: string | null
  user: User | null
  setAuth: (token: string, user: User) => void
  clearAuth: () => void
  isAuthenticated: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      setAuth: (token, user) => {
        localStorage.setItem('auto_token', token)
        set({ token, user })
      },
      clearAuth: () => {
        localStorage.removeItem('auto_token')
        set({ token: null, user: null })
      },
      isAuthenticated: () => get().token !== null,
    }),
    { name: 'auto_auth', partialize: (s) => ({ token: s.token, user: s.user }) }
  )
)
