// OKOKOK

import { useState, useEffect } from 'react';
import { Layout } from 'antd';
import { 
  UserOutlined, 
  SettingOutlined, 
  UnorderedListOutlined, 
  BookOutlined 
} from '@ant-design/icons';

import { Menu, Dropdown, Avatar, Button } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { useLocation } from 'react-router-dom'


export default function Header() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const { Sider, Content } = Layout;
  const [collapsed, setCollapsed] = useState(false);

  // 侧边栏菜单项配置
  const sideMenuItems = [
    { key: 'home', icon: <UserOutlined />, label: <Link to="/">首页</Link> },
    { key: 'profile', icon: <SettingOutlined />, label: <Link to="/profile">个人中心</Link> },
    { key: 'my-activities', icon: <UnorderedListOutlined />, label: <Link to="/my-activities">我的活动</Link> },
    { 
      key: 'create', 
      icon: <BookOutlined />,
      label: <span onClick={() => {
        if (!user) navigate('/login', { state: { from: location.pathname } });
        else navigate('/create-event');
      }}>创建活动</span>
    },
    { key: 'edit-event', icon: <UnorderedListOutlined />, label: <Link to="/edit-event">活动修改</Link> },
    { key: 'dashboard', icon: <UnorderedListOutlined />, label: <Link to="/dashboard">数据看板</Link> }

    // { key: 'events', icon: <UnorderedListOutlined />, label: <Link to="/events:id">活动详情</Link> },

  ];
  const location = useLocation()
  
  // 动态计算选中项
  const getSelectedKeys = () => {
    const path = location.pathname
    if (path === '/') return ['home']
    if (path.includes('/create-event')) return ['create']
    if (path.includes('/dashboard')) return ['dashboard']
    return []
  }

  return (
        <div style={{ 
            marginLeft: 160,
            padding: '24px'
          }}>
    <div className="app-header">
      <div className="logo"> </div>
       {/* 固定侧边栏 */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={200}
        theme="light"
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 100,
          boxShadow: '2px 0 8px rgba(0, 0, 0, 0.1)'
        }}
      >
      <div className="logo" style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 18,
          fontWeight: 'bold',
          color: '#1890ff'
        }}>
          {collapsed ? 'EMS' : '活动管理系统'}
        </div>
        <div style={{ height: '100%', overflowY: 'auto' }}>
        <Menu 
        selectedKeys={getSelectedKeys()}
        theme="light" 
        mode="vertical" 
        items={sideMenuItems} 
      />
        </div>
      </Sider>
    </div>
    </div> 
  )
}



// import { useState } from 'react';
// import { Layout, Menu, Dropdown, Avatar } from 'antd';
// import { 
//   UserOutlined,
//   SettingOutlined,
//   UnorderedListOutlined,
//   BookOutlined,
//   MenuFoldOutlined,
//   MenuUnfoldOutlined 
// } from '@ant-design/icons';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { useAuthStore } from '@/stores/authStore';

// const { Header, Sider, Content } = Layout;

// export default function AppLayout({ children }) {
//   const [collapsed, setCollapsed] = useState(false);
//   const { user, logout } = useAuthStore();
//   const navigate = useNavigate();
//   const location = useLocation();

//   // 侧边栏菜单项
//   const sideMenuItems = [
//     {
//       key: 'home',
//       icon: <UserOutlined />,
//       label: <Link to="/">首页</Link>,
//     },
//     {
//       key: 'create',
//       icon: <BookOutlined />,
//       label: (
//         <span onClick={() => {
//           if (!user) {
//             navigate('/login', { state: { from: location.pathname } });
//           } else {
//             navigate('/create-event');
//           }
//         }}>
//           创建活动
//         </span>
//       ),
//     },
//     {
//       key: 'dashboard',
//       icon: <UnorderedListOutlined />,
//       label: <Link to="/dashboard">数据看板</Link>,
//     },
//     {
//       key: 'profile',
//       icon: <SettingOutlined />,
//       label: <Link to="/profile">个人中心</Link>,
//     }
//   ];

//   // 用户下拉菜单
//   const userMenu = (
//     <Menu
//       items={[
//         { key: 'profile', label: <Link to="/profile">个人中心</Link> },
//         { type: 'divider' },
//         { key: 'logout', label: '退出登录', onClick: logout }
//       ]}
//     />
//   );

