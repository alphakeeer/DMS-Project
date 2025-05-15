
import { UserOutlined, LockOutlined, IdcardOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import CheckInForm from '@/components/CheckInForm';
import { useState } from 'react';
import { Row, Switch, Space, Tabs, Tag, Button, Modal, Timeline, Card, Descriptions, Form, Input, message, Alert } from 'antd';
import { 
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  FormOutlined,
  EditOutlined
} from '@ant-design/icons';
import { useAuthStore } from '@/stores/authStore';
import { useEventStore } from '@/stores/eventStore';
import FeedbackForm from '@/components/FeedbackForm';

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
  const { user, logout, updateUser, updateProfileWithCode } = useAuthStore();
  const { events, submitFeedback, checkInEvent } = useEventStore();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('basic'); // 新增状态管理
  const [form] = Form.useForm();

  const userEvents = events.filter(e => 
    e.participants.some(p => p.userId === user?.id)
  );

  const handleAction = (event, actionType) => {
    setSelectedEvent(event);
    setModalType(actionType);
  };

  const handleUpdateInfo = async (values) => {
    try {
      const updateData = {};

       // 处理密码修改
    if (values.currentPassword || values.password) {
      // 验证必填字段
      if (!values.currentPassword) {
        throw new Error('请输入当前密码');
      }
      if (!values.password) {
        throw new Error('请输入新密码');
      }
      if (values.password !== values.confirmPassword) {
        throw new Error('两次输入的密码不一致');
      }

      // 验证当前密码（这里需要调用API）
      const isPasswordValid = await verifyCurrentPassword(values.currentPassword);
      if (!isPasswordValid) {
        throw new Error('当前密码不正确');
      }

      updateData.password = values.password;
    }
      // // 处理密码修改
      // if (values.password) {
      //   if (values.password !== values.confirmPassword) {
      //     throw new Error('两次输入的密码不一致');
      //   }
      //   updateData.password = values.password;
      // }

      // 处理激活码
      if (values.activationCode) {
        await updateProfileWithCode(values.activationCode);
        message.success('权限激活成功！');
      }

      // 更新基础信息
      const basicInfoChanged = 
        values.username !== user?.username ||
        values.email !== user?.email ||
        values.phone !== user?.phone;

      if (basicInfoChanged) {
        await updateUser({
          username: values.username,
          email: values.email,
          phone: values.phone
        });
      }

      message.success('修改成功');
      setEditModalVisible(false);
    } catch (error) {
      message.error('修改失败: ' + error.message);
    }
  };

  const renderEditForm = () => (
    <Form
      form={form}
      initialValues={user}
      onFinish={handleUpdateInfo}
      layout="vertical"
    >
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        tabBarExtraContent={
          <Button 
            onClick={() => {
              form.resetFields();
              setEditModalVisible(false);
            }}
          >
            取消
          </Button>
        }
      >

        {/* <TabPane tab="修改密码" key="password">
          <Form.Item
            name="password"
            label="新密码"
            rules={[
              { required: true, message: '请输入新密码' },
              { min: 8, message: '密码至少8位' }
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />}
              placeholder="至少8位字符"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="确认密码"
            dependencies={['password']}
            rules={[
              { required: true, message: '请再次输入密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject('两次输入的密码不一致');
                },
              }),
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />}
              placeholder="再次输入新密码"
            />
          </Form.Item>
        </TabPane> */}
        
  <TabPane tab="修改密码" key="password">
        {/* 新增当前密码字段 */}
        <Form.Item
          name="currentPassword"
          label="当前密码"
          rules={[
            { required: true, message: '请输入当前密码' }
          ]}
        >
          <Input.Password 
            prefix={<LockOutlined />}
            placeholder="请输入当前密码"
          />
        </Form.Item>

        <Form.Item
          name="password"
          label="新密码"
          rules={[
            { required: true, message: '请输入新密码' },
            { min: 8, message: '密码至少8位' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (value === getFieldValue('currentPassword')) {
                  return Promise.reject('新密码不能与当前密码相同');
                }
                return Promise.resolve();
              },
            }),
          ]}
        >
          <Input.Password 
            prefix={<LockOutlined />}
            placeholder="至少8位字符"
          />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="确认新密码"
          dependencies={['password']}
          rules={[
            { required: true, message: '请再次输入新密码' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject('两次输入的密码不一致');
              },
            }),
          ]}
        >
          <Input.Password 
            prefix={<LockOutlined />}
            placeholder="再次输入新密码"
          />
        </Form.Item>
      </TabPane>

        <TabPane tab="权限管理" key="permission">
          <Form.Item
            label="激活码"
            name="activationCode"
            extra="输入组织者激活码获取管理权限"
          >
            <Input placeholder="从管理员处获取的激活码" />
          </Form.Item>

          {user?.isOrganizer && (
            <Alert
              type="success"
              message="您已拥有组织者权限"
              showIcon
            />
          )}
        </TabPane>
      </Tabs>

      <Form.Item style={{ marginTop: 24 }}>
        <Button 
          type="primary" 
          htmlType="submit"
          block
        >
          确认修改
        </Button>
      </Form.Item>
    </Form>
  );

  const renderActions = (event) => {
    const participant = event.participants.find(p => p.userId === user?.id);
    
    switch (participant?.status) {
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
        <Card 
          title="个人信息" 
          extra={
            <Space>
              <Button 
                icon={<EditOutlined />}
                onClick={() => setEditModalVisible(true)}
              >
                修改信息
              </Button>
              <Button onClick={logout}>退出登录</Button>
            </Space>
          }
        >
          <Descriptions column={1}>
            <Descriptions.Item label="账号（邮箱）">{user?.email || '未设置'}</Descriptions.Item>
            <Descriptions.Item label="角色">{user?.role}</Descriptions.Item>
            <Descriptions.Item label="注册时间">
              {dayjs(user?.createdAt).format('YYYY-MM-DD HH:mm')}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </div>

      <Modal
        title="账户设置"
        visible={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
        width={600}
        destroyOnClose
      >
        {renderEditForm()}
      </Modal>

      <Tabs defaultActiveKey="1">
        <TabPane tab="我的活动" key="1">
          <Timeline mode="alternate">
            {userEvents.map(event => (
              <Timeline.Item
                key={event.id}
                dot={statusConfig[event.status]?.icon}
                color={statusConfig[event.status]?.color}
              >
                <div className="event-item">
                  <h4>{event.title}</h4>
                  <p>状态：{statusConfig[event.status]?.text}</p>
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