// src/components/Navbar.jsx
// import { Link } from "react-router-dom";

// export default function Navbar() {
//   return (
//     <nav>
//       <Link to="/">首页</Link>
//       <Link to="/EventDetail">活动列表</Link>
//       <Link to="/CreateEvent">创建活动</Link>
//       <Link to="/Profile">个人中心</Link>
//     </nav>
//   )
// }

import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav>
       <Link to="/">首页</Link>
       <Link to="/events">活动列表</Link>
       <Link to="/create-event">创建活动</Link>
       <Link to="/profile">个人中心</Link>
      <Link to="/my-activities" style={{ marginLeft: 16 }}>
        我的活动
      </Link>
    </nav>
  )
}