//   return (
//     <Layout style={{ minHeight: '100vh' }}>
//       {/* 左侧固定侧边栏 */}
//       <Sider
//         collapsible
//         collapsed={collapsed}
//         trigger={null}
//         width={200}
//         theme="light"
//         style={{
//           position: 'fixed',
//           left: 0,
//           top: 0,
//           bottom: 0,
//           zIndex: 100,
//           boxShadow: '2px 0 8px rgba(0, 0, 0, 0.1)'
//         }}
//       >
//         <div className="logo" style={{
//           height: 64,
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           fontSize: 18,
//           fontWeight: 'bold',
//           color: '#1890ff'
//         }}>
//           {collapsed ? 'EMS' : '活动管理系统'}
//         </div>
//         <Menu
//           theme="light"
//           mode="inline"
//           selectedKeys={[location.pathname.split('/')[1] || 'home']}
//           items={sideMenuItems}
//         />
//       </Sider>

//       {/* 右侧主内容区 */}
//       <Layout 
//         style={{ 
//           marginLeft: collapsed ? 80 : 200,
//           transition: 'margin 0.2s cubic-bezier(0.2, 0, 0, 1)',
//           minHeight: '100vh'
//         }}
//       >
//         {/* 顶部导航栏 */}
//         <Header style={{
//           background: '#fff',
//           padding: '0 24px',
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//           position: 'sticky',
//           top: 0,
//           zIndex: 90,
//           boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
//         }}>
//           <div>
//             {collapsed ? (
//               <MenuUnfoldOutlined 
//                 onClick={() => setCollapsed(!collapsed)}
//                 style={{ fontSize: 18 }}
//               />
//             ) : (
//               <MenuFoldOutlined 
//                 onClick={() => setCollapsed(!collapsed)}
//                 style={{ fontSize: 18 }}
//               />
//             )}
//           </div>

//           <div style={{ display: 'flex', alignItems: 'center' }}>
//             {user ? (
//               <Dropdown overlay={userMenu} trigger={['click']}>
//                 <div style={{ cursor: 'pointer' }}>
//                   <Avatar 
//                     src={user.avatar} 
//                     style={{ marginRight: 8, backgroundColor: '#1890ff' }}
//                   >
//                     {user.name?.[0]}
//                   </Avatar>
//                   <span style={{ fontWeight: 500 }}>{user.name}</span>
//                 </div>
//               </Dropdown>
//             ) : (
//               <Link to="/login">登录/注册</Link>
//             )}
//           </div>
//         </Header>

//         {/* 页面内容容器 */}
//         <Content
//           style={{
//             padding: 24,
//             minHeight: 'calc(100vh - 64px)',
//             overflowY: 'auto'
//           }}
//         >
//           <div
//             style={{
//               maxWidth: 1200,
//               margin: '0 auto',
//               padding: 24,
//               background: '#fff',
//               borderRadius: 8,
//               boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
//             }}
//           >
//             {children}
//           </div>
//         </Content>
//       </Layout>
//     </Layout>
//   );
// }










// import { useState } from 'react';
// import { Layout } from 'antd';
// import { 
//   UserOutlined, 
//   SettingOutlined, 
//   UnorderedListOutlined, 
//   BookOutlined 
// } from '@ant-design/icons';
// import { Link, Outlet, useLocation } from 'react-router-dom';
// // import Header from '@/components/Layout/Header';
// import { Menu, Dropdown, Avatar } from 'antd';
// import { useNavigate } from 'react-router-dom';
// import { useAuthStore } from '@/stores/authStore';

// export default function Header({ onCollapse, collapsed }) {
//   const { user, logout } = useAuthStore();
//   const navigate = useNavigate();

//   const userMenu = (
//     <Menu
//       items={[
//         { key: 'profile', label: <Link to="/profile">个人中心</Link> },
//         { type: 'divider' },
//         { key: 'logout', label: '退出登录', onClick: logout }
//       ]}
//     />
//   );

