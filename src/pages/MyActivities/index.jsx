// import { Card, List, Tag, Button, Rate, Modal, Alert, Spin, Form, Input, message } from 'antd';
// import { useEffect, useState, useMemo } from 'react';
// import dayjs from 'dayjs';
// import { useAuthStore } from '@/stores/authStore';
// import { useEventStore } from '@/stores/eventStore';
// // import { mockEvents } from '@/pages/EventDetail'; 

// // 与HomePage共享的模拟数据

// // const MyActivitiesPage = () => {
// //   const [mockEvents, setMockEvents] = useState([]);

// //   useEffect(() => {
// //       // 模拟获取数据
// //       const fetchData = async () => {
// //           // 假设这是从 API 获取数据
// //           const events = await fetchMockEvents(); // 请替换成你的数据获取逻辑
// //           setMockEvents(events);
// //       };

// //       fetchData();
// //   }, []);

// //   if (!Array.isArray(mockEvents)) {
// //       console.error('mockEvents is not an array:', mockEvents);
// //       return <div>Error: mockEvents is not iterable</div>;
// //   }

// //   return (
// //       <div>
// //           {mockEvents.map(event => (
// //               <div key={event.id}>{event.name}</div>
// //           ))}
// //       </div>
// //   );
// // };

// export default function MyActivitiesPage() {
//   const { user, registeredEvents = [] } = useAuthStore();
//   const { events } = useEventStore();
//   const [selectedEvent, setSelectedEvent] = useState(null);
//   const [feedbackVisible, setFeedbackVisible] = useState(false);
//   const [loading, setLoading] = useState(true);

//   const mockEvents = [
    
//           {
//               id: 'example-id2',
//               title: '编程工作坊',
//               description: '学习基础编程技能',
//               startTime: '2025-10-02T14:00:00',
//               endTime: '2025-10-02T16:00:00',
//               registerstartTime: '2025-09-15T10:00:00',
//               registerendTime: '2025-10-01T12:00:00',
//               location: '计算机实验室',
//               status: 'published',
//               capacity: 30,
//               department: 'CS',
//               role: 'student'
//           
//               
//             },
//             {
//               id: 'example-id3',
//               title: '艺术展览',
//               description: '学生艺术作品展示',
//               startTime: '2025-10-03T09:00:00',
//               endTime: '2025-10-05T17:00:00',
//               registerstartTime: '2025-09-10T10:00:00',
//               registerendTime: '2025-10-02T12:00:00',
//               location: '艺术楼展厅',
//               status: 'published',
//               capacity: 200,
//               department: 'ART',
//               role: 'student',
//               coverImage: 'https://example.com/art-exhibition.jpg',
//               
//             }
    
//   ];
//   // 增强的数据合并逻辑
//   const userActivities = useMemo(() => {
//     const allEvents = [...events, ...mockEvents];
    
//     return allEvents
//       .filter(event => {
//         const isRegistered = registeredEvents.includes(event.id);
//         const hasParticipation = event.participants?.some(
//           p => p.userId === user?.id
//         );
//         return isRegistered && hasParticipation;
//       })
//       .map(event => ({
//         ...event,
//         startTime: dayjs(event.startTime).format(),
//         endTime: dayjs(event.endTime).format(),
//         registerendTime: dayjs(event.registerendTime).format()
//       }));
//   }, [events, registeredEvents, user?.id]);

//   // 自动加载状态管理
//   useEffect(() => {
//     const timer = setTimeout(() => setLoading(false), 1500);
//     return () => clearTimeout(timer);
//   }, []);

// // 增强状态判断逻辑
// const getActivityStatus = (event) => {
//   const participant = event.participants.find(p => p.userId === user?.id);
//   if (!participant) return { status: '未知状态', color: 'gray' };

//   const now = dayjs();
//   const registerEnd = dayjs(event.registerendTime);
//   const eventStart = dayjs(event.startTime);
//   const eventEnd = dayjs(event.endTime);

//   if (now.isBefore(registerEnd)) {
//     return { status: '审核中', color: 'orange' };
//   }
//   if (participant.status === 'checked-in' && now.isAfter(eventEnd)) {
//     return { status: '待评价', color: 'purple' };
//   }
//   if (participant.status === 'checked-in') {
//     return { status: '已签到', color: 'green' };
//   }
//   if (now.isAfter(eventStart)) {
//     return { status: '未签到', color: 'red' };
//   }
//   return { status: '报名成功', color: 'blue' };
// };

