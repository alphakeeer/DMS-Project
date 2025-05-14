// import { createBrowserRouter } from 'react-router-dom'
// import Layout from '@/components/Layout'
// import HomePage from '@/pages/Home'
// import EventDetail from '@/pages/EventDetail'

// export const router = createBrowserRouter([
//   {
//     path: '/',
//     element: <Layout />,
//     children: [
//       { index: true, element: <HomePage /> },
//       { path: 'events/:id', element: <EventDetail /> },
//       { path: 'create', element: <div>创建活动页</div> }
//     ]
//   }
// ])





// import { createBrowserRouter } from 'react-router-dom'
// import Layout from '@/components/Layout'
// import HomePage from '@/pages/Home'
// import CreateEventPage from '@/pages/CreateEvent'
// import DashboardPage from '@/pages/Dashboard'

// export const router = createBrowserRouter([
//   {
//     path: '/',
//     element: <Layout />,
//     children: [
//       { index: true, element: <HomePage /> },
//       { path: 'create-event', element: (
//         <PrivateRoute roles={['admin']}>
//           <CreateEventPage />
//         </PrivateRoute>
//       )},
//       { path: 'events/:id', element: <EventDetailPage /> },
//       // 补充导入


//       // 在 children 数组中添加
//       { 
//         path: 'dashboard', 
//         element: <PrivateRoute roles={['admin', 'editor']}><DashboardPage /></PrivateRoute> 
//       },
//       { 
//         path: 'create-event', 
//         element: <CreateEventPage /> // 直接渲染组件，跳过 PrivateRoute
//       },
//       // { 
//       //   path: 'create-event', 
//       //   element: (
//       //     <PrivateRoute roles={['admin']}>
//       //       <CreateEventPage /> {/* 确认组件导入路径正确 */}
//       //     </PrivateRoute>
//       //   )
//       // }  
//       {
//         path: 'create-event',
//         element: <PrivateRoute><CreateEventPage /></PrivateRoute>,
//         errorElement: <ErrorPage /> // 自定义错误页面
//       }
//     ]
//   }
// ])


// import { createBrowserRouter } from 'react-router-dom'
// import Layout from '@/components/Layout'
// import HomePage from '@/pages/Home'
// import CreateEventPage from '@/pages/CreateEvent'
// import DashboardPage from '@/pages/Dashboard'
// import EventDetailPage from '@/pages/EventDetail' // 必须导入
// import PrivateRoute from '@/components/PrivateRoute' // 必须导入
// // import ErrorPage from '@/components/ErrorPage' // 自定义错误页

// export const router = createBrowserRouter([
//   {
//     path: '/',
//     element: <Layout />,
//     // errorElement: <ErrorPage />, // 错误边界提升到父级
//     children: [
//       { index: true, element: <HomePage /> },
      
//       // 唯一正确的 create-event 定义
//       { 
//         path: 'create-event',
//         element: (
//           <PrivateRoute roles={['admin']}>
//             <CreateEventPage />
//           </PrivateRoute>
//         )
//       },
      
//       // 数据看板路由
//       { 
//         path: 'dashboard',
//         element: (
//           <PrivateRoute roles={['admin', 'editor']}>
//             <DashboardPage />
//           </PrivateRoute>
//         )
//       },
      
//       // 活动详情页
//       { 
//         path: 'events/:id', 
//         element: <EventDetailPage /> 
//       }
//     ]
//   }
// ])



// import { createBrowserRouter } from 'react-router-dom';
// import Layout from '@/components/Layout';
// import HomePage from '@/pages/Home';
// import CreateEventPage from '@/pages/CreateEvent';
// import DashboardPage from '@/pages/Dashboard';
// import EventDetailPage from '@/pages/EventDetail';
// import PrivateRoute from '@/components/PrivateRoute';
// import ErrorPage from '@/components/ErrorPage';

