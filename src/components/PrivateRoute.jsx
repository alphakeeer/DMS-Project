// // // @/components/PrivateRoute.jsx OKOKOK
// import { Navigate, useLocation } from 'react-router-dom'; // 必须导入 Navigate
// import { useAuthStore } from '@/stores/authStore';

// export default function PrivateRoute({ roles, children }) {
//   const { user } = useAuthStore();
//   const location = useLocation();

  
//   // 未登录 → 跳转登录页
//   if (!user) {
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   // 角色校验失败 → 跳转首页
//   if (roles && !roles.some(role => user.roles?.includes(role))) {
//     return <Navigate to="/" replace />;
//   }

//   return children;
// }



import { Navigate, useLocation } from 'react-router-dom'; // 必须导入 Navigate
import { useAuthStore } from '@/stores/authStore';

// export default function PrivateRoute({ roles, children }) {
//   const { user } = useAuthStore();
//   const location = useLocation();

  
//   // 未登录 → 跳转登录页
//   if (!user) {
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   // 角色校验失败 → 跳转首页
//   if (roles && !roles.some(role => user.roles?.includes(role))) {
//     return <Navigate to="/" replace />;
//   }

//   return children;
// }

// 基础私有路由（需登录）
export const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// 组织者专属路由（需激活权限）
export const OrganizerRoute = ({ children }) => {
  const { isOrganizer } = useAuthStore();
  return isOrganizer ? children : <Navigate to="/no-permission" />;
};

// 混合权限路由（示例）
export const HybridRoute = ({ organizerOnly, children }) => {
  const { isOrganizer, isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (organizerOnly && !isOrganizer) return <Navigate to="/no-permission" />;
  
  return children;
};


// import { Navigate } from 'react-router-dom'; // 确保导入 Navigate

// // 权限路由组件
// function PrivateRoute({ children, roles = [] }) {
//   const { user, isLoading } = useAuthStore();
//   const location = useLocation();

//   if (isLoading) {
//     return <Spin fullscreen tip="权限校验中..." />;
//   }

//   if (!user) {
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   if (roles.length > 0 && !roles.includes(user.role)) {
//     return <Navigate to="/" replace />;
//   }

//   return children;
// }




// function PrivateRoute({ children, roles = [] }) {
//     const { user, isLoading } = useAuthStore();
//     const location = useLocation();

//     if (isLoading) {
//         return <Spin fullscreen tip="权限校验中..." />;
//     }

//     if (!user) {
//         return <Navigate to="/login" state={{ from: location }} replace />;
//     }

//     if (roles.length > 0 && !roles.includes(user.role)) {
//         return <Navigate to="/" replace />;
//     }

//     return children;
// }