// // 增强签到处理
// const handleCheckIn = async (eventId) => {
//   try {
//     await useEventStore.getState().checkInEvent(eventId, user.id);
//     message.success('签到成功');
//     // 强制更新视图
//     useEventStore.getState().fetchEvents();
//   } catch (error) {
//     message.error('签到失败: ' + error.message);
//   }
// };

// // ...其余代码保持不变...

//   // 提交评价
//   const handleFeedbackSubmit = (values) => {
//     useEventStore.getState().submitFeedback(selectedEvent.id, {
//       ...values,
//       userId: user.id
//     });
//     setFeedbackVisible(false);
//     message.success('评价已提交');
//   };

//   if (loading) {
//     return <Spin tip="加载活动数据..." />;
//   }

//   return (
//     <div className="my-activities" style={{ maxWidth: 800, margin: '0 auto' }}>
//       <h1 style={{ marginBottom: 24 }}>我的活动 ({userActivities.length})</h1>
      
//       <List
//         dataSource={userActivities}
//         renderItem={(event) => {
//           const status = getActivityStatus(event);
//           return (
//             <List.Item>
//               <Card
//                 title={event.title}
//                 extra={<Tag color={status.color}>{status.status}</Tag>}
//                 style={{ width: '100%' }}
//               >
//                 <div className="activity-meta">
//                   <span>时间：{dayjs(event.startTime).format('YYYY-MM-DD HH:mm')}</span>
//                   <span style={{ margin: '0 16px' }}>|</span>
//                   <span>地点：{event.location}</span>
//                 </div>

//                 <div className="action-buttons" style={{ marginTop: 16 }}>
//                   {status.status === '待评价' && (
//                     <Button 
//                       type="primary" 
//                       onClick={() => {
//                         setSelectedEvent(event);
//                         setFeedbackVisible(true);
//                       }}
//                     >
//                       提交评价
//                     </Button>
//                   )}

//                   {status.status === '未签到' && (
//                     <Button 
//                       type="dashed" 
//                       danger
//                       onClick={() => handleCheckIn(event.id)}
//                     >
//                       立即签到
//                     </Button>
//                   )}
//                 </div>
//               </Card>
//             </List.Item>
//           );
//         }}
//       />

//       {/* 评价模态框 */}
//       <Modal
//         title={`评价活动 - ${selectedEvent?.title}`}
//         visible={feedbackVisible}
//         onCancel={() => setFeedbackVisible(false)}
//         footer={null}
//       >
//         <Form onFinish={handleFeedbackSubmit}>
//           <Form.Item
//             name="rating"
//             label="活动评分"
//             rules={[{ required: true, message: '请选择评分' }]}
//           >
//             <Rate allowHalf />
//           </Form.Item>
          
//           <Form.Item
//             name="comment"
//             label="活动评价"
//             rules={[{ max: 500, message: '评价不超过500字' }]}
//           >
//             <Input.TextArea rows={4} />
//           </Form.Item>
          
//           <Button type="primary" htmlType="submit">
//             提交评价
//           </Button>
//         </Form>
//       </Modal>
//     </div>
//   );
// }





// //NOTOKOKOK
// import { Card, List, Tag, Button, Rate, Modal, Alert, Spin, Form, Input, message } from 'antd';
// import { useEffect, useState, useMemo } from 'react';
// import dayjs from 'dayjs';
// import { useAuthStore } from '@/stores/authStore';
// import { useEventStore } from '@/stores/eventStore';

// export default function MyActivitiesPage() {
//   const { user, registeredEvents = [] } = useAuthStore();
//   const { events } = useEventStore();
//   const [selectedEvent, setSelectedEvent] = useState(null);
//   const [feedbackVisible, setFeedbackVisible] = useState(false);
//   const [loading, setLoading] = useState(true);

