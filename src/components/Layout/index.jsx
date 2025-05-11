// import { Layout, Menu } from 'antd'
// import { Link, Outlet } from 'react-router-dom'

// const { Header, Content } = Layout

// export default function AppLayout() {
//   return (
//     <Layout className="app-layout">
//       <Header>
//         <div className="logo" />
//         <Menu theme="dark" mode="horizontal">
//           <Menu.Item key="home">
//             <Link to="/">活动列表</Link>
//           </Menu.Item>
//           <Menu.Item key="create">
//             <Link to="/create-event">创建活动</Link>
//           </Menu.Item>
//         </Menu>
//       </Header>
      
//       <Content style={{ padding: '24px 50px' }}>
//         <div className="site-layout-content">
//           <Outlet />
//         </div>
//       </Content>
//     </Layout>
//   )
// }



// import { Layout, Spin } from 'antd'
// import { Outlet } from 'react-router-dom'
// import Header from './Header'
// import { useAuthStore } from '@/stores/authStore'

// const { Content, Footer } = Layout

// export default function AppLayout() {
//   const { loading } = useAuthStore()

//   return (
//     <Layout className="app-layout">
//       <Header />
      
//       <Content className="main-content">
//         {loading ? (
//           <div className="loading-overlay">
//             <Spin size="large" tip="加载中..." />
//           </div>
//         ) : (
//           <Outlet />
//         )}
//       </Content>

//       <Footer className="app-footer">
//         © {new Date().getFullYear()} 活动管理系统 - 技术支持
//       </Footer>
//     </Layout>
//   )
// }

import { Layout } from 'antd'
import Header from './Header'
import { Outlet } from 'react-router-dom'

const { Content, Footer } = Layout

export default function AppLayout() {
  return (
    <Layout className="app-layout">
      <Header />
      <Content style={{ padding: '0 50px', marginTop: 64 }}>
        <div className="content-container">
          <Outlet />
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        活动管理系统 ©{new Date().getFullYear()} Created by Your Team
      </Footer>
    </Layout>
  )
}