// import { Tabs, Descriptions, Table } from 'antd'
// import { useParams } from 'react-router-dom'

// const EventDetailPage = () => {
//   const { id } = useParams()
//   const { currentEvent, fetchEvent } = useEventStore()

//   useEffect(() => {
//     fetchEvent(id)
//   }, [id])

//   return (
//     <div className="detail-container">
//       <h1>{currentEvent?.title}</h1>
      
//       <Tabs defaultActiveKey="1">
//         <Tabs.TabPane tab="基本信息" key="1">
//           <Descriptions bordered column={2}>
//             <Descriptions.Item label="开始时间">
//               {dayjs(currentEvent?.startTime).format('YYYY-MM-DD HH:mm')}
//             </Descriptions.Item>
//             <Descriptions.Item label="地点">
//               {currentEvent?.location}
//             </Descriptions.Item>
//             <Descriptions.Item label="已报名人数">
//               {currentEvent?.registered}/{currentEvent?.capacity}
//             </Descriptions.Item>
//           </Descriptions>
//         </Tabs.TabPane>

//         <Tabs.TabPane tab="报名管理" key="2">
//           <RegistrationTable 
//             dataSource={currentEvent?.registrations || []}
//           />
//         </Tabs.TabPane>
//       </Tabs>
//     </div>
//   )
// }



// //OKOKOKOK
// import { useEffect } from 'react'
// import { useNavigate } from 'react-router-dom'; // 必须从 react-router-dom 导入

// import { Tabs, Descriptions, message } from 'antd'
// import { useParams } from 'react-router-dom'
// import { useEventStore } from '@/stores/eventStore'
// import RegistrationTable from '@/components/RegistrationTable'

// export default function EventDetailPage() {
//   const { id } = useParams()
//   const { currentEvent, fetchEvent } = useEventStore()

//   useEffect(() => {
//     fetchEvent(id).catch(() => message.error('加载活动详情失败'))
//   }, [id])

//   return (
//     <div className="event-detail">
//       <h1>{currentEvent?.title}</h1>
//       <Tabs defaultActiveKey="1">
//         <Tabs.TabPane tab="基本信息" key="1">
//           <Descriptions bordered column={2}>
//             <Descriptions.Item label="开始时间">
//               {currentEvent?.startTime}
//             </Descriptions.Item>
//             <Descriptions.Item label="地点">
//               {currentEvent?.location}
//             </Descriptions.Item>
//             <Descriptions.Item label="参与人数">
//               {currentEvent?.registered}/{currentEvent?.capacity}
//             </Descriptions.Item>
//             <Descriptions.Item label="状态">
//               <span className={`status-${currentEvent?.status}`}>
//                 {currentEvent?.status}
//               </span>
//             </Descriptions.Item>
//           </Descriptions>
//         </Tabs.TabPane>
//         <Tabs.TabPane tab="报名管理" key="2">
//           <RegistrationTable eventId={id} />
//         </Tabs.TabPane>
//       </Tabs>
//     </div>
//   )
// }


// import { useParams } from 'react-router-dom';
// import { useEventStore } from '@/stores/eventStore';

// export default function EventDetailPage() {
//   const { id } = useParams();
//   const { events } = useEventStore();
//   const event = events.find(e => e.id === id);

//   return (
//     <div className="event-detail">
//       <h1>{event.title}</h1>
//       <p>{event.description}</p>
//       <Button onClick={() => setShowSignup(true)}>立即报名</Button>
      
//       {/* 报名确认模态框 */}
//       <Modal
//         title="确认报名"
//         onOk={handleSignup}
//       >
//         <p>确认报名该活动吗？</p>
//       </Modal>
//     </div>
//   );
// };




// import { useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { Button, Modal, Spin, message } from 'antd';
// import { useEventStore } from '@/stores/eventStore';
// import { useAuthStore } from '@/stores/authStore';
// import FeedbackForm from '@/components/FeedbackForm';

// export default function EventDetailPage () {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { user } = useAuthStore();
//   const { events, signUpEvent, submitFeedback } = useEventStore();
//   const [showSignup, setShowSignup] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const event = events.find(e => e.id === id);