//   const mockEvents = [
//     {
//       id: 'example-id2',
//       title: '编程工作坊',
//       description: '学习基础编程技能',
//       startTime: '2025-10-02T14:00:00',
//       endTime: '2025-10-02T16:00:00',
//       registerstartTime: '2025-09-15T10:00:00',
//       registerendTime: '2025-10-01T12:00:00',
//       location: '计算机实验室',
//       status: 'published',
//       capacity: 30,
//       participants: [], // 初始化参与者列表
//       department: 'CS',
//       role: 'student'
//     },
//     {
//       id: 'example-id3',
//       title: '艺术展览',
//       description: '学生艺术作品展示',
//       startTime: '2025-10-03T09:00:00',
//       endTime: '2025-10-05T17:00:00',
//       registerstartTime: '2025-09-10T10:00:00',
//       registerendTime: '2025-10-02T12:00:00',
//       location: '艺术楼展厅',
//       status: 'published',
//       capacity: 200,
//       participants: [], // 初始化参与者列表
//       department: 'ART',
//       role: 'student',
//       coverImage: 'https://example.com/art-exhibition.jpg',
//     }
//   ];

//   const userActivities = useMemo(() => {
//     const allEvents = [...events, ...mockEvents];
    
//     return allEvents
//       .filter(event => {
//         const isRegistered = registeredEvents.includes(event.id);
//         const hasParticipation = event.participants?.some(
//           p => p.userId === user?.id
//         );
//         return isRegistered && hasParticipation;
//       })
//       .map(event => ({
//         ...event,
//         startTime: dayjs(event.startTime).format(),
//         endTime: dayjs(event.endTime).format(),
//         registerendTime: dayjs(event.registerendTime).format()
//       }));
//   }, [events, registeredEvents, user?.id]);

//   useEffect(() => {
//     const timer = setTimeout(() => setLoading(false), 1500);
//     return () => clearTimeout(timer);
//   }, []);

//   const getActivityStatus = (event) => {
//     const participant = event.participants.find(p => p.userId === user?.id);
//     if (!participant) return { status: '未知状态', color: 'gray' };

//     const now = dayjs();
//     const registerEnd = dayjs(event.registerendTime);
//     const eventStart = dayjs(event.startTime);
//     const eventEnd = dayjs(event.endTime);

//     if (now.isBefore(registerEnd)) {
//       return { status: '审核中', color: 'orange' };
//     }
//     if (participant.status === 'checked-in' && now.isAfter(eventEnd)) {
//       return { status: '待评价', color: 'purple' };
//     }
//     if (participant.status === 'checked-in') {
//       return { status: '已签到', color: 'green' };
//     }
//     if (now.isAfter(eventStart)) {
//       return { status: '未签到', color: 'red' };
//     }
//     return { status: '报名成功', color: 'blue' };
//   };

//   const handleCheckIn = async (eventId) => {
//     try {
//       await useEventStore.getState().checkInEvent(eventId, user.id);
//       message.success('签到成功');
//       // 强制更新视图
//       useEventStore.getState().fetchEvents();
//     } catch (error) {
//       message.error('签到失败: ' + error.message);
//     }
//   };

//   const handleFeedbackSubmit = (values) => {
//     useEventStore.getState().submitFeedback(selectedEvent.id, {
//       ...values,
//       userId: user.id
//     });
//     setFeedbackVisible(false);
//     message.success('评价已提交');
//   };

//   if (loading) {
//     return <Spin tip="加载活动数据..." />;
//   }

//   return (
//     <div className="my-activities" style={{ maxWidth: 800, margin: '0 auto' }}>
//       <h1 style={{ marginBottom: 24 }}>我的活动 ({userActivities.length})</h1>
      
//       <List
//         dataSource={userActivities}
//         renderItem={(event) => {
//           const status = getActivityStatus(event);
//           return (
//             <List.Item>
//               <Card
//                 title={event.title}
//                 extra={<Tag color={status.color}>{status.status}</Tag>}
//                 style={{ width: '100%' }}
//               >
//                 <div className="activity-meta">
//                   <span>时间：{dayjs(event.startTime).format('YYYY-MM-DD HH:mm')}</span>
//                   <span style={{ margin: '0 16px' }}>|</span>
//                   <span>地点：{event.location}</span>
//                 </div>

//                 <div className="action-buttons" style={{ marginTop: 16 }}>
//                   {status.status === '待评价' && (
//                     <Button 
//                       type="primary" 
//                       onClick={() => {
//                         setSelectedEvent(event);
//                         setFeedbackVisible(true);
//                       }}
//                     >
//                       提交评价
//                     </Button>
//                   )}

