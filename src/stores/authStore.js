// import { create } from 'zustand'
// import api from '@/api/events'


// export const useAuthStore = create((set) => ({
//   user: null,
//   loading: false,
//   error: null,


//     isOrganizer: false,
    
//     // 新增激活码验证方法
//     validateActivationCode: async (code) => {
//       try {
//         const response = await fetch('/api/activation-codes?code=' + code);
//         const data = await response.json();
//         if (data.valid) {
//           set({ isOrganizer: true });
//           return { success: true };
//         }
//         return { success: false };
//       } catch (error) {
//         return { success: false };
//       }
//     },

//   // 登录操作
//   login: async (credentials) => {
//     try {
//       set({ loading: true, error: null })
//       const res = await api.post('/auth/login', credentials)
//       localStorage.setItem('token', res.token)
//       set({ user: res.user })
//       return res.user
//     } catch (error) {
//       set({ error: error.message })
//       throw error
//     } finally {
//       set({ loading: false })
//     }
//   },

//   setUser: (user) => set({ user }),// 确保这里定义了 setUser

//   // 登出操作
//   logout: () => {
//     localStorage.removeItem('token')
//     set({ user: null })
//   },

//   // 检查登录状态
//   checkAuth: async () => {
//     try {
//       set({ loading: true })
//       const res = await api.get('/auth/me')
//       set({ user: res.data })
//     } catch (error) {
//       set({ user: null })
//     } finally {
//       set({ loading: false })
//     }
//   }
// }))


import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/api/events';


export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      loading: false,
      error: null,
      token: null, // 新增token字段
      isLoggedIn: false, // 新增登录状态
      isOrganizer: false,
      registeredEvents: [], // 新增注册活动状态

      // 增强的激活码验证方法
      validateActivationCode: async (code) => {
        try {
          const response = await fetch('/api/activation-codes?code=' + code);
          const data = await response.json();
          if (data.valid) {
            set({ 
              isOrganizer: true,
              user: {
                ...get().user,
                isOrganizer: true
              }
            });
            return { success: true };
          }
          return { success: false };
        } catch (error) {
          return { success: false };
        }
      },

      // 增强登录方法
      // login: async (credentials) => {
      //   try {
      //     set({ loading: true, error: null });
      //     const res = await api.post('/auth/login', credentials);
      //     localStorage.setItem('token', res.token);
      //     set({ 
      //       user: res.user,
      //       registeredEvents: res.user.registeredEvents || [] 
      //     });
      //     return res.user;
      //   } catch (error) {
      //     set({ error: error.message });
      //     throw error;
      //   } finally {
      //     set({ loading: false });
      //   }
      // },

      // login: async (credentials) => {
      //   try {
      //     set({ loading: true, error: null });
      //     const res = await api.post('/auth/login', credentials);
          
      //     // 确保原子性更新
      //     set(() => ({
      //       user: res.user,
            
      //       isLoggedIn: true,  // 明确设置登录状态
      //       registeredEvents: res.user.registeredEvents || [],
      //       isOrganizer: res.user.isOrganizer || false
      //     }));
          
      //     localStorage.setItem('token', res.token);
      //     return res.user;
      //   } catch (error) {
      //     set({ error: error.message });
      //     throw error;
      //   } finally {
      //     set({ loading: false });
      //   }
      // },
// 在authStore中添加模拟登录方法
login: async (credentials) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      set({
        user: {
          id: 'mock-123',
          username: credentials.username,
          isOrganizer: false,
          registeredEvents: []
        },
        isLoggedIn: true,
        token: 'mock-token-123'
      });
      resolve();
    }, 1000); // 模拟1秒延迟
  });
},
      
      // 新增活动注册方法
      registerEvent: (eventId) => {
        if (!get().registeredEvents.includes(eventId)) {
          set(state => ({
            registeredEvents: [...state.registeredEvents, eventId]
          }));
          // 同步更新用户数据
          if (get().user) {
            set({
              user: {
                ...get().user,
                registeredEvents: [...get().user.registeredEvents, eventId]
              }
            });
          }
        }
      },

      setUser: (user) => set({ user }),

      // 增强登出方法
      logout: () => {
        localStorage.removeItem('token');
        set({ 
          user: null,
          isOrganizer: false,
          registeredEvents: [] // 清除注册记录
        });
      },
      checkAuth: async () => {
        const token = localStorage.getItem('token');
        if (token) {
          set({ isLoggedIn: true });
        }
      }
      // 增强认证检查
      // checkAuth: async () => {
      //   try {
      //     set({ loading: true });
      //     const res = await api.get('/auth/me');
      //     set({ 
      //       user: res.data,
      //       registeredEvents: res.data.registeredEvents || [],
      //       isOrganizer: res.data.isOrganizer || false
      //     });
      //   } catch (error) {
      //     set({ 
      //       user: null,
      //       registeredEvents: [],
      //       isOrganizer: false
      //     });
      //   } finally {
      //     set({ loading: false });
      //   }
      // }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isLoggedIn: state.isLoggedIn, // 必须持久化
        registeredEvents: state.registeredEvents || []
      })
    }
  )
);






// import create from 'zustand';

// export const useAuthStore = create((set) => ({
//   user: null,
//   isLoading: false,
//   setUser: (user) => set({ user }), // 添加 setUser 方法
//   logout: () => set({ user: null }),
//   checkAuth: async () => {
//     // 检查认证逻辑
//   },
// }));