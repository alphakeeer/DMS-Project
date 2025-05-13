// src/components/Navbar.jsx
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav>
      <Link to="/">首页</Link>
      <Link to="/EventDetail">活动列表</Link>
      <Link to="/CreateEvent">创建活动</Link>
      <Link to="/Profile">个人中心</Link>
    </nav>
  )
}