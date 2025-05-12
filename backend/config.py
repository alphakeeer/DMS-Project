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

# config.py — 环境配置中心

import os


class BaseConfig:
    """
    基础配置（所有环境共享）
    """
    # SQLAlchemy 配置：关闭事件监听以减少开销
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # 分页默认大小，用于 list endpoints
    PAGE_SIZE = 20

    # CORS、日志等公共配置也可以放在这里
    # CORS_ORIGINS = ["*"]
    # LOG_LEVEL = "INFO"


class DevelopmentConfig(BaseConfig):
    """
    开发环境配置
    """
    DEBUG = True
    TESTING = False

    # 本地 MySQL，用户名/密码/主机/端口/数据库名，可按需修改
    SQLALCHEMY_DATABASE_URI = (
        "mysql+pymysql://user:pass@127.0.0.1:3306/school_events"
        "?charset=utf8mb4"
    )

    # JWT 用的签名密钥，开发环境可硬编码
    JWT_SECRET_KEY = "dev-secret-key"


class ProductionConfig(BaseConfig):
    """
    生产环境配置
    """
    DEBUG = False
    TESTING = False

    # 从环境变量读取，确保安全
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL",
        "mysql+pymysql://user:pass@db:3306/school_events?charset=utf8mb4"
    )

    # 强烈建议在部署时通过环境变量注入
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")


class TestingConfig(BaseConfig):
    """
    测试环境配置
    """
    DEBUG = False
    TESTING = True

    # 单元测试时使用内存 SQLite，速度更快，无需外部依赖
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"

    # 测试密钥，可固定
    JWT_SECRET_KEY = "test-secret-key"


# 映射名称到配置类
config_map = {
    "dev": DevelopmentConfig,
    "prod": ProductionConfig,
    "test": TestingConfig,
}


def get_config(name: str):
    """
    工厂方法：根据传入名称返回对应的 Config 类

    参数:
        name (str): "dev", "prod" 或 "test"
    返回:
        对应的 Config 类（不是实例），可直接用于 Flask 的 from_object
    """
    return config_map.get(name, DevelopmentConfig)
