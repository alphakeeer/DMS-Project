"""
tests.py — 单元 & 集成测试

职责：
  • 使用 pytest 编写关键路径测试用例  
    — test_register_full(): 名额已满时应失败  
    — test_duplicate_register(): 重复报名应返回错误  
    — test_attendance_rate(): 签到后统计正确  
  • 在 CI 中自动执行，保证核心功能不被破坏

提示：
  • 测试只 import logic.py 或 dao.py，不依赖 HTTP  
  • 使用临时 SQLite 或测试库，并在每个测试前后清理环境
"""