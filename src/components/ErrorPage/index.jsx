// src/components/ErrorPage/index.jsx
import { Alert, Button, Result } from 'antd'
import { useRouteError, useNavigate } from 'react-router-dom'

export default function ErrorPage() {
  const error = useRouteError()
  const navigate = useNavigate()

  // 获取错误状态码
  const status = error.status || 500
  const message = error.data?.message || error.message

  // 处理不同错误类型
  const errorConfig = {
    401: {
      title: "未授权访问",
      subTitle: "请登录后查看此页面",
      extra: <Button type="primary" onClick={() => navigate('/login')}>前往登录</Button>
    },
    403: {
      title: "禁止访问",
      subTitle: "您没有权限访问此内容",
      extra: <Button type="primary" onClick={() => navigate('/')}>返回首页</Button>
    },
    404: {
      title: "页面未找到",
      subTitle: "您访问的页面不存在",
      extra: <Button type="primary" onClick={() => navigate('/')}>返回首页</Button>
    },
    500: {
      title: "服务器错误",
      subTitle: "服务器遇到意外错误，请稍后再试",
      extra: <Button type="primary" onClick={() => window.location.reload()}>刷新页面</Button>
    }
  }

  return (
    <div className="error-page" style={{ maxWidth: 800, margin: '40px auto' }}>
      {status in errorConfig ? (
        <Result
          status={status === 401 ? 'warning' : 'error'}
          title={errorConfig[status].title}
          subTitle={errorConfig[status].subTitle}
          extra={errorConfig[status].extra}
        />
      ) : (
        <Result
          status="error"
          title="未知错误"
          subTitle="发生未预期的错误，请联系技术支持"
          extra={
            <Button type="primary" onClick={() => navigate('/')}>
              返回首页
            </Button>
          }
        />
      )}

      {import.meta.env.DEV && (
        <Alert
          type="info"
          message="开发调试信息"
          description={
            <pre style={{ whiteSpace: 'pre-wrap' }}>
              {JSON.stringify(error, null, 2)}
            </pre>
          }
          style={{ marginTop: 20 }}
        />
      )}
    </div>
  )
}