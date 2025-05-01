"""
config.py — 环境配置中心

职责：
  • 定义 BaseCfg、DevCfg、ProdCfg 等配置类
  • 指定数据库 URI、JWT 密钥、分页大小等全局参数
  • 提供 get(name:str) 工厂方法，供 app.py 调用

常见字段：
  SQLALCHEMY_DATABASE_URI
  SQLALCHEMY_TRACK_MODIFICATIONS
  JWT_SECRET_KEY
  DEBUG / TESTING
  PAGE_SIZE
"""