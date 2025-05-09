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
from dao import SystemDAO, MemberDAO, EventDAO, RegistrationDAO
from typing import Tuple

class Logic:
    @staticmethod
    def register_member(
        id: str, 
        name: str, 
        type_id: int, 
        account: str, 
        password: str, 
        activate_code: str = None
    ) -> Tuple[Member, str]:
        """
        用户注册逻辑
        
        :param id: 用户ID
        :param name: 用户名
        :param type_id: 用户类型ID
        :param account: 账号
        :param password: 密码
        :param activate_code: 激活码（可选）
        :return: (注册成功的Member对象, 成功消息)
        :raises: 
            UserIdAlreadyExistsError: 用户ID已存在
            AccountAlreadyExistsError: 账号已存在
            PasswordComplexityError: 密码不符合复杂度要求
        """
        # 1. 检查用户ID是否已存在
        if MemberDao.get_member_by_id(id):
            raise UserIdAlreadyExistsError(f"用户ID {id} 已存在")
            
        # 2. 检查账号是否已存在
        if MemberDao.get_member_by_account(account):
            raise AccountAlreadyExistsError(f"账号 {account} 已被注册")
            
        # 3. 验证密码复杂度
        if not any(c.isupper() for c in password):
            raise PasswordComplexityError("密码必须包含至少一个大写字母")
        if not any(c.islower() for c in password):
            raise PasswordComplexityError("密码必须包含至少一个小写字母")
        if not any(c.isdigit() for c in password):
            raise PasswordComplexityError("密码必须包含至少一个数字")
        if len(password) < 8: 
            raise PasswordComplexityError("密码长度至少为8位")    
            
        # 4. 所有检查通过，创建用户
        member = ActivityDAO.create_member(
            id=id,
            name=name,
            type_id=type_id,
            account=account,
            password=password,
            can_create_event=can_create_event
        )
        
        #5. 如果有激活码，创建激活码记录
        if activation_code:
            if ActivityDAO.check_activation_code(activation_code):
                member.can_create_event = True
                ActivityDAO.update_access_token(id, activation_code)
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
    def update_member_info(member_id: str, new_password: str = None, activate_code: str =None) -> dict:
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
        if activate_code != None:
            if member.can_create_event:
                return {
                    'success': False,
                    'message': '激活码已存在，不能重复添加'}
            try:
                MemberDAO.update_can_create_event(member_id)
                SystemDAO.update_access_token(member_id, activate_code)
            except Exception as e:
                return {
                    'success': False,
                    'message': f'激活码处理失败: {str(e)}'}
        
        return {
            'success': True,
            'message': '更新成功'}
