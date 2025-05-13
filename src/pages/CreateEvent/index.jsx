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


//OKOKOKOK
// import { useNavigate } from 'react-router-dom'; // 必须从 react-router-dom 导入

// import { useState } from 'react'
// import { Form, Input, DatePicker, Button, message, InputNumber } from 'antd'
// import { useEventStore } from '@/stores/eventStore'
// console.log('组件已加载'); // 控制台有输出说明组件加载成功

// // 新增样式常量
// const FORM_STYLE = {
//   maxWidth: 800,
//   margin: '0 auto',
//   padding: '24px 16px',
//   background: '#fff',
//   borderRadius: 8
// };

// const CreateEventPage = ({ sidebarCollapsed }) => {
//   const [form] = Form.useForm()
//   const { createEvent } = useEventStore()
//   const [submitting, setSubmitting] = useState(false)
//   const navigate = useNavigate();
  
//   const handleSubmit = async (values) => {
//     try {
//       setSubmitting(true)
      
//       // 验证时间范围
//       if (!values.time || values.time.length < 2) {
//         throw new Error('请选择完整的时间范围')
//       }

//       await createEvent({
//         title: values.title,
//         capacity: values.capacity,
//         startTime: values.time[0].toISOString(),
//         endTime: values.time[1].toISOString()
//       })
      
//       message.success('活动创建成功！')
//       form.resetFields()
//     } catch (err) {
//       message.error(`创建失败: ${err.message}`)
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   return (
//     <div 
//       style={{ 
//         // 动态边距适配侧边栏
//         marginLeft: sidebarCollapsed ? 80 : 200,
//         transition: 'margin 0.2s',
//         minHeight: '100vh',
//         padding: 24
//       }}
//     >
//       <div style={FORM_STYLE}>
//         <h2 style={{ 
//           marginBottom: 24, 
//           textAlign: 'center',
//           fontSize: 24,
//           color: '#1890ff'
//         }}>
//           创建新活动
//         </h2>
        
//         <Form        
//         form={form}
//         onFinish={handleSubmit}
//         layout="vertical"
//         validateTrigger="onBlur"
//       >
//         <Form.Item
//           label="活动名称"
//           name="title"
//           rules={[
//             { required: true, message: '请输入活动名称' },
//             { max: 50, message: '名称不能超过50个字符' }
//           ]}
//         >
//           <Input 
//             placeholder="请输入活动名称（如：前端技术分享会）" 
//             allowClear
//           />
//         </Form.Item>

//         <Form.Item
//           label="活动时间"
//           name="time"
//           rules={[{ 
//             required: true, 
//             validator: (_, value) =>
//               value?.length === 2 ? 
//                 Promise.resolve() : 
//                 Promise.reject(new Error('请选择开始和结束时间'))
//           }]}
//         >
//           <DatePicker.RangePicker
//             showTime={{ format: 'HH:mm' }}
//             format="YYYY-MM-DD HH:mm"
//             style={{ width: '100%' }}
//           />
//         </Form.Item>

//         <Form.Item
//           label="参与人数限制"
//           name="capacity"
//           rules={[
//             { required: true, message: '请输入人数限制' },
//             { type: 'number', min: 1, max: 1000 }
//           ]}
//         >
//           <InputNumber 
//             min={1}
//             max={1000}
//             style={{ width: '100%' }}
//             placeholder="请输入1-1000之间的数字"
//           />
//         </Form.Item>

//         <Form.Item>
//           <Button 
//             type="primary" 
//             htmlType="submit" 
//             size="large"
//             loading={submitting}
//             block
//           >
//             {submitting ? '提交中...' : '立即发布'}
//           </Button>
//         </Form.Item>
//         </Form>
//       </div>
//     </div>
//   );
// };



// export default CreateEventPage  // 添加导出语句


import { Form, Input, DatePicker, InputNumber, Upload, Button, message, Card } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { useEventStore } from '@/stores/eventStore'
import React, { useState } from 'react'
import { Row,Col } from 'antd'
const normFile = (e) => {
  if (Array.isArray(e)) return e
  return e?.fileList
}

export default function CreateEventForm() {
  const [form] = Form.useForm()
  const { createEvent } = useEventStore()
  const [submitting, setSubmitting] = useState(false)

  const onFinish = async (values) => {
    try {
      setSubmitting(true)
      const formData = new FormData()
      // ...原有表单数据处理逻辑...
      await createEvent(formData)
      message.success('活动创建成功！')
      form.resetFields()
    } catch (error) {
      message.error('创建失败：' + error.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div 
      style={{ 
        marginLeft: 160, // 适配折叠侧边栏
        padding: '24px',
        minHeight: 'calc(100vh - 64px)',
        backgroundColor: '#f5f5f5'
      }}
    >
      <Card
        title="创建新活动"
        style={{ 
          maxWidth: 800,
          margin: '0 auto',
          borderRadius: 8,
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
        }}
        bodyStyle={{ padding: '24px' }}
      >
        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
          className="create-form"
          encType="multipart/form-data"
        >
          <Row gutter={16}>
            <Col span={24} md={12}>
              <Form.Item
                label="活动名称"
                name="title"
                rules={[{ required: true, message: '请输入活动名称' }]}
              >
                <Input placeholder="例如：前端技术研讨会" />
              </Form.Item>
            </Col>

            <Col span={24} md={12}>
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
            </Col>
          </Row>

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
            extra="建议尺寸：800x450px，大小不超过2MB"
          >
            <Upload
              listType="picture-card"
              accept="image/*"
              beforeUpload={() => false}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>上传封面</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit"
              size="large"
              block
              loading={submitting}
              style={{ marginTop: 16 }}
            >
              {submitting ? '提交中...' : '立即发布'}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}