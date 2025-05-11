import { Form, Input, DatePicker, InputNumber, Upload, Button, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { useEventStore } from '@/stores/eventStore'

const normFile = (e) => {
  if (Array.isArray(e)) return e
  return e?.fileList
}

export default function CreateEventForm() {
  const [form] = Form.useForm()
  const { createEvent } = useEventStore()

  const onFinish = async (values) => {
    try {
      const formData = new FormData()
      Object.entries(values).forEach(([key, value]) => {
        if (key === 'time') {
          formData.append('startTime', value[0].toISOString())
          formData.append('endTime', value[1].toISOString())
        } else if (key === 'cover') {
          value.forEach(file => {
            formData.append('files', file.originFileObj)
          })
        } else {
          formData.append(key, value)
        }
      })
      
      await createEvent(formData)
      message.success('活动创建成功！')
      form.resetFields()
    } catch (error) {
      message.error('创建失败：' + error.message)
    }
  }

  return (
    <Form
      form={form}
      onFinish={onFinish}
      layout="vertical"
      className="create-form"
      encType="multipart/form-data"
    >
      <Form.Item
        label="活动名称"
        name="title"
        rules={[{ required: true, message: '请输入活动名称' }]}
      >
        <Input placeholder="例如：前端技术研讨会" />
      </Form.Item>

      <Form.Item
        label="活动时间"
        name="time"
        rules={[{ required: true, message: '请选择活动时间范围' }]}
      >
        <DatePicker.RangePicker
          showTime
          format="YYYY-MM-DD HH:mm"
          style={{ width: '100%' }}
        />
      </Form.Item>

      <Form.Item
        label="活动地点"
        name="location"
        rules={[{ required: true, message: '请输入详细地点' }]}
      >
        <Input placeholder="例如：北京市海淀区中关村大街1号" />
      </Form.Item>

      <Form.Item
        label="人数限制"
        name="capacity"
        rules={[{ required: true, message: '请输入人数限制' }]}
      >
        <InputNumber 
          min={1} 
          max={1000} 
          style={{ width: '100%' }}
          placeholder="最大参与人数"
        />
      </Form.Item>

      <Form.Item
        label="活动描述"
        name="description"
        rules={[{ required: true, message: '请输入活动详细描述' }]}
      >
        <Input.TextArea rows={4} />
      </Form.Item>

      <Form.Item
        label="封面图片"
        name="cover"
        valuePropName="fileList"
        getValueFromEvent={normFile}
        rules={[{ required: true, message: '请上传封面图片' }]}
      >
        <Upload
          listType="picture-card"
          accept="image/*"
          beforeUpload={() => false} // 禁用自动上传
        >
          <Button icon={<UploadOutlined />}>上传图片</Button>
        </Upload>
      </Form.Item>

      <Form.Item>
        <Button 
          type="primary" 
          htmlType="submit"
          size="large"
          className="submit-btn"
        >
          立即发布
        </Button>
      </Form.Item>
    </Form>
  )
}