// export const router = createBrowserRouter([
//   {
//     path: '/',
//     element: <Layout />,
//     errorElement: <ErrorPage />,
//     children: [
//       { index: true, element: <HomePage /> },
//       { 
//         path: 'create-event',
//         element: (
//           <PrivateRoute roles={['admin']}>
//             <CreateEventPage />
//           </PrivateRoute>
//         )
//       },
//       { 
//         path: 'dashboard',
//         element: (
//           <PrivateRoute roles={['admin', 'editor']}>
//             <DashboardPage />
//           </PrivateRoute>
//         )
//       },
//       { path: 'events/:id', element: <EventDetailPage /> }
//       // 在所有路由配置后添加兜底路由
// {
//   path: '*',
//   element: <Navigate to="/404" replace />
// }
//     ]
//   }
// ]);



// //OKOKOK
// import { createBrowserRouter, Navigate } from 'react-router-dom'
// import Layout from '@/components/Layout'
// import HomePage from '@/pages/Home'
// import CreateEventPage from '@/pages/CreateEvent'
// import DashboardPage from '@/pages/Dashboard'
// import EventDetailPage from '@/pages/EventDetail'
// import PrivateRoute from '@/components/PrivateRoute'
// import ErrorPage from '@/components/ErrorPage'
// import NotFoundPage from '@/pages/NotFound'  // 需要创建这个文件


// export const router = createBrowserRouter([
//   {
//     path: '/',
//     element: <Layout />,
//     errorElement: <ErrorPage />,
//     children: [
//       { index: true, element: <HomePage /> },
//       { 
//         path: 'create-event',
//         element: (
//           <PrivateRoute roles={['organizer']}>  // 根据项目需求调整角色
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
//       { path: 'events/:id', element: <EventDetailPage /> },
      
//       // 兜底路由（放在children最后）
//       { 
//         path: '*',
//         element: <NotFoundPage />  // 专用404页面
//       }
//     ]
//   },
//   // 登录页等独立路由
//   {
//     path: '/login',
//     element: <LoginPage />  // 需要补充导入
//   },
//   {
//     path: '/register',
//     element: <RegisterPage />  // 需要补充导入
//   },
//   {
//     path: '/profile',
//     element: <ProfilePage />  // 需要补充导入
//   }
// ])


import { Routes, Route } from 'react-router-dom';
import { PrivateRoute, OrganizerRoute } from '@/components/PrivateRoute';
import { PermissionNotice } from '@/components/PermissionNotice';


import ActivationPage from '@/pages/Activation' // 需要创建这个文件
import MyActivitiesPage from '@/pages/MyActivities';

import { lazy } from 'react';

const MyActivitiesPage = lazy(() => import('@/pages/MyActivities'));
export const router = () => (
  <Routes>
    {/* 组织者专属路由 */}
    <Route path="/events/create" element={
      <OrganizerRoute>
        <CreateEventPage />
      </OrganizerRoute>
    }/>
    <Route path="/events/edit" element={
      <OrganizerRoute>
        <CreateEventPage />
      </OrganizerRoute>
    }/>

    {/* 普通用户路由 */}
    <Route path="/events" element={
      <PrivateRoute>
        <EventListPage />
      </PrivateRoute>
    }/>

    {/* 权限提示页 */}
    <Route path="/no-permission" element={
      <PermissionNotice requiredLevel="organizer" />
    }/>

    {/* 激活页面 */}
    <Route path="/activate" element={<ActivationPage />} />
    {/* 我的活动 */}
    <Route
      path="/my-activities"
      element={
        <PrivateRoute>
          <Suspense fallback={<Spin fullscreen />}>
            <MyActivitiesPage />
          </Suspense>
        </PrivateRoute>
      }
    />
  </Routes>
);




// import React from 'react';
// import { Routes, Route } from 'react-router-dom';
// import Home from '@/pages/Home';
// import CreateEvent from '@/pages/CreateEvent';
// import Dashboard from '@/pages/Dashboard';
// import Login from '@/pages/Login';
// import Profile from '@/pages/Profile';

// const Router = () => (
//     <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/create-event" element={<CreateEvent />} />
//         <Route path="/dashboard" element={<Dashboard />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/profile" element={<Profile />} />
//     </Routes>
// );

// export default Router;