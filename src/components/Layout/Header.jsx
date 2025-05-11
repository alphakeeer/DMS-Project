import { Menu, Dropdown, Avatar } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'

export default function Header() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const menuItems = [
    { key: 'home', label: <Link to="/">首页</Link> },
    { key: 'create', label: <Link to="/create-event">创建活动</Link> },
    { key: 'dashboard', label: <Link to="/dashboard">数据看板</Link> }
  ]

  const userMenu = (
    <Menu
      items={[
        { key: 'profile', label: <Link to="/profile">个人中心</Link> },
        { type: 'divider' },
        { key: 'logout', label: '退出登录', onClick: logout }
      ]}
    />
  )

  return (
    <div className="app-header">
      <div className="logo">EventMgr</div>
      <Menu 
        theme="dark" 
        mode="horizontal" 
        items={menuItems} 
        selectedKeys={[]}
      />
      <div className="user-panel">
        {user ? (
          <Dropdown overlay={userMenu} trigger={['click']}>
            <div className="user-info">
              <Avatar src={user.avatar} style={{ marginRight: 8 }}/>
              <span className="username">{user.name}</span>
            </div>
          </Dropdown>
        ) : (
          <Link to="/login">登录/注册</Link>
        )}
      </div>
    </div>
  )
}