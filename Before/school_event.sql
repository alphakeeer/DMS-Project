-- ============================================================
-- School event management schema
-- Tested on MySQL (InnoDB, utf8mb4)
-- ============================================================

-- 创建数据库，并指定默认字符集为 utf8mb4，排序规则为 utf8mb4_0900_ai_ci
CREATE DATABASE IF NOT EXISTS school_events
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_0900_ai_ci;
USE school_events;

-- 删除所有表，按外键依赖顺序
DROP TABLE IF EXISTS event_audience;
DROP TABLE IF EXISTS event_participant;
DROP TABLE IF EXISTS event;
DROP TABLE IF EXISTS participant;
DROP TABLE IF EXISTS organizer;
DROP TABLE IF EXISTS role;
DROP TABLE IF EXISTS department;
DROP TABLE IF EXISTS object_type;

-- -----------------------------
-- 1. object_type 表：存放“面向对象”类型
-- -----------------------------
CREATE TABLE object_type (
  type_id INT AUTO_INCREMENT PRIMARY KEY,    -- 自增主键
  code    VARCHAR(50)  NOT NULL UNIQUE,     -- 业务码，如 'DEPARTMENT','ROLE'
  name    VARCHAR(100) NOT NULL              -- 可读名称，如 'Department','Role'
) ENGINE=InnoDB;

-- -----------------------------
-- 2. department 表：存放部门信息
-- -----------------------------
CREATE TABLE department (
  dept_id INT AUTO_INCREMENT PRIMARY KEY,    -- 部门自增 ID
  name    VARCHAR(100) NOT NULL              -- 部门名称
) ENGINE=InnoDB;

-- -----------------------------
-- 3. role 表：存放身份/角色信息
-- -----------------------------
CREATE TABLE role (
  role_id INT AUTO_INCREMENT PRIMARY KEY,    -- 角色自增 ID
  name    VARCHAR(100) NOT NULL              -- 角色名称
) ENGINE=InnoDB;

-- -----------------------------
-- 4. organizer 表：活动组织者
-- -----------------------------
CREATE TABLE organizer (
  organizer_id VARCHAR(50) PRIMARY KEY,      -- 组织者业务 ID
  name         VARCHAR(100) NOT NULL,        -- 组织者名称
  type_id      INT NOT NULL,                 -- 组织者类型，外键引用 object_type.type_id
  CONSTRAINT fk_organizer_type
    FOREIGN KEY (type_id) REFERENCES object_type(type_id)
) ENGINE=InnoDB;

-- -----------------------------
-- 5. participant 表：活动参与者
-- -----------------------------
CREATE TABLE participant (
  participant_id VARCHAR(50) PRIMARY KEY,    -- 参与者业务 ID
  name           VARCHAR(100) NOT NULL,      -- 参与者姓名
  type_id        INT NOT NULL,               -- 参与者类型，外键引用 object_type.type_id
  CONSTRAINT fk_participant_type
    FOREIGN KEY (type_id) REFERENCES object_type(type_id)
) ENGINE=InnoDB;

-- -----------------------------
-- 6. event 表：活动主表
-- -----------------------------
CREATE TABLE event (
  event_id                VARCHAR(50) PRIMARY KEY,   -- 活动业务 ID
  name                    VARCHAR(200) NOT NULL,     -- 活动名称
  organizer_id            VARCHAR(50) NOT NULL,      -- 组织者，外键引用 organizer.organizer_id
  registration_start_time DATETIME,                   -- 报名开始时间
  registration_end_time   DATETIME,                   -- 报名结束时间
  event_start_time        DATETIME,                   -- 活动开始时间
  event_end_time          DATETIME,                   -- 活动结束时间
  location                VARCHAR(200),               -- 活动地点
  min_capacity            INT  NOT NULL CHECK (min_capacity >= 0),                 -- 最小容量
  max_capacity            INT  NOT NULL,      -- 最大容量
  actual_attendance       INT  DEFAULT 0,             -- 实际出席人数
  -- 生成列：当 actual_attendance ≥ min_capacity 时，活动视为成功
  is_successful           BOOLEAN
    GENERATED ALWAYS AS (actual_attendance >= min_capacity) STORED,
  CONSTRAINT fk_event_organizer
    FOREIGN KEY (organizer_id) REFERENCES organizer(organizer_id)
) ENGINE=InnoDB;