//   const handleSignup = async () => {
//     setLoading(true);
//     try {
//       await signUpEvent(id, user.id);
//       message.success('报名成功！');
//       navigate('/profile');
//     } catch (error) {
//       message.error('报名失败：' + error.message);
//     } finally {
//       setLoading(false);
//       setShowSignup(false);
//     }
//   };

//   if (!event) return <Spin tip="加载中..." />;

//   return (
//     <div className="event-detail">
//       <div className="event-header">
//         <h1>{event.title}</h1>
//         <Tag color={event.status === 'ongoing' ? 'green' : 'red'}>
//           {event.status === 'ongoing' ? '进行中' : '已结束'}
//         </Tag>
//       </div>
      
//       <div className="event-content">
//         <p className="event-time">
//           <CalendarOutlined /> {event.date} {event.time}
//         </p>
//         <p className="event-location">
//           <EnvironmentOutlined /> {event.location}
//         </p>
//         <Divider />
//         <div className="event-description">{event.description}</div>
        
//         {user && !event.participants.includes(user.id) && (
//           <Button 
//             type="primary" 
//             onClick={() => setShowSignup(true)}
//             disabled={event.status !== 'ongoing'}
//           >
//             {event.status === 'ongoing' ? '立即报名' : '已结束报名'}
//           </Button>
//         )}
//       </div>

//       <Modal
//         title="报名确认"
//         visible={showSignup}
//         onOk={handleSignup}
//         onCancel={() => setShowSignup(false)}
//         confirmLoading={loading}
//       >
//         <p>确定要报名【{event.title}】活动吗？</p>
//         <p>剩余名额：{event.capacity - event.participants.length}</p>
//       </Modal>

//       {event.feedbackEnabled && <FeedbackForm eventId={id} />}
//     </div>
//   );
// };



// import { useParams } from 'react-router-dom';
// import { Card, Tag, Space, Typography, Button, Modal, message } from 'antd';
// import dayjs from 'dayjs';
// import { useState } from 'react';

// const { Title, Text } = Typography;

// // 使用和首页相同的模拟数据
// const mockEvents = [
//   {
//     id: 'example-id1',
//     title: '校园开放日',
//     description: '欢迎新生参观校园',
//     startTime: '2025-10-01T10:00:00',
//     endTime: '2025-10-01T12:00:00',
//     registerstartTime: '2025-09-01T10:00:00',
//     registerendTime: '2025-09-30T12:00:00',
//     location: '学校主广场',
//     status: 'published',
//     capacity: 100,
//     department: 'UG',
//     role: 'student',
//   },
//   {
//     id: 'example-id2',
//     title: '编程工作坊',
//     description: '学习基础编程技能',
//     startTime: '2025-10-02T14:00:00',
//     endTime: '2025-10-02T16:00:00',
//     registerstartTime: '2025-09-15T10:00:00',
//     registerendTime: '2025-10-01T12:00:00',
//     location: '计算机实验室',
//     status: 'published',
//     capacity: 30,
//     department: 'CS',
//     role: 'student',
//   }
// ];

// export default function EventDetailPage() {
//   const { id } = useParams();
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [isRegistered, setIsRegistered] = useState(false);
//   const [currentEvent, setCurrentEvent] = useState(() => {
//     const event = mockEvents.find(e => e.id === id);
//     return event ? { ...event } : null;
//   });

//   if (!currentEvent) {
//     return <div>活动不存在或已被删除</div>;
//   }

//   const showModal = () => {
//     if (isRegistered) {
//       message.warning('您已经报名过该活动了！');
//       return;
//     }
//     setIsModalVisible(true);
//   };

//   const handleOk = () => {
//     setIsModalVisible(false);
//     setIsRegistered(true);
//     setCurrentEvent(prev => ({
//       ...prev,
//       registered: (prev.registered || 0) + 1
//     }));
//     message.success('报名成功！');
//   };

//   const handleCancel = () => {
//     setIsModalVisible(false);
//   };

//   // 检查报名是否已截止
//   const isRegistrationClosed = dayjs().isAfter(dayjs(currentEvent.registerendTime));

