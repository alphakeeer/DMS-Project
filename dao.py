"""
dao.py — 数据访问层（Data Access Object）

职责：
  • 提供对 models.py 中 ORM 类的“原子”增删改查函数  
    （get_event, add_registration, drop_registration, record_attendance, list_events…）
  • 管理 db.session 的 commit/rollback
  • 保持接口简单：参数尽量是基本类型或 ORM 实例，返回 ORM 实例或基本结构

提示：
  • 事务边界尽量放在这里  
  • 业务规则（时间校验、名额校验）不要在此处实现
"""

from models import Department, Role, ObjectType, Member, Event, EventParticipation, AccessToken, EventRegistration, EventAudience
from models import db
from datetime import datetime

from werkzeug.security import generate_password_hash

class ActivityDAO:
    @staticmethod
    def insert_department(id, name):
        """
        插入新的部门记录
        :param name: 部门名称
        :return: 创建的Department对象
        """
        department = Department(id=id, name=name)
        db.session.add(department)
        db.session.commit()
        return department

    @staticmethod
    def insert_role(id, name):
        """
        插入新的角色记录
        :param name: 角色名称
        :return: 创建的Role对象
        """
        role = Role(id=id, name=name)
        db.session.add(role)
        db.session.commit()
        return role

    @staticmethod
    def insert_object_type(id, code, ref_id):
        """
        插入新的对象类型记录
        :param code: 对象类型代码 ('department' 或 'role')
        :param ref_id: 对应的Department或Role的ID
        :return: 创建的ObjectType对象
        :raises: ValueError 如果code不是'department'或'role'
        """
        if code not in ('department', 'role'):
            raise ValueError("code must be either 'department' or 'role'")
        
        obj_type = ObjectType(id=id, code=code, ref_id=ref_id)
        db.session.add(obj_type)
        db.session.commit()
        return obj_type

    @staticmethod
    def create_member(id: str, name: str, type_id: int, account: str, password: str, 
                    can_create_event: bool = False) -> Member:
        """
        创建并插入一个新的Member记录
        
        :param name: 成员姓名
        :param type_id: 对象类型ID
        :param can_create_event: 是否能创建事件
        :param account: 账号
        :param password: 密码
        :return: 创建的Member对象
        :raises: ValueError 如果账号或密码不符合要求
        """
        try:
            member = Member(
                id=id,
                name=name,
                type_id=type_id,
                can_create_event=can_create_event,
                account=account
            )
            # 设置密码会自动触发密码验证和哈希处理
            member.password = password
            
            db.session.add(member)
            db.session.commit()
            return member
        except Exception as e:
            db.session.rollback()
            raise e  # 可以在这里自定义异常处理
            
    @staticmethod
    def create_event(
        name: str,
        organizer_id: int,
        id: str,
        reg_start: datetime,
        reg_end: datetime,
        start_time: datetime,
        end_time: datetime,
        location: str = None,
        max_capacity: int = None,
        min_capacity: int = 0,
        attendee_count: int = 0,
        is_successful: bool = False
    ) -> Event:
        """
        创建新事件并插入到数据库
        
        参数:
            name: 事件名称
            organizer_id: 组织者成员ID
            event_code: 事件唯一代码
            reg_start: 注册开始时间
            reg_end: 注册结束时间
            start_time: 事件开始时间
            end_time: 事件结束时间
            location: 事件地点(可选)
            max_capacity: 最大容量(可选)
            min_capacity: 最小容量，默认为0
            attendee_count: 参加人数，默认为0
            is_successful: 是否成功举办，默认为False
        
        返回:
            Event: 新创建的事件对象
        
        异常:
            可能抛出 IntegrityError(当event_code不唯一时)或其他数据库异常
        """
        try:
            new_event = Event(
                name=name,
                organizer_id=organizer_id,
                id=id,
                reg_start=reg_start,
                reg_end=reg_end,
                start_time=start_time,
                end_time=end_time,
                location=location,
                max_capacity=max_capacity,
                min_capacity=min_capacity,
                attendee_count=attendee_count,
                is_successful=is_successful
            )
            
            db.session.add(new_event)
            db.session.commit()
            return new_event
            
        except Exception as e:
            db.session.rollback()
            raise e

    @staticmethod
    def update_event(event_id, column_name, new_value):
      """
      更新Event表的指定列
      
      参数:
          event_id: 要更新的事件ID
          column_name: 要更新的列名
          new_value: 新的值
          
      返回:
          成功返回True，失败返回False
      """
      
      try:
          # 获取要更新的事件
          event = Event.query.get(event_id)
          if not event:
              return False
              
          # 检查列名是否有效
          if not hasattr(Event, column_name):
              return False
              
          # 更新值
          setattr(event, column_name, new_value)
          
          # 提交到数据库
          db.session.commit()
          return True
          
      except Exception as e:
          db.session.rollback()
          print(f"Error updating event: {e}")
          return False

    @staticmethod
    def get_all_events():
        """获取所有活动的基本信息"""
        return Event.query.with_entities(
            Event.name,
            Event.reg_start,
            Event.reg_end,
            Event.start_time,
            Event.end_time,
            Event.location
        ).all()

    @staticmethod
    def get_events_by_name(name):
        """根据活动名称查询活动"""
        return Event.query.filter(
            Event.name.ilike(f'%{name}%')
        ).with_entities(
            Event.name,
            Event.reg_start,
            Event.reg_end,
            Event.start_time,
            Event.end_time,
            Event.location
        ).all()


    @staticmethod
    def get_events_by_time_range(start_date, end_date):
        """查询在指定时间范围内举办的活动"""
        return Event.query.filter(
            and_(
                Event.start_time >= start_date,
                Event.end_time <= end_date
            )
        ).with_entities(
            Event.name,
            Event.reg_start,
            Event.reg_end,
            Event.start_time,
            Event.end_time,
            Event.location
        ).all()

    @staticmethod
    def get_current_events():
        """获取当前正在接受报名的活动"""
        now = datetime.now()
        return Event.query.filter(
            and_(
                Event.reg_start <= now,
                Event.reg_end >= now
            )
        ).with_entities(
            Event.name,
            Event.reg_start,
            Event.reg_end,
            Event.start_time,
            Event.end_time,
            Event.location
        ).all()

    @staticmethod
    def create_registration(event_id, registrant_id):
        """
        创建新的活动报名记录
        :param event_id: 活动ID
        :param registrant_id: 报名者ID
        :return: (success: bool, message: str)
        """
        try:
            registration = EventRegistration(
                event_id=event_id,
                registrant_id=registrant_id,
                registered_at=datetime.now(),
                is_cancelled=False
            )
            db.session.add(registration)
            db.session.commit()
            return True, "报名成功"
        except IntegrityError as e:
            db.session.rollback()
            if "uq_event_registrant" in str(e):
                return False, "您已经报名过该活动"
            return False, "报名失败，数据库错误"
        except Exception as e:
            db.session.rollback()
            return False, f"报名失败: {str(e)}"

    @staticmethod
    def cancel_registration(event_id, registrant_id):
        """
        取消报名（软删除，标记为已取消）
        :param event_id: 活动ID
        :param registrant_id: 报名者ID
        :return: (success: bool, message: str)
        """
        registration = EventRegistration.query.filter_by(
            event_id=event_id,
            registrant_id=registrant_id
        ).first()
        
        if not registration:
            return False, "未找到报名记录"
        
        if registration.is_cancelled:
            return False, "该报名已取消"
            
        try:
            registration.is_cancelled = True
            db.session.commit()
            return True, "取消报名成功"
        except Exception as e:
            db.session.rollback()
            return False, f"取消报名失败: {str(e)}"

    @staticmethod
    def get_registration(event_id, registrant_id):
        """
        活动参与者可查询
        通过活动ID和报名者ID获取特定报名记录
        :return: EventRegistration对象或None
        """
        return EventRegistration.query.filter_by(
            event_id=event_id,
            registrant_id=registrant_id
        ).first()

    @staticmethod
    def get_event_registrations(event_id, include_cancelled=False):
        """
        活动组织者可查询
        获取活动的所有报名记录
        :param event_id: 活动ID
        :param include_cancelled: 是否包含已取消的报名
        :return: 报名记录列表
        """
        query = EventRegistration.query.filter_by(event_id=event_id)
        if not include_cancelled:
            query = query.filter_by(is_cancelled=False)
        return query.all()

    @staticmethod
    def count_event_registrations(event_id, include_cancelled=False):
        """
        统计活动的报名人数
        :param event_id: 活动ID
        :param include_cancelled: 是否包含已取消的报名
        :return: 报名人数
        """
        query = EventRegistration.query.filter_by(event_id=event_id)
        if not include_cancelled:
            query = query.filter_by(is_cancelled=False)
        return query.count()
