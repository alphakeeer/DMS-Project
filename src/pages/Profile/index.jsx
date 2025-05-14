// import { Card, Descriptions, Button } from 'antd'
// import { useAuthStore } from '@/stores/authStore'
// import dayjs from 'dayjs'

// export default function ProfilePage() {
//   const { user, logout } = useAuthStore()

//   return (
//     <div className="profile-container">
//       <Card title="个人信息" extra={<Button onClick={logout}>退出登录</Button>}>
//         <Descriptions column={1}>
//           <Descriptions.Item label="用户名">{user?.username}</Descriptions.Item>
//           <Descriptions.Item label="角色">{user?.role}</Descriptions.Item>
//           <Descriptions.Item label="注册时间">
//             {dayjs(user?.createdAt).format('YYYY-MM-DD HH:mm')}
//           </Descriptions.Item>
//         </Descriptions>
//       </Card>
//     </div>
//   )
// }


// import { Card, Descriptions, Button } from 'antd';
// import { useAuthStore } from '@/stores/authStore';
// import dayjs from 'dayjs';

// export default function ProfilePage() {
//   const { user, logout } = useAuthStore();

//   return (
//     <div className="profile-container" style={{ 
//       marginLeft: '200px', // 根据侧边栏的宽度进行调整
//       padding: '24px', // 添加内边距
//       background: '#f5f5f5', // 背景颜色
//       minHeight: '100vh' // 确保内容区高度为视口高度
//     }}>
//       <Card title="个人信息" extra={<Button onClick={logout}>退出登录</Button>} style={{ maxWidth: '600px', margin: '0 auto' }}>
//         <Descriptions column={1}>
//           <Descriptions.Item label="用户名">{user?.username}</Descriptions.Item>
//           <Descriptions.Item label="角色">{user?.role}</Descriptions.Item>
//           <Descriptions.Item label="注册时间">
//             {dayjs(user?.createdAt).format('YYYY-MM-DD HH:mm')}
//           </Descriptions.Item>
//         </Descriptions>
//       </Card>
//     </div>
//   );
// }
// 新增导入语句
import dayjs from 'dayjs'
import CheckInForm from '@/components/CheckInForm';
import { useState } from 'react';
import { Tabs, Tag, Button, Modal, Timeline, Card, Descriptions } from 'antd';
import { 
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  FormOutlined
} from '@ant-design/icons';
import { useAuthStore } from '@/stores/authStore';
import { useEventStore } from '@/stores/eventStore';
import FeedbackForm from '@/components/FeedbackForm';
import { useNavigate } from 'react-router-dom';

const { TabPane } = Tabs;

const statusConfig = {
  pending: {
    color: 'orange',
    icon: <ClockCircleOutlined />,
    text: '审核中'
  },
  success: {
    color: 'green',
    icon: <CheckCircleOutlined />,
    text: '报名成功'
  },
  rejected: {
    color: 'red',
    icon: <CloseCircleOutlined />,
    text: '报名失败'
  }
};

export default function ProfilePage () {
  const { user, logout } = useAuthStore();
  const { events, submitFeedback, checkInEvent } = useEventStore();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalType, setModalType] = useState(null);


  const userEvents = events.filter(e => 
    e.participants.some(p => p.userId === user?.id)
  );

  const handleAction = (event, actionType) => {
    setSelectedEvent(event);
    setModalType(actionType);
  };

  const renderActions = (event) => {
    const participant = event.participants.find(p => p.userId === user.id);
    
    switch (participant.status) {
      case 'pending':
        return <Tag icon={<ClockCircleOutlined />} color="orange">等待审核</Tag>;
      case 'success':
        return (
          <>
            {event.status === 'upcoming' && <Tag color="blue">待举办</Tag>}
            {event.status === 'checkin' && (
              <Button 
                type="link"
                icon={<FormOutlined />}
                onClick={() => handleAction(event, 'checkin')}
              >
                签到
              </Button>
            )}
            {event.status === 'feedback' && (
              <Button 
                type="link"
                icon={<FormOutlined />}
                onClick={() => handleAction(event, 'feedback')}
              >
                提交反馈
              </Button>
            )}
          </>
        );
      case 'rejected':
        return <Tag color="red">未通过审核</Tag>;
      default:
        return null;
    }
  };

  return (
        <div style={{ 
            marginLeft: 140,
            marginRight: 140,
            padding: '24px'
          }}>

     <div className="profile-container">
       <Card title="个人信息" extra={<Button onClick={logout}>退出登录</Button>}>
         <Descriptions column={1}>
           <Descriptions.Item label="用户名">{user?.username}</Descriptions.Item>
           <Descriptions.Item label="角色">{user?.role}</Descriptions.Item>
           <Descriptions.Item label="注册时间">
             {dayjs(user?.createdAt).format('YYYY-MM-DD HH:mm')}
           </Descriptions.Item>
         </Descriptions>
       </Card>
     </div>

    {/* <div className="profile-container">
      <h2>个人中心</h2>
      <p>欢迎，{user?.username}！</p>
      <p>您的角色：{user?.role}</p>
      <p>注册时间：{new Date(user?.createdAt).toLocaleDateString()}</p>
      <p>审核中：<Tag color="orange">等待审核</Tag></p>
      <p>报名成功：<Tag color="green">报名成功</Tag></p>
      <p>报名失败：<Tag color="red">报名失败</Tag></p>
      <p>已取消：<Tag color="volcano">已取消</Tag></p> */}


      {/* 使用 Tabs 组件 */}
      <Tabs defaultActiveKey="1">
        <TabPane tab="我的活动" key="1">
          <Timeline mode="alternate">
            {userEvents.map(event => (
              <Timeline.Item
                key={event.id}
                dot={statusConfig[event.status].icon}
                color={statusConfig[event.status].color}
              >
                <div className="event-item">
                  <h4>{event.title}</h4>
                  <p>状态：{statusConfig[event.status].text}</p>
                  <div className="event-actions">
                    {renderActions(event)}
                  </div>
                </div>
              </Timeline.Item>
            ))}
          </Timeline>
        </TabPane>
      </Tabs>

      <Modal
        title={modalType === 'feedback' ? '活动反馈' : '活动签到'}
        visible={!!modalType}
        onCancel={() => setModalType(null)}
        footer={null}
      >
        {modalType === 'feedback' ? (
          <FeedbackForm 
            eventId={selectedEvent?.id} 
            onSubmit={() => setModalType(null)}
          />
        ) : (
          <CheckInForm 
            eventId={selectedEvent?.id}
            onCheckIn={() => checkInEvent(selectedEvent.id, user.id)}
          />
        )}
      </Modal>
    </div>
  );
};