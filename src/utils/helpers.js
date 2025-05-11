import dayjs from 'dayjs'

// 日期格式化工具
export const formatDateTime = (date, format = 'YYYY-MM-DD HH:mm') => {
  return dayjs(date).isValid() ? dayjs(date).format(format) : '无效日期'
}

// 文件大小格式化
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 权限检查工具
export const checkPermission = (userRoles, allowedRoles) => {
  return userRoles.some(role => allowedRoles.includes(role))
}

// 对象空值过滤
export const filterEmptyValues = (obj) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v !== null && v !== undefined)
  )
}