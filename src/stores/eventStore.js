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



// // OKOKOK
// import { create } from 'zustand';

// const useEventStore = create((set, get) => ({
//   events: [],
  
//   signUpEvent: async (eventId, userId) => {
//     const event = get().events.find(e => e.id === eventId);
//     if (event.participants.length >= event.capacity) {
//       throw new Error('该活动已满员');
//     }
    
//     set(state => ({
//       events: state.events.map(e => e.id === eventId ? {
//         ...e,
//         participants: [...e.participants, {
//           userId,
//           status: 'pending',
//           feedback: null
//         }]
//       } : e)
//     }));
//   },

//   checkInEvent: (eventId, userId) => {
//     set(state => ({
//       events: state.events.map(e => e.id === eventId ? {
//         ...e,
//         participants: e.participants.map(p => 
//           p.userId === userId ? { ...p, status: 'checked-in' } : p
//         )
//       } : e)
//     }));
//   },

//   submitFeedback: async (eventId, feedback) => {
//     set(state => ({
//       events: state.events.map(e => e.id === eventId ? {
//         ...e,
//         participants: e.participants.map(p => 
//           p.userId === feedback.userId ? { ...p, feedback } : p
//         )
//       } : e)
//     }));
//   },

//   updateEventStatus: (eventId, newStatus) => {
//     set(state => ({
//       events: state.events.map(e => 
//         e.id === eventId ? { ...e, status: newStatus } : e
//       )
//     }));
//   }
// }));
// export { useEventStore };


// import { create } from 'zustand'

// export const useEventStore = create((set) => ({
//   events: [],
//   currentEvent: null,
  
//   fetchEvents: async () => {
//     const res = await axios.get('/api/events')
//     set({ events: res.data })
//   },
  
//   registerEvent: async (eventId) => {
//     await axios.post(`/api/events/${eventId}/register`)
//     set(state => ({
//       events: state.events.map(e => 
//         e.id === eventId ? { ...e, seats: e.seats - 1 } : e
//       )
//     }))
//   }
// }))



// import { create } from 'zustand'
// import api from '@/api/events'

// export const useEventStore = create((set, get) => ({
//   events: [],
//   currentEvent: null,
//   isLoading: false,
//   error: null,

//   // 获取所有活动
//   fetchEvents: async (params = {}) => {
//     set({ isLoading: true, error: null })
//     try {
//       const res = await api.get('/events', { params })
//       set({ events: res.data })
//     } catch (error) {
//       set({ error: error.message })
//     } finally {
//       set({ isLoading: false })
//     }
//   },

//   // 获取单个活动详情
//   fetchEvent: async (id) => {
//     set({ isLoading: true })
//     try {
//       const res = await api.get(`/events/${id}`)
//       set({ currentEvent: res.data })
//     } catch (error) {
//       set({ error: error.message })
//     } finally {
//       set({ isLoading: false })
//     }
//   },

//   // 创建活动（带文件上传）
//   createEvent: async (formData) => {
//     try {
//       const res = await api.post('/events', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' }
//       })
//       set(state => ({
//         events: [res.data, ...state.events]
//       }))
//       return res.data
//     } catch (error) {
//           throw new Error(error.response?.data?.message || '创建失败')
//     }
//   },

//   // 更新活动状态
//   updateEventStatus: async (id, status) => {
//     try {
//       const res = await api.patch(`/events/${id}/status`, { status })
//       set(state => ({
//         events: state.events.map(event => 
//           event.id === id ? { ...event, status } : event
//         )
//       }))
//       return res.data
//     } catch (error) {
//       throw new Error(error.response?.data?.message || '更新失败')
//     }
//   }
// }))


import { create } from 'zustand';

export const useEventStore = create((set) => ({
  events: [],

  checkInEvent: (eventId, userId) => {
    set(state => ({
      events: state.events.map(event => 
        event.id === eventId ? {
          ...event,
          participants: event.participants.map(p => 
            p.userId === userId ? { ...p, status: 'checked-in' } : p
          )
        } : event
      )
    }));
  },

  submitFeedback: (eventId, feedback) => {
    set(state => ({
      events: state.events.map(event => 
        event.id === eventId ? {
          ...event,
          participants: event.participants.map(p => 
            p.userId === feedback.userId ? { ...p, feedback } : p
          )
        } : event
      )
    }));
  },
  

  fetchEvents: async () => {
    const response = await fetch('/api/events');
    set({ events: await response.json() });
  },
  

  // 增强报名方法
  registerEvent: async (eventId, userId) => {
    const response = await fetch(`/api/events/${eventId}/register`, {
      method: 'POST',
      body: JSON.stringify({ userId })
    });
    
    const updatedEvent = await response.json();
    
    set(state => ({
      events: state.events.map(e => 
        e.id === eventId ? {
          ...updatedEvent,
          participants: [...e.participants, { 
            userId, 
            status: 'pending',
            registeredAt: new Date().toISOString() 
          }]
        } : e
      )
    }));    
    

    return updatedEvent;
  }
}));