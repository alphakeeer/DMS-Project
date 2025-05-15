// import { Form, Input, DatePicker, InputNumber, Upload, Button, message, Card } from 'antd'
// import { UploadOutlined } from '@ant-design/icons'
// import { useEventStore } from '@/stores/eventStore'
// import React, { useState } from 'react'
// import { Row,Col } from 'antd'
// const normFile = (e) => {
//   if (Array.isArray(e)) return e
//   return e?.fileList
// }

// export default function CreateEventForm() {
//   const [form] = Form.useForm()
//   const { createEvent } = useEventStore()
//   const [submitting, setSubmitting] = useState(false)

//   const onFinish = async (values) => {
//     try {
//       setSubmitting(true)
//       const formData = new FormData()
//       // ...原有表单数据处理逻辑...
//       await createEvent(formData)
//       message.success('活动创建成功！')
//       form.resetFields()
//     } catch (error) {
//       message.error('创建失败：' + error.message)
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   return (
//     <div 
//       style={{ 
//         marginLeft: 160, // 适配折叠侧边栏
//         padding: '24px',
//         minHeight: 'calc(100vh - 64px)',
//         backgroundColor: '#f5f5f5'
//       }}
//     >
//       <Card
//         title="创建新活动"
//         style={{ 
//           maxWidth: 800,
//           margin: '0 auto',
//           borderRadius: 8,
//           boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
//         }}
//         bodyStyle={{ padding: '24px' }}
//       >
//         <Form
//           form={form}
//           onFinish={onFinish}
//           layout="vertical"
//           className="create-form"
//           encType="multipart/form-data"
//         >
//           <Row gutter={16}>
//             <Col span={24} md={12}>
//               <Form.Item
//                 label="活动名称"
//                 name="title"
//                 rules={[{ required: true, message: '请输入活动名称' }]}
//               >
//                 <Input placeholder="例如：前端技术研讨会" />
//               </Form.Item>
//             </Col>
//           </Row>
//         <Row gutter={16}>
//             <Col span={24} md={12}>
//            <Form.Item
//             label="活动对象（选填）"
//             name="role"
// //             rules={[{ required: true, message: '请输入活动面向对象' }]}
//           >
//             <Input placeholder="例如：本科生" />
//             </Form.Item>
//             </Col>
//         </Row>
//           <Row gutter={16}>
//             <Col span={24} md={12}>
//               <Form.Item
//                 label="最大人数限制"
//                 name="maxCapacity"
// //                 rules={[{ required: true, message: '请输入最大人数限制' }]}
//               >
//                 <InputNumber min={1} 
//                   max={1000} 
//                   style={{ width: '100%' }}
//                   placeholder="最大参与人数"
//                 />
//               </Form.Item>
//             </Col>
//             <Col span={24} md={12}>
//               <Form.Item
//                 label="最小人数限制"
//                 name="minCapacity"
//                 rules={[{ required: true, message: '请输入最小人数限制' }]}
//               >
//                 <InputNumber min={1} 
//                   max={1000} 
//                   style={{ width: '100%' }}
//                   placeholder="最小参与人数"
//                 />
//               </Form.Item>
//             </Col>
//         </Row>

//         <Form.Item
//             label="报名时间"
//             name="registerTime"
//             rules={[{ required: true, message: '请选择活动时间范围' }]}
//           >
//             <DatePicker.RangePicker
//               showTime
//               format="YYYY-MM-DD HH:mm"
//               style={{ width: '100%' }}
//             />
//           </Form.Item>

//           <Form.Item
//             label="活动时间"
//             name="eventTime"
//             rules={[{ required: true, message: '请选择活动时间范围' }]}
//           >
//             <DatePicker.RangePicker
//               showTime
//               format="YYYY-MM-DD HH:mm"
//               style={{ width: '100%' }}
//             />
//           </Form.Item>

//           <Form.Item
//             label="活动地点"
//             name="location"
// //             rules={[{ required: true, message: '请输入详细地点' }]}
//           >
//             <Input placeholder="例如：北京市海淀区中关村大街1号" />
//           </Form.Item>

//           <Form.Item
//             label="活动描述"
//             name="description"
//             rules={[{ required: true, message: '请输入活动详细描述' }]}
//           >
//             <Input.TextArea rows={4} />
//           </Form.Item>
// {/* {
//         id: 'example-id2',
//         title: '编程工作坊',
//         description: '学习基础编程技能',
//         startTime: '2025-10-02T14:00:00',
//         endTime: '2025-10-02T16:00:00',
//         registerstartTime: '2025-09-15T10:00:00',
//         registerendTime: '2025-10-01T12:00:00',
//         location: '计算机实验室',
//         status: 'published',
//         capacity: 30,
//         participants: [], // 初始化参与者列表
//         department: 'CS',
//         role: 'student'
//     }, */}
// {/*           <Form.Item
//             label="封面图片"
//             name="cover"
//             valuePropName="fileList"
//             getValueFromEvent={normFile}
//             rules={[{ required: true, message: '请上传封面图片' }]}
//             extra="建议尺寸：800x450px，大小不超过2MB"
//           > */}

// {/*             <Upload
//               listType="picture-card"
//               accept="image/*"
//               beforeUpload={() => false}
//               maxCount={1}
//             >
//               <Button icon={<UploadOutlined />}>上传封面</Button>
//             </Upload>
//           </Form.Item> */}

//           <Form.Item>
//             <Button 
//               type="primary" 
//               htmlType="submit"
//               size="large"
//               block
//               loading={submitting}
//               style={{ marginTop: 16 }}
//             >
//               {submitting ? '提交中...' : '立即发布'}
//             </Button>
//           </Form.Item>
//         </Form>
//       </Card>
//     </div>
//   )
// }


import { Form, Input, DatePicker, InputNumber, Button, message, Card } from 'antd';
import { useEventStore } from '@/stores/eventStore';
import React, { useState } from 'react';
import { Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid'; // 需要先安装uuid

const formatDateTime = (date) => dayjs(date).format('YYYY-MM-DDTHH:mm:ss');

export default function CreateEventForm() {
  const [form] = Form.useForm();
  const { createEvent } = useEventStore();
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      setSubmitting(true);
      
      // 转换时间格式
      const newEvent = {
        id: uuidv4(), // 生成唯一ID
        title: values.title,
        description: values.description,
        startTime: formatDateTime(values.eventTime[0]),
        endTime: formatDateTime(values.eventTime[1]),
        registerstartTime: formatDateTime(values.registerTime[0]),
        registerendTime: formatDateTime(values.registerTime[1]),
        location: values.location,
        status: 'published',
        capacity: values.capacity, // 使用统一capacity字段
        participants: [],
        department: 'GENERAL', // 默认部门
        role: values.role || 'all',
      };

      await createEvent(newEvent);
      message.success('活动创建成功！即将跳转到详情页...');
      
      setTimeout(() => {
        navigate(`/event/${newEvent.id}`);
      }, 1500);
      
      form.resetFields();
    } catch (error) {
      message.error('创建失败：' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ 
      marginLeft: 160,
      padding: '24px',
      minHeight: 'calc(100vh - 64px)',
      backgroundColor: '#f5f5f5'
    }}>
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
        >
          {/* 修改后的表单项 */}
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="活动名称"
                name="title"
                rules={[{ required: true, message: '请输入活动名称' }]}
              >
                <Input placeholder="例如：前端技术研讨会" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24} md={12}>
              <Form.Item
                label="活动对象"
                name="role"
                rules={[{ required: true, message: '请输入活动面向对象' }]}
              >
                <Input placeholder="例如：全体学生" />
              </Form.Item>
            </Col>
            <Col span={24} md={12}>
              <Form.Item
                label="活动名额"
                name="capacity"
                rules={[{ 
                  required: true,
                  message: '请输入活动名额',
                  type: 'number',
                  min: 1
                }]}
              >
                <InputNumber 
                  min={1}
                  max={1000}
                  style={{ width: '100%' }}
                  placeholder="总参与人数"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="报名时间"
            name="registerTime"
            rules={[{ required: true, message: '请选择报名时间范围' }]}
          >
            <DatePicker.RangePicker
              showTime
              format="YYYY-MM-DD HH:mm"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            label="活动时间"
            name="eventTime"
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
  );
}