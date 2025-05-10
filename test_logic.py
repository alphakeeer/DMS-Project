import pytest
from datetime import datetime, timedelta
from logic import Account_Layer, Activity_Management_Layer, Registration_Excution_Layer
from models import Department, Role, ObjectType, Member, Event, EventParticipation, AccessToken, EventRegistration, EventAudience
from models import db
from datetime import datetime
from dao import MemberDAO, EventDAO, RegistrationDAO, ParticipationDAO
from unittest.mock import patch, MagicMock
from app import create_app, db
app = create_app()
app.app_context().push()  # 手动推送应用上下文
db.create_all()

# 测试数据
TEST_MEMBER_ID = "test_user_123"
TEST_MEMBER_NAME = "Test User"
TEST_MEMBER_TYPE = 1
TEST_ACCOUNT = "test@example.com"
TEST_PASSWORD = "Password123"
TEST_ACTIVATION_CODE = "ACTIVATION123"

TEST_EVENT_ID = "event_123"
TEST_EVENT_NAME = "Test Event"
TEST_ORGANIZER_ID = "organizer_123"
TEST_EVENT_CODE = "EVENT123"
TEST_LOCATION = "Test Location"
TEST_MAX_CAPACITY = 10
TEST_MIN_CAPACITY = 3

# 时间设置
now = datetime.now()
reg_start = now + timedelta(days=1)
reg_end = now + timedelta(days=2)
event_start = now + timedelta(days=3)
event_end = now + timedelta(days=4)

class TestAccountLayer:
    """测试账户相关逻辑"""
    
    @patch('logic.MemberDAO.get_member_by_id')
    @patch('logic.MemberDAO.get_member_by_account')
    @patch('logic.MemberDAO.create_member')
    def test_register_member_success(self, mock_create, mock_get_account, mock_get_id):
        """测试成功注册用户"""
        # 模拟DAO层返回
        mock_get_id.return_value = None
        mock_get_account.return_value = None
        mock_create.return_value = Member(id=TEST_MEMBER_ID, name=TEST_MEMBER_NAME)
        
        # 调用注册方法
        member, msg = Account_Layer.register_member(
            id=TEST_MEMBER_ID,
            name=TEST_MEMBER_NAME,
            type_id=TEST_MEMBER_TYPE,
            account=TEST_ACCOUNT,
            password=TEST_PASSWORD
        )
        
        # 验证结果
        assert member is not None
        assert msg == "用户注册成功"
        mock_create.assert_called_once()
        
    @patch('logic.MemberDAO.get_member_by_id')
    def test_register_member_id_exists(self, mock_get_id):
        """测试用户ID已存在的情况"""
        mock_get_id.return_value = Member(id=TEST_MEMBER_ID)
        
        with pytest.raises(Exception) as excinfo:
            Account_Layer.register_member(
                id=TEST_MEMBER_ID,
                name=TEST_MEMBER_NAME,
                type_id=TEST_MEMBER_TYPE,
                account=TEST_ACCOUNT,
                password=TEST_PASSWORD
            )
        
        assert "用户ID" in str(excinfo.value)
        
    @patch('logic.MemberDAO.get_member_by_account')
    def test_register_member_account_exists(self, mock_get_account):
        """测试账号已存在的情况"""
        mock_get_account.return_value = Member(account=TEST_ACCOUNT)
        
        with pytest.raises(Exception) as excinfo:
            Account_Layer.register_member(
                id=TEST_MEMBER_ID,
                name=TEST_MEMBER_NAME,
                type_id=TEST_MEMBER_TYPE,
                account=TEST_ACCOUNT,
                password=TEST_PASSWORD
            )
        
        assert "账号" in str(excinfo.value)
        
    def test_register_member_password_complexity(self):
        """测试密码复杂度验证"""
        test_cases = [
            ("short", "密码长度至少为8位"),
            ("nouppercase", "密码必须包含至少一个大写字母"),
            ("NOLOWERCASE", "密码必须包含至少一个小写字母"),
            ("NoNumbers", "密码必须包含至少一个数字")
        ]
        
        for pwd, expected_error in test_cases:
            with pytest.raises(Exception) as excinfo:
                Account_Layer.register_member(
                    id=TEST_MEMBER_ID,
                    name=TEST_MEMBER_NAME,
                    type_id=TEST_MEMBER_TYPE,
                    account=TEST_ACCOUNT,
                    password=pwd
                )
            assert expected_error in str(excinfo.value)
        
    @patch('logic.MemberDAO.get_member_by_account')
    @patch('logic.Member.check_password')
    def test_login_success(self, mock_check_pwd, mock_get_account):
        """测试成功登录"""
        # 准备模拟数据
        mock_member = MagicMock()
        mock_member.id = TEST_MEMBER_ID
        mock_member.name = TEST_MEMBER_NAME
        mock_member.can_create_event = True
        mock_member.account = TEST_ACCOUNT
        mock_member.check_password.return_value = True
        
        mock_get_account.return_value = mock_member
        
        # 调用登录方法
        result = Account_Layer.login(TEST_ACCOUNT, TEST_PASSWORD)
        
        # 验证结果
        assert result['success'] is True
        assert result['data']['member_id'] == TEST_MEMBER_ID
        
    def test_login_empty_credentials(self):
        """测试空凭证登录"""
        result = Account_Layer.login("", "")
        assert result['success'] is False
        assert "不能为空" in result['message']
        
    @patch('logic.MemberDAO.get_member_by_account')
    def test_login_account_not_exist(self, mock_get_account):
        """测试账号不存在"""
        mock_get_account.return_value = None
        
        result = Account_Layer.login("nonexist@test.com", TEST_PASSWORD)
        assert result['success'] is False
        assert "账号不存在" in result['message']
        
    @patch('logic.MemberDAO.get_member_by_account')
    @patch('logic.Member.check_password')
    def test_login_wrong_password(self, mock_check_pwd, mock_get_account):
        """测试密码错误"""
        mock_member = MagicMock()
        mock_member.check_password.return_value = False
        mock_get_account.return_value = mock_member
        
        result = Account_Layer.login(TEST_ACCOUNT, "wrong_password")
        assert result['success'] is False
        assert "密码错误" in result['message']

