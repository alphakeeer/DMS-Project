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