// //   const menuItems = [
// //     { key: 'home', label: <Link to="/">首页</Link> },
// //     { key: 'create', label: <Link to="/create-event">创建活动</Link> },
// //     { key: 'dashboard', label: <Link to="/dashboard">数据看板</Link> },

// //   ]

//   // 侧边栏菜单项
//   const sideMenuItems = [
//     {
//       key: 'home',
//       icon: <UserOutlined />,
//       label: <Link to="/">首页</Link>,
//     },
//     {
//       key: '/create',
//       icon: <SettingOutlined />,
//       label: <Link to="/create-event">创建活动</Link>,
//     },
//     {
//       key: '/all-activities',
//       icon: <UnorderedListOutlined />,
//       label: <Link to="/all-activities">全部活动</Link>,
//     },
//     {
//       key: '/my-activities',
//       icon: <BookOutlined />,
//       label: <Link to="/my-activities">我的活动</Link>,
//     },
//   ];

//   return (
//     <div className="app-header" style={{ display: 'flex', alignItems: 'center' }}>
//       {/* 添加侧边栏折叠按钮 */}
//       <div 
//         style={{ fontSize: '18px', padding: '0 16px', cursor: 'pointer' }}
//         onClick={onCollapse}
//       >
//         {collapsed ? '☰' : '✕'}
//       </div>
//       
//      {/*  <div className="logo" style={{ marginRight: '24px' }}>EventMgr</div>
//       
//       <div className="user-panel" style={{ marginLeft: 'auto' }}>
//         {user ? (
//           <Dropdown overlay={userMenu} trigger={['click']}>
//             <div className="user-info" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
//               <Avatar src={user.avatar} style={{ marginRight: 8 }}/>
//               <span className="username">{user.name}</span>
//             </div>
//           </Dropdown>
//         ) : (
//           <Link to="/login">登录/注册</Link>
//         )}
//       </div> */}
//     </div>
//   );
// }





// // import { useState } from 'react';
// // import { Layout, Menu } from 'antd';
// // import { 
// //   UserOutlined, 
// //   SettingOutlined, 
// //   UnorderedListOutlined, 
// //   BookOutlined 
// // } from '@ant-design/icons';
// // import { Link, Outlet, useLocation } from 'react-router-dom';
// // import Header from '@/components/Layout/Header';

// // const { Sider, Content } = Layout;

// // export default function Home() {
// //   const [collapsed, setCollapsed] = useState(false);
// //   const location = useLocation();



// //   return (
// //     <Layout style={{ minHeight: '100vh' }}>
// //       {/* 左侧边栏 */}
// //       <Sider 
// //         collapsible
// //         collapsed={collapsed}
// //         trigger={null} // 隐藏默认触发器
// //         width={200}
// //         theme="light"
// //       >
// //         <Menu
// //           selectedKeys={[location.pathname]}
// //           items={sideMenuItems}
// //           mode="inline"
// //           theme="light"
// //         />
// //       </Sider>

// //       {/* 右侧布局 */}
// //       <Layout>
// //         {/* 顶部Header */}
// //         <Header 
// //           collapsed={collapsed}
// //           onCollapse={() => setCollapsed(!collapsed)} 
// //         />

// //         {/* 内容区 */}
// //         <Content style={{ padding: '24px', background: '#fff' }}>
// //           <Outlet /> {/* 动态渲染子路由 */}
// //         </Content>
// //       </Layout>
// //     </Layout>
// //   );
// // }


// src/components/GlobalLayout/index.jsx


// //酱酱版本
// import { useState } from 'react';
// import { Layout, Menu, Dropdown, Avatar } from 'antd';
// import { 
//   UserOutlined, 
//   SettingOutlined, 
//   UnorderedListOutlined, 
//   BookOutlined 
// } from '@ant-design/icons';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { useAuthStore } from '@/stores/authStore';

// const { Header: AntHeader, Sider, Content } = Layout;

// export default function Header({ children }) {
//   const [collapsed, setCollapsed] = useState(false);
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { user, logout } = useAuthStore();

//   // 点击创建活动的处理函数
//   const handleCreateEventClick = () => {
//     if (!user) {
//       // 如果用户未登录，跳转到登录页面
//       navigate('/login'); // 假设登录页面的路径为 "/login"
//     } else {
//       // 如果用户已登录，正常导航到创建活动页面
//       navigate('/create-events');
//     }
//   };

