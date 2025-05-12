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

class SystemDAO:
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
    def check_activation_code(activation_code) -> bool:
        """
        检查激活码是否有效
        :param activation_code: 激活码
        :return: 激活码有效时返回True，否则False
        """
        # Query the activation code from database
        token = AccessToken.query.get(activation_code)
        
        # If not found or has an owner, return False
        if not token or token.owner_id is not None:
            return False
        
        return True

    @staticmethod
    def create_access_token(activation_code: str) -> AccessToken:
        """
        创建只有activation_code的AccessToken记录
        :param activation_code: 激活码字符串
        :return: 创建的AccessToken对象
        """
        try:
            # 创建新记录
            new_token = AccessToken(activation_code=activation_code)
            db.session.add(new_token)
            db.session.commit()            
            return new_token
        except Exception as e:
            db.session.rollback()
            raise e  # 可以选择处理或重新抛出异常

    @staticmethod
    def update_access_token(owner_id: int, activation_code: str) -> AccessToken:
        """
        更新激活码的拥有者
        :param id: 成员ID
        :param activation_code: 激活码
        :return: 更新后的AccessToken对象
        """
        access_token = AccessToken.query.get(activation_code)
        if access_token:
            access_token.owner_id = owner_id
            db.session.commit()
            return access_token
        return None

class MemberDAO:

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
                can_create_event=False,
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
    def get_member_by_id(member_id: str) -> Member:
        #根据ID获取成员信息
        return Member.query.get(member_id)

    @staticmethod
    def get_member_by_account(account: str) -> Member:
        #根据账号获取成员信息
        return Member.query.filter_by(account=account).first()

    @staticmethod
    def update_password(member_id: str, new_password: str) -> bool:
        """
        更新成员密码
        :param member_id: 成员ID
        :param new_password: 新密码
        :return: 成功返回True，失败返回False
        """
        try:
            member = Member.query.get(member_id)
            member.password = new_password
            db.session.commit()
            return True
        except Exception as e:
            db.session.rollback()
            return False
    
    @staticmethod
    def update_can_create_event(member_id: str) -> bool:
        """
        更新成员的激活码
        :param member_id: 成员ID
        :param activation_code: 激活码
        :return: 成功返回True，失败返回False
        """
        try:
            member = Member.query.get(member_id)
            member.can_create_event = True
            return True
        except Exception as e:
            db.session.rollback()
            return False

class EventDAO:

    @staticmethod
    def create_event(
        name: str,
        organizer_id: int,
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
        返回:
            Event: 新创建的事件对象
        """
        try:
            new_event = Event(
                name=name,
                organizer_id=organizer_id,
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
      返回: 成功返回True，失败返回False
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
    def get_event_by_id(event_id):
        """根据id查询活动"""
        return Event.query.get(event_id)

    @staticmethod
    def get_event_by_location_and_time(
        location: str, 
        start_time: datetime, 
        end_time: datetime):
        """
        获取在指定时间段内占用指定地点的事件列表
        返回:
            List[Event]: 符合条件的事件列表，如果没有则返回空列表
        """
        return Event.query.filter(
            Event.location == location,
            # 检查时间重叠的条件
            Event.start_time < end_time,
            Event.end_time > start_time
        ).all()

    @staticmethod
    def get_all_event():
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
    def get_event_by_name(name):
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
    def get_event_by_time_range(start_date, end_date):
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
    def get_current_event():
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
    def delete_event(event_id):
        """
        取消/删除指定ID的事件
        返回:
            bool: 操作是否成功
            str: 相关消息
        """
        try:
            # 查找事件
            event = Event.query.get(event_id)
            # 删除事件
            db.session.delete(event)
            db.session.commit()            
            return True, "事件取消成功"
            
        except Exception as e:
            db.session.rollback()
            return False, f"取消事件时出错: {str(e)}"

class RegistrationDAO:

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
    def delete_registration(event_id, registrant_id):
        """
        （参与者自己）取消报名，直接删除记录
        :return: (success: bool, message: str)
        """
        registration = EventRegistration.query.filter_by(
            event_id=event_id,
            registrant_id=registrant_id
        ).first()       
        try:
            db.session.delete(registration)  # 直接删除记录
            db.session.commit()
            return True, "取消报名成功"
        except Exception as e:
            db.session.rollback()
            return False, f"取消报名失败: {str(e)}"

    @staticmethod
    def delete_registrations_by_event(event_id):
        """
        （在删除活动时）删除指定活动的所有报名记录
        :param event_id: 活动ID
        :return: (success: bool, deleted_count: int, message: str)
        """
        try:
            # 使用批量删除提高效率
            deleted_count = EventRegistration.query.filter_by(
                event_id=event_id
            ).delete()
            db.session.commit()
            return True, deleted_count, f"成功删除{deleted_count}条报名记录"
        except Exception as e:
            db.session.rollback()
            return False, 0, f"删除报名记录失败: {str(e)}"

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
    def get_registrations_by_event(event_id):
        """组织者查询，获取某个活动的所有报名记录，按报名时间升序排列"""
        return EventRegistration.query.filter_by(event_id=event_id)\
            .order_by(EventRegistration.registered_at.asc())\
            .all()

    @staticmethod
    def count_event_registrations(event_id):
        """
        统计活动的报名人数
        :param event_id: 活动ID
        :return: 报名人数
        """
        query = EventRegistration.query.filter_by(event_id=event_id)
        return query.count()

class ParticipationDAO:
    @staticmethod
    def create_participation(event_id, member_id, is_absent=False):
        """创建参与记录"""
        participation = EventParticipation(
            event_id=event_id,
            participant_id=member_id,
            is_absent=is_absent
        )
        db.session.add(participation)
        db.session.commit()
        return participation

    @staticmethod
    def get_participation(event_id, member_id):
        """获取特定用户对特定活动的参与记录"""
        return EventParticipation.query.filter_by(
            event_id=event_id, 
            participant_id=member_id
        ).first()

    @staticmethod
    def count_participations(event_id):
        """统计某个活动的参与人数"""
        return EventParticipation.query.filter_by(event_id=event_id)\
            .filter_by(is_absent=False)\
            .count()

    @staticmethod
    def check_in(event_id, member_id):
        participation = EventParticipation.query.filter_by(
            event_id=event_id, 
            participant_id=member_id
        ).first()
        participation.is_absent = False
        return participation
    
    @staticmethod
    def get_checked_in_participants(event_id):
        """
        获取已签到的参与者列表
        """
        return EventParticipation.query.filter_by(
            event_id=event_id,
            is_absent=False
        ).options(joinedload(EventParticipation.participant)).all()

    @staticmethod
    def insert_comment(event_id, member_id, comment=None):
        participation = EventParticipation.query.filter_by(
            event_id=event_id, 
            participant_id=member_id
        ).first()
        if comment is not None:
            participation.comment = comment
        db.session.commit()
        return True
    
    @staticmethod
    def insert_rating(event_id, member_id, rating=None):
        participation = EventParticipation.query.filter_by(
            event_id=event_id, 
            participant_id=member_id
        ).first()
        if rating is not None:
            participation.rating = rating
        db.session.commit()
        return True