//   return (
//     <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
//       <Card>
//         <Title level={2}>{currentEvent.title}</Title>
//         
//         <Space size={[8, 16]} wrap style={{ marginBottom: 16 }}>
//           <Tag color="blue">{currentEvent.department}</Tag>
//           <Tag color="purple">{currentEvent.role}</Tag>
//           <Tag color={currentEvent.status === 'published' ? 'green' : 'orange'}>
//             {currentEvent.status === 'published' ? '已发布' : '未发布'}
//           </Tag>
//         </Space>
//         <div>
//         <Text paragraph style={{ fontSize: 16 }}>{currentEvent.description}</Text>
//         </div>
//         <Space direction="vertical" size={12} style={{ marginTop: 24 }}>
//           <div>
//             <Text strong>活动时间：</Text>
//             <Text>
//               {dayjs(currentEvent.startTime).format('YYYY-MM-DD HH:mm')} ~ 
//               {dayjs(currentEvent.endTime).format('YYYY-MM-DD HH:mm')}
//             </Text>
//           </div>

//           <div>
//             <Text strong>报名时间：</Text>
//             <Text>
//               {dayjs(currentEvent.registerstartTime).format('YYYY-MM-DD HH:mm')} ~ 
//               {dayjs(currentEvent.registerendTime).format('YYYY-MM-DD HH:mm')}
//             </Text>
//             {isRegistrationClosed && (
//               <Tag color="red" style={{ marginLeft: 8 }}>报名已截止</Tag>
//             )}
//           </div>

//           <div>
//             <Text strong>活动地点：</Text>
//             <Text>{currentEvent.location}</Text>
//           </div>
//         </Space>

//         <div style={{ marginTop: 24 }}>
//           <Button 
//             type="primary" 
//             size="large"
//             onClick={showModal}
//           >
//             {isRegistered ? '已报名' : '立即报名'}
//           </Button>
//         </div>
//       </Card>

//       {/* 报名确认对话框 */}
//       <Modal
//         title="确认报名"
//         visible={isModalVisible}
//         onOk={handleOk}
//         onCancel={handleCancel}
//         okText="确认"
//         cancelText="取消"
//       >
//         <p>确定要报名参加"{currentEvent.title}"活动吗？</p >
//       </Modal>
//     </div>
//   );
// }



// //OKOKOKOKOK??
// import { useParams, Link, useNavigate } from 'react-router-dom';
// import { Card, Tag, Space, Typography, Button, Modal, message, Alert, Spin } from 'antd';
// import dayjs from 'dayjs';
// import { useState, useEffect } from 'react';
// import { useAuthStore } from '@/stores/authStore';
// import { useEventStore } from '@/stores/eventStore';

// const { Title, Text } = Typography;

// // 与HomePage共享的模拟数据
// export const mockEvents = [
//       {
//           id: 'example-id1',
//           title: '校园开放日',
//           description: '欢迎新生参观校园',
//           startTime: '2025-10-01T10:00:00',
//           endTime: '2025-10-01T12:00:00',
//           registerstartTime: '2025-09-01T10:00:00',
//           registerendTime: '2025-09-30T12:00:00',
//           location: '学校主广场',
//           status: 'published',
//           capacity: 100,
//           department: 'UG',
//           role: 'student'
//          
//         },
//         {
//           id: 'example-id2',
//           title: '编程工作坊',
//           description: '学习基础编程技能',
//           startTime: '2025-10-02T14:00:00',
//           endTime: '2025-10-02T16:00:00',
//           registerstartTime: '2025-09-15T10:00:00',
//           registerendTime: '2025-10-01T12:00:00',
//           location: '计算机实验室',
//           status: 'published',
//           capacity: 30,
//           department: 'CS',
//           role: 'student'
//           
//         },
//         {
//           id: 'example-id3',
//           title: '艺术展览',
//           description: '学生艺术作品展示',
//           startTime: '2025-10-03T09:00:00',
//           endTime: '2025-10-05T17:00:00',
//           registerstartTime: '2025-09-10T10:00:00',
//           registerendTime: '2025-10-02T12:00:00',
//           location: '艺术楼展厅',
//           status: 'published',
//           capacity: 200,
//           department: 'ART',
//           role: 'student',
//           coverImage: 'https://example.com/art-exhibition.jpg',
//           
//         }
//   // 其他活动数据保持与HomePage一致...

