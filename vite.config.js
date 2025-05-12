// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import svgr from 'vite-plugin-svgr' // 处理SVG图标

// export default defineConfig({
//   plugins: [react({
//     babel: {
//       plugins: [['import', { 
//         libraryName: 'antd',
//         style: 'css' 
//       }]]
//     }
//   })],
//   resolve: {
//     alias: {
//       '@': '/src', // 路径别名
//       '@assets': '/src/assets'
//     }
//   },
//   server: {
//     proxy: { // API代理
//       '/api': {
//         target: 'http://localhost:3000',
//         changeOrigin: true
//       }
//     }
//   }
// })
// // vite.config.js 添加配置



// vite.config.js
// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     host: true, // 允许外部访问
//     open: true  // 自动打开浏览器
//   }
// })



import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'), // 配置别名
    },
  },
  server: {
    host: true, // 允许外部访问
    open: true,  // 自动打开浏览器
  },
});