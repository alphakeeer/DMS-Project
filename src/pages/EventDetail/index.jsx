// import { Tabs, Descriptions, Table } from 'antd'
// import { useParams } from 'react-router-dom'

// const EventDetailPage = () => {
//   const { id } = useParams()
//   const { currentEvent, fetchEvent } = useEventStore()

//   useEffect(() => {
//     fetchEvent(id)
//   }, [id])

//   return (
//     <div className="detail-container">
//       <h1>{currentEvent?.title}</h1>
      
//       <Tabs defaultActiveKey="1">
//         <Tabs.TabPane tab="基本信息" key="1">
//           <Descriptions bordered column={2}>
//             <Descriptions.Item label="开始时间">
//               {dayjs(currentEvent?.startTime).format('YYYY-MM-DD HH:mm')}
//             </Descriptions.Item>
//             <Descriptions.Item label="地点">
//               {currentEvent?.location}
//             </Descriptions.Item>
//             <Descriptions.Item label="已报名人数">
//               {currentEvent?.registered}/{currentEvent?.capacity}
//             </Descriptions.Item>
//           </Descriptions>
//         </Tabs.TabPane>

//         <Tabs.TabPane tab="报名管理" key="2">
//           <RegistrationTable 
//             dataSource={currentEvent?.registrations || []}
//           />
//         </Tabs.TabPane>
//       </Tabs>
//     </div>
//   )
// }

import { Tabs, Descriptions, message } from 'antd'
import { useParams } from 'react-router-dom'
import { useEventStore } from '@/stores/eventStore'
import RegistrationTable from '@/components/RegistrationTable'

export default function EventDetailPage() {
  const { id } = useParams()
  const { currentEvent, fetchEvent } = useEventStore()

  useEffect(() => {
    fetchEvent(id).catch(() => message.error('加载活动详情失败'))
  }, [id])

  return (
    <div className="event-detail">
      <h1>{currentEvent?.title}</h1>
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="基本信息" key="1">
          <Descriptions bordered column={2}>
            <Descriptions.Item label="开始时间">
              {currentEvent?.startTime}
            </Descriptions.Item>
            <Descriptions.Item label="地点">
              {currentEvent?.location}
            </Descriptions.Item>
            <Descriptions.Item label="参与人数">
              {currentEvent?.registered}/{currentEvent?.capacity}
            </Descriptions.Item>
            <Descriptions.Item label="状态">
              <span className={`status-${currentEvent?.status}`}>
                {currentEvent?.status}
              </span>
            </Descriptions.Item>
          </Descriptions>
        </Tabs.TabPane>
        <Tabs.TabPane tab="报名管理" key="2">
          <RegistrationTable eventId={id} />
        </Tabs.TabPane>
      </Tabs>
    </div>
  )
}