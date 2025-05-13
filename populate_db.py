# 文件：scripts/populate_db.py
from app import db
from models import (
    Department, Role, ObjectType,
    Member, AccessToken,
    Event, EventRegistration,
    EventParticipation, EventAudience
)
from faker import Faker
import random
from datetime import datetime, timedelta

fake = Faker()

def gen_departments(n=10):
    names = {fake.company() for _ in range(n*2)}
    deps = [Department(name=name) for name in list(names)[:n]]
    db.session.add_all(deps)
    db.session.commit()
    return deps

def gen_roles(n=5):
    names = {fake.job() for _ in range(n*2)}
    roles = [Role(name=name) for name in list(names)[:n]]
    db.session.add_all(roles)
    db.session.commit()
    return roles

def gen_object_types(deps, roles):
    ots = []
    for d in deps:
        ots.append(ObjectType(code="department", ref_id=d.id))
    for r in roles:
        ots.append(ObjectType(code="role", ref_id=r.id))
    db.session.add_all(ots)
    db.session.commit()
    return ots

#################################

def gen_members(ots, count=50):
    import re  # 添加正则表达式模块
    members = []
    for _ in range(count):
        raw_account = fake.unique.user_name()
        # 清除非字母、数字、下划线的字符
        valid_account = re.sub(r'\W', '', raw_account)
        # 如果长度不足5，则补充
        if len(valid_account) < 5:
            valid_account += "user"
        valid_account = valid_account[:20]  # 保证不超过20位
        m = Member(
            name=fake.name(),
            account=valid_account,
            can_create_event=fake.boolean(chance_of_getting_true=30),
            type_id=random.choice(ots).id
        )
        # 设置复杂密码
        pwd = fake.password(
            length=random.randint(10, 16),
            special_chars=True, digits=True, upper_case=True, lower_case=True
        )
        m.password = pwd
        members.append(m)
    db.session.add_all(members)
    db.session.commit()
    return members

def gen_access_tokens(members):
    tokens = []
    for m in members:
        tokens.append(AccessToken(
            activation_code=fake.uuid4().replace('-', '')[:32],
            owner_id=m.id if m.can_create_event else None
        ))
    db.session.add_all(tokens)
    db.session.commit()
    return tokens

def gen_events(members, count=20):
    organizers = [m for m in members if m.can_create_event]
    events = []
    now = datetime.now()
    for _ in range(count):
        org = random.choice(organizers)
        start = now + timedelta(days=random.randint(1, 60), hours=random.randint(0,23))
        end = start + timedelta(hours=random.randint(1,6))
        reg_start = start - timedelta(days=random.randint(10, 20))
        reg_end = start - timedelta(days=random.randint(1, 9))
        e = Event(
            name=fake.sentence(nb_words=3),
            organizer_id=org.id,
            reg_start=reg_start,
            reg_end=reg_end,
            start_time=start,
            end_time=end,
            location=fake.address(),
            max_capacity=random.randint(10, 50),
            min_capacity=random.randint(0, 10),
            description=fake.text(max_nb_chars=200),
        )
        events.append(e)
    db.session.add_all(events)
    db.session.commit()
    return events

def gen_registrations(events, members):
    regs = []
    for e in events:
        cap = e.max_capacity
        # 至少 min_capacity 人报名，最多 cap 人
        num = random.randint(e.min_capacity, cap)
        regs_for_e = random.sample(members, num)
        # 计算 e.reg_start 与 e.reg_end 之间的总秒数差
        seconds_diff = int((e.reg_end - e.reg_start).total_seconds())
        for m in regs_for_e:
            reg_time = e.reg_start + timedelta(seconds=random.randint(0, seconds_diff))
            regs.append(EventRegistration(
                event_id=e.id,
                registrant_id=m.id,
                registered_at=reg_time
            ))
    db.session.add_all(regs)
    db.session.commit()
    return regs

# def gen_participations(regs):
#     parts = []
#     for r in regs:
#         absent = fake.boolean(chance_of_getting_true=20)
#         if absent:
#             p = EventParticipation(
#                 event_id=r.event_id,
#                 participant_id=r.registrant_id,
#                 is_absent=True
#             )
#         else:
#             p = EventParticipation(
#                 event_id=r.event_id,
#                 participant_id=r.registrant_id,
#                 rating=random.randint(0, 10),
#                 comment=fake.sentence(),
#                 is_absent=False
#             )
#         parts.append(p)
#     db.session.add_all(parts)
#     db.session.commit()
#     return parts

def gen_audiences(events, deps, roles):
    auds = []
    for e in events:
        # 每个 event 随机 1-3 个 audience
        picks = []
        all_items = [("department", d.id) for d in deps] + [("role", r.id) for r in roles]
        for code, rid in random.sample(all_items, k=random.randint(1, 3)):
            auds.append(EventAudience(
                event_id=e.id,
                code=code,
                ref_id=rid
            ))
    db.session.add_all(auds)
    db.session.commit()
    return auds

def gen_data():
    deps   = gen_departments()
    roles  = gen_roles()
    ots    = gen_object_types(deps, roles)
    mems   = gen_members(ots)
    toks   = gen_access_tokens(mems)
    evs    = gen_events(mems)
    regs   = gen_registrations(evs, mems)
    # parts  = gen_participations(regs)
    auds   = gen_audiences(evs, deps, roles)
    print("数据生成完毕！")
