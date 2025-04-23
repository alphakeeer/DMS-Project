import mysql.connector
from mysql.connector import Error
import getpass
import re

def get_connection():
    """Create a database connection to the MySQL database."""
    try:
        host = "localhost"
        port = 3306
        user = input("Enter database username: ")
        password = getpass.getpass("Enter database password: ")

        connection = mysql.connector.connect(
            host=host,
            port=port,
            user=user,
            password=password,
            charset='utf8mb4',
        )
        if connection.is_connected():
            print("Connection successful")
            return connection
    except Error as e:
        print(f"Error: {e}")
        return None

def execute_sql_file(cursor, conn, filepath):
    """
    手动解析 .sql 文件中的 DELIMITER，然后逐条执行每段 SQL：
      1. 跳过以 -- 或 # 开头的整行注释
      2. 按当前 delimiter 拆分
      3. 用普通 cursor.execute() 执行每条语句
    """
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    statements = []
    delim = ';'
    buffer = []

    for raw_line in lines:
        stripped = raw_line.strip()
        if not stripped or stripped.startswith('--') or stripped.startswith('#'):
            continue

        m = re.match(r'^DELIMITER\s+(.+)$', stripped, re.IGNORECASE)
        if m:
            if buffer:
                stmt = ''.join(buffer).strip()
                if stmt:
                    statements.append(stmt)
                buffer = []
            delim = m.group(1)
            continue

        buffer.append(raw_line)
        if stripped.endswith(delim):
            stmt = ''.join(buffer).rstrip()
            stmt = stmt[: -len(delim)].strip()
            if stmt:
                statements.append(stmt)
            buffer = []

    if buffer:
        stmt = ''.join(buffer).strip()
        if stmt:
            statements.append(stmt)

    try:
        for stmt in statements:
            cursor.execute(stmt)
        conn.commit()
    except Error:
        conn.rollback()
        raise

def main():
    conn = get_connection()
    if conn is None:
        print("Failed to connect to the database")
        return

    cursor = None
    try:
        cursor = conn.cursor()
        execute_sql_file(cursor, conn, "school_event.sql")
        print("Database and tables created successfully.")
    except Error as e:
        print(f"MySQL 错误：{e}")
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()
        print("Connection closed")

if __name__ == "__main__":
    main()