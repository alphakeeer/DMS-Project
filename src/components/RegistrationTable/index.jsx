import { Table, Tag, Button, Popconfirm, Space } from 'antd'
import { useEffect, useState } from 'react'
import api from '@/api/events'

export default function RegistrationTable({ eventId }) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  const columns = [
    {
      title: '姓名',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: '联系方式',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: status => (
        <Tag color={
          status === 'approved' ? 'green' : 
          status === 'pending' ? 'orange' : 'red'
        }>
          {status}
        </Tag>
      )
    },
    {
      title: '操作',
      render: (_, record) => (
        <Space>
          <Popconfirm
            title="确定通过此报名？"
            onConfirm={() => handleStatusChange(record.id, 'approved')}
          >
            <Button type="link">通过</Button>
          </Popconfirm>
          <Popconfirm
            title="确定拒绝此报名？"
            onConfirm={() => handleStatusChange(record.id, 'rejected')}
          >
            <Button type="link" danger>拒绝</Button>
          </Popconfirm>
        </Space>
      )
    }
  ]

  const loadData = async () => {
    setLoading(true)
    try {
      const res = await api.get(`/events/${eventId}/registrations`)
      setData(res.data)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (id, status) => {
    await api.patch(`/registrations/${id}`, { status })
    loadData()
  }

  useEffect(() => {
    loadData()
  }, [eventId])

  return (
    <Table
      columns={columns}
      dataSource={data}
      loading={loading}
      rowKey="id"
      pagination={{ pageSize: 10 }}
    />
  )
}