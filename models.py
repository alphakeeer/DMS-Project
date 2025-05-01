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