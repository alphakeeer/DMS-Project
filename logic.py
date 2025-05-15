"""
logic.py — 业务逻辑层

职责：
  • 将 dao.py 提供的 CRUD 操作组合成业务流程  
    （register、cancel、check_in、event_stats 等）
  • 负责：时间窗校验、容量校验、候补队列处理、签到规则、统计汇总等  
  • 返回标准化结果字典（status/msg 或 summary dict）

提示：
  • 不要直接操作 db.session，也不要拼接 SQL  
  • 不要处理 HTTP 请求/响应细节，只做“给定输入，返回业务结果”
"""
from models import Department, Role, ObjectType, Member, Event, EventParticipation, AccessToken, EventRegistration, EventAudience
from dao import SystemDAO, MemberDAO, EventDAO, RegistrationDAO, ParticipationDAO
from typing import Tuple, Optional
from datetime import datetime

class Account_Layer:
    @staticmethod
    def register_member(
        id: str, 
        name: str, 
        type_id: int, 
        account: str, 
        password: str, 
        activation_code: str = None
    ) -> Tuple[Member, str]:
        """
        用户注册逻辑
        
        :param id: 用户ID
        :param name: 用户名
        :param type_id: 用户类型ID
        :param account: 账号
        :param password: 密码
        :param activation_code: 激活码（可选）
        :return: (注册成功的Member对象, 成功消息)
        :raises: 
            UserIdAlreadyExistsError: 用户ID已存在
            AccountAlreadyExistsError: 账号已存在
            PasswordComplexityError: 密码不符合复杂度要求
        """
        # 1. 检查用户ID是否已存在
        if MemberDAO.get_member_by_id(id):
            raise ValueError(f"用户ID {id} 已存在")
            
        # 2. 检查账号是否已存在
        if MemberDAO.get_member_by_account(account):
            raise ValueError(f"账号 {account} 已被注册")
            
        # 3. 验证密码复杂度
        if len(password) < 8:
            raise ValueError("密码长度至少为8位")
        if not any(c.isupper() for c in password):
            raise ValueError("密码必须包含至少一个大写字母")
        if not any(c.islower() for c in password):
            raise ValueError("密码必须包含至少一个小写字母")
        if not any(c.isdigit() for c in password):
            raise ValueError("密码必须包含至少一个数字")     
            
        # 4. 所有检查通过，创建用户
        member = MemberDAO.create_member(
            id=id,
            name=name,
            type_id=type_id,
            account=account,
            password=password
        )
        
        #5. 如果有激活码，创建激活码记录
        if activation_code:
            if SystemDAO.check_activation_code(activation_code):
                MemberDAO.update_can_create_event(member_id)
                SystemDAO.update_access_token(id, activation_code)
            else:
                raise Error("激活码不存在")
        return member, "用户注册成功"

    @staticmethod
    def login(account: str, password: str) -> dict:
        """
        用户登录逻辑处理
        
        参数:
            account: 用户账号
            password: 用户密码(明文)
            
        返回:
            {
                'success': bool, 
                'message': str,
                'data': {
                    'member_id': str,
                    'name': str,
                    'can_create_event': bool
                } | None
            }
        """
        # 1. 参数校验
        if not account or not password:
            return {
                'success': False,
                'message': '账号和密码不能为空',
                'data': None
            }

        # 2. 获取用户信息
        member = MemberDAO.get_member_by_account(account)
        if not member:
            return {
                'success': False,
                'message': '账号不存在',
                'data': None
            }

        # 3. 验证密码
        if not member.check_password(password):
            return {
                'success': False,
                'message': '密码错误',
                'data': None
            }
      
        # 返回成功响应
        return {
            'success': True,
            'message': '登录成功',
            'data': {
                'member_id': member.id,
                'name': member.name,
                'can_create_event': member.can_create_event,
                'account': member.account
            }
        }

    @staticmethod
    def update_member_info(member_id: str, new_password: str = None, activation_code: str =None) -> dict:
        """
        更新成员信息，只支持修改密码和添加激活码       
        返回:
            {
                'success': bool,
                'message': str}
        """
        # 1. 参数校验
        if not update_fields:
            return {
                'success': False,
                'message': '无有效更新字段' }
        
        # 2. 获取成员对象
        member = MemberDAO.get_member_by_id(member_id)
        if not member:
            return {
                'success': False,
                'message': '成员不存在'}
      
        # 3. 处理密码字段（特殊处理，因为需要加密）
        if new_password != None:
            try:
                MenberDAO.update_password(member_id, new_password)
            except Exception as e:
                return {
                    'success': False,
                    'message': f'密码更新失败: {str(e)}'}
        
        # 4.  激活码处理
        if activation_code != None:
            if member.can_create_event:
                return {
                    'success': False,
                    'message': '激活码已存在，不能重复添加'}
            if SystemDAO.check_activation_code(activation_code):
                try:
                    MemberDAO.update_can_create_event(member_id)
                    SystemDAO.update_access_token(id, activation_code)
                except Exception as e:
                    return {
                        'success': False,
                        'message': f'激活码处理失败: {str(e)}'}
            else:
                return {
                    'success': False,
                    'message': '激活码不存在'}
        
        return {
            'success': True,
            'message': '更新成功'}

