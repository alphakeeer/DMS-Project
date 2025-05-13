import { Button, Form, Input, message } from 'antd';
import { useEventStore } from '@/stores/eventStore';

const CheckInForm = ({ eventId, onCheckIn }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async () => {
    try {
      setLoading(true);
      await onCheckIn();
      message.success('签到成功！');
      form.resetFields();
    } catch (error) {
      message.error('签到失败: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form form={form} onFinish={handleSubmit}>
      <Form.Item
        name="verificationCode"
        label="签到验证码"
        rules={[{ required: true, message: '请输入活动提供的验证码' }]}
      >
        <Input placeholder="输入组织者提供的6位验证码" />
      </Form.Item>
      
      <Button 
        type="primary" 
        htmlType="submit"
        loading={loading}
      >
        确认签到
      </Button>
    </Form>
  );
};

export default CheckInForm; // 确保导出组件