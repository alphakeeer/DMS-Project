import { useState } from 'react';
import { Form, Input, Button, Select, message } from 'antd';
import { UserOutlined, LockOutlined, IdcardOutlined, TeamOutlined, CrownOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';

const { Option } = Select;
import { Modal } from 'antd';
import { useAuthStore } from '@/stores/authStore';

export default function RegisterPage() {
  const [form] = Form.useForm();
  const { validateActivationCode } = useAuthStore();

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
  
    // 部门选项（根据实际需求调整）
    const departments = [
      '技术部',
      '产品部',
      '市场部',
      '人力资源',
      '财务部',
      '行政部'
    ];
  
//     // 注册提交处理
//     const handleRegister = async (values) => {
//       try {
//         setLoading(true);
//         // 这里替换为实际的注册API调用
//         console.log('注册数据:', values);
//         // await registerApi(values);
//         message.success('注册成功！');
//         navigate('/login'); // 跳转到登录页
//       } catch (error) {
//         message.error(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

  const handleSubmit = async (values) => {
    if (values.activationCode) {
      const result = await validateActivationCode(values.activationCode);
      if (!result.success) {
        Modal.error({ content: '激活码无效' });
        return;
      }
    }
    // 提交注册逻辑...
            try {
              setLoading(true);
              // 这里替换为实际的注册API调用
              console.log('注册数据:', values);
              // await registerApi(values);
              message.success('注册成功！');
              navigate('/login'); // 跳转到登录页
            } catch (error) {
              message.error(error.message);
            } finally {
              setLoading(false);
            }
  };

  return (
       <div style={{ maxWidth: 500, margin: '0 auto', padding: '50px 20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: 24 }}>用户注册</h1>
      <Form
        name="register"
        form={form} 
        onFinish={handleSubmit}
        autoComplete="off"
      >
        
    <Form >
      {/* 姓名 */}
        <Form.Item
          name="name"
          rules={[{ required: true, message: '请输入真实姓名!' }]}
        >
          <Input 
            prefix={<IdcardOutlined />} 
            placeholder="姓名（如：张三）" 
          />
        </Form.Item>
        {/* 部门（下拉选择） */}
        <Form.Item
          name="department"
          rules={[{ required: true, message: '请选择部门!' }]}
        >
          <Select
            placeholder="选择部门"
            prefix={<TeamOutlined />}
          >
            {departments.map(dept => (
              <Option key={dept} value={dept}>{dept}</Option>
            ))}
          </Select>
        </Form.Item>

        {/* 职位 */}
        <Form.Item
          name="position"
          rules={[{ required: true, message: '请输入职位!' }]}
        >
          <Input 
            prefix={<CrownOutlined />} 
            placeholder="职位（如：前端工程师）" 
    />
        </Form.Item>

        {/* 用户名 */}
        <Form.Item
          name="username"
          rules={[{ required: true, message: '请输入用户名!' }]}
        >
          <Input 
            prefix={<UserOutlined />} 
            placeholder="用户名（用于登录）" 
          />
        </Form.Item>
    </Form>

            {/* 密码 */}
        <Form.Item
          name="password"
          rules={[
            { required: true, message: '请输入密码!' },
            { min: 8, message: '密码至少8位!' }
          ]}
        >
          <Input.Password 
            prefix={<LockOutlined />} 
            placeholder="密码（至少8位）" 
          />
        </Form.Item>

        {/* 确认密码 */}
        <Form.Item
          name="confirmPassword"
          dependencies={['password']}
          rules={[
            { required: true, message: '请再次输入密码!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('两次密码不一致!'));
              },
            }),
          ]}
        >
          <Input.Password 
            prefix={<LockOutlined />} 
            placeholder="确认密码" 
          />
        </Form.Item>
      {/* 选填激活码 */}
      <Form.Item name="activationCode" label="组织者激活码（可选）">
        <Input placeholder="输入激活码获取管理权限" />
      </Form.Item>
        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            block 
            loading={loading}
          >
            注册
          </Button>
        </Form.Item>

        <div style={{ textAlign: 'center' }}>
          <Link to="/login">已有账号？立即登录</Link>
        </div>
      </Form>
    </div>
  );
};








//   return (
//     <div style={{ maxWidth: 500, margin: '0 auto', padding: '50px 20px' }}>
//       <h1 style={{ textAlign: 'center', marginBottom: 24 }}>用户注册</h1>
//       <Form
//         name="register"
//         onFinish={handleRegister}
//         autoComplete="off"
//       >
//         {/* 姓名 */}
//         <Form.Item
//           name="name"
//           rules={[{ required: true, message: '请输入真实姓名!' }]}
//         >
//           <Input 
//             prefix={<IdcardOutlined />} 
//             placeholder="姓名（如：张三）" 
//           />
//         </Form.Item>

//         {/* 部门（下拉选择） */}
//         <Form.Item
//           name="department"
//           rules={[{ required: true, message: '请选择部门!' }]}
//         >
//           <Select
//             placeholder="选择部门"
//             prefix={<TeamOutlined />}
//           >
//             {departments.map(dept => (
//               <Option key={dept} value={dept}>{dept}</Option>
//             ))}
//           </Select>
//         </Form.Item>

//         {/* 职位 */}
//         <Form.Item
//           name="position"
//           rules={[{ required: true, message: '请输入职位!' }]}
//         >
//           <Input 
//             prefix={<CrownOutlined />} 
//             placeholder="职位（如：前端工程师）" 
//     />
//         </Form.Item>

//         {/* 用户名 */}
//         <Form.Item
//           name="username"
//           rules={[{ required: true, message: '请输入用户名!' }]}
//         >
//           <Input 
//             prefix={<UserOutlined />} 
//             placeholder="用户名（用于登录）" 
//           />
//         </Form.Item>

//         {/* 激活码（选填） */}
//         <Form.Item
//           name="activationCode"
//           rules={[{ required: false }]}
//         >
//           <Input 
//             placeholder="激活码（如有）" 
//           />
//         </Form.Item>

//         {/* 密码 */}
//         <Form.Item
//           name="password"
//           rules={[
//             { required: true, message: '请输入密码!' },
//             { min: 8, message: '密码至少8位!' }
//           ]}
//         >
//           <Input.Password 
//             prefix={<LockOutlined />} 
//             placeholder="密码（至少8位）" 
//           />
//         </Form.Item>

//         {/* 确认密码 */}
//         <Form.Item
//           name="confirmPassword"
//           dependencies={['password']}
//           rules={[
//             { required: true, message: '请再次输入密码!' },
//             ({ getFieldValue }) => ({
//               validator(_, value) {
//                 if (!value || getFieldValue('password') === value) {
//                   return Promise.resolve();
//                 }
//                 return Promise.reject(new Error('两次密码不一致!'));
//               },
//             }),
//           ]}
//         >
//           <Input.Password 
//             prefix={<LockOutlined />} 
//             placeholder="确认密码" 
//           />
//         </Form.Item>

//         <Form.Item>
//           <Button 
//             type="primary" 
//             htmlType="submit" 
//             block 
//             loading={loading}
//           >
//             注册
//           </Button>
//         </Form.Item>

//         <div style={{ textAlign: 'center' }}>
//           <Link to="/login">已有账号？立即登录</Link>
//         </div>
//       </Form>
//     </div>
//   );
// }