//                   {status.status === '未签到' && (
//                     <Button 
//                       type="dashed" 
//                       danger
//                       onClick={() => handleCheckIn(event.id)}
//                     >
//                       立即签到
//                     </Button>
//                   )}
//                 </div>
//               </Card>
//             </List.Item>
//           );
//         }}
//       />

//       {/* 评价模态框 */}
//       <Modal
//         title={`评价活动 - ${selectedEvent?.title}`}
//         visible={feedbackVisible}
//         onCancel={() => setFeedbackVisible(false)}
//         footer={null}
//       >
//         <Form onFinish={handleFeedbackSubmit}>
//           <Form.Item
//             name="rating"
//             label="活动评分"
//             rules={[{ required: true, message: '请选择评分' }]}
//           >
//             <Rate allowHalf />
//           </Form.Item>
          
//           <Form.Item
//             name="comment"
//             label="活动评价"
//             rules={[{ max: 500, message: '评价不超过500字' }]}
//           >
//             <Input.TextArea rows={4} />
//           </Form.Item>
          
//           <Button type="primary" htmlType="submit">
//             提交评价
//           </Button>
//         </Form>
//       </Modal>
//     </div>
//   );
// }


import { Card, List, Tag, Button, Rate, Modal, Alert, Spin, Form, Input, message } from 'antd';
import { useEffect, useState, useMemo } from 'react';
import dayjs from 'dayjs';
import { useAuthStore } from '@/stores/authStore';
import { useEventStore } from '@/stores/eventStore';
import { mockEvents } from '@/data/mockEvents'; // 从独立文件导入

