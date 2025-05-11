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

from flask import Blueprint, request, jsonify
from logic import Account_Layer, Activity_Management_Layer, Registration_Excution_Layer

# 创建 Blueprints
api = Blueprint('api', __name__, url_prefix='/api')
auth = Blueprint('auth', __name__, url_prefix='/auth')

# 用户注册
@auth.route('/register', methods=['POST'])
def register_member():
    """用户注册"""
    try:
        data = request.json
        member, message = Account_Layer.register_member(
            id=data.get("id"),
            name=data.get("name"),
            type_id=data.get("type_id"),
            account=data.get("account"),
            password=data.get("password"),
            activation_code=data.get("activation_code"),
        )
        return jsonify({
            "success": True,
            "message": message,
            "data": {
                "id": member.id,
                "name": member.name,
                "account": member.account,
                "type_id": member.type_id,
            }
        }), 201
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 400

# 用户登录
@auth.route('/login', methods=['POST'])
def login():
    """用户登录"""
    data = request.json
    result = Account_Layer.login(
        account=data.get("account"),
        password=data.get("password")
    )
    return jsonify(result)

# 更新用户信息
@auth.route('/update', methods=['PATCH'])
def update_member_info():
    """更新用户信息"""
    try:
        data = request.json
        result = Account_Layer.update_member_info(
            member_id=data.get("member_id"),
            new_password=data.get("new_password"),
            activation_code=data.get("activation_code")
        )
        return jsonify(result)
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 400

# 创建活动
@api.route('/events', methods=['POST'])
def create_event():
    """创建活动"""
    try:
        data = request.json
        event = Activity_Management_Layer.create_event(
            name=data.get("name"),
            organizer_id=data.get("organizer_id"),
            event_code=data.get("event_code"),
            reg_start=data.get("reg_start"),
            reg_end=data.get("reg_end"),
            start_time=data.get("start_time"),
            end_time=data.get("end_time"),
            location=data.get("location"),
            max_capacity=data.get("max_capacity"),
            min_capacity=data.get("min_capacity"),
        )
        return jsonify({
            "success": True,
            "message": "活动创建成功",
            "data": {
                "id": event.id,
                "name": event.name,
                "organizer_id": event.organizer_id,
                "start_time": event.start_time,
                "end_time": event.end_time,
            }
        }), 201
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 400

# 取消活动
@api.route('/events/<int:event_id>', methods=['DELETE'])
def cancel_event(event_id):
    """取消活动"""
    success, message = Activity_Management_Layer.cancel_event(event_id)
    return jsonify({"success": success, "message": message})

# 更新活动
@api.route('/events/<int:event_id>', methods=['PATCH'])
def update_event(event_id):
    """更新活动"""
    try:
        data = request.json
        success, message = Activity_Management_Layer.update_event(event_id, data)
        return jsonify({"success": success, "message": message})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 400

# 报名活动
@api.route('/events/<int:event_id>/register', methods=['POST'])
def register_for_event(event_id):
    """报名活动"""
    try:
        data = request.json
        success, message = Registration_Excution_Layer.register_for_event(
            event_id=event_id,
            registrant_id=data.get("registrant_id")
        )
        return jsonify({"success": success, "message": message})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 400

# 取消报名
@api.route('/events/<int:event_id>/cancel', methods=['POST'])
def cancel_registration(event_id):
    """取消报名"""
    try:
        data = request.json
        success, message = Registration_Excution_Layer.cancel_registration(
            event_id=event_id,
            registrant_id=data.get("registrant_id")
        )
        return jsonify({"success": success, "message": message})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 400

# 获取用户报名状态
@api.route('/events/<int:event_id>/status', methods=['GET'])
def get_user_registration_status(event_id):
    """获取用户报名状态"""
    try:
        registrant_id = request.args.get("registrant_id")
        success, message = Registration_Excution_Layer.get_user_registration_status(
            event_id=event_id,
            registrant_id=registrant_id
        )
        return jsonify({"success": success, "message": message})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 400

# 截止报名
@api.route('/events/<int:event_id>/close', methods=['POST'])
def close_registration(event_id):
    """截止报名"""
    try:
        successful, unsuccessful = Registration_Excution_Layer.close_registration(event_id)
        return jsonify({
            "success": True,
            "message": "报名已截止",
            "data": {
                "successful": successful,
                "unsuccessful": unsuccessful
            }
        })
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 400

# 签到
@api.route('/events/<int:event_id>/checkin', methods=['POST'])
def check_in_participant(event_id):
    """签到"""
    try:
        data = request.json
        Registration_Excution_Layer.check_in_participant(
            event_id=event_id,
            member_id=data.get("member_id")
        )
        return jsonify({"success": True, "message": "签到成功"})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 400

# 批量签到
@api.route('/events/<int:event_id>/batch-checkin', methods=['POST'])
def batch_check_in(event_id):
    """批量签到"""
    try:
        data = request.json
        success_count, fail_count = Registration_Excution_Layer.batch_check_in(
            event_id=event_id,
            member_ids=data.get("member_ids")
        )
        return jsonify({
            "success": True,
            "message": "批量签到完成",
            "data": {
                "success_count": success_count,
                "fail_count": fail_count
            }
        })
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 400

# 提交反馈
@api.route('/events/<int:event_id>/feedback', methods=['POST'])
def submit_feedback(event_id):
    """提交反馈"""
    try:
        data = request.json
        Registration_Excution_Layer.submit_feedback(
            event_id=event_id,
            member_id=data.get("member_id"),
            comment=data.get("comment")
        )
        return jsonify({"success": True, "message": "反馈提交成功"})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 400

# 提交评分
@api.route('/events/<int:event_id>/rating', methods=['POST'])
def submit_rating(event_id):
    """提交评分"""
    try:
        data = request.json
        Registration_Excution_Layer.submit_rating(
            event_id=event_id,
            member_id=data.get("member_id"),
            rating=data.get("rating")
        )
        return jsonify({"success": True, "message": "评分提交成功"})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 400

# 获取活动反馈
@api.route('/events/<int:event_id>/feedbacks', methods=['GET'])
def get_event_feedbacks(event_id):
    """获取活动反馈"""
    try:
        feedbacks = Registration_Excution_Layer.get_event_feedbacks(event_id)
        return jsonify({"success": True, "data": feedbacks})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 400