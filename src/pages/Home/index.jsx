// import { Card, List, Skeleton, Tag } from 'antd'
// import { useEventStore } from '@/stores/eventStore'
// import dayjs from 'dayjs'

// export default function HomePage() {
//   const { events, loading, fetchEvents } = useEventStore()

//   useEffect(() => {
//     fetchEvents()
//   }, [])

//   return (
//     <div className="page-container">
//       <List
//         grid={{ gutter: 16, column: 3 }}
//         dataSource={events}
//         renderItem={item => (
//           <List.Item>
//             <Card
//               title={item.title}
//               extra={<Tag color={item.status === 'open' ? 'green' : 'red'}>
//                 {item.status}
//               </Tag>}
//               actions={[
//                 <Link to={`/events/${item.id}`}>查看详情</Link>,
//                 item.status === 'open' && <Button type="link">立即报名</Button>
//               ]}
//             >
//               <p>时间：{dayjs(item.startTime).format('YYYY-MM-DD HH:mm')}</p>
//               <p>地点：{item.location}</p>
//               <Progress 
//                 percent={(item.registered / item.capacity) * 100}
//                 status={item.registered >= item.capacity ? 'exception' : 'normal'}
//               />
//             </Card>
//           </List.Item>
//         )}
//       />
//     </div>
//   )
// }


// my version1 OKOKOK
// import { Card, List, Skeleton } from 'antd'
// import { useEventStore } from '@/stores/eventStore'
// import EventCard from '@/components/EventCard'

// export default function HomePage() {
//   const { events, loading } = useEventStore()

//   return (
//     <div className="home-container">
//       <List
//         grid={{ gutter: 16, column: 3 }}
//         dataSource={events}
//         loading={loading}
//         renderItem={item => (
//           <List.Item>
//             <EventCard 
//               id={item.id}
//               title={item.title}
//               date={item.startTime}
//               location={item.location}
//               status={item.status}
//               registered={item.registered}
//               capacity={item.capacity}
//             />
//           </List.Item>
//         )}
//       />
//     </div>
//   )
// }

import { List, Button } from 'antd';
import EventCard from '@/components/EventCard';
import { Link } from 'react-router-dom';

export default function HomePage() {
  // 完全使用前端模拟数据
  const displayEvents = [
    {
      id: 'example-id1',
      title: '校园开放日',
      description: '欢迎新生参观校园',
      startTime: '2025-10-01T10:00:00',
      endTime: '2025-10-01T12:00:00',
      registerstartTime: '2025-09-01T10:00:00',
      registerendTime: '2025-09-30T12:00:00',
      location: '学校主广场',
      status: 'published',
      capacity: 100,
      department: 'UG',
      role: 'student'
     
    },
    {
      id: 'example-id2',
      title: '编程工作坊',
      description: '学习基础编程技能',
      startTime: '2025-10-02T14:00:00',
      endTime: '2025-10-02T16:00:00',
      registerstartTime: '2025-09-15T10:00:00',
      registerendTime: '2025-10-01T12:00:00',
      location: '计算机实验室',
      status: 'published',
      capacity: 30,
      department: 'CS',
      role: 'student'
  
      
    },
    {
      id: 'example-id3',
      title: '艺术展览',
      description: '学生艺术作品展示',
      startTime: '2025-10-03T09:00:00',
      endTime: '2025-10-05T17:00:00',
      registerstartTime: '2025-09-10T10:00:00',
      registerendTime: '2025-10-02T12:00:00',
      location: '艺术楼展厅',
      status: 'published',
      capacity: 200,
      department: 'ART',
      role: 'student',
      coverImage: 'https://example.com/art-exhibition.jpg',
      
    }
  ];

  
    return (
      <div style={{ 
        marginLeft: 160,
        padding: '24px',
        maxWidth: '800px' // 限制最大宽度让卡片更紧凑
      }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <Button type="primary" onClick={() => {}}>登录/注册</Button>
        <Button type="default" onClick={() => {}}>退出登录</Button>
    </div> 
        <List
          dataSource={displayEvents}
          renderItem={(item) => (
            <List.Item style={{ marginBottom: 16 }}> {/* 添加底部间距 */}
              <EventCard 
                id={item.id}
                title={item.title}
                startdate={item.startTime}
                enddate={item.endTime}
                department={item.department}
                role={item.role}
                status={item.status}
                registered={item.registered}
                capacity={item.capacity}
              />
            </List.Item>
          )}
        />
  
      </div>
    );
  }


//NEWNEWNEW
// import { Card, List, Skeleton } from 'antd'
// import { useEventStore } from '@/stores/eventStore'
// import EventCard from '@/components/EventCard'

// export default function HomePage() {
//   const { events, loading } = useEventStore()

//   return (
//     <div className="home-container" style={{ 
//       padding: 24, 
//       minHeight: 'calc(100vh - 48px)', // 动态计算高度
//       background: '#fff'
//     }}>
//       <List
//         grid={{ 
//           gutter: 24, 
//           xs: 1,   // 手机端1列
//           sm: 2,   // 平板2列
//           md: 3,   // 桌面3列
//           lg: 3,
//           xl: 4,
//           xxl: 4
//         }}
//         dataSource={events}
//         loading={loading}
//         pagination={{ // 添加分页控制
//           pageSize: 12,
//           showSizeChanger: false
//         }}
//         renderItem={item => (
//           <List.Item style={{ padding: '0 !important' }}> {/* 移除内边距 */}
//             <EventCard 
//               id={item.id}
//               title={item.title}
//               date={item.startTime}
//               location={item.location}
//               status={item.status}
//               registered={item.registered}
//               capacity={item.capacity}
//             />
//           </List.Item>
//         )}
//       />
//     </div>
//   )
// }



// import { useState } from 'react';
// import { Layout, Menu } from 'antd';
// import { 
//   UserOutlined, 
//   SettingOutlined, 
//   UnorderedListOutlined, 
//   BookOutlined 
// } from '@ant-design/icons';
// import { Link, Outlet, useLocation } from 'react-router-dom';
// import Header from '@/components/Layout/Header';

// const { Sider, Content } = Layout;

// export default function Home() {
//   const [collapsed, setCollapsed] = useState(false);
//   const location = useLocation();

//   // 侧边栏菜单项
//   const sideMenuItems = [
//     {
//       key: '/profile',
//       icon: <UserOutlined />,
//       label: <Link to="/profile">个人账号</Link>,
//     },
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
//     },
//   ];

//   return (
//     <Layout style={{ minHeight: '100vh' }}>
//       {/* 左侧边栏 */}
//       <Sider 
//         collapsible
//         collapsed={collapsed}
//         trigger={null} // 隐藏默认触发器
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
//         <Header 
//           collapsed={collapsed}
//           onCollapse={() => setCollapsed(!collapsed)} 
//         />

//         {/* 内容区 */}
//         <Content style={{ padding: '24px', background: '#fff' }}>
//           <Outlet /> {/* 动态渲染子路由 */}
//         </Content>
//       </Layout>
//     </Layout>
//   );
// }
