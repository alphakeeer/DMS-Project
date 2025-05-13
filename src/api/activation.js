// 模拟激活码数据库
const validCodes = new Set(['ORG2024', 'EVENTMASTER', 'ADMIN123']);

export const activationAPI = {
  validate: async (code) => {
    await new Promise(resolve => setTimeout(resolve, 500)); // 模拟延迟
    return {
      valid: validCodes.has(code.toUpperCase()),
      remaining: validCodes.size
    };
  },
  
  consume: async (code) => {
    if (!validCodes.delete(code.toUpperCase())) {
      throw new Error('激活码无效或已被使用');
    }
    return { success: true };
  }
};