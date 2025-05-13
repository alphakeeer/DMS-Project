// import { Form, Input, Button, Checkbox } from 'antd'
// import { useAuthStore } from '@/stores/authStore'
// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom'; // 必须从 react-router-dom 导入
// import { useLocation } from 'react-router-dom'; // 正确应为 react-router-dom

// export default function LoginPage() {
//   const { login } = useAuthStore()
//   const [loading, setLoading] = useState(false)
//   const navigate = useNavigate()
//   const location = useLocation()

//   const onFinish = async (values) => {
//     try {
//       setLoading(true)
//       await login(values)
//       const redirectTo = location.state?.from?.pathname || '/'
//       navigate(redirectTo)
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="login-container">
//       <Form onFinish={onFinish}>
//         <Form.Item
//           name="username"
//           rules={[{ required: true }]}
//         >
//           <Input placeholder="用户名" />
//         </Form.Item>

//         <Form.Item
//           name="password"
//           rules={[{ required: true }]}
//         >
//           <Input.Password placeholder="密码" />
//         </Form.Item>

//         <Form.Item>
//           <Button 
//             type="primary" 
//             htmlType="submit" 
//             loading={loading}
//             block
//           >
//             登录
//           </Button>
          
//         </Form.Item>
//       </Form>
//     </div>
//   )
// }


//无限制登录OKOKOK
import { useState } from 'react';
import { Button, Form, Input, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import { useAuthStore } from '@/stores/authStore';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser); // 获取设置用户的函数

  const { login } = useAuthStore(); // 使用登录方法

  // const onFinish = async (values) => {
  //   try {
      
  //     // 模拟登录API返回数据
  //     const res = { 
  //       token: 'mock-token', 
  //       user: { 
  //         id: '123', 
  //         username: values.username,
  //         isOrganizer: false,
  //         registeredEvents: [] 
  //       }
  //     };
      const onFinish = async (values) => {
        setLoading(true);
        try {
          // 直接调用store的login方法
          await useAuthStore.getState().login(values);
          

      // // 正确调用登录方法
      // await login({ 
      //   token: res.token,
      //   user: res.user 
      // });
      
      message.success('登录成功');
      navigate(location.state?.from || '/'); // 返回来源页面
    } catch (error) {
      // 错误处理
    }
  };

//   const onFinish = async (values) => {
//     setLoading(true);
//     try {
//       // 替换为实际的登录API调用
//       console.log('登录请求:', values);
//       // await loginApi(values);
//       const userData = { username: values.username, role: 'organizer' }; // 模拟用户数据
//       setUser(userData); // 更新状态管理中的用户
//       message.success('登录成功');
//       navigate('/'); // 登录成功后跳转到首页
//     } catch (error) {
//       message.error(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };



  return (
    <div className="login-container" style={{ maxWidth: 400, margin: '0 auto', paddingTop: 100 }}>
      <h1 style={{ textAlign: 'center', marginBottom: 24 }}>用户登录</h1>
      
      <Form
        name="login"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: '请输入用户名!' }]}
        >
          <Input prefix={<UserOutlined />} placeholder="用户名" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: '请输入密码!' }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="密码" />
        </Form.Item>

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            block 
            loading={loading}
          >
            登录
          </Button>
        </Form.Item>

        <div style={{ textAlign: 'center' }}>
          <Link to="/register">没有账号？立即注册</Link>
        </div>
      </Form>
    </div>
  );
}




// import { useState } from 'react';
// import { Button, Form, Input, message } from 'antd';
// import { Link, useNavigate } from 'react-router-dom';
// import { UserOutlined, LockOutlined } from '@ant-design/icons';
// import { useAuthStore } from '@/stores/authStore'; // 导入状态管理

// const LoginPage = () => {
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const setUser = useAuthStore((state) => state.setUser); // 获取设置用户的函数

//   const onFinish = async (values) => {
//     setLoading(true);
//     try {
//       // 替换为实际的登录API调用
//       console.log('登录请求:', values);
//       // await loginApi(values);
//       const userData = { username: values.username, role: 'organizer' }; // 模拟用户数据
//       setUser(userData); // 更新状态管理中的用户
//       message.success('登录成功');
//       navigate('/create-event'); // 登录成功后跳转到创建活动页面
//     } catch (error) {
//       message.error(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//         <div className="login-container" style={{ maxWidth: 400, margin: '0 auto', paddingTop: 100 }}>
//           <h1 style={{ textAlign: 'center', marginBottom: 24 }}>用户登录</h1>
//           
//           <Form
//             name="login"
//             initialValues={{ remember: true }}
//             onFinish={onFinish}
//             autoComplete="off"
//           >
//             <Form.Item
//               name="username"
//               rules={[{ required: true, message: '请输入用户名!' }]}
//             >
//               <Input prefix={<UserOutlined />} placeholder="用户名" />
//             </Form.Item>
    
//             <Form.Item
//               name="password"
//               rules={[{ required: true, message: '请输入密码!' }]}
//             >
//               <Input.Password prefix={<LockOutlined />} placeholder="密码" />
//             </Form.Item>
    
//             <Form.Item>
//               <Button 
//                 type="primary" 
//                 htmlType="submit" 
//                 block 
//                 loading={loading}
//               >
//                 登录
//               </Button>
//             </Form.Item>
    
//             <div style={{ textAlign: 'center' }}>
//               <Link to="/register">没有账号？立即注册</Link>
//             </div>
//           </Form>
//         </div>
//       );
//     }