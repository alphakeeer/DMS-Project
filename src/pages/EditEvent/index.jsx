import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, DatePicker, Button, message } from 'antd';
import { useEventStore } from '@/stores/eventStore';
import dayjs from 'dayjs';

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { events, updateEvent } = useEventStore();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  
  const event = events.find(e => e.id === id);

  const onFinish = async (values) => {
    try {
      setSubmitting(true);
      const updatedEvent = {
        ...values,
        date: values.date.format('YYYY-MM-DD'),
        time: values.time.format('HH:mm')
      };
      await updateEvent(id, updatedEvent);
      message.success('活动更新成功！');
      navigate(`/event/${id}`);
    } catch (error) {
      message.error('更新失败: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="edit-event-container">
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          ...event,
          date: dayjs(event.date),
          time: dayjs(event.time, 'HH:mm')
        }}
        onFinish={onFinish}
      >
        <Form.Item
          name="title"
          label="活动标题"
          rules={[{ required: true, message: '请输入活动标题' }]}
        >
          <Input placeholder="例如：前端开发技术分享会" />
        </Form.Item>

        <Form.Item
          name="date"
          label="活动日期"
          rules={[{ required: true, message: '请选择活动日期' }]}
        >
          <DatePicker format="YYYY-MM-DD" />
        </Form.Item>

        <Form.Item
          name="time"
          label="活动时间"
          rules={[{ required: true, message: '请选择活动时间' }]}
        >
          <DatePicker.TimePicker format="HH:mm" />
        </Form.Item>

        <Form.Item
          name="capacity"
          label="参与名额"
          rules={[{ required: true, message: '请输入活动名额' }]}
        >
          <InputNumber min={1} max={1000} />
        </Form.Item>

        <Form.Item
          name="description"
          label="活动详情"
          rules={[{ required: true, message: '请输入活动描述' }]}
        >
          <Input.TextArea rows={6} />
        </Form.Item>

        <Button 
          type="primary" 
          htmlType="submit"
          loading={submitting}
        >
          保存修改
        </Button>
      </Form>
    </div>
  );
};

export default EditEvent;   