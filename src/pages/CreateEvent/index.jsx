// import { Form, Input, DatePicker, Button, message } from 'antd'
// import { useEventStore } from '@/stores/eventStore'

// const CreateEventPage = () => {
//   const [form] = Form.useForm()
//   const { createEvent } = useEventStore()

//   const onFinish = async (values) => {
//     try {
//       await createEvent({
//         ...values,
//         startTime: values.time[0].toISOString(),
//         endTime: values.time[1].toISOString()
//       })
//       message.success('活动创建成功！')
//       form.resetFields()
//     } catch (err) {
//       message.error('创建失败')
//     }
//   }

//   return (
//     <div className="form-container">
//       <Form form={form} onFinish={onFinish} layout="vertical">
//         <Form.Item
//           label="活动名称"
//           name="title"
//           rules={[{ required: true, message: '请输入活动名称' }]}
//         >
//           <Input placeholder="技术分享会" />
//         </Form.Item>

//         <Form.Item
//           label="活动时间"
//           name="time"
//           rules={[{ required: true, message: '请选择时间范围' }]}
//         >
//           <DatePicker.RangePicker showTime />
//         </Form.Item>

//         <Form.Item
//           label="最大人数"
//           name="capacity"
//           rules={[{ required: true, message: '请输入人数限制' }]}
//         >
//           <InputNumber min={1} max={1000} />
//         </Form.Item>

//         <Form.Item>
//           <Button type="primary" htmlType="submit" size="large">
//             发布活动
//           </Button>
//         </Form.Item>
//       </Form>
//     </div>
//   )
// }

import { useState } from 'react'
import { Form, Input, DatePicker, Button, message, InputNumber } from 'antd'
import { useEventStore } from '@/stores/eventStore'

const CreateEventPage = () => {
  const [form] = Form.useForm()
  const { createEvent } = useEventStore()
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (values) => {
    try {
      setSubmitting(true)
      
      // 验证时间范围
      if (!values.time || values.time.length < 2) {
        throw new Error('请选择完整的时间范围')
      }

      await createEvent({
        title: values.title,
        capacity: values.capacity,
        startTime: values.time[0].toISOString(),
        endTime: values.time[1].toISOString()
      })
      
      message.success('活动创建成功！')
      form.resetFields()
    } catch (err) {
      message.error(`创建失败: ${err.message}`)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="form-container" style={{ maxWidth: 800, margin: '0 auto' }}>
      <h2 style={{ marginBottom: 24, textAlign: 'center' }}>创建新活动</h2>
      
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        validateTrigger="onBlur"
      >
        <Form.Item
          label="活动名称"
          name="title"
          rules={[
            { required: true, message: '请输入活动名称' },
            { max: 50, message: '名称不能超过50个字符' }
          ]}
        >
          <Input 
            placeholder="请输入活动名称（如：前端技术分享会）" 
            allowClear
          />
        </Form.Item>

        <Form.Item
          label="活动时间"
          name="time"
          rules={[{ 
            required: true, 
            validator: (_, value) =>
              value?.length === 2 ? 
                Promise.resolve() : 
                Promise.reject(new Error('请选择开始和结束时间'))
          }]}
        >
          <DatePicker.RangePicker
            showTime={{ format: 'HH:mm' }}
            format="YYYY-MM-DD HH:mm"
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item
          label="参与人数限制"
          name="capacity"
          rules={[
            { required: true, message: '请输入人数限制' },
            { type: 'number', min: 1, max: 1000 }
          ]}
        >
          <InputNumber 
            min={1}
            max={1000}
            style={{ width: '100%' }}
            placeholder="请输入1-1000之间的数字"
          />
        </Form.Item>

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            size="large"
            loading={submitting}
            block
          >
            {submitting ? '提交中...' : '立即发布'}
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default CreateEventPage  // 添加导出语句