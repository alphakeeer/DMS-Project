"""
models.py — ORM 模型层

职责：
  • 定义所有数据库表对应的 SQLAlchemy ORM 类  
   （Organizer、Event、Participant、EventParticipant、ObjectType、Department、Role）
  • 在类内部提供少量工具方法（如 Event.is_full()、User.verify_password() 等）
  • 通过 db = SQLAlchemy() 全局实例与 MySQL 建立映射

提示：
  • 表结构变更时，仅在此处修改字段／约束  
  • 别在这里写复杂业务逻辑或 HTTP 相关代码
"""
from app import db
from sqlalchemy import CheckConstraint, UniqueConstraint, func, PrimaryKeyConstraint
from sqlalchemy.orm import validates
from werkzeug.security import generate_password_hash, check_password_hash
import re


# ──────────────────────────────── 基础表 ────────────────────────────────
class Department(db.Model):
    __tablename__ = "departments"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), unique=True, nullable=False)

    def __repr__(self):
        return f"<Department {self.name}>"


class Role(db.Model):
    __tablename__ = "roles"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), unique=True, nullable=False)

    def __repr__(self):
        return f"<Role {self.name}>"


class ObjectType(db.Model):
    """
    Polymorphic pointer to either Department or Role.
    code ∈ {'department', 'role'} 决定 ref_id 指向哪张表。
    """
    __tablename__ = "object_types"
    __table_args__ = (
        CheckConstraint("code IN ('department','role')",
                        name="chk_object_type_code"),
    )

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    code = db.Column(db.String(20), nullable=False)
    ref_id = db.Column(db.Integer, nullable=False)

    # Optional helpers (只读视图，不加 FK 约束)
    department = db.relationship(
        "Department",
        primaryjoin="and_(ObjectType.code=='department', "
        "foreign(ObjectType.ref_id)==Department.id)",
        viewonly=True,
        uselist=False,
    )
    role = db.relationship(
        "Role",
        primaryjoin="and_(ObjectType.code=='role', "
        "foreign(ObjectType.ref_id)==Role.id)",
        viewonly=True,
        uselist=False,
    )

    def __repr__(self):
        return f"<ObjectType {self.code}:{self.ref_id}>"


# ──────────────────────────────── 成员与权限 ────────────────────────────────
class Member(db.Model):
    __tablename__ = "members"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    type_id = db.Column(db.Integer, db.ForeignKey("object_types.id"))
    can_create_event = db.Column(db.Boolean, default=False)
    account        = db.Column(db.String(20), nullable=False, unique=True)
    password_hash  = db.Column(db.String(512), nullable=False)
    type = db.relationship("ObjectType", backref="members")

    # —— 账号校验：5～20 位，只允许字母/数字/下划线
    @validates('account')
    def validate_account(self, key, account):
        if not re.fullmatch(r'[A-Za-z0-9_]{5,20}', account):
            raise ValueError("账号必须 5～20 位，只能包含字母、数字、下划线")
        return account

    # —— 密码设置：8～32 位，必须有大写、小写、数字、特殊符号
    @property
    def password(self):
        raise AttributeError("密码不可读")

    @password.setter
    def password(self, pwd: str):
        if not (8 <= len(pwd) <= 32):
            raise ValueError("密码长度必须在 8～32 位之间")
        if not re.search(r'[A-Z]', pwd):
            raise ValueError("密码必须包含至少一位大写字母")
        if not re.search(r'[a-z]', pwd):
            raise ValueError("密码必须包含至少一位小写字母")
        if not re.search(r'\d', pwd):
            raise ValueError("密码必须包含至少一位数字")
        # 校验通过后，把明文哈希存到 password_hash
        self.password_hash = generate_password_hash(pwd)

    def check_password(self, pwd: str) -> bool:
        return check_password_hash(self.password_hash, pwd)

    def __repr__(self):
        return f"<Member {self.name}>"


class AccessToken(db.Model):
    __tablename__ = "access_tokens"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    activation_code = db.Column(db.String(32), unique=True, nullable=False)
    owner_id = db.Column(db.Integer, db.ForeignKey(
        "members.id"), nullable=True)

    owner = db.relationship("Member", backref="access_tokens")

    def __repr__(self):
        return f"<AccessToken {self.activation_code[:6]}…>"


# ──────────────────────────────── 活动 ────────────────────────────────
class Event(db.Model):
    __tablename__ = "events"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(200), nullable=False)
    organizer_id = db.Column(
        db.Integer, db.ForeignKey("members.id"), nullable=False)
    reg_start = db.Column(db.DateTime, nullable=False)
    reg_end = db.Column(db.DateTime, nullable=False)
    start_time = db.Column(db.DateTime, nullable=False)
    end_time = db.Column(db.DateTime, nullable=False)
    location = db.Column(db.String(255))
    max_capacity = db.Column(db.Integer)
    min_capacity = db.Column(db.Integer, default=0)
    attendee_count = db.Column(db.Integer, default=0)
    is_successful = db.Column(db.Boolean, default=False)
    description = db.Column(db.Text)

    organizer = db.relationship(
        "Member", backref=db.backref("organized_events", lazy="dynamic")
    )

    def __repr__(self):
        return f"<Event {self.name}>"


# ──────────────────────────────── 关联表 ────────────────────────────────
class EventRegistration(db.Model):
    """
    报名记录：一名 member 对一场 event 唯一。
    """
    __tablename__ = "event_registrations"
    __table_args__ = (
        UniqueConstraint("event_id", "registrant_id",
                         name="uq_event_registrant"),
    )

    event_id = db.Column(db.Integer, db.ForeignKey(
        "events.id"), primary_key=True)
    registrant_id = db.Column(
        db.Integer, db.ForeignKey("members.id"), primary_key=True
    )
    registered_at = db.Column(
        db.DateTime, nullable=False, server_default=func.current_timestamp()
    )

    event = db.relationship("Event", backref="registrations")
    registrant = db.relationship("Member", backref="registrations")

    def __repr__(self):
        return f"<EventRegistration E{self.event_id}-M{self.registrant_id}>"


class EventParticipation(db.Model):
    """
    参与反馈：报名成功并出席后可打分 / 评论。
    """
    __tablename__ = "event_participations"
    __table_args__ = (
        UniqueConstraint("event_id", "participant_id",
                         name="uq_event_participant"),
        CheckConstraint("rating BETWEEN 0 AND 10", name="chk_rating_range"),
    )

    event_id = db.Column(db.Integer, db.ForeignKey(
        "events.id"), primary_key=True)
    participant_id = db.Column(
        db.Integer, db.ForeignKey("members.id"), primary_key=True
    )
    rating = db.Column(db.Integer)
    comment = db.Column(db.Text)
    is_absent = db.Column(db.Boolean, default=False)

    event = db.relationship("Event", backref="participations")
    participant = db.relationship("Member", backref="participations")

    def __repr__(self):
        return f"<EventParticipation E{self.event_id}-M{self.participant_id}>"


class EventAudience(db.Model):
    """
    定义活动面向哪些部门 / 身份。
    """
    __tablename__ = "event_audiences"
    __table_args__ = (
        PrimaryKeyConstraint("event_id", "code", "ref_id"),
        CheckConstraint("code IN ('department','role')",
                        name="chk_audience_code"),
    )

    event_id = db.Column(db.Integer, db.ForeignKey("events.id"))
    code = db.Column(db.String(20))  # 'department' or 'role'
    ref_id = db.Column(db.Integer)

    event = db.relationship("Event", backref="audiences")

    def __repr__(self):
        return f"<EventAudience E{self.event_id} → {self.code}:{self.ref_id}>"