class TestActivityManagementLayer:
    """测试活动管理逻辑"""
    
    @patch('logic.EventDAO.create_event')
    def test_create_event_success(self, mock_create):
        """测试成功创建活动"""
        mock_create.return_value = Event(id=TEST_EVENT_ID)
        
        event = Activity_Management_Layer.create_event(
            name=TEST_EVENT_NAME,
            organizer_id=TEST_ORGANIZER_ID,
            event_code=TEST_EVENT_CODE,
            reg_start=reg_start,
            reg_end=reg_end,
            start_time=event_start,
            end_time=event_end,
            location=TEST_LOCATION,
            max_capacity=TEST_MAX_CAPACITY,
            min_capacity=TEST_MIN_CAPACITY
        )
        
        assert event is not None
        assert event.id == TEST_EVENT_ID
        mock_create.assert_called_once()
        
    def test_create_event_invalid_time(self):
        """测试无效时间范围"""
        test_cases = [
            (reg_end, reg_start, "注册开始时间必须早于注册结束时间"),
            (event_end, event_start, "活动开始时间必须早于活动结束时间"),
            (event_start, event_end, "注册结束时间不能晚于活动开始时间")
        ]
        
        for start, end, expected_error in test_cases:
            with pytest.raises(Exception) as excinfo:
                Activity_Management_Layer.create_event(
                    name=TEST_EVENT_NAME,
                    organizer_id=TEST_ORGANIZER_ID,
                    event_code=TEST_EVENT_CODE,
                    reg_start=start,
                    reg_end=end,
                    start_time=event_start,
                    end_time=event_end
                )
            assert expected_error in str(excinfo.value)
            
    def test_create_event_invalid_capacity(self):
        """测试无效容量设置"""
        with pytest.raises(Exception) as excinfo:
            Activity_Management_Layer.create_event(
                name=TEST_EVENT_NAME,
                organizer_id=TEST_ORGANIZER_ID,
                event_code=TEST_EVENT_CODE,
                reg_start=reg_start,
                reg_end=reg_end,
                start_time=event_start,
                end_time=event_end,
                max_capacity=2,
                min_capacity=5
            )
        assert "最大容量不能小于最小容量" in str(excinfo.value)
        
    @patch('logic.EventDAO.get_event_by_location_and_time')
    def test_create_event_location_conflict(self, mock_get_event):
        """测试场地时间冲突"""
        mock_get_event.return_value = [MagicMock()]
        
        with pytest.raises(Exception) as excinfo:
            Activity_Management_Layer.create_event(
                name=TEST_EVENT_NAME,
                organizer_id=TEST_ORGANIZER_ID,
                event_code=TEST_EVENT_CODE,
                reg_start=reg_start,
                reg_end=reg_end,
                start_time=event_start,
                end_time=event_end,
                location=TEST_LOCATION
            )
        assert "已被占用" in str(excinfo.value)
        
    @patch('logic.EventDAO.get_event_by_id')
    @patch('logic.RegistrationDAO.delete_registrations_by_event')
    @patch('logic.EventDAO.delete_event')
    def test_cancel_event_success(self, mock_delete_event, mock_delete_registrations, mock_get_event):
        """测试成功取消未来活动"""
        # 准备测试数据
        future_event = MagicMock()
        future_event.start_time = datetime.now() + timedelta(days=5)  # 未来时间的事件
        deleted_registration_count = 5
        
        # 设置mock返回值
        mock_get_event.return_value = future_event
        mock_delete_registrations.return_value = (True, deleted_registration_count, "成功删除报名记录")
        mock_delete_event.return_value = (True, "成功删除活动")
        
        # 调用被测方法
        result, message = Activity_Management_Layer.cancel_event(TEST_EVENT_ID)
        
        # 验证结果
        assert result is True
        assert deleted_registration_count == 5
        assert "活动取消成功" in message
        
        # 验证mock调用
        mock_get_event.assert_called_once_with(TEST_EVENT_ID)
        mock_delete_registrations.assert_called_once_with(TEST_EVENT_ID)
        mock_delete_event.assert_called_once_with(future_event)
        
    @patch('logic.EventDAO.get_event_by_id')
    def test_cancel_event_not_exist(self, mock_get_event):
        """测试取消不存在的活动"""
        mock_get_event.return_value = None
        
        success, count, msg = Activity_Management_Layer.cancel_event(TEST_EVENT_ID)
        assert success is False
        assert "事件不存在" in msg
        
    @patch('logic.EventDAO.get_event_by_id')
    def test_cancel_event_started(self, mock_get_event):
        """测试取消已开始的活动"""
        mock_event = MagicMock()
        mock_event.start_time = now - timedelta(hours=1)  # 过去时间
        mock_get_event.return_value = mock_event
        
        success, count, msg = Activity_Management_Layer.cancel_event(TEST_EVENT_ID)
        assert success is False
        assert "已开始" in msg

