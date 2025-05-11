// import { Card, Button, List } from 'antd'
// import { useEventStore } from '@/stores/eventStore'
// import EventCard from '@/components/EventCard'

// export default function HomePage() {
//   const { events, fetchEvents } = useEventStore()
  
//   useEffect(() => {
//     fetchEvents()
//   }, [])

//   return (
//     <div className="page-container">
//       <List
//         grid={{ gutter: 16, column: 3 }}
//         dataSource={events}
//         renderItem={item => (
//           <List.Item>
//             <EventCard 
//               title={item.title}
//               date={item.date}
//               seats={item.seats}
//               onRegister={() => registerEvent(item.id)}
//             />
//           </List.Item>
//         )}
//       />
//     </div>
//   )
// }




// import { Card, List, Skeleton, Tag } from 'antd'
// import { useEventStore } from '@/stores/eventStore'
// import dayjs from 'dayjs'

// export default function HomePage() {
//   const { events, loading, fetchEvents } = useEventStore()

//   useEffect(() => {
//     fetchEvents()
//   }, [])

//   return (
//     <div className="page-container">
//       <List
//         grid={{ gutter: 16, column: 3 }}
//         dataSource={events}
//         renderItem={item => (
//           <List.Item>
//             <Card
//               title={item.title}
//               extra={<Tag color={item.status === 'open' ? 'green' : 'red'}>
//                 {item.status}
//               </Tag>}
//               actions={[
//                 <Link to={`/events/${item.id}`}>查看详情</Link>,
//                 item.status === 'open' && <Button type="link">立即报名</Button>
//               ]}
//             >
//               <p>时间：{dayjs(item.startTime).format('YYYY-MM-DD HH:mm')}</p>
//               <p>地点：{item.location}</p>
//               <Progress 
//                 percent={(item.registered / item.capacity) * 100}
//                 status={item.registered >= item.capacity ? 'exception' : 'normal'}
//               />
//             </Card>
//           </List.Item>
//         )}
//       />
//     </div>
//   )
// }


import { Card, List, Skeleton } from 'antd'
import { useEventStore } from '@/stores/eventStore'
import EventCard from '@/components/EventCard'

export default function HomePage() {
  const { events, loading } = useEventStore()

  return (
    <div className="home-container">
      <List
        grid={{ gutter: 16, column: 3 }}
        dataSource={events}
        loading={loading}
        renderItem={item => (
          <List.Item>
            <EventCard 
              id={item.id}
              title={item.title}
              date={item.startTime}
              location={item.location}
              status={item.status}
              registered={item.registered}
              capacity={item.capacity}
            />
          </List.Item>
        )}
      />
    </div>
  )
}