//   // 侧边栏菜单项
//   const sideMenuItems = [
//     {
//       key: '/profile',
//       icon: <UserOutlined />,
//       label: <Link to="/profile">个人账号</Link>,
//     },
//     {
//         key: 'create',
//         icon: <BookOutlined />,
//         label: <span onClick={handleCreateEventClick}>创建活动</span>, // 修改为 span 并添加点击事件
//   // <Link to="/create-events">创建活动</Link>,
//       },
//     {
//       key: '/settings',
//       icon: <SettingOutlined />,
//       label: <Link to="/settings">修改信息</Link>,
//     },
//     {
//       key: '/all-activities',
//       icon: <UnorderedListOutlined />,
//       label: <Link to="/all-activities">全部活动</Link>,
//     },
//     {
//       key: '/my-activities',
//       icon: <BookOutlined />,
//       label: <Link to="/my-activities">我的活动</Link>,
//     }
//   ];

//   // 用户下拉菜单
//   const userMenu = (
//     <Menu
//       items={[
//         { key: 'profile', label: <Link to="/profile">个人中心</Link> },
//         { type: 'divider' },
//         { key: 'logout', label: '退出登录', onClick: logout }
//       ]}
//     />
//   );

//   return (
//     <Layout style={{ minHeight: '100vh' }}>
//       {/* 左侧边栏 */}
//       <Sider 
//         collapsible
//         collapsed={collapsed}
//         trigger={null}
//         width={200}
//         theme="light"
//       >
//         <Menu
//           selectedKeys={[location.pathname]}
//           items={sideMenuItems}
//           mode="inline"
//           theme="light"
//         />
//       </Sider>

//       {/* 右侧布局 */}
//       <Layout>
//         {/* 顶部Header */}
//         <AntHeader style={{ 
//           padding: 0,
//           background: '#fff',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'space-between'
//         }}>
//            <div 
//             style={{ 
//               fontSize: '18px', 
//               padding: '0 16px', 
//               cursor: 'pointer',
//               height: '100%',
//               display: 'flex',
//               alignItems: 'center'
//             }}
//             onClick={() => setCollapsed(!collapsed)}
//           >
//             {collapsed ? '☰' : '✕'}
//           </div>
//           
//           <div style={{ paddingRight: '16px' }}>
//             <Dropdown overlay={userMenu} placement="bottomRight">
//               <div style={{ cursor: 'pointer' }}>
//                 <Avatar 
//                   style={{ backgroundColor: '#1890ff' }} 
//                   icon={<UserOutlined />} 
//                 />
//                 <span style={{ marginLeft: 8 }}>
//                   {user?.name || '用户'}
//                 </span>
//               </div>
//             </Dropdown>
//           </div>
//         </AntHeader>

//         {/* 内容区 */}
//         <Content style={{ 
//           padding: '24px', 
//           background: '#fff',
//           minHeight: 'calc(100vh - 64px)' // 减去Header高度
//         }}>
//           {children}
//         </Content>
//       </Layout>
//     </Layout>

//   );
// }




// //GPT v1v1
// import { useState } from 'react';
// import { Layout, Menu } from 'antd';
// import { 
//   UserOutlined, 
//   SettingOutlined, 
//   UnorderedListOutlined, 
//   BookOutlined 
// } from '@ant-design/icons';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { useAuthStore } from '@/stores/authStore';

// const { Sider, Content } = Layout;

// export default function Header({ children }) {
//   const [collapsed, setCollapsed] = useState(false);
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { user, logout } = useAuthStore();

//   // 点击创建活动的处理函数
//   const handleCreateEventClick = () => {
//     if (!user) {
//       // 如果用户未登录，跳转到登录页面，并记录当前路径
//       navigate('/login', { state: { from: location.pathname } });
//     } else {
//       // 如果用户已登录，正常导航到创建活动页面
//       navigate('/create-event');
//     }
//   };