class TestRegistrationExecutionLayer:
    """测试报名执行逻辑"""
    
    @patch('logic.RegistrationDAO.get_registration')
    @patch('logic.RegistrationDAO.create_registration')
    def test_register_for_event_success(self, mock_create, mock_get):
        """测试成功报名活动"""
        mock_get.return_value = None
        mock_create.return_value = (True, "报名成功")
        
        success, msg = Registration_Excution_Layer.register_for_event(TEST_EVENT_ID, TEST_MEMBER_ID)
        assert success is True
        mock_create.assert_called_once_with(TEST_EVENT_ID, TEST_MEMBER_ID)
        
    @patch('logic.RegistrationDAO.get_registration')
    def test_register_for_event_already_registered(self, mock_get):
        """测试重复报名"""
        mock_get.return_value = MagicMock()
        
        success, msg = Registration_Excution_Layer.register_for_event(TEST_EVENT_ID, TEST_MEMBER_ID)
        assert success is False
        assert "已经报名" in msg
        
    @patch('logic.RegistrationDAO.get_registration')
    @patch('logic.RegistrationDAO.delete_registration')
    def test_cancel_registration_success(self, mock_del, mock_get):
        """测试成功取消报名"""
        mock_get.return_value = MagicMock()
        mock_del.return_value = (True, "取消成功")
        
        success, msg = Registration_Excution_Layer.cancel_registration(TEST_EVENT_ID, TEST_MEMBER_ID)
        assert success is True
        mock_del.assert_called_once_with(TEST_EVENT_ID, TEST_MEMBER_ID)
        
    @patch('logic.RegistrationDAO.get_registration')
    def test_cancel_registration_not_registered(self, mock_get):
        """测试取消未报名的活动"""
        mock_get.return_value = None
        
        success, msg = Registration_Excution_Layer.cancel_registration(TEST_EVENT_ID, TEST_MEMBER_ID)
        assert success is False
        assert "尚未报名" in msg
        
    @patch('logic.EventDAO.get_event_by_id')
    @patch('logic.RegistrationDAO.get_registration')
    @patch('logic.ParticipationDAO.get_participation')
    def test_get_user_registration_status(self, mock_get_part, mock_get_reg, mock_get_event):
        """测试获取用户报名状态"""
        # 模拟活动未结束
        mock_event = MagicMock()
        mock_event.reg_end = now + timedelta(days=1)
        mock_get_event.return_value = mock_event
        
        # 测试审核中状态
        mock_get_reg.return_value = MagicMock()
        mock_get_part.return_value = None
        is_reg, msg = Registration_Excution_Layer.get_user_registration_status(TEST_EVENT_ID, TEST_MEMBER_ID)
        assert is_reg is False
        assert "审核中" in msg
        
        # 测试报名成功状态
        mock_get_part.return_value = MagicMock()
        is_reg, msg = Registration_Excution_Layer.get_user_registration_status(TEST_EVENT_ID, TEST_MEMBER_ID)
        assert is_reg is True
        assert "成功" in msg
        
        # 测试未报名状态
        mock_get_reg.return_value = None
        is_reg, msg = Registration_Excution_Layer.get_user_registration_status(TEST_EVENT_ID, TEST_MEMBER_ID)
        assert is_reg is False
        assert "未报名" in msg
        
    @patch('logic.RegistrationDAO.get_registrations_by_event')
    @patch('logic.EventParticipationDAO.create_participation')
    def test_close_registration(self, mock_create, mock_get_regs):
        """测试关闭报名并确定参与者"""
        # 准备模拟数据
        mock_registrations = [MagicMock(registrant_id=f"user_{i}") for i in range(15)]
        mock_get_regs.return_value = mock_registrations
        
        mock_event = MagicMock()
        mock_event.id = TEST_EVENT_ID
        mock_event.capacity = 10
        
        successful, unsuccessful = Registration_Excution_Layer.close_registration(mock_event)
        
        assert len(successful) == 10
        assert len(unsuccessful) == 5
        assert mock_create.call_count == 10
        
    @patch('logic.ParticipationDAO.get_participation')
    @patch('logic.ParticipationDAO.check_in')
    def test_check_in_participant(self, mock_check_in, mock_get_part):
        """测试参与者签到"""
        mock_part = MagicMock()
        mock_get_part.return_value = mock_part
        
        result = Registration_Excution_Layer.check_in_participant(TEST_EVENT_ID, TEST_MEMBER_ID)
        
        assert result == mock_part
        mock_check_in.assert_called_once_with(TEST_EVENT_ID, TEST_MEMBER_ID)
        
    @patch('logic.ParticipationDAO.get_participation')
    def test_check_in_participant_not_participated(self, mock_get_part):
        """测试未参与者签到"""
        mock_get_part.return_value = None
        
        with pytest.raises(ValueError) as excinfo:
            Registration_Excution_Layer.check_in_participant(TEST_EVENT_ID, TEST_MEMBER_ID)
        assert "没有参与" in str(excinfo.value)
        
    @patch('logic.Registration_Excution_Layer.check_in_participant')
    def test_batch_check_in(self, mock_check_in):
        """测试批量签到"""
        mock_check_in.side_effect = [None, ValueError("错误"), None, None]
        
        member_ids = ["user1", "user2", "user3", "user4"]
        success, fail = Registration_Excution_Layer.batch_check_in(TEST_EVENT_ID, member_ids)
        
        assert success == 3
        assert fail == 1
        assert mock_check_in.call_count == 4
