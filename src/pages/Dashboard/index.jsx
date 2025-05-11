// import { Card, Row, Col, Statistic } from 'antd';
// import { PageContainer } from '@ant-design/pro-components';

// export default function DashboardPage() {
//   return (
//     <PageContainer title="仪表盘">
//       <Row gutter={16}>
//         <Col span={8}>
//           <Card>
//             <Statistic title="用户数" value={1256} />
//           </Card>
//         </Col>
//         <Col span={8}>
//           <Card>
//             <Statistic title="活动数" value={42} />
//           </Card>
//         </Col>
//         <Col span={8}>
//           <Card>
//             <Statistic title="完成率" value="86%" />
//           </Card>
//         </Col>
//       </Row>
//     </PageContainer>
//   );
// }

import { Row, Col, Card, Statistic } from 'antd'
import { Line } from '@ant-design/plots'
import { useEventStore } from '@/stores/eventStore'

export default function DashboardPage() {
  const { events } = useEventStore()

  const registrationData = events.map(event => ({
    date: event.createdAt,
    count: event.registered
  }))

  const config = {
    data: registrationData,
    xField: 'date',
    yField: 'count',
    point: { size: 5 }
  }

  return (
    <div className="dashboard">
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic title="总活动数" value={events.length} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic 
              title="总参与人次" 
              value={events.reduce((sum, e) => sum + e.registered, 0)} 
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic 
              title="平均参与率" 
              value={events.length ? 
                (events.reduce((sum, e) => sum + e.registered/e.capacity, 0)/events.length).toFixed(2) 
                : 0
              }
            />
          </Card>
        </Col>
      </Row>
      <Card title="报名趋势分析">
        <Line {...config} />
      </Card>
    </div>
  )
}