// ];

// export default function EventDetailPage() {

//   const { id } = useParams();
//   const navigate = useNavigate();
//   // const { user, isLoggedIn, registeredEvents, registerEvent } = useAuthStore();
//   const { user, isLoggedIn, registeredEvents = [], registerEvent } = useAuthStore(); // 添加
//   const { events } = useEventStore();
//   const [currentEvent, setCurrentEvent] = useState(null);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   // 初始化加载事件数据
//   useEffect(() => {
//     const combinedEvents = [...events, ...mockEvents];
//     const event = combinedEvents.find(e => e.id === id);
//     setCurrentEvent(event || null);
//     setIsLoading(false); // 正确设置加载状态
//   }, [id, events]);


//   if (isLoading) {
//     return <Spin tip="加载中..." />;
//   }
//   // ...其他代码


//   // 实时状态计算
//   // const isRegistered = registeredEvents.includes(id);
//   const isRegistered = (registeredEvents || []).includes(id);
//   const remainingSpots = currentEvent?.capacity - currentEvent?.participants?.length || 0;
//   const isRegistrationClosed = currentEvent 
//     ? dayjs().isAfter(dayjs(currentEvent.registerendTime))
//     : true;

//     const handleRegister = async () => {
//       // 增强状态检查
//       const authState = useAuthStore.getState();
      
//       if (!authState.isLoggedIn || !authState.user) {
//         message.warning('请先登录！');
//         navigate('/login', { state: { from: location.pathname } }); // 保留当前路径
//         return;
//       }
    
//       if (remainingSpots <= 0) {
//         message.error('该活动已满员');
//         return;
//       }
    
//       setIsModalVisible(true);
//     };

//   const confirmRegistration = async () => {
//     try {
//       // 更新全局状态
//       registerEvent(id);
      
//       // 更新本地事件数据
//       setCurrentEvent(prev => ({
//         ...prev,
//         participants: [...prev.participants, user.id],
//         registered: prev.registered + 1
//       }));

//     // 同时更新两个store
//     await Promise.all([
//       useAuthStore.getState().registerEvent(id),
//       useEventStore.getState().registerEvent(id, user.id)
//     ]);

//       message.success('报名成功！');
//     } catch (error) {
//       message.error('报名失败: ' + error.message);
//     } finally {
//       setIsModalVisible(false);
//     }
//   };


//   if (!currentEvent) {
//     return (
//       <div style={{ padding: 24, textAlign: 'center' }}>
//         <Alert 
//           type="warning"
//           message="活动不存在或已被删除"
//           description={
//             <Link to="/">
//               <Button type="primary" style={{ marginTop: 16 }}>
//                 返回首页
//               </Button>
//             </Link>
//           }
//         />
//       </div>
//     );
//   }

//   return (
//     <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
//       <Card>
//         <Title level={2}>{currentEvent.title}</Title>
        
//         <Space size={[8, 16]} wrap style={{ marginBottom: 16 }}>
//           <Tag color="blue">{currentEvent.department}</Tag>
//           <Tag color="purple">{currentEvent.role}</Tag>
//           <Tag color={currentEvent.status === 'published' ? 'green' : 'orange'}>
//             {currentEvent.status === 'published' ? '已发布' : '未发布'}
//           </Tag>
//           {isRegistered && <Tag color="gold">已报名</Tag>}
//         </Space>

//         <Text paragraph style={{ fontSize: 16 }}>{currentEvent.description}</Text>

//         <Space direction="vertical" size={12} style={{ marginTop: 24 }}>
//           <div>
//             <Text strong>活动时间：</Text>
//             <Text>
//               {dayjs(currentEvent.startTime).format('YYYY-MM-DD HH:mm')} ~ 
//               {dayjs(currentEvent.endTime).format('YYYY-MM-DD HH:mm')}
//             </Text>
//           </div>