//   // 侧边栏菜单项
//   const sideMenuItems = [
//     {
//       key: 'home',
//       icon: <UserOutlined />,
//       label: <Link to="/">首页</Link>,
//     },
//     {
//       key: 'create',
//       icon: <BookOutlined />,
//       label: <span onClick={handleCreateEventClick}>创建活动</span>, // 使用点击事件处理
//     },
//     {
//       key: 'dashboard',
//       icon: <UnorderedListOutlined />,
//       label: <Link to="/dashboard">数据看板</Link>,
//     },
//     {
//       key: 'events',
//       icon: <UnorderedListOutlined />,
//       label: <Link to="events/:id">活动详情</Link>,
//     },
//     {
//       key: 'settings',
//       icon: <SettingOutlined />,
//       label: <Link to="/settings">修改信息</Link>,
//     },
//   ];

  // // 动态计算选中项
  // const getSelectedKeys = () => {
  //   const path = location.pathname;
  //   if (path === '/') return ['home'];
  //   if (path.includes('/create-event')) return ['create'];
  //   if (path.includes('/dashboard')) return ['dashboard'];
  //   if (path.includes('/settings')) return ['settings'];
  //   return [];
  // };

//   return (
//     <Layout style={{ minHeight: '100vh' }}>
//       {/* 左侧边栏 */}
//       <Sider 
//         collapsible
//         collapsed={collapsed}
//         trigger={null}
//         width={200}
//         theme="light"
//       >
//         <Menu
//           selectedKeys={getSelectedKeys()}
//           mode="inline"
//           theme="light"
//           items={sideMenuItems}
//         />
//       </Sider>

//       {/* 内容区 */}
//       <Layout>
//         <Content style={{ 
//           padding: '24px', 
//           background: '#fff',
//           minHeight: 'calc(100vh - 64px)' // 确保内容区域适应
//         }}>
//           {children}
//         </Content>
//       </Layout>
//     </Layout>
//   );
// }


// // //Deepseek v2v2
// import { useState } from 'react';
// import { Layout, Menu } from 'antd';
// import { 
//   UserOutlined, 
//   SettingOutlined, 
//   UnorderedListOutlined, 
//   BookOutlined 
// } from '@ant-design/icons';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { useAuthStore } from '@/stores/authStore';

// const { Sider, Content } = Layout;

// export default function Header({ children }) {
//   const [collapsed, setCollapsed] = useState(false);
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { user, logout } = useAuthStore();

//   // 点击创建活动的处理函数（保持不变）
//   const handleCreateEventClick = () => {
//     if (!user) {
//       navigate('/login', { state: { from: location.pathname } });
//     } else {
//       navigate('/create-event');
//     }
//   };

//   // 侧边栏菜单项
//   const sideMenuItems = [
//     {
//       key: 'home',
//       icon: <UserOutlined />,
//       label: <Link to="/">首页</Link>,
//     },
//     {
//       key: 'create',
//       icon: <BookOutlined />,
//       label: <span onClick={handleCreateEventClick}>创建活动</span>, // 使用点击事件处理
//     },
//     {
//       key: 'dashboard',
//       icon: <UnorderedListOutlined />,
//       label: <Link to="/dashboard">数据看板</Link>,
//     },
//     {
//       key: 'events',
//       icon: <UnorderedListOutlined />,
//       label: <Link to="events/:id">活动详情</Link>,
//     },
//     {
//       key: 'settings',
//       icon: <SettingOutlined />,
//       label: <Link to="/settings">修改信息</Link>,
//     },
//   ];

//   // 动态计算选中项（保持不变）
//   const getSelectedKeys = () => {
//     const path = location.pathname;
//     if (path === '/') return ['home'];
//     if (path.includes('/create-event')) return ['create'];
//     if (path.includes('/dashboard')) return ['dashboard'];
//     if (path.includes('/settings')) return ['settings'];
//     return [];
//   };

//   // return (
//   //   <Layout style={{ 
//   //     minHeight: '100vh',
//   //     // 新增关键样式 ↓↓↓
//   //     display: 'flex',
//   //     flexDirection: 'row' 
//   //   }}>
//   //     {/* 左侧边栏 */}
//   //     <Sider 
//   //       collapsible
//   //       collapsed={collapsed}
//   //       onCollapse={(value) => setCollapsed(value)}
//   //       width={200}
//   //       theme="light"
//   //       style={{
//   //         height: '100vh',
//   //         position: 'sticky',
//   //         top: 0,
//   //         left: 0,
//   //         overflow: 'auto'
//   //       }}
//   //     >
//   //       <Menu
//   //         selectedKeys={getSelectedKeys()}
//   //         mode="inline"
//   //         theme="light"
//   //         items={sideMenuItems}
//   //         style={{ height: '100%' }}
//   //       />
//   //     </Sider>

