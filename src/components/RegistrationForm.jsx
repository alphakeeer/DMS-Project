// import { Form, Input, Button } from 'antd';
// import { authAPI } from '../api/auth';
// import { useAuthStore } from '../stores/authStore';

// export default function RegistrationForm() {
//   const { register } = useAuthStore();

//   const onFinish = async (values) => {
//     try {
//       await register({
//         name: values.name,
//         account: values.email,
//         password: values.password,
//         activation_code: values.activationCode
//       });
//       message.success('注册成功！');
//     } catch (error) {
//       message.error(`注册失败: ${error.message}`);
//     }
//   };

//   return (
//     <Form onFinish={onFinish}>
//       <Form.Item name="activationCode" label="组织者激活码">
//         <Input placeholder="输入激活码获得管理权限" />
//       </Form.Item>
//       {/* 其他表单项 */}
//     </Form>
//   );
// }