//           <div>
//             <Text strong>报名时间：</Text>
//             <Text>
//               {dayjs(currentEvent.registerstartTime).format('YYYY-MM-DD HH:mm')} ~ 
//               {dayjs(currentEvent.registerendTime).format('YYYY-MM-DD HH:mm')}
//             </Text>
//             {isRegistrationClosed && (
//               <Tag color="red" style={{ marginLeft: 8 }}>报名已截止</Tag>
//             )}
//           </div>

//           <div>
//             <Text strong>活动地点：</Text>
//             <Text>{currentEvent.location}</Text>
//           </div>

//           {/* <div>
//             <Text strong>剩余名额：</Text>
//             <Text>{remainingSpots} / {currentEvent.capacity}</Text>
//           </div> */}
//         </Space>

//         <div style={{ marginTop: 24 }}>
//           <Button 
//             type="primary" 
//             size="large"
//             onClick={handleRegister}
//             disabled={isRegistered || isRegistrationClosed}
//           >
//             {isRegistered ? '已报名' : '立即报名'}
//           </Button>
//         </div>
//       </Card>

//       <Modal
//         title="确认报名"
//         visible={isModalVisible}
//         onOk={confirmRegistration}
//         onCancel={() => setIsModalVisible(false)}
//         okText="确认报名"
//         cancelText="取消"
//       >
//         <p>确定要报名参加 "{currentEvent.title}" 活动吗？</p>
//         <Alert 
//           type="info"
//           message="报名须知"
//           description={
//             <ul>
//               <li>报名后不可取消</li>
//               <li>请按时参加活动</li>
//               <li>剩余名额：{remainingSpots}</li>
//             </ul>
//           }
//         />
//       </Modal>
//     </div>
//   );
// }

import { mockEvents } from '@/data/mockEvents'; // 从独立文件导入
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, Tag, Space, Typography, Button, Modal, message, Alert, Spin } from 'antd';
import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useEventStore } from '@/stores/eventStore';

const { Title, Text } = Typography;

// // 与HomePage共享的模拟数据
// export const mockEvents = [
//     {
//         id: 'example-id1',
//         title: '校园开放日',
//         description: '欢迎新生参观校园',
//         startTime: '2025-10-01T10:00:00',
//         endTime: '2025-10-01T12:00:00',
//         registerstartTime: '2025-09-01T10:00:00',
//         registerendTime: '2025-09-30T12:00:00',
//         location: '学校主广场',
//         status: 'published',
//         capacity: 100,
//         participants: [], // 初始化参与者列表
//         department: 'UG',
//         role: 'student'
//     },
//     {
//         id: 'example-id2',
//         title: '编程工作坊',
//         description: '学习基础编程技能',
//         startTime: '2025-10-02T14:00:00',
//         endTime: '2025-10-02T16:00:00',
//         registerstartTime: '2025-09-15T10:00:00',
//         registerendTime: '2025-10-01T12:00:00',
//         location: '计算机实验室',
//         status: 'published',
//         capacity: 30,
//         participants: [], // 初始化参与者列表
//         department: 'CS',
//         role: 'student'
//     },
//     {
//         id: 'example-id3',
//         title: '艺术展览',
//         description: '学生艺术作品展示',
//         startTime: '2025-10-03T09:00:00',
//         endTime: '2025-10-05T17:00:00',
//         registerstartTime: '2025-09-10T10:00:00',
//         registerendTime: '2025-10-02T12:00:00',
//         location: '艺术楼展厅',
//         status: 'published',
//         capacity: 200,
//         participants: [], // 初始化参与者列表
//         department: 'ART',
//         role: 'student',
//         coverImage: 'https://example.com/art-exhibition.jpg',
//     }
// ];

