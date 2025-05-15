// 与HomePage共享的模拟数据
import { dayjs } from 'dayjs'; // 需要先安装dayjs

// 测试用固定用户ID
const TEST_USER_ID = 'demo-user-123';

export const mockEvents = [
    {
        id: 'example-id1',
        title: '校园开放日',
        description: '欢迎新生参观校园',
        startTime: '2025-10-01T10:00:00',
        endTime: '2025-10-01T12:00:00',
        registerstartTime: '2025-09-01T10:00:00',
        registerendTime: '2025-09-30T12:00:00',
        location: '学校主广场',
        status: 'published',
        capacity: 100,
        participants: [], // 初始化参与者列表
        department: 'UG',
        role: 'student'
    },
    {
        id: 'example-id2',
        title: '编程工作坊',
        description: '学习基础编程技能',
        startTime: '2025-10-02T14:00:00',
        endTime: '2025-10-02T16:00:00',
        registerstartTime: '2025-09-15T10:00:00',
        registerendTime: '2025-10-01T12:00:00',
        location: '计算机实验室',
        status: 'published',
        capacity: 30,
        participants: [
            {
              userId: TEST_USER_ID, // 使用固定测试用户ID
              status: 'approved',
              registeredAt: '2025-09-15T14:30:00', // 固定时间
              checkedIn: false
            }
          ],
        department: 'CS',
        role: 'student'
    },
    {
        id: 'example-id3',
        title: '艺术展览',
        description: '学生艺术作品展示',
        startTime: '2025-10-03T09:00:00',
        endTime: '2025-10-05T17:00:00',
        registerstartTime: '2025-09-10T10:00:00',
        registerendTime: '2025-10-02T12:00:00',
        location: '艺术楼展厅',
        status: 'published',
        capacity: 200,
        // participants: [], // 初始化参与者列表
        participants: [
            {
              userId: TEST_USER_ID,
              status: 'pending',
              registeredAt: '2025-09-11T09:15:00', // 固定时间
              checkedIn: false
            }
          ],
        department: 'ART',
        role: 'student',
        coverImage: 'https://example.com/art-exhibition.jpg',
    }
];
