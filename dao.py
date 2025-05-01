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