// export default function App() {
//     return (
//       <div>
//         <h1>欢迎来到我的项目！</h1>
//         <p>页面已成功加载</p>
//       </div>
//     )
//   }




//OKOKOK
import { Router } from 'react-router-dom';
import { Navigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { ConfigProvider, Spin } from 'antd'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import Layout from '@/components/Layout'
import HomePage from '@/pages/Home'
import EventDetailPage from '@/pages/EventDetail'
import CreateEventPage from '@/pages/CreateEvent'
import DashboardPage from '@/pages/Dashboard'
import LoginPage from '@/pages/Login'
import ProfilePage from '@/pages/Profile'
import NotFoundPage from '@/pages/NotFound'
import RegisterPage from '@/pages/Register'
import MyActivitiesPage from '@/pages/MyActivities';

// 路由配置
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    // errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'events/:id', element: <EventDetailPage /> },
      {
        path: 'create-event',
        element: (
          <PrivateRoute >
            <CreateEventPage />
          </PrivateRoute>
        )
      },
      {
        path: 'edit-event',
        element: (
          <PrivateRoute >
            <CreateEventPage />
          </PrivateRoute>
        )
      },
            {
        path: 'profile',
        element: (
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        )
      },
      {
        path: 'dashboard',
        element: (
          <PrivateRoute roles={['admin', 'organizer']}>
            <DashboardPage />
          </PrivateRoute>
        )
      }
      ,
      {
        path: 'my-activities',
        element: (
          <PrivateRoute>
            <MyActivitiesPage />
          </PrivateRoute>
        )
      }
    ]
  },
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/register',
    element: <RegisterPage />
  }
])

// 权限路由组件
function PrivateRoute({ children, roles = [] }) {
  const { user, isLoading } = useAuthStore()
  const location = useLocation()

  if (isLoading) {
    return <Spin fullscreen tip="权限校验中..." />
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return children
}

// 主应用组件
function App() {
  const { checkAuth } = useAuthStore()

  // 初始化时检查登录状态
  // useEffect(() => {
  //   checkAuth()
  // }, [])
  useEffect(() => {
    checkAuth().catch((error) => {
      console.error('检查登录状态失败:', error)
    })
  }, [])
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 4,
        },
        components: {
          Layout: {
            headerBg: '#001529',
            headerColor: '#fff',
          },
          Button: {
            defaultHoverBorderColor: '#1890ff',
          }
        }
      }}
    >  

      <RouterProvider router={router} />
    </ConfigProvider>
    
  )
}

export default App


// import { useLocation, Navigate } from 'react-router-dom'; // 确保导入 Navigate
// import { useEffect } from 'react';
// import { ConfigProvider, Spin } from 'antd';
// import { RouterProvider, createBrowserRouter } from 'react-router-dom';
// import { useAuthStore } from '@/stores/authStore';
// import Layout from '@/components/Layout';
// import HomePage from '@/pages/Home';
// import EventDetailPage from '@/pages/EventDetail';
// import CreateEventPage from '@/pages/CreateEvent';
// import DashboardPage from '@/pages/Dashboard';
// import LoginPage from '@/pages/Login';
// import ProfilePage from '@/pages/Profile';
// import NotFoundPage from '@/pages/NotFound';

// // 路由配置
// const router = createBrowserRouter([
//   {
//     path: '/',
//     element: <Layout />,
//     errorElement: <NotFoundPage />,
//     children: [
//       { index: true, element: <HomePage /> },
//       { path: 'events/:id', element: <EventDetailPage /> },
//       {
//         path: 'create-event',
//         element: (
//           <PrivateRoute roles={['organizer']}>
//             <CreateEventPage />
//           </PrivateRoute>
//         )
//       },
//       {
//         path: 'dashboard',
//         element: (
//           <PrivateRoute roles={['admin', 'organizer']}>
//             <DashboardPage />
//           </PrivateRoute>
//         )
//       },
//       {
//         path: 'profile',
//         element: (
//           <PrivateRoute>
//             <ProfilePage />
//           </PrivateRoute>
//         )
//       }
//     ]
//   },
//   {
//     path: '/login',
//     element: <LoginPage />
//   }
// ]);

// // 权限路由组件
// function PrivateRoute({ children, roles = [] }) {
//   const { user, isLoading } = useAuthStore();
//   const location = useLocation();

//   if (isLoading) {
//     return <Spin fullscreen tip="权限校验中..." />;
//   }

//   if (!user) {
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   if (roles.length > 0 && !roles.includes(user.role)) {
//     return <Navigate to="/" replace />;
//   }

//   return children;
// }

// // 主应用组件
// function App() {
//   const { checkAuth } = useAuthStore();

//   // 初始化时检查登录状态
//   useEffect(() => {
//     checkAuth();
//   }, []);

//   return (
//     <ConfigProvider
//       theme={{
//         token: {
//           colorPrimary: '#1890ff',
//           borderRadius: 4,
//         },
//         components: {
//           Layout: {
//             headerBg: '#001529',
//             headerColor: '#fff',
//           },
//           Button: {
//             defaultHoverBorderColor: '#1890ff',
//           }
//         }
//       }}
//     >
//       <RouterProvider router={router} />
//     </ConfigProvider>
//   );
// }

// export default App;