//   //     {/* 内容区 */}
//   //     <Content 
//   //       style={{ 
//   //         flex: 1,
//   //         padding: '24px',
//   //         background: '#fff',
//   //         overflowY: 'auto',  // 内容过长时内部滚动
//   //         minHeight: '100vh'   // 确保内容区高度撑满
//   //       }}
//   //     >
//   //       {children}
//   //     </Content>
//   //   </Layout>
//   // );
//   return (
//     <Layout style={{ 
//       minHeight: '100vh',
//       // 新增关键样式 ↓↓↓
//       position: 'relative'
//     }}>
//       {/* 固定侧边栏 */}
//       <Sider 
//         collapsible
//         collapsed={collapsed}
//         onCollapse={setCollapsed}
//         width={200}
//         theme="light"
//         style={{
//           height: '100vh',
//           position: 'fixed',
//           left: 0,
//           top: 0,
//           zIndex: 100,
//           boxShadow: '2px 0 8px rgba(0, 0, 0, 0.1)'
//         }}
//       >
//         <Menu
//           selectedKeys={getSelectedKeys()}
//           mode="inline"
//           theme="light"
//           items={sideMenuItems}
//           style={{ height: '100%' }}
//         />
//       </Sider>

//       {/* 自适应内容区 */}
//       <Content 
//         style={{ 
//           marginLeft: collapsed ? 80 : 200,  // 动态边距
//           transition: 'margin 0.2s',
//           minHeight: '100vh',
//           padding: '24px',
//           background: '#fff'
//         }}
//       >
//         {children}
//       </Content>
//     </Layout>
//   );

// }


// //DS v3
// import { useState, useEffect } from 'react';
// import { Layout, Menu } from 'antd';
// import { 
//   UserOutlined, 
//   SettingOutlined, 
//   UnorderedListOutlined, 
//   BookOutlined 
// } from '@ant-design/icons';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { useAuthStore } from '@/stores/authStore';

// const { Sider, Content } = Layout;

// export default function AppLayout({ children }) {
//   const [collapsed, setCollapsed] = useState(false);
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { user } = useAuthStore();

//   // 路由切换时自动滚动到顶部
//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, [location.pathname]);

//   // 侧边栏菜单项配置
//   const sideMenuItems = [
//     { key: 'home', icon: <UserOutlined />, label: <Link to="/">首页</Link> },
//     { 
//       key: 'create', 
//       icon: <BookOutlined />,
//       label: <span onClick={() => {
//         if (!user) navigate('/login', { state: { from: location.pathname } });
//         else navigate('/create-event');
//       }}>创建活动</span>
//     },
//     { key: 'dashboard', icon: <UnorderedListOutlined />, label: <Link to="/dashboard">数据看板</Link> },
//     { key: 'settings', icon: <SettingOutlined />, label: <Link to="/settings">修改信息</Link> }
//   ];

//   return (
//     <Layout style={{ 
//       minHeight: '100vh',
//       display: 'flex',
//       background: '#fff'
//     }}>
//       {/* 固定侧边栏 */}
//       <Sider
//         collapsible
//         collapsed={collapsed}
//         onCollapse={setCollapsed}
//         width={200}
//         theme="light"
//         style={{
//           position: 'fixed',
//           left: 0,
//           top: 0,
//           bottom: 0,
//           zIndex: 100,
//           boxShadow: '2px 0 8px rgba(0, 0, 0, 0.1)'
//         }}
//       >
//         <div style={{ height: '100%', overflowY: 'auto' }}>
//           <Menu
//             selectedKeys={[location.pathname.slice(1) || 'home']}
//             mode="inline"
//             theme="light"
//             items={sideMenuItems}
//           />
//         </div>
//       </Sider>

