import { Card, Tag, Space } from 'antd'
import dayjs from 'dayjs'

export default function EventCard({ title, date, seats }) {
  return (
    <Card 
      title={title}
      extra={<Tag color={seats > 0 ? 'green' : 'red'}>
        {seats > 0 ? `剩余${seats}席` : '已报满'}
      </Tag>}
    >
      <Space direction="vertical">
        <div>📅 {dayjs(date).format('YYYY-MM-DD HH:mm')}</div>
        <Button 
          type="primary" 
          disabled={seats <= 0}
        >
          立即报名
        </Button>
      </Space>
    </Card>
  )
}