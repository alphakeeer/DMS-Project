import { Form, Rate, Button, Input } from 'antd';
import { useEventStore } from '@/stores/eventStore';

const FeedbackForm = ({ eventId, onSubmit }) => {
  const [form] = Form.useForm();
  const { submitFeedback } = useEventStore();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (values) => {
    try {
      setSubmitting(true);
      await submitFeedback(eventId, values);
      form.resetFields();
      onSubmit?.();
      message.success('反馈提交成功！');
    } catch (error) {
      message.error('提交失败: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form form={form} onFinish={handleSubmit}>
      <Form.Item
        name="rating"
        label="活动评分"
        rules={[{ required: true, message: '请为活动评分' }]}
      >
        <Rate allowHalf />
      </Form.Item>

      <Form.Item
        name="comment"
        label="活动评价"
        rules={[{ max: 500, message: '评价不超过500字' }]}
      >
        <Input.TextArea
          rows={4}
          placeholder="请分享您的活动体验..."
          showCount
          maxLength={500}
        />
      </Form.Item>

      <Button 
        type="primary" 
        htmlType="submit"
        loading={submitting}
      >
        提交反馈
      </Button>
    </Form>
  );
};
export default { FeedbackForm };