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