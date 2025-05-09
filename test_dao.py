from flask.cli import with_appcontext
from dao import ActivityDAO  # 注意类名大小写
from datetime import datetime, timedelta
from app import create_app, db

# 创建应用并激活上下文
app = create_app()
app.app_context().push()  # 手动推送应用上下文

# 确保数据库表已创建
db.create_all()

# 准备时间数据
now = datetime.now()
reg_start = now + timedelta(days=1)
reg_end = now + timedelta(days=7)
event_start = now + timedelta(days=8)
event_end = now + timedelta(days=9)

try:
    # 创建组织者 - 注意使用正确的类名Member
    organizer = ActivityDAO.create_member(
        id=1,
        name="Nikki",
        type_id=1,  # 对象类型ID
        can_create_event=True,
        account="Nikki",
        password="Niki1206"
    )
    # 创建事件 - 注意使用正确的类名ActivityDao
    new_event = ActivityDAO.create_event(
        name="篮球赛",
        organizer_id=1,  # 组织者ID
        id="20250205",
        reg_start=reg_start,
        reg_end=reg_end,
        start_time=event_start,
        end_time=event_end,
        location="体育馆",
        max_capacity=500,
        min_capacity=100
    )
    print(f"事件创建成功，ID: {new_event.id}")
except Exception as e:
    print(f"创建事件失败: {str(e)}")
