// import { Card, Tag, Space, Button } from 'antd'
// import dayjs from 'dayjs'

// export default function EventCard({ title, date, seats }) {
//   return (
//     <Card 
//       title={title}
//       extra={<Tag color={seats > 0 ? 'green' : 'red'}>
//         {seats > 0 ? `剩余${seats}席` : '已报满'}
//       </Tag>}
//     >
//       <Space direction="vertical">
//         <div>📅 {dayjs(date).format('YYYY-MM-DD HH:mm')}</div>
//         <Button 
//           type="primary" 
//           disabled={seats <= 0}
//         >
//           立即报名
//         </Button>
//       </Space>
//     </Card>
//   )
// }



// import { Card, Tag, Space, Button, Row, Col, Typography } from 'antd';
// import dayjs from 'dayjs';

// const { Text } = Typography;

// export default function EventCard({ 
//   id,
//   title,
//   startdate,
//   enddate,
//   department,
//   role,
//   status,
//   registered,
//   capacity 
// }) {
//   return (
//     <Card 
//       style={{ marginBottom: 16, width: '100%' }} // 确保每行一个卡片
//     >
//       <Row gutter={16} align="middle">
//         {/* 左侧：活动信息 */}
//         <Col flex="auto">
//           <Space direction="vertical" size={4}>
//             <Text strong style={{ fontSize: 18 }}>{title}</Text>
//             
//             <Space size={8}>
//               <Tag color="blue">{department}</Tag>
//               <Tag color="purple">{role}</Tag>
//               <Tag color={status === 'published' ? 'green' : 'orange'}>
//                 {status === 'published' ? '已发布' : '未发布'}
//               </Tag>
//             </Space>

//             <Text type="secondary">
//               🕒 {dayjs(startdate).format('YYYY-MM-DD HH:mm')} ~ {dayjs(enddate).format('HH:mm')}
//             </Text>

//            
//           </Space>
//         </Col>

//         {/* 右侧：操作按钮 */}
//         <Col flex="none">
//           <Button type="primary" href={`/events/${id}`}>查看详情</Button>
//         </Col>
//       </Row>
//     </Card>
//   );
// }


import { Card, Tag, Space, Button, Row, Col, Typography } from 'antd';
import dayjs from 'dayjs';

const { Text } = Typography;

export default function EventCard({ 
  id,
  title,
  startdate,
  enddate,
  department,
  role,
  status,
  registered,
  capacity 
}) {
  return (
    <Card 
      style={{ marginBottom: 16, width: '100%' }} // 确保每行一个卡片
    >
      <Row gutter={16} align="middle">
        {/* 左侧：活动信息 */}
        <Col flex="auto">
          <Space direction="vertical" size={4}>
            <Text strong style={{ fontSize: 18 }}>{title}</Text>
            
            <Space size={8}>
              <Tag color="blue">{department}</Tag>
              <Tag color="purple">{role}</Tag>
              <Tag color={status === 'published' ? 'green' : 'orange'}>
                {status === 'published' ? '已发布' : '未发布'}
              </Tag>
            </Space>

            <Text type="secondary">
              🕒 {dayjs(startdate).format('YYYY-MM-DD HH:mm')} ~ {dayjs(enddate).format('HH:mm')}
            </Text>

           
          </Space>
        </Col>

        {/* 右侧：操作按钮 */}
        <Col flex="none">
          <Button type="primary" href={`/events/${id}`}>查看详情</Button>
        </Col>
      </Row>
    </Card>
  );
}