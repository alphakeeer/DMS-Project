from flask.cli import with_appcontext
from dao import ActivityDAO  # 注意类名大小写
from datetime import datetime, timedelta
from app import create_app, db

# 创建应用并激活上下文
app = create_app()
app.app_context().push()  # 手动推送应用上下文

# 确保数据库表已创建
db.create_all()
try: 
    department = ActivityDAO.insert_department(id=101, name="计算机系")
    role = ActivityDAO.insert_role(id=201,name="学生")
    object_type = ActivityDAO.insert_object_type(id=1, code="department", ref_id=101)
except Exception as e:
    print(f"插入初始表失败: {str(e)}")

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
