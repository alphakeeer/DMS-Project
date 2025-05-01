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