export default function EventDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isLoggedIn, registeredEvents = [], registerEvent } = useAuthStore();
    const { events } = useEventStore();
    const [currentEvent, setCurrentEvent] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // 初始化加载事件数据
    useEffect(() => {
        const combinedEvents = [...events, ...mockEvents];
        const event = combinedEvents.find(e => e.id === id);
        setCurrentEvent(event || null);
        setIsLoading(false);
    }, [id, events]);

    if (isLoading) {
        return <Spin tip="加载中..." />;
    }

    const isRegistered = (registeredEvents || []).includes(id);
    const remainingSpots = currentEvent?.capacity - currentEvent?.participants.length || 0;
    const isRegistrationClosed = currentEvent ? dayjs().isAfter(dayjs(currentEvent.registerendTime)) : true;

    const handleRegister = async () => {
        if (!isLoggedIn || !user) {
            message.warning('请先登录！');
            navigate('/login', { state: { from: location.pathname } });
            return;
        }

        if (remainingSpots <= 0) {
            message.error('该活动已满员');
            return;
        }

        setIsModalVisible(true);
    };

    const confirmRegistration = async () => {
        try {
            // 更新参与者列表
            setCurrentEvent(prev => ({
                ...prev,
                participants: [...prev.participants, user.id]
            }));

            // 更新全局状态
            registerEvent(id);
            useAuthStore.getState().registerEvent(id);
            useEventStore.getState().registerEvent(id, user.id);

            // 显示成功消息
            message.success('报名成功！');

            setTimeout(() => {
                navigate('/my-activities'); // 新增导航逻辑  
            }, 1500); // 1.5秒后跳转          
        } catch (error) {
            message.error('报名失败: ' + error.message);
        } finally {
            setIsModalVisible(false);
        }
    };

    if (!currentEvent) {
        return (
            <div style={{ padding: 24, textAlign: 'center' }}>
                <Alert
                    type="warning"
                    message="活动不存在或已被删除"
                    description={
                        <Link to="/">
                            <Button type="primary" style={{ marginTop: 16 }}>
                                返回首页
                            </Button>
                        </Link>
                    }
                />
            </div>
        );
    }

    return (
        <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
            <Card>
                <Title level={2}>{currentEvent.title}</Title>
                <Space size={[8, 16]} wrap style={{ marginBottom: 16 }}>
                    <Tag color="blue">{currentEvent.department}</Tag>
                    <Tag color="purple">{currentEvent.role}</Tag>
                    <Tag color={currentEvent.status === 'published' ? 'green' : 'orange'}>
                        {currentEvent.status === 'published' ? '已发布' : '未发布'}
                    </Tag>
                    {isRegistered && <Tag color="gold">已报名</Tag>}
                </Space>

                <Text paragraph style={{ fontSize: 16 }}>{currentEvent.description}</Text>

                <Space direction="vertical" size={12} style={{ marginTop: 24 }}>
                    <div>
                        <Text strong>活动时间：</Text>
                        <Text>
                            {dayjs(currentEvent.startTime).format('YYYY-MM-DD HH:mm')} ~ 
                            {dayjs(currentEvent.endTime).format('YYYY-MM-DD HH:mm')}
                        </Text>
                    </div>

                    <div>
                        <Text strong>报名时间：</Text>
                        <Text>
                            {dayjs(currentEvent.registerstartTime).format('YYYY-MM-DD HH:mm')} ~ 
                            {dayjs(currentEvent.registerendTime).format('YYYY-MM-DD HH:mm')}
                        </Text>
                        {isRegistrationClosed && (
                            <Tag color="red" style={{ marginLeft: 8 }}>报名已截止</Tag>
                        )}
                    </div>

                    <div>
                        <Text strong>活动地点：</Text>
                        <Text>{currentEvent.location}</Text>
                    </div>
                </Space>

                <div style={{ marginTop: 24 }}>
                    <Button 
                        type="primary" 
                        size="large"
                        onClick={handleRegister}
                        disabled={isRegistered || isRegistrationClosed}
                    >
                        {isRegistered ? '已报名' : '立即报名'}
                    </Button>
                </div>
            </Card>

            <Modal
                title="确认报名"
                visible={isModalVisible}
                onOk={confirmRegistration}
                onCancel={() => setIsModalVisible(false)}
                okText="确认报名"
                cancelText="取消"
            >
                <p>确定要报名参加 "{currentEvent.title}" 活动吗？</p>
                <Alert 
                    type="info"
                    message="报名须知"
                    description={
                        <ul>
                            <li>报名后不可取消</li>
                            <li>请按时参加活动</li>
                            <li>剩余名额：{remainingSpots}</li>
                        </ul>
                    }
                />
            </Modal>
        </div>
    );
}