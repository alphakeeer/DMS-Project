# Simple Event App

## 📐 架构一览（抽象理解）

HTTP ─▶ routes.py ─▶ logic.py ─▶ dao.py ─▶ models.py ─▶ MySQL


**层 关键词**

| 层      | 关键词         | 只处理什么               | 不处理什么                 |
| ------- | -------------- | ------------------------ | --------------------------- |
| routes  | Flask 蓝图     | URL ↔ JSON               | 业务判断、ORM 语句          |
| logic   | 业务编排       | 时间窗 / 名额 / 权限     | 组装 JSON、拼 SQL           |
| dao     | 原子 CRUD      | db.session 的增删改查    | 业务规则、HTTP 参数         |
| models  | ORM 映射       | 表结构 + 简单工具方法    | 跨表事务、HTTP 东西         |
| config  | 环境变量       | 数据库 URI / 秘钥…       | 其它所有                   |

> 结论：任何变动（UI、业务、数据库）只影响相邻 1 层，其余代码零改动。

---

## 📂 目录树（项目根）


``` plaintext
simple_event_app/
├── app.py          # 应用工厂 + 入口
├── config.py       # dev/prod 测试配置
├── models.py       # 所有 ORM 类
├── dao.py          # 原子数据库操作
├── logic.py        # 报名 / 签到 / 统计
├── routes.py       # REST API
├── cli.py          # init-db / seed / export
├── tests.py        # pytest 用例
├── templates/      # 可选：Jinja2 HTML
└── static/         # CSS / JS / 图片
```
---

## 🗂️ 每个文件的职责 & 关键接口（详细说明）

| 文件       | 主要内容                                   | 依赖                          | 核心函数 / 类（✅=组员更改概率高）           |
| ---------- | ------------------------------------------ | ----------------------------- | ------------------------------------------- |
| **app.py**   | 1. create_app(env) 初始化 Flask<br>2. 注册蓝图 & JWT & SQLAlchemy | config、routes、models        | `create_app`                              |
| **config.py**| DevCfg / ProdCfg 中写 URI、JWT、分页…       | 无                            | `get(name) -> BaseCfg`                    |
| **models.py**| ORM：Organizer、Event、Participant、EventParticipant … | app.py 初始化的 db            | ✅ 字段、`is_full()`                       |
| **dao.py**   | 单表或单事务操作：add_registration、drop_registration… | models、db                    | ✅ CRUD 函数                              |
| **logic.py** | 组合业务：校验时间窗→调 dao→返回 dict       | dao                           | ✅ `register` / `cancel` / `check_in` / `event_stats` |
| **routes.py**| HTTP 端点：解析参数→调 logic→jsonify        | logic、JWT                    | ✅ `@bp.post("/events/<id>/register")` 等 |
| **cli.py**   | 命令：init-db / seed / export               | app.py、dao、logic            | `init_db()`, `seed()`, `export()`         |
| **tests.py** | Pytest：边界/并发/统计三个场景               | logic、dao                    | `test_*` 函数                             |
| **templates/**| 若走服务器渲染就放 Jinja2；否则为空         | routes                        | `events.html`                            |
| **static/**  | 前端资源或打包产物                         | templates                     | —                                         |

---

## 🏃 典型调用链（一次报名）

1. 客户端发送 `POST /api/events/EV123/register`
2. `routes.reg()` 获取 JWT → user_id，调用 `logic.register(user_id, "EV123")`
3. `logic.register()`：
   - 调用 `dao.get_event("EV123")`
   - 判断时间窗 / 名额
   - 成功则调用 `dao.add_registration(user_id, "EV123")`
4. `dao.add_registration()` → `db.session.add()` → MySQL INSERT
5. 向上层返回 `{"status":"ok"}` → `routes.reg()` → `jsonify` 发回客户端

---

## 🔗 连 MySQL 的固定入口

```python
# config.py
SQLALCHEMY_DATABASE_URI = (
    "mysql+pymysql://<user>:<pwd>@<host>:3306/eventdb?charset=utf8mb4"
)
```

•	唯一改动点：如果数据库地址 / 密码变化，只改这里。
•	其余层拿的是 app.config[...]，无需关心底层驱动。


# 启动服务（默认 dev）
python app.py
# 访问 http://127.0.0.1:5000/api/events
