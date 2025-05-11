import { create } from 'zustand'
import api from '@/api/events'

export const useAuthStore = create((set) => ({
  user: null,
  loading: false,
  error: null,

  // 登录操作
  login: async (credentials) => {
    try {
      set({ loading: true, error: null })
      const res = await api.post('/auth/login', credentials)
      localStorage.setItem('token', res.token)
      set({ user: res.user })
      return res.user
    } catch (error) {
      set({ error: error.message })
      throw error
    } finally {
      set({ loading: false })
    }
  },

  // 登出操作
  logout: () => {
    localStorage.removeItem('token')
    set({ user: null })
  },

  // 检查登录状态
  checkAuth: async () => {
    try {
      set({ loading: true })
      const res = await api.get('/auth/me')
      set({ user: res.data })
    } catch (error) {
      set({ user: null })
    } finally {
      set({ loading: false })
    }
  }
}))