class Activity_Management_Layer: 

    @staticmethod
    def create_event(
        name: str,
        organizer_id: int,
        event_code: str,
        reg_start: datetime,
        reg_end: datetime,
        start_time: datetime,
        end_time: datetime,
        location: Optional[str] = None,
        max_capacity: Optional[int] = 500,
        min_capacity: int = 0,
    ) -> Event:
        """
        创建新事件
        
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
        
        返回:
            Event: 新创建的事件对象
            
        异常:
            InvalidTimeRangeError: 如果时间范围无效
            LocationConflictError: 如果场地在该时间段已被占用
        """
        # 检查时间有效性
        if reg_start >= reg_end:
            raise ValueError("注册开始时间必须早于注册结束时间")
            
        if start_time >= end_time:
            raise ValueError("活动开始时间必须早于活动结束时间")
            
        if reg_end > start_time:
            raise ValueError("注册结束时间不能晚于活动开始时间")

        # 检查容量设置
        if max_capacity < min_capacity:
            raise ValueError("最大容量不能小于最小容量")

        # 如果有地点，检查地点是否被占用
        if location:
            conflicting_event = EventDAO.get_event_by_location_and_time(
                location=location,
                start_time=start_time,
                end_time=end_time
            )
            if conflicting_event:
                raise ValueError(f"场地 {location} 在指定时间段已被占用")

        # 创建事件
        new_event = EventDAO.create_event(
            name=name,
            organizer_id=organizer_id,
            id=event_code,
            reg_start=reg_start,
            reg_end=reg_end,
            start_time=start_time,
            end_time=end_time,
            location=location,
            max_capacity=max_capacity,
            min_capacity=min_capacity,
            attendee_count=0,  # 新活动初始为0
            is_successful=False  # 新活动初始为False
        )
        
        return new_event

    @staticmethod
    def cancel_event(event_id):
        """
        删除指定ID的事件
        返回:
            bool: 操作是否成功
            str: 相关消息
        """
        # 检查事件是否存在
        event = EventDAO.get_event_by_id(event_id)
        if not event:
            return False, "事件不存在"
            
        # 检查事件是否已经开始
        if event.start_time < datetime.now():
            return False, "事件已开始，无法取消"

        # 3. 先删除所有报名记录    
        success, count, msg = RegistrationDAO.delete_registrations_by_event(event_id)
        if not success:
            return False, f"取消报名记录失败: {msg}"
        
        # 4. 再删除活动本身
        success, msg = EventDAO.delete_event(event)
        if not success:
            return False, f"取消活动失败: {msg}"
            
        return True, f"活动取消成功，共删除{count}条报名记录"

    @staticmethod
    def update_event(event_id: int, update_data: dict) -> Tuple[bool, Optional[str]]:
        """
        更新事件信息（包含业务逻辑验证）
        
        参数:
            event_id: 要更新的事件ID
            update_data: 包含更新字段的字典
            
        返回:
            Tuple[bool, str]: (是否成功, 错误消息)
        """
        # 1. 获取现有事件
        event = EventDAO.get_event_by_id(event_id)
        if not event:
            return False, "事件不存在"

        # 2. 验证更新数据
        if 'reg_start' in update_data or 'reg_end' in update_data:
            new_reg_start = update_data.get('reg_start', event.reg_start)
            new_reg_end = update_data.get('reg_end', event.reg_end)
            if new_reg_start >= new_reg_end:
                return False, "报名开始时间必须早于结束时间"
                
        if 'start_time' in update_data or 'end_time' in update_data:
            new_start = update_data.get('start_time', event.start_time)
            new_end = update_data.get('end_time', event.end_time)
            if new_start >= new_end:
                return False, "事件开始时间必须早于结束时间"
                
            if 'reg_end' in update_data and update_data['reg_end'] > new_start:
                return False, "报名结束时间不能晚于事件开始时间"
            elif event.reg_end > new_start:
                return False, "当前报名结束时间晚于新的事件开始时间"

       # 3. 检查地点时间冲突（如果更新了地点或时间）
        if 'location' in update_data or 'start_time' in update_data or 'end_time' in update_data:
            location = update_data.get('location', event.location)
            start_time = update_data.get('start_time', event.start_time)
            end_time = update_data.get('end_time', event.end_time)
            
            if location:
                conflicting_event = EventDAO.get_event_by_location_and_time(
                    location, start_time, end_time
                )
                # 排除自身
                conflicting_event = [e for e in conflicting_event if e.id != event_id]
                if conflicting_event:
                    return False, "该地点在指定时间段已被占用"

        # 4. 检查容量设置
        if 'max_capacity' in update_data or 'min_capacity' in update_data:
            new_max = update_data.get('max_capacity', event.max_capacity)
            new_min = update_data.get('min_capacity', event.min_capacity)
            
            if new_max is not None and new_min > new_max:
                return False, "最小容量不能大于最大容量"
                
        # 5. 执行更新
        for column, value in update_data.items():
            success = EventDAO.update_event(event_id, column, value)
            if not success:
                return False, f"更新字段 {column} 失败"
                
        return True, None

