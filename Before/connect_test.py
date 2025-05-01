import mysql.connector
from mysql.connector import Error
import getpass


def get_connection():
    """Create a database connection to the MySQL database specified by user input."""
    try:
        host = "localhost"
        port = 3306
        user = input("Enter database username: ")
        password = getpass.getpass("Enter database password: ")
        database = "school_events"

        connection = mysql.connector.connect(
            host=host,
            port=port,
            user=user,
            password=password,
            database=database,
            charset='utf8mb4',
        )
        if connection.is_connected():
            print("Connection successful")
            return connection
    except Error as e:
        print(f"Error: {e}")
        return None


def safe_execute(func):
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)   # 用 dict 形式返回行
        func(cursor, conn)
    except Error as e:
        print("MySQL 错误：", e)
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


def add_department(cursor, conn, name):
    """向 department 表插入一条记录，并打印新 dept_id。"""
    sql = "INSERT INTO department (name) VALUES (%s)"
    cursor.execute(sql, (name,))
    conn.commit()
    print(name+"的 dept_id =", cursor.lastrowid)


def fetch_departments(cursor):
    """从 department 表中读取所有记录并打印。"""
    try:
        # 执行查询
        sql = "SELECT * FROM department"
        cursor.execute(sql)

        # 获取所有结果
        results = cursor.fetchall()

        # 打印结果
        print("Departments:")
        for row in results:
            print(row)
    except Error as e:
        print(f"Error while fetching departments: {e}")


def fetch_departments(cursor):
    """从 department 表中读取所有记录并打印。"""
    try:
        # 执行查询
        sql = "SELECT * FROM department"
        cursor.execute(sql)

        # 获取所有结果
        results = cursor.fetchall()

        # 打印结果
        print("Departments:")
        for row in results:
            print(row)
    except Error as e:
        print(f"Error while fetching departments: {e}")


def truncate_all_tables(cursor, conn):
    """Truncate all tables in the current database."""
    try:
        # 查询所有表名
        cursor.execute("SHOW TABLES;")
        tables = cursor.fetchall()

        # 禁用外键约束
        cursor.execute("SET FOREIGN_KEY_CHECKS = 0;")

        # 遍历所有表并执行 TRUNCATE
        for table in tables:
            table_name = table['Tables_in_school_events']  # 替换为你的数据库名
            cursor.execute(f"TRUNCATE TABLE `{table_name}`;")
            print(f"Truncated table: {table_name}")

        # 启用外键约束
        cursor.execute("SET FOREIGN_KEY_CHECKS = 1;")

        conn.commit()
        print("All tables truncated successfully.")
    except Error as e:
        print(f"Error while truncating tables: {e}")


def main():
    conn = get_connection()
    if conn is None:
        print("Failed to connect to the database")
        return

    cursor = None
    try:
        cursor = conn.cursor(dictionary=True)
        # 在此处调用插入操作，你可以多次调用不同操作
        add_department(cursor, conn, "学生会")
        # 如果还想插入其它部门，继续调用：
        add_department(cursor, conn, "文艺部")
        fetch_departments(cursor)  # 打印所有部门
        truncate_all_tables(cursor, conn)  # 清空所有表
    except Error as e:
        print("MySQL 错误：", e)
    finally:
        # 统一关闭资源
        if cursor:
            cursor.close()
        conn.close()
        print("Connection closed")


if __name__ == "__main__":
    main()
