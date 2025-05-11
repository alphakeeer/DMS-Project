import { Card, Descriptions, Button } from 'antd'
import { useAuthStore } from '@/stores/authStore'

export default function ProfilePage() {
  const { user, logout } = useAuthStore()

  return (
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
  )
}