export default function MyActivitiesPage() {
  const { user, registeredEvents = [] } = useAuthStore();
  const { events, fetchEvents } = useEventStore();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [loading, setLoading] = useState(true);



  // ✅ 正确顺序：先定义函数
  const getActivityStatus = (event) => {
    if (!event?.participants) {
      return { status: '数据异常', color: 'gray' };
    }
    
    const participant = event.participants.find(p => p.userId === user?.id);
    const now = dayjs();
    const timelines = {
      registerEnd: dayjs(event.registerendTime),
      eventStart: dayjs(event.startTime),
      eventEnd: dayjs(event.endTime)
    };

    if (now.isBefore(timelines.registerEnd)) {
      return { status: '审核中', color: 'orange' };
    }
    if (participant?.status === 'checked-in' && now.isAfter(timelines.eventEnd)) {
      return { status: '待评价', color: 'purple' };
    }
    if (participant?.status === 'checked-in') {
      return { status: '已签到', color: 'green' };
    }
    if (now.isAfter(timelines.eventStart)) {
      return { status: '未签到', color: 'red' };
    }
    return { status: '报名成功', color: 'blue' };
  };

  // ✅ 安全使用函数
  const userActivities = useMemo(() => {
    const allEvents = [...events, ...mockEvents];
    return allEvents
      .filter(event => 
        registeredEvents.includes(event.id) && 
        event.participants?.some(p => p.userId === user?.id)
      )
      .map(event => ({
        ...event,
        statusInfo: getActivityStatus(event)
      }));
  }, [events, registeredEvents, user?.id]);


  // const handleCheckIn = async (eventId) => {
  //   try {
  //     await useEventStore.getState().checkInEvent(eventId, user.id);
  //     message.success('签到成功');
      
  //     // 双重更新保证数据同步
  //     await Promise.all([
  //       useAuthStore.getState().updateRegistrationStatus(eventId, 'checked-in'),
  //       fetchEvents()
  //     ]);
      
  //   } catch (error) {
  //     message.error('签到失败: ' + error.message);
  //   }
  // };

  const handleCheckIn = async (eventId) => {
    try {
      const { checkInEvent } = useEventStore.getState();
      const { updateRegistrationStatus } = useAuthStore.getState();
      
      await checkInEvent(eventId, user.id);
      message.success('签到成功');
      
      await Promise.all([
        updateRegistrationStatus(eventId, 'checked-in'),
        fetchEvents()
      ]);
      
    } catch (error) {
      message.error('签到失败: ' + error.message);
    }
  };

  // 增强的反馈提交
  const handleFeedbackSubmit = async (values) => {
    try {
      await useEventStore.getState().submitFeedback(selectedEvent.id, {
        ...values,
        userId: user.id
      });
      
      // 更新本地状态
      setSelectedEvent(prev => ({
        ...prev,
        participants: prev.participants.map(p => 
          p.userId === user.id ? {...p, feedback: values } : p
        )
      }));
      
      message.success('评价已提交');
      setFeedbackVisible(false);
      await fetchEvents(); // 刷新数据
    } catch (error) {
      message.error('提交失败: ' + error.message);
    }
  };

  // // 加载状态处理
  // if (loading) {
  //   return <Spin tip="加载活动数据..." fullscreen />;
  // }

  // 空状态处理
  if (userActivities.length === 0) {
    return (
      <Alert
        type="info"
        message="暂无活动"
        description={
          <div style={{ marginTop: 16 }}>
            <p>您尚未报名任何活动</p>
            <Button 
              type="primary" 
              onClick={() => window.location.href = '/'}
            >
              去发现活动
            </Button>
          </div>
        }
      />
    );
  }

  return (
    <div className="my-activities" style={{ maxWidth: 800, margin: '0 auto' }}>
      <h1 style={{ marginBottom: 24 }}>
        我的活动 <Tag color="blue">{userActivities.length}</Tag>
      </h1>
      
      {/* <List
        dataSource={userActivities}
        renderItem={(event) => {
          const { status, color } = event.statusInfo;
          const canCheckIn = status === '未签到';
          const canFeedback = status === '待评价'; */}
    {/* 列表渲染部分 - 修改这里 */}
    <List
      dataSource={userActivities}
      renderItem={(event) => {
        // 安全解构 + 默认值 (新增部分)
        const { status = '加载中', color = 'gray' } = event.statusInfo || {};
    // 新增状态判断逻辑
    const canCheckIn = status === '未签到';
    const canFeedback = status === '待评价';
          return (
            <List.Item>
              {/* <Card
                title={event.title}
                extra={<Tag color={color}>{status}</Tag>}
                actions=
                
                {[
                  canCheckIn && <Button key="checkin" onClick={() => handleCheckIn(event.id)}>立即签到</Button>,
                  canFeedback && <Button key="feedback" onClick={() => {
                    setSelectedEvent(event);
                    setFeedbackVisible(true);
                  }}>提交评价</Button>
                ].filter(Boolean)}
              > */}
        <Card
          title={event.title}
          extra={<Tag color={color}>{status}</Tag>}
          actions={[
            canCheckIn && (
              <Button key="checkin" onClick={() => handleCheckIn(event.id)}>
                立即签到
              </Button>
            ),
            canFeedback && (
              <Button
                key="feedback"
                onClick={() => {
                  setSelectedEvent(event);
                  setFeedbackVisible(true);
                }}
              >
                提交评价
              </Button>
            )
          ].filter(Boolean)}
        >
                <div className="activity-meta">
                  <p>时间：{dayjs(event.startTime).format('YYYY-MM-DD HH:mm')}</p>
                  <p>地点：{event.location}</p>
                  <p>参与状态最后更新：{dayjs(event.registerendTime).format('YYYY-MM-DD')}</p>
                </div>
              </Card>
            </List.Item>
          );
        }}
      />

      {/* 反馈模态框 */}
      <Modal
        title={`评价活动 - ${selectedEvent?.title}`}
        visible={feedbackVisible}
        onCancel={() => setFeedbackVisible(false)}
        footer={null}
        destroyOnClose
      >
        <Form 
          initialValues={selectedEvent?.participants?.find(p => p.userId === user.id)?.feedback}
          onFinish={handleFeedbackSubmit}
        >
          <Form.Item
            name="rating"
            label="活动评分"
            rules={[{ required: true }]}
          >
            <Rate allowHalf />
          </Form.Item>
          
          <Form.Item
            name="comment"
            label="活动评价"
            rules={[{ max: 500 }]}
          >
            <Input.TextArea rows={4} placeholder="请分享您的活动体验..." />
          </Form.Item>
          
          <Button type="primary" htmlType="submit" block>
            提交评价
          </Button>
        </Form>
      </Modal>
      
    </div>
  );
}