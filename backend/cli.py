"""
cli.py — 命令行工具集

职责：
  • 提供初始化 / 运维命令给开发 & 运维使用  
    — flask --app cli.py init-db     创建所有表  
    — flask --app cli.py seed         生成假数据  
    — flask --app cli.py export       导出活动统计或名单  
  • 通过 Flask CLI decorator 绑定命令

提示：
  • 任何一次性数据库操作都写到这里  
  • 保持命令幂等性：init-db 可重复执行不会报错
"""

import click
from flask.cli import with_appcontext
from sqlalchemy import text, inspect

from app import create_app, db
from models import Member

app = create_app()

@app.cli.command('init-db')
@with_appcontext
def init_db():
    """创建所有表（也就是 models.py 里定义的表）"""
    click.echo('>>> 正在创建表 …')
    db.create_all()
    click.echo('>>> 表创建完毕')

@app.cli.command('test-conn')
@with_appcontext
def test_conn():
    """测试能否连通数据库并列出当前表"""
    try:
        # 测试连通
        db.session.execute(text('SELECT 1'))
        click.echo('✅ 数据库连接正常')
        # 用 Inspector 列出所有表名
        inspector = inspect(db.engine)
        tables = inspector.get_table_names()
        if tables:
            click.echo(f'当前存在的表：{", ".join(tables)}')
        else:
            click.echo('当前没有任何表')
    except Exception as e:
        click.echo(f'❌ 连接失败：{e}')
        
@app.cli.command('reset-db')
@with_appcontext
def reset_db():
    """删除所有表并重新创建，危险操作，请谨慎使用"""
    click.echo('>>> 正在删除所有表 …')
    db.drop_all()       # 删除当前 metadata 下所有表
    click.echo('>>> 所有表已删除')
    click.echo('>>> 正在重新创建表 …')
    db.create_all()     # 根据 models 再次创建表
    click.echo('>>> 表已重置完成')
