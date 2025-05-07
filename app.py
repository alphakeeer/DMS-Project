"""
app.py — 应用工厂与入口

职责：
  1. 从 config.py 读取环境配置
  2. 初始化 Flask 应用、扩展（SQLAlchemy、JWT 等）
  3. 注册蓝图（routes.py 中定义的 API）  
  4. 提供命令行启动入口

典型工作流程：
  create_app(env="dev") → 配置 app.config → db.init_app(app) → jwt.init_app(app) → app.register_blueprint()
  if __name__=="__main__": create_app().run()
"""
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


def create_app(config_name="dev"):
    """
    创建 Flask 应用实例
    :param config_name: 配置名称（dev / prod /test）
    :return: Flask 应用实例
    """
    app = Flask(__name__)

    # 加载配置
    if config_name == "dev":
        app.config.from_object("config.DevelopmentConfig")
    elif config_name == "prod":
        app.config.from_object("config.ProductionConfig")
    elif config_name == "test":
        app.config.from_object("config.TestingConfig")
    else:
        raise ValueError(f"Unknown config name: {config_name}")

    # 初始化扩展
    db.init_app(app)

    # # 注册蓝图
    # from routes import api_bp
    # app.register_blueprint(api_bp)

    return app
