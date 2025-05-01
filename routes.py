"""
routes.py — HTTP / JSON 接口层

职责：
  • 定义所有 REST API 蓝图（Blueprint）  
    — /api/events, /api/events/<id>/register, /api/events/<id>/checkin, /api/events/<id>/stats, /auth/** 等  
  • 负责参数解析（path, query, JSON body, Header JWT）  
  • 调用 logic.py 中对应函数，并将结果 jsonify 返回  
  • 统一错误处理（可在此处捕获自定义异常并返回标准错误 JSON）

提示：
  • 不要在这里写复杂业务判断  
  • 只处理 HTTP 相关：路由、方法、状态码、请求校验、权限装饰器
"""