-- -----------------------------
-- 7. event_participant 表：报名记录
-- -----------------------------
CREATE TABLE event_participant (
  event_id               VARCHAR(50) NOT NULL,      -- 活动 ID，外键
  participant_id         VARCHAR(50) NOT NULL,      -- 参与者 ID，外键
  feedback               TEXT,                      -- 反馈意见
  attendance             BOOLEAN,                   -- 到场标记：TRUE=到场，FALSE=缺席
  actual_registration_time DATETIME,                 -- 实际报名时间
  PRIMARY KEY (event_id, participant_id),
  CONSTRAINT fk_ep_event
    FOREIGN KEY (event_id)       REFERENCES event(event_id)       ON DELETE CASCADE,
  CONSTRAINT fk_ep_participant
    FOREIGN KEY (participant_id) REFERENCES participant(participant_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------
-- 8. event_audience 表：活动面向对象（多对多）
-- -----------------------------
CREATE TABLE event_audience (
  event_id VARCHAR(50) NOT NULL,        -- 活动 ID，外键
  code     VARCHAR(50) NOT NULL,        -- 对象类型码，外键引用 object_type.code
  ref_id   INT         NOT NULL,        -- 指向 department.dept_id 或 role.role_id
  PRIMARY KEY (event_id, code, ref_id),
  CONSTRAINT fk_ea_event
    FOREIGN KEY (event_id) REFERENCES event(event_id) ON DELETE CASCADE,
  CONSTRAINT fk_ea_code
    FOREIGN KEY (code)    REFERENCES object_type(code)
) ENGINE=InnoDB;

-- -----------------------------
-- 触发器：插入/更新前校验 event_audience.ref_id 合法性
-- 如果 code='DEPARTMENT'，则 ref_id 必须在 department 表中存在
-- 如果 code='ROLE'，则 ref_id 必须在 role 表中存在
-- 否则抛错
-- -----------------------------
DELIMITER //

CREATE TRIGGER trg_ea_before_insert
BEFORE INSERT ON event_audience
FOR EACH ROW
BEGIN
  IF NEW.code = 'DEPARTMENT' THEN
      IF NOT EXISTS (SELECT 1 FROM department WHERE dept_id = NEW.ref_id) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid department ref_id';
      END IF;
  ELSEIF NEW.code = 'ROLE' THEN
      IF NOT EXISTS (SELECT 1 FROM role WHERE role_id = NEW.ref_id) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid role ref_id';
      END IF;
  ELSE
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Unknown code in event_audience';
  END IF;
END//

CREATE TRIGGER trg_ea_before_update
BEFORE UPDATE ON event_audience
FOR EACH ROW
BEGIN
  IF NEW.code = 'DEPARTMENT' THEN
      IF NOT EXISTS (SELECT 1 FROM department WHERE dept_id = NEW.ref_id) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid department ref_id';
      END IF;
  ELSEIF NEW.code = 'ROLE' THEN
      IF NOT EXISTS (SELECT 1 FROM role WHERE role_id = NEW.ref_id) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid role ref_id';
      END IF;
  ELSE
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Unknown code in event_audience';
  END IF;
END//

DELIMITER ;

-- -----------------------------
-- 可选索引：加速常用查询
-- -----------------------------
-- 按活动开始时间查
CREATE INDEX idx_event_dates
  ON event (event_start_time);

-- 按参与者类型查
CREATE INDEX idx_participant_type
  ON participant (type_id);

-- 按面向对象类型和 ID 查
CREATE INDEX idx_ea_code_ref
  ON event_audience (code, ref_id);