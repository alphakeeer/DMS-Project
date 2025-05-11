// import { create } from 'zustand'

// export const useEventStore = create((set) => ({
//   events: [],
//   currentEvent: null,
  
//   fetchEvents: async () => {
//     const res = await axios.get('/api/events')
//     set({ events: res.data })
//   },
  
//   registerEvent: async (eventId) => {
//     await axios.post(`/api/events/${eventId}/register`)
//     set(state => ({
//       events: state.events.map(e => 
//         e.id === eventId ? { ...e, seats: e.seats - 1 } : e
//       )
//     }))
//   }
// }))

import { create } from 'zustand'
import api from '@/api/events'

export const useEventStore = create((set, get) => ({
  events: [],
  currentEvent: null,
  isLoading: false,
  error: null,

  // 获取所有活动
  fetchEvents: async (params = {}) => {
    set({ isLoading: true, error: null })
    try {
      const res = await api.get('/events', { params })
      set({ events: res.data })
    } catch (error) {
      set({ error: error.message })
    } finally {
      set({ isLoading: false })
    }
  },

  // 获取单个活动详情
  fetchEvent: async (id) => {
    set({ isLoading: true })
    try {
      const res = await api.get(`/events/${id}`)
      set({ currentEvent: res.data })
    } catch (error) {
      set({ error: error.message })
    } finally {
      set({ isLoading: false })
    }
  },

  // 创建活动（带文件上传）
  createEvent: async (formData) => {
    try {
      const res = await api.post('/events', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      set(state => ({
        events: [res.data, ...state.events]
      }))
      return res.data
    } catch (error) {
      throw new Error(error.response?.data?.message || '创建失败')
    }
  },

  // 更新活动状态
  updateEventStatus: async (id, status) => {
    try {
      const res = await api.patch(`/events/${id}/status`, { status })
      set(state => ({
        events: state.events.map(event => 
          event.id === id ? { ...event, status } : event
        )
      }))
      return res.data
    } catch (error) {
      throw new Error(error.response?.data?.message || '更新失败')
    }
  }
}))