class Registration_Excution_Layer:
    @staticmethod
    def register_for_event(event_id, registrant_id):
        """
        申请报名活动
        :param event_id: 活动ID
        :param registrant_id: 报名者ID
        :return: (success: bool, message: str)
        """
        # 检查是否已经报名
        existing_registration = RegistrationDAO.get_registration(event_id, registrant_id)
        if existing_registration:
            return False, "您已经报名过该活动，无需重复报名"
        
        # 调用DAO层创建报名记录
        success, message = RegistrationDAO.create_registration(event_id, registrant_id)
        
        if success:
            # 这里可以添加其他业务逻辑，例如发送通知等
            # NotificationService.send_registration_confirmation(registrant_id, event_id)
            return True, message
        else:
            return False, message

    @staticmethod
    def cancel_registration(event_id, registrant_id):
        """
        取消报名活动
        :param event_id: 活动ID
        :param registrant_id: 报名者ID
        :return: (success: bool, message: str)
        """
        # 检查是否存在报名记录
        existing_registration = RegistrationDAO.get_registration(event_id, registrant_id)
        if not existing_registration:
            return False, "您尚未报名该活动"
        
        # 调用DAO层删除报名记录
        success, message = RegistrationDAO.delete_registration(event_id, registrant_id)
        
        if success:
            # 这里可以添加其他业务逻辑，例如发送取消确认通知等
            # NotificationService.send_cancellation_confirmation(registrant_id, event_id)
            return True, message
        else:
            return False, message

    @staticmethod
    def get_user_registration_status(event_id, registrant_id):
        """
        获取用户在某个活动的报名状态
        :param event_id: 活动ID
        :param registrant_id: 报名者ID
        :return: (is_registered: bool, message: str)
        """
        event = EventDAO.get_event_by_id(event_id)
        current_time = datetime.now()
        
        # 检查当前时间是否在报名截止时间前
        if RegistrationDAO.get_registration(event_id, registrant_id):
            if event and current_time < event.reg_end:
                return False, "审核中"
            participation = ParticipationDAO.get_participation(event_id, member_id)
            if registration:
                return True, "报名成功"
            return False, "报名失败"
        else:
            return False, "未报名"

    from datetime import datetime

    @staticmethod
    def close_registration(event):
        """
        截止报名并确定参与者
        1. 获取所有报名者，按报名时间排序
        2. 选择前event.capacity个报名者作为参与者
        3. 将参与者信息写入EventParticipation表
        4. 删除所有报名记录
        返回：(成功参与者列表, 未成功参与者列表)
        """
        # 获取所有报名记录，按报名时间升序排列
        registrations = RegistrationDAO.get_registrations_by_event(event.id)
        
        # 确定成功参与者和未成功参与者
        successful = []
        unsuccessful = []
        
        for i, registration in enumerate(registrations):
            if i < event.capacity:
                # 创建参与记录
                participation = ParticipationDAO.create_participation(
                    event_id=event.id,
                    member_id=registration.registrant_id,
                    is_absent=True
                )
                successful.append(participation)
            else:
                unsuccessful.append(registration.registrant_id)
    
        return successful, unsuccessful

    @staticmethod
    def check_in_participant(event_id, member_id):
        """
        参与者签到
        将is_absent从True(默认值)改为False表示已签到
        """
        participation = ParticipationDAO.get_participation(event_id, member_id)
        
        if not participation:
            raise ValueError("该用户没有参与此活动")
        
        ParticipationDAO.check_in(event_id, member_id)
        db.session.commit()
        return participation

    @staticmethod
    def batch_check_in(event_id, member_ids):
        """
        批量签到多个参与者
        返回：(成功签到数量, 失败签到数量)
        """
        success_count = 0
        fail_count = 0
        
        for member_id in member_ids:
            try:
                Registration_Excution_Layer.check_in_participant(event_id, member_id)
                success_count += 1
            except ValueError:
                fail_count += 1
        
        return success_count, fail_count


    @staticmethod
    def submit_feedback(event_id, member_id, comment=None):
        """（参与者）提交活动反馈"""
        participation = ParticipationDAO.get_participation(event_id, member_id)
        if not participation:
            raise ValueError("您没有参与此活动")
        if participation.is_absent:
            raise ValueError("您未签到，无法提交反馈")
        
        ParticipationDAO.insert_comment(event_id, member_id, comment)
        return participation

    @staticmethod
    def submit_rating(event_id, member_id, rating=None):
        """（组织者）给参与者评分"""
        participation = ParticipationDAO.get_participation(event_id, member_id)
        if not participation:
            raise ValueError("此人并未参与此活动")        
        ParticipationDAO.insert_rating(event_id, member_id, rating)
        return participation

    @staticmethod
    def get_event_feedbacks(event_id):
        """获取活动的所有反馈"""
        return EventParticipation.query.filter_by(event_id=event_id)\
            .options(joinedload(EventParticipation.participant))\
            .all()
