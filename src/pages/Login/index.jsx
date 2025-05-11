import { Form, Input, Button, Checkbox } from 'antd'
import { useAuthStore } from '@/stores/authStore'

export default function LoginPage() {
  const { login } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const onFinish = async (values) => {
    try {
      setLoading(true)
      await login(values)
      const redirectTo = location.state?.from?.pathname || '/'
      navigate(redirectTo)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <Form onFinish={onFinish}>
        <Form.Item
          name="username"
          rules={[{ required: true }]}
        >
          <Input placeholder="用户名" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true }]}
        >
          <Input.Password placeholder="密码" />
        </Form.Item>

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
            block
          >
            登录
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}