//       {/* 动态内容区 */}
//       <Content
//         style={{
//           marginLeft: collapsed ? 80 : 200,
//           transition: 'margin 0.2s cubic-bezier(0.2, 0, 0, 1)',
//           minHeight: '100vh',
//           padding: 24,
//           background: '#fff'
//         }}
//       >
//         <div style={{ 
//           maxWidth: 1200, 
//           margin: '0 auto',
//           minHeight: 'calc(100vh - 48px)' // 减去上下padding
//         }}>
//           {children}
//         </div>
//       </Content>
//     </Layout>
//   );
// }



// GPTv4
// import { useState, useEffect } from 'react';
// import { Layout, Menu } from 'antd';
// import { 
//   UserOutlined, 
//   SettingOutlined, 
//   UnorderedListOutlined, 
//   BookOutlined 
// } from '@ant-design/icons';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { useAuthStore } from '@/stores/authStore';

// const { Sider, Content } = Layout;

// export default function AppLayout({ children }) {
//   const [collapsed, setCollapsed] = useState(false);
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { user } = useAuthStore();

//   // 路由切换时自动滚动到顶部
//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, [location.pathname]);

//   // 侧边栏菜单项配置
//   const sideMenuItems = [
//     { key: 'home', icon: <UserOutlined />, label: <Link to="/">首页</Link> },
//     { 
//       key: 'create', 
//       icon: <BookOutlined />,
//       label: <span onClick={() => {
//         if (!user) navigate('/login', { state: { from: location.pathname } });
//         else navigate('/create-event');
//       }}>创建活动</span>
//     },
//     { key: 'dashboard', icon: <UnorderedListOutlined />, label: <Link to="/dashboard">数据看板</Link> },
//     { key: 'profile', icon: <SettingOutlined />, label: <Link to="/profile">个人信息</Link> },
//     { key: 'events', icon: <UnorderedListOutlined />, label: <Link to="/events:id">活动详情</Link> }
//   ];

//   return (
//     <Layout style={{ 
//       minHeight: '100vh',
//       display: 'flex',
//       background: '#fff'
//     }}>
//       {/* 固定侧边栏 */}
//       <Sider
//         collapsible
//         collapsed={collapsed}
//         onCollapse={setCollapsed}
//         width={200}
//         theme="light"
//         style={{
//           position: 'fixed',
//           left: 0,
//           top: 0,
//           bottom: 0,
//           zIndex: 100,
//           boxShadow: '2px 0 8px rgba(0, 0, 0, 0.1)'
//         }}
//       >
//         <div style={{ height: '100%', overflowY: 'auto' }}>
//           <Menu
//             selectedKeys={[location.pathname.slice(1) || 'home']}
//             mode="inline"
//             theme="light"
//             items={sideMenuItems}
//           />
//         </div>
//       </Sider>
// {/* 动态内容区 */}
// <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'margin 0.2s cubic-bezier(0.2, 0, 0, 1)' }}>
//   <Content
//     style={{
//       minHeight: '100vh', // 确保内容区的最小高度与视口高度一致
//       padding: 24, // 添加内边距
//       background: '#fff', // 背景颜色
//       position: 'relative', // 相对定位
//       zIndex: 1 // 确保内容在侧边栏之上
//     }}
//   >
//     <div style={{ 
//       maxWidth: 1200, // 设置最大宽度
//       margin: '0 auto', // 居中对齐
//       minHeight: 'calc(100vh - 48px)', // 确保内容区的最小高度
//     }}>
//       {children}
//     </div>
//   </Content>
// </Layout>
//       {/* 动态内容区 */}
//       {/* <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'margin 0.2s cubic-bezier(0.2, 0, 0, 1)' }}>
//         <Content
//           style={{
//             minHeight: '100vh',
//             padding: 24,
//             background: '#fff',
//             position: 'relative', // 添加相对定位
//             zIndex: 1 // 确保内容在侧边栏之上
//           }}
//         >
//           <div style={{ 
//             maxWidth: 1200, 
//             margin: '0 auto',
//             minHeight: 'calc(100vh - 48px)' // 减去上下padding
//           }}>
//             {children}
//           </div>
//         </Content>
//       </Layout> */}